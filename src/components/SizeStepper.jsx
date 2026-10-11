import Icon from './Icon.jsx';
import { LIMITS, clampTo } from '../data.js';

const round2 = (v) => Math.round(v * 100) / 100;

// − 100% + : one section's text size. Tapping the number resets it.
export default function SizeStepper({ value, onChange, lang }) {
  const { min, max, step } = LIMITS.sectionScale;
  const he = lang === 'he';
  return (
    <span className="size-stepper" title={he ? 'גודל הטקסט במקטע' : 'Text size in this section'}>
      <button disabled={value <= min + 1e-6} onClick={() => onChange(round2(clampTo(value - step, LIMITS.sectionScale)))}
        aria-label={he ? 'הקטנת טקסט' : 'Smaller text'}>
        <Icon name="minus" size={12}/>
      </button>
      <button className="size-value" data-changed={value !== 1 || undefined} onClick={() => onChange(1)}
        aria-label={he ? 'איפוס ל-100%' : 'Reset to 100%'}>
        {Math.round(value * 100)}%
      </button>
      <button disabled={value >= max - 1e-6} onClick={() => onChange(round2(clampTo(value + step, LIMITS.sectionScale)))}
        aria-label={he ? 'הגדלת טקסט' : 'Larger text'}>
        <Icon name="plus" size={12}/>
      </button>
    </span>
  );
}

// The state change for one section's size: 1 means "no override".
export const withSectionScale = (state, id, v) => {
  const next = { ...(state.sectionScale || {}) };
  if (v === 1) delete next[id]; else next[id] = v;
  return { ...state, sectionScale: next };
};
