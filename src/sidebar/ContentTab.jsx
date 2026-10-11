import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { entryEmpty, linkEmpty } from '../entryUtils.js';
import PhraseBank from './PhraseBank.jsx';
import { labelsFor } from '../templates/helpers.js';

export default function ContentTab({ state, setState, t: uiT, onAddJump }) {
  const lang = state.language;
  const data = state.data[lang];
  const t = { ...uiT, sections: labelsFor(lang, data).sections }; // renamed sections read as renamed
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
  // we jump them to it instead of stacking another empty one on top.
  const hasEmpty = (key) => {
    if (key === 'links') return (data.personal?.links || []).some(linkEmpty);
    return (data[key] || []).some(e => entryEmpty(e, key));
  };

  const addItem = (key) => {
    // Guard: never pile up blank entries. If one is already waiting, take the
    // user straight to it in the preview instead of adding another.
    if (hasEmpty(key)) {
      setBlockedKey(key);
      clearTimeout(addItem._t);
      addItem._t = setTimeout(() => setBlockedKey(null), 2000);
      onAddJump?.(key);
      return;
    }
    if (key === 'links') {
      // Only in the language being edited: a blank copy in the other one
      // would sit there unseen, then surface as an empty row on switching.
      const next = { ...state.data };
      const newLink = { label: 'Link', url: '', icon: 'globe' };
      next[lang] = { ...next[lang], personal: { ...next[lang].personal, links: [...(next[lang].personal.links || []), newLink] } };
      setState({ ...state, data: next });
      onAddJump?.(key);
      return;
    }
    const blank = blanks[key];
    if (!blank) return;
    const next = { ...state.data };
    next[lang] = { ...next[lang], [key]: [...(next[lang][key] || []), blank] };
    setState({ ...state, data: next });
    onAddJump?.(key);
  };

  // − removes an item only while it's empty: a row added by mistake, or one
  // left blank. Filled items are never removed from here.
  const removeEmpty = (key) => {
    const next = { ...state.data };
    if (key === 'links') {
      const links = data.personal?.links || [];
      const idx = links.findLastIndex(linkEmpty);
      if (idx < 0) return;
      next[lang] = { ...data, personal: { ...data.personal, links: links.filter((_, i) => i !== idx) } };
    } else {
      const list = data[key] || [];
      const idx = list.findLastIndex(e => entryEmpty(e, key));
      if (idx < 0) return;
      next[lang] = { ...data, [key]: list.filter((_, i) => i !== idx) };
    }
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
          disabled={!hasEmpty(id)}
          onClick={() => removeEmpty(id)}
          title={lang === 'he' ? 'הסרת פריט ריק' : 'Remove an empty item'}
          aria-label={lang === 'he' ? 'הסרת פריט ריק' : 'Remove an empty item'}
        >
          <Icon name="minus" size={14}/>
        </button>
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
            {lang === 'he' ? 'יש כבר פריט ריק — קפצנו אליו, מלאו אותו קודם' : 'There’s already an empty item — we jumped to it, fill it first'}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'הוספת פריטים' : 'Add items'}</h3>
        <div className="section-list">
          <QuickAdd id="experience" label={t.sections.experience} count={arr('experience')}/>
          <QuickAdd id="education" label={t.sections.education} count={arr('education')}/>
          <QuickAdd id="projects" label={t.sections.projects} count={arr('projects')}/>
          <QuickAdd id="skills" label={t.sections.skills} count={arr('skills')}/>
          <QuickAdd id="languages" label={t.sections.languages} count={arr('languages')}/>
          <QuickAdd id="certifications" label={t.sections.certifications} count={arr('certifications')}/>
          <QuickAdd id="links" label={t.sections.links} count={linksCount}/>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 8, lineHeight: 1.5 }}>
          {lang === 'he'
            ? '+ מוסיף פריט וקופץ אליו בתצוגה. − מסיר פריט ריק (פריט מלא לא יימחק מכאן).'
            : '+ adds an item and jumps to it in the preview. − removes an empty one (filled items are never removed here).'}
        </div>
      </div>

      <PhraseBank state={state} setState={setState} onAddJump={onAddJump}/>

      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'מחיקת פריטים' : 'Remove items'}</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'כדי למחוק פריט — מחקו את הטקסט שלו בתצוגה. פריט שנשאר ריק נעלם מעצמו.'
            : 'To remove an item, clear its text in the preview. Empty items disappear on their own.'}
        </div>
      </div>
    </>
  );
}
