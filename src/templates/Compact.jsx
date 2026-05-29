import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import EditableBullets from './EditableBullets.jsx';

// Compact: Maximum density for experienced professionals with lots of content
const CompactTemplate = memo(function CompactTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <h2 style={{
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 700, color: accent, margin: 0,
          fontFamily: 'var(--cv-body)', whiteSpace: 'nowrap',
        }}>{title}</h2>
        <div style={{ flex: 1, height: '0.5px', background: '#D0CCC4' }}/>
      </div>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <Editable as="h1" {...F(['personal', 'name'])}
              style={{ fontFamily: 'var(--cv-heading)', fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05, color: '#111' }}/>
            <Editable as="div" {...F(['personal', 'title'])}
              style={{ fontSize: 11, color: accent, marginTop: 2, fontWeight: 500, letterSpacing: '0.02em' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 9.5, color: '#666', textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: isRtl ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
              <Editable {...F(['personal', 'email'])}/>
              <Editable {...F(['personal', 'phone'])}/>
              <Editable {...F(['personal', 'location'])}/>
            </div>
            {(data.personal?.links || []).length > 0 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: isRtl ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                {(data.personal?.links || []).slice(0, 3).map((l, i) => (
                  <Editable key={i} value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} style={{ color: accent }}/>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ height: '1px', background: '#111', marginTop: 7 }}/>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })} as="p"
          style={{ margin: 0, fontSize: 10.5, lineHeight: 1.6, color: '#333' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {(data.experience || []).map((j, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6, marginBottom: 1 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                    style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}/>
                  <span style={{ color: '#bbb', fontSize: 10 }}>·</span>
                  <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}
                    style={{ fontSize: 11, color: accent, fontWeight: 500 }}/>
                  {j.location && <>
                    <span style={{ color: '#ddd', fontSize: 10 }}>·</span>
                    <Editable value={j.location} onChange={(v) => onEdit(['experience', i, 'location'], v)}
                      style={{ fontSize: 10, color: '#888' }}/>
                  </>}
                </div>
                <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap' }}>
                  {formatRange(j.start, j.end, lang)}
                </span>
              </div>
              <EditableBullets bullets={j.bullets || ['']} onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
                accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dash"/>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education || []).map((e, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 4, fontSize: 10.5 }}>
            <div>
              <span style={{ fontWeight: 700, color: '#111' }}>
                <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)} style={{ fontWeight: 700 }}/>
              </span>
              <span style={{ color: '#bbb', margin: '0 4px' }}>·</span>
              <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)} style={{ color: '#555' }}/>
              {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi
                as="div" style={{ fontSize: 10, color: '#666', marginTop: 1, lineHeight: 1.45 }}/>}
            </div>
            <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {formatRange(e.start, e.end, lang)}
            </span>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(data.skills || []).map((sk, i) => (
            <div key={i} style={{ fontSize: 10.5, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: accent, marginInlineEnd: 4 }}>
                <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}
                  style={{ fontWeight: 700, color: accent }}/>:
              </span>
              <Editable value={(sk.items || []).join(', ')} onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*,\s*/))}
                style={{ color: '#444' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display: 'flex', gap: '2px 14px', flexWrap: 'wrap', fontSize: 10.5 }}>
          {(data.languages || []).map((l, i) => (
            <span key={i}>
              <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 600 }}/>
              <span style={{ color: '#bbb', margin: '0 3px' }}>-</span>
              <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ color: '#666' }}/>
            </span>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects || []).map((p, i) => (
          <div key={i} style={{ marginBottom: 5, fontSize: 10.5 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)}
                style={{ fontWeight: 700, color: '#111' }}/>
              {p.link && <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)}
                style={{ fontSize: 9.5, color: accent }}/>}
              {p.description && <>
                <span style={{ color: '#ccc' }}>—</span>
                <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi
                  style={{ color: '#444', lineHeight: 1.5 }}/>
              </>}
            </div>
          </div>
        ))}
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(data.certifications || []).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
              <div>
                <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ fontWeight: 600 }}/>
                <span style={{ color: '#ccc', margin: '0 4px' }}>·</span>
                <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ color: '#666' }}/>
              </div>
              <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: '#999', fontSize: 9.5 }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
          style={{ fontSize: 10.5, color: '#555', lineHeight: 1.55 }}/>
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(data.awards || []).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
              <div>
                <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)} style={{ fontWeight: 600 }}/>
                {a.issuer && <>
                  <span style={{ color: '#ccc', margin: '0 4px' }}>·</span>
                  <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ color: '#666' }}/>
                </>}
                {a.description && <Editable value={a.description} onChange={(v) => onEdit(['awards', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 10, color: '#555', marginTop: 1, lineHeight: 1.45 }}/>}
              </div>
              <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: '#999', fontSize: 9.5, flexShrink: 0 }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(data.volunteering || []).map((v, i) => (
            <div key={i} style={{ fontSize: 10.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6, marginBottom: 1 }}>
                <div>
                  <Editable value={v.role} onChange={(val) => onEdit(['volunteering', i, 'role'], val)}
                    style={{ fontWeight: 700, color: '#111' }}/>
                  <span style={{ color: '#bbb', margin: '0 4px' }}>·</span>
                  <Editable value={v.org} onChange={(val) => onEdit(['volunteering', i, 'org'], val)}
                    style={{ color: accent }}/>
                </div>
                <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap' }}>
                  {formatRange(v.start, v.end, lang)}
                </span>
              </div>
              {v.description && <Editable value={v.description} onChange={(val) => onEdit(['volunteering', i, 'description'], val)} multiline enableAi as="div"
                style={{ fontSize: 10, color: '#555', lineHeight: 1.45 }}/>}
            </div>
          ))}
        </div>
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(data.publications || []).map((p, i) => (
            <div key={i} style={{ fontSize: 10.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                <div>
                  <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)}
                    style={{ fontWeight: 600, color: '#111' }}/>
                  {p.venue && <>
                    <span style={{ color: '#bbb', margin: '0 4px' }}>·</span>
                    <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)}
                      style={{ color: '#666', fontStyle: 'italic' }}/>
                  </>}
                </div>
                <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)}
                  style={{ color: '#999', fontSize: 9.5, whiteSpace: 'nowrap', flexShrink: 0 }}/>
              </div>
              {p.description && <Editable value={p.description} onChange={(v) => onEdit(['publications', i, 'description'], v)} multiline enableAi as="div"
                style={{ fontSize: 10, color: '#555', marginTop: 1, lineHeight: 1.45 }}/>}
            </div>
          ))}
        </div>
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{ padding: '14mm 16mm', fontFamily: 'var(--cv-body)', color: '#1A1A1A', direction: isRtl ? 'rtl' : 'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.())}
    </div>
  );
});

export default CompactTemplate;
