/* ============================================================
   2. MINIMAL — Lots of whitespace, sans-serif, sparse
   ============================================================ */
function MinimalTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = window.CV_I18N[lang];
  const isRtl = lang === 'he';

  const Label = ({ children }) => (
    <h2 style={{
      fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
      fontWeight: 600, color: '#999', margin: '0 0 14px', fontFamily: 'var(--cv-body)',
    }}>{children}</h2>
  );

  const Section = ({ id, title, children, gap = 30 }) => (
    <section data-section={id} style={{ marginBottom: gap }}>
      <Label>{title}</Label>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 44 }}>
        <Editable as="h1" {...F(['personal','name'])}
          style={{
            fontFamily: 'var(--cv-heading)', fontSize: 44, fontWeight: 400,
            margin: 0, letterSpacing: '-0.025em', lineHeight: 1, color: '#1A1A1A',
          }}/>
        <Editable as="div" {...F(['personal','title'])}
          style={{ fontSize: 14, color: '#888', marginTop: 8, fontWeight: 400 }}/>
        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: '#666', marginTop: 18, flexWrap: 'wrap' }}>
          <Editable {...F(['personal','email'])}/>
          <span style={{color: '#ccc'}}>·</span>
          <Editable {...F(['personal','phone'])}/>
          <span style={{color: '#ccc'}}>·</span>
          <Editable {...F(['personal','location'])}/>
          {(data.personal?.links || []).map((l, i) => (
            <React.Fragment key={i}>
              <span style={{color: '#ccc'}}>·</span>
              <Editable value={l.url} onChange={(v) => onEdit(['personal','links',i,'url'], v)} style={{color: accent}}/>
            </React.Fragment>
          ))}
        </div>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })}
          as="p"
          style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: '#2A2A2A', textWrap: 'pretty', maxWidth: '55ch' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {(data.experience || []).map((j, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20 }}>
              <div style={{ fontSize: 10, color: '#999', paddingTop: 3, letterSpacing: '0.02em' }}>
                {formatRange(j.start, j.end, lang)}
              </div>
              <div>
                <div style={{ marginBottom: 6 }}>
                  <Editable value={j.role} onChange={(v) => onEdit(['experience',i,'role'], v)}
                    style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A' }}/>
                  <span style={{ color: '#aaa', margin: '0 8px' }}>·</span>
                  <Editable value={j.company} onChange={(v) => onEdit(['experience',i,'company'], v)}
                    style={{ fontSize: 13, color: accent }}/>
                </div>
                <EditableBullets
                  bullets={j.bullets || ['']}
                  onChange={(v) => onEdit(['experience',i,'bullets'], v)}
                  accent={accent} lang={lang}
                  placeholder={t.labels.bulletPlaceholder}
                  bulletStyle="dash"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education || []).map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#999', paddingTop: 3 }}>{formatRange(e.start, e.end, lang)}</div>
            <div>
              <Editable value={e.degree} onChange={(v) => onEdit(['education',i,'degree'], v)} style={{ fontSize: 13, fontWeight: 500 }}/>
              <div style={{ marginTop: 2 }}>
                <Editable value={e.school} onChange={(v) => onEdit(['education',i,'school'], v)} style={{ fontSize: 12, color: accent }}/>
              </div>
              {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education',i,'description'], v)} multiline enableAi
                as="div" style={{ fontSize: 11.5, color: '#555', marginTop: 4, lineHeight: 1.55 }}/>}
            </div>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(data.skills || []).map((sk, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20, fontSize: 11.5 }}>
              <Editable value={sk.category} onChange={(v) => onEdit(['skills',i,'category'], v)} style={{ color: '#999', fontSize: 10, paddingTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}/>
              <Editable
                value={(sk.items || []).join(', ')}
                onChange={(v) => onEdit(['skills',i,'items'], v.split(/\s*,\s*/))}
                style={{ color: '#2A2A2A' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects || []).map((p, i) => (
          <div key={i} style={{ marginBottom: 14, maxWidth: '55ch' }}>
            <Editable value={p.name} onChange={(v) => onEdit(['projects',i,'name'], v)} style={{ fontSize: 13, fontWeight: 500 }}/>
            {p.link && <>
              <span style={{ color: '#aaa', margin: '0 8px' }}>·</span>
              <Editable value={p.link} onChange={(v) => onEdit(['projects',i,'link'], v)} style={{ fontSize: 11, color: accent }}/>
            </>}
            <Editable value={p.description} onChange={(v) => onEdit(['projects',i,'description'], v)} multiline enableAi as="div"
              style={{ fontSize: 11.5, lineHeight: 1.6, color: '#444', marginTop: 3 }}/>
          </div>
        ))}
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', fontSize: 11.5 }}>
          {(data.languages || []).map((l, i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v) => onEdit(['languages',i,'name'], v)} style={{ fontWeight: 500 }}/>
              <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                <Editable value={l.level} onChange={(v) => onEdit(['languages',i,'level'], v)}/>
              </div>
            </div>
          ))}
        </div>
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications || []).map((c, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20, fontSize: 11.5, marginBottom: 4 }}>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications',i,'date'], v)} style={{ color: '#999', fontSize: 10, paddingTop: 3 }}/>
            <div>
              <Editable value={c.name} onChange={(v) => onEdit(['certifications',i,'name'], v)} style={{ fontWeight: 500 }}/>
              <span style={{ color: '#aaa', margin: '0 6px' }}>·</span>
              <Editable value={c.issuer} onChange={(v) => onEdit(['certifications',i,'issuer'], v)} style={{ color: '#666' }}/>
            </div>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
          style={{ fontSize: 11.5, color: '#555', lineHeight: 1.55, maxWidth: '50ch' }}/>
      </Section>
    ),
    links: () => null, // links rendered inline in personal
  };

  return (
    <div style={{
      padding: '24mm 22mm',
      fontFamily: 'var(--cv-body)', color: '#1A1A1A', fontSize: 11.5,
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      {visibleIds(sections).map(id => renderMap[id] ? renderMap[id]() : null)}
    </div>
  );
}

window.MinimalTemplate = MinimalTemplate;
