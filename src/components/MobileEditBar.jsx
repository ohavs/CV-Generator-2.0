import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './Icon.jsx';

/**
 * Mobile text editor. On phones the A4 preview is scaled way down, so caret
 * editing inside it is painful. Tapping any Editable dispatches 'cv-edit-open'
 * and this bar slides in from the TOP of the screen (the top is never covered
 * by the virtual keyboard) with a comfortable full-width textarea.
 *
 * While open, body[data-mobile-editing] is set — the auto-prune in App.jsx
 * treats that like "an editable is focused" and won't delete the entry
 * mid-edit; CSS also hides the floating CTA.
 */
export default function MobileEditBar({ lang }) {
  const [req, setReq] = useState(null);   // {el, value, placeholder, multiline, onCommit}
  const [text, setText] = useState('');
  const taRef = useRef(null);

  const reqRef = useRef(null);
  useEffect(() => {
    const onOpen = (e) => {
      // Commit any previous edit before switching targets.
      if (reqRef.current) reqRef.current.onCommit(textRef.current);
      reqRef.current = e.detail;
      setReq(e.detail);
      setText(e.detail.value);
    };
    window.addEventListener('cv-edit-open', onOpen);
    return () => window.removeEventListener('cv-edit-open', onOpen);
  }, []);

  // Keep latest text reachable from the onOpen closure above.
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!req) return;
    document.body.setAttribute('data-mobile-editing', 'true');
    req.el?.setAttribute('data-editing', 'true');
    req.el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // Focus after the slide-in so the keyboard animation doesn't fight it.
    const t = setTimeout(() => {
      const ta = taRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    }, 80);
    return () => {
      clearTimeout(t);
      document.body.removeAttribute('data-mobile-editing');
      req.el?.removeAttribute('data-editing');
    };
  }, [req]);

  const close = useCallback((commit) => {
    if (commit && reqRef.current) reqRef.current.onCommit(textRef.current);
    reqRef.current = null;
    setReq(null);
    // Let the app run its empty-entry cleanup now that editing is done.
    setTimeout(() => window.dispatchEvent(new Event('cv-edit-closed')), 50);
  }, []);

  if (!req) return null;

  const t = lang === 'he'
    ? { done: 'סיום', cancel: 'ביטול', hint: req.placeholder || 'טקסט' }
    : { done: 'Done', cancel: 'Cancel', hint: req.placeholder || 'Text' };

  return (
    <div className="mobile-edit-bar" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="mobile-edit-bar-head">
        <span className="mobile-edit-bar-label">{t.hint}</span>
        <div className="row" style={{ gap: 6 }}>
          <button className="meb-btn meb-cancel" onClick={() => close(false)}>{t.cancel}</button>
          <button className="meb-btn meb-done" onClick={() => close(true)}>
            <Icon name="check" size={14}/> {t.done}
          </button>
        </div>
      </div>
      <textarea
        ref={taRef}
        value={text}
        rows={req.multiline ? 3 : 1}
        placeholder={t.hint}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter commits on single-line fields; never creates new entries.
          if (e.key === 'Enter' && !req.multiline) { e.preventDefault(); close(true); }
          if (e.key === 'Escape') close(false);
        }}
      />
    </div>
  );
}
