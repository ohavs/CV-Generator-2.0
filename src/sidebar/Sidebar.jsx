import { useState, useRef } from 'react';
import { I18N, DEFAULT_STATE } from '../data.js';
import Icon from '../components/Icon.jsx';
import DesignTab from './DesignTab.jsx';
import SectionsTab from './SectionsTab.jsx';
import ContentTab from './ContentTab.jsx';

function SaveBadge({ saving, t }) {
  return (
    <span className="save-badge">
      <span className={'dot ' + (saving ? 'saving' : '')}/>
      {saving ? t.labels.saving : t.labels.saved}
    </span>
  );
}

const startOnMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

export default function Sidebar({ state, setState, isMobileOpen, onCloseMobile, onExport, exporting, onAddJump, onUndo, onRedo, canUndo, canRedo, saving }) {
  const t = I18N[state.language];
  // On phones people open the sheet mostly to edit content; on desktop the
  // panel is always visible and design-first is the better entry point.
  const [tab, setTab] = useState(startOnMobile ? 'content' : 'design');

  // Swipe-down on the header closes the sheet (mobile).
  const asideRef = useRef(null);
  const dragRef = useRef(null);
  const onTouchStart = (e) => {
    dragRef.current = { y0: e.touches[0].clientY, dy: 0 };
  };
  const onTouchMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y0);
    if (asideRef.current) {
      asideRef.current.style.transform = `translateY(${d.dy}px)`;
      asideRef.current.style.transition = 'none';
    }
  };
  const onTouchEnd = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!asideRef.current) return;
    asideRef.current.style.transform = '';
    asideRef.current.style.transition = '';
    if (d && d.dy > 90) onCloseMobile();
  };

  return (
    <aside
      ref={asideRef}
      className="sidebar"
      data-open={isMobileOpen}
      dir={state.language === 'he' ? 'rtl' : 'ltr'}
    >
      <div
        className="sidebar-header"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="brand">
          <div className="brand-mark">{state.language === 'he' ? 'ק' : 'k'}</div>
          <div>
            <div className="brand-name">{t.appName}</div>
            <div className="brand-sub">{t.appSub}</div>
          </div>
        </div>
        <div className="row">
          <SaveBadge saving={saving} t={t}/>
          <button className="icon-btn" onClick={onCloseMobile} title="Close" style={{ display: 'var(--mobile-close-display, none)' }}>
            <Icon name="x" size={16}/>
          </button>
        </div>
      </div>

      <div className="sidebar-tabs">
        <button className="tab-btn" data-active={tab === 'content'} onClick={() => setTab('content')}>
          <Icon name="edit" size={13}/> {t.tabs.content}
        </button>
        <button className="tab-btn" data-active={tab === 'design'} onClick={() => setTab('design')}>
          <Icon name="palette" size={13}/> {t.tabs.design}
        </button>
        <button className="tab-btn" data-active={tab === 'sections'} onClick={() => setTab('sections')}>
          <Icon name="layers" size={13}/> {t.tabs.sections}
        </button>
      </div>

      <div className="sidebar-body">
        {tab === 'design' && <DesignTab state={state} setState={setState} t={t}/>}
        {tab === 'sections' && <SectionsTab state={state} setState={setState} t={t}/>}
        {tab === 'content' && <ContentTab state={state} setState={setState} t={t} onAddJump={onAddJump}/>}
      </div>

      <div className="sidebar-footer">
        <button className="icon-btn" onClick={onUndo} disabled={!canUndo}
          title={state.language === 'he' ? 'בטל' : 'Undo'}>
          <Icon name="undo" size={15}/>
        </button>
        <button className="icon-btn" onClick={onRedo} disabled={!canRedo}
          title={state.language === 'he' ? 'בצע שוב' : 'Redo'}>
          <Icon name="redo" size={15}/>
        </button>
        <button className="btn btn-ghost" onClick={() => {
          if (confirm(state.language === 'he' ? 'לאפס לדמו ברירת מחדל?' : 'Reset to demo data?')) {
            setState({ ...DEFAULT_STATE });
          }
        }}>
          <Icon name="trash" size={13}/>
          {state.language === 'he' ? 'איפוס' : 'Reset'}
        </button>
        <button className="btn btn-primary" onClick={onExport} disabled={exporting}>
          <Icon name={exporting ? 'loader' : 'download'} size={13} style={exporting ? { animation: 'spin 0.8s linear infinite' } : undefined}/>
          {exporting ? (state.language === 'he' ? 'מייצא…' : 'Exporting…') : t.labels.export}
        </button>
      </div>
    </aside>
  );
}
