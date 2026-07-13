import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import EditableBullets from './EditableBullets.jsx';

// Executive: Classic formal, centered header, thick rules, serif body
const ExecutiveTemplate = memo(function ExecutiveTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, margin:'0 0 8px' }}>
        <div style={{ flex:1, height:1.5, background:'#1A1A1A' }}/>
        <h2 style={{
          fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase',
          fontWeight:700, color:'#1A1A1A', margin:0, fontFamily:'var(--cv-body)',
          whiteSpace:'nowrap',
        }}>{title}</h2>
        <div style={{ flex:1, height:1.5, background:'#1A1A1A' }}/>
      </div>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ textAlign:'center', marginBottom:20, paddingBottom:14 }}>
        {showPhoto && (
          <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
            <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal','photo'], v)} size={70} accent={accent}/>
          </div>
        )}
        <div style={{ borderTop:'3px solid #1A1A1A', borderBottom:'1px solid #1A1A1A', padding:'8px 0 6px', marginBottom:6 }}>
          <Editable as="h1" {...F(['personal','name'])}
            style={{ fontFamily:'var(--cv-heading)', fontSize:34, fontWeight:600, margin:0, letterSpacing:'0.04em', color:'#111' }}/>
        </div>
        <Editable as="div" {...F(['personal','title'])}
          style={{ fontSize:11, letterSpacing:'0.26em', textTransform:'uppercase', color:accent, fontWeight:600, margin:'6px 0 10px' }}/>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', fontSize:10, color:'#444', letterSpacing:'0.03em' }}>
          <Editable {...F(['personal','email'])}/>
          <span style={{color:'#bbb'}}>|</span>
          <Editable {...F(['personal','phone'])}/>
          <span style={{color:'#bbb'}}>|</span>
          <Editable {...F(['personal','location'])}/>
          {(data.personal?.links||[]).map((l,i) => (
            <span key={i}>
              <span style={{color:'#bbb'}}>|</span>
              {' '}
              <Editable value={l.url} onChange={(v)=>onEdit(['personal','links',i,'url'],v)} style={{color:accent}}/>
            </span>
          ))}
        </div>
        <div style={{ borderBottom:'3px solid #1A1A1A', marginTop:10 }}/>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'],{multiline:true,placeholder:t.labels.summaryPlaceholder,ai:true})} as="p"
          style={{ margin:0, fontSize:11, lineHeight:1.7, color:'#222', textAlign:'justify', fontFamily:'var(--cv-heading)' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        {(data.experience||[]).map((j,i) => (
          <div key={i} style={{ marginBottom:11 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
              <div>
                <Editable value={j.role} onChange={(v)=>onEdit(['experience',i,'role'],v)}
                  style={{ fontWeight:700, fontSize:11.5, color:'#111', fontFamily:'var(--cv-body)' }}/>
                <span style={{ color:'#888', margin:'0 5px' }}>•</span>
                <Editable value={j.company} onChange={(v)=>onEdit(['experience',i,'company'],v)}
                  style={{ fontSize:11.5, fontStyle:'italic', fontFamily:'var(--cv-heading)' }}/>
                {j.location && <>
                  <span style={{ color:'#888', margin:'0 5px' }}>•</span>
                  <Editable value={j.location} onChange={(v)=>onEdit(['experience',i,'location'],v)} style={{ fontSize:10.5, color:'#666' }}/>
                </>}
              </div>
              <span style={{ fontSize:9.5, color:accent, whiteSpace:'nowrap', letterSpacing:'0.06em', fontWeight:600, textTransform:'uppercase' }}>
                {formatRange(j.start,j.end,lang)}
              </span>
            </div>
            <EditableBullets bullets={j.bullets||['']} onChange={(v)=>onEdit(['experience',i,'bullets'],v)}
              accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="square"/>
          </div>
        ))}
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education||[]).map((e,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, marginBottom:7 }}>
            <div>
              <Editable value={e.degree} onChange={(v)=>onEdit(['education',i,'degree'],v)} style={{ fontWeight:700, fontSize:11.5 }}/>
              <span style={{ color:'#888', margin:'0 5px' }}>•</span>
              <Editable value={e.school} onChange={(v)=>onEdit(['education',i,'school'],v)} style={{ fontSize:11.5, fontStyle:'italic', fontFamily:'var(--cv-heading)' }}/>
            </div>
            <span style={{ fontSize:9.5, color:accent, whiteSpace:'nowrap', letterSpacing:'0.06em', fontWeight:600, textTransform:'uppercase' }}>
              {formatRange(e.start,e.end,lang)}
            </span>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        {(data.skills||[]).map((sk,i) => (
          <div key={i} style={{ display:'flex', gap:8, fontSize:11, marginBottom:3, alignItems:'baseline' }}>
            <Editable value={sk.category} onChange={(v)=>onEdit(['skills',i,'category'],v)} style={{ fontWeight:700, color:'#111', minWidth:80 }}/>
            <span style={{ color:'#ccc' }}>|</span>
            <Editable value={(sk.items||[]).join(' · ')} onChange={(v)=>onEdit(['skills',i,'items'],v.split(/\s*[·,]\s*/))} style={{ color:'#444', flex:1 }}/>
          </div>
        ))}
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display:'flex', gap:'4px 20px', flexWrap:'wrap', fontSize:11 }}>
          {(data.languages||[]).map((l,i) => (
            <span key={i}>
              <Editable value={l.name} onChange={(v)=>onEdit(['languages',i,'name'],v)} style={{ fontWeight:700 }}/>
              <span style={{ color:'#999', margin:'0 4px' }}>—</span>
              <Editable value={l.level} onChange={(v)=>onEdit(['languages',i,'level'],v)} style={{ color:'#555', fontStyle:'italic' }}/>
              {i < (data.languages||[]).length-1 && <span style={{color:'#ccc', margin:'0 10px'}}>|</span>}
            </span>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:8 }}>
            <div>
              <Editable value={p.name} onChange={(v)=>onEdit(['projects',i,'name'],v)} style={{ fontWeight:700, fontSize:11.5 }}/>
              {p.link && <>
                <span style={{ color:'#ccc', margin:'0 6px' }}>|</span>
                <Editable value={p.link} onChange={(v)=>onEdit(['projects',i,'link'],v)} style={{ fontSize:10.5, color:accent, fontStyle:'italic' }}/>
              </>}
            </div>
            <Editable value={p.description} onChange={(v)=>onEdit(['projects',i,'description'],v)} multiline enableAi as="div"
              style={{ fontSize:11, color:'#444', marginTop:2, lineHeight:1.55 }}/>
          </div>
        ))}
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications||[]).map((c,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
            <div>
              <Editable value={c.name} onChange={(v)=>onEdit(['certifications',i,'name'],v)} style={{ fontWeight:700 }}/>
              <span style={{ color:'#888', margin:'0 5px' }}>•</span>
              <Editable value={c.issuer} onChange={(v)=>onEdit(['certifications',i,'issuer'],v)} style={{ fontStyle:'italic' }}/>
            </div>
            <Editable value={c.date} onChange={(v)=>onEdit(['certifications',i,'date'],v)} style={{ color:accent, fontWeight:600 }}/>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'],{multiline:true,ai:true})} as="div" style={{ fontSize:11, color:'#444', lineHeight:1.6 }}/>
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards||[]).map((a,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
            <div>
              <Editable value={a.name} onChange={(v)=>onEdit(['awards',i,'name'],v)} style={{ fontWeight:700 }}/>
              {a.issuer && <><span style={{ color:'#888', margin:'0 5px' }}>•</span>
                <Editable value={a.issuer} onChange={(v)=>onEdit(['awards',i,'issuer'],v)} style={{ fontStyle:'italic' }}/></>}
            </div>
            <Editable value={a.date} onChange={(v)=>onEdit(['awards',i,'date'],v)} style={{ color:accent, fontWeight:600 }}/>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        {(data.volunteering||[]).map((v,i) => (
          <div key={i} style={{ marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
              <div>
                <Editable value={v.role} onChange={(vv)=>onEdit(['volunteering',i,'role'],vv)} style={{ fontWeight:700, fontSize:11.5 }}/>
                <span style={{ color:'#888', margin:'0 5px' }}>•</span>
                <Editable value={v.org} onChange={(vv)=>onEdit(['volunteering',i,'org'],vv)} style={{ fontSize:11.5, fontStyle:'italic', fontFamily:'var(--cv-heading)' }}/>
              </div>
              <span style={{ fontSize:9.5, color:accent, whiteSpace:'nowrap', fontWeight:600 }}>{formatRange(v.start,v.end,lang)}</span>
            </div>
            {v.description && <Editable value={v.description} onChange={(vv)=>onEdit(['volunteering',i,'description'],vv)} multiline
              as="div" style={{ fontSize:11, color:'#444', marginTop:2, lineHeight:1.5 }}/>}
          </div>
        ))}
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications||[]).map((p,i) => (
          <div key={i} style={{ fontSize:11, marginBottom:4 }}>
            <Editable value={p.title} onChange={(v)=>onEdit(['publications',i,'title'],v)} style={{ fontWeight:700 }}/>
            {p.venue && <><span style={{ color:'#888', margin:'0 5px' }}>•</span>
              <Editable value={p.venue} onChange={(v)=>onEdit(['publications',i,'venue'],v)} style={{ fontStyle:'italic' }}/></>}
            <span style={{ color:'#999', margin:'0 5px' }}>•</span>
            <Editable value={p.date} onChange={(v)=>onEdit(['publications',i,'date'],v)} style={{ color:accent }}/>
          </div>
        ))}
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{ padding:'14mm 18mm', fontFamily:'var(--cv-body)', color:'#1A1A1A', direction:isRtl?'rtl':'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.())}
    </div>
  );
});

export default ExecutiveTemplate;
