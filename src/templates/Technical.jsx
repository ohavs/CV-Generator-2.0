import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';

const monoFont = "var(--cv-mono, 'JetBrains Mono', 'Miriam Mono CLM', monospace)";
const codeBg = '#FAF8F4';

export default function TechnicalTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';
  const inkColor = '#1A1A1A';
  const dimColor = '#888';

  const Arrow = () => <span style={{ color: accent }}>›</span>;

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 20 }}>
      <h2 style={{
        margin: '0 0 10px', fontSize: 11, fontWeight: 700,
        fontFamily: monoFont, color: inkColor,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: accent, fontWeight: 700 }}>##</span>
        <span style={{ letterSpacing: '0.04em' }}>{title.toLowerCase().replace(/\s/g, '_')}</span>
        <span style={{ flex: 1, height: 1, background: '#E5E0D8' }}/>
      </h2>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 22, paddingBottom: 14, borderBottom: `2px solid ${accent}` }}>
        <div style={{ fontSize: 10, color: dimColor, marginBottom: 6, fontFamily: monoFont }}>
          {isRtl ? '// קובץ קורות חיים · v2.0' : '// cv.profile · v2.0'}
        </div>
        <Editable as="h1" {...F(['personal', 'name'])}
          style={{ fontFamily: monoFont, fontSize: 30, fontWeight: 700, margin: 0, color: inkColor, letterSpacing: '-0.01em', lineHeight: 1.05 }}/>
        <div style={{ marginTop: 4, fontFamily: monoFont, fontSize: 12, color: dimColor }}>
          <span style={{ color: accent }}>const role = </span>
          <span style={{ color: '#5A7D5A' }}>"</span>
          <Editable {...F(['personal', 'title'])} style={{ color: '#3A5694' }}/>
          <span style={{ color: '#5A7D5A' }}>"</span>
          <span style={{ color: dimColor }}>;</span>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 18px', fontSize: 11, fontFamily: monoFont }}>
          <div><span style={{ color: dimColor }}>email </span><Arrow/> <Editable {...F(['personal', 'email'])}/></div>
          <div><span style={{ color: dimColor }}>phone </span><Arrow/> <Editable {...F(['personal', 'phone'])}/></div>
          <div><span style={{ color: dimColor }}>where </span><Arrow/> <Editable {...F(['personal', 'location'])}/></div>
          {(data.personal?.links || []).slice(0, 1).map((l, i) => (
            <div key={i}><span style={{ color: dimColor }}>{(l.label || 'link').toLowerCase().slice(0, 5).padEnd(5, ' ')} </span><Arrow/>{' '}
              <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} style={{ color: accent }}/>
            </div>
          ))}
        </div>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <div style={{ fontFamily: monoFont, fontSize: 10.5, lineHeight: 1.65, color: '#333', background: codeBg, padding: '10px 14px', borderInlineStart: `3px solid ${accent}` }}>
          <span style={{ color: dimColor, fontStyle: 'italic' }}>{isRtl ? '/* תקציר אישי */' : '/* about */'}</span>
          <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })}
            as="div" style={{ marginTop: 4 }}/>
        </div>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: monoFont, fontSize: 11 }}>
          {(data.experience || []).map((j, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <div>
                  <span style={{ color: accent, fontWeight: 700 }}>@</span>
                  <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)} style={{ fontWeight: 700, color: inkColor }}/>
                  <span style={{ color: dimColor }}> :: </span>
                  <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)} style={{ color: '#3A5694' }}/>
                </div>
                <span style={{ fontSize: 10, color: dimColor }}>[{j.start} → {j.end || 'now'}]</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
                {(j.bullets || ['']).map((b, k) => (
                  <li key={k} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2 }}>
                    <span style={{ color: accent, marginInlineEnd: 8, fontWeight: 700 }}>›</span>
                    <Editable
                      value={b}
                      onChange={(v) => onEdit(['experience', i, 'bullets'], (j.bullets || []).map((bb, kk) => kk === k ? v : bb))}
                      multiline enableAi
                      placeholder={t.labels.bulletPlaceholder}
                      style={{ flex: 1, fontSize: 10.5, lineHeight: 1.55, color: '#262626' }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        <div style={{ fontFamily: monoFont, fontSize: 11 }}>
          {(data.education || []).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>
                  <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)} style={{ fontWeight: 700 }}/>
                  <span style={{ color: dimColor }}> · </span>
                  <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)} style={{ color: '#3A5694' }}/>
                </span>
                <span style={{ fontSize: 10, color: dimColor }}>[{e.start} → {e.end}]</span>
              </div>
              {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi
                as="div" style={{ fontSize: 10.5, color: '#555', marginTop: 2, lineHeight: 1.5 }}/>}
            </div>
          ))}
        </div>
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ fontFamily: monoFont, fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(data.skills || []).map((sk, i) => (
            <div key={i}>
              <span style={{ color: accent, fontWeight: 700 }}>
                <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}/>
              </span>
              <span style={{ color: dimColor }}>: </span>
              {(sk.items || []).map((it, k) => (
                <span key={k} style={{ background: codeBg, padding: '1px 6px', borderRadius: 3, fontSize: 10, marginInlineEnd: 4, border: '1px solid #E5E0D8', display: 'inline-block' }}>
                  <Editable value={it} onChange={(v) => onEdit(['skills', i, 'items'], (sk.items || []).map((ii, kk) => kk === k ? v : ii))}/>
                </span>
              ))}
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        <div style={{ fontFamily: monoFont, fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(data.projects || []).map((p, i) => (
            <div key={i}>
              <div>
                <span style={{ color: accent, fontWeight: 700 }}>$ </span>
                <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)} style={{ fontWeight: 700 }}/>
                {p.link && <>
                  <span style={{ color: dimColor }}> --link=</span>
                  <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)} style={{ color: '#5A7D5A' }}/>
                </>}
              </div>
              <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi
                as="div" style={{ marginTop: 3, color: '#444', lineHeight: 1.55, paddingInlineStart: 14 }}/>
              {p.tech && (
                <div style={{ paddingInlineStart: 14, fontSize: 9.5, color: dimColor, marginTop: 2 }}>
                  <span style={{ color: dimColor, fontStyle: 'italic' }}>// </span>
                  <Editable value={p.tech} onChange={(v) => onEdit(['projects', i, 'tech'], v)}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ fontFamily: monoFont, fontSize: 10.5, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {(data.languages || []).map((l, i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 700 }}/>
              <span style={{ color: dimColor }}>[</span>
              <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ color: accent }}/>
              <span style={{ color: dimColor }}>]</span>
            </div>
          ))}
        </div>
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: monoFont, fontSize: 10.5 }}>
          {(data.certifications || []).map((c, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
              <span style={{ color: accent }}>✓</span>
              <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)}/>
              <span style={{ color: dimColor }}>·</span>
              <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ color: dimColor }}/>
              <span style={{ color: dimColor }}>·</span>
              <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: dimColor }}/>
            </li>
          ))}
        </ul>
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
          style={{ fontFamily: monoFont, fontSize: 10.5, color: '#444', lineHeight: 1.55 }}/>
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: monoFont, fontSize: 10.5 }}>
          {(data.awards || []).map((a, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
              <span style={{ color: accent }}>★</span>
              <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)}/>
              {a.issuer && <><span style={{ color: dimColor }}>·</span>
                <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ color: dimColor }}/></>}
              <span style={{ color: dimColor }}>·</span>
              <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: dimColor }}/>
            </li>
          ))}
        </ul>
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: monoFont, fontSize: 10.5 }}>
          {(data.volunteering || []).map((v, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <span style={{ color: accent, fontWeight: 700 }}>@</span>
                  <Editable value={v.org} onChange={(vv) => onEdit(['volunteering', i, 'org'], vv)} style={{ fontWeight: 700 }}/>
                  <span style={{ color: dimColor }}> :: </span>
                  <Editable value={v.role} onChange={(vv) => onEdit(['volunteering', i, 'role'], vv)} style={{ color: '#3A5694' }}/>
                </div>
                <span style={{ fontSize: 10, color: dimColor }}>[{v.start} → {v.end || 'now'}]</span>
              </div>
              {v.description && <div style={{ paddingInlineStart: 14, color: '#444', lineHeight: 1.5, marginTop: 2, fontSize: 10 }}>
                <Editable value={v.description} onChange={(vv) => onEdit(['volunteering', i, 'description'], vv)} multiline as="div"/>
              </div>}
            </div>
          ))}
        </div>
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        <div style={{ fontFamily: monoFont, fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(data.publications || []).map((p, i) => (
            <div key={i}>
              <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)} style={{ fontWeight: 700 }}/>
              {p.venue && <><span style={{ color: dimColor }}> · </span>
                <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)} style={{ color: dimColor, fontStyle: 'italic' }}/></>}
              <span style={{ color: dimColor }}> · </span>
              <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)} style={{ color: accent }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    links: () => {
      const links = data.personal?.links || [];
      return (
        <Section key="links" id="links" title={t.sections.links}>
          <div style={{ fontFamily: monoFont, fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {links.map((l, i) => (
              <div key={i}>
                <span style={{ color: accent }}>{l.icon || 'url'}</span>
                <span style={{ color: dimColor }}> → </span>
                <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)}/>
              </div>
            ))}
          </div>
        </Section>
      );
    },
  };

  return (
    <div style={{
      padding: '16mm 16mm',
      fontFamily: monoFont,
      color: inkColor,
      direction: isRtl ? 'rtl' : 'ltr',
      background: 'white',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 22px, #F8F5EE 22px, #F8F5EE 23px)',
      backgroundSize: '100% 23px',
    }}>
      {visibleIds(sections).map(id => renderMap[id] ? renderMap[id]() : null)}
    </div>
  );
}
