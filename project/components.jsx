// Shared: icons, Editable wrappers, AI rewrite popover
const { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } = React;

/* =================== ICONS =================== */
function Icon({ name, size = 16, strokeWidth = 1.75, style }) {
  const s = size;
  const sw = strokeWidth;
  const common = {
    width: s, height: s,
    viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'mail':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'phone':
      return <svg {...common}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>;
    case 'pin':
      return <svg {...common}><path d="M12 22s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'globe':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'linkedin':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7.5v.01M12 17v-3.5a2.5 2.5 0 0 1 5 0V17M12 10v7"/></svg>;
    case 'github':
      return <svg {...common}><path d="M9 19c-4 1.3-4-2-6-2m12 4v-3.5a3 3 0 0 0-.8-2.2c3-.4 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.4s-1.2-.4-3.7 1.4a13 13 0 0 0-6 0C6.5 1.5 5.3 2 5.3 2A4.6 4.6 0 0 0 5.2 5.4 5 5 0 0 0 3.8 8.9c0 5 3 6.1 6 6.5a3 3 0 0 0-.8 2.2V21"/></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'trash':
      return <svg {...common}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case 'eye':
      return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':
      return <svg {...common}><path d="M2 12s3.5-7 10-7c2.4 0 4.5.9 6.2 2M22 12s-3.5 7-10 7c-2.5 0-4.6-.9-6.3-2.2M3 3l18 18"/><path d="M10 10a3 3 0 0 0 4 4"/></svg>;
    case 'drag':
      return <svg {...common}><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg>;
    case 'download':
      return <svg {...common}><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>;
    case 'sparkles':
      return <svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'sun':
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case 'moon':
      return <svg {...common}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>;
    case 'palette':
      return <svg {...common}><path d="M12 22a10 10 0 1 1 10-10c0 2.5-2.5 2.5-4 2.5h-2a3 3 0 0 0 0 6c0 1-1 1.5-2 1.5H12Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16.5" cy="11" r="1"/></svg>;
    case 'type':
      return <svg {...common}><path d="M4 7V5h16v2M9 19h6M12 5v14"/></svg>;
    case 'layers':
      return <svg {...common}><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>;
    case 'list':
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'check':
      return <svg {...common}><path d="m5 12 5 5L20 7"/></svg>;
    case 'x':
      return <svg {...common}><path d="M6 6l12 12M6 18 18 6"/></svg>;
    case 'chevron-down':
      return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case 'edit':
      return <svg {...common}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case 'zoom-in':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/></svg>;
    case 'zoom-out':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/></svg>;
    case 'minus':
      return <svg {...common}><path d="M5 12h14"/></svg>;
    case 'sliders':
      return <svg {...common}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>;
    case 'languages':
      return <svg {...common}><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>;
    default:
      return null;
  }
}

/* =================== EDITABLE TEXT =================== */
// Contenteditable wrapper. Patches text on blur. Re-syncs DOM only when the
// upstream value changed AND the element isn't focused (preserves cursor).
function Editable({
  value, onChange, multiline = false, placeholder = '',
  className = '', as = 'span', style, onFocus, onBlur,
  enableAi = false, ...rest
}) {
  const ref = useRef(null);
  const lastValRef = useRef(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerText === value) { lastValRef.current = value; return; }
    el.innerText = value ?? '';
    lastValRef.current = value;
  }, [value]);

  const commit = () => {
    const el = ref.current;
    if (!el) return;
    const v = multiline ? el.innerText : el.innerText.replace(/\n+/g, ' ').trim();
    if (v !== lastValRef.current) {
      lastValRef.current = v;
      onChange?.(v);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === 'Escape') e.target.blur();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, text);
  };

  const Comp = as;
  const isEmpty = !value || value.length === 0;

  return (
    <Comp
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className={className}
      style={style}
      data-placeholder={placeholder}
      data-empty={isEmpty ? 'true' : 'false'}
      data-editable
      data-ai-enabled={enableAi ? 'true' : 'false'}
      onBlur={(e) => { commit(); onBlur?.(e); }}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      {...rest}
    />
  );
}

/* =================== AI REWRITE POPOVER =================== */
// Tracks the focused editable that has data-ai-enabled, positions a button next to it.
function AiPopover({ language }) {
  const [target, setTarget] = useState(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onFocus = (e) => {
      const t = e.target;
      if (t && t.matches && t.matches('[data-editable][data-ai-enabled="true"]')) {
        setTarget(t);
      }
    };
    const onBlur = (e) => {
      // delay to allow click on popover to fire
      setTimeout(() => {
        if (!document.activeElement || !document.activeElement.matches('[data-editable]')) {
          setTarget(null);
        }
      }, 150);
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    return () => {
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onBlur);
    };
  }, []);

  useLayoutEffect(() => {
    if (!target) return;
    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        left: rect.left + rect.width / 2,
      });
    };
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [target]);

  const rewrite = async (mode) => {
    if (!target || busy) return;
    const original = target.innerText;
    if (!original.trim()) return;
    setBusy(true);
    try {
      const langLabel = language === 'he' ? 'Hebrew' : 'English';
      const directive = {
        polish: `Improve the phrasing of this CV text while keeping its meaning and language (${langLabel}). Make it concise, confident, and impactful. Reply with ONLY the rewritten text — no explanation, no quotes, no preamble.`,
        shorten: `Make this CV text more concise while keeping its meaning and language (${langLabel}). Reply with ONLY the rewritten text — no explanation, no quotes, no preamble.`,
        expand: `Expand this CV text into a richer, more impactful version. Keep the same language (${langLabel}) and remain factual. Reply with ONLY the rewritten text — no explanation, no quotes, no preamble.`,
      }[mode];
      const result = await window.claude.complete(`${directive}\n\nText:\n${original}`);
      const cleaned = (result || '').trim().replace(/^["'״׳]|["'״׳]$/g, '');
      if (cleaned) {
        // dispatch input + blur so React updates
        target.innerText = cleaned;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.blur();
      }
    } catch (err) {
      console.error('AI rewrite failed', err);
    } finally {
      setBusy(false);
    }
  };

  if (!target) return null;

  const labels = language === 'he'
    ? { polish: 'שיפור', shorten: 'קיצור', expand: 'הרחבה', busy: 'חושב...' }
    : { polish: 'Polish', shorten: 'Shorten', expand: 'Expand', busy: 'Thinking...' };

  return (
    <div className="ai-pop" style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }} onMouseDown={(e) => e.preventDefault()}>
      {busy ? (
        <button disabled><Icon name="sparkles" size={13}/>{labels.busy}</button>
      ) : (
        <>
          <button onClick={() => rewrite('polish')}><Icon name="sparkles" size={13}/>{labels.polish}</button>
          <button onClick={() => rewrite('shorten')}>{labels.shorten}</button>
          <button onClick={() => rewrite('expand')}>{labels.expand}</button>
        </>
      )}
    </div>
  );
}

/* =================== EDITABLE PHOTO =================== */
function EditablePhoto({ value, onChange, size = 100, round = true, accent = '#A8542C' }) {
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

/* =================== ARRAY HELPERS =================== */
function ArrayItemControls({ onDelete, onAddBelow, isRtl }) {
  // floating handle revealed on hover of parent (.array-item)
  return (
    <div className="array-controls" style={{
      position: 'absolute',
      top: 0,
      [isRtl ? 'left' : 'right']: -36,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      opacity: 0,
      transition: 'opacity 0.15s',
      pointerEvents: 'none',
    }}>
      <button
        className="icon-btn"
        onClick={onAddBelow}
        style={{ width: 24, height: 24, background: 'var(--surface)', border: '1px solid var(--border)', pointerEvents: 'auto' }}
        title="הוסף / Add"
      >
        <Icon name="plus" size={12}/>
      </button>
      <button
        className="icon-btn"
        onClick={onDelete}
        style={{ width: 24, height: 24, background: 'var(--surface)', border: '1px solid var(--border)', color: '#A03030', pointerEvents: 'auto' }}
        title="מחק / Delete"
      >
        <Icon name="trash" size={12}/>
      </button>
    </div>
  );
}

window.Icon = Icon;
window.Editable = Editable;
window.AiPopover = AiPopover;
window.EditablePhoto = EditablePhoto;
window.ArrayItemControls = ArrayItemControls;
