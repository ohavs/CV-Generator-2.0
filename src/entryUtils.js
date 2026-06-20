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
