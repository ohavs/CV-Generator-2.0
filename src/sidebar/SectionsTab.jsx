import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import FitNote from './FitNote.jsx';
import { I18N, LIMITS } from '../data.js';
import SizeStepper, { withSectionScale } from '../components/SizeStepper.jsx';
import { labelsFor } from '../templates/helpers.js';

export default function SectionsTab({ state, setState, fitScale = 1 }) {
  const lang = state.language;
  const he = lang === 'he';
  const data = state.data[lang];
  const labels = labelsFor(lang, data);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [renaming, setRenaming] = useState(null); // section id being renamed
  const [draft, setDraft] = useState('');

  const toggleVis = (idx) => {
    const next = state.sections.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s);
    setState({ ...state, sections: next });
  };

  const move = (from, to) => {
    if (from === to || to < 0 || to >= state.sections.length) return;
    const next = [...state.sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setState({ ...state, sections: next });
  };

  const scaleOf = (id) => state.sectionScale?.[id] ?? 1;
  const setScale = (id, v) => setState(withSectionScale(state, id, v));
  const anyScaled = Object.values(state.sectionScale || {}).some(v => v !== 1);

  // A title is content (it differs per language), so it lives with the data.
  const startRename = (id) => { setRenaming(id); setDraft(labels.sections[id]); };
  const commitRename = () => {
    const id = renaming;
    setRenaming(null);
    if (!id) return;
    const clean = draft.replace(/\s+/g, ' ').trim().slice(0, LIMITS.titleLength);
    const titles = { ...(data.sectionTitles || {}) };
    if (!clean || clean === I18N[lang].sections[id]) delete titles[id]; else titles[id] = clean;
    if ((data.sectionTitles?.[id] ?? '') === (titles[id] ?? '')) return;
    setState({ ...state, data: { ...state.data, [lang]: { ...data, sectionTitles: titles } } });
  };

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">
          {he ? 'סדר, גודל ותצוגה' : 'Order, size & visibility'}
          {anyScaled && (
            <button onClick={() => setState({ ...state, sectionScale: {} })}
              style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: 0 }}>
              {he ? 'איפוס גדלים' : 'Reset sizes'}
            </button>
          )}
        </h3>
        <div className="section-list">
          {state.sections.map((s, i) => (
            <div
              key={s.id}
              className="section-row"
              data-hidden={!s.visible}
              data-dragging={draggingIdx === i}
              draggable={renaming !== s.id}
              onDragStart={() => setDraggingIdx(i)}
              onDragEnd={() => { setDraggingIdx(null); setHoverIdx(null); }}
              onDragOver={(e) => { e.preventDefault(); setHoverIdx(i); }}
              onDrop={(e) => { e.preventDefault(); if (draggingIdx != null) move(draggingIdx, i); }}
              style={hoverIdx === i && draggingIdx !== null ? { borderColor: 'var(--accent)' } : {}}
            >
              {/* Arrows work everywhere (drag doesn't exist on touch) */}
              <span className="reorder-btns">
                <button className="toggle-vis" disabled={i === 0} onClick={() => move(i, i - 1)} title="Up">
                  <Icon name="chevron-up" size={13}/>
                </button>
                <button className="toggle-vis" disabled={i === state.sections.length - 1} onClick={() => move(i, i + 1)} title="Down">
                  <Icon name="chevron-down" size={13}/>
                </button>
              </span>

              {renaming === s.id ? (
                <input
                  className="section-rename"
                  autoFocus
                  value={draft}
                  maxLength={LIMITS.titleLength}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') { setRenaming(null); }
                  }}
                />
              ) : s.id === 'personal' ? (
                // The header has no title on the page, so there is nothing to rename.
                <span className="section-label">{labels.sections[s.id]}</span>
              ) : (
                <button className="section-label section-label-btn" onClick={() => startRename(s.id)}
                  title={he ? 'שינוי שם המקטע' : 'Rename section'}>
                  <span>{labels.sections[s.id]}</span>
                  <Icon name="edit" size={11}/>
                </button>
              )}

              <SizeStepper value={scaleOf(s.id)} onChange={(v) => setScale(s.id, v)} lang={lang}/>
              <button className="toggle-vis" onClick={() => toggleVis(i)} title={s.visible ? 'Hide' : 'Show'}>
                <Icon name={s.visible ? 'eye' : 'eye-off'} size={14}/>
              </button>
            </div>
          ))}
        </div>
        <div className="panel-hint" style={{ marginTop: 8 }}>
          {he
            ? 'חצים לשינוי סדר · לחיצה על שם לשינוי שלו · − / + לגודל הטקסט של המקטע · עין להצגה/הסתרה'
            : 'Arrows reorder · tap a name to rename it · − / + sizes that section’s text · eye shows/hides'}
        </div>
        {fitScale < 0.995 && (
          <FitNote fitScale={fitScale} he={he}/>
        )}
      </div>
    </>
  );
}
