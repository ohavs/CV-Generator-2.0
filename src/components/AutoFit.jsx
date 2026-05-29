import { useRef, useState, useLayoutEffect, useCallback } from 'react';

// A4 at 96dpi: 210mm = 794px, 297mm = 1122.5px. Reserve 1px of height so the
// hard overflow:hidden clip on .preview-page can never shave a real pixel.
const PAGE_W = 794;
const PAGE_H = 1122;

/**
 * AutoFit guarantees the CV always fits on exactly one A4 page.
 *
 * It measures the template's natural layout height and applies a uniform
 * `transform: scale()` so the rendered height never exceeds the page:
 *
 *   scale = min(fontScale, PAGE_H / naturalHeight)
 *
 * Why transform (not zoom): a CSS transform is applied *after* layout, so it
 * never changes the measured element's `scrollHeight`. That makes the
 * measurement completely stable and impossible to feed back into a resize
 * loop — which is what caused the earlier flicker. In print the transform is
 * rendered at the printer's DPI, so the output stays crisp and one page.
 */
export default function AutoFit({ fontScale = 1, deps = [], children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(fontScale);

  const compute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const natural = el.scrollHeight; // stable: transforms don't affect layout
    if (!natural) return;
    const fit = PAGE_H / natural;
    const next = Math.min(fontScale, fit);
    setScale(prev => (Math.abs(prev - next) > 0.001 ? next : prev));
  }, [fontScale]);

  useLayoutEffect(() => {
    compute();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    // Late-loading web fonts can change metrics — recompute when they settle.
    if (document.fonts?.ready) document.fonts.ready.then(compute).catch(() => {});
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compute, ...deps]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        ref={ref}
        style={{
          width: PAGE_W,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
