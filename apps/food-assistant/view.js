import { kitchenQueue, tableStatus, total } from './domain.js';
import { categories, fold, money, photos, stageNames, stages } from './menu.js';
import { icon } from './icons.js';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const pad = n => String(n).padStart(2, '0');
export const time = value => new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const fullDate = value => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const statusNames = { empty: 'Trống', pending: 'Còn món', seated: 'Đang phục vụ', billing: 'Chờ thanh toán' };
export const views = { tables: ['tables', 'Sơ đồ bàn'], order: ['menu', 'Gọi món'], kitchen: ['kitchen', 'Màn bếp'], receipts: ['receipt', 'Hóa đơn'], settings: ['settings', 'Cài đặt'] };
const eventNames = { add: 'Gọi món', stage: 'Cập nhật bếp', cancel: 'Hủy món', replace: 'Đổi món', undo: 'Hoàn tác', billing: 'Cập nhật thanh toán', pay: 'Đã thu tiền', tables: 'Cấu hình bàn', menu: 'Cập nhật thực đơn' };
const nextLabel = { waiting: 'Bắt đầu nấu', cooking: 'Đánh dấu sẵn sàng', ready: 'Đã phục vụ' };
const tag = (status, label) => '<span class="status-pill ' + status + '"><i></i>' + esc(label) + '</span>';
export const brand = () => '<span class="brand-mark">' + icon('logo', 26) + '</span><span>Food<span> Assistant</span><small>Gọi món &amp; Bếp</small></span>';
export const photo = (id, name, css = '') => photos.includes(id)
  ? '<img class="' + css + '" src="./assets/' + id + '.webp" alt="' + esc(name) + '" loading="lazy">'
  : '<span class="photo-placeholder ' + css + '" aria-hidden="true">' + icon('logo', 30) + '</span>';
const empty = (title, desc, name = 'bag') => '<div class="empty-state">' + icon(name, 29) + '<strong>' + esc(title) + '</strong><p>' + esc(desc) + '</p></div>';
const navButton = (id, page, small = false) => {
  const [name, label] = views[id];
  return '<button class="nav-item' + (id === page ? ' current' : '') + '" data-page="' + id + '"'
    + (id === page ? ' aria-current="page"' : '') + '>' + icon(name, 20) + '<span>' + (small && id === 'tables' ? 'Bàn' : small && id === 'kitchen' ? 'Bếp' : label) + '</span></button>';
};
export function navigation(page, count, sync) {
  const labels = {
    local: ['Lưu trên thiết bị', 'local'], ready: ['Đã đồng bộ', 'ready'], offline: ['Mất kết nối máy bếp', 'offline'],
    pending: ['Đang chờ đồng bộ', 'offline'], blocked: ['Có lệnh cần kiểm tra', 'offline'],
  };
  const [message, mode] = labels[sync];
  const indicator = '<span class="sync-badge ' + mode + '"><i></i>' + message + '</span>';
  return {
    side: '<button class="brand" data-page="tables" aria-label="Food Assistant, về sơ đồ bàn">' + brand() + '</button>'
      + '<nav class="main-nav">' + Object.keys(views).map(id => navButton(id, page)).join('') + '</nav>'
      + '<div class="side-footer">' + icon('shield', 19) + '<div><strong>Dữ liệu quán</strong>' + indicator + '</div></div>',
    top: '<button class="brand mobile-brand" data-page="tables" aria-label="Food Assistant, về sơ đồ bàn">' + brand() + '</button>'
      + '<span class="crumb">' + icon(views[page][0], 18) + esc(views[page][1]) + '</span><div class="top-actions">' + indicator
      + '<button type="button" class="icon-button mobile-settings" data-page="settings" aria-label="Cài đặt">' + icon('settings') + '</button>'
      + '<button type="button" class="btn top-voice" data-action="voice">' + icon('mic', 18) + 'Gọi bằng giọng nói</button></div>',
    mobile: navButton('tables', page, true) + navButton('order', page, true)
      + '<button class="mobile-mic" data-action="voice" aria-label="Gọi bằng giọng nói">' + icon('mic', 25) + '</button>'
      + navButton('kitchen', page, true) + navButton('receipts', page, true)
      + '<span class="sr-only">' + count + ' món trong bếp</span>',
  };
}

function tablesPage(state) {
  const stats = { empty: 0, pending: 0, seated: 0, billing: 0 };
  const tables = Array.from({ length: state.tableCount }, (_, i) => {
    const n = i + 1;
    const session = state.active[n];
    const status = tableStatus(session);
    stats[status]++;
    const count = session?.lines.reduce((sum, line) => sum + line.qty, 0);
    return '<button class="table-card ' + status + '" data-table="' + n + '"><span class="table-card-head"><span class="table-icon">'
      + icon('grid', 19) + '</span>' + tag(status, statusNames[status]) + '</span>'
      + '<span class="table-name">Bàn <b>' + pad(n) + '</b></span>'
      + '<span class="table-card-foot">' + (session ? count + ' phần · ' + money(total(session)) : 'Chạm để gọi món') + icon('chevron', 16) + '</span></button>';
  }).join('');
  return '<section class="hero"><div><h1>Quản lý bàn</h1><p>Chọn bàn hoặc dùng giọng nói để gọi món.</p>'
    + '<div class="hero-buttons"><button class="btn light" data-action="voice">' + icon('mic', 19) + 'Gọi bằng giọng nói</button>'
    + '<button class="btn hero-secondary" data-action="type">' + icon('keyboard', 18) + 'Nhập lệnh</button></div></div></section>'
    + '<section class="stats" aria-label="Tình trạng bàn">' + Object.keys(stats).map(id => '<div class="stat ' + id
      + '"><i></i><span>' + statusNames[id] + '</span><strong>' + stats[id] + '</strong></div>').join('') + '</section>'
    + '<section><div class="section-title"><div><h2>Sơ đồ bàn</h2><p>' + state.tableCount + ' bàn · ' + (state.tableCount - stats.empty)
    + ' bàn có khách</p></div><button class="btn outline" data-page="settings">' + icon('settings', 17) + 'Cấu hình bàn</button></div>'
    + '<div class="tables-grid">' + tables + '</div></section>';
}

const pageTitle = (title, desc, actions = '') => '<header class="page-title"><div><h1>' + esc(title) + '</h1><p>' + esc(desc) + '</p></div>' + actions + '</header>';
const tableSelect = (state, current) => '<label class="field compact"><span>Bàn phục vụ</span><select id="table-select">'
  + '<option value="">Chọn bàn</option>' + Array.from({ length: state.tableCount }, (_, i) =>
    '<option value="' + (i + 1) + '"' + (current === i + 1 ? ' selected' : '') + '>Bàn ' + pad(i + 1) + '</option>').join('') + '</select></label>';

function orderPage(state, ui) {
  const session = state.active[ui.table];
  const cart = ui.cart;
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * (state.menu.find(dish => dish.id === item.id)?.price ?? 0), 0);
  const activeMenu = state.menu.filter(dish => dish.active && (ui.category === 'Tất cả' || ui.category === dish.category));
  const dishes = (ui.search ? activeMenu.filter(dish => fold([dish.name, ...dish.aliases].join(' ')).includes(fold(ui.search))) : activeMenu)
    .map(dish => '<button class="dish-card" data-dish="' + esc(dish.id) + '"' + (session?.billing || !ui.table ? ' disabled' : '') + '>'
      + '<span class="dish-picture">' + photo(dish.photo, dish.name) + '</span><span class="dish-info"><span><strong>' + esc(dish.name)
      + '</strong><small>' + money(dish.price) + '</small></span><span class="dish-plus">' + icon('plus', 18) + '</span></span></button>').join('');
  const cartRows = cart.map(item => {
    const dish = state.menu.find(entry => entry.id === item.id);
    return '<li><span><strong>' + esc(dish?.name ?? item.id) + '</strong><button class="text-button note-action" data-note="' + esc(item.id)
      + '">' + (item.note ? esc(item.note) : 'Thêm ghi chú') + '</button></span><div class="stepper"><button data-cart-change="-1" data-id="'
      + esc(item.id) + '" aria-label="Giảm số lượng ' + esc(dish?.name) + '">' + icon('minus', 14) + '</button><b>' + item.qty
      + '</b><button data-cart-change="1" data-id="' + esc(item.id) + '" aria-label="Tăng số lượng ' + esc(dish?.name) + '">' + icon('plus', 14) + '</button></div></li>';
  }).join('');
  const lineRows = (session?.lines ?? []).filter(line => line.qty).map(line => '<li><span><strong>' + line.qty + '× ' + esc(line.name)
    + '</strong><small>' + esc(line.note || stageNames[line.status]) + '</small></span>'
    + (line.status === 'waiting' && !session.billing ? '<button class="text-button danger-text" data-cancel="' + esc(line.id) + '">Sửa</button>' : '<span class="line-amount">' + money(line.qty * line.price) + '</span>') + '</li>').join('');
  return pageTitle(ui.table ? 'Gọi món · Bàn ' + pad(ui.table) : 'Gọi món', 'Chạm món hoặc nhập một câu gọi món.', tableSelect(state, ui.table))
    + '<div class="order-layout"><section><div class="filters"><div class="tabs" aria-label="Nhóm món">' + ['Tất cả', ...categories].map(category => '<button data-category="'
      + category + '" aria-pressed="' + (ui.category === category) + '">' + category + '</button>').join('')
    + '</div><label class="search">' + icon('search', 17) + '<input id="menu-search" type="search" value="' + esc(ui.search) + '" placeholder="Tìm món" aria-label="Tìm món"></label></div>'
    + '<div id="dishes" class="dishes">' + (dishes || empty('Không tìm thấy món', 'Thử tên khác hoặc bỏ bộ lọc.', 'search')) + '</div></section>'
    + '<aside class="order-sidebar"><section id="cart-panel" class="panel"><div class="panel-heading">' + icon('bag', 21) + '<h2>Lượt gọi này</h2></div>'
    + (cartRows ? '<ul class="line-list">' + cartRows + '</ul><div class="total"><span>Tạm tính</span><strong>' + money(cartTotal)
      + '</strong></div><button class="btn primary full" data-action="send-cart"' + (!ui.table || session?.billing ? ' disabled' : '') + '>Gửi bếp' + icon('arrow', 17) + '</button>'
      : '<p class="muted">' + (ui.table ? 'Chạm món để thêm vào lượt gọi.' : 'Chọn bàn để bắt đầu gọi món.') + '</p>')
    + '</section><section class="panel"><div class="panel-heading">' + icon('receipt', 21) + '<h2>Đơn của bàn</h2></div>'
    + (session ? '<p class="session-code">Lượt khách ' + esc(session.id.slice(-8).toUpperCase()) + '</p><ul class="line-list">' + lineRows
      + '</ul><div class="total"><span>Tổng bàn</span><strong>' + money(total(session)) + '</strong></div><button class="btn outline full" data-action="bill">'
      + icon('receipt', 17) + (session.billing ? 'Mở hóa đơn' : 'Tính tiền') + '</button>'
      : '<p class="muted">Chưa có lượt khách đang mở.</p>') + '</section></aside></div>'
    + (cart.length ? '<button class="cart-shortcut" data-action="cart">' + icon('bag') + '<span>' + cart.reduce((n, item) => n + item.qty, 0) + ' phần</span><strong>' + money(cartTotal) + '</strong>' + icon('arrow', 16) + '</button>' : '');
}

function kitchenPage(state, ui) {
  const queue = kitchenQueue(state, true);
  const counts = stages.map(stage => queue.filter(line => line.status === stage).reduce((n, line) => n + line.qty, 0));
  const rows = queue.filter(line => ui.kitchenFilter === 'open' ? line.status !== 'served' : line.status === ui.kitchenFilter)
    .map(line => '<article class="ticket"><div class="ticket-head"><span>Bàn <strong>' + pad(line.table) + '</strong></span>'
      + '<span>' + icon('clock', 15) + time(line.at) + '</span></div><div class="ticket-image">' + photo(line.photo, line.name)
      + '<span class="ticket-qty">×' + line.qty + '</span></div><div class="ticket-body"><div>' + tag(line.status, stageNames[line.status]) + '<h2>'
      + esc(line.name) + '</h2></div>' + (line.note ? '<p class="ticket-note"><strong>Ghi chú</strong> ' + esc(line.note) + '</p>' : '')
      + (nextLabel[line.status] ? '<button class="btn ' + (line.status === 'ready' ? 'primary' : 'outline') + ' full" data-stage="'
        + esc(line.id) + '">' + nextLabel[line.status] + icon(line.status === 'ready' ? 'check' : 'arrow', 17) + '</button>' : '') + '</div></article>').join('');
  return pageTitle('Màn bếp', 'Món được xếp theo thứ tự nhận.', '<button class="btn outline" data-action="voice">' + icon('mic', 18) + 'Hỏi bếp</button>')
    + '<div class="kitchen-tabs tabs" aria-label="Lọc theo trạng thái"><button data-kitchen="open" aria-pressed="' + (ui.kitchenFilter === 'open') + '">Đang mở <b>'
    + counts.slice(0, 3).reduce((a, b) => a + b, 0) + '</b></button>'
    + stages.map((stage, i) => '<button data-kitchen="' + stage + '" aria-pressed="' + (ui.kitchenFilter === stage) + '">' + stageNames[stage] + ' <b>' + counts[i] + '</b></button>').join('')
    + '</div><div class="tickets">' + (rows || empty('Chưa có món trong mục này', 'Các lượt gọi đến bếp sẽ hiện tại đây.', 'kitchen')) + '</div>';
}

function receiptsPage(state) {
  return pageTitle('Hóa đơn', 'Lịch sử thu tiền và hoạt động của quán.')
    + '<section class="panel receipts"><div class="panel-heading">' + icon('receipt') + '<h2>Đã thanh toán</h2></div>'
    + (state.receipts.length ? '<ul class="receipt-list">' + [...state.receipts].reverse().map(receipt =>
      '<li><button data-receipt="' + esc(receipt.id) + '"><span><strong>Bàn ' + pad(receipt.table) + '</strong><small>'
      + fullDate(receipt.paidAt) + ' · ' + (receipt.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản') + '</small></span><strong>' + money(receipt.total)
      + '</strong>' + icon('chevron', 16) + '</button></li>').join('') + '</ul>' : empty('Chưa có hóa đơn', 'Hóa đơn đã thu tiền sẽ được lưu ở đây.', 'receipt')) + '</section>'
    + '<section class="panel receipts"><div class="panel-heading">' + icon('clock') + '<h2>Hoạt động gần đây</h2></div>'
    + (state.audit.length ? '<ul class="receipt-list">' + [...state.audit].slice(-50).reverse().map(event => '<li><div class="audit-row"><span><strong>'
      + (event.table ? 'Bàn ' + pad(event.table) + ' · ' : '') + eventNames[event.type] + '</strong>'
      + (event.details.name ? '<small>' + esc(event.details.name) + ' · ' + esc(event.details.qty ?? stageNames[event.details.status]) + '</small>' : '')
      + '</span><small>' + fullDate(event.at) + '</small></div></li>').join('') + '</ul>' : '<p class="muted">Chưa ghi nhận thao tác.</p>') + '</section>';
}

function settingsPage(state, doc) {
  const queued = doc.pending.length;
  const sync = doc.config ? '<p class="muted sync-url">' + esc(doc.config.url) + '</p><p>' + queued + ' lệnh đang chờ gửi.'
    + (doc.aiEnabled ? ' AI đã sẵn sàng.' : ' AI chưa được cấu hình trên máy chủ.') + '</p><div class="button-row"><button class="btn outline" data-action="sync-now">Đồng bộ lại</button>'
    + '<button class="btn outline" data-action="disconnect">Ngắt kết nối</button></div>'
    : '<p class="muted">Kết nối các điện thoại và máy tính bảng vào cùng một API để dùng chung đơn.</p><form data-form="connect" class="form-stack">'
    + '<label class="field">Địa chỉ API<input name="endpoint" type="url" placeholder="https://api.example.com" required></label>'
    + '<label class="field">Mã kết nối quán<input name="token" type="password" autocomplete="off" minlength="24" maxlength="256" required></label>'
    + '<button class="btn primary" type="submit">' + icon('link', 17) + 'Kết nối</button></form>';
  const usage = doc.aiUsage;
  const spend = usage ? '<div class="' + (usage.atWarning ? 'notice' : 'muted') + '"><strong>Chi phí AI ước tính tháng '
    + esc(usage.month.slice(5)) + '</strong><p>' + money(usage.used) + ' / ' + money(usage.limit) + '</p><p>'
    + esc(usage.audioCalls) + ' lượt chuyển giọng nói · ' + esc(usage.textCalls) + ' lượt hiểu câu'
    + (usage.atWarning ? ' · Đã đến ngưỡng cảnh báo' : '') + '</p></div>' : '';
  const voice = '<section class="panel"><div class="panel-heading">' + icon('mic')
    + '<h2>Trợ lý và giọng nói</h2></div>' + spend + (doc.config ? '<form data-form="voice-settings" class="form-stack">'
    + '<label class="checkbox"><input name="allowAI" type="checkbox"' + (doc.config.allowAI ? ' checked' : '')
    + '>Dùng AI cho câu gọi khó hiểu</label><label class="checkbox"><input name="allowAudio" type="checkbox"'
    + (doc.config.allowAudio ? ' checked' : '') + '>Cho phép nút thu âm qua máy chủ</label>'
    + '<p class="muted">' + (doc.transcriptionEnabled
      ? 'Khi chọn nút thu âm, bản thu được gửi tới OpenAI qua máy chủ của quán.'
      : 'Máy chủ chưa bật chuyển giọng nói thành chữ.') + '</p>'
    + '<button class="btn outline" type="submit">Lưu cài đặt trợ lý</button></form>'
    : '<p class="muted">Để bổ sung thu âm khi micro trình duyệt gặp lỗi, kết nối API ở mục Kết nối thiết bị.</p>') + '</section>';
  const failure = doc.failure ? '<div class="notice" role="alert"><strong>Lệnh cần kiểm tra</strong><p>' + esc(doc.failure.message) + '</p>'
    + (doc.failure.code === 'DUPLICATE' ? '<button data-action="repeat-sync" class="btn primary">Xác nhận gọi thêm</button>' : '')
    + '<button data-action="discard-sync" class="btn outline">Bỏ lệnh này</button></div>' : '';
  return pageTitle('Cài đặt', 'Quản lý bàn, thực đơn và dữ liệu quán.')
    + '<div class="settings-grid"><section class="panel"><div class="panel-heading">' + icon('tables') + '<h2>Số bàn</h2></div><form data-form="tables" class="form-stack">'
    + '<label class="field">Số bàn phục vụ<input type="number" name="count" min="1" max="60" value="' + state.tableCount + '" required></label>'
    + '<button class="btn primary" type="submit">Lưu số bàn</button></form></section>'
    + '<section class="panel"><div class="panel-heading">' + icon('link') + '<h2>Kết nối thiết bị</h2></div>' + sync + failure + '</section>' + voice
    + '<section class="panel"><div class="panel-heading">' + icon('shield') + '<h2>Sao lưu và khôi phục</h2></div>'
    + '<p class="muted">Tải bản JSON gồm thực đơn, bàn đang mở, hóa đơn và lịch sử.</p><div class="button-row"><button class="btn outline" data-action="backup">'
    + icon('download', 17) + 'Tải bản sao</button>'
    + (!doc.config ? '<button class="btn outline" data-action="restore">Khôi phục</button><input type="file" id="restore-file" accept=".json,application/json" hidden>' : '') + '</div></section>'
    + '<section class="panel menu-admin"><div class="panel-heading">' + icon('menu') + '<h2>Thực đơn và giá</h2><button class="btn outline" data-action="new-dish">' + icon('plus', 16)
    + 'Thêm món</button></div><ul class="receipt-list">' + state.menu.map(dish => '<li><button data-edit="' + esc(dish.id) + '">'
      + photo(dish.photo, dish.name, 'tiny-photo') + '<span><strong>' + esc(dish.name) + '</strong><small>' + esc(dish.category)
      + (dish.active ? '' : ' · Đang ẩn') + '</small></span><strong>' + money(dish.price) + '</strong>' + icon('edit', 16) + '</button></li>').join('')
    + '</ul></section></div>';
}

export function page(state, ui, doc) {
  if (ui.page === 'order') return orderPage(state, ui);
  if (ui.page === 'kitchen') return kitchenPage(state, ui);
  if (ui.page === 'receipts') return receiptsPage(state);
  if (ui.page === 'settings') return settingsPage(state, doc);
  return tablesPage(state);
}

export function receiptDetails(session) {
  return '<ul class="line-list bill-lines">' + session.lines.filter(line => line.qty > 0).map(line => '<li><span><strong>'
    + line.qty + '× ' + esc(line.name) + '</strong><small>' + money(line.price) + ' / phần</small></span><strong>' + money(line.qty * line.price) + '</strong></li>').join('')
    + '</ul><div class="total bill-total"><span>Tổng tiền</span><strong>' + money(total(session)) + '</strong></div>';
}
