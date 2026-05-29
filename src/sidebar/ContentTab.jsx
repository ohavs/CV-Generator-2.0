import Icon from '../components/Icon.jsx';

export default function ContentTab({ state, setState, t }) {
  const lang = state.language;
  const data = state.data[lang];

  const blanks = {
    experience: { company: '', role: '', location: '', start: '', end: '', bullets: [''] },
    education: { school: '', degree: '', location: '', start: '', end: '', description: '' },
    projects: { name: '', description: '', tech: '', link: '' },
    skills: { category: '', items: [''] },
    languages: { name: '', level: '', dots: 3 },
    certifications: { name: '', issuer: '', date: '' },
  };

  const addItem = (key) => {
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

  const QuickAdd = ({ id, label, count }) => (
    <div className="section-row" style={{ cursor: 'default' }}>
      <span className="section-label">{label}</span>
      <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{count}</span>
      <button className="toggle-vis" onClick={() => addItem(id)} title="Add">
        <Icon name="plus" size={14}/>
      </button>
    </div>
  );

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
            ? 'לחצו על כפתור המחיקה שמופיע בעת ריחוף על פריט בתצוגה המקדימה.'
            : 'Hover any item in the preview to reveal a delete button.'}
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
