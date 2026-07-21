import { useState, useEffect, useRef, useLayoutEffect, useCallback, useReducer } from 'react';
import { DEFAULT_STATE, FONT_PRESETS, I18N } from './data.js';
import { pruneLangData } from './entryUtils.js';
import { loadStore, saveStore, activeDoc, docList, freshDoc, docName } from './docStore.js';
import { TemplateRoot } from './templates/index.jsx';
import Sidebar from './sidebar/Sidebar.jsx';
import AutoFit from './components/AutoFit.jsx';
import MobileEditBar from './components/MobileEditBar.jsx';
import FullEditor from './components/FullEditor.jsx';
import { useIsMobile } from './components/Editable.jsx';
import Icon from './components/Icon.jsx';

const perfNow = () => (typeof performance !== 'undefined' ? performance.now() : 0);
const EMPTY_HISTORY = () => ({ past: [], future: [], lastKey: null, lastAt: 0 });

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
  // The whole document collection lives in a ref (source of truth for
  // persistence); the active document's state is mirrored into React state for
  // editing, history and rendering.
  const storeRef = useRef();
  if (storeRef.current === undefined) storeRef.current = loadStore();

  const [state, setStateRaw] = useState(() => activeDoc(storeRef.current).state);
  const [docs, setDocs] = useState(() => docList(storeRef.current));
  const [activeId, setActiveId] = useState(() => storeRef.current.activeId);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [autoZoom, setAutoZoom] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fullEdit, setFullEdit] = useState(false);
  const saveTimerRef = useRef(null);
  const pruneTimerRef = useRef(null);

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; });

  // Write the given state into the active document and flush the collection.
  const writeActive = useCallback((next) => {
    const store = storeRef.current;
    const id = store.activeId;
    store.docs = store.docs.map(d => d.id === id ? { ...d, state: next, updatedAt: Date.now() } : d);
    saveStore(store);
  }, []);

  const persist = useCallback((next, delay = 500) => {
    clearTimeout(saveTimerRef.current);
    setSaving(true);
    saveTimerRef.current = setTimeout(() => {
      writeActive(next);
      setSaving(false);
    }, delay);
  }, [writeActive]);

  // The one place the working state is written. Updates the mirror eagerly so
  // the next change/undo reads this value even before React re-renders.
  const commit = useCallback((next, saveDelay) => {
    stateRef.current = next;
    setStateRaw(next);
    persist(next, saveDelay);
  }, [persist]);

  /* ---- Undo / redo history ---------------------------------------------- */
  const historyRef = useRef(EMPTY_HISTORY());
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
  const setState = useCallback((next) => {
    const prev = stateRef.current;
    pushPast(prev, 'set:' + (changedKeys(prev, next) || 'all'));
    commit(next);
  }, [pushPast, commit]);

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

  const schedulePrune = useCallback(() => {
    clearTimeout(pruneTimerRef.current);
    pruneTimerRef.current = setTimeout(() => {
      if (document.activeElement?.isContentEditable) return;          // caret editing
      if (document.body.hasAttribute('data-mobile-editing')) return;  // edit bar open
      const prev = stateRef.current;
      const lang = prev.language;
      const cleaned = pruneLangData(prev.data[lang]);
      if (!cleaned) return;
      // Pruning is a settled action — persist immediately so a quick app close
      // can't lose the cleanup. Not an undo step (removing an abandoned blank
      // row that the user never filled is just noise in the history).
      commit({ ...prev, data: { ...prev.data, [lang]: cleaned } }, 0);
    }, 250);
  }, [commit]);

  // Edits from the full-screen form editor. Like onEdit but keyed per-field
  // (so distinct fields stay distinct undo steps) and WITHOUT auto-prune — the
  // form has explicit remove buttons, so we never yank an entry card out from
  // under the user mid-edit. Leftover empties are cleaned when they return to
  // the preview (closeFull calls schedulePrune).
  const editField = useCallback((path, value) => {
    const prev = stateRef.current;
    const lang = prev.language;
    const next = { ...prev, data: { ...prev.data, [lang]: setIn(prev.data[lang], path, value) } };
    pushPast(prev, 'fe:' + lang + ':' + path.join('.'));
    commit(next);
  }, [pushPast, commit]);

  const toggleSection = useCallback((id) => {
    const prev = stateRef.current;
    const sections = prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
    pushPast(prev, 'sec:' + id);
    commit({ ...prev, sections });
  }, [pushPast, commit]);

  /* ---- Document management ---------------------------------------------- */
  // Save the live working state into its document before we swap documents.
  const flushActive = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    writeActive(stateRef.current);
  }, [writeActive]);

  const loadDoc = useCallback((doc) => {
    historyRef.current = EMPTY_HISTORY();
    bumpHist();
    stateRef.current = doc.state;
    setStateRaw(doc.state);
    setActiveId(doc.id);
    setSaving(false);
  }, []);

  const switchDoc = useCallback((id) => {
    if (id === storeRef.current.activeId) return;
    flushActive();
    const store = storeRef.current;
    const target = store.docs.find(d => d.id === id);
    if (!target) return;
    store.activeId = id;
    saveStore(store);
    setDocs(docList(store));
    loadDoc(target);
  }, [flushActive, loadDoc]);

  const newDoc = useCallback(() => {
    flushActive();
    const store = storeRef.current;
    const uiLang = stateRef.current.language;
    const doc = freshDoc({ ...DEFAULT_STATE, language: uiLang }, uiLang === 'en' ? 'New CV' : 'קורות חיים חדשים');
    store.docs = [...store.docs, doc];
    store.activeId = doc.id;
    saveStore(store);
    setDocs(docList(store));
    loadDoc(doc);
    setMobileOpen(false);
  }, [flushActive, loadDoc]);

  const duplicateDoc = useCallback((id) => {
    flushActive();
    const store = storeRef.current;
    const src = store.docs.find(d => d.id === id);
    if (!src) return;
    const suffix = src.state.language === 'en' ? ' (copy)' : ' (עותק)';
    const copy = freshDoc(src.state, src.name + suffix);
    store.docs = [...store.docs, copy];
    store.activeId = copy.id;
    saveStore(store);
    setDocs(docList(store));
    loadDoc(copy);
  }, [flushActive, loadDoc]);

  const renameDoc = useCallback((id, name) => {
    const store = storeRef.current;
    const clean = (name || '').trim();
    store.docs = store.docs.map(d => d.id === id ? { ...d, name: clean || d.name } : d);
    saveStore(store);
    setDocs(docList(store));
  }, []);

  const deleteDoc = useCallback((id) => {
    const store = storeRef.current;
    const wasActive = store.activeId === id;
    let list = store.docs.filter(d => d.id !== id);
    if (!list.length) {
      const uiLang = stateRef.current.language;
      list = [freshDoc({ ...DEFAULT_STATE, language: uiLang }, uiLang === 'en' ? 'New CV' : 'קורות חיים חדשים')];
    }
    store.docs = list;
    if (wasActive) store.activeId = list[0].id;
    saveStore(store);
    setDocs(docList(store));
    if (wasActive) loadDoc(activeDoc(store));
  }, [loadDoc]);

  const data = state.data[state.language];
  const fontPreset = FONT_PRESETS.find(f => f.id === state.fontPreset) || FONT_PRESETS[0];

  const isMobile = useIsMobile();

  const openFull = useCallback(() => { setMobileOpen(false); setFullEdit(true); }, []);
  const closeFull = useCallback(() => { setFullEdit(false); schedulePrune(); }, [schedulePrune]);

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
      const base = docName(stateRef.current).trim().replace(/\s+/g, '-');
      await exportPdf(`${base || 'cv'}.pdf`);
    } catch (e) {
      window.print();
    } finally {
      setExporting(false);
    }
  }, [exporting]);

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
                showPhoto={state.showPhoto !== false}
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
        docs={docs}
        activeId={activeId}
        onSwitchDoc={switchDoc}
        onNewDoc={newDoc}
        onRenameDoc={renameDoc}
        onDuplicateDoc={duplicateDoc}
        onDeleteDoc={deleteDoc}
      />

      <FullEditor
        open={fullEdit}
        state={state}
        editField={editField}
        toggleSection={toggleSection}
        onClose={closeFull}
      />

      {/* One quick toggle, same spot in both modes: flips preview ⇄ full text
          editor. Sits above the editor overlay so it never scrolls away. */}
      <button
        className="fulledit-toggle"
        data-mode={fullEdit ? 'edit' : 'preview'}
        onClick={() => (fullEdit ? closeFull() : openFull())}
      >
        <Icon name={fullEdit ? 'eye' : 'edit'} size={16}/>
        <span>{fullEdit
          ? (state.language === 'he' ? 'תצוגה' : 'Preview')
          : (state.language === 'he' ? 'עריכת טקסט' : 'Text editor')}</span>
      </button>
    </div>
  );
}
