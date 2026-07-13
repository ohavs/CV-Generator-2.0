import { memo, useState, startTransition } from 'react';
import { TEMPLATES, ACCENT_PALETTE, FONT_PRESETS, I18N } from '../data.js';
import { TemplateThumb } from '../templates/index.jsx';
import Icon from '../components/Icon.jsx';
import FontDropdown from '../components/FontDropdown.jsx';

const SCALE_MIN = 0.86;
const SCALE_MAX = 1.06;
const INITIAL_TEMPLATES = 6;

function DesignTab({ state, setState, t }) {
  const lang = state.language;
  const scalePercent = Math.round((state.fontScale ?? 1) * 100);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const displayTemplates = showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, INITIAL_TEMPLATES);

  return (
    <>
      {/* Templates */}
      <div className="panel-group">
        <h3 className="panel-title">
          {t.labels.template}
          <button
            onClick={() => setShowAllTemplates(v => !v)}
            style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: 0 }}
          >
            {showAllTemplates
              ? (lang === 'he' ? 'הצג פחות' : 'Show less')
              : (lang === 'he' ? `הצג עוד (${TEMPLATES.length - INITIAL_TEMPLATES}+)` : `Show more (+${TEMPLATES.length - INITIAL_TEMPLATES})`)}
          </button>
        </h3>
        <div className="template-grid">
          {displayTemplates.map(tpl => (
            <button
              key={tpl.id}
              className="template-tile"
              data-active={state.template === tpl.id}
              onClick={() => startTransition(() => setState({ ...state, template: tpl.id }))}
              title={tpl.name[lang]}
            >
              <TemplateThumb id={tpl.id} accent={state.accent}/>
              <span className="template-tile-name">{tpl.name[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.accent}</h3>
        <div className="panel-card">
          <div className="swatch-row">
            {ACCENT_PALETTE.map(c => (
              <button
                key={c}
                className="swatch"
                data-active={state.accent === c}
                style={{ background: c }}
                onClick={() => startTransition(() => setState({ ...state, accent: c }))}
              />
            ))}
            <label className="swatch" style={{ background: 'conic-gradient(red, yellow, green, blue, red)', position: 'relative', cursor: 'pointer' }}>
              <input
                type="color"
                value={state.accent}
                onChange={(e) => startTransition(() => setState({ ...state, accent: e.target.value }))}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.font}</h3>
        <FontDropdown
          value={state.fontPreset}
          onChange={(id) => startTransition(() => setState({ ...state, fontPreset: id }))}
          presets={FONT_PRESETS}
          lang={lang}
        />
      </div>

      {/* Font scale */}
      <div className="panel-group">
        <h3 className="panel-title">{lang === 'he' ? 'גודל טקסט' : 'Text size'}</h3>
        <div className="panel-card">
          <div className="font-scale-row">
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>A</span>
            <input
              type="range"
              min={SCALE_MIN}
              max={SCALE_MAX}
              step={0.02}
              value={state.fontScale ?? 1}
              onChange={(e) => setState({ ...state, fontScale: parseFloat(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 16, color: 'var(--ink-4)' }}>A</span>
            <span className="font-scale-label">{scalePercent}%</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 6 }}>
            {lang === 'he'
              ? 'שים לב: גודל גדול מדי עלול לגרום לתוכן לחרוג מהדף'
              : 'Note: large sizes may cause content to overflow the page'}
          </div>
        </div>
      </div>

      {/* Language + Dark mode */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.language}</h3>
        <div className="panel-card">
          <div className="field-row">
            <label>{t.labels.direction}</label>
            <div className="seg">
              <button data-active={state.language === 'he'} onClick={() => setState({ ...state, language: 'he' })}>עברית</button>
              <button data-active={state.language === 'en'} onClick={() => setState({ ...state, language: 'en' })}>English</button>
            </div>
          </div>
          <div className="field-row">
            <label>{t.labels.darkMode}</label>
            <span className="seg" style={{ padding: 3 }}>
              <button
                data-active={!state.darkEdit}
                onClick={() => setState({ ...state, darkEdit: false })}
                style={{ padding: '6px 12px', borderRadius: 7, background: !state.darkEdit ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: !state.darkEdit ? 'var(--shadow-sm)' : 'none' }}
              >
                <Icon name="sun" size={14}/>
              </button>
              <button
                data-active={state.darkEdit}
                onClick={() => setState({ ...state, darkEdit: true })}
                style={{ padding: '6px 12px', borderRadius: 7, background: state.darkEdit ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: state.darkEdit ? 'var(--shadow-sm)' : 'none' }}
              >
                <Icon name="moon" size={14}/>
              </button>
            </span>
          </div>
          <div className="field-row">
            <label>{lang === 'he' ? 'תמונת פרופיל' : 'Profile photo'}</label>
            <span className="seg" style={{ padding: 3 }}>
              <button
                data-active={state.showPhoto !== false}
                onClick={() => setState({ ...state, showPhoto: true })}
                style={{ padding: '6px 12px', borderRadius: 7, background: state.showPhoto !== false ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: state.showPhoto !== false ? 'var(--shadow-sm)' : 'none' }}
              >
                <Icon name="eye" size={14}/>
              </button>
              <button
                data-active={state.showPhoto === false}
                onClick={() => setState({ ...state, showPhoto: false })}
                style={{ padding: '6px 12px', borderRadius: 7, background: state.showPhoto === false ? 'var(--surface)' : 'transparent', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: state.showPhoto === false ? 'var(--shadow-sm)' : 'none' }}
              >
                <Icon name="eye-off" size={14}/>
              </button>
            </span>
          </div>
        </div>
      </div>

    </>
  );
}

// Only re-render DesignTab when design-related state changes — never when CV data changes
export default memo(DesignTab, (prev, next) =>
  prev.state.template   === next.state.template  &&
  prev.state.accent     === next.state.accent     &&
  prev.state.fontPreset === next.state.fontPreset &&
  prev.state.fontScale  === next.state.fontScale  &&
  prev.state.darkEdit   === next.state.darkEdit   &&
  prev.state.language   === next.state.language   &&
  prev.state.sections   === next.state.sections   &&
  prev.setState === next.setState &&
  prev.t        === next.t
);
