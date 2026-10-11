import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

// Picks a font pairing (heading + body). With `single`, it picks one font
// instead — listed by each preset's display face — and offers a first option
// ('' value) meaning "whatever the pairing uses", shown in `fallbackStack`.
export default function FontDropdown({ value, onChange, presets, lang, single = false, defaultLabel, fallbackStack, sub }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const sample = lang === 'he' ? 'אבג' : 'Aa';
  const found = presets.find(p => p.id === value);
  const current = single
    ? (found ? { id: found.id, name: found.name[lang], heading: found.heading, body: found.heading }
             : { id: '', name: defaultLabel, heading: fallbackStack, body: fallbackStack })
    : { ...(found || presets[0]), name: (found || presets[0]).name[lang] };
  const options = single
    ? [{ id: '', name: defaultLabel, heading: fallbackStack, body: fallbackStack },
       ...presets.map(p => ({ id: p.id, name: p.name[lang], heading: p.heading, body: p.heading }))]
    : presets.map(p => ({ ...p, name: p.name[lang] }));

  return (
    <div className="font-dropdown" ref={ref} data-single={single || undefined}>
      <button
        className="font-dropdown-trigger"
        data-open={open}
        onClick={() => setOpen(!open)}
      >
        <span className="font-dropdown-preview" style={{ fontFamily: current.heading }}>
          {sample}
        </span>
        <div className="font-dropdown-info">
          <div className="font-dropdown-name">{current.name}</div>
          <div className="font-dropdown-sub" style={{ fontFamily: current.body }}>
            {sub ?? (lang === 'he' ? 'כותרות + גוף' : 'Heading + Body')}
          </div>
        </div>
        <Icon name="chevron-down" size={15} style={{ color: 'var(--ink-4)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}/>
      </button>

      {open && (
        <div className="font-dropdown-panel">
          {options.map(p => (
            <button
              key={p.id || 'default'}
              className="font-dropdown-option"
              data-active={p.id === (single ? (found ? value : '') : current.id)}
              onClick={() => { onChange(p.id); setOpen(false); }}
            >
              <span style={{ fontFamily: p.heading, fontSize: 24, lineHeight: 1, minWidth: 44, textAlign: 'center', color: 'var(--ink)' }}>
                {sample}
              </span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', fontFamily: p.heading }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2, fontFamily: p.body }}>
                  {lang === 'he' ? 'טקסט לדוגמה · Sample text' : 'Sample text · טקסט לדוגמה'}
                </div>
              </div>
              {p.id === (single ? (found ? value : '') : current.id) && (
                <Icon name="check" size={14} style={{ color: 'var(--accent)', marginInlineStart: 'auto', flexShrink: 0 }}/>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
