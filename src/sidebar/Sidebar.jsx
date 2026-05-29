import { useState } from 'react';
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

export default function Sidebar({ state, setState, isMobileOpen, onCloseMobile, onExport, saving }) {
  const t = I18N[state.language];
  const [tab, setTab] = useState('design');

  return (
    <aside className="sidebar" data-open={isMobileOpen} dir={state.language === 'he' ? 'rtl' : 'ltr'}>
      <div className="sidebar-header">
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
        <button className="tab-btn" data-active={tab === 'design'} onClick={() => setTab('design')}>
          <Icon name="palette" size={13}/> {t.tabs.design}
        </button>
        <button className="tab-btn" data-active={tab === 'sections'} onClick={() => setTab('sections')}>
          <Icon name="layers" size={13}/> {t.tabs.sections}
        </button>
        <button className="tab-btn" data-active={tab === 'content'} onClick={() => setTab('content')}>
          <Icon name="edit" size={13}/> {t.tabs.content}
        </button>
      </div>

      <div className="sidebar-body">
        {tab === 'design' && <DesignTab state={state} setState={setState} t={t}/>}
        {tab === 'sections' && <SectionsTab state={state} setState={setState} t={t}/>}
        {tab === 'content' && <ContentTab state={state} setState={setState} t={t}/>}
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-ghost" onClick={() => {
          if (confirm(state.language === 'he' ? 'לאפס לדמו ברירת מחדל?' : 'Reset to demo data?')) {
            setState({ ...DEFAULT_STATE });
          }
        }}>
          <Icon name="trash" size={13}/>
          {state.language === 'he' ? 'איפוס' : 'Reset'}
        </button>
        <button className="btn btn-primary" onClick={onExport}>
          <Icon name="download" size={13}/>
          {t.labels.export}
        </button>
      </div>
    </aside>
  );
}
