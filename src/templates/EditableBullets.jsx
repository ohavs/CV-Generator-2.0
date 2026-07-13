import { useRef } from 'react';
import Editable, { useIsMobile } from '../components/Editable.jsx';

export default function EditableBullets({ bullets, onChange, accent, lang, placeholder, bulletStyle = 'dot' }) {
  const isMobile = useIsMobile();
  const listRef = useRef(null);
  const del = (idx) => {
    if (bullets.length === 1) return onChange(['']);
    onChange(bullets.filter((_, i) => i !== idx));
  };
  const update = (idx, v) => onChange(bullets.map((b, i) => i === idx ? v : b));

  // A new line can be added only when every existing line has content —
  // structurally impossible to pile up empties.
  const allFilled = bullets.every(b => (b ?? '').trim() !== '');
  const addLine = (e) => {
    // Templates rebuild their DOM on every data commit (inline Section
    // components), so refs go stale. Remember which section we're in and
    // re-query the fresh DOM for the new empty line after React settles.
    const sectionId = e.currentTarget.closest('[data-section]')?.getAttribute('data-section');
    onChange([...bullets, '']);
    setTimeout(() => {
      const scope = (sectionId && document.querySelector(`.preview-page [data-section="${sectionId}"]`))
        || listRef.current || document;
      const el = scope.querySelector('[data-bullet-list] [data-editable][data-empty="true"]');
      if (!el) return;
      if (isMobile) el.click(); else el.focus();
    }, 150);
  };

  const marker = () => {
    if (bulletStyle === 'arrow') return <span style={{color: accent, marginInlineEnd: 6, fontFamily: 'inherit'}}>›</span>;
    if (bulletStyle === 'square') return <span style={{color: accent, marginInlineEnd: 6}}>▪</span>;
    if (bulletStyle === 'dash') return <span style={{color: accent, marginInlineEnd: 8}}>—</span>;
    if (bulletStyle === 'none') return null;
    return <span style={{color: accent, marginInlineEnd: 8, display: 'inline-block', width: '1em', textAlign: 'center'}}>•</span>;
  };

  return (
    <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0 }} data-bullet-list>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 3 }} className="array-item">
          {marker()}
          <Editable
            value={b}
            onChange={(v) => update(i, v)}
            multiline
            placeholder={placeholder}
            style={{ flex: 1, minHeight: '1.2em' }}
            onKeyDown={(e) => {
              // Enter commits instead of creating a line (adding is via the + below).
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
              }
              if (e.key === 'Backspace' && b === '' && bullets.length > 1) {
                e.preventDefault();
                del(i);
              }
            }}
          />
        </li>
      ))}
      {allFilled && (
        <li className="bullet-add" onClick={addLine}>
          <span style={{ color: accent }}>+</span>
          {lang === 'he' ? 'הוספת שורה' : 'Add line'}
        </li>
      )}
    </ul>
  );
}
