// Main App
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useLayoutEffect: useLayoutEffectA, useCallback: useCallbackA } = React;

const STORAGE_KEY = 'koroth_cv_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return window.CV_DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // shallow merge defaults to handle schema additions
    return { ...window.CV_DEFAULT_STATE, ...parsed,
      data: { ...window.CV_DEFAULT_STATE.data, ...(parsed.data || {}) },
    };
  } catch (e) {
    console.error('load failed', e);
    return window.CV_DEFAULT_STATE;
  }
}

function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  next[head] = setIn(obj?.[head] ?? (typeof rest[0] === 'number' ? [] : {}), rest, value);
  return next;
}

function App() {
  const [state, setStateRaw] = useStateA(() => loadState());
  const [saving, setSaving] = useStateA(false);
  const [zoom, setZoom] = useStateA(null); // null = auto-fit, number = manual
  const [autoZoom, setAutoZoom] = useStateA(1);
  const [mobileOpen, setMobileOpen] = useStateA(false);
  const saveTimerRef = useRefA(null);

  // wrapped setter that debounces save + flashes indicator
  const setState = useCallbackA((next) => {
    setStateRaw(next);
    setSaving(true);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      setSaving(false);
    }, 400);
  }, []);

  // current data (per language)
  const data = state.data[state.language];
  const isRtl = state.language === 'he';
  const fontPreset = window.CV_FONT_PRESETS.find(f => f.id === state.fontPreset) || window.CV_FONT_PRESETS[0];

  // editor handle — modifies data for current language
  const onEdit = useCallbackA((path, value) => {
    setStateRaw(prev => {
      const next = { ...prev };
      next.data = { ...prev.data };
      next.data[prev.language] = setIn(prev.data[prev.language], path, value);
      try {
        clearTimeout(saveTimerRef.current);
        setSaving(true);
        saveTimerRef.current = setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setSaving(false);
        }, 600);
      } catch(e) {}
      return next;
    });
  }, []);

  /* === Scale-to-fit logic === */
  const previewAreaRef = useRefA(null);
  const stageRef = useRefA(null);

  useLayoutEffectA(() => {
    const compute = () => {
      const area = previewAreaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const padX = window.innerWidth <= 900 ? 24 : 80;
      const padY = window.innerWidth <= 900 ? 80 : 80;
      // A4: 794 x 1123 (210mm x 297mm at 96dpi)
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

  /* === Export PDF === */
  const handleExport = () => {
    // setting zoom to 1 before print isn't needed since @media print resets it
    setTimeout(() => window.print(), 50);
  };

  /* === Keyboard shortcuts === */
  useEffectA(() => {
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
          ref={stageRef}
          style={{ transform: `scale(${effectiveZoom})` }}
        >
          <div
            className="preview-page"
            style={{
              '--cv-heading': fontPreset.heading,
              '--cv-body': fontPreset.body,
            }}
          >
            <TemplateRoot
              template={state.template}
              data={data}
              accent={state.accent}
              lang={state.language}
              sections={state.sections}
              onEdit={onEdit}
            />
          </div>
        </div>

        <AiPopover language={state.language}/>

        <div className="zoom-badge">
          <button onClick={() => setZoom(z => Math.max(0.2, (z || autoZoom) - 0.1))} title="Zoom out">
            <Icon name="minus" size={13}/>
          </button>
          <button className="zoom-value" onClick={() => setZoom(null)}>{Math.round(effectiveZoom * 100)}%</button>
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

window.App = App;

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
