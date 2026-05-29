import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import Icon from '../components/Icon.jsx';
import EditableBullets from './EditableBullets.jsx';

const ClassicTemplate = memo(function ClassicTemplate({ data, accent, lang, sections, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Section = ({ id, title, children }) => (
    <section style={{ marginBottom: 11 }} data-section={id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 7 }}>
        <h2 style={{
          fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 700, color: accent, margin: 0, fontFamily: 'var(--cv-body)',
          whiteSpace: 'nowrap',
        }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: '#1A1A1A' }}/>
      </div>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #1A1A1A' }}>
        <Editable as="h1" {...F(['personal','name'])}
          style={{ fontFamily:'var(--cv-heading)', fontSize:36, fontWeight:500, margin:'0 0 4px', letterSpacing:'-0.01em', lineHeight:1.05 }}/>
        <Editable as="div" {...F(['personal','title'])}
          style={{ fontSize:11.5, letterSpacing:'0.22em', textTransform:'uppercase', color:accent, fontWeight:500, marginBottom:8 }}/>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', fontSize:10, color:'#3A3A3A' }}>
          <Editable {...F(['personal','email'])}/>
          <span style={{color:'#999'}}>·</span>
          <Editable {...F(['personal','phone'])}/>
          <span style={{color:'#999'}}>·</span>
          <Editable {...F(['personal','location'])}/>
          {(data.personal?.links||[]).slice(0,2).map((l,i) => (
            <span key={i}><span style={{color:'#999'}}>·</span>{' '}
              <Editable value={l.url} onChange={(v)=>onEdit(['personal','links',i,'url'],v)} style={{color:accent}}/>
            </span>
          ))}
        </div>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'],{multiline:true,placeholder:t.labels.summaryPlaceholder,ai:true})} as="p"
          style={{ margin:0, fontSize:11, lineHeight:1.6, color:'#262626' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        {(data.experience||[]).map((job,i) => (
          <div key={i} style={{ marginBottom:10 }} className="array-item">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, marginBottom:2 }}>
              <div>
                <Editable value={job.role} onChange={(v)=>onEdit(['experience',i,'role'],v)}
                  style={{ fontWeight:600, fontSize:11.5, color:'#1A1A1A' }}/>
                <span style={{ color:'#666', margin:'0 5px' }}>·</span>
                <Editable value={job.company} onChange={(v)=>onEdit(['experience',i,'company'],v)}
                  style={{ fontStyle:'italic', fontSize:11.5, fontFamily:'var(--cv-heading)' }}/>
              </div>
              <span style={{ fontSize:10, color:'#666', whiteSpace:'nowrap' }}>
                {formatRange(job.start,job.end,lang)}{job.location && ` · ${job.location}`}
              </span>
            </div>
            <EditableBullets bullets={job.bullets||['']} onChange={(v)=>onEdit(['experience',i,'bullets'],v)}
              accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dot"/>
          </div>
        ))}
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education||[]).map((ed,i) => (
          <div key={i} style={{ marginBottom:7 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12 }}>
              <div>
                <Editable value={ed.degree} onChange={(v)=>onEdit(['education',i,'degree'],v)} style={{ fontWeight:600, fontSize:11.5 }}/>
                <span style={{ color:'#666', margin:'0 5px' }}>·</span>
                <Editable value={ed.school} onChange={(v)=>onEdit(['education',i,'school'],v)} style={{ fontStyle:'italic', fontSize:11.5, fontFamily:'var(--cv-heading)' }}/>
              </div>
              <span style={{ fontSize:10, color:'#666', whiteSpace:'nowrap' }}>{formatRange(ed.start,ed.end,lang)}</span>
            </div>
            {ed.description && <Editable value={ed.description} onChange={(v)=>onEdit(['education',i,'description'],v)} enableAi multiline
              as="div" style={{ fontSize:10.5, color:'#444', marginTop:2, lineHeight:1.5 }}/>}
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {(data.skills||[]).map((sk,i) => (
            <div key={i} style={{ fontSize:11, lineHeight:1.5 }}>
              <Editable value={sk.category} onChange={(v)=>onEdit(['skills',i,'category'],v)}
                style={{ fontWeight:600, color:accent, marginInlineEnd:7 }}/>
              <Editable value={(sk.items||[]).join(' · ')} onChange={(v)=>onEdit(['skills',i,'items'],v.split(/\s*[·,•]\s*/))}
                style={{ color:'#333' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display:'flex', gap:18, flexWrap:'wrap', fontSize:11 }}>
          {(data.languages||[]).map((l,i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v)=>onEdit(['languages',i,'name'],v)} style={{ fontWeight:600 }}/>
              <span style={{ color:'#666', margin:'0 4px' }}>—</span>
              <Editable value={l.level} onChange={(v)=>onEdit(['languages',i,'level'],v)} style={{ fontStyle:'italic', color:'#444' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:7 }}>
            <Editable value={p.name} onChange={(v)=>onEdit(['projects',i,'name'],v)} style={{ fontWeight:600, fontSize:11.5 }}/>
            {p.link && <><span style={{ color:'#666', margin:'0 5px' }}>·</span>
              <Editable value={p.link} onChange={(v)=>onEdit(['projects',i,'link'],v)} style={{ fontSize:10.5, color:accent, fontStyle:'italic' }}/></>}
            <Editable value={p.description} onChange={(v)=>onEdit(['projects',i,'description'],v)} multiline enableAi
              as="div" style={{ fontSize:11, lineHeight:1.55, color:'#333', marginTop:2 }}/>
          </div>
        ))}
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications||[]).map((c,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
            <span>
              <Editable value={c.name} onChange={(v)=>onEdit(['certifications',i,'name'],v)} style={{ fontWeight:600 }}/>
              <span style={{ color:'#666', margin:'0 5px' }}>·</span>
              <Editable value={c.issuer} onChange={(v)=>onEdit(['certifications',i,'issuer'],v)} style={{ fontStyle:'italic' }}/>
            </span>
            <Editable value={c.date} onChange={(v)=>onEdit(['certifications',i,'date'],v)} style={{ color:'#666' }}/>
          </div>
        ))}
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards||[]).map((a,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
            <span>
              <Editable value={a.name} onChange={(v)=>onEdit(['awards',i,'name'],v)} style={{ fontWeight:600 }}/>
              {a.issuer && <><span style={{ color:'#666', margin:'0 5px' }}>·</span>
                <Editable value={a.issuer} onChange={(v)=>onEdit(['awards',i,'issuer'],v)} style={{ fontStyle:'italic' }}/></>}
            </span>
            <Editable value={a.date} onChange={(v)=>onEdit(['awards',i,'date'],v)} style={{ color:'#666' }}/>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        {(data.volunteering||[]).map((v,i) => (
          <div key={i} style={{ marginBottom:7 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12 }}>
              <div>
                <Editable value={v.role} onChange={(vv)=>onEdit(['volunteering',i,'role'],vv)} style={{ fontWeight:600, fontSize:11.5 }}/>
                <span style={{ color:'#666', margin:'0 5px' }}>·</span>
                <Editable value={v.org} onChange={(vv)=>onEdit(['volunteering',i,'org'],vv)} style={{ fontStyle:'italic', fontSize:11.5 }}/>
              </div>
              <span style={{ fontSize:10, color:'#666', whiteSpace:'nowrap' }}>{formatRange(v.start,v.end,lang)}</span>
            </div>
            {v.description && <Editable value={v.description} onChange={(vv)=>onEdit(['volunteering',i,'description'],vv)} multiline
              as="div" style={{ fontSize:10.5, color:'#444', marginTop:2, lineHeight:1.5 }}/>}
          </div>
        ))}
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:5, fontSize:11 }}>
            <Editable value={p.title} onChange={(v)=>onEdit(['publications',i,'title'],v)} style={{ fontWeight:600 }}/>
            {p.venue && <><span style={{ color:'#666', margin:'0 5px' }}>·</span>
              <Editable value={p.venue} onChange={(v)=>onEdit(['publications',i,'venue'],v)} style={{ fontStyle:'italic', color:'#444' }}/></>}
            <span style={{ color:'#999', margin:'0 5px' }}>·</span>
            <Editable value={p.date} onChange={(v)=>onEdit(['publications',i,'date'],v)} style={{ color:'#666' }}/>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'],{multiline:true,ai:true})} as="div" style={{ fontSize:11, color:'#333', lineHeight:1.55 }}/>
      </Section>
    ),
    links: () => {
      const links = data.personal?.links||[];
      if (!links.length) return null;
      return (
        <Section key="links" id="links" title={t.sections.links}>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontSize:10.5 }}>
            {links.map((l,i) => (
              <span key={i} style={{ display:'inline-flex', gap:4, alignItems:'center' }} className="array-item">
                <Icon name={l.icon||'globe'} size={10}/>
                <Editable value={l.url} onChange={(v)=>onEdit(['personal','links',i,'url'],v)} style={{color:accent}}/>
              </span>
            ))}
          </div>
        </Section>
      );
    },
  };

  return (
    <div style={{ padding:'14mm 16mm', fontFamily:'var(--cv-body)', color:'#1A1A1A', fontSize:11, direction:isRtl?'rtl':'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.())}
    </div>
  );
});

export default ClassicTemplate;
