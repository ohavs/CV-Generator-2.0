import { useRef, useLayoutEffect, useSyncExternalStore } from 'react';

// Single media-query subscription shared by every Editable instance.
const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)') : null;
const subscribeMq = (cb) => { mq?.addEventListener('change', cb); return () => mq?.removeEventListener('change', cb); };
export const useIsMobile = () => useSyncExternalStore(subscribeMq, () => !!mq?.matches, () => false);

export default function Editable({
  value, onChange, multiline = false, placeholder = '',
  className = '', as = 'span', style, onFocus, onBlur,
  enableAi: _unusedAi, // legacy prop still passed by templates; swallowed here
  onKeyDown: externalKeyDown, ...rest
}) {
  const ref = useRef(null);
  const lastValRef = useRef(value);
  const isMobile = useIsMobile();

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
    if (e.defaultPrevented) return;
    // Enter never creates anything — single-line fields just commit.
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

  // On phones a scaled-down A4 page makes caret editing miserable, so tapping
  // a field opens the top edit bar (MobileEditBar) instead of the native caret.
  const openMobileEditor = () => {
    window.dispatchEvent(new CustomEvent('cv-edit-open', {
      detail: {
        el: ref.current,
        value: lastValRef.current ?? '',
        placeholder,
        multiline,
        onCommit: (v) => {
          const clean = multiline ? v : v.replace(/\n+/g, ' ').trim();
          if (ref.current) ref.current.innerText = clean;
          lastValRef.current = clean;
          onChange?.(clean);
        },
      },
    }));
  };

  const Comp = as;
  const isEmpty = !value || value.length === 0;

  return (
    <Comp
      ref={ref}
      contentEditable={!isMobile}
      suppressContentEditableWarning
      spellCheck={false}
      className={className}
      style={style}
      data-placeholder={placeholder}
      data-empty={isEmpty ? 'true' : 'false'}
      data-editable
      onClick={isMobile ? openMobileEditor : undefined}
      onBlur={isMobile ? undefined : (e) => { commit(); onBlur?.(e); }}
      onFocus={isMobile ? undefined : onFocus}
      onKeyDown={isMobile ? undefined : handleKeyDown}
      onPaste={isMobile ? undefined : handlePaste}
      {...rest}
    />
  );
}
