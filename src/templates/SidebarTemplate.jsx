import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import Icon from '../components/Icon.jsx';
import EditableBullets from './EditableBullets.jsx';

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'certifications', 'hobbies', 'links']);

export default function SidebarTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const visible = visibleIds(sections);
  const mainSections = visible.filter(id => !SIDEBAR_SECTIONS.has(id) && id !== 'personal');
  const sidebarSections = visible.filter(id => SIDEBAR_SECTIONS.has(id));

  const sidebarBg = `linear-gradient(180deg, ${accent}, color-mix(in oklab, ${accent} 80%, #000))`;
  const sidebarTextColor = 'rgba(255,255,255,0.94)';
  const sidebarMuted = 'rgba(255,255,255,0.7)';

  const SideHeading = ({ children }) => (
    <h3 style={{
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      fontWeight: 600, color: 'rgba(255,255,255,0.85)',
      margin: '0 0 10px', paddingBottom: 6,
      borderBottom: '1px solid rgba(255,255,255,0.25)',
    }}>{children}</h3>
  );

  const MainHeading = ({ children }) => (
    <h2 style={{
      fontFamily: 'var(--cv-heading)', fontSize: 18, fontWeight: 500,
      color: '#1A1A1A', margin: '0 0 12px', letterSpacing: '-0.01em',
    }}>{children}</h2>
  );

  const renderSidebarSection = (id) => {
    switch (id) {
      case 'skills':
        return (
          <section key="skills" data-section="skills" style={{ marginBottom: 22 }}>
            <SideHeading>{t.sections.skills}</SideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.skills || []).map((sk, i) => (
                <div key={i}>
                  <Editable value={sk.category} onChange={(v) => onEdit(['skills', i, 'category'], v)}
                    style={{ fontWeight: 600, fontSize: 11, color: 'white', display: 'block', marginBottom: 4 }}/>
                  <Editable
                    value={(sk.items || []).join(' · ')}
                    onChange={(v) => onEdit(['skills', i, 'items'], v.split(/\s*[·,]\s*/))}
                    style={{ fontSize: 10.5, color: sidebarTextColor, lineHeight: 1.5 }}/>
                </div>
              ))}
            </div>
          </section>
        );
      case 'languages':
        return (
          <section key="languages" data-section="languages" style={{ marginBottom: 22 }}>
            <SideHeading>{t.sections.languages}</SideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(data.languages || []).map((l, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11 }}>
                    <Editable value={l.name} onChange={(v) => onEdit(['languages', i, 'name'], v)} style={{ fontWeight: 500 }}/>
                    <Editable value={l.level} onChange={(v) => onEdit(['languages', i, 'level'], v)} style={{ fontSize: 9.5, color: sidebarMuted }}/>
                  </div>
                  <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                    {[1,2,3,4,5].map(d => (
                      <button key={d} onClick={() => onEdit(['languages', i, 'dots'], d)}
                        style={{
                          height: 4, flex: 1, borderRadius: 2, padding: 0, cursor: 'pointer',
                          background: d <= (l.dots || 0) ? 'white' : 'rgba(255,255,255,0.22)',
                          border: 'none',
                        }}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return (
          <section key="certifications" data-section="certifications" style={{ marginBottom: 22 }}>
            <SideHeading>{t.sections.certifications}</SideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {(data.certifications || []).map((c, i) => (
                <div key={i} style={{ fontSize: 10.5, lineHeight: 1.4 }}>
                  <Editable value={c.name} onChange={(v) => onEdit(['certifications', i, 'name'], v)} style={{ fontWeight: 500, display: 'block' }}/>
                  <Editable value={c.issuer} onChange={(v) => onEdit(['certifications', i, 'issuer'], v)} style={{ color: sidebarMuted, fontSize: 10 }}/>
                  <span style={{ color: sidebarMuted, margin: '0 4px' }}>·</span>
                  <Editable value={c.date} onChange={(v) => onEdit(['certifications', i, 'date'], v)} style={{ color: sidebarMuted, fontSize: 10 }}/>
                </div>
              ))}
            </div>
          </section>
        );
      case 'links': {
        const links = data.personal?.links || [];
        return (
          <section key="links" data-section="links" style={{ marginBottom: 22 }}>
            <SideHeading>{t.sections.links}</SideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {links.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 10.5 }}>
                  <Icon name={l.icon || 'globe'} size={11} style={{ flexShrink: 0 }}/>
                  <Editable value={l.url} onChange={(v) => onEdit(['personal', 'links', i, 'url'], v)} style={{ color: sidebarTextColor, wordBreak: 'break-all' }}/>
                </div>
              ))}
            </div>
          </section>
        );
      }
      case 'hobbies':
        return (
          <section key="hobbies" data-section="hobbies" style={{ marginBottom: 22 }}>
            <SideHeading>{t.sections.hobbies}</SideHeading>
            <Editable {...F(['hobbies'], { multiline: true, ai: true })} as="div"
              style={{ fontSize: 10.5, color: sidebarTextColor, lineHeight: 1.55 }}/>
          </section>
        );
      default: return null;
    }
  };

  const renderMainSection = (id) => {
    switch (id) {
      case 'summary':
        return (
          <section key="summary" data-section="summary" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.summary}</MainHeading>
            <Editable {...F(['summary'], { multiline: true, placeholder: t.labels.summaryPlaceholder, ai: true })} as="p"
              style={{ margin: 0, fontSize: 11.5, lineHeight: 1.65, color: '#2A2A2A', textWrap: 'pretty' }}/>
          </section>
        );
      case 'experience':
        return (
          <section key="experience" data-section="experience" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.experience}</MainHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(data.experience || []).map((j, i) => (
                <div key={i} style={{ position: 'relative', paddingInlineStart: 14 }}>
                  <div style={{ position: 'absolute', insetInlineStart: 0, top: 5, width: 6, height: 6, borderRadius: '50%', background: accent }}/>
                  <div style={{ position: 'absolute', insetInlineStart: 2.5, top: 14, bottom: -16, width: 1, background: '#E5E0D8' }}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <Editable value={j.role} onChange={(v) => onEdit(['experience', i, 'role'], v)}
                      style={{ fontFamily: 'var(--cv-heading)', fontSize: 13.5, fontWeight: 500, color: '#1A1A1A' }}/>
                    <span style={{ fontSize: 10, color: '#888', letterSpacing: '0.04em' }}>{formatRange(j.start, j.end, lang)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: accent, fontWeight: 500, marginBottom: 6 }}>
                    <Editable value={j.company} onChange={(v) => onEdit(['experience', i, 'company'], v)}/>
                    {j.location && <>
                      <span style={{ color: '#aaa', margin: '0 6px' }}>·</span>
                      <Editable value={j.location} onChange={(v) => onEdit(['experience', i, 'location'], v)} style={{ color: '#888', fontWeight: 400 }}/>
                    </>}
                  </div>
                  <EditableBullets
                    bullets={j.bullets || ['']}
                    onChange={(v) => onEdit(['experience', i, 'bullets'], v)}
                    accent={accent} lang={lang}
                    placeholder={t.labels.bulletPlaceholder}
                    bulletStyle="dot"
                  />
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section key="education" data-section="education" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.education}</MainHeading>
            {(data.education || []).map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <Editable value={e.degree} onChange={(v) => onEdit(['education', i, 'degree'], v)}
                    style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500 }}/>
                  <span style={{ fontSize: 10, color: '#888' }}>{formatRange(e.start, e.end, lang)}</span>
                </div>
                <Editable value={e.school} onChange={(v) => onEdit(['education', i, 'school'], v)} style={{ fontSize: 11, color: accent }}/>
                {e.description && <Editable value={e.description} onChange={(v) => onEdit(['education', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.55 }}/>}
              </div>
            ))}
          </section>
        );
      case 'projects':
        return (
          <section key="projects" data-section="projects" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.projects}</MainHeading>
            {(data.projects || []).map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <Editable value={p.name} onChange={(v) => onEdit(['projects', i, 'name'], v)} style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500 }}/>
                  {p.link && <Editable value={p.link} onChange={(v) => onEdit(['projects', i, 'link'], v)} style={{ fontSize: 10.5, color: accent }}/>}
                </div>
                <Editable value={p.description} onChange={(v) => onEdit(['projects', i, 'description'], v)} multiline enableAi as="div"
                  style={{ fontSize: 11.5, color: '#444', marginTop: 3, lineHeight: 1.55 }}/>
              </div>
            ))}
          </section>
        );
      case 'awards':
        return (
          <section key="awards" data-section="awards" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.awards}</MainHeading>
            {(data.awards || []).map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 5 }}>
                <div>
                  <Editable value={a.name} onChange={(v) => onEdit(['awards', i, 'name'], v)} style={{ fontWeight: 600 }}/>
                  {a.issuer && <><span style={{ color: '#bbb', margin: '0 5px' }}>·</span>
                    <Editable value={a.issuer} onChange={(v) => onEdit(['awards', i, 'issuer'], v)} style={{ color: '#666' }}/></>}
                </div>
                <Editable value={a.date} onChange={(v) => onEdit(['awards', i, 'date'], v)} style={{ color: accent, fontWeight: 600 }}/>
              </div>
            ))}
          </section>
        );
      case 'volunteering':
        return (
          <section key="volunteering" data-section="volunteering" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.volunteering}</MainHeading>
            {(data.volunteering || []).map((v, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <div>
                    <Editable value={v.role} onChange={(vv) => onEdit(['volunteering', i, 'role'], vv)} style={{ fontFamily: 'var(--cv-heading)', fontSize: 13, fontWeight: 500 }}/>
                    <span style={{ color: '#bbb', margin: '0 5px' }}>at</span>
                    <Editable value={v.org} onChange={(vv) => onEdit(['volunteering', i, 'org'], vv)} style={{ fontSize: 12, color: accent }}/>
                  </div>
                  <span style={{ fontSize: 10, color: '#888' }}>{formatRange(v.start, v.end, lang)}</span>
                </div>
                {v.description && <Editable value={v.description} onChange={(vv) => onEdit(['volunteering', i, 'description'], vv)} multiline
                  as="div" style={{ fontSize: 11, color: '#444', marginTop: 3, lineHeight: 1.5 }}/>}
              </div>
            ))}
          </section>
        );
      case 'publications':
        return (
          <section key="publications" data-section="publications" style={{ marginBottom: 22 }}>
            <MainHeading>{t.sections.publications}</MainHeading>
            {(data.publications || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11.5, marginBottom: 5 }}>
                <Editable value={p.title} onChange={(v) => onEdit(['publications', i, 'title'], v)} style={{ fontWeight: 600 }}/>
                {p.venue && <><span style={{ color: '#bbb', margin: '0 5px' }}>·</span>
                  <Editable value={p.venue} onChange={(v) => onEdit(['publications', i, 'venue'], v)} style={{ color: '#666', fontStyle: 'italic' }}/></>}
                <span style={{ color: '#bbb', margin: '0 5px' }}>·</span>
                <Editable value={p.date} onChange={(v) => onEdit(['publications', i, 'date'], v)} style={{ color: accent }}/>
              </div>
            ))}
          </section>
        );
      default: return null;
    }
  };

  const showPersonal = visible.includes('personal');

  return (
    <div style={{
      display: 'flex',
      flexDirection: isRtl ? 'row-reverse' : 'row',
      width: '100%',
      minHeight: '297mm',
      fontFamily: 'var(--cv-body)',
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      <aside style={{ width: '36%', background: sidebarBg, color: 'white', padding: '16mm 14mm' }}>
        {showPersonal && (
          <div style={{ marginBottom: 24, textAlign: isRtl ? 'right' : 'left' }}>
            {showPhoto && (
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal', 'photo'], v)} size={92} accent="white"/>
              </div>
            )}
            <Editable as="h1" {...F(['personal', 'name'])}
              style={{ fontFamily: 'var(--cv-heading)', fontSize: 26, fontWeight: 500, color: 'white', margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}/>
            <Editable as="div" {...F(['personal', 'title'])}
              style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontStyle: 'italic' }}/>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7, fontSize: 10.5 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon name="mail" size={11} style={{ flexShrink: 0 }}/><Editable {...F(['personal', 'email'])}/>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon name="phone" size={11} style={{ flexShrink: 0 }}/><Editable {...F(['personal', 'phone'])}/>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon name="pin" size={11} style={{ flexShrink: 0 }}/><Editable {...F(['personal', 'location'])}/>
              </div>
            </div>
          </div>
        )}
        {sidebarSections.map(id => renderSidebarSection(id))}
      </aside>
      <main style={{ flex: 1, padding: '16mm 14mm', color: '#1A1A1A', background: 'white' }}>
        {mainSections.map(id => renderMainSection(id))}
      </main>
    </div>
  );
}
