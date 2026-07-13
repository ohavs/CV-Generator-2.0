import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import EditableBullets from './EditableBullets.jsx';

const MinimalTemplate = memo(function MinimalTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Label = ({ children }) => (
    <h2 style={{
      fontSize: 9, letterSpacing:'0.24em', textTransform:'uppercase',
      fontWeight:600, color:'#999', margin:'0 0 10px', fontFamily:'var(--cv-body)',
    }}>{children}</h2>
  );

  const Section = ({ id, title, children }) => (
    <section data-section={id} style={{ marginBottom: 18 }}>
      <Label>{title}</Label>
      {children}
    </section>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {showPhoto && (
            <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal','photo'], v)} size={66} accent={accent}/>
          )}
          <div>
            <Editable as="h1" {...F(['personal','name'])}
              style={{ fontFamily:'var(--cv-heading)', fontSize:40, fontWeight:400, margin:0, letterSpacing:'-0.025em', lineHeight:1, color:'#1A1A1A' }}/>
            <Editable as="div" {...F(['personal','title'])}
              style={{ fontSize:13, color:'#888', marginTop:6, fontWeight:400 }}/>
            <div style={{ display:'flex', gap:12, fontSize:10, color:'#666', marginTop:12, flexWrap:'wrap' }}>
              <Editable {...F(['personal','email'])}/>
              <span style={{color:'#ccc'}}>·</span>
              <Editable {...F(['personal','phone'])}/>
              <span style={{color:'#ccc'}}>·</span>
              <Editable {...F(['personal','location'])}/>
              {(data.personal?.links||[]).slice(0,2).map((l,i) => (
                <span key={i}><span style={{color:'#ccc'}}>·</span>{' '}
                  <Editable value={l.url} onChange={(v)=>onEdit(['personal','links',i,'url'],v)} style={{color:accent}}/>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>
    ),
    summary: () => (
      <Section key="summary" id="summary" title={t.sections.summary}>
        <Editable {...F(['summary'],{multiline:true,placeholder:t.labels.summaryPlaceholder,ai:true})} as="p"
          style={{ margin:0, fontSize:12, lineHeight:1.65, color:'#2A2A2A', maxWidth:'55ch' }}/>
      </Section>
    ),
    experience: () => (
      <Section key="experience" id="experience" title={t.sections.experience}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {(data.experience||[]).map((j,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16 }}>
              <div style={{ fontSize:9.5, color:'#999', paddingTop:3, letterSpacing:'0.02em' }}>
                {formatRange(j.start,j.end,lang)}
              </div>
              <div>
                <div style={{ marginBottom:4 }}>
                  <Editable value={j.role} onChange={(v)=>onEdit(['experience',i,'role'],v)}
                    style={{ fontSize:12.5, fontWeight:500, color:'#1A1A1A' }}/>
                  <span style={{ color:'#aaa', margin:'0 6px' }}>·</span>
                  <Editable value={j.company} onChange={(v)=>onEdit(['experience',i,'company'],v)}
                    style={{ fontSize:12.5, color:accent }}/>
                </div>
                <EditableBullets bullets={j.bullets||['']} onChange={(v)=>onEdit(['experience',i,'bullets'],v)}
                  accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dash"/>
              </div>
            </div>
          ))}
        </div>
      </Section>
    ),
    education: () => (
      <Section key="education" id="education" title={t.sections.education}>
        {(data.education||[]).map((e,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, marginBottom:8 }}>
            <div style={{ fontSize:9.5, color:'#999', paddingTop:3 }}>{formatRange(e.start,e.end,lang)}</div>
            <div>
              <Editable value={e.degree} onChange={(v)=>onEdit(['education',i,'degree'],v)} style={{ fontSize:12.5, fontWeight:500 }}/>
              <div style={{ marginTop:2 }}>
                <Editable value={e.school} onChange={(v)=>onEdit(['education',i,'school'],v)} style={{ fontSize:11.5, color:accent }}/>
              </div>
              {e.description && <Editable value={e.description} onChange={(v)=>onEdit(['education',i,'description'],v)} multiline enableAi
                as="div" style={{ fontSize:11, color:'#555', marginTop:3, lineHeight:1.5 }}/>}
            </div>
          </div>
        ))}
      </Section>
    ),
    skills: () => (
      <Section key="skills" id="skills" title={t.sections.skills}>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {(data.skills||[]).map((sk,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, fontSize:11 }}>
              <Editable value={sk.category} onChange={(v)=>onEdit(['skills',i,'category'],v)}
                style={{ color:'#999', fontSize:9.5, paddingTop:3, textTransform:'uppercase', letterSpacing:'0.08em' }}/>
              <Editable value={(sk.items||[]).join(', ')} onChange={(v)=>onEdit(['skills',i,'items'],v.split(/\s*,\s*/))}
                style={{ color:'#2A2A2A' }}/>
            </div>
          ))}
        </div>
      </Section>
    ),
    projects: () => (
      <Section key="projects" id="projects" title={t.sections.projects}>
        {(data.projects||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:10, maxWidth:'52ch' }}>
            <Editable value={p.name} onChange={(v)=>onEdit(['projects',i,'name'],v)} style={{ fontSize:12.5, fontWeight:500 }}/>
            {p.link && <><span style={{ color:'#aaa', margin:'0 6px' }}>·</span>
              <Editable value={p.link} onChange={(v)=>onEdit(['projects',i,'link'],v)} style={{ fontSize:10.5, color:accent }}/></>}
            <Editable value={p.description} onChange={(v)=>onEdit(['projects',i,'description'],v)} multiline enableAi as="div"
              style={{ fontSize:11, lineHeight:1.6, color:'#444', marginTop:2 }}/>
          </div>
        ))}
      </Section>
    ),
    languages: () => (
      <Section key="languages" id="languages" title={t.sections.languages}>
        <div style={{ display:'flex', gap:24, flexWrap:'wrap', fontSize:11 }}>
          {(data.languages||[]).map((l,i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v)=>onEdit(['languages',i,'name'],v)} style={{ fontWeight:500 }}/>
              <div style={{ fontSize:9.5, color:'#999', marginTop:1 }}>
                <Editable value={l.level} onChange={(v)=>onEdit(['languages',i,'level'],v)}/>
              </div>
            </div>
          ))}
        </div>
      </Section>
    ),
    certifications: () => (
      <Section key="certifications" id="certifications" title={t.sections.certifications}>
        {(data.certifications||[]).map((c,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, fontSize:11, marginBottom:4 }}>
            <Editable value={c.date} onChange={(v)=>onEdit(['certifications',i,'date'],v)} style={{ color:'#999', fontSize:9.5, paddingTop:3 }}/>
            <div>
              <Editable value={c.name} onChange={(v)=>onEdit(['certifications',i,'name'],v)} style={{ fontWeight:500 }}/>
              <span style={{ color:'#aaa', margin:'0 5px' }}>·</span>
              <Editable value={c.issuer} onChange={(v)=>onEdit(['certifications',i,'issuer'],v)} style={{ color:'#666' }}/>
            </div>
          </div>
        ))}
      </Section>
    ),
    awards: () => (
      <Section key="awards" id="awards" title={t.sections.awards}>
        {(data.awards||[]).map((a,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, fontSize:11, marginBottom:4 }}>
            <Editable value={a.date} onChange={(v)=>onEdit(['awards',i,'date'],v)} style={{ color:'#999', fontSize:9.5, paddingTop:3 }}/>
            <div>
              <Editable value={a.name} onChange={(v)=>onEdit(['awards',i,'name'],v)} style={{ fontWeight:500 }}/>
              {a.issuer && <><span style={{ color:'#aaa', margin:'0 5px' }}>·</span>
                <Editable value={a.issuer} onChange={(v)=>onEdit(['awards',i,'issuer'],v)} style={{ color:'#666' }}/></>}
            </div>
          </div>
        ))}
      </Section>
    ),
    volunteering: () => (
      <Section key="volunteering" id="volunteering" title={t.sections.volunteering}>
        {(data.volunteering||[]).map((v,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, marginBottom:8 }}>
            <div style={{ fontSize:9.5, color:'#999', paddingTop:3 }}>{formatRange(v.start,v.end,lang)}</div>
            <div>
              <Editable value={v.role} onChange={(vv)=>onEdit(['volunteering',i,'role'],vv)} style={{ fontSize:12, fontWeight:500 }}/>
              <div style={{ marginTop:2 }}>
                <Editable value={v.org} onChange={(vv)=>onEdit(['volunteering',i,'org'],vv)} style={{ fontSize:11, color:accent }}/>
              </div>
              {v.description && <Editable value={v.description} onChange={(vv)=>onEdit(['volunteering',i,'description'],vv)} multiline
                as="div" style={{ fontSize:11, color:'#555', marginTop:3, lineHeight:1.5 }}/>}
            </div>
          </div>
        ))}
      </Section>
    ),
    publications: () => (
      <Section key="publications" id="publications" title={t.sections.publications}>
        {(data.publications||[]).map((p,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:16, marginBottom:4 }}>
            <Editable value={p.date} onChange={(v)=>onEdit(['publications',i,'date'],v)} style={{ color:'#999', fontSize:9.5, paddingTop:3 }}/>
            <div style={{ fontSize:11 }}>
              <Editable value={p.title} onChange={(v)=>onEdit(['publications',i,'title'],v)} style={{ fontWeight:500 }}/>
              {p.venue && <><span style={{ color:'#aaa', margin:'0 5px' }}>·</span>
                <Editable value={p.venue} onChange={(v)=>onEdit(['publications',i,'venue'],v)} style={{ fontStyle:'italic', color:'#666' }}/></>}
            </div>
          </div>
        ))}
      </Section>
    ),
    hobbies: () => (
      <Section key="hobbies" id="hobbies" title={t.sections.hobbies}>
        <Editable {...F(['hobbies'],{multiline:true,ai:true})} as="div"
          style={{ fontSize:11, color:'#555', lineHeight:1.55, maxWidth:'50ch' }}/>
      </Section>
    ),
    links: () => null,
  };

  return (
    <div style={{ padding:'16mm 20mm', fontFamily:'var(--cv-body)', color:'#1A1A1A', fontSize:11.5, direction:isRtl?'rtl':'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.())}
    </div>
  );
});

export default MinimalTemplate;
