const paths = {
  logo: '<path d="M3 11h18a9 9 0 0 1-18 0Zm5 9h8M8 8c-2-2 2-3 0-5m4 5c-2-2 2-3 0-5m4 5c-2-2 2-3 0-5"/>',
  tables: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  menu: '<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18m13-18c-4 2-5 7-5 11h5m0-11v18"/>',
  kitchen: '<path d="M5 13a4 4 0 0 1 2-7 5 5 0 0 1 10 0 4 4 0 0 1 2 7l-1 7H6l-1-7Zm1 4h12"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm4 5h6m-6 4h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/><circle cx="12" cy="12" r="7"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-3 0h6"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  spark: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  edit: '<path d="m4 16 10-10 4 4-10 10H4v-4Zm10-10 2-2a2 2 0 0 1 4 4l-2 2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  link: '<path d="M10 13a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-2 2m2 6a4 4 0 0 0-6 0l-4 4a4 4 0 0 0 6 6l2-2"/>',
  external: '<path d="M13 5h6v6m0-6-8 8M9 5H5v14h14v-4"/>',
  grid: '<path d="M4 8h16v10H4zM7 4h10M7 22h10M2 10v6m20-6v6"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4"/>',
  bag: '<path d="M4 8h16l1 13H3L4 8Zm4 2V6a4 4 0 1 1 8 0v4"/>',
};
export function icon(name, size = 20) {
  return '<svg class="icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] ?? '') + '</svg>';
}
