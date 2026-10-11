// Design settings the layout checker combines with each content variant.
// Every control a user can move should appear here at its extremes: if a
// template survives these, it survives anything the UI lets them pick.
import { LIMITS, DEFAULT_SECTIONS } from '../src/data.js';

const ids = DEFAULT_SECTIONS.map(s => s.id);
const every = (v) => Object.fromEntries(ids.map(id => [id, v]));
const alternate = () => Object.fromEntries(ids.map((id, i) => [id, i % 2 ? LIMITS.sectionScale.max : LIMITS.sectionScale.min]));

// Titles at the length limit, with one long unbreakable word in the middle.
const LONG_TITLE = {
  he: 'כותרת מותאמת אישית ארוכה במיוחד ללא הפסקה',
  en: 'A custom section title Supercalifragilistic',
};
const longTitles = (s) => {
  const lang = s.language;
  const titles = Object.fromEntries(ids.map(id => [id, LONG_TITLE[lang].slice(0, LIMITS.titleLength)]));
  return { ...s.data, [lang]: { ...s.data[lang], sectionTitles: titles } };
};

export const SETTINGS = {
  default: (s) => s,
  'wide-font': (s) => ({ ...s, fontPreset: 'bamberger' }),
  'mono-font': (s) => ({ ...s, fontPreset: 'mono' }),
  'max-text': (s) => ({
    ...s,
    fontScale: LIMITS.textScale.max,
    sectionScale: every(LIMITS.sectionScale.max),
    sectionSpacing: LIMITS.spacing.max,
  }),
  'min-text': (s) => ({
    ...s,
    fontScale: LIMITS.textScale.min,
    sectionScale: every(LIMITS.sectionScale.min),
    sectionSpacing: LIMITS.spacing.min,
  }),
  mixed: (s) => ({
    ...s,
    sectionScale: alternate(),
    headingFont: 'rag-marom-poster',
    bodyFont: 'mono',
    bulletStyle: 'arrow',
    photoShape: 'square',
  }),
  // Not part of the matrix — a realistic mix for eyeballing screenshots.
  showcase: (s) => ({ ...s, sectionScale: { experience: 1.2, skills: 0.85, summary: 1.1 }, sectionSpacing: 1.3,
    headingFont: 'galil', bulletStyle: 'arrow', photoShape: 'square',
    data: { ...s.data, [s.language]: { ...s.data[s.language], sectionTitles: { experience: 'ניסיון מקצועי' } } } }),
  'long-titles': (s) => ({ ...s, data: longTitles(s), bulletStyle: 'none', fontScale: LIMITS.textScale.max }),
};
