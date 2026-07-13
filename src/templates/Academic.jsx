import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';

export default function AcademicTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
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
        {showPhoto && (
          <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
            <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal','photo'], v)} size={68} accent={accent}/>
          </div>
        )}
        <Editable as="h1" {...F(['personal', 'name'])}
          style={{ fontFamily: 'var(--cv-heading)', fontSize: 28, fontWeight: 500, margin: 0, color: '#1A1A1A', letterSpacing: '0.005em' }}/>
        <Editable as="div" {...F(['personal', 'title'])}
          style={{ fontFamily: 'var(--cv-heading)', fontStyle: 'italic', fontSize: 13, color: '#555', marginTop: 2 }}/>
        <div style={{ marginTop: 8, fontSize: 10.5, color: '#444', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Editable {...F(['personal', 'email'])}/><span>·</span>
          <Editable {...F(['personal', 'phone'])}/><span>·</span>
          <Editable {...F(['personal', 'location'])}/>
        </div>
        {(data.personal?.links || []).length > 0 && (
          <div style={{ marginTop: 4, fontSize: 10.5, color: accent, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {(data.personal?.links || []).map((l, i) => (
              <Editable key={i} value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)}/>
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
            <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)} style={{ fontWeight: 600 }}/>
            <span>, </span>
            <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)} style={{ fontStyle: 'italic' }}/>
            <span>, </span>
            <span style={{ color: '#555' }}>{formatRange(e.start, e.end, lang)}</span>
            {e.description && <div style={{ textIndent: 0, fontSize: 10.5, color: '#444', marginTop: 1 }}>
              <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi/>
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
              <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)} style={{ fontWeight: 600 }}/>
              <span>, </span>
              <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)} style={{ fontStyle: 'italic' }}/>
              <span style={{ color: '#555' }}> ({formatRange(j.start, j.end, lang)})</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '2px 0 0 1.5em', fontSize: 10.5 }}>
              {(j.bullets || ['']).map((b, k) => (
                <li key={k} style={{ paddingInlineStart: '1em', textIndent: '-1em', marginBottom: 1 }}>
                  <span style={{ color: '#888', marginInlineEnd: 6 }}>—</span>
                  <Editable
                    value={b}
                    onChange={(v) => onEdit(['experience', i, 'bullets'], (j.bullets || []).map((bb, kk) => kk === k ? v : bb))}
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
            <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)} style={{ fontWeight: 600 }}/>
            <span> — </span>
            <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi/>
            {p.link && <>
              <span> </span>
              <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)} style={{ color: accent, fontStyle: 'italic' }}/>
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
                <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}/>:
              </span>{' '}
              <Editable
                value={(sk.items || []).join(', ')}
                onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*,\s*/))}
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
              <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 600 }}/>
              <span> (</span>
              <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ fontStyle: 'italic' }}/>
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
            <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ fontWeight: 600 }}/>
            <span>, </span>
            <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ fontStyle: 'italic' }}/>
            <span>, </span>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: '#555' }}/>.
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
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards || []).map((a, i) => (
          <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em', marginBottom: 3, fontSize: 11 }}>
            <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
            <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)} style={{ fontWeight: 600 }}/>
            {a.issuer && <><span>, </span>
              <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ fontStyle: 'italic' }}/></>}
            <span>, </span>
            <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: '#555' }}/>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        {(data.volunteering || []).map((v, i) => (
          <div key={i} style={{ marginBottom: 8, fontSize: 11, lineHeight: 1.55 }}>
            <div style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em' }}>
              <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
              <Editable value={v.role} onChange={(vv) => onEdit(['volunteering', i, 'role'], vv)} style={{ fontWeight: 600 }}/>
              <span>, </span>
              <Editable value={v.org} onChange={(vv) => onEdit(['volunteering', i, 'org'], vv)} style={{ fontStyle: 'italic' }}/>
              <span style={{ color: '#555' }}> ({formatRange(v.start, v.end, lang)})</span>
            </div>
            {v.description && <div style={{ paddingInlineStart: '1.5em', fontSize: 10.5, color: '#444', marginTop: 1 }}>
              <Editable value={v.description} onChange={(vv) => onEdit(['volunteering', i, 'description'], vv)} multiline as="div"/>
            </div>}
          </div>
        ))}
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications || []).map((p, i) => (
          <div key={i} style={{ paddingInlineStart: '1.5em', textIndent: '-1.5em', marginBottom: 4, fontSize: 11 }}>
            <span style={{ color: accent, marginInlineEnd: 6 }}>▪</span>
            <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)} style={{ fontWeight: 600 }}/>
            {p.venue && <><span>, </span>
              <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)} style={{ fontStyle: 'italic' }}/></>}
            <span>, </span>
            <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)} style={{ color: '#555' }}/>
          </div>
        ))}
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{
      padding: '14mm 18mm',
      fontFamily: 'var(--cv-heading)',
      color: '#1A1A1A',
      direction: isRtl ? 'rtl' : 'ltr',
      background: 'white',
    }}>
      {visible.map(id => renderMap[id] ? renderMap[id]() : null)}
    </div>
  );
}
