import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import EditableBullets from './EditableBullets.jsx';

// Stripe: Clean modern with bold left accent bar, crisp typography
const StripeTemplate = memo(function StripeTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 16, display:'flex', gap:16 }}>
      <div style={{ width:3, background:accent, borderRadius:2, flexShrink:0, marginTop:2 }}/>
      <div style={{ flex:1 }}>
        <h2 style={{
          fontSize:10.5, letterSpacing:'0.16em', textTransform:'uppercase',
          fontWeight:700, color:accent, margin:'0 0 9px', fontFamily:'var(--cv-body)',
        }}>{title}</h2>
        {children}
      </div>
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom:22, paddingBottom:16, borderBottom:`2px solid #111` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        {showPhoto && (
          <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal','photo'], v)} size={68} accent={accent}/>
        )}
        <div style={{ flex:1, display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16 }}>
          <div>
            <Editable as="h1" {...F(['personal','name'])}
              style={{ fontFamily:'var(--cv-heading)', fontSize:38, fontWeight:600, margin:0, letterSpacing:'-0.02em', lineHeight:1, color:'#111' }}/>
            <Editable as="div" {...F(['personal','title'])}
              style={{ fontSize:13, color:accent, marginTop:6, fontWeight:500, letterSpacing:'0.02em' }}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:10, color:'#555', textAlign: isRtl?'left':'right', flexShrink:0 }}>
            <Editable {...F(['personal','email'])}/>
            <Editable {...F(['personal','phone'])}/>
            <Editable {...F(['personal','location'])}/>
            {(data.personal?.links||[]).slice(0,2).map((l,i) => (
              <Editable key={i} value={l.url} onChange={(v)=>onEdit(['personal','links',i,'url'],v)} style={{color:accent}}/>
            ))}
          </div>
        </div>
        </div>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'],{multiline:true,placeholder:t.labels.summaryPlaceholder,ai:true})} as="p"
          style={{ margin:0, fontSize:11.5, lineHeight:1.7, color:'#333' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {(data.experience||[]).map((j,i) => (
            <div key={i}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, marginBottom:3 }}>
                <div style={{ display:'flex', gap:6, alignItems:'baseline', flexWrap:'wrap' }}>
                  <Editable value={j.role} onChange={(v)=>onEdit(['experience',i,'role'],v)}
                    style={{ fontSize:13, fontWeight:700, color:'#111', fontFamily:'var(--cv-body)' }}/>
                  <span style={{ color:'#ccc' }}>at</span>
                  <Editable value={j.company} onChange={(v)=>onEdit(['experience',i,'company'],v)}
                    style={{ fontSize:12.5, color:accent, fontFamily:'var(--cv-heading)' }}/>
                </div>
                <span style={{ fontSize:10, color:'#888', whiteSpace:'nowrap', fontWeight:500 }}>
                  {formatRange(j.start,j.end,lang)}
                </span>
              </div>
              <EditableBullets bullets={j.bullets||['']} onChange={(v)=>onEdit(['experience',i,'bullets'],v)}
                accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dot"/>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education||[]).map((e,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:8, marginBottom:8 }}>
            <div>
              <Editable value={e.degree} onChange={(v)=>onEdit(['education',i,'degree'],v)} style={{ fontSize:12.5, fontWeight:700, color:'#111' }}/>
              <div style={{ marginTop:2 }}>
                <Editable value={e.school} onChange={(v)=>onEdit(['education',i,'school'],v)} style={{ fontSize:11.5, color:'#666' }}/>
              </div>
              {e.description && <Editable value={e.description} onChange={(v)=>onEdit(['education',i,'description'],v)} multiline enableAi
                as="div" style={{ fontSize:11, color:'#555', marginTop:3, lineHeight:1.5 }}/>}
            </div>
            <span style={{ fontSize:10, color:accent, whiteSpace:'nowrap', fontWeight:600 }}>
              {formatRange(e.start,e.end,lang)}
            </span>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {(data.skills||[]).map((sk,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'baseline', fontSize:11.5 }}>
              <Editable value={sk.category} onChange={(v)=>onEdit(['skills',i,'category'],v)}
                style={{ fontWeight:700, color:accent, minWidth:72, fontSize:10.5 }}/>
              <Editable value={(sk.items||[]).join(' · ')} onChange={(v)=>onEdit(['skills',i,'items'],v.split(/\s*[·,]\s*/))}
                style={{ color:'#333' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display:'flex', gap:'4px 20px', flexWrap:'wrap', fontSize:11.5 }}>
          {(data.languages||[]).map((l,i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v)=>onEdit(['languages',i,'name'],v)} style={{ fontWeight:700 }}/>
              <span style={{ color:'#bbb', margin:'0 5px' }}>—</span>
              <Editable value={l.level} onChange={(v)=>onEdit(['languages',i,'level'],v)} style={{ color:'#666' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
              <Editable value={p.name} onChange={(v)=>onEdit(['projects',i,'name'],v)} style={{ fontSize:12.5, fontWeight:700, color:'#111' }}/>
              {p.link && <Editable value={p.link} onChange={(v)=>onEdit(['projects',i,'link'],v)} style={{ fontSize:10.5, color:accent }}/>}
            </div>
            <Editable value={p.description} onChange={(v)=>onEdit(['projects',i,'description'],v)} multiline enableAi as="div"
              style={{ fontSize:11.5, color:'#444', marginTop:3, lineHeight:1.55 }}/>
          </div>
        ))}
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications||[]).map((c,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, marginBottom:4 }}>
            <div>
              <Editable value={c.name} onChange={(v)=>onEdit(['certifications',i,'name'],v)} style={{ fontWeight:600 }}/>
              <span style={{ color:'#bbb', margin:'0 5px' }}>·</span>
              <Editable value={c.issuer} onChange={(v)=>onEdit(['certifications',i,'issuer'],v)} style={{ color:'#666' }}/>
            </div>
            <Editable value={c.date} onChange={(v)=>onEdit(['certifications',i,'date'],v)} style={{ color:accent, fontWeight:600 }}/>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'],{multiline:true,ai:true})} as="div" style={{ fontSize:11.5, color:'#555', lineHeight:1.6 }}/>
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards||[]).map((a,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, marginBottom:4 }}>
            <div>
              <Editable value={a.name} onChange={(v)=>onEdit(['awards',i,'name'],v)} style={{ fontWeight:600 }}/>
              {a.issuer && <><span style={{ color:'#bbb', margin:'0 5px' }}>·</span>
                <Editable value={a.issuer} onChange={(v)=>onEdit(['awards',i,'issuer'],v)} style={{ color:'#666' }}/></>}
            </div>
            <Editable value={a.date} onChange={(v)=>onEdit(['awards',i,'date'],v)} style={{ color:accent, fontWeight:600 }}/>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {(data.volunteering||[]).map((v,i) => (
            <div key={i}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, marginBottom:2 }}>
                <div>
                  <Editable value={v.role} onChange={(vv)=>onEdit(['volunteering',i,'role'],vv)} style={{ fontSize:12.5, fontWeight:700 }}/>
                  <span style={{ color:'#ccc', fontSize:11, margin:'0 5px' }}>at</span>
                  <Editable value={v.org} onChange={(vv)=>onEdit(['volunteering',i,'org'],vv)} style={{ fontSize:12, color:accent }}/>
                </div>
                <span style={{ fontSize:10, color:'#888', whiteSpace:'nowrap' }}>{formatRange(v.start,v.end,lang)}</span>
              </div>
              {v.description && <Editable value={v.description} onChange={(vv)=>onEdit(['volunteering',i,'description'],vv)} multiline
                as="div" style={{ fontSize:11, color:'#444', lineHeight:1.5 }}/>}
            </div>
          ))}
        </div>
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications||[]).map((p,i) => (
          <div key={i} style={{ fontSize:11.5, marginBottom:4 }}>
            <Editable value={p.title} onChange={(v)=>onEdit(['publications',i,'title'],v)} style={{ fontWeight:600 }}/>
            {p.venue && <><span style={{ color:'#bbb', margin:'0 5px' }}>·</span>
              <Editable value={p.venue} onChange={(v)=>onEdit(['publications',i,'venue'],v)} style={{ color:'#666', fontStyle:'italic' }}/></>}
            <span style={{ color:'#bbb', margin:'0 5px' }}>·</span>
            <Editable value={p.date} onChange={(v)=>onEdit(['publications',i,'date'],v)} style={{ color:'#888' }}/>
          </div>
        ))}
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{ padding:'14mm 16mm', fontFamily:'var(--cv-body)', color:'#1A1A1A', direction:isRtl?'rtl':'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.())}
    </div>
  );
});

export default StripeTemplate;
