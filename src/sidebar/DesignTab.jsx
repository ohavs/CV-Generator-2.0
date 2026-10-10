import { memo, useState, startTransition } from 'react';
import { TEMPLATES, ACCENT_PALETTE, FONT_PRESETS, LIMITS, BULLET_STYLES, PHOTO_SHAPES, resolveFonts } from '../data.js';
import { TemplateThumb } from '../templates/index.jsx';
import Icon from '../components/Icon.jsx';
import FitNote from './FitNote.jsx';
import FontDropdown from '../components/FontDropdown.jsx';

const INITIAL_TEMPLATES = 6;

const BULLET_GLYPH = { auto: null, dot: '•', dash: '—', arrow: '›', square: '▪', none: '∅' };
const PHOTO_LABEL = {
  he: { auto: 'לפי התבנית', round: 'עגולה', square: 'מרובעת' },
  en: { auto: 'Template', round: 'Round', square: 'Square' },
};

// A labelled range slider with its value shown as a percentage. The value
// resets to 100% on a tap.
function Slider({ value, limits, onChange, small = 'A', big = 'A' }) {
  return (
    <div className="font-scale-row">
      <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{small}</span>
      <input
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1 }}
      />
      <span style={{ fontSize: 16, color: 'var(--ink-4)' }}>{big}</span>
      <button className="font-scale-label" onClick={() => onChange(1)} title="100%">
        {Math.round(value * 100)}%
      </button>
    </div>
  );
}

function SegToggle({ items, value, onChange }) {
  return (
    <span className="seg seg-wrap">
      {items.map(([id, label, title]) => (
        <button key={id} data-active={value === id} onClick={() => onChange(id)} title={title}>{label}</button>
      ))}
    </span>
  );
}

function DesignTab({ state, setState, t, fitScale = 1 }) {
  const lang = state.language;
  const he = lang === 'he';
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const displayTemplates = showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, INITIAL_TEMPLATES);
  // Updater form: this panel can hold a stale `state` (see the memo below).
  const update = (patch) => setState(s => ({ ...s, ...patch }));
  const set = (patch) => startTransition(() => update(patch));
  const preset = FONT_PRESETS.find(f => f.id === state.fontPreset) || FONT_PRESETS[0];
  const fonts = resolveFonts(state);

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
              ? (he ? 'הצג פחות' : 'Show less')
              : (he ? `הצג עוד (${TEMPLATES.length - INITIAL_TEMPLATES}+)` : `Show more (+${TEMPLATES.length - INITIAL_TEMPLATES})`)}
          </button>
        </h3>
        <div className="template-grid">
          {displayTemplates.map(tpl => (
            <button
              key={tpl.id}
              className="template-tile"
              data-active={state.template === tpl.id}
              onClick={() => set({ template: tpl.id })}
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
                onClick={() => set({ accent: c })}
              />
            ))}
            <label className="swatch" style={{ background: 'conic-gradient(red, yellow, green, blue, red)', position: 'relative', cursor: 'pointer' }}>
              <input
                type="color"
                value={state.accent}
                onChange={(e) => set({ accent: e.target.value })}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Typography: a ready pairing, or heading and body picked separately */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.font}</h3>
        <FontDropdown
          value={state.fontPreset}
          onChange={(id) => set({ fontPreset: id, headingFont: '', bodyFont: '' })}
          presets={FONT_PRESETS}
          lang={lang}
        />
        <div className="font-split">
          <div>
            <div className="font-split-label">{he ? 'כותרות' : 'Headings'}</div>
            <FontDropdown
              single
              value={state.headingFont || ''}
              onChange={(id) => set({ headingFont: id })}
              presets={FONT_PRESETS}
              lang={lang}
              defaultLabel={he ? 'לפי הזוג' : 'From pairing'}
              fallbackStack={preset.heading}
              sub={he ? 'שם, כותרות' : 'Name, headings'}
            />
          </div>
          <div>
            <div className="font-split-label">{he ? 'גוף הטקסט' : 'Body text'}</div>
            <FontDropdown
              single
              value={state.bodyFont || ''}
              onChange={(id) => set({ bodyFont: id })}
              presets={FONT_PRESETS}
              lang={lang}
              defaultLabel={he ? 'לפי הזוג' : 'From pairing'}
              fallbackStack={preset.body}
              sub={he ? 'תיאורים, פרטים' : 'Descriptions, details'}
            />
          </div>
        </div>
        <div className="panel-hint" style={{ fontFamily: fonts.body }}>
          {he ? 'בחירה של זוג מוכן מאפסת את הבחירה הנפרדת.' : 'Picking a pairing resets the separate choices.'}
        </div>
      </div>

      {/* Text size and spacing */}
      <div className="panel-group">
        <h3 className="panel-title">{he ? 'גודל טקסט' : 'Text size'}</h3>
        <div className="panel-card">
          <Slider
            value={state.fontScale ?? 1}
            limits={LIMITS.textScale}
            onChange={(v) => update({ fontScale: v })}
          />
          <div className="panel-hint">
            {he
              ? 'כל המסמך. לגודל של מקטע אחד — בלשונית "מקטעים".'
              : 'The whole CV. For one section, use the Sections tab.'}
          </div>
          {fitScale < 0.995 && (
            <FitNote fitScale={fitScale} he={he}/>
          )}
        </div>
      </div>

      <div className="panel-group">
        <h3 className="panel-title">{he ? 'ריווח בין מקטעים' : 'Space between sections'}</h3>
        <div className="panel-card">
          <Slider
            value={state.sectionSpacing ?? 1}
            limits={LIMITS.spacing}
            onChange={(v) => update({ sectionSpacing: v })}
            small="≡" big="☰"
          />
        </div>
      </div>

      {/* Details */}
      <div className="panel-group">
        <h3 className="panel-title">{he ? 'פרטים' : 'Details'}</h3>
        <div className="panel-card">
          <div className="field-row">
            <label>{he ? 'תבליטים' : 'Bullets'}</label>
            <SegToggle
              value={state.bulletStyle || 'auto'}
              onChange={(id) => set({ bulletStyle: id })}
              items={BULLET_STYLES.map(id => [id, BULLET_GLYPH[id] ?? (he ? 'אוטו׳' : 'Auto'),
                id === 'auto' ? (he ? 'לפי התבנית' : 'Template default') : id === 'none' ? (he ? 'ללא' : 'None') : id])}
            />
          </div>
          <div className="field-row">
            <label>{he ? 'תמונת פרופיל' : 'Profile photo'}</label>
            <span className="seg" style={{ padding: 3 }}>
              <button data-active={state.showPhoto !== false} onClick={() => set({ showPhoto: true })} title={he ? 'הצג' : 'Show'}>
                <Icon name="eye" size={14}/>
              </button>
              <button data-active={state.showPhoto === false} onClick={() => set({ showPhoto: false })} title={he ? 'הסתר' : 'Hide'}>
                <Icon name="eye-off" size={14}/>
              </button>
            </span>
          </div>
          {state.showPhoto !== false && (
            <div className="field-row">
              <label>{he ? 'צורת התמונה' : 'Photo shape'}</label>
              <SegToggle
                value={state.photoShape || 'auto'}
                onChange={(id) => set({ photoShape: id })}
                items={PHOTO_SHAPES.map(id => [id, PHOTO_LABEL[lang][id]])}
              />
            </div>
          )}
        </div>
      </div>

      {/* Language + Dark mode */}
      <div className="panel-group">
        <h3 className="panel-title">{t.labels.language}</h3>
        <div className="panel-card">
          <div className="field-row">
            <label>{t.labels.direction}</label>
            <div className="seg">
              <button data-active={state.language === 'he'} onClick={() => update({ language: 'he' })}>עברית</button>
              <button data-active={state.language === 'en'} onClick={() => update({ language: 'en' })}>English</button>
            </div>
          </div>
          <div className="field-row">
            <label>{t.labels.darkMode}</label>
            <span className="seg" style={{ padding: 3 }}>
              <button data-active={!state.darkEdit} onClick={() => update({ darkEdit: false })}>
                <Icon name="sun" size={14}/>
              </button>
              <button data-active={state.darkEdit} onClick={() => update({ darkEdit: true })}>
                <Icon name="moon" size={14}/>
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Only re-render DesignTab when design-related state changes — never when CV data changes
const DESIGN_KEYS = ['template', 'accent', 'fontPreset', 'headingFont', 'bodyFont', 'fontScale', 'sectionSpacing',
  'bulletStyle', 'photoShape', 'showPhoto', 'darkEdit', 'language', 'sections'];
export default memo(DesignTab, (prev, next) =>
  DESIGN_KEYS.every(k => prev.state[k] === next.state[k]) &&
  prev.fitScale === next.fitScale &&
  prev.setState === next.setState &&
  prev.t === next.t
);
