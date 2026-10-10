// Shared template helpers
import { I18N } from '../data.js';

// The UI strings for a CV, with any section the user renamed.
export function labelsFor(lang, data) {
  const base = I18N[lang];
  const custom = data?.sectionTitles;
  if (!custom) return base;
  const sections = { ...base.sections };
  for (const [id, v] of Object.entries(custom)) {
    if (typeof v === 'string' && v.trim()) sections[id] = v.trim();
  }
  return { ...base, sections };
}

// Gap after a section, scaled by the spacing control (--cv-space).
export const sp = (px) => `calc(${px}px * var(--cv-space, 1))`;

// Page margins. When AutoFit shrinks a long CV by --fit it lays the page out
// 1/--fit wider; margins are laid out 1/--fit larger to match, so on paper
// they stay the template's size and only the text gets smaller.
export const mm = (n) => `calc(${n}mm / var(--fit, 1))`;
export const margin = (spec) =>
  spec.trim().split(/\s+/).map(v => (/^-?[\d.]+mm$/.test(v) ? mm(parseFloat(v)) : v)).join(' ');

export function get(obj, path) {
  let cur = obj;
  for (const k of path) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

export function makeField(data, onEdit) {
  return (path, opts = {}) => ({
    value: get(data, path) ?? '',
    onChange: (v) => onEdit(path, v),
    multiline: opts.multiline,
    placeholder: opts.placeholder,
  });
}

// section-iterator helper: returns visible section ids in order
export function visibleIds(sections) {
  return sections.filter(s => s.visible).map(s => s.id);
}
