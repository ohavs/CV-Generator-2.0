#!/usr/bin/env node
// Renders every template through a matrix of content and design settings in
// a real browser and fails if any text collides with other text, leaves the
// page, spills out of its column, or comes out at an unintended size — and,
// with --export, if the downloaded PDF would differ from the screen.
//
//   npm run check:layout                      # full matrix
//   npm run check:layout -- --only=charter    # one template
//   npm run check:layout -- --export          # also compare the PDF render
//
// Needs a Chromium for Playwright (`npx playwright install chromium`), or
// CHROMIUM_PATH pointing at one.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { DEFAULT_STATE, TEMPLATES } from '../src/data.js';
import { VARIANTS } from './layout-fixtures.mjs';
import { SETTINGS } from './layout-settings.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const only = args.only ? String(args.only).split(',') : null;
const outDir = resolve(root, 'layout-report');
const CONCURRENCY = Number(args.jobs || 4);

// template × language × (content variant, design setting)
const COMBOS = [
  ['demo', 'default'], ['long', 'default'], ['stress', 'default'], ['sparse', 'default'],
  ['demo', 'wide-font'], ['long', 'mono-font'],
  ...Object.keys(SETTINGS).filter(s => !['default', 'wide-font', 'mono-font', 'showcase'].includes(s)).map(s => ['long', s]),
  ['demo', 'max-text'], ['stress', 'max-text'], ['sparse', 'long-titles'],
];
// The PDF is compared with the screen for these (it's the slow part).
const EXPORT_COMBOS = new Set(['long/default', 'long/mixed', 'long/max-text', 'long/display']);

function buildState(template, lang, variant, setting) {
  const { data, sections } = VARIANTS[variant](lang);
  const state = {
    ...structuredClone(DEFAULT_STATE),
    template, language: lang, sections,
    data: { ...structuredClone(DEFAULT_STATE.data), [lang]: data },
  };
  return SETTINGS[setting](state);
}

// Runs inside the page. Coordinates are page px (the 794×1123 A4 sheet).
function analyze() {
  const page = document.querySelector('.preview-page');
  const pr = page.getBoundingClientRect();
  const k = pr.width / 794;
  const toPage = (q) => ({ x: (q.left - pr.left) / k, y: (q.top - pr.top) / k, w: q.width / k, h: q.height / k });
  const issues = [];
  const boxes = [];
  // Editing chrome (the photo's remove button hangs off its corner on
  // purpose) is not part of the document being measured.
  const chrome = document.createElement('style');
  chrome.textContent = '.photo-remove, .bullet-add { display: none !important; }';
  document.head.appendChild(chrome);
  const HEADING = 'h1, h2, h3, [data-cv-heading]';

  const clipParent = (el) => {
    for (let p = el.parentElement; p && p !== page; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') return p;
    }
    return page;
  };

  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
  let owner = 0;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.data.trim()) continue;
    const el = n.parentElement;
    if (!el || el.closest('.bullet-add, .photo-remove, style, script')) continue;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize);
    const text = n.data.trim().slice(0, 48);
    // A size someone chose (set on the element or a block inside the
    // template) is deliberate; one that only arrives from the template root or
    // beyond is a default the template never meant for this text.
    let sizedBy = null;
    for (let p = el; p && !p.hasAttribute('data-template'); p = p.parentElement) {
      if (p.style.fontSize) { sizedBy = p; break; }
    }
    const deliberate = sizedBy && !sizedBy.parentElement?.hasAttribute('data-template');
    if (!deliberate && !el.closest(HEADING) && fontSize > 15.5) {
      issues.push({ kind: 'oversized-text', text, detail: `${fontSize}px body text — inherits a size the template never set` });
    }
    const range = document.createRange();
    range.selectNodeContents(n);
    const clip = toPage(clipParent(el).getBoundingClientRect());
    [...range.getClientRects()].forEach((q, line) => {
      if (q.width < 0.5 || q.height < 0.5) return;
      const b = { ...toPage(q), owner, line, text };
      boxes.push(b);
      const out = b.x < clip.x - 1 || b.x + b.w > clip.x + clip.w + 1 || b.y < clip.y - 1 || b.y + b.h > clip.y + clip.h + 1;
      if (out) issues.push({ kind: 'clipped', text, detail: `line ${line + 1} at ${b.x.toFixed(0)},${b.y.toFixed(0)} leaves its box` });
    });
    owner++;
  }

  // Text against text. Line boxes of consecutive lines may graze each other
  // when line-height is tight; what counts is a real share of the glyphs.
  boxes.sort((a, b) => a.y - b.y);
  for (let i = 0; i < boxes.length; i++) {
    const a = boxes[i];
    for (let j = i + 1; j < boxes.length && boxes[j].y < a.y + a.h; j++) {
      const b = boxes[j];
      if (a.owner === b.owner && a.line === b.line) continue;
      const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ix > 1.5 && iy > 0.4 * Math.min(a.h, b.h)) {
        issues.push({ kind: 'overlap', text: a.text, detail: `collides with "${b.text}" (${ix.toFixed(0)}×${iy.toFixed(0)}px)` });
      }
    }
  }

  // Text against the photo.
  for (const slot of page.querySelectorAll('.photo-slot[data-empty="false"]')) {
    const p = toPage(slot.getBoundingClientRect());
    for (const b of boxes) {
      const ix = Math.min(p.x + p.w, b.x + b.w) - Math.max(p.x, b.x);
      const iy = Math.min(p.y + p.h, b.y + b.h) - Math.max(p.y, b.y);
      if (ix > 1 && iy > 1) issues.push({ kind: 'overlap', text: b.text, detail: 'drawn over the photo' });
    }
  }

  // Blocks whose content is wider than they are: an unbreakable word pushing
  // past its column into the next one (or off the page). Only the innermost
  // such block is reported — its ancestors spill because it does.
  const spilling = [...page.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el);
    if (cs.display.startsWith('inline') || cs.display === 'contents' || cs.overflowX !== 'visible') return false;
    return el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && el.textContent.trim();
  });
  for (const el of spilling) {
    if (spilling.some(other => other !== el && el.contains(other))) continue;
    issues.push({ kind: 'spill', text: el.textContent.trim().slice(0, 48), detail: `content ${el.scrollWidth}px in a ${el.clientWidth}px box` });
  }

  chrome.remove();
  const fit = document.querySelector('[data-autofit]');
  const scale = fit ? Number(fit.getAttribute('data-autofit')) : 1;
  // Deduplicate: one broken row tends to report once per line it touches.
  const seen = new Set();
  return {
    scale,
    issues: issues.filter(i => { const key = i.kind + i.text + i.detail; if (seen.has(key)) return false; seen.add(key); return true; }),
  };
}

// Runs inside the page: how much of the PDF render differs from a screenshot.
// Both are shrunk 4× first, so anti-aliasing noise drops out and what's left
// is text that moved, wrapped differently or changed font.
async function exportDiff(screenshotB64) {
  const page = document.querySelector('.preview-page');
  const { renderPageCanvas } = await import('/src/pdfExport.js');
  const pdf = await renderPageCanvas(page, 1);
  const shot = await createImageBitmap(await (await fetch('data:image/png;base64,' + screenshotB64)).blob());
  const shrink = (src, w, h) => {
    let cur = src, cw = w, ch = h;
    for (let i = 0; i < 2; i++) {
      const c = document.createElement('canvas');
      c.width = Math.round(cw / 2); c.height = Math.round(ch / 2);
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, c.width, c.height);
      cur = c; cw = c.width; ch = c.height;
    }
    return cur.getContext('2d').getImageData(0, 0, cw, ch);
  };
  const h = Math.min(pdf.height, shot.height);
  const A = shrink(shot, pdf.width, h), B = shrink(pdf, pdf.width, h);
  const lum = (d, i) => d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
  // A pixel matches if the other image has it within one (shrunken) pixel:
  // rules and baselines may round to a neighbouring row.
  let diff = 0;
  for (let y = 0; y < A.height; y++) {
    for (let x = 0; x < A.width; x++) {
      const la = lum(A.data, (y * A.width + x) * 4);
      let best = 255;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const yy = y + dy, xx = x + dx;
          if (yy < 0 || xx < 0 || yy >= B.height || xx >= B.width) continue;
          best = Math.min(best, Math.abs(la - lum(B.data, (yy * B.width + xx) * 4)));
        }
      }
      if (best > 48) diff++;
    }
  }
  return diff / (A.width * A.height);
}

async function runOne(browser, base, job) {
  const { template, lang, variant, setting } = job;
  const state = buildState(template, lang, variant, setting);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1300 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((s) => {
    localStorage.setItem('koroth_cv_docs_v1', JSON.stringify({ activeId: 'check', docs: [{ id: 'check', name: 'check', updatedAt: 0, state: s }] }));
  }, state);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto(base);
    await page.waitForSelector(`[data-template="${template}"] [data-section]`, { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    // Look at the page at 1:1 so measurements are in page px.
    await page.evaluate(() => {
      const s = document.querySelector('.preview-stage');
      s.style.transition = 'none'; s.style.zoom = '1'; s.style.transform = 'none';
    });
    await page.waitForTimeout(350); // AutoFit settles after fonts + resize
    const result = await page.evaluate(analyze);
    for (const e of errors) result.issues.push({ kind: 'script-error', text: '', detail: e });
    if (args.export && EXPORT_COMBOS.has(`${variant}/${setting}`)) {
      const shot = await page.locator('.preview-page').screenshot();
      const ratio = await page.evaluate(exportDiff, shot.toString('base64'));
      if (ratio > 0.006) result.issues.push({ kind: 'export-drift', text: '', detail: `${(ratio * 100).toFixed(2)}% of the PDF differs from the screen` });
    }
    if (result.issues.length) {
      mkdirSync(outDir, { recursive: true });
      await page.locator('.preview-page').screenshot({ path: resolve(outDir, `${template}-${lang}-${variant}-${setting}.png`) });
    }
    return result;
  } catch (e) {
    return { scale: 0, issues: [{ kind: 'failed', text: '', detail: e.message.split('\n')[0] }] };
  } finally {
    await ctx.close();
  }
}

const server = await createServer({ root, logLevel: 'error', server: { port: 0, host: '127.0.0.1' } });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const jobs = [];
for (const { id: template } of TEMPLATES) {
  if (only && !only.includes(template)) continue;
  for (const lang of ['he', 'en']) {
    for (const [variant, setting] of COMBOS) jobs.push({ template, lang, variant, setting });
  }
}

const results = [];
let next = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    const r = await runOne(browser, base, job);
    results.push({ ...job, ...r });
    process.stdout.write(r.issues.length ? 'x' : '.');
  }
}));
process.stdout.write('\n');
await browser.close();
await server.close();

results.sort((a, b) => (a.template + a.lang + a.variant + a.setting).localeCompare(b.template + b.lang + b.variant + b.setting));
const failed = results.filter(r => r.issues.length);
for (const r of failed) {
  console.log(`\n✗ ${r.template} · ${r.lang} · ${r.variant} · ${r.setting}  (fit ${Math.round(r.scale * 100)}%)`);
  for (const i of r.issues.slice(0, 12)) console.log(`   ${i.kind.padEnd(14)} ${i.text ? `"${i.text}" ` : ''}${i.detail}`);
  if (r.issues.length > 12) console.log(`   … and ${r.issues.length - 12} more`);
}
const tiny = results.filter(r => r.scale && r.scale < 0.6 && r.variant !== 'stress');
for (const r of tiny) console.log(`\n! ${r.template} · ${r.lang} · ${r.variant} · ${r.setting} shrinks to ${Math.round(r.scale * 100)}% to fit`);

if (failed.length) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'report.json'), JSON.stringify(failed, null, 2));
}
console.log(`\n${results.length - failed.length}/${results.length} renders clean${failed.length ? ` — screenshots in ${outDir}` : ''}`);
process.exit(failed.length ? 1 : 0);
