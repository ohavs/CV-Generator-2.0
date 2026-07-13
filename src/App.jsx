import { useState, useEffect, useRef, useLayoutEffect, useCallback, useReducer } from 'react';
import { DEFAULT_STATE, FONT_PRESETS, I18N } from './data.js';
import { pruneLangData } from './entryUtils.js';
import { TemplateRoot } from './templates/index.jsx';
import Sidebar from './sidebar/Sidebar.jsx';
import AutoFit from './components/AutoFit.jsx';
import MobileEditBar from './components/MobileEditBar.jsx';
import { useIsMobile } from './components/Editable.jsx';
import Icon from './components/Icon.jsx';

const STORAGE_KEY = 'koroth_cv_state_v1';
const perfNow = () => (typeof performance !== 'undefined' ? performance.now() : 0);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      data: { ...DEFAULT_STATE.data, ...(parsed.data || {}) },
    };
  } catch (e) {
    return DEFAULT_STATE;
  }
}

function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  next[head] = setIn(obj?.[head] ?? (typeof rest[0] === 'number' ? [] : {}), rest, value);
  return next;
}

// Signature of what changed between two states at the top level — lets rapid
// changes to the same control (e.g. dragging the font-size slider) coalesce
// into a single undo step instead of one per pixel.
function changedKeys(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const diff = [];
  for (const k of keys) if (a[k] !== b[k]) diff.push(k);
  return diff.length ? diff.sort().join(',') : null;
}

export default function App() {
  const [state, setStateRaw] = useState(() => loadState());
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [autoZoom, setAutoZoom] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const saveTimerRef = useRef(null);
  const pruneTimerRef = useRef(null);

  // stateRef mirrors the live state so history/commit logic can read the
  // freshest value without stale closures — and without doing side effects
  // inside a functional updater (which React StrictMode double-invokes).
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; });

  const persist = useCallback((next, delay = 500) => {
    clearTimeout(saveTimerRef.current);
    setSaving(true);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      setSaving(false);
    }, delay);
  }, []);

  // The one place state is actually written. Updates the mirror eagerly so the
  // next change/undo reads this value even before React re-renders.
  const commit = useCallback((next, saveDelay) => {
    stateRef.current = next;
    setStateRaw(next);
    persist(next, saveDelay);
  }, [persist]);

  /* ---- Undo / redo history ---------------------------------------------- */
  const historyRef = useRef({ past: [], future: [], lastKey: null, lastAt: 0 });
  const [, bumpHist] = useReducer((x) => x + 1, 0);

  const pushPast = useCallback((prev, coalesceKey) => {
    const h = historyRef.current;
    const now = perfNow();
    const coalesce = coalesceKey && h.lastKey === coalesceKey && (now - h.lastAt) < 700;
    if (!coalesce) {
      h.past.push(prev);
      if (h.past.length > 120) h.past.shift();
      h.future = [];
      bumpHist();
    }
    h.lastKey = coalesceKey ?? null;
    h.lastAt = now;
  }, []);

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (!h.past.length) return;
    // Flush any in-progress caret edit first so it becomes its own step.
    const ae = document.activeElement;
    if (ae && ae.isContentEditable) ae.blur();
    if (!h.past.length) return;
    const prev = h.past.pop();
    h.future.push(stateRef.current);
    h.lastKey = null;
    commit(prev);
    bumpHist();
  }, [commit]);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (!h.future.length) return;
    const next = h.future.pop();
    h.past.push(stateRef.current);
    h.lastKey = null;
    commit(next);
    bumpHist();
  }, [commit]);

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  /* ---- State mutations (all record history) ----------------------------- */
  // Sidebar / design controls hand us a fully-formed next state.
  const setState = useCallback((next) => {
    const prev = stateRef.current;
    pushPast(prev, 'set:' + (changedKeys(prev, next) || 'all'));
    commit(next);
  }, [pushPast, commit]);

  // Inline field edits from the templates.
  const onEdit = useCallback((path, value) => {
    const prev = stateRef.current;
    const lang = prev.language;
    const next = { ...prev, data: { ...prev.data, [lang]: setIn(prev.data[lang], path, value) } };
    // Inline edits commit on blur (or Done on mobile) — each is a complete,
    // deliberate change, so every one is its own undo step (no coalescing).
    pushPast(prev, null);
    commit(next);
    schedulePrune();
  }, [pushPast, commit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Remove empty entries / blank bullet lines / abandoned links — but only
  // once the user has finished editing: no contenteditable focused, and the
  // mobile edit bar closed. Automatic cleanup is intentionally NOT an undo
  // step (undoing to restore a blank row the user abandoned is just noise).
  const schedulePrune = useCallback(() => {
    clearTimeout(pruneTimerRef.current);
    pruneTimerRef.current = setTimeout(() => {
      if (document.activeElement?.isContentEditable) return;          // caret editing
      if (document.body.hasAttribute('data-mobile-editing')) return;  // edit bar open
      const prev = stateRef.current;
      const lang = prev.language;
      const cleaned = pruneLangData(prev.data[lang]);
      if (!cleaned) return;
      // Pruning is a settled action — persist immediately (like the old path)
      // so a quick app close can't lose the cleanup.
      commit({ ...prev, data: { ...prev.data, [lang]: cleaned } }, 0);
    }, 250);
  }, [commit]);

  const data = state.data[state.language];
  const fontPreset = FONT_PRESETS.find(f => f.id === state.fontPreset) || FONT_PRESETS[0];

  const isMobile = useIsMobile();

  // When the mobile edit bar closes (commit or cancel), clean up leftovers.
  useEffect(() => {
    window.addEventListener('cv-edit-closed', schedulePrune);
    return () => window.removeEventListener('cv-edit-closed', schedulePrune);
  }, [schedulePrune]);

  // After adding an item from the sidebar (or when blocked on an existing
  // empty one): close the sheet, scroll the preview to that section, and open
  // its first unfilled field — no hunting for where the new item landed.
  const jumpToSection = useCallback((key) => {
    setMobileOpen(false);
    setTimeout(() => {
      const section = document.querySelector(`.preview-page [data-section="${key}"]`)
        || document.querySelector('.preview-page');
      if (!section) return;
      const editables = [...section.querySelectorAll('[data-editable]')];
      let lastFilled = -1;
      editables.forEach((el, i) => { if (el.getAttribute('data-empty') !== 'true') lastFilled = i; });
      const target = editables.slice(lastFilled + 1).find(el => el.getAttribute('data-empty') === 'true')
        || editables.find(el => el.getAttribute('data-empty') === 'true');
      (target || section).scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (!target) return;
      setTimeout(() => { if (isMobile) target.click(); else target.focus(); }, 380);
    }, 200);
  }, [isMobile]);

  /* Scale-to-fit */
  const previewAreaRef = useRef(null);

  useLayoutEffect(() => {
    const compute = () => {
      const area = previewAreaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const padX = window.innerWidth <= 900 ? 24 : 80;
      const padY = 80;
      const pageW = 794;
      const pageH = 1123;
      const availW = rect.width - padX;
      const availH = rect.height - padY;
      const scale = Math.min(availW / pageW, availH / pageH);
      setAutoZoom(Math.max(0.2, Math.min(scale, 1.5)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (previewAreaRef.current) ro.observe(previewAreaRef.current);
    window.addEventListener('resize', compute);
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); };
  }, []);

  const effectiveZoom = zoom != null ? zoom : autoZoom;

  const stageStyle = effectiveZoom <= 1
    ? { zoom: effectiveZoom }
    : { transform: `scale(${effectiveZoom})`, transformOrigin: 'center center' };

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Lazy-loaded so jsPDF + html-to-image stay out of the initial bundle.
      const { exportPdf } = await import('./pdfExport.js');
      const base = (data?.name || (state.language === 'he' ? 'קורות-חיים' : 'cv')).trim().replace(/\s+/g, '-');
      await exportPdf(`${base || 'cv'}.pdf`);
    } catch (e) {
      // If canvas capture fails for any reason, fall back to the print dialog.
      window.print();
    } finally {
      setExporting(false);
    }
  }, [exporting, data, state.language]);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
        return;
      }
      if (mod && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); redo(); return; }
      if (mod && e.key === 'p') { e.preventDefault(); handleExport(); }
      if (mod && e.key === '=') { e.preventDefault(); setZoom(z => Math.min(2, (z || autoZoom) + 0.1)); }
      if (mod && e.key === '-') { e.preventDefault(); setZoom(z => Math.max(0.2, (z || autoZoom) - 0.1)); }
      if (mod && e.key === '0') { e.preventDefault(); setZoom(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoZoom, undo, redo, handleExport]);

  return (
    <div
      className="app"
      data-editor-theme={state.darkEdit ? 'dark' : 'light'}
      style={{
        '--accent': state.accent,
        '--cv-heading': fontPreset.heading,
        '--cv-body': fontPreset.body,
      }}
    >
      <div className="preview-area" ref={previewAreaRef}>
        <div
          className="preview-stage"
          style={stageStyle}
        >
          <div
            className="preview-page"
            onBlur={schedulePrune}
            style={{
              '--cv-heading': fontPreset.heading,
              '--cv-body': fontPreset.body,
            }}
          >
            <AutoFit
              fontScale={state.fontScale ?? 1}
              deps={[state.template, state.language, state.sections, state.accent, state.fontPreset]}
            >
              <TemplateRoot
                template={state.template}
                data={data}
                accent={state.accent}
                lang={state.language}
                sections={state.sections}
                onEdit={onEdit}
              />
            </AutoFit>
          </div>
        </div>

        <MobileEditBar lang={state.language}/>

        <div className="history-badge">
          <button onClick={undo} disabled={!canUndo} title={state.language === 'he' ? 'בטל (Ctrl+Z)' : 'Undo (Ctrl+Z)'}>
            <Icon name="undo" size={15}/>
          </button>
          <button onClick={redo} disabled={!canRedo} title={state.language === 'he' ? 'בצע שוב (Ctrl+Shift+Z)' : 'Redo (Ctrl+Shift+Z)'}>
            <Icon name="redo" size={15}/>
          </button>
        </div>

        <div className="zoom-badge">
          <button onClick={() => setZoom(z => Math.max(0.2, (z || autoZoom) - 0.1))} title="Zoom out">
            <Icon name="minus" size={13}/>
          </button>
          <button className="zoom-value" onClick={() => setZoom(null)}>
            {Math.round(effectiveZoom * 100)}%
          </button>
          <button onClick={() => setZoom(z => Math.min(2, (z || autoZoom) + 0.1))} title="Zoom in">
            <Icon name="plus" size={13}/>
          </button>
        </div>

        <button className="mobile-cta" onClick={() => setMobileOpen(true)}>
          <Icon name="sliders" size={14}/>
          {state.language === 'he' ? 'עריכה ועיצוב' : 'Edit & design'}
        </button>
      </div>

      <div className="sheet-backdrop" data-open={mobileOpen} onClick={() => setMobileOpen(false)}/>

      <Sidebar
        state={state}
        setState={setState}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onExport={handleExport}
        exporting={exporting}
        onAddJump={jumpToSection}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        saving={saving}
      />
    </div>
  );
}
