import { memo } from 'react';
import { I18N, formatRange } from '../data.js';
import { makeField, visibleIds } from './helpers.js';
import Editable from '../components/Editable.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import EditableBullets from './EditableBullets.jsx';

// Nordic: Scandinavian minimalism — spacious, elegant, two-column grid
const NordicTemplate = memo(function NordicTemplate({ data, accent, lang, sections, showPhoto, onEdit }) {
  const F = makeField(data, onEdit);
  const t = I18N[lang];
  const isRtl = lang === 'he';

  const Label = ({ children }) => (
    <div style={{
      fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
      fontWeight: 700, color: accent, fontFamily: 'var(--cv-body)',
      marginBottom: 10, paddingBottom: 5,
      borderBottom: `1px solid ${accent}`,
    }}>{children}</div>
  );

  const Row = ({ label, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 18px', marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: '#999', letterSpacing: '0.15em', textTransform: 'uppercase', paddingTop: 2, fontFamily: 'var(--cv-body)' }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  );

  const renderMap = {
    personal: () => (
      <header key="personal" style={{ marginBottom: 30, paddingBottom: 22, borderBottom: '1px solid #E8E3DC' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {showPhoto && (
            <PhotoSlot value={data.personal?.photo} onChange={(v) => onEdit(['personal','photo'], v)} size={70} accent={accent}/>
          )}
          <div>
            <Editable as="h1" {...F(['personal','name'])}
              style={{ fontFamily: 'var(--cv-heading)', fontSize: 42, fontWeight: 300, margin: 0, letterSpacing: '-0.03em', lineHeight: 1, color: '#111' }}/>
            <Editable as="div" {...F(['personal','title'])}
              style={{ fontSize: 13, color: '#777', marginTop: 8, fontWeight: 400, letterSpacing: '0.02em' }}/>
            <div style={{ display: 'flex', gap: 20, fontSize: 10.5, color: '#555', marginTop: 14, flexWrap: 'wrap' }}>
              <Editable {...F(['personal','email'])}/>
              <span style={{ color: '#ccc' }}>·</span>
              <Editable {...F(['personal','phone'])}/>
              <span style={{ color: '#ccc' }}>·</span>
              <Editable {...F(['personal','location'])}/>
              {(data.personal?.links || []).map((l, i) => (
                <span key={i}>
                  <span style={{ color: '#ccc' }}>·</span>
                  {' '}
                  <Editable value={l.url} onChange={(v) => onEdit(['personal','links',i,'url'],v)} style={{ color: accent }}/>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>
    ),
    summary: () => (
      <div key="summary" style={{ marginBottom: 22 }}>
        <Label>{t.sections.summary}</Label>
        <Editable {...F(['summary'],{ multiline:true, placeholder:t.labels.summaryPlaceholder, ai:true })}
          as="p" style={{ margin:0, fontSize:12, lineHeight:1.75, color:'#333', maxWidth:'58ch' }}/>
      </div>
    ),
    experience: () => (
      <div key="experience" style={{ marginBottom: 22 }}>
        <Label>{t.sections.experience}</Label>
        {(data.experience||[]).map((j,i) => (
          <Row key={i} label={formatRange(j.start,j.end,lang)}>
            <div style={{ marginBottom: i < (data.experience||[]).length-1 ? 16 : 0 }}>
              <div style={{ display:'flex', gap:6, alignItems:'baseline', flexWrap:'wrap', marginBottom:3 }}>
                <Editable value={j.role} onChange={(v)=>onEdit(['experience',i,'role'],v)}
                  style={{ fontSize:13, fontWeight:600, color:'#111' }}/>
                <span style={{ color:'#bbb' }}>—</span>
                <Editable value={j.company} onChange={(v)=>onEdit(['experience',i,'company'],v)}
                  style={{ fontSize:12, color:accent, fontFamily:'var(--cv-heading)' }}/>
              </div>
              <EditableBullets bullets={j.bullets||['']} onChange={(v)=>onEdit(['experience',i,'bullets'],v)}
                accent={accent} lang={lang} placeholder={t.labels.bulletPlaceholder} bulletStyle="dash"/>
            </div>
          </Row>
        ))}
      </div>
    ),
    education: () => (
      <div key="education" style={{ marginBottom: 22 }}>
        <Label>{t.sections.education}</Label>
        {(data.education||[]).map((e,i) => (
          <Row key={i} label={formatRange(e.start,e.end,lang)}>
            <div>
              <Editable value={e.degree} onChange={(v)=>onEdit(['education',i,'degree'],v)} style={{ fontSize:13, fontWeight:600 }}/>
              <div style={{ marginTop:2 }}>
                <Editable value={e.school} onChange={(v)=>onEdit(['education',i,'school'],v)} style={{ fontSize:11.5, color:'#666' }}/>
              </div>
            </div>
          </Row>
        ))}
      </div>
    ),
    skills: () => (
      <div key="skills" style={{ marginBottom: 22 }}>
        <Label>{t.sections.skills}</Label>
        {(data.skills||[]).map((sk,i) => (
          <Row key={i} label={sk.category}>
            <Editable value={(sk.items||[]).join(', ')} onChange={(v)=>onEdit(['skills',i,'items'],v.split(/\s*,\s*/))}
              style={{ fontSize:11.5, color:'#333' }}/>
          </Row>
        ))}
      </div>
    ),
    languages: () => (
      <div key="languages" style={{ marginBottom: 22 }}>
        <Label>{t.sections.languages}</Label>
        <div style={{ display:'flex', gap:'6px 24px', flexWrap:'wrap', fontSize:11.5 }}>
          {(data.languages||[]).map((l,i) => (
            <div key={i}>
              <Editable value={l.name} onChange={(v)=>onEdit(['languages',i,'name'],v)} style={{ fontWeight:600 }}/>
              <span style={{ color:'#aaa', margin:'0 4px' }}>·</span>
              <Editable value={l.level} onChange={(v)=>onEdit(['languages',i,'level'],v)} style={{ color:'#777' }}/>
            </div>
          ))}
        </div>
      </div>
    ),
    projects: () => (
      <div key="projects" style={{ marginBottom: 22 }}>
        <Label>{t.sections.projects}</Label>
        {(data.projects||[]).map((p,i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
              <Editable value={p.name} onChange={(v)=>onEdit(['projects',i,'name'],v)} style={{ fontSize:13, fontWeight:600 }}/>
              {p.link && <Editable value={p.link} onChange={(v)=>onEdit(['projects',i,'link'],v)} style={{ fontSize:10.5, color:accent }}/>}
            </div>
            <Editable value={p.description} onChange={(v)=>onEdit(['projects',i,'description'],v)} multiline enableAi as="div"
              style={{ fontSize:11.5, color:'#444', marginTop:2, lineHeight:1.6 }}/>
          </div>
        ))}
      </div>
    ),
    certifications: () => (
      <div key="certifications" style={{ marginBottom: 22 }}>
        <Label>{t.sections.certifications}</Label>
        {(data.certifications||[]).map((c,i) => (
          <Row key={i} label={c.date}>
            <div>
              <Editable value={c.name} onChange={(v)=>onEdit(['certifications',i,'name'],v)} style={{ fontSize:12, fontWeight:500 }}/>
              <span style={{ color:'#aaa', margin:'0 6px', fontSize:11 }}>·</span>
              <Editable value={c.issuer} onChange={(v)=>onEdit(['certifications',i,'issuer'],v)} style={{ fontSize:11, color:'#777' }}/>
            </div>
          </Row>
        ))}
      </div>
    ),
    hobbies: () => (
      <div key="hobbies" style={{ marginBottom: 22 }}>
        <Label>{t.sections.hobbies}</Label>
        <Editable {...F(['hobbies'],{ multiline:true, ai:true })} as="div" style={{ fontSize:11.5, color:'#555', lineHeight:1.6 }}/>
      </div>
    ),
    awards: () => (
      <div key="awards" style={{ marginBottom: 20 }}>
        <Label>{t.sections.awards}</Label>
        {(data.awards||[]).map((a,i) => (
          <Row key={i} label={a.date}>
            <div>
              <Editable value={a.name} onChange={(v)=>onEdit(['awards',i,'name'],v)} style={{ fontSize:12, fontWeight:500 }}/>
              {a.issuer && <><span style={{ color:'#aaa', margin:'0 5px', fontSize:11 }}>·</span>
                <Editable value={a.issuer} onChange={(v)=>onEdit(['awards',i,'issuer'],v)} style={{ fontSize:11, color:'#777' }}/></>}
            </div>
          </Row>
        ))}
      </div>
    ),
    volunteering: () => (
      <div key="volunteering" style={{ marginBottom: 20 }}>
        <Label>{t.sections.volunteering}</Label>
        {(data.volunteering||[]).map((v,i) => (
          <Row key={i} label={formatRange(v.start,v.end,lang)}>
            <div style={{ marginBottom:6 }}>
              <Editable value={v.role} onChange={(vv)=>onEdit(['volunteering',i,'role'],vv)} style={{ fontSize:13, fontWeight:600 }}/>
              <span style={{ color:'#bbb', margin:'0 5px' }}>—</span>
              <Editable value={v.org} onChange={(vv)=>onEdit(['volunteering',i,'org'],vv)} style={{ fontSize:12, color:accent }}/>
              {v.description && <Editable value={v.description} onChange={(vv)=>onEdit(['volunteering',i,'description'],vv)} multiline
                as="div" style={{ fontSize:11, color:'#444', marginTop:3, lineHeight:1.55 }}/>}
            </div>
          </Row>
        ))}
      </div>
    ),
    publications: () => (
      <div key="publications" style={{ marginBottom: 20 }}>
        <Label>{t.sections.publications}</Label>
        {(data.publications||[]).map((p,i) => (
          <Row key={i} label={p.date}>
            <div style={{ fontSize:11.5 }}>
              <Editable value={p.title} onChange={(v)=>onEdit(['publications',i,'title'],v)} style={{ fontWeight:500 }}/>
              {p.venue && <><span style={{ color:'#aaa', margin:'0 5px' }}>·</span>
                <Editable value={p.venue} onChange={(v)=>onEdit(['publications',i,'venue'],v)} style={{ fontStyle:'italic', color:'#666' }}/></>}
            </div>
          </Row>
        ))}
      </div>
    ),
    links: () => null,
  };

  return (
    <div style={{ padding:'16mm 18mm 14mm', fontFamily:'var(--cv-body)', color:'#1A1A1A', direction:isRtl?'rtl':'ltr' }}>
      {visibleIds(sections).map(id => renderMap[id]?.()||(renderMap[id]===null?null:null))}
    </div>
  );
});

export default NordicTemplate;
