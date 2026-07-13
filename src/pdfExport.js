import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// A4 at 96dpi — the intrinsic size of .preview-page.
const A4_W = 794;
const A4_H = 1123;

// Pull the family names actually in use from the CV page's CSS variables
// (e.g. "'Playfair Display', serif" -> "Playfair Display").
function activeFamilies(page) {
  const cs = getComputedStyle(page);
  const fams = new Set();
  for (const varName of ['--cv-heading', '--cv-body']) {
    const raw = cs.getPropertyValue(varName);
    const first = raw.split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (first) fams.add(first);
  }
  return fams;
}

const faceMatchesFamily = (cssText, families) => {
  const m = cssText.match(/font-family:\s*(["']?)([^;"']+)\1/i);
  if (!m) return false;
  return families.has(m[2].trim());
};

// Build a self-contained @font-face CSS string covering only the fonts the CV
// currently uses. Same-origin sheets (our local Hebrew faces) are read from
// the CSSOM; cross-origin sheets (Google Fonts) can't be read that way, so we
// fetch their text instead — avoiding the SecurityError html-to-image hits and
// keeping the export fast by skipping every unused face.
async function buildFontEmbedCSS(families) {
  const blocks = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules = null;
    try { rules = sheet.cssRules; } catch { rules = null; }
    if (rules) {
      for (const r of Array.from(rules)) {
        if (r.constructor?.name === 'CSSFontFaceRule' || r.type === 5) {
          if (faceMatchesFamily(r.cssText, families)) blocks.push(r.cssText);
        }
      }
    } else if (sheet.href) {
      try {
        const text = await (await fetch(sheet.href, { mode: 'cors' })).text();
        const faces = text.match(/@font-face\s*{[^}]*}/gi) || [];
        for (const face of faces) if (faceMatchesFamily(face, families)) blocks.push(face);
      } catch { /* offline / blocked — local faces still cover Hebrew */ }
    }
  }
  return blocks.join('\n');
}

// Render the CV page to a real, downloadable PDF that matches the preview
// pixel-for-pixel (fonts, RTL, colors and all). We capture .preview-page
// directly, so the on-screen zoom (which lives on the parent .preview-stage)
// and all editor chrome are excluded.
export async function exportPdf(filename = 'cv.pdf') {
  const page = document.querySelector('.preview-page');
  if (!page) throw new Error('preview page not found');

  document.body.setAttribute('data-exporting', 'true');
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const fontEmbedCSS = await buildFontEmbedCSS(activeFamilies(page));
    const dataUrl = await toPng(page, {
      width: A4_W,
      height: A4_H,
      pixelRatio: 3,               // crisp text on retina + when zoomed in a viewer
      backgroundColor: '#ffffff',
      cacheBust: true,
      fontEmbedCSS,                // pre-resolved: no cross-origin CSSOM reads
      style: { transform: 'none', margin: '0' },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, 'PNG', 0, 0, pw, ph, undefined, 'FAST');
    pdf.save(filename);
  } finally {
    document.body.removeAttribute('data-exporting');
  }
}
