import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { entryEmpty, linkEmpty } from '../entryUtils.js';
import PhraseBank from './PhraseBank.jsx';

export default function ContentTab({ state, setState, t, onAddJump }) {
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
      const next = { ...state.data };
      const otherLang = lang === 'he' ? 'en' : 'he';
      const newLink = { label: 'Link', url: '', icon: 'globe' };
      next[lang] = { ...next[lang], personal: { ...next[lang].personal, links: [...(next[lang].personal.links || []), newLink] } };
      next[otherLang] = { ...next[otherLang], personal: { ...next[otherLang].personal, links: [...(next[otherLang].personal.links || []), newLink] } };
      setState({ ...state, data: next });
      onAddJump?.(key);
      return;
    }
    const blank = blanks[key];
    if (!blank) return;
    const next = { ...state.data };
    const otherLang = lang === 'he' ? 'en' : 'he';
    next[lang] = { ...next[lang], [key]: [...(next[lang][key] || []), blank] };
    next[otherLang] = { ...next[otherLang], [key]: [...(next[otherLang][key] || []), blank] };
    setState({ ...state, data: next });
    onAddJump?.(key);
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
            ? 'לחיצה על + מוסיפה פריט וקופצת אליו בתצוגה למילוי מיידי.'
            : 'Tapping + adds an item and jumps to it in the preview.'}
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
