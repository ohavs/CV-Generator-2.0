import { useRef, useLayoutEffect, useCallback } from 'react';

// A4 at 96dpi: 210mm = 794px, 297mm = 1122.5px. Reserve 1px of height so the
// hard overflow:hidden clip on .preview-page can never shave a real pixel.
const PAGE_W = 794;
const PAGE_H = 1122;
// Never a floor that would cut content off: past this point the text is far
// too small to read anyway, and the design panel says so.
const MIN_FIT = 0.1;

/**
 * AutoFit guarantees the CV always fits on exactly one A4 page.
 *
 * When the content is taller than a page, the whole layout is scaled down by
 * `s` — but first laid out `1/s` times wider, so after scaling it still spans
 * the full page width. Lines get longer instead of margins getting wider,
 * which keeps the text as large as the content allows. The largest `s` that
 * fits is found by measuring (binary search), all inside one layout pass.
 *
 * Text size is not this component's business: the design controls zoom the
 * sections themselves, and AutoFit only ever shrinks.
 *
 * Width, transform, --fit (the scale, which page margins divide by so they
 * stay the same size on paper) and --page-h (the page height in layout px,
 * for templates whose background must reach the bottom edge) are written to
 * the DOM directly, in the same pass as the measurement, so the screen never
 * shows a frame where one has changed and the other hasn't.
 *
 * It re-fits whenever the page's DOM changes (typing, a commit, a design
 * change — all mutations) or a web font finishes loading. A ResizeObserver
 * would also see the resizes made while measuring, and report a loop.
 */
export default function AutoFit({ deps = [], onScale, children }) {
  const ref = useRef(null);
  const scaleRef = useRef(1);

  const compute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--page-h', '0px'); // measure the content, not the min-height
    const fits = (s) => {
      el.style.width = `${PAGE_W / s}px`;
      el.style.setProperty('--fit', String(s));
      return el.scrollHeight * s <= PAGE_H;
    };

    let s = scaleRef.current;
    if (!fits(s)) {
      // Shrink: the answer lies below the current scale.
      let lo = MIN_FIT, hi = s;
      for (let i = 0; i < 11; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
      s = lo;
    } else if (s < 1 && fits(Math.min(1, s + 0.004))) {
      // Room to grow back (content got shorter).
      let lo = s, hi = 1;
      if (fits(1)) lo = 1;
      else for (let i = 0; i < 9; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
      s = lo;
    }
    s = Math.round(s * 1000) / 1000;

    el.style.width = `${PAGE_W / s}px`;
    el.style.setProperty('--fit', String(s));
    el.style.transform = `scale(${s})`;
    el.style.setProperty('--page-h', `${PAGE_H / s}px`);
    el.dataset.autofit = s.toFixed(3);
    if (s !== scaleRef.current) {
      scaleRef.current = s;
      onScale?.(s);
    }
  }, [onScale]);

  useLayoutEffect(() => {
    compute();
    const el = ref.current;
    if (!el) return;
    const mo = new MutationObserver((records) => {
      // Our own writes to the wrapper's style are not content changes.
      if (records.some(r => r.target !== el)) compute();
    });
    mo.observe(el, { subtree: true, childList: true, characterData: true, attributes: true });
    // Late-loading web fonts change metrics without touching the DOM.
    const fonts = document.fonts;
    fonts?.ready.then(compute).catch(() => {});
    fonts?.addEventListener?.('loadingdone', compute);
    return () => { mo.disconnect(); fonts?.removeEventListener?.('loadingdone', compute); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compute, ...deps]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', direction: 'ltr' }}>
      <div ref={ref} style={{ transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  );
}
