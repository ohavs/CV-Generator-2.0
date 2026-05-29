import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import EditableBullets from './EditableBullets.jsx';

// Split: True 2-column layout, no sidebar fill — pure structure
const SplitTemplate = memo(function SplitTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const LEFT_SECTIONS = new Set(['skills', 'languages', 'certifications', 'awards', 'hobbies']);
  const visible = visibleIds(sections);
  const leftSections = visible.filter(id => LEFT_SECTIONS.has(id));
  const rightSections = visible.filter(id => !LEFT_SECTIONS.has(id) && id !== 'personal');

  const SectionLabel = ({ title }) => (
    <h2 style={{
      fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
      fontWeight: 700, color: accent, margin: '0 0 7px',
      fontFamily: 'var(--cv-body)',
    }}>{title}</h2>
  );

  const renderLeft = (id) => {
    switch (id) {
      case 'skills':
        return (
          <section key="skills" data-section="skills" style={{ marginBottom: 12 }}>
            <SectionLabel title={t.sections.skills}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(data.skills || []).map((sk, i) => (
                <div key={i}>
                  <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}
                    style={{ fontSize: 10.5, fontWeight: 700, color: '#111', display: 'block', marginBottom: 1 }}/>
                  <Editable value={(sk.items || []).join(' · ')} onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*[·,]\s*/))}
                    style={{ fontSize: 10.5, color: '#555', lineHeight: 1.5 }}/>
                </div>
              ))}
            </div>
          </section>
        );
      case 'languages':
        return (
          <section key="languages" data-section="languages" style={{ marginBottom: 12 }}>
            <SectionLabel title={t.sections.languages}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5 }}>
              {(data.languages || []).map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 600 }}/>
                  <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ color: '#888', fontSize: 10 }}/>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return (
          <section key="certifications" data-section="certifications" style={{ marginBottom: 12 }}>
            <SectionLabel title={t.sections.certifications}/>
            {(data.certifications || []).map((c, i) => (
              <div key={i} style={{ marginBottom: 6, fontSize: 10.5 }}>
                <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)}
                  style={{ fontWeight: 600, color: '#111', display: 'block' }}/>
                <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ color: '#666', fontSize: 10 }}/>
                <span style={{ color: '#bbb', margin: '0 3px', fontSize: 10 }}>·</span>
                <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: accent, fontSize: 10 }}/>
              </div>
            ))}
          </section>
        );
      case 'awards':
        return (
          <section key="awards" data-section="awards" style={{ marginBottom: 12 }}>
            <SectionLabel title={t.sections.awards}/>
            {(data.awards || []).map((a, i) => (
              <div key={i} style={{ marginBottom: 6, fontSize: 10.5 }}>
                <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)}
                  style={{ fontWeight: 600, color: '#111', display: 'block' }}/>
                {a.issuer && <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ color: '#666', fontSize: 10 }}/>}
                {a.date && <><span style={{ color: '#bbb', margin: '0 3px', fontSize: 10 }}>·</span>
                <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: accent, fontSize: 10 }}/></>}
                {a.description && <Editable value={a.description} onChange={(v) => onEdit(['awards', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 10, color: '#555', marginTop: 2, lineHeight: 1.45 }}/>}
              </div>
            ))}
          </section>
        );
      case 'hobbies':
        return (
          <section key="hobbies" data-section="hobbies" style={{ marginBottom: 12 }}>
            <SectionLabel title={t.sections.hobbies}/>
            <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
              style={{ fontSize: 10.5, color: '#555', lineHeight: 1.55 }}/>
          </section>
        );
      default: return null;
    }
  };

  const RightSection = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 12 }}>
      <h2 style={{
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 700, color: accent, margin: '0 0 7px',
        fontFamily: 'var(--cv-body)',
      }}>{title}</h2>
      {children}
    </section>
  );

  const renderRight = (id) => {
    switch (id) {
      case 'summary':
        return (
          <RightSection key="summary" id="summary" title={t.sections.summary}>
            <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })} as="p"
              style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: '#333' }}/>
          </RightSection>
        );
      case 'experience':
        return (
          <RightSection key="experience" id="experience" title={t.sections.experience}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.experience || []).map((j, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                        style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
                      <span style={{ color: '#ccc', fontSize: 10 }}>·</span>
                      <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}
                        style={{ fontSize: 11.5, color: accent }}/>
                    </div>
                    <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap' }}>
                      {formatRange(j.start, j.end, lang)}
                    </span>
                  </div>
                  <EditableBullets bullets={j.bullets || ['']} onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
                    accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dot"/>
                </div>
              ))}
            </div>
          </RightSection>
        );
      case 'education':
        return (
          <RightSection key="education" id="education" title={t.sections.education}>
            {(data.education || []).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
                <div>
                  <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)}
                    style={{ fontSize: 11.5, fontWeight: 700, color: '#111' }}/>
                  <div style={{ marginTop: 1 }}>
                    <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)}
                      style={{ fontSize: 11, color: '#666' }}/>
                  </div>
                  {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi
                    as="div" style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
                </div>
                <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap' }}>
                  {formatRange(e.start, e.end, lang)}
                </span>
              </div>
            ))}
          </RightSection>
        );
      case 'projects':
        return (
          <RightSection key="projects" id="projects" title={t.sections.projects}>
            {(data.projects || []).map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)}
                    style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
                  {p.link && <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)}
                    style={{ fontSize: 10, color: accent }}/>}
                </div>
                <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 11, color: '#444', marginTop: 2, lineHeight: 1.55 }}/>
              </div>
            ))}
          </RightSection>
        );
      case 'volunteering':
        return (
          <RightSection key="volunteering" id="volunteering" title={t.sections.volunteering}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(data.volunteering || []).map((v, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 1 }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Editable value={v.role} onChange={(val) => onEdit(['volunteering', i, 'role'], val)}
                        style={{ fontSize: 12, fontWeight: 700, color: '#111' }}/>
                      <span style={{ color: '#ccc', fontSize: 10 }}>·</span>
                      <Editable value={v.org} onChange={(val) => onEdit(['volunteering', i, 'org'], val)}
                        style={{ fontSize: 11.5, color: accent }}/>
                    </div>
                    <span style={{ fontSize: 9.5, color: '#999', whiteSpace: 'nowrap' }}>
                      {formatRange(v.start, v.end, lang)}
                    </span>
                  </div>
                  {v.description && <Editable value={v.description} onChange={(val) => onEdit(['volunteering', i, 'description'], val)} multiline enableAi as="div"
                    style={{ fontSize: 11, color: '#444', lineHeight: 1.55 }}/>}
                </div>
              ))}
            </div>
          </RightSection>
        );
      case 'publications':
        return (
          <RightSection key="publications" id="publications" title={t.sections.publications}>
            {(data.publications || []).map((p, i) => (
              <div key={i} style={{ marginBottom: 6, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)}
                    style={{ fontWeight: 600, color: '#111' }}/>
                  <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)}
                    style={{ color: '#999', whiteSpace: 'nowrap', fontSize: 9.5 }}/>
                </div>
                {p.venue && <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)}
                  style={{ color: accent, fontSize: 10.5, marginTop: 1 }}/>}
                {p.description && <Editable value={p.description} onChange={(v) => onEdit(['publications', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
              </div>
            ))}
          </RightSection>
        );
      default: return null;
    }
  };

  return (
    <div style={{ padding: '14mm 16mm', fontFamily: 'var(--cv-body)', color: '#1A1A1A', direction: isRtl ? 'rtl' : 'ltr' }}>
      {visible.includes('personal') && (
        <header key="personal" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: '1.5px solid #111' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
            <div>
              <Editable as="h1" {...F(['personal', 'name'])}
                style={{ fontFamily: 'var(--cv-heading)', fontSize: 34, fontWeight: 600, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05, color: '#111' }}/>
              <Editable as="div" {...F(['personal', 'title'])}
                style={{ fontSize: 12.5, color: accent, marginTop: 4, fontWeight: 500 }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 10, color: '#555', textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
              <Editable {...F(['personal', 'email'])}/>
              <Editable {...F(['personal', 'phone'])}/>
              <Editable {...F(['personal', 'location'])}/>
              {(data.personal?.links || []).slice(0, 2).map((l, i) => (
                <Editable key={i} value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} style={{ color: accent }}/>
              ))}
            </div>
          </div>
        </header>
      )}
      <div style={{ display: 'flex', flexDirection: isRtl ? 'row-reverse' : 'row', gap: 0 }}>
        <div style={{ width: '34%', paddingInlineEnd: 18, borderInlineEnd: '1px solid #E4DDD0', flexShrink: 0 }}>
          {leftSections.map(id => renderLeft(id))}
        </div>
        <div style={{ flex: 1, paddingInlineStart: 18 }}>
          {rightSections.map(id => renderRight(id))}
        </div>
      </div>
    </div>
  );
});

export default SplitTemplate;
