import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import EditableBullets from './EditableBullets.jsx';

// Verse: Wide left margin holds section titles; content in the right 68%. Book-like margin note style.
const VerseTemplate = memo(function VerseTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ display: 'flex', flexDirection: isRtl ? 'row-reverse' : 'row', gap: 0, marginBottom: 12 }}>
      <div style={{
        width: '14%', flexShrink: 0,
        paddingTop: 2,
        textAlign: isRtl ? 'left' : 'right',
        paddingInlineEnd: 14,
      }}>
        <span style={{
          fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          fontWeight: 600, color: accent, lineHeight: 1.4, display: 'block',
        }}>{title}</span>
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 20 }}>
        <Editable as="h1" {...F(['personal', 'name'])}
          style={{ fontFamily: 'var(--cv-heading)', fontSize: 38, fontWeight: 400, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05, color: '#111' }}/>
        <Editable as="div" {...F(['personal', 'title'])}
          style={{ fontSize: 13, color: '#555', marginTop: 4, fontStyle: 'italic', fontFamily: 'var(--cv-heading)' }}/>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '3px 16px', fontSize: 10, color: '#666' }}>
          <Editable {...F(['personal', 'email'])}/>
          <span style={{ color: '#ccc' }}>·</span>
          <Editable {...F(['personal', 'phone'])}/>
          <span style={{ color: '#ccc' }}>·</span>
          <Editable {...F(['personal', 'location'])}/>
          {(data.personal?.links || []).slice(0, 2).map((l, i) => (
            <span key={i}>
              <span style={{ color: '#ccc' }}>·</span>
              <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} style={{ color: accent }}/>
            </span>
          ))}
        </div>
        <div style={{ height: '0.5px', background: '#D0CCC4', marginTop: 14 }}/>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })} as="p"
          style={{ margin: 0, fontSize: 11.5, lineHeight: 1.65, color: '#333', textWrap: 'pretty' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {(data.experience || []).map((j, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                    style={{ fontSize: 12.5, fontWeight: 700, color: '#111' }}/>
                  <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}
                    style={{ fontSize: 12, color: accent, fontStyle: 'italic' }}/>
                  {j.location && <Editable value={j.location} onChange={(v) => onEdit(['experience', i, 'location'], v)}
                    style={{ fontSize: 10.5, color: '#888' }}/>}
                </div>
                <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                  {formatRange(j.start, j.end, lang)}
                </span>
              </div>
              <EditableBullets bullets={j.bullets || ['']} onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
                accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dot"/>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education || []).map((e, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
            <div>
              <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)}
                style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
              <div style={{ marginTop: 1 }}>
                <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)}
                  style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}/>
              </div>
              {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi
                as="div" style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
            </div>
            <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
              {formatRange(e.start, e.end, lang)}
            </span>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(data.skills || []).map((sk, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 11 }}>
              <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}
                style={{ fontWeight: 700, color: '#333', minWidth: 72, fontSize: 10.5, flexShrink: 0 }}/>
              <Editable value={(sk.items || []).join(' · ')} onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*[·,]\s*/))}
                style={{ color: '#555' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display: 'flex', gap: '3px 18px', flexWrap: 'wrap', fontSize: 11 }}>
          {(data.languages || []).map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 600, color: '#111' }}/>
              <span style={{ color: '#ccc' }}>·</span>
              <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ color: '#777', fontStyle: 'italic' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects || []).map((p, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)}
                style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
              {p.link && <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)}
                style={{ fontSize: 10, color: accent, fontStyle: 'italic' }}/>}
            </div>
            <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi as="div"
              style={{ fontSize: 11, color: '#444', marginTop: 2, lineHeight: 1.55 }}/>
          </div>
        ))}
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications || []).map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <div>
              <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ fontWeight: 600, color: '#111' }}/>
              <span style={{ color: '#ccc', margin: '0 5px' }}>·</span>
              <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ color: '#666', fontStyle: 'italic' }}/>
            </div>
            <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: '#aaa', fontStyle: 'italic' }}/>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
          style={{ fontSize: 11, color: '#555', lineHeight: 1.6, fontStyle: 'italic' }}/>
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards || []).map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
            <div>
              <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)} style={{ fontWeight: 600, color: '#111' }}/>
              {a.issuer && <>
                <span style={{ color: '#ccc', margin: '0 5px' }}>·</span>
                <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ color: '#666', fontStyle: 'italic' }}/>
              </>}
              {a.description && <Editable value={a.description} onChange={(v) => onEdit(['awards', i, 'description'], v)} multiline enableAi as="div"
                style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
            </div>
            <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)}
              style={{ color: '#aaa', whiteSpace: 'nowrap', fontStyle: 'italic' }}/>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(data.volunteering || []).map((v, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <Editable value={v.role} onChange={(val) => onEdit(['volunteering', i, 'role'], val)}
                    style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
                  <Editable value={v.org} onChange={(val) => onEdit(['volunteering', i, 'org'], val)}
                    style={{ fontSize: 11.5, color: accent, fontStyle: 'italic' }}/>
                </div>
                <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                  {formatRange(v.start, v.end, lang)}
                </span>
              </div>
              {v.description && <Editable value={v.description} onChange={(val) => onEdit(['volunteering', i, 'description'], val)} multiline enableAi as="div"
                style={{ fontSize: 11, color: '#444', lineHeight: 1.55 }}/>}
            </div>
          ))}
        </div>
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications || []).map((p, i) => (
          <div key={i} style={{ marginBottom: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)}
                style={{ fontWeight: 600, color: '#111' }}/>
              <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)}
                style={{ color: '#aaa', whiteSpace: 'nowrap', fontSize: 10, fontStyle: 'italic' }}/>
            </div>
            {p.venue && <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)}
              style={{ color: accent, fontSize: 10.5, fontStyle: 'italic', marginTop: 1 }}/>}
            {p.description && <Editable value={p.description} onChange={(v) => onEdit(['publications', i, 'description'], v)} multiline enableAi as="div"
              style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
          </div>
        ))}
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

export default VerseTemplate;
