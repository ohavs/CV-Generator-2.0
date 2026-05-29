import { useRef } from 'react';
import Icon from './Icon.jsx';

export default function EditablePhoto({ value, onChange, size = 100, round = true, accent = '#A8542C' }) {
  const inputRef = useRef(null);
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        width: size, height: size,
        borderRadius: round ? '50%' : 8,
        background: value ? `center/cover url(${value})` : `linear-gradient(135deg, ${accent}22, ${accent}44)`,
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        color: accent,
        fontFamily: 'inherit',
        border: value ? 'none' : `1.5px dashed ${accent}66`,
      }}
      title="העלאת תמונה / Upload photo"
    >
      {!value && <Icon name="plus" size={20} />}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handle}/>
    </div>
  );
}
