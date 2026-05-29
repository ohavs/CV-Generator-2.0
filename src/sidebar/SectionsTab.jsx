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
    if (from === to) return;
    const next = [...state.sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setState({ ...state, sections: next });
  };

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'גרירה לסידור · עין להסתרה' : 'Drag to reorder · eye to hide'}</h3>
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
              <span className="drag-handle"><Icon name="drag" size={14}/></span>
              <span className="section-label">{t.sections[s.id]}</span>
              <button className="toggle-vis" onClick={() => toggleVis(i)} title={s.visible ? 'Hide' : 'Show'}>
                <Icon name={s.visible ? 'eye' : 'eye-off'} size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'הוספה ושינוי' : 'Add & manage'}</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'לעריכה — לחצו על כל טקסט בתצוגה המקדימה. להוספת פריטים חדשים — בלשונית "תוכן".'
            : 'To edit — click any text in the preview. To add new items — use the "Content" tab.'}
        </div>
      </div>
    </>
  );
}
