import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { entryEmpty, isBlank } from '../entryUtils.js';

export default function ContentTab({ state, setState, t }) {
  const lang = state.language;
  const data = state.data[lang];
  const [blockedKey, setBlockedKey] = useState(null);

  const blanks = {
    experience: { company: '', role: '', location: '', start: '', end: '', bullets: [''] },
    education: { school: '', degree: '', location: '', start: '', end: '', description: '' },
    projects: { name: '', description: '', tech: '', link: '' },
    skills: { category: '', items: [''] },
    languages: { name: '', level: '', dots: 3 },
    certifications: { name: '', issuer: '', date: '' },
  };

  // True when the section already has an entry the user hasn't filled in yet —
  // we refuse to stack another empty one on top of it.
  const hasEmpty = (key) => {
    if (key === 'links') return (data.personal?.links || []).some(l => isBlank(l.url));
    return (data[key] || []).some(e => entryEmpty(e, key));
  };

  const addItem = (key) => {
    // Guard: don't let the user pile up blank entries. They must fill the
    // existing empty one first. Flash a hint instead of silently doing nothing.
    if (hasEmpty(key)) {
      setBlockedKey(key);
      clearTimeout(addItem._t);
      addItem._t = setTimeout(() => setBlockedKey(null), 2400);
      return;
    }
    if (key === 'links') {
      const next = { ...state.data };
      const otherLang = lang === 'he' ? 'en' : 'he';
      const newLink = { label: 'Link', url: '', icon: 'globe' };
      next[lang] = { ...next[lang], personal: { ...next[lang].personal, links: [...(next[lang].personal.links || []), newLink] } };
      next[otherLang] = { ...next[otherLang], personal: { ...next[otherLang].personal, links: [...(next[otherLang].personal.links || []), newLink] } };
      setState({ ...state, data: next });
      return;
    }
    const blank = blanks[key];
    if (!blank) return;
    const next = { ...state.data };
    const otherLang = lang === 'he' ? 'en' : 'he';
    next[lang] = { ...next[lang], [key]: [...(next[lang][key] || []), blank] };
    next[otherLang] = { ...next[otherLang], [key]: [...(next[otherLang][key] || []), blank] };
    setState({ ...state, data: next });
  };

  const arr = (k) => (data[k] || []).length;
  const linksCount = (data.personal?.links || []).length;

  const QuickAdd = ({ id, label, count }) => {
    const blocked = blockedKey === id;
    return (
      <div className="section-row" style={{ cursor: 'default', flexWrap: 'wrap' }}>
        <span className="section-label">{label}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{count}</span>
        <button
          className="toggle-vis"
          data-blocked={blocked || undefined}
          onClick={() => addItem(id)}
          title="Add"
        >
          <Icon name="plus" size={14}/>
        </button>
        {blocked && (
          <div style={{ flexBasis: '100%', fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>
            {lang === 'he' ? 'מלאו קודם את הפריט הריק שכבר נוסף' : 'Fill the empty item you already added first'}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'הוספה מהירה' : 'Quick add'}</h3>
        <div className="section-list">
          <QuickAdd id="experience" label={t.sections.experience} count={arr('experience')}/>
          <QuickAdd id="education" label={t.sections.education} count={arr('education')}/>
          <QuickAdd id="projects" label={t.sections.projects} count={arr('projects')}/>
          <QuickAdd id="skills" label={t.sections.skills} count={arr('skills')}/>
          <QuickAdd id="languages" label={t.sections.languages} count={arr('languages')}/>
          <QuickAdd id="certifications" label={t.sections.certifications} count={arr('certifications')}/>
          <QuickAdd id="links" label={t.sections.links} count={linksCount}/>
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'מחיקת פריטים' : 'Remove items'}</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'כדי למחוק פריט — מחקו את הטקסט שבו בתצוגה המקדימה. ברגע שהוא נשאר ריק, הוא יוסר אוטומטית. פריטים ריקים שלא מילאתם נמחקים מעצמם.'
            : 'To remove an item, clear its text in the preview. Once it’s empty it’s removed automatically — blank items you never filled clean themselves up.'}
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">AI</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'בעת מיקוד בתקציר או בבולט — מופיע מעל כפתור שיפור (AI).'
            : 'When focused on a summary or bullet, an AI popover appears — Polish, Shorten, or Expand.'}
        </div>
      </div>
    </>
  );
}
