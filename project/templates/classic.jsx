// Six CV templates. Each is a top-level component that consumes:
//   data (current lang's data), accent, lang, sections, onEdit, dispatch
// All text is editable via the Editable component.
const { useMemo: useMemoT } = React;

// ---- helpers ----
function get(obj, path) {
  let cur = obj;
  for (const k of path) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

function makeField(data, onEdit) {
  return (path, opts = {}) => ({
    value: get(data, path) ?? '',
    onChange: (v) => onEdit(path, v),
    multiline: opts.multiline,
    placeholder: opts.placeholder,
    enableAi: opts.ai,
  });
}

// section-iterator helper: returns visible section ids in order
function visibleIds(sections) {
  return sections.filter(s => s.visible).map(s => s.id);
}

// editable bullet list with add/delete
function EditableBullets({ bullets, onChange, accent, lang, placeholder, bulletStyle = 'dot' }) {
  const addAfter = (idx) => onChange([...bullets.slice(0, idx + 1), '', ...bullets.slice(idx + 1)]);
  const del = (idx) => {
    if (bullets.length === 1) return onChange(['']);
    onChange(bullets.filter((_, i) => i !== idx));
  };
  const update = (idx, v) => onChange(bullets.map((b, i) => i === idx ? v : b));

  const marker = (i) => {
    if (bulletStyle === 'arrow') return <span style={{color: accent, marginInlineEnd: 6, fontFamily: 'inherit'}}>›</span>;
    if (bulletStyle === 'square') return <span style={{color: accent, marginInlineEnd: 6}}>▪</span>;
    if (bulletStyle === 'dash') return <span style={{color: accent, marginInlineEnd: 8}}>—</span>;
    if (bulletStyle === 'none') return null;
    return <span style={{color: accent, marginInlineEnd: 8, display: 'inline-block', width: '1em', textAlign: 'center'}}>•</span>;
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 3 }} className="array-item">
          {marker(i)}
          <Editable
            value={b}
            onChange={(v) => update(i, v)}
            multiline
            placeholder={placeholder}
            enableAi
            style={{ flex: 1, minHeight: '1.2em' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addAfter(i);
                setTimeout(() => {
                  const all = document.querySelectorAll('[data-editable]');
                  // best-effort focus next
                }, 0);
              }
              if (e.key === 'Backspace' && b === '' && bullets.length > 1) {
                e.preventDefault();
                del(i);
              }
            }}
          />
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   1. CLASSIC — Traditional, formal, black & white with accent
   ============================================================ */
function ClassicTemplate({ data, accent, lang, sections, onEdit, dispatch }) {
  const F = makeField(data, onEdit);
  const t = window.CV_I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section style={{ marginBottom: 18 }} data-section={id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <h2 style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 700, color: accent, margin: 0, fontFamily: 'var(--cv-body)',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: '#1A1A1A' }}/>
      </div>
      {children}
    </section>
  );

  const renderPersonal = () => (
    <header key="personal" style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 18, borderBottom: `2px solid #1A1A1A` }}>
      <Editable as="h1" {...F(['personal', 'name'])} placeholder="Your Name"
        style={{
          fontFamily: 'var(--cv-heading)', fontSize: 38, fontWeight: 500,
          margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.05,
        }}/>
      <Editable as="div" {...F(['personal', 'title'])} placeholder="Title"
        style={{
          fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: accent, fontWeight: 500, marginBottom: 12,
        }}/>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', fontSize: 10.5, color: '#3A3A3A' }}>
        <Editable {...F(['personal', 'email'])} placeholder="email"/>
        <span style={{color: '#999'}}>·</span>
        <Editable {...F(['personal', 'phone'])} placeholder="phone"/>
        <span style={{color: '#999'}}>·</span>
        <Editable {...F(['personal', 'location'])} placeholder="location"/>
      </div>
    </header>
  );

  const renderLinks = () => {
    const links = data.personal?.links || [];
    if (!links.length) return null;
    return (
      <Section key="links" id="links" title={t.sections.links}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 11 }}>
          {links.map((l, i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }} className="array-item" data-link>
              <Icon name={l.icon || 'globe'} size={11}/>
              <Editable value={l.label} onChange={(v) => onEdit(['personal', 'links', i, 'label'], v)} placeholder="Label"/>
              <span style={{color: '#999'}}>—</span>
              <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} placeholder="url"/>
            </span>
          ))}
        </div>
      </Section>
    );
  };

  const renderSummary = () => (
    <Section key="summary" id="summary" title={t.sections.summary}>
      <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })}
        as="p"
        style={{ margin: 0, fontSize: 11.5, lineHeight: 1.65, color: '#262626', textWrap: 'pretty' }}/>
    </Section>
  );

  const renderExperience = () => (
    <Section key="experience" id="experience" title={t.sections.experience}>
      {(data.experience || []).map((job, i) => (
        <div key={i} style={{ marginBottom: 14, position: 'relative' }} className="array-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 2 }}>
            <div>
              <Editable value={job.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                style={{ fontWeight: 600, fontSize: 12, color: '#1A1A1A' }}/>
              <span style={{ color: '#666', margin: '0 6px' }}>·</span>
              <Editable value={job.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}
                style={{ fontStyle: 'italic', fontSize: 12, color: '#1A1A1A', fontFamily: 'var(--cv-heading)' }}/>
            </div>
            <div style={{ fontSize: 10, color: '#666', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              {formatRange(job.start, job.end, lang)}{job.location && <span> · {job.location}</span>}
            </div>
          </div>
          <EditableBullets
            bullets={job.bullets || ['']}
            onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
            accent={accent} lang={lang}
            placeholder={t.labels.bulletPlaceholder}
            bulletStyle="dot"
          />
        </div>
      ))}
    </Section>
  );

  const renderEducation = () => (
    <Section key="education" id="education" title={t.sections.education}>
      {(data.education || []).map((ed, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <div>
              <Editable value={ed.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)}
                style={{ fontWeight: 600, fontSize: 12 }}/>
              <span style={{ color: '#666', margin: '0 6px' }}>·</span>
              <Editable value={ed.school} onChange={(v) => onEdit(['education', i, 'school'], v)}
                style={{ fontStyle: 'italic', fontSize: 12, fontFamily: 'var(--cv-heading)' }}/>
            </div>
            <div style={{ fontSize: 10, color: '#666', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              {formatRange(ed.start, ed.end, lang)}
            </div>
          </div>
          {ed.description && (
            <Editable {...{ value: ed.description, onChange: (v) => onEdit(['education', i, 'description'], v), enableAi: true, multiline: true }}
              as="div" style={{ fontSize: 11, color: '#444', marginTop: 2, lineHeight: 1.55 }}/>
          )}
        </div>
      ))}
    </Section>
  );

  const renderSkills = () => (
    <Section key="skills" id="skills" title={t.sections.skills}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(data.skills || []).map((sk, i) => (
          <div key={i} style={{ fontSize: 11.5, lineHeight: 1.55 }}>
            <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}
              style={{ fontWeight: 600, color: accent, marginInlineEnd: 8 }}/>
            <Editable value={(sk.items || []).join(' · ')}
              onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*[·,•]\s*/))}
              placeholder="skill · skill · skill"
              style={{ color: '#333' }}/>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderLanguages = () => (
    <Section key="languages" id="languages" title={t.sections.languages}>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 11.5 }}>
        {(data.languages || []).map((l, i) => (
          <div key={i}>
            <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 600 }}/>
            <span style={{ color: '#666', margin: '0 4px' }}>—</span>
            <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ fontStyle: 'italic', color: '#444' }}/>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderProjects = () => (
    <Section key="projects" id="projects" title={t.sections.projects}>
      {(data.projects || []).map((p, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)}
            style={{ fontWeight: 600, fontSize: 12 }}/>
          {p.link && (
            <>
              <span style={{ color: '#666', margin: '0 6px' }}>·</span>
              <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)}
                style={{ fontSize: 11, color: accent, fontStyle: 'italic' }}/>
            </>
          )}
          <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi
            as="div" style={{ fontSize: 11.5, lineHeight: 1.55, color: '#333', marginTop: 2 }}/>
        </div>
      ))}
    </Section>
  );

  const renderCertifications = () => (
    <Section key="certifications" id="certifications" title={t.sections.certifications}>
      {(data.certifications || []).map((c, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
          <span>
            <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ fontWeight: 600 }}/>
            <span style={{ color: '#666', margin: '0 6px' }}>·</span>
            <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ fontStyle: 'italic' }}/>
          </span>
          <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: '#666' }}/>
        </div>
      ))}
    </Section>
  );

  const renderHobbies = () => (
    <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
      <Editable {...F(['hobbies'], { multiline: true, ai: true })}
        as="div" style={{ fontSize: 11.5, color: '#333', lineHeight: 1.55 }}/>
    </Section>
  );

  const renderMap = {
    personal: renderPersonal, summary: renderSummary, experience: renderExperience,
    education: renderEducation, skills: renderSkills, languages: renderLanguages,
    projects: renderProjects, certifications: renderCertifications,
    hobbies: renderHobbies, links: renderLinks,
  };

  return (
    <div style={{
      padding: '18mm 18mm',
      fontFamily: 'var(--cv-body)', color: '#1A1A1A', fontSize: 11,
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      {visibleIds(sections).map(id => renderMap[id] ? renderMap[id]() : null)}
    </div>
  );
}

window.ClassicTemplate = ClassicTemplate;
window.EditableBullets = EditableBullets;
window.makeField = makeField;
window.visibleIds = visibleIds;
window.cvGet = get;
