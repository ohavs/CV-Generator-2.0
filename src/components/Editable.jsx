import { useRef, useLayoutEffect, useSyncExternalStore } from 'react';

// Single media-query subscription shared by every Editable instance.
const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)') : null;
const subscribeMq = (cb) => { mq?.addEventListener('change', cb); return () => mq?.removeEventListener('change', cb); };
export const useIsMobile = () => useSyncExternalStore(subscribeMq, () => !!mq?.matches, () => false);

// A field written entirely in one script is isolated in that direction, so an
// e-mail, phone number or English company name inside a Hebrew CV keeps its
// own order ("+972 52-123-4567", not "52-123-4567 972+") and its trailing
// punctuation stays where it belongs. Mixed lines follow the page.
const RTL_CHARS = /[\u0590-\u05FF\u0600-\u06FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
const LTR_CHARS = /[A-Za-z\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF]/;
export function textDir(v) {
  if (!v) return undefined;
  const rtl = RTL_CHARS.test(v), ltr = LTR_CHARS.test(v);
  if (rtl && !ltr) return 'rtl';
  if (ltr && !rtl) return 'ltr';
  if (!rtl && !ltr && /[0-9@+]/.test(v)) return 'ltr';
  return undefined;
}

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
      dir={textDir(value)}
      onClick={isMobile ? openMobileEditor : undefined}
      onBlur={isMobile ? undefined : (e) => { commit(); onBlur?.(e); }}
      onFocus={isMobile ? undefined : onFocus}
      onKeyDown={isMobile ? undefined : handleKeyDown}
      onPaste={isMobile ? undefined : handlePaste}
      {...rest}
    />
  );
}
