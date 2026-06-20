import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { DEFAULT_STATE, FONT_PRESETS, I18N } from './data.js';
import { ENTRY_KEYS, entryEmpty } from './entryUtils.js';
import { TemplateRoot } from './templates/index.jsx';
import Sidebar from './sidebar/Sidebar.jsx';
import AiPopover from './components/AiPopover.jsx';
import AutoFit from './components/AutoFit.jsx';
import Icon from './components/Icon.jsx';

const STORAGE_KEY = 'koroth_cv_state_v1';

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

export default function App() {
  const [state, setStateRaw] = useState(() => loadState());
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [autoZoom, setAutoZoom] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const saveTimerRef = useRef(null);

  const setState = useCallback((next) => {
    setStateRaw(next);
    setSaving(true);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      setSaving(false);
    }, 400);
  }, []);

  const data = state.data[state.language];
  const fontPreset = FONT_PRESETS.find(f => f.id === state.fontPreset) || FONT_PRESETS[0];

  const pruneTimerRef = useRef(null);

  // Remove fully-empty entries — but only once the user has finished editing
  // (focus has left every editable field). Deferring + the focus guard means we
  // never delete an entry mid-edit and never steal the caret.
  const schedulePrune = useCallback(() => {
    clearTimeout(pruneTimerRef.current);
    pruneTimerRef.current = setTimeout(() => {
      if (document.activeElement?.isContentEditable) return; // still editing
      setStateRaw(prev => {
        const lang = prev.language;
        const langData = { ...prev.data[lang] };
        let changed = false;
        for (const key of Object.keys(ENTRY_KEYS)) {
          const arr = langData[key];
          if (!Array.isArray(arr) || arr.length === 0) continue;
          const pruned = arr.filter(e => !entryEmpty(e, key));
          if (pruned.length !== arr.length) { langData[key] = pruned; changed = true; }
        }
        if (!changed) return prev;
        const next = { ...prev, data: { ...prev.data, [lang]: langData } };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
        return next;
      });
    }, 250);
  }, []);

  const onEdit = useCallback((path, value) => {
    setStateRaw(prev => {
      const next = { ...prev };
      next.data = { ...prev.data };
      next.data[prev.language] = setIn(prev.data[prev.language], path, value);
      clearTimeout(saveTimerRef.current);
      setSaving(true);
      saveTimerRef.current = setTimeout(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
        setSaving(false);
      }, 600);
      return next;
    });
    schedulePrune();
  }, [schedulePrune]);

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

  // Use zoom CSS property when scaling down (renders text at target resolution — crisp).
  // Fall back to transform when scaling up so the page can visually extend beyond bounds.
  const stageStyle = effectiveZoom <= 1
    ? { zoom: effectiveZoom }
    : { transform: `scale(${effectiveZoom})`, transformOrigin: 'center center' };

  const handleExport = () => setTimeout(() => window.print(), 50);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handleExport();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault();
        setZoom(z => Math.min(2, (z || autoZoom) + 0.1));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        setZoom(z => Math.max(0.2, (z || autoZoom) - 0.1));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setZoom(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoZoom]);

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
            // When focus leaves an inline field, clean up any entry the user
            // added but never filled. schedulePrune defers + checks that no
            // editable is focused, so this never fires mid-edit.
            onBlur={schedulePrune}
            style={{
              '--cv-heading': fontPreset.heading,
              '--cv-body': fontPreset.body,
            }}
          >
            {/* AutoFit measures natural height and scales so the CV ALWAYS
                fits exactly one A4 page — never clipped, never two pages. */}
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

        <AiPopover language={state.language}/>

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
        saving={saving}
      />
    </div>
  );
}
