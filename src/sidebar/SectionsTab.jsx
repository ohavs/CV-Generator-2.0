import { useState } from 'react';
import Icon from '../components/Icon.jsx';

export default function SectionsTab({ state, setState, t }) {
  const lang = state.language;
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);

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

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'סדר ותצוגת חלקים' : 'Order & visibility'}</h3>
        <div className="section-list">
          {state.sections.map((s, i) => (
            <div
              key={s.id}
              className="section-row"
              data-hidden={!s.visible}
              data-dragging={draggingIdx === i}
              draggable
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
              <span className="section-label">{t.sections[s.id]}</span>
              <button className="toggle-vis" onClick={() => toggleVis(i)} title={s.visible ? 'Hide' : 'Show'}>
                <Icon name={s.visible ? 'eye' : 'eye-off'} size={14}/>
              </button>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 8, lineHeight: 1.5 }}>
          {lang === 'he' ? 'חצים לשינוי סדר · עין להצגה/הסתרה' : 'Arrows to reorder · eye to show/hide'}
        </div>
      </div>
    </>
  );
}
