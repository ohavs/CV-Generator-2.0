import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { I18N } from '../data.js';
import Icon from './Icon.jsx';

/* ---------------------------------------------------------------------------
   A full-screen, form-based editor for the entire CV. Every section, entry and
   field is a plain native input/textarea — comfortable to type in on a phone,
   unlike caret-editing a scaled-down A4 page. All edits flow through the same
   editField(path, value) pipeline as the rest of the app (history + autosave),
   committing on blur so each field is one clean undo step.
--------------------------------------------------------------------------- */

// field labels
const FL = {
  role:{he:'תפקיד',en:'Role'}, company:{he:'חברה',en:'Company'}, location:{he:'מיקום',en:'Location'},
  start:{he:'התחלה',en:'Start'}, end:{he:'סיום',en:'End'}, bullets:{he:'תיאור והישגים',en:'Highlights'},
  degree:{he:'תואר',en:'Degree'}, school:{he:'מוסד לימודים',en:'School'}, description:{he:'תיאור',en:'Description'},
  category:{he:'קטגוריה',en:'Category'}, items:{he:'פריטים',en:'Items'},
  name:{he:'שם',en:'Name'}, level:{he:'רמה',en:'Level'}, dots:{he:'שליטה',en:'Proficiency'},
  issuer:{he:'גוף מנפיק',en:'Issuer'}, date:{he:'תאריך',en:'Date'}, tech:{he:'טכנולוגיות',en:'Tech'},
  link:{he:'קישור',en:'Link'}, org:{he:'ארגון',en:'Organization'}, title:{he:'כותרת',en:'Title'},
  venue:{he:'פורסם ב־',en:'Published in'},
  ptitle:{he:'תפקיד / כותרת',en:'Title'}, email:{he:'אימייל',en:'Email'}, phone:{he:'טלפון',en:'Phone'},
  fullname:{he:'שם מלא',en:'Full name'},
  label:{he:'תווית',en:'Label'}, url:{he:'כתובת',en:'URL'},
};
const lbl = (k, lang) => (FL[k]?.[lang]) || k;
const dateHint = (lang) => (lang === 'he' ? 'שנה-חודש · לדוגמה 2023-03' : 'YYYY-MM');

// Per-section schema. kind: 'personal' | 'text' | 'list'.
const SCHEMA = {
  personal: { kind: 'personal' },
  summary:  { kind: 'text' },
  hobbies:  { kind: 'text' },
  experience: { kind: 'list',
    fields: [{k:'role'},{k:'company'},{k:'location'},{k:'start',date:true},{k:'end',date:true},{k:'bullets',lines:true}],
    blank: { role:'', company:'', location:'', start:'', end:'', bullets:[''] } },
  education: { kind: 'list',
    fields: [{k:'degree'},{k:'school'},{k:'location'},{k:'start',date:true},{k:'end',date:true},{k:'description',area:true}],
    blank: { school:'', degree:'', location:'', start:'', end:'', description:'' } },
  projects: { kind: 'list',
    fields: [{k:'name'},{k:'description',area:true},{k:'tech'},{k:'link'}],
    blank: { name:'', description:'', tech:'', link:'' } },
  skills: { kind: 'list',
    fields: [{k:'category'},{k:'items',lines:true}],
    blank: { category:'', items:[''] } },
  languages: { kind: 'list',
    fields: [{k:'name'},{k:'level'},{k:'dots',dots:true}],
    blank: { name:'', level:'', dots:3 } },
  certifications: { kind: 'list',
    fields: [{k:'name'},{k:'issuer'},{k:'date'}],
    blank: { name:'', issuer:'', date:'' } },
  awards: { kind: 'list',
    fields: [{k:'name'},{k:'issuer'},{k:'date'},{k:'description',area:true}],
    blank: { name:'', issuer:'', date:'', description:'' } },
  volunteering: { kind: 'list',
    fields: [{k:'role'},{k:'org'},{k:'start',date:true},{k:'end',date:true},{k:'description',area:true}],
    blank: { role:'', org:'', start:'', end:'', description:'' } },
  publications: { kind: 'list',
    fields: [{k:'title'},{k:'venue'},{k:'date'},{k:'description',area:true}],
    blank: { title:'', venue:'', date:'', description:'' } },
};

// A single native field with commit-on-blur (one undo step per edit).
function Field({ label, hint, value, area, placeholder, onCommit, autoFocus }) {
  const [v, setV] = useState(value ?? '');
  const focused = useRef(false);
  const ref = useRef(null);
  useEffect(() => { if (!focused.current) setV(value ?? ''); }, [value]);

  const grow = () => {
    const el = ref.current;
    if (area && el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  };
  useLayoutEffect(grow, [v, area]);

  const commit = () => { focused.current = false; if (v !== (value ?? '')) onCommit(v); };
  const common = {
    ref, className: 'fe-input', value: v, autoFocus, placeholder,
    onFocus: () => { focused.current = true; },
    onChange: (e) => setV(e.target.value),
    onBlur: commit,
  };
  return (
    <label className="fe-field">
      {label && <span className="fe-label">{label}{hint && <em>{hint}</em>}</span>}
      {area
        ? <textarea {...common} rows={3} onInput={grow}/>
        : <input {...common} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}/>}
    </label>
  );
}

// A list of plain strings (bullets / skill items) with add + remove.
function Lines({ label, values, onChange, lang }) {
  const [focusIdx, setFocusIdx] = useState(-1);
  const list = values && values.length ? values : [''];
  const set = (i, val) => onChange(list.map((s, j) => j === i ? val : s));
  const remove = (i) => onChange(list.length <= 1 ? [''] : list.filter((_, j) => j !== i));
  const add = () => { setFocusIdx(list.length); onChange([...list, '']); };
  return (
    <div className="fe-field">
      <span className="fe-label">{label}</span>
      <div className="fe-lines">
        {list.map((s, i) => (
          <div className="fe-line" key={i}>
            <LineInput value={s} autoFocus={i === focusIdx} onCommit={(val) => set(i, val)}/>
            <button className="fe-line-x" onClick={() => remove(i)} title={lang === 'he' ? 'מחיקה' : 'Remove'} tabIndex={-1}>
              <Icon name="x" size={13}/>
            </button>
          </div>
        ))}
      </div>
      <button className="fe-addline" onClick={add}>
        <Icon name="plus" size={13}/> {lang === 'he' ? 'הוספת שורה' : 'Add line'}
      </button>
    </div>
  );
}

function LineInput({ value, onCommit, autoFocus }) {
  const [v, setV] = useState(value ?? '');
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setV(value ?? ''); }, [value]);
  return (
    <input
      className="fe-input" value={v} autoFocus={autoFocus}
      onFocus={() => { focused.current = true; }}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { focused.current = false; if (v !== (value ?? '')) onCommit(v); }}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
    />
  );
}

function Dots({ label, value, onChange }) {
  const n = value ?? 3;
  return (
    <div className="fe-field">
      <span className="fe-label">{label}</span>
      <div className="fe-dots">
        {[1,2,3,4,5].map(d => (
          <button key={d} className="fe-dot" data-on={d <= n} onClick={() => onChange(d)} title={String(d)}/>
        ))}
      </div>
    </div>
  );
}

export default function FullEditor({ open, state, editField, toggleSection, onClose }) {
  const lang = state.language;
  const t = I18N[lang];
  const data = state.data[lang];
  const isRtl = lang === 'he';
  const scrollRef = useRef(null);
  const scrollTop = useRef(0);

  // Preserve scroll position across preview⇄editor toggles ("back to exactly
  // the same place"). We remember it while closing and restore on reopen.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (open) el.scrollTop = scrollTop.current;
  }, [open]);

  // Lock body scroll while the editor is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const rememberScroll = () => { if (scrollRef.current) scrollTop.current = scrollRef.current.scrollTop; };
  const close = () => { rememberScroll(); onClose(); };

  const setArr = (key, next) => editField([key], next);

  const renderList = (key) => {
    const sc = SCHEMA[key];
    const arr = data[key] || [];
    const addEntry = () => setArr(key, [...arr, { ...sc.blank }]);
    return (
      <>
        {arr.map((entry, i) => (
          <div className="fe-entry" key={i}>
            <div className="fe-entry-head">
              <span className="fe-entry-n">{i + 1}</span>
              <button className="fe-entry-x" onClick={() => setArr(key, arr.filter((_, j) => j !== i))}>
                <Icon name="trash" size={13}/> {lang === 'he' ? 'מחיקת פריט' : 'Remove'}
              </button>
            </div>
            <div className="fe-grid">
              {sc.fields.map((f) => {
                if (f.lines) return <Lines key={f.k} label={lbl(f.k, lang)} values={entry[f.k] || ['']} lang={lang}
                  onChange={(next) => editField([key, i, f.k], next)}/>;
                if (f.dots) return <Dots key={f.k} label={lbl(f.k, lang)} value={entry[f.k]}
                  onChange={(d) => editField([key, i, f.k], d)}/>;
                return <Field key={f.k} label={lbl(f.k, lang)} hint={f.date ? dateHint(lang) : undefined}
                  area={f.area} value={entry[f.k] ?? ''} onCommit={(v) => editField([key, i, f.k], v)}/>;
              })}
            </div>
          </div>
        ))}
        <button className="fe-addentry" onClick={addEntry}>
          <Icon name="plus" size={14}/> {lang === 'he' ? 'הוספת פריט' : 'Add item'}
        </button>
      </>
    );
  };

  const renderPersonal = () => {
    const p = data.personal || {};
    const links = p.links || [];
    return (
      <div className="fe-grid">
        <Field label={lbl('fullname', lang)} value={p.name} onCommit={(v) => editField(['personal','name'], v)}/>
        <Field label={lbl('ptitle', lang)} value={p.title} onCommit={(v) => editField(['personal','title'], v)}/>
        <Field label={lbl('email', lang)} value={p.email} onCommit={(v) => editField(['personal','email'], v)}/>
        <Field label={lbl('phone', lang)} value={p.phone} onCommit={(v) => editField(['personal','phone'], v)}/>
        <Field label={lbl('location', lang)} value={p.location} onCommit={(v) => editField(['personal','location'], v)}/>
        <div className="fe-field">
          <span className="fe-label">{t.sections.links}</span>
          {links.map((l, i) => (
            <div className="fe-linkrow" key={i}>
              <input className="fe-input" defaultValue={l.label} placeholder={lbl('label', lang)}
                onBlur={(e) => { if (e.target.value !== l.label) editField(['personal','links', i, 'label'], e.target.value); }}/>
              <input className="fe-input" defaultValue={l.url} placeholder={lbl('url', lang)}
                onBlur={(e) => { if (e.target.value !== l.url) editField(['personal','links', i, 'url'], e.target.value); }}/>
              <button className="fe-line-x" tabIndex={-1}
                onClick={() => editField(['personal','links'], links.filter((_, j) => j !== i))}>
                <Icon name="x" size={13}/>
              </button>
            </div>
          ))}
          <button className="fe-addline" onClick={() => editField(['personal','links'], [...links, { label: 'Link', url: '', icon: 'globe' }])}>
            <Icon name="plus" size={13}/> {lang === 'he' ? 'הוספת קישור' : 'Add link'}
          </button>
        </div>
      </div>
    );
  };

  const renderText = (key) => {
    const ph = key === 'summary' ? t.labels.summaryPlaceholder
      : (lang === 'he' ? 'טקסט חופשי, מופרד בנקודה ·' : 'Free text, separated by ·');
    return <Field area label="" placeholder={ph} value={data[key] ?? ''} onCommit={(v) => editField([key], v)}/>;
  };

  return (
    <div className="full-editor" data-open={open} dir={isRtl ? 'rtl' : 'ltr'} aria-hidden={!open}>
      <div className="fe-head">
        <div className="fe-title">{lang === 'he' ? 'עריכת קורות חיים' : 'Edit CV'}</div>
        <button className="fe-preview-btn" onClick={close}>
          <Icon name="eye" size={15}/> {lang === 'he' ? 'תצוגה מקדימה' : 'Preview'}
        </button>
      </div>

      <div className="fe-scroll" ref={scrollRef}
        onScroll={(e) => { scrollTop.current = e.currentTarget.scrollTop; }}>
        {state.sections.map((sec) => {
          const sc = SCHEMA[sec.id];
          if (!sc) return null;
          return (
            <section className="fe-section" key={sec.id} data-hidden={!sec.visible}>
              <div className="fe-section-head">
                <h2>{t.sections[sec.id]}</h2>
                <button className="fe-eye" onClick={() => toggleSection(sec.id)}
                  title={sec.visible ? (lang === 'he' ? 'מוצג — הקש להסתרה' : 'Shown — tap to hide')
                                     : (lang === 'he' ? 'מוסתר — הקש להצגה' : 'Hidden — tap to show')}>
                  <Icon name={sec.visible ? 'eye' : 'eye-off'} size={15}/>
                </button>
              </div>
              {sc.kind === 'personal' && renderPersonal()}
              {sc.kind === 'text' && renderText(sec.id)}
              {sc.kind === 'list' && renderList(sec.id)}
            </section>
          );
        })}
        <div className="fe-foot">
          <button className="fe-preview-btn wide" onClick={close}>
            <Icon name="eye" size={15}/> {lang === 'he' ? 'חזרה לתצוגה' : 'Back to preview'}
          </button>
        </div>
      </div>
    </div>
  );
}
