import { useRef, useLayoutEffect } from 'react';

export default function Editable({
  value, onChange, multiline = false, placeholder = '',
  className = '', as = 'span', style, onFocus, onBlur,
  enableAi = false, onKeyDown: externalKeyDown, ...rest
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
    externalKeyDown?.(e);
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
