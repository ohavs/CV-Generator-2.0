import { useState, useEffect, useLayoutEffect } from 'react';
import Icon from './Icon.jsx';

async function claudeComplete(prompt) {
  const key = localStorage.getItem('anthropic_api_key');
  if (!key) {
    alert(document.documentElement.lang === 'he'
      ? 'הזינו Anthropic API Key בהגדרות'
      : 'Enter your Anthropic API Key in settings');
    return '';
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

export default function AiPopover({ language }) {
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
    const onBlur = () => {
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
      const result = await claudeComplete(`${directive}\n\nText:\n${original}`);
      const cleaned = (result || '').trim().replace(/^["'״׳]|["'״׳]$/g, '');
      if (cleaned) {
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
    <div
      className="ai-pop"
      style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
      onMouseDown={(e) => e.preventDefault()}
    >
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
