import { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon.jsx';

const T = {
  he: { myCvs: 'קורות החיים שלי', neww: 'קורות חיים חדשים', rename: 'שינוי שם',
        duplicate: 'שכפול', del: 'מחיקה', confirmDel: 'למחוק את קורות החיים האלה?', edited: 'עודכן' },
  en: { myCvs: 'My CVs', neww: 'New CV', rename: 'Rename',
        duplicate: 'Duplicate', del: 'Delete', confirmDel: 'Delete this CV?', edited: 'Edited' },
};

function relTime(ts, lang) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US',
      { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

export default function DocsMenu({ docs, activeId, lang, onSwitch, onNew, onRename, onDuplicate, onDelete }) {
  const t = T[lang] || T.he;
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(null); // id being renamed
  const [draft, setDraft] = useState('');
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const active = docs.find(d => d.id === activeId) || docs[0];

  // Close the popover on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) { setOpen(false); setRenaming(null); } };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setRenaming(null); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => { if (renaming) inputRef.current?.focus(); }, [renaming]);

  const startRename = (doc) => { setRenaming(doc.id); setDraft(doc.name); };
  const commitRename = () => {
    if (renaming) onRename(renaming, draft);
    setRenaming(null);
  };

  return (
    <div className="docs-menu" ref={rootRef}>
      <button className="docs-trigger" onClick={() => setOpen(o => !o)} title={t.myCvs}>
        <Icon name="layers" size={14}/>
        <span className="docs-current">{active?.name || t.myCvs}</span>
        {docs.length > 1 && <span className="docs-count">{docs.length}</span>}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13}/>
      </button>

      {open && (
        <div className="docs-panel">
          <div className="docs-panel-title">{t.myCvs}</div>
          <div className="docs-list">
            {docs.map(doc => (
              <div key={doc.id} className="docs-row" data-active={doc.id === activeId}>
                {renaming === doc.id ? (
                  <input
                    ref={inputRef}
                    className="docs-rename-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
                      if (e.key === 'Escape') { e.preventDefault(); setRenaming(null); }
                    }}
                  />
                ) : (
                  <button className="docs-row-main" onClick={() => { onSwitch(doc.id); setOpen(false); }}>
                    <span className="docs-row-name">{doc.name}</span>
                    <span className="docs-row-meta">{t.edited} {relTime(doc.updatedAt, lang)}</span>
                  </button>
                )}
                <div className="docs-row-actions">
                  <button title={t.rename} onClick={() => startRename(doc)}><Icon name="edit" size={13}/></button>
                  <button title={t.duplicate} onClick={() => { onDuplicate(doc.id); setOpen(false); }}><Icon name="layers" size={13}/></button>
                  <button title={t.del} className="docs-del" onClick={() => {
                    if (confirm(t.confirmDel + '\n\n' + doc.name)) onDelete(doc.id);
                  }}><Icon name="trash" size={13}/></button>
                </div>
              </div>
            ))}
          </div>
          <button className="docs-new" onClick={() => { onNew(); setOpen(false); }}>
            <Icon name="plus" size={14}/> {t.neww}
          </button>
        </div>
      )}
    </div>
  );
}
