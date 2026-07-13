// Shared template helpers

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
