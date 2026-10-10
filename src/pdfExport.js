import { jsPDF } from 'jspdf';

// A4 at 96dpi — the intrinsic size of .preview-page.
const A4_W = 794;
const A4_H = 1123;
const PIXEL_RATIO = 3; // crisp text on retina + when zoomed in a viewer

/*
 * The PDF is a picture of the page, taken by letting the browser lay the page
 * out a second time inside an SVG <foreignObject>. Two things make that
 * second layout identical to the one on screen:
 *
 *  1. The same stylesheets. We copy the app's CSS rules (not each element's
 *     computed style — freezing every box at its on-screen width is what made
 *     text spill over its neighbours whenever a glyph came out wider).
 *  2. The same fonts. An SVG drawn as an image may not fetch anything, so a
 *     font referenced by URL silently falls back to a system font with
 *     different widths. Every face the page uses is inlined as a data: URL.
 */

const GENERIC_FAMILIES = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong',
  '-apple-system', 'blinkmacsystemfont',
]);

const normFamily = (f) => f.trim().replace(/^["']|["']$/g, '').trim().toLowerCase();

// Every family named anywhere in the page's font stacks — fallbacks included,
// since a Hebrew glyph in a Latin-only heading font is drawn by the next one.
function usedFamilies(page) {
  const fams = new Set();
  for (const el of [page, ...page.querySelectorAll('*')]) {
    for (const f of getComputedStyle(el).fontFamily.split(',')) {
      const n = normFamily(f);
      if (n && !GENERIC_FAMILIES.has(n)) fams.add(n);
    }
  }
  return fams;
}

function usedCodePoints(text) {
  const set = new Set();
  for (const ch of text) set.add(ch.codePointAt(0));
  // Upper-cased section titles draw capitals the source text may not contain.
  for (const ch of text.toUpperCase()) set.add(ch.codePointAt(0));
  return set;
}

// "U+0590-05FF, U+20AA, U+4??" → [[0x590,0x5FF],[0x20AA,0x20AA],[0x400,0x4FF]]
function parseUnicodeRange(value) {
  if (!value) return null;
  return value.split(',').map(tok => {
    const t = tok.trim().replace(/^u\+/i, '');
    if (t.includes('?')) return [parseInt(t.replace(/\?/g, '0'), 16), parseInt(t.replace(/\?/g, 'F'), 16)];
    const [a, b] = t.split('-');
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  }).filter(([a, b]) => !Number.isNaN(a) && !Number.isNaN(b));
}

function rangeHits(ranges, codePoints) {
  if (!ranges) return true;
  for (const cp of codePoints) {
    for (const [a, b] of ranges) if (cp >= a && cp <= b) return true;
  }
  return false;
}

const declValue = (cssText, prop) => {
  const m = cssText.match(new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, 'i'));
  return m ? m[1].trim() : '';
};

const dataUrlCache = new Map();
function fetchAsDataUrl(url) {
  if (!dataUrlCache.has(url)) {
    const p = fetch(url, { cache: 'force-cache' })
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${url}`); return r.blob(); })
      .then(blob => new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      }));
    p.catch(() => dataUrlCache.delete(url)); // let a later export retry
    dataUrlCache.set(url, p);
  }
  return dataUrlCache.get(url);
}

// Rewrite one @font-face so its src is the font file itself.
async function inlineFace(faceText, baseUrl) {
  const src = declValue(faceText, 'src');
  const m = src.match(/url\(\s*(['"]?)(.*?)\1\s*\)(\s*format\(\s*(['"]?)(.*?)\4\s*\))?/i);
  if (!m) return null;
  if (m[2].startsWith('data:')) return faceText;
  const abs = new URL(m[2], baseUrl).href;
  const data = await fetchAsDataUrl(abs);
  const fmt = m[5] ? ` format("${m[5]}")` : '';
  return faceText.replace(/src\s*:\s*[^;}]+/i, `src: url("${data}")${fmt}`);
}

// Same-origin sheets are read rule by rule; cross-origin ones (Google Fonts)
// can't be, so their text is fetched and only the @font-face blocks are kept.
async function collectCss(families, codePoints) {
  const rules = [];
  const faces = []; // { text, base }

  const walk = (list, base) => {
    for (const r of Array.from(list)) {
      if (r.type === CSSRule.FONT_FACE_RULE) {
        faces.push({ text: r.cssText, base });
      } else if (r.type === CSSRule.MEDIA_RULE) {
        // The image is laid out in an A4-sized viewport, so media queries
        // would answer differently than they do on screen — resolve them now.
        if (window.matchMedia(r.conditionText ?? r.media.mediaText).matches) walk(r.cssRules, base);
      } else if (r.type === CSSRule.IMPORT_RULE) {
        try { if (r.styleSheet) walk(r.styleSheet.cssRules, r.styleSheet.href || base); } catch { /* cross-origin */ }
      } else {
        rules.push(r.cssText);
      }
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    const base = sheet.href || location.href;
    let list = null;
    try { list = sheet.cssRules; } catch { list = null; }
    if (list) { walk(list, base); continue; }
    if (!sheet.href) continue;
    try {
      const text = await (await fetch(sheet.href, { mode: 'cors', cache: 'force-cache' })).text();
      for (const f of text.match(/@font-face\s*{[^}]*}/gi) || []) faces.push({ text: f, base: sheet.href });
    } catch { /* offline — nothing more we can embed from this sheet */ }
  }

  const wanted = faces.filter(({ text }) =>
    families.has(normFamily(declValue(text, 'font-family'))) &&
    rangeHits(parseUnicodeRange(declValue(text, 'unicode-range')), codePoints));

  const inlined = await Promise.all(wanted.map(f => inlineFace(f.text, f.base).catch(() => null)));
  return { faceCss: inlined.filter(Boolean).join('\n'), ruleCss: rules.join('\n') };
}

// Editor-only rules keyed on body[data-exporting] apply to the export root.
const EXPORT_CSS = `
.cv-export .preview-page { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; }
.cv-export .bullet-add, .cv-export .array-remove, .cv-export [data-add-inline],
.cv-export .photo-remove, .cv-export .photo-slot[data-empty="true"] { display: none !important; }
.cv-export [data-editable]::before { content: none !important; }
.cv-export [data-editable] { background: transparent !important; box-shadow: none !important; outline: none !important; }
`;

const INHERITED = [
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'color',
  'letter-spacing', 'word-spacing', 'text-transform', 'direction', 'font-variant',
  'font-feature-settings', 'text-rendering', '-webkit-font-smoothing',
];

function customProps(page, cssText) {
  const names = new Set(cssText.match(/--[\w-]+/g) || []);
  for (const el of [page, ...page.querySelectorAll('[style]')]) {
    for (const n of el.getAttribute('style')?.match(/--[\w-]+/g) || []) names.add(n);
  }
  const cs = getComputedStyle(page);
  return [...names]
    .map(n => [n, cs.getPropertyValue(n).trim()])
    .filter(([, v]) => v);
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('page image failed to load'));
    img.src = url;
  });
}

const isSafari = typeof navigator !== 'undefined'
  && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

/** Rasterise .preview-page exactly as laid out on screen. Returns a canvas. */
export async function renderPageCanvas(page = document.querySelector('.preview-page'), pixelRatio = PIXEL_RATIO) {
  if (!page) throw new Error('preview page not found');
  await document.fonts?.ready;

  const clone = page.cloneNode(true);
  clone.querySelectorAll('input, script').forEach(n => n.remove());

  const families = usedFamilies(page);
  const codePoints = usedCodePoints(page.textContent || '');
  const { faceCss, ruleCss } = await collectCss(families, codePoints);
  const css = (ruleCss + EXPORT_CSS).replace(/body\[data-exporting\]/g, '.cv-export');

  const root = document.createElement('div');
  root.className = 'cv-export';
  const parentStyle = getComputedStyle(page.parentElement || page);
  const decl = INHERITED.map(p => `${p}:${parentStyle.getPropertyValue(p)}`);
  for (const [n, v] of customProps(page, css)) decl.push(`${n}:${v}`);
  decl.push(`width:${A4_W}px`, `height:${A4_H}px`, 'overflow:hidden', 'background:#fff');
  root.setAttribute('style', decl.join(';'));

  const style = document.createElement('style');
  style.textContent = faceCss + '\n' + css;
  root.appendChild(style);
  root.appendChild(clone);

  const xhtml = new XMLSerializer().serializeToString(root);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${A4_W}" height="${A4_H}" viewBox="0 0 ${A4_W} ${A4_H}">`
    + `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject></svg>`;
  const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  try { await img.decode?.(); } catch { /* onload already fired */ }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(A4_W * pixelRatio);
  canvas.height = Math.round(A4_H * pixelRatio);
  const ctx = canvas.getContext('2d');
  const draw = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  draw();
  // Safari decodes the embedded fonts lazily: the first draw can come out in
  // a fallback face. Drawing again once they're in fixes it.
  if (isSafari) {
    for (let i = 0; i < 2; i++) {
      await new Promise(r => setTimeout(r, 120));
      draw();
    }
  }
  return canvas;
}

// Render the CV page to a real, downloadable PDF that matches the preview.
export async function exportPdf(filename = 'cv.pdf') {
  const canvas = await renderPageCanvas();
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, ph, undefined, 'FAST');
  pdf.save(filename);
}
