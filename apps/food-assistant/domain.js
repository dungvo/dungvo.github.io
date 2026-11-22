import { categories, defaultMenu, fold, photos, stages } from './menu.js';

export class OrderError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
const require = (condition, code, message) => {
  if (!condition) throw new OrderError(code, message);
};
const integer = (n, lower, upper) => Number.isSafeInteger(n) && n >= lower && n <= upper;
const key = value => typeof value === 'string' && value !== '__proto__' && /^[\w-]{1,100}$/.test(value);
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const bounded = (value, max) => typeof value === 'string' && value.length <= max;
const iso = value => bounded(value, 30) && Number.isFinite(Date.parse(value));
const fail = message => require(false, 'INVALID', message);

export function createState() {
  return { version: 1, rev: 0, tableCount: 8, menu: structuredClone(defaultMenu), active: {}, receipts: [], audit: [], seen: {} };
}

export function total(session) {
  return (session?.lines ?? []).reduce((sum, line) => sum + line.qty * line.price, 0);
}
export function tableStatus(session) {
  if (!session) return 'empty';
  if (session.billing) return 'billing';
  return session.lines.some(line => line.qty && line.status !== 'served') ? 'pending' : 'seated';
}
export function kitchenQueue(state, includeServed = false) {
  return Object.values(state.active).flatMap(session => session.lines
    .filter(line => line.qty > 0 && (includeServed || line.status !== 'served'))
    .map(line => ({ ...line, table: session.table, sessionId: session.id })))
    .sort((a, b) => (a.sequence - b.sequence) || (a.position - b.position));
}
export function signature(items) {
  const totals = new Map();
  for (const item of items) {
    const key = JSON.stringify([item.id, fold(item.note ?? '')]);
    totals.set(key, (totals.get(key) ?? 0) + item.qty);
  }
  return JSON.stringify([...totals].sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function validateMenu(menu) {
  require(Array.isArray(menu) && menu.length > 0 && menu.length <= 200, 'INVALID', 'Thực đơn cần từ 1 đến 200 món.');
  const ids = new Set();
  const names = new Set();
  for (const item of menu) {
    require(plain(item) && key(item.id) && !ids.has(item.id) && bounded(item.name, 70) && fold(item.name)
      && !names.has(fold(item.name)) && integer(item.price, 0, 50000000) && categories.includes(item.category)
      && (photos.includes(item.photo) || item.photo === '') && typeof item.active === 'boolean'
      && Array.isArray(item.aliases) && item.aliases.length <= 15
      && item.aliases.every(alias => bounded(alias, 60) && fold(alias)), 'INVALID', 'Kiểm tra tên món, giá, ảnh và tên gọi tắt. Tên món chính phải duy nhất.');
    ids.add(item.id);
    names.add(fold(item.name));
  }
}

function validateItems(items) {
  require(Array.isArray(items) && items.length > 0 && items.length <= 24, 'INVALID', 'Đơn cần từ 1 đến 24 dòng món.');
  for (const item of items) {
    require(plain(item) && key(item.id) && integer(item.qty, 1, 99) && bounded(item.note ?? '', 180), 'INVALID', 'Kiểm tra món, số lượng và ghi chú.');
  }
}

function appendLines(state, session, action, now) {
  validateItems(action.items);
  require(session.lines.length + action.items.length <= 1000, 'INVALID', 'Bàn đã đạt giới hạn dòng món.');
  const sig = signature(action.items);
  const duplicate = session.batches.some(batch => batch.signature === sig);
  const recentlyRepeated = session.batches.some(batch =>
    batch.signature === sig && Math.abs(Date.parse(now) - Date.parse(batch.at)) < 45000);
  require(action.repeatConfirmed === true || !((!action.explicit && duplicate) || recentlyRepeated),
    'DUPLICATE', 'Bàn này vừa có lượt gọi giống hệt. Xác nhận nếu khách thật sự gọi thêm.');
  const lines = action.items.map((item, position) => {
    const dish = state.menu.find(entry => entry.id === item.id && entry.active);
    require(dish, 'MENU', 'Món đã hết hoặc bị ẩn. Kiểm tra lại thực đơn.');
    require(item.expectedPrice === undefined || item.expectedPrice === dish.price, 'MENU', 'Giá món vừa thay đổi. Kiểm tra lại thực đơn.');
    return { id: action.id + '-' + position, commandId: action.id, dishId: dish.id, name: dish.name,
      photo: dish.photo, price: dish.price, qty: item.qty, note: item.note ?? '', status: 'waiting',
      at: now, sequence: state.rev + 1, position };
  });
  session.batches.push({ id: action.id, signature: sig, at: now });
  session.lines.push(...lines);
}

function sessionFor(state, action, now) {
  require(integer(action.table, 1, state.tableCount), 'TABLE', 'Bàn này chưa được cấu hình.');
  const current = Object.hasOwn(state.active, action.table) ? state.active[action.table] : null;
  if (current) {
    require(current.id === action.sessionId, 'SESSION', 'Bàn đã chuyển sang lượt khách khác. Mở bàn để kiểm tra lại.');
    return current;
  }
  require(action.type === 'add' && action.open === true && key(action.sessionId)
    && !state.receipts.some(receipt => receipt.id === action.sessionId)
    && !Object.values(state.active).some(item => item.id === action.sessionId),
  'SESSION', 'Lượt khách đã đóng hoặc chưa mở. Kiểm tra lại bàn.');
  const session = { id: action.sessionId, table: action.table, openedAt: now, billing: false, rev: 0, lines: [], batches: [] };
  state.active[action.table] = session;
  return session;
}

function updateLine(session, action) {
  const line = session.lines.find(item => item.id === action.lineId);
  require(line && line.qty > 0, 'LINE', 'Món này đã bị hủy hoặc không còn trong lượt khách.');
  require(line.status === action.expectedStatus && line.qty === action.expectedQty, 'CONFLICT', 'Món vừa thay đổi trên thiết bị khác. Kiểm tra lại.');
  if (action.type === 'stage') {
    require(stages.includes(action.status) && stages[stages.indexOf(line.status) + 1] === action.status, 'INVALID', 'Món phải đi theo đúng thứ tự trạng thái.');
    line.status = action.status;
  } else {
    require(line.status === 'waiting', 'STARTED', 'Chỉ sửa hoặc hủy trực tiếp món đang chờ nấu.');
    if (action.type === 'amend') {
      require(action.expectedNote === line.note, 'CONFLICT', 'Ghi chú vừa thay đổi. Kiểm tra lại.');
      require((action.qty === undefined || integer(action.qty, 1, 99))
        && (action.note === undefined || bounded(action.note, 180))
        && (action.qty !== undefined || action.note !== undefined), 'INVALID', 'Số lượng mới hoặc ghi chú không hợp lệ.');
      if (action.qty !== undefined) line.qty = action.qty;
      if (action.note !== undefined) line.note = action.note;
      return line;
    }
    require(integer(action.qty, 1, line.qty), 'QTY', 'Số lượng hủy hoặc đổi vượt số lượng đang chờ nấu.');
    line.qty -= action.qty;
  }
  return line;
}

export function mutate(state, action, now = new Date().toISOString()) {
  require(plain(action) && key(action.id) && key(action.device) && iso(now), 'INVALID', 'Lệnh thiếu mã định danh.');
  if (Object.hasOwn(state.seen, action.id)) return state;
  const next = structuredClone(state);
  let session;
  let receipt;
  let affectedLine;
  switch (action.type) {
    case 'tables':
      require(action.expectedCount === next.tableCount, 'CONFLICT', 'Số bàn vừa thay đổi.');
      require(integer(action.count, 1, 60) && Object.keys(next.active).every(table => Number(table) <= action.count),
        'TABLE', 'Chọn 1–60 bàn và giữ các bàn đang có khách.');
      next.tableCount = action.count;
      break;
    case 'menu':
      require(action.expectedRev === next.rev, 'CONFLICT', 'Dữ liệu vừa thay đổi. Mở lại cài đặt thực đơn.');
      validateMenu(action.menu);
      next.menu = structuredClone(action.menu);
      break;
    case 'add':
    case 'stage':
    case 'cancel':
    case 'replace':
    case 'amend':
    case 'undo':
    case 'billing':
    case 'pay':
      session = sessionFor(next, action, now);
      break;
    default:
      fail('Loại thao tác không hợp lệ.');
  }
  if (['add', 'replace', 'amend'].includes(action.type)) {
    require(!session.billing, 'BILLING', 'Bàn đang chờ thanh toán. Mở lại bàn để sửa đơn.');
  }
  if (['stage', 'cancel', 'replace', 'amend'].includes(action.type)) {
    if (action.type === 'cancel') require(!session.billing, 'BILLING', 'Mở lại bàn để hủy món.');
    affectedLine = updateLine(session, action);
  }
  if (action.type === 'replace') {
    require(action.dishId !== affectedLine.dishId, 'INVALID', 'Chọn món thay thế khác món hiện tại.');
    appendLines(next, session, { ...action, items: [{ id: action.dishId, qty: action.qty, note: affectedLine.note, expectedPrice: action.expectedPrice }], repeatConfirmed: true }, now);
  }
  if (action.type === 'add') appendLines(next, session, action, now);
  if (action.type === 'undo') {
    require(!session.billing, 'BILLING', 'Mở lại bàn để hoàn tác.');
    const lines = session.lines.filter(line => line.commandId === action.targetId);
    const original = next.audit.find(event => event.id === action.targetId);
    require(original?.type === 'add' && original.device === action.device && lines.length
      && lines.every(line => line.status === 'waiting' && line.qty > 0)
      && !next.audit.some(event => ['cancel', 'replace', 'amend'].includes(event.type) && lines.some(line => line.id === event.details.lineId)),
    'STARTED', 'Chỉ hoàn tác lượt gọi của thiết bị này khi bếp chưa bắt đầu và món chưa được sửa.');
    for (const line of lines) line.qty = 0;
    session.batches = session.batches.filter(batch => batch.id !== action.targetId);
  }
  if (action.type === 'billing') {
    require(action.expectedBilling === session.billing && typeof action.billing === 'boolean', 'CONFLICT', 'Trạng thái thanh toán vừa thay đổi.');
    session.billing = action.billing;
  }
  if (action.type === 'pay') {
    require(session.billing && session.rev === action.expectedSessionRev && total(session) === action.expectedTotal,
      'CONFLICT', 'Hóa đơn hoặc trạng thái món vừa thay đổi. Kiểm tra lại trước khi thu tiền.');
    require(session.lines.every(line => !line.qty || line.status === 'served'), 'PENDING', 'Bàn vẫn còn món chưa phục vụ.');
    require(['cash', 'transfer'].includes(action.method), 'INVALID', 'Chọn phương thức thu tiền.');
    receipt = { ...session, total: total(session), paidAt: now, method: action.method };
    next.receipts.push(receipt);
    delete next.active[session.table];
  }
  if (session) session.rev++;
  next.rev++;
  next.seen[action.id] = next.rev;
  const details = {};
  if (action.type === 'add') details.items = structuredClone(action.items);
  if (affectedLine) Object.assign(details, { lineId: affectedLine.id, name: affectedLine.name });
  for (const field of ['qty', 'note', 'status', 'dishId', 'targetId', 'billing', 'count', 'method']) {
    if (Object.hasOwn(action, field)) details[field] = action[field];
  }
  if (receipt) details.total = receipt.total;
  next.audit.push({ id: action.id, type: action.type, device: action.device, at: now,
    table: session?.table ?? null, sessionId: session?.id ?? null, details });
  return next;
}

export function validateSnapshot(state) {
  require(plain(state) && state.version === 1 && integer(state.rev, 0, Number.MAX_SAFE_INTEGER)
    && integer(state.tableCount, 1, 60) && plain(state.active) && plain(state.seen)
    && Array.isArray(state.receipts) && Array.isArray(state.audit), 'BACKUP', 'Tệp sao lưu không hợp lệ.');
  validateMenu(state.menu);
  const ids = new Set();
  const validLine = line => plain(line) && key(line.id) && key(line.dishId) && key(line.commandId)
    && bounded(line.name, 70) && (line.photo === '' || photos.includes(line.photo)) && bounded(line.note, 180)
    && integer(line.qty, 0, 99) && integer(line.price, 0, 50000000) && stages.includes(line.status)
    && iso(line.at) && integer(line.position, 0, 23) && integer(line.sequence, 1, state.rev);
  const sessions = [...Object.entries(state.active).map(([table, item]) => ({ table, item, active: true })),
    ...state.receipts.map(item => ({ item, active: false }))];
  for (const { table, item, active } of sessions) {
    require(plain(item) && key(item.id) && !ids.has(item.id) && integer(item.table, 1, active ? state.tableCount : 60)
      && (!active || String(item.table) === table) && iso(item.openedAt) && integer(item.rev, 1, state.rev)
      && typeof item.billing === 'boolean' && Array.isArray(item.lines) && item.lines.length <= 1000
      && item.lines.every(validLine) && new Set(item.lines.map(line => line.id)).size === item.lines.length
      && Array.isArray(item.batches) && item.batches.every(batch => plain(batch) && key(batch.id)
        && bounded(batch.signature, 10000) && iso(batch.at)), 'BACKUP', 'Tệp sao lưu có lượt khách hoặc món không hợp lệ.');
    if (!active) require(iso(item.paidAt) && ['cash', 'transfer'].includes(item.method) && item.total === total(item),
      'BACKUP', 'Tệp sao lưu có hóa đơn không hợp lệ.');
    ids.add(item.id);
  }
  const eventTypes = ['add', 'cancel', 'replace', 'amend', 'undo', 'stage', 'billing', 'pay', 'tables', 'menu'];
  require(state.audit.length === state.rev && Object.keys(state.seen).length === state.rev
    && state.audit.every((event, index) => plain(event) && key(event.id) && Object.hasOwn(state.seen, event.id)
      && state.seen[event.id] === index + 1 && key(event.device) && iso(event.at)
      && eventTypes.includes(event.type) && plain(event.details)
      && (event.table === null || integer(event.table, 1, 60)) && (event.sessionId === null || key(event.sessionId))),
  'BACKUP', 'Tệp sao lưu có lịch sử không hợp lệ.');
  return state;
}
