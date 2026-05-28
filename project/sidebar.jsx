// Right-side controls panel. Tabs: Sections, Design.
// (Content editing happens directly in the preview via contenteditable.)
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

function Sidebar({ state, setState, isMobileOpen, onCloseMobile, onExport, saving }) {
  const t = window.CV_I18N[state.language];
  const [tab, setTab] = useStateS('design');

  return (
    <aside className="sidebar" data-open={isMobileOpen} dir={state.language === 'he' ? 'rtl' : 'ltr'}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-mark">{state.language === 'he' ? 'ק' : 'k'}</div>
          <div>
            <div className="brand-name">{t.appName}</div>
            <div className="brand-sub">{t.appSub}</div>
          </div>
        </div>
        <div className="row">
          <SaveBadge saving={saving} t={t}/>
          <button className="icon-btn" onClick={onCloseMobile} title="Close" style={{ display: 'var(--mobile-close-display, none)' }}>
            <Icon name="x" size={16}/>
          </button>
        </div>
      </div>

      <div className="sidebar-tabs">
        <button className="tab-btn" data-active={tab === 'design'} onClick={() => setTab('design')}>
          <Icon name="palette" size={13}/> {t.tabs.design}
        </button>
        <button className="tab-btn" data-active={tab === 'sections'} onClick={() => setTab('sections')}>
          <Icon name="layers" size={13}/> {t.tabs.sections}
        </button>
        <button className="tab-btn" data-active={tab === 'content'} onClick={() => setTab('content')}>
          <Icon name="edit" size={13}/> {t.tabs.content}
        </button>
      </div>

      <div className="sidebar-body">
        {tab === 'design' && <DesignTab state={state} setState={setState} t={t}/>}
        {tab === 'sections' && <SectionsTab state={state} setState={setState} t={t}/>}
        {tab === 'content' && <ContentTab state={state} setState={setState} t={t}/>}
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-ghost" onClick={() => {
          if (confirm(state.language === 'he' ? 'לאפס לדמו ברירת מחדל?' : 'Reset to demo data?')) {
            setState({ ...window.CV_DEFAULT_STATE });
          }
        }}>
          <Icon name="trash" size={13}/>
          {state.language === 'he' ? 'איפוס' : 'Reset'}
        </button>
        <button className="btn btn-primary" onClick={onExport}>
          <Icon name="download" size={13}/>
          {t.labels.export}
        </button>
      </div>
    </aside>
  );
}

function SaveBadge({ saving, t }) {
  return (
    <span className="save-badge">
      <span className={'dot ' + (saving ? 'saving' : '')}/>
      {saving ? t.labels.saving : t.labels.saved}
    </span>
  );
}

/* ============== DESIGN TAB ============== */
function DesignTab({ state, setState, t }) {
  const lang = state.language;

  return (
    <>
      {/* Templates */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.template}</h3>
        <div className="template-grid">
          {window.CV_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              className="template-tile"
              data-active={state.template === tpl.id}
              onClick={() => setState({ ...state, template: tpl.id })}
              title={tpl.name[lang]}
            >
              <TemplateThumb id={tpl.id} accent={state.accent}/>
              <span className="template-tile-name">{tpl.name[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.accent}</h3>
        <div className="panel-card">
          <div className="swatch-row">
            {window.CV_ACCENT_PALETTE.map(c => (
              <button
                key={c}
                className="swatch"
                data-active={state.accent === c}
                style={{ background: c }}
                onClick={() => setState({ ...state, accent: c })}
              />
            ))}
            <label className="swatch" style={{ background: 'conic-gradient(red, yellow, green, blue, red)', position: 'relative', cursor: 'pointer' }}>
              <input
                type="color"
                value={state.accent}
                onChange={(e) => setState({ ...state, accent: e.target.value })}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.font}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {window.CV_FONT_PRESETS.map(f => (
            <button
              key={f.id}
              className="font-tile"
              data-active={state.fontPreset === f.id}
              onClick={() => setState({ ...state, fontPreset: f.id })}
            >
              <span className="font-tile-sample" style={{ fontFamily: f.heading }}>
                {lang === 'he' ? 'אבגד · Aa' : 'Aa · אבגד'}
              </span>
              <span className="font-tile-name">{f.name[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Direction + Language */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.language}</h3>
        <div className="panel-card">
          <div className="field-row">
            <label>{t.labels.direction}</label>
            <div className="seg">
              <button data-active={state.language === 'he'} onClick={() => setState({ ...state, language: 'he' })}>עברית</button>
              <button data-active={state.language === 'en'} onClick={() => setState({ ...state, language: 'en' })}>English</button>
            </div>
          </div>
          <div className="field-row">
            <label>{t.labels.darkMode}</label>
            <button
              className="seg"
              onClick={() => setState({ ...state, darkEdit: !state.darkEdit })}
              style={{ background: 'transparent', padding: 0, gap: 6 }}
            >
              <span className="seg" style={{ padding: 3 }}>
                <span data-active={!state.darkEdit} style={{ padding: '5px 10px', borderRadius: 6, background: !state.darkEdit ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 4, boxShadow: !state.darkEdit ? 'var(--shadow-sm)' : 'none' }}>
                  <Icon name="sun" size={13}/>
                </span>
                <span data-active={state.darkEdit} style={{ padding: '5px 10px', borderRadius: 6, background: state.darkEdit ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 4, boxShadow: state.darkEdit ? 'var(--shadow-sm)' : 'none' }}>
                  <Icon name="moon" size={13}/>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============== SECTIONS TAB ============== */
function SectionsTab({ state, setState, t }) {
  const lang = state.language;
  const [draggingIdx, setDraggingIdx] = useStateS(null);
  const [hoverIdx, setHoverIdx] = useStateS(null);

  const toggleVis = (idx) => {
    const next = state.sections.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s);
    setState({ ...state, sections: next });
  };

  const move = (from, to) => {
    if (from === to) return;
    const next = [...state.sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setState({ ...state, sections: next });
  };

  return (
    <>
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'גרירה לסידור · עין להסתרה' : 'Drag to reorder · eye to hide'}</h3>
        <div className="section-list">
          {state.sections.map((s, i) => (
            <div
              key={s.id}
              className="section-row"
              data-hidden={!s.visible}
              data-dragging={draggingIdx === i}
              draggable
              onDragStart={() => setDraggingIdx(i)}
              onDragEnd={() => { setDraggingIdx(null); setHoverIdx(null); }}
              onDragOver={(e) => { e.preventDefault(); setHoverIdx(i); }}
              onDrop={(e) => { e.preventDefault(); if (draggingIdx != null) move(draggingIdx, i); }}
              style={hoverIdx === i && draggingIdx !== null ? { borderColor: 'var(--accent)' } : {}}
            >
              <span className="drag-handle"><Icon name="drag" size={14}/></span>
              <span className="section-label">{t.sections[s.id]}</span>
              <button className="toggle-vis" onClick={() => toggleVis(i)} title={s.visible ? 'Hide' : 'Show'}>
                <Icon name={s.visible ? 'eye' : 'eye-off'} size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'הוספה ושינוי' : 'Add & manage'}</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'לעריכה — לחצו פעמיים על כל טקסט בתצוגה המקדימה. להוספת פריטים חדשים (משרה, פרויקט וכו׳) — בלשונית "תוכן".'
            : 'To edit — double-click any text in the preview. To add new items (jobs, projects…) — use the "Content" tab.'}
        </div>
      </div>
    </>
  );
}

/* ============== CONTENT TAB ============== */
// Quick add/remove + jump-to controls for each section's array items.
function ContentTab({ state, setState, t }) {
  const lang = state.language;
  const data = state.data[lang];

  const updateArray = (key, mutator) => {
    const next = { ...state.data };
    next[lang] = { ...data, [key]: mutator(data[key] || []) };
    // also mirror to other language with empty stubs so structure stays in sync
    const other = lang === 'he' ? 'en' : 'he';
    next[other] = { ...state.data[other], [key]: mutator(state.data[other][key] || []) };
    setState({ ...state, data: next });
  };

  const blanks = {
    experience: { he: { company: '', role: '', location: '', start: '', end: '', bullets: [''] },
                  en: { company: '', role: '', location: '', start: '', end: '', bullets: [''] } },
    education: { he: { school: '', degree: '', location: '', start: '', end: '', description: '' },
                 en: { school: '', degree: '', location: '', start: '', end: '', description: '' } },
    projects: { he: { name: '', description: '', tech: '', link: '' },
                en: { name: '', description: '', tech: '', link: '' } },
    skills: { he: { category: '', items: [''] }, en: { category: '', items: [''] } },
    languages: { he: { name: '', level: '', dots: 3 }, en: { name: '', level: '', dots: 3 } },
    certifications: { he: { name: '', issuer: '', date: '' }, en: { name: '', issuer: '', date: '' } },
  };

  const addLinks = () => {
    const next = { ...state.data };
    next[lang] = { ...data, personal: { ...data.personal, links: [...(data.personal.links || []), { label: 'Link', url: '', icon: 'globe' }] } };
    const other = lang === 'he' ? 'en' : 'he';
    next[other] = { ...state.data[other], personal: { ...state.data[other].personal, links: [...(state.data[other].personal.links || []), { label: 'Link', url: '', icon: 'globe' }] } };
    setState({ ...state, data: next });
  };

  const QuickAdd = ({ id, label, count }) => (
    <div className="section-row" style={{ cursor: 'default' }}>
      <span className="section-label">{label}</span>
      <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{count}</span>
      <button className="toggle-vis" onClick={() => {
        if (id === 'links') return addLinks();
        // add for both langs
        const nextData = { ...state.data };
        const blank = blanks[id];
        if (!blank) return;
        const otherLang = lang === 'he' ? 'en' : 'he';
        nextData[lang] = { ...nextData[lang], [id]: [...(nextData[lang][id] || []), blank[lang]] };
        nextData[otherLang] = { ...nextData[otherLang], [id]: [...(nextData[otherLang][id] || []), blank[otherLang]] };
        setState({ ...state, data: nextData });
      }} title="Add">
        <Icon name="plus" size={14}/>
      </button>
    </div>
  );

  const arr = (k) => (data[k] || []).length;
  const linksCount = (data.personal?.links || []).length;

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
            ? 'רחפו מעל כל פריט בתצוגה המקדימה כדי לראות כפתור מחיקה. גם Backspace בשורה ריקה ימחק.'
            : 'Hover any item in the preview to reveal a delete button. Backspace on an empty line also removes.'}
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">AI</h3>
        <div className="panel-card" style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          {lang === 'he'
            ? 'בעת מיקוד בתקציר או בבולט — מופיע מעל הכפתור שיפור (AI). לחצו כדי לשפר, לקצר או להרחיב.'
            : 'When focused on a summary or bullet, an AI popover appears — Polish, Shorten, or Expand.'}
        </div>
      </div>
    </>
  );
}

/* ============== TEMPLATE THUMBNAILS ============== */
// Tiny SVG previews per template
function TemplateThumb({ id, accent }) {
  const W = 60, H = 80;
  const common = { width: '100%', height: '100%', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' };
  const txt = (y, w = 40, color = '#CFCBC2') =>
    <rect x="10" y={y} width={w} height="1.5" fill={color}/>;

  switch (id) {
    case 'classic':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x={W/2} y="14" fontSize="6" fontFamily="serif" textAnchor="middle" fill="#1A1A1A" fontWeight="500">Name</text>
          <text x={W/2} y="19" fontSize="2.5" textAnchor="middle" fill={accent} letterSpacing="0.3">TITLE</text>
          <line x1="10" y1="23" x2={W-10} y2="23" stroke="#1A1A1A" strokeWidth="0.5"/>
          {[30, 50].map(y => <g key={y}>
            <text x="10" y={y} fontSize="3" fontWeight="600" fill={accent}>•</text>
            <line x1="14" y1={y-1} x2={W-10} y2={y-1} stroke="#1A1A1A" strokeWidth="0.3"/>
            {txt(y+3)}{txt(y+6, 35)}{txt(y+9, 30)}
          </g>)}
        </svg>
      );
    case 'minimal':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="10" y="20" fontSize="7" fontFamily="serif" fill="#1A1A1A" fontWeight="400">Name</text>
          {[34, 50, 66].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2" fill="#999" letterSpacing="0.5">SECTION</text>
            {txt(y+3, 30)}{txt(y+6, 38)}{txt(y+9, 25)}
          </g>)}
        </svg>
      );
    case 'sidebar':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <rect width={20} height={H} fill={accent}/>
          <circle cx="10" cy="13" r="5" fill="rgba(255,255,255,0.3)"/>
          {[24, 38, 52, 66].map(y => <rect key={y} x="3" y={y} width="14" height="1" fill="rgba(255,255,255,0.5)"/>)}
          {[24, 38, 52, 66].map(y => <g key={y}>
            <rect x="24" y={y-2} width="3" height="1" fill={accent}/>
            <rect x="24" y={y+1} width="30" height="1" fill="#CFCBC2"/>
            <rect x="24" y={y+4} width="26" height="1" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'technical':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          {Array.from({length: 12}).map((_, i) =>
            <line key={i} x1="0" y1={6 + i*6} x2={W} y2={6 + i*6} stroke="#F0EDE5" strokeWidth="0.3"/>
          )}
          <text x="10" y="15" fontSize="6" fontFamily="monospace" fontWeight="700" fill="#1A1A1A">Name</text>
          <text x="10" y="22" fontSize="2.5" fontFamily="monospace" fill={accent}>## role</text>
          {[30, 44, 58, 72].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2.5" fontFamily="monospace" fill={accent}>##</text>
            <text x="15" y={y} fontSize="2.5" fontFamily="monospace" fill="#666">section</text>
            <text x="10" y={y+5} fontSize="2.5" fontFamily="monospace" fill={accent}>›</text>
            <rect x="14" y={y+3} width="38" height="1" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'academic':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x={W/2} y="13" fontSize="5" fontFamily="serif" textAnchor="middle" fill="#1A1A1A">Name</text>
          <text x={W/2} y="17" fontSize="2.5" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#666">Title</text>
          {[26, 40, 54, 68].map((y, idx) => <g key={y}>
            <text x="10" y={y} fontSize="3" fontFamily="serif" fontWeight="600" fill={accent}>{String(idx+1).padStart(2,'0')}</text>
            <text x="17" y={y} fontSize="3" fontFamily="serif" fontWeight="600" fill="#1A1A1A">Section</text>
            <line x1="10" y1={y+1.5} x2={W-10} y2={y+1.5} stroke="#1A1A1A" strokeWidth="0.4"/>
            {txt(y+4)}{txt(y+7, 38)}
          </g>)}
        </svg>
      );
    case 'editorial':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="10" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">N</text>
          <text x="20" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">a</text>
          <text x="29" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">m</text>
          <text x="40" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">e</text>
          <text x="10" y="28" fontSize="3" fontFamily="serif" fontStyle="italic" fill={accent}>title</text>
          <line x1="10" y1="32" x2={W-10} y2="32" stroke="#1A1A1A" strokeWidth="0.3"/>
          {/* two columns */}
          {[40, 52, 64].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2" fill={accent} letterSpacing="0.3">SECTION</text>
            <rect x="10" y={y+2} width="18" height="0.8" fill="#CFCBC2"/>
            <rect x="10" y={y+4} width="15" height="0.8" fill="#CFCBC2"/>
            <text x="32" y={y} fontSize="2" fill={accent} letterSpacing="0.3">SECTION</text>
            <rect x="32" y={y+2} width="18" height="0.8" fill="#CFCBC2"/>
            <rect x="32" y={y+4} width="14" height="0.8" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    default: return null;
  }
}

window.Sidebar = Sidebar;
window.TemplateThumb = TemplateThumb;
