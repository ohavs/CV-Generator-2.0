// Shared "is this entry empty?" logic, used by both the auto-prune in App.jsx
// and the add-guard in the sidebar so they always agree on what "empty" means.

// Which fields make an array entry "meaningful". If all of these are blank the
// entry is considered empty (dates/location alone don't keep an entry alive —
// a date with no role is meaningless).
export const ENTRY_KEYS = {
  experience:     ['role', 'company', 'bullets'],
  education:      ['degree', 'school', 'description'],
  projects:       ['name', 'description', 'link', 'tech'],
  skills:         ['category', 'items'],
  languages:      ['name', 'level'],
  certifications: ['name', 'issuer'],
  awards:         ['name', 'issuer'],
  volunteering:   ['role', 'org', 'description'],
  publications:   ['title', 'venue'],
};

// String-array fields nested inside entries; blank strings in them are noise.
const INNER_LISTS = { experience: 'bullets', skills: 'items' };

// A link is noise when it has no URL and its label is blank or still the default.
const DEFAULT_LINK_LABELS = new Set(['Link', 'קישור', '']);

export const isBlank = (v) => {
  if (v == null) return true;
  if (Array.isArray(v)) return v.every(isBlank);
  return String(v).trim() === '';
};

export const entryEmpty = (entry, key) => {
  const fields = ENTRY_KEYS[key];
  if (!fields || !entry) return false;
  return fields.every(f => isBlank(entry[f]));
};

export const linkEmpty = (l) =>
  isBlank(l?.url) && DEFAULT_LINK_LABELS.has((l?.label ?? '').trim());

/**
 * Returns a cleaned copy of one language's CV data, or null if nothing changed.
 * Removes: blank inner list lines (bullets / skill items), fully-empty entries,
 * and abandoned default links.
 */
export function pruneLangData(langData) {
  let changed = false;
  const out = { ...langData };

  for (const key of Object.keys(ENTRY_KEYS)) {
    const arr = out[key];
    if (!Array.isArray(arr) || arr.length === 0) continue;

    // 1) Strip blank lines inside entries (an entry that is ONLY blank lines
    //    is then caught by the whole-entry check below).
    const inner = INNER_LISTS[key];
    let list = arr;
    if (inner) {
      list = list.map(e => {
        if (!Array.isArray(e?.[inner])) return e;
        const kept = e[inner].filter(s => !isBlank(s));
        if (kept.length === e[inner].length) return e;
        changed = true;
        return { ...e, [inner]: kept };
      });
    }

    // 2) Drop entries whose meaningful fields are all blank.
    const pruned = list.filter(e => !entryEmpty(e, key));
    if (pruned.length !== list.length) changed = true;
    out[key] = pruned;
  }

  // 3) Abandoned links (no URL, default/blank label).
  const links = out.personal?.links;
  if (Array.isArray(links) && links.some(linkEmpty)) {
    out.personal = { ...out.personal, links: links.filter(l => !linkEmpty(l)) };
    changed = true;
  }

  return changed ? out : null;
}
