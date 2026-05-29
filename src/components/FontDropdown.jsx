import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function FontDropdown({ value, onChange, presets, lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const current = presets.find(p => p.id === value) || presets[0];

  return (
    <div className="font-dropdown" ref={ref}>
      <button
        className="font-dropdown-trigger"
        data-open={open}
        onClick={() => setOpen(!open)}
      >
        <span className="font-dropdown-preview" style={{ fontFamily: current.heading }}>
          {lang === 'he' ? 'אבג' : 'Aa'}
        </span>
        <div className="font-dropdown-info">
          <div className="font-dropdown-name">{current.name[lang]}</div>
          <div className="font-dropdown-sub" style={{ fontFamily: current.body }}>
            {lang === 'he' ? 'כותרות + גוף' : 'Heading + Body'}
          </div>
        </div>
        <Icon name="chevron-down" size={15} style={{ color: 'var(--ink-4)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}/>
      </button>

      {open && (
        <div className="font-dropdown-panel">
          {presets.map(p => (
            <button
              key={p.id}
              className="font-dropdown-option"
              data-active={p.id === value}
              onClick={() => { onChange(p.id); setOpen(false); }}
            >
              <span style={{ fontFamily: p.heading, fontSize: 24, lineHeight: 1, minWidth: 44, textAlign: 'center', color: 'var(--ink)' }}>
                {lang === 'he' ? 'אבג' : 'Aa'}
              </span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', fontFamily: p.heading }}>
                  {p.name[lang]}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2, fontFamily: p.body }}>
                  {lang === 'he' ? 'טקסט לדוגמה · Sample text' : 'Sample text · טקסט לדוגמה'}
                </div>
              </div>
              {p.id === value && (
                <Icon name="check" size={14} style={{ color: 'var(--accent)', marginInlineStart: 'auto', flexShrink: 0 }}/>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
