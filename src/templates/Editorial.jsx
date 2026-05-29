import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import Icon from '../components/Icon.jsx';
import EditableBullets from './EditableBullets.jsx';

export default function EditorialTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
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
    <header key="personal" style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '0.5px solid #1A1A1A' }}>
      <div style={{ fontFamily: 'var(--cv-body)', fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>
        {isRtl ? '— קורות חיים —' : '— curriculum vitae —'}
      </div>
      <Editable as="h1" {...F(['personal', 'name'])}
        style={{ fontFamily: 'var(--cv-heading)', fontSize: 64, fontWeight: 400, margin: 0, lineHeight: 0.95, letterSpacing: '-0.035em', color: '#1A1A1A' }}/>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <Editable {...F(['personal', 'title'])} as="div"
          style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 17, color: accent }}/>
        <span style={{ flex: 1 }}/>
        <div style={{ fontSize: 10, color: '#555', display: 'flex', gap: 10, fontFamily: 'var(--cv-body)' }}>
          <Editable {...F(['personal', 'email'])}/><span>·</span>
          <Editable {...F(['personal', 'phone'])}/><span>·</span>
          <Editable {...F(['personal', 'location'])}/>
        </div>
      </div>
    </header>
  );

  const renderSummary = () => (
    <Section key="summary" id="summary" title={t.sections.summary} span={2}>
      <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })}
        as="p"
        style={{ margin: 0, fontFamily: 'var(--cv-heading)', fontSize: 16, lineHeight: 1.45, color: '#1A1A1A', textWrap: 'pretty', fontStyle: 'italic', fontWeight: 400 }}/>
    </Section>
  );

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
                <Editable value={j.location} onChange={(v) => onEdit(['experience', i, 'location'], v)}/>
              </div>}
            </div>
            <div>
              <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                style={{ fontFamily: 'var(--cv-heading)', fontSize: 18, fontWeight: 500, color: '#1A1A1A', display: 'block', letterSpacing: '-0.01em' }}/>
              <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 13, color: '#666', marginBottom: 6 }}>
                <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}/>
              </div>
              <EditableBullets
                bullets={j.bullets || ['']}
                onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
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
          <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)}
            style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500, display: 'block' }}/>
          <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 11.5, color: '#666' }}>
            <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)}/>
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
            <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}/>
          </div>
          <Editable
            value={(sk.items || []).join(' · ')}
            onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*[·,]\s*/))}
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
            <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontFamily: 'var(--cv-heading)' }}/>
            <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ color: '#888', fontStyle: 'italic' }}/>
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
            style={{ fontFamily: 'var(--cv-heading)', fontSize: 12.5, fontWeight: 500 }}/>
          <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi as="div"
            style={{ fontSize: 10.5, color: '#444', marginTop: 2, lineHeight: 1.5 }}/>
        </div>
      ))}
    </Section>
  );

  const renderCerts = () => (
    <Section key="certifications" id="certifications" title={t.sections.certifications}>
      {(data.certifications || []).map((c, i) => (
        <div key={i} style={{ marginBottom: 5, fontSize: 11 }}>
          <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ display: 'block' }}/>
          <span style={{ color: '#888', fontSize: 10, fontStyle: 'italic' }}>
            <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)}/>
            <span> · </span>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)}/>
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
              <Icon name={l.icon || 'globe'} size={11} style={{ flexShrink: 0, color: accent }}/>
              <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)}/>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  const renderAwards = () => (
    <Section key="awards" id="awards" title={t.sections.awards}>
      {(data.awards || []).map((a, i) => (
        <div key={i} style={{ marginBottom: 5, fontSize: 11 }}>
          <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)} style={{ fontWeight: 500, display: 'block' }}/>
          <span style={{ color: '#888', fontSize: 10, fontStyle: 'italic' }}>
            {a.issuer && <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)}/>}
            <span> · </span>
            <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: accent }}/>
          </span>
        </div>
      ))}
    </Section>
  );

  const renderVolunteering = () => (
    <Section key="volunteering" id="volunteering" title={t.sections.volunteering} span={2}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(data.volunteering || []).map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16 }}>
            <div style={{ fontFamily: 'var(--cv-body)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, fontWeight: 600 }}>
              {formatRange(v.start, v.end, lang)}
            </div>
            <div>
              <Editable value={v.role} onChange={(vv) => onEdit(['volunteering', i, 'role'], vv)}
                style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500, display: 'block' }}/>
              <div style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 11.5, color: '#666', marginBottom: 3 }}>
                <Editable value={v.org} onChange={(vv) => onEdit(['volunteering', i, 'org'], vv)}/>
              </div>
              {v.description && <Editable value={v.description} onChange={(vv) => onEdit(['volunteering', i, 'description'], vv)} multiline
                as="div" style={{ fontSize: 10.5, color: '#444', lineHeight: 1.5 }}/>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderPublications = () => (
    <Section key="publications" id="publications" title={t.sections.publications} span={2}>
      {(data.publications || []).map((p, i) => (
        <div key={i} style={{ marginBottom: 5, fontSize: 11 }}>
          <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)} style={{ fontWeight: 500 }}/>
          {p.venue && <><span style={{ color: '#bbb', margin: '0 5px' }}>·</span>
            <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)} style={{ fontStyle: 'italic', color: '#666' }}/></>}
          <span style={{ color: '#bbb', margin: '0 5px' }}>·</span>
          <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)} style={{ color: accent }}/>
        </div>
      ))}
    </Section>
  );

  const renderMap = {
    personal: renderPersonal, summary: renderSummary, experience: renderExperience,
    education: renderEducation, skills: renderSkills, languages: renderLanguages,
    projects: renderProjects, certifications: renderCerts, hobbies: renderHobbies,
    awards: renderAwards, volunteering: renderVolunteering, publications: renderPublications,
    links: renderLinks,
  };

  const personalNode = visible.includes('personal') ? renderPersonal() : null;
  const bodyVisible = visible.filter(id => id !== 'personal');

  return (
    <div style={{ padding: '14mm 18mm', fontFamily: 'var(--cv-body)', color: '#1A1A1A', direction: isRtl ? 'rtl' : 'ltr', background: 'white' }}>
      {personalNode}
      <div style={{ columnCount: 2, columnGap: '20px', display: 'block' }}>
        {bodyVisible.map(id => renderMap[id] ? renderMap[id]() : null)}
      </div>
    </div>
  );
}
