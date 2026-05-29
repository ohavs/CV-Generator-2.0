import Editable from '../components/Editable.jsx';

export default function EditableBullets({ bullets, onChange, accent, lang, placeholder, bulletStyle = 'dot' }) {
  const addAfter = (idx) => onChange([...bullets.slice(0, idx + 1), '', ...bullets.slice(idx + 1)]);
  const del = (idx) => {
    if (bullets.length === 1) return onChange(['']);
    onChange(bullets.filter((_, i) => i !== idx));
  };
  const update = (idx, v) => onChange(bullets.map((b, i) => i === idx ? v : b));

  const marker = () => {
    if (bulletStyle === 'arrow') return <span style={{color: accent, marginInlineEnd: 6, fontFamily: 'inherit'}}>›</span>;
    if (bulletStyle === 'square') return <span style={{color: accent, marginInlineEnd: 6}}>▪</span>;
    if (bulletStyle === 'dash') return <span style={{color: accent, marginInlineEnd: 8}}>—</span>;
    if (bulletStyle === 'none') return null;
    return <span style={{color: accent, marginInlineEnd: 8, display: 'inline-block', width: '1em', textAlign: 'center'}}>•</span>;
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 3 }} className="array-item">
          {marker()}
          <Editable
            value={b}
            onChange={(v) => update(i, v)}
            multiline
            placeholder={placeholder}
            enableAi
            style={{ flex: 1, minHeight: '1.2em' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addAfter(i);
              }
              if (e.key === 'Backspace' && b === '' && bullets.length > 1) {
                e.preventDefault();
                del(i);
              }
            }}
          />
        </li>
      ))}
    </ul>
  );
}
