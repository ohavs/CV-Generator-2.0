// Multi-version storage: the user can keep several CVs (e.g. one per job) and
// switch between them. The whole collection lives under DOCS_KEY; we migrate a
// pre-existing single-CV install (LEGACY_KEY) into the first document so nobody
// loses their work on upgrade.
import { DEFAULT_STATE } from './data.js';

const DOCS_KEY = 'koroth_cv_docs_v1';
const LEGACY_KEY = 'koroth_cv_state_v1';

export const uid = () =>
  'd' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

// Merge a persisted state onto the defaults so older saves gain new fields.
export function normalizeState(parsed) {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;
  return {
    ...DEFAULT_STATE,
    ...parsed,
    data: { ...DEFAULT_STATE.data, ...(parsed.data || {}) },
  };
}

export function docName(state, fallback) {
  const d = state?.data?.[state?.language];
  const nm = d?.personal?.name?.trim();
  return nm || fallback || (state?.language === 'en' ? 'Untitled CV' : 'קורות חיים');
}

function freshDoc(state, name) {
  const s = normalizeState(state);
  return { id: uid(), name: name || docName(s), updatedAt: Date.now(), state: s };
}

// Load (and if needed migrate) the whole document collection.
export function loadStore() {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      if (store && Array.isArray(store.docs) && store.docs.length) {
        store.docs = store.docs.map(d => ({ ...d, state: normalizeState(d.state) }));
        if (!store.docs.some(d => d.id === store.activeId)) store.activeId = store.docs[0].id;
        return store;
      }
    }
  } catch { /* fall through to migration */ }

  let legacy = null;
  try {
    const r = localStorage.getItem(LEGACY_KEY);
    if (r) legacy = JSON.parse(r);
  } catch { /* ignore */ }

  const first = freshDoc(legacy || DEFAULT_STATE);
  return { activeId: first.id, docs: [first] };
}

export function saveStore(store) {
  try { localStorage.setItem(DOCS_KEY, JSON.stringify(store)); } catch { /* quota */ }
}

export const activeDoc = (store) =>
  store.docs.find(d => d.id === store.activeId) || store.docs[0];

// A compact view of the collection for the UI (no heavy state payloads).
export const docList = (store) =>
  store.docs.map(d => ({ id: d.id, name: d.name, updatedAt: d.updatedAt }));

export { DEFAULT_STATE, freshDoc };
