/* ============================================================
   5. ACADEMIC — Dense serif, numbered sections, formal
   ============================================================ */
function AcademicTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = window.CV_I18N[lang];
  const isRtl = lang === 'he';

  const visible = visibleIds(sections);
  let secNum = 0;

  const Section = ({ id, title, children }) => {
    if (id !== 'personal') secNum++;
    return (
      <section data-section={id} style={{ marginBottom: 16 }}>
        <h2 style={{
          fontFamily: 'var(--cv-heading)', fontSize: 13.5, fontWeight: 600,
          margin: '0 0 7px', color: '#1A1A1A',
          paddingBottom: 4, borderBottom: '1px solid #1A1A1A',
          letterSpacing: '0.01em',
        }}>
          <span style={{ color: accent, marginInlineEnd: 8 }}>{String(secNum).padStart(2, '0')}</span>
          {title}
        </h2>
        {children}
      </section>
    );
  };

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 22, textAlign: 'center' }}>
        <Editable as="h1" {...F(['personal','name'])}
          style={{
            fontFamily: 'var(--cv-heading)', fontSize: 28, fontWeight: 500,
            margin: 0, color: '#1A1A1A', letterSpacing: '0.005em',
          }}/>
        <Editable as="div" {...F(['personal','title'])}
          style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 13, color: '#555', marginTop: 2 }}/>
        <div style={{ marginTop: 8, fontSize: 10.5, color: '#444', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Editable {...F(['personal','email'])}/>
          <span>·</span>
          <Editable {...F(['personal','phone'])}/>
          <span>·</span>
          <Editable {...F(['personal','location'])}/>
        </div>
        {(data.personal?.links || []).length > 0 && (
          <div style={{ marginTop: 4, fontSize: 10.5, color: accent, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {(data.personal?.links || []).map((l, i) => (
              <Editable key={i} value={l.url} onChange={(v) => onEdit(['personal','links',i,'url'], v)}/>
            ))}
          </div>
        )}
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })} as="p"
          style={{ margin: 0, fontSize: 11, lineHeight: 1.55, color: '#1A1A1A', textAlign: 'justify', textWrap: 'pretty', textIndent: '1.2em' }}/>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education || []).map((e, i) => (
          <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em', marginBottom: 6, fontSize: 11, lineHeight: 1.5 }}>
            <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
            <Editable value={e.degree} onChange={(v) => onEdit(['education',i,'degree'], v)} style={{ fontWeight: 600 }}/>
            <span>, </span>
            <Editable value={e.school} onChange={(v) => onEdit(['education',i,'school'], v)} style={{ fontStyle: 'italic' }}/>
            <span>, </span>
            <span style={{ color: '#555' }}>{formatRange(e.start, e.end, lang)}</span>
            {e.description && <div style={{ textIndent: 0, fontSize: 10.5, color: '#444', marginTop: 1 }}>
              <Editable value={e.description} onChange={(v) => onEdit(['education',i,'description'], v)} multiline enableAi/>
            </div>}
          </div>
        ))}
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        {(data.experience || []).map((j, i) => (
          <div key={i} style={{ marginBottom: 10, fontSize: 11, lineHeight: 1.55 }}>
            <div style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em' }}>
              <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
              <Editable value={j.role} onChange={(v) => onEdit(['experience',i,'role'], v)} style={{ fontWeight: 600 }}/>
              <span>, </span>
              <Editable value={j.company} onChange={(v) => onEdit(['experience',i,'company'], v)} style={{ fontStyle: 'italic' }}/>
              <span style={{ color: '#555' }}> ({formatRange(j.start, j.end, lang)})</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '2px 0 0 1.5em', fontSize: 10.5 }}>
              {(j.bullets || ['']).map((b, k) => (
                <li key={k} style={{ paddingInlineStart: '1em', textIndent: '-1em', marginBottom: 1 }}>
                  <span style={{ color: '#888', marginInlineEnd: 6 }}>—</span>
                  <Editable
                    value={b}
                    onChange={(v) => onEdit(['experience',i,'bullets'], (j.bullets || []).map((bb, kk) => kk === k ? v : bb))}
                    multiline enableAi
                    placeholder={t.labels.bulletPlaceholder}
                    style={{ color: '#262626' }}/>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects || []).map((p, i) => (
          <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em', marginBottom: 6, fontSize: 11 }}>
            <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
            <Editable value={p.name} onChange={(v) => onEdit(['projects',i,'name'], v)} style={{ fontWeight: 600 }}/>
            <span> — </span>
            <Editable value={p.description} onChange={(v) => onEdit(['projects',i,'description'], v)} multiline enableAi/>
            {p.link && <>
              <span> </span>
              <Editable value={p.link} onChange={(v) => onEdit(['projects',i,'link'], v)} style={{ color: accent, fontStyle: 'italic' }}/>
            </>}
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ fontSize: 11, lineHeight: 1.55 }}>
          {(data.skills || []).map((sk, i) => (
            <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em' }}>
              <span style={{ fontWeight: 600 }}>
                <Editable value={sk.category} onChange={(v) => onEdit(['skills',i,'category'], v)}/>:
              </span>{' '}
              <Editable
                value={(sk.items || []).join(', ')}
                onChange={(v) => onEdit(['skills',i,'items'], v.split(/\s*,\s*/))}
                style={{ color: '#333' }}
              />.
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ fontSize: 11, lineHeight: 1.55 }}>
          {(data.languages || []).map((l, i) => (
            <span key={i}>
              <Editable value={l.name} onChange={(v) => onEdit(['languages',i,'name'], v)} style={{ fontWeight: 600 }}/>
              <span> (</span>
              <Editable value={l.level} onChange={(v) => onEdit(['languages',i,'level'], v)} style={{ fontStyle: 'italic' }}/>
              <span>)</span>
              {i < (data.languages.length - 1) && <span>; </span>}
            </span>
          ))}
        </div>
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications || []).map((c, i) => (
          <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em', marginBottom: 3, fontSize: 11 }}>
            <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
            <Editable value={c.name} onChange={(v) => onEdit(['certifications',i,'name'], v)} style={{ fontWeight: 600 }}/>
            <span>, </span>
            <Editable value={c.issuer} onChange={(v) => onEdit(['certifications',i,'issuer'], v)} style={{ fontStyle: 'italic' }}/>
            <span>, </span>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications',i,'date'], v)} style={{ color: '#555' }}/>.
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
          style={{ fontSize: 11, color: '#333', lineHeight: 1.55, textAlign: 'justify' }}/>
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{
      padding: '20mm 22mm',
      fontFamily: 'var(--cv-heading)', // serif body in academic
      color: '#1A1A1A',
      direction: isRtl ? 'rtl' : 'ltr',
      background: 'white',
    }}>
      {visible.map(id => renderMap[id] ? renderMap[id]() : null)}
    </div>
  );
}

window.AcademicTemplate = AcademicTemplate;


/* ============================================================
   6. EDITORIAL — Magazine-style, dramatic serif, two-col body
   ============================================================ */
function EditorialTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = window.CV_I18N[lang];
  const isRtl = lang === 'he';
  const visible = visibleIds(sections);

  const Section = ({ id, title, children, span = 1 }) => (
    <section data-section={id} style={{ marginBottom: 16, breakInside: 'avoid', gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h2 style={{
          fontFamily: 'var(--cv-heading)', fontSize: 11, fontWeight: 600,
          margin: 0, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>{title}</h2>
        <span style={{ flex: 1, height: 1, background: accent, opacity: 0.4 }}/>
      </div>
      {children}
    </section>
  );

  const renderPersonal = () => (
    <header key="personal" style={{
      marginBottom: 22,
      paddingBottom: 18,
      borderBottom: `0.5px solid #1A1A1A`,
    }}>
      <div style={{ fontFamily: 'var(--cv-body)', fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>
        {isRtl ? '— קורות חיים —' : '— curriculum vitae —'}
      </div>
      <Editable as="h1" {...F(['personal','name'])}
        style={{
          fontFamily: 'var(--cv-heading)',
          fontSize: 64, fontWeight: 400, fontStyle: 'normal',
          margin: 0, lineHeight: 0.95, letterSpacing: '-0.035em',
          color: '#1A1A1A',
        }}/>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <Editable {...F(['personal','title'])}
          as="div"
          style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 17, color: accent }}/>
        <span style={{ flex: 1 }}/>
        <div style={{ fontSize: 10, color: '#555', display: 'flex', gap: 10, fontFamily: 'var(--cv-body)' }}>
          <Editable {...F(['personal','email'])}/>
          <span>·</span>
          <Editable {...F(['personal','phone'])}/>
          <span>·</span>
          <Editable {...F(['personal','location'])}/>
        </div>
      </div>
    </header>
  );

  const renderSummary = () => {
    const txt = data.summary || '';
    const firstChar = (txt.trim()[0]) || '';
    return (
      <Section key="summary" id="summary" title={t.sections.summary} span={2}>
        <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })}
          as="p"
          style={{
            margin: 0,
            fontFamily: 'var(--cv-heading)',
            fontSize: 16, lineHeight: 1.45,
            color: '#1A1A1A',
            textWrap: 'pretty',
            fontStyle: 'italic',
            fontWeight: 400,
          }}/>
      </Section>
    );
  };

  const renderExperience = () => (
    <Section key="experience" id="experience" title={t.sections.experience} span={2}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(data.experience || []).map((j, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--cv-body)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, fontWeight: 600 }}>
                {formatRange(j.start, j.end, lang)}
              </div>
              {j.location && <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                <Editable value={j.location} onChange={(v) => onEdit(['experience',i,'location'], v)}/>
              </div>}
            </div>
            <div>
              <Editable value={j.role} onChange={(v) => onEdit(['experience',i,'role'], v)}
                style={{ fontFamily: 'var(--cv-heading)', fontSize: 18, fontWeight: 500, color: '#1A1A1A', display: 'block', letterSpacing: '-0.01em' }}/>
              <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 13, color: '#666', marginBottom: 6 }}>
                <Editable value={j.company} onChange={(v) => onEdit(['experience',i,'company'], v)}/>
              </div>
              <EditableBullets
                bullets={j.bullets || ['']}
                onChange={(v) => onEdit(['experience',i,'bullets'], v)}
                accent={accent} lang={lang}
                placeholder={t.labels.bulletPlaceholder}
                bulletStyle="none"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderEducation = () => (
    <Section key="education" id="education" title={t.sections.education}>
      {(data.education || []).map((e, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <Editable value={e.degree} onChange={(v) => onEdit(['education',i,'degree'], v)}
            style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500, display: 'block' }}/>
          <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 11.5, color: '#666' }}>
            <Editable value={e.school} onChange={(v) => onEdit(['education',i,'school'], v)}/>
          </div>
          <div style={{ fontSize: 10, color: accent, marginTop: 2, fontWeight: 600, letterSpacing: '0.04em' }}>
            {formatRange(e.start, e.end, lang)}
          </div>
        </div>
      ))}
    </Section>
  );

  const renderSkills = () => (
    <Section key="skills" id="skills" title={t.sections.skills}>
      {(data.skills || []).map((sk, i) => (
        <div key={i} style={{ marginBottom: 8, fontSize: 11 }}>
          <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 12, color: accent, marginBottom: 2 }}>
            <Editable value={sk.category} onChange={(v) => onEdit(['skills',i,'category'], v)}/>
          </div>
          <Editable
            value={(sk.items || []).join(' · ')}
            onChange={(v) => onEdit(['skills',i,'items'], v.split(/\s*[·,]\s*/))}
            style={{ color: '#333', lineHeight: 1.5, fontSize: 11 }}
          />
        </div>
      ))}
    </Section>
  );

  const renderLanguages = () => (
    <Section key="languages" id="languages" title={t.sections.languages}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
        {(data.languages || []).map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Editable value={l.name} onChange={(v) => onEdit(['languages',i,'name'], v)} style={{ fontFamily: 'var(--cv-heading)' }}/>
            <Editable value={l.level} onChange={(v) => onEdit(['languages',i,'level'], v)} style={{ color: '#888', fontStyle: 'italic' }}/>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderProjects = () => (
    <Section key="projects" id="projects" title={t.sections.projects}>
      {(data.projects || []).map((p, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <Editable value={p.name} onChange={(v) => onEdit(['projects',i,'name'], v)}
            style={{ fontFamily: 'var(--cv-heading)', fontSize: 12.5, fontWeight: 500 }}/>
          <Editable value={p.description} onChange={(v) => onEdit(['projects',i,'description'], v)} multiline enableAi as="div"
            style={{ fontSize: 10.5, color: '#444', marginTop: 2, lineHeight: 1.5 }}/>
        </div>
      ))}
    </Section>
  );

  const renderCerts = () => (
    <Section key="certifications" id="certifications" title={t.sections.certifications}>
      {(data.certifications || []).map((c, i) => (
        <div key={i} style={{ marginBottom: 5, fontSize: 11 }}>
          <Editable value={c.name} onChange={(v) => onEdit(['certifications',i,'name'], v)} style={{ display: 'block' }}/>
          <span style={{ color: '#888', fontSize: 10, fontStyle: 'italic' }}>
            <Editable value={c.issuer} onChange={(v) => onEdit(['certifications',i,'issuer'], v)}/>
            <span> · </span>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications',i,'date'], v)}/>
          </span>
        </div>
      ))}
    </Section>
  );

  const renderHobbies = () => (
    <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
      <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
        style={{ fontSize: 11, color: '#333', lineHeight: 1.55, fontStyle: 'italic', fontFamily: 'var(--cv-heading)' }}/>
    </Section>
  );

  const renderLinks = () => {
    const links = data.personal?.links || [];
    return (
      <Section key="links" id="links" title={t.sections.links}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 10.5 }}>
          {links.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name={l.icon || 'globe'} size={11} style={{flexShrink: 0, color: accent}}/>
              <Editable value={l.url} onChange={(v) => onEdit(['personal','links',i,'url'], v)}/>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  const renderMap = {
    personal: renderPersonal, summary: renderSummary, experience: renderExperience,
    education: renderEducation, skills: renderSkills, languages: renderLanguages,
    projects: renderProjects, certifications: renderCerts, hobbies: renderHobbies,
    links: renderLinks,
  };

  const personalNode = visible.includes('personal') ? renderPersonal() : null;
  const bodyVisible = visible.filter(id => id !== 'personal');

  return (
    <div style={{
      padding: '20mm 22mm',
      fontFamily: 'var(--cv-body)',
      color: '#1A1A1A',
      direction: isRtl ? 'rtl' : 'ltr',
      background: 'white',
    }}>
      {personalNode}
      <div style={{
        columnCount: 2,
        columnGap: '20px',
        display: 'block',
      }}>
        {bodyVisible.map(id => renderMap[id] ? renderMap[id]() : null)}
      </div>
    </div>
  );
}

window.EditorialTemplate = EditorialTemplate;

/* ============================================================
   TEMPLATE DISPATCH
   ============================================================ */
function TemplateRoot(props) {
  const Templates = {
    classic: window.ClassicTemplate,
    minimal: window.MinimalTemplate,
    sidebar: window.SidebarTemplate,
    technical: window.TechnicalTemplate,
    academic: window.AcademicTemplate,
    editorial: window.EditorialTemplate,
  };
  const Comp = Templates[props.template] || Templates.classic;
  return <Comp {...props}/>;
}

window.TemplateRoot = TemplateRoot;
