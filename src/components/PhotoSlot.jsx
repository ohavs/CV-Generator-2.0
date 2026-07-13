import { useRef, useState } from 'react';
import Icon from './Icon.jsx';

// Downscale + re-encode so we never stuff a multi-MB data URL into
// localStorage (which now holds several CVs). Longest edge is capped and the
// result is JPEG — a headshot lands around 20-40 KB.
const MAX_EDGE = 520;
async function compress(file) {
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  try { return canvas.toDataURL('image/jpeg', 0.85); }
  catch { return dataUrl; } // tainted canvas fallback (shouldn't happen for local files)
}

// A photo well usable by every template. `size` + `round` shape it; the empty
// state shows a dashed upload affordance that is hidden from the exported PDF.
export default function PhotoSlot({ value, onChange, size = 100, round = true, accent = '#A8542C' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try { onChange(await compress(file)); }
    catch { /* ignore unreadable file */ }
    finally { setBusy(false); }
  };

  const remove = (e) => { e.stopPropagation(); onChange(''); };

  return (
    <div
      className="photo-slot"
      data-empty={value ? 'false' : 'true'}
      onClick={() => inputRef.current?.click()}
      style={{
        width: size, height: size,
        borderRadius: round ? '50%' : Math.round(size * 0.12),
        background: value
          ? `center/cover no-repeat url("${value}")`
          : `linear-gradient(135deg, ${accent}18, ${accent}33)`,
        border: value ? 'none' : `1.5px dashed ${accent}77`,
        color: accent,
      }}
      title={busy ? '…' : 'העלאת תמונה / Upload photo'}
    >
      {!value && <Icon name={busy ? 'loader' : 'camera'} size={Math.max(16, size * 0.22)}
        style={busy ? { animation: 'spin 0.8s linear infinite' } : undefined}/>}
      {value && (
        <button className="photo-remove" onClick={remove} title="הסרה / Remove">
          <Icon name="x" size={12}/>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick}/>
    </div>
  );
}
