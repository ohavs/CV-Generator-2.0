import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CONTENT_DOMAINS, CONTENT_BANK } from '../contentBank.js';

const T = {
  he: {
    title: 'ניסוחים מוכנים',
    hint: 'בחרו תחום, הקישו על ניסוח כדי להכניס אותו — ואז התאימו את הפרטים בסוגריים.',
    summaries: 'תקציר',
    bullets: 'שורות ניסיון',
    added: 'נוסף ✓',
    overwrite: 'להחליף את התקציר הקיים?',
  },
  en: {
    title: 'Ready-made phrasing',
    hint: 'Pick a field, tap a phrase to insert it — then personalize the bracketed parts.',
    summaries: 'Summary',
    bullets: 'Experience lines',
    added: 'Added ✓',
    overwrite: 'Replace the existing summary?',
  },
};

export default function PhraseBank({ state, setState, onAddJump }) {
  const lang = state.language;
  const t = T[lang] || T.he;
  const [domain, setDomain] = useState(null);
  const [justAdded, setJustAdded] = useState(null); // 'sum-0' / 'bul-3'

  const bank = domain ? CONTENT_BANK[domain]?.[lang] : null;

  const flash = (key) => {
    setJustAdded(key);
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setJustAdded(null), 1600);
  };

  // Phrases are language-specific, so they go into the current language only.
  const setLangData = (updater) => {
    const next = { ...state.data, [lang]: updater(state.data[lang]) };
    setState({ ...state, data: next });
  };

  const insertSummary = (text, key) => {
    const current = (state.data[lang].summary || '').trim();
    if (current && current !== text && !confirm(t.overwrite)) return;
    setLangData(d => ({ ...d, summary: text }));
    flash(key);
    onAddJump?.('summary');
  };

  // Bullets land in the topmost (most recent) experience entry; if there are
  // no entries yet, one is created around the bullet.
  const insertBullet = (text, key) => {
    setLangData(d => {
      const exp = [...(d.experience || [])];
      if (exp.length === 0) {
        exp.push({ company: '', role: '', location: '', start: '', end: '', bullets: [text] });
      } else {
        const first = exp[0];
        const bullets = [...(first.bullets || []).filter(b => (b ?? '').trim() !== ''), text];
        exp[0] = { ...first, bullets };
      }
      return { ...d, experience: exp };
    });
    flash(key);
    onAddJump?.('experience');
  };

  return (
    <div className="panel-group">
      <h3 className="panel-title">{t.title}</h3>
      <div className="phrase-chips">
        {CONTENT_DOMAINS.map(d => (
          <button
            key={d.id}
            className="phrase-chip"
            data-active={domain === d.id}
            onClick={() => setDomain(domain === d.id ? null : d.id)}
          >
            {d[lang] || d.he}
          </button>
        ))}
      </div>

      {!domain && (
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 8, lineHeight: 1.5 }}>
          {t.hint}
        </div>
      )}

      {bank && (
        <>
          <div className="phrase-subtitle">{t.summaries}</div>
          <div className="phrase-list">
            {bank.summaries.map((s, i) => {
              const key = 'sum-' + i;
              return (
                <button key={key} className="phrase-card" data-added={justAdded === key} onClick={() => insertSummary(s, key)}>
                  <span className="phrase-text">{s}</span>
                  <span className="phrase-add">{justAdded === key ? t.added : <Icon name="plus" size={13}/>}</span>
                </button>
              );
            })}
          </div>

          <div className="phrase-subtitle">{t.bullets}</div>
          <div className="phrase-list">
            {bank.bullets.map((b, i) => {
              const key = 'bul-' + i;
              return (
                <button key={key} className="phrase-card" data-added={justAdded === key} onClick={() => insertBullet(b, key)}>
                  <span className="phrase-text">{b}</span>
                  <span className="phrase-add">{justAdded === key ? t.added : <Icon name="plus" size={13}/>}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
