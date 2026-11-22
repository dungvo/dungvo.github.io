import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createState, kitchenQueue, mutate, tableStatus, total, validateSnapshot } from '../domain.js';
import { parse, validDraft } from '../language.js';
import { normalizeEndpoint, reconcile, resolveFailure, submitDocument, visible } from '../storage.js';

const t0 = '2026-11-22T01:00:00.000Z';
const t1 = '2026-11-22T01:00:20.000Z';
const t2 = '2026-11-22T01:02:00.000Z';
let salt = 0;
const command = (type, values = {}) => ({ type, id: 'command-' + (++salt), device: 'foh', ...values });
const dish = (id, qty = 1, note = '') => ({ id, qty, note });
const add = (items = [dish('tai', 2)], extras = {}) => command('add', { table: 3, sessionId: 'session-3', open: true, items, ...extras });
const onTable = (type, extras) => command(type, { table: 3, sessionId: 'session-3', ...extras });
const reject = (fn, code) => assert.throws(fn, error => error.code === code);
const open = (items) => mutate(createState(), add(items), t0);
const bill = state => mutate(state, onTable('billing', { expectedBilling: false, billing: true }), t0);
const lineAction = (state, type, extras = {}, index = 0) => {
  const line = state.active[3].lines[index];
  return onTable(type, { lineId: line.id, expectedStatus: line.status, expectedQty: line.qty, ...extras });
};
const pay = (state, extras = {}) => onTable('pay', {
  method: 'cash', expectedSessionRev: state.active[3].rev, expectedTotal: total(state.active[3]), ...extras,
});
function serve(state) {
  for (let i = 0; i < state.active[3].lines.length; i++) {
    if (!state.active[3].lines[i].qty) continue;
    for (const status of ['cooking', 'ready', 'served']) state = mutate(state, lineAction(state, 'stage', { status }, i), t0);
  }
  return state;
}
const spoken = [
  ['Hai phở tái bằng số 3', 'add', 3, [dish('tai', 2)]],
  ['2 tô phở bàn 3', 'add', 3, [dish('tai', 2)]],
  ['Hai tô phở bằng 2', 'add', 2, [dish('tai', 2)]],
  ['Hai tô phở bằng số 3 thêm một ly trà đá', 'add', 3, [dish('tai', 2), dish('tra-da')]],
  ['Bằng số hai cho hai tô phở', 'add', 2, [dish('tai', 2)]],
  ['Bạn số 32 tô phở', 'add', 3, [dish('tai', 2)]],
  ['Bàn số 32 tô phở nạm', 'add', 3, [dish('nam', 2)]],
  ['Hai tô phở chín bằng ba', 'add', 3, [dish('chin', 2)]],
  ['Hai tô phở, một tô không hành, một trà đá bằng số 3', 'add', 3, [dish('tai'), dish('tai', 1, 'không hành'), dish('tra-da')]],
  ['Bằng số 2 thêm một tô phở', 'add', 2, [dish('tai')]],
  ['Bàn 3 hai phở tái bằng số 4', 'clarify', null, []],
  ['Bàn 3 phở tái ghi chú chia đều bằng 2', 'add', 3, [dish('tai', 1, 'chia đều bằng 2')]],
  ['Bàn số ba mươi hai tô phở', 'clarify', null, []],
  ['Bàn số 32 hai tô phở', 'clarify', null, []],
  ['Bàn 5 hai phở tái, một không hành', 'add', 5, [dish('tai'), dish('tai', 1, 'không hành')]],
  ['Bàn số 5 cho em hai tô phở tái một tô không hành và một ly trà đá', 'add', 5, [dish('tai'), dish('tai', 1, 'không hành'), dish('tra-da')]],
  ['Bàn 5 phở tái hai tô, một bò kho', 'add', 5, [dish('tai', 2), dish('bo-kho')]],
  ['Bàn 5 sửa phở tái còn ba tô', 'amend', 5, [dish('tai', 3)]],
  ['Bàn 5 update trà đá không đường', 'amend', 5, [dish('tra-da', null, 'không đường')]],
  ['Bàn 5 cập nhật phở tái thành phở nạm', 'replace', 5, [dish('tai')], 'nam'],
  ['Bàn 3 hai phở tái một bò kho', 'add', 3, [dish('tai', 2), dish('bo-kho')]],
  ['Bàn 3 thêm hai trà đá', 'add', 3, [dish('tra-da', 2)]],
  ['Bàn 3 hủy một phở tái', 'cancel', 3, [dish('tai')]],
  ['Bàn 3 đổi một tái thành nạm', 'replace', 3, [dish('tai')], 'nam'],
  ['Bàn 3 còn món gì chưa ra?', 'pending', 3, []],
  ['Bàn 3 tính tiền', 'bill', 3, []],
  ['Bàn ba 2 tô phở tái', 'add', 3, [dish('tai', 2)]],
  ['bàn 04 bánh mì bò kho', 'add', 4, [dish('banh-mi')]],
  ['bàn 2 một bò hầm và 3 ly nước trà', 'add', 2, [dish('bo-kho'), dish('tra-da', 3)]],
  ['ban 3 hai pho tai', 'add', 3, [dish('tai', 2)]],
  ['lấy thêm bốn cà phê', 'add', 4, [dish('ca-phe', 4)], null, 4],
  ['bàn 1 hai mươi lăm trà đá', 'add', 1, [dish('tra-da', 25)]],
  ['bàn 1 mười phở bò nạm', 'add', 1, [dish('nam', 10)]],
  ['bàn 1 ba mươi mốt cơm gà', 'add', 1, [dish('com-ga', 31)]],
  ['bàn 1 phở tái không hành hai ly trà đá', 'add', 1, [dish('tai', 1, 'không hành'), dish('tra-da', 2)]],
  ['bàn 1 phở tái ghi chú không lấy rau', 'add', 1, [dish('tai', 1, 'không lấy rau')]],
  ['bàn 1 phở tái ít hành', 'add', 1, [dish('tai', 1, 'ít hành')]],
  ['bàn 1 hai phở tái à không ba', 'add', 1, [dish('tai', 3)]],
  ['bàn 1 một bò kho hai phở tái ý là một phở nạm', 'add', 1, [dish('bo-kho'), dish('nam')]],
  ['bàn 1 hai phở tái sửa lại ba phở nạm', 'add', 1, [dish('nam', 3)]],
  ['một gỏi cuốn', 'add', 4, [dish('goi-cuon')], null, 4],
  ['bàn 3', 'select', 3, []],
  ['bếp còn bao nhiêu tô?', 'queue', null, []],
  ['món nào cần nấu trước?', 'queue', null, []],
  ['bàn 3 còn bao nhiêu tô chưa ra?', 'pending', 3, []],
  ['bàn 3 thanh toán giúp', 'bill', 3, []],
  ['bàn 3 hủy món hai trà đá', 'cancel', 3, [dish('tra-da', 2)]],
  ['bàn 3 bỏ một trà đá', 'cancel', 3, [dish('tra-da')]],
  ['bàn 9 phở tái', 'clarify', null, []],
  ['bàn 0 một phở tái', 'clarify', null, []],
  ['bàn 1 100 phở tái', 'clarify', 1, []],
  ['bàn 1 0 phở tái', 'clarify', 1, []],
  ['bàn 1 hai món chưa có trong menu', 'clarify', 1, []],
  ['bàn 1 hai phở tái bàn 3 một bò kho', 'clarify', null, []],
  ['bàn 3 hai phở tái rồi hủy trà đá', 'clarify', 3, []],
  ['bàn 3 đổi hai tái thành ba nạm', 'clarify', 3, []],
  ['hai phở tái', 'clarify', null, []],
  ['bàn 3 hủy một tái một nạm', 'clarify', 3, []],
];
for (const [sentence, intent, table, items, replacement = null, selected] of spoken) {
  test(sentence, () => {
    const state = createState();
    const draft = parse(sentence, state, selected);
    assert.deepEqual([draft.intent, draft.table, draft.items, draft.replacement], [intent, table, items, replacement]);
    assert.equal(validDraft(draft, state), true);
  });
}
test('Alias trùng yêu cầu gọi tên đầy đủ', () => {
  const state = createState();
  state.menu[0].aliases.push('phở bò');
  state.menu[1].aliases.push('phở bò');
  assert.equal(parse('bàn 1 phở bò', state).intent, 'clarify');
  assert.equal(parse('bàn 1 phở bò tái', state).items[0].id, 'tai');
});
test('Tên chính được ưu tiên khi trùng biệt danh', () => {
  const state = createState();
  state.menu[1].aliases.push('phở tái');
  assert.equal(parse('bàn 1 phở tái', state).items[0].id, 'tai');
});
test('Món ẩn không gọi mới nhưng vẫn hủy được', () => {
  const state = createState();
  state.menu[0].active = false;
  assert.equal(parse('bàn 3 một phở tái', state).intent, 'clarify');
  assert.equal(parse('bàn 3 hủy một phở tái', state).intent, 'cancel');
});
test('AI phải trả lệnh đúng schema, món và số lượng có thật', () => {
  const state = createState();
  const parsed = parse('bàn 3 một phở tái', state);
  for (const invalid of [{ ...parsed, paid: true }, { ...parsed, table: -1 }, { ...parsed, explicit: 'false' },
    { ...parsed, intent: 'pay' }, { ...parsed, items: [{ id: 'fake', qty: 1, note: '' }] },
    { ...parsed, items: [dish('tai', 0)] }, { ...parsed, items: [{ ...dish('tai'), price: 0 }] },
    { ...parsed, items: [dish('tai', 1, 'A'.repeat(181))] }]) assert.equal(validDraft(invalid, state), false);
});
test('Gọi mới mở lượt khách và lên bếp đúng thứ tự', () => {
  const state = open([dish('tai', 2), dish('bo-kho', 1, 'Không hành')]);
  assert.equal(tableStatus(state.active[3]), 'pending');
  assert.equal(state.active[3].id, 'session-3');
  assert.deepEqual(kitchenQueue(state).map(line => [line.dishId, line.qty, line.note]), [['tai', 2, ''], ['bo-kho', 1, 'Không hành']]);
});
test('Gọi thêm giữ nguyên lượt khách và ghi lịch sử', () => {
  const state = mutate(open(), add([dish('tra-da', 2)], { explicit: true }), t1);
  assert.equal(state.active[3].id, 'session-3');
  assert.equal(state.audit.length, 2);
  assert.equal(total(state.active[3]), 120000);
});
test('Request gửi lại bằng cùng mã trả snapshot không đổi', () => {
  const request = add();
  const state = mutate(createState(), request, t0);
  assert.equal(mutate(state, request, t2), state);
});
test('Đọc lại lệnh cũ bằng ID mới yêu cầu xác nhận', () => {
  const state = open();
  reject(() => mutate(state, add(), t2), 'DUPLICATE');
});
test('Cùng món và số lượng sau khi đổi thứ tự hoặc gộp dòng', () => {
  const state = open([dish('tai'), dish('tra-da'), dish('tai')]);
  reject(() => mutate(state, add([dish('tra-da'), dish('tai', 2)]), t1), 'DUPLICATE');
});
test('Thêm món giống trong 45 giây yêu cầu xác nhận', () => {
  const state = open();
  reject(() => mutate(state, add(undefined, { explicit: true }), t1), 'DUPLICATE');
});
test('Xác nhận gọi thêm giống nhau vẫn thành công', () => {
  const state = mutate(open(), add(undefined, { explicit: true, repeatConfirmed: true }), t1);
  assert.equal(total(state.active[3]), 220000);
});
test('Gọi thêm rõ ràng khác thời điểm được tiếp nhận', () => {
  const state = mutate(open(), add(undefined, { explicit: true }), t2);
  assert.equal(kitchenQueue(state).length, 2);
});
test('Món giống, ghi chú khác là hai lượt riêng', () => {
  const state = mutate(open(), add([dish('tai', 2, 'không hành')]), t1);
  assert.equal(kitchenQueue(state).length, 2);
});
test('Hủy một phần giữ phần còn lại và giảm tiền', () => {
  const before = open();
  const state = mutate(before, lineAction(before, 'cancel', { qty: 1 }), t1);
  assert.equal(total(state.active[3]), 55000);
  assert.equal(before.active[3].lines[0].qty, 2);
});
test('Hủy quá số lượng bị chặn', () => {
  const state = open();
  reject(() => mutate(state, lineAction(state, 'cancel', { qty: 3 }), t1), 'QTY');
});
test('Hủy món đã nấu bị chặn', () => {
  const initial = open();
  const state = mutate(initial, lineAction(initial, 'stage', { status: 'cooking' }), t1);
  reject(() => mutate(state, lineAction(state, 'cancel', { qty: 1 }), t1), 'STARTED');
});
test('Đổi món giữ số lượng, ghi chú, hàng bếp và giá mới', () => {
  const state = open([dish('tai', 2, 'Không hành')]);
  const next = mutate(state, lineAction(state, 'replace', { qty: 1, dishId: 'nam' }), t1);
  assert.deepEqual(kitchenQueue(next).map(line => [line.dishId, line.qty, line.note]), [['tai', 1, 'Không hành'], ['nam', 1, 'Không hành']]);
  assert.equal(total(next.active[3]), 114000);
});
test('Đổi sang món không tồn tại không làm mất món cũ', () => {
  const state = open();
  reject(() => mutate(state, lineAction(state, 'replace', { qty: 1, dishId: 'fake' }), t1), 'MENU');
  assert.equal(total(state.active[3]), 110000);
});
test('Hoàn tác lượt gọi đang chờ nấu giữ lịch sử', () => {
  const state = open();
  const undo = onTable('undo', { targetId: state.audit[0].id });
  const next = mutate(state, undo, t1);
  assert.equal(kitchenQueue(next).length, 0);
  assert.equal(next.audit.at(-1).type, 'undo');
});
test('Thiết bị khác không hoàn tác lượt gọi', () => {
  const state = open();
  reject(() => mutate(state, onTable('undo', { targetId: state.audit[0].id, device: 'kitchen' }), t1), 'STARTED');
});
test('Không được bỏ qua một công đoạn bếp', () => {
  const state = open();
  reject(() => mutate(state, lineAction(state, 'stage', { status: 'ready' }), t1), 'INVALID');
});
test('Không cập nhật lại trạng thái dùng số lượng cũ', () => {
  const state = open();
  const stage = lineAction(state, 'stage', { status: 'cooking' });
  const next = mutate(state, lineAction(state, 'cancel', { qty: 1 }), t1);
  reject(() => mutate(next, stage, t1), 'CONFLICT');
});
test('Sau phục vụ bàn hiện đang phục vụ và bếp không hiện món mở', () => {
  const next = serve(open());
  assert.equal(tableStatus(next.active[3]), 'seated');
  assert.equal(kitchenQueue(next).length, 0);
  assert.equal(kitchenQueue(next, true).length, 1);
});
test('Yêu cầu tính tiền không xóa các món chưa phục vụ', () => {
  const state = bill(open());
  assert.equal(kitchenQueue(state).length, 1);
  assert.equal(tableStatus(state.active[3]), 'billing');
  reject(() => mutate(state, pay(state), t1), 'PENDING');
});
test('Đang chờ thanh toán phải mở lại mới gọi thêm', () => {
  const state = bill(open());
  reject(() => mutate(state, add([dish('tra-da')]), t1), 'BILLING');
  const reopened = mutate(state, onTable('billing', { expectedBilling: true, billing: false }), t1);
  assert.equal(kitchenQueue(mutate(reopened, add([dish('tra-da')]), t2)).length, 2);
});
test('Tính tiền sau ba lượt và đóng bàn sau khi thu tiền', () => {
  let state = open([dish('tai', 2), dish('bo-kho')]);
  state = mutate(state, add([dish('tra-da', 2)]), t1);
  state = mutate(state, add([dish('goi-cuon')]), t2);
  state = bill(serve(state));
  const done = mutate(state, pay(state, { method: 'transfer' }), t2);
  assert.equal(done.active[3], undefined);
  assert.equal(done.receipts[0].total, 214000);
  assert.equal(done.receipts[0].method, 'transfer');
});
test('Không tự mở lại một lượt khách đã thanh toán', () => {
  const state = bill(serve(open()));
  const done = mutate(state, pay(state), t2);
  reject(() => mutate(done, add([dish('tra-da')]), t2), 'SESSION');
  const fresh = mutate(done, add([dish('tra-da')], { sessionId: 'customer-next' }), t2);
  assert.equal(fresh.active[3].id, 'customer-next');
});
test('Tổng và phiên thanh toán phải đúng với bản đã xác nhận', () => {
  const state = bill(serve(open()));
  reject(() => mutate(state, pay(state, { expectedTotal: 1 }), t2), 'CONFLICT');
  reject(() => mutate(state, pay(state, { expectedSessionRev: 1 }), t2), 'CONFLICT');
});
test('Sửa giá chỉ tác động tới lượt gọi mới', () => {
  const state = open();
  const menu = state.menu.map(item => item.id === 'tai' ? { ...item, price: 70000 } : item);
  const revised = mutate(state, command('menu', { menu, expectedRev: state.rev }), t1);
  const next = mutate(revised, add([dish('tai', 1)], { explicit: true }), t2);
  assert.equal(total(next.active[3]), 180000);
});
test('Giá đổi sau màn xác nhận phải kiểm tra lại', () => {
  const state = open();
  reject(() => mutate(state, add([{ ...dish('tai'), expectedPrice: 1 }]), t1), 'MENU');
});
test('Bàn ngoài sơ đồ không thể ghi vào trạng thái', () => {
  reject(() => mutate(createState(), add(undefined, { table: 9 }), t0), 'TABLE');
});
test('Giảm số bàn giữ nguyên các bàn còn khách', () => {
  const state = open();
  reject(() => mutate(state, command('tables', { count: 2, expectedCount: 8 }), t1), 'TABLE');
  assert.equal(mutate(state, command('tables', { count: 12, expectedCount: 8 }), t1).tableCount, 12);
});
test('Hai thiết bị cố mở cùng một bàn giữ lượt khách đầu', () => {
  const state = open();
  reject(() => mutate(state, add([dish('tra-da')], { sessionId: 'parallel', device: 'other' }), t1), 'SESSION');
});
test('Khôi phục đầy đủ sau tuần tự hóa JSON', () => {
  const state = bill(serve(open()));
  const done = mutate(state, pay(state), t2);
  assert.deepEqual(validateSnapshot(JSON.parse(JSON.stringify(done))), done);
});
test('Từ chối sao lưu sai số tiền và phiên bản', () => {
  const state = bill(serve(open()));
  const done = mutate(state, pay(state), t2);
  reject(() => validateSnapshot({ ...done, version: 0 }), 'BACKUP');
  done.receipts[0].total = 1;
  reject(() => validateSnapshot(done), 'BACKUP');
});
const config = { id: 'remote', url: 'https://example.com' };
const documentOf = (state, connected = true) => ({ snapshot: state, config: connected ? config : null, pending: [], failure: null });
test('Ngoại tuyến ở chế độ cục bộ vẫn ghi bền vững', () => {
  const next = submitDocument(documentOf(createState(), false), add(), t0, false);
  assert.equal(next.pending.length, 0);
  assert.equal(total(next.snapshot.active[3]), 110000);
});
test('Ngoại tuyến khi kết nối giữ hàng đợi qua tải lại', () => {
  const initial = documentOf(open());
  const next = submitDocument(initial, add([dish('tra-da')]), t1, false);
  assert.equal(next.snapshot, initial.snapshot);
  assert.equal(next.pending.length, 1);
  assert.equal(total(visible(JSON.parse(JSON.stringify(next))).active[3]), 115000);
});
test('Từ chối thu tiền ngoại tuyến khi dùng chung dữ liệu', () => {
  const state = bill(serve(open()));
  reject(() => submitDocument(documentOf(state), pay(state), t1, false), 'SYNC');
});
test('Chỉ đóng bàn sau khi máy chủ xác nhận thanh toán', () => {
  const state = bill(serve(open()));
  const request = pay(state);
  const pending = submitDocument(documentOf(state), request, t1);
  assert.equal(visible(pending).active[3].billing, true);
  const next = reconcile(pending, config, { state: mutate(state, request, t1) }, request, false);
  assert.equal(next.pending.length, 0);
  assert.equal(visible(next).active[3], undefined);
});
test('Trả lỗi đồng bộ giữ lệnh để xem lại và có thể bỏ', () => {
  const state = open();
  const request = add([dish('tra-da')]);
  const pending = submitDocument(documentOf(state), request, t1);
  const failed = reconcile(pending, config, { state, code: 'SESSION', message: 'Phiên cũ' }, request, true);
  assert.equal(failed.failure.id, request.id);
  assert.equal(visible(failed), state);
  assert.equal(resolveFailure(failed, false).pending.length, 0);
});
test('Có thể xác nhận trùng khi máy chủ gặp lượt giống từ thiết bị khác', () => {
  const state = open();
  const request = add([dish('tra-da')]);
  const pending = submitDocument(documentOf(state), request, t1);
  const remote = mutate(state, add([dish('tra-da')], { device: 'other' }), t1);
  const failed = reconcile(pending, config, { state: remote, code: 'DUPLICATE', message: 'Xác nhận lại' }, request, true);
  const confirmed = resolveFailure(failed, true);
  assert.equal(confirmed.pending[0].action.repeatConfirmed, true);
  assert.equal(confirmed.pending[0].action.id, request.id);
});
test('Bỏ phản hồi thuộc kết nối đã ngắt', () => {
  const local = documentOf(createState(), false);
  assert.equal(reconcile(local, config, { state: open() }), local);
});
test('Địa chỉ API công khai phải có HTTPS và không chấp nhận thông tin đăng nhập trong URL', () => {
  assert.equal(normalizeEndpoint('https://example.com/path/'), 'https://example.com/path');
  assert.equal(normalizeEndpoint('http://localhost:8787'), 'http://localhost:8787');
  assert.throws(() => normalizeEndpoint('http://example.com'));
  assert.throws(() => normalizeEndpoint('https://user@example.com'));
});

test('Gộp đúng tổng phở theo loại, gắn ghi chú và sửa trà đá mà giữ thứ tự', () => {
  for (const text of [
    'Bàn năm hai phở bò, một tái một chín, à thôi tô chín không hành, thêm hai trà đá. À trà đá một thôi.',
    'Bàn 5 hai phở bò, một tái một chín. Tô chín không hành. Hai trà đá, à một thôi.',
  ]) {
    const state = createState();
    const draft = parse(text, state);
    assert.equal(draft.table, 5);
    assert.equal(draft.intent, 'add');
    assert.deepEqual(draft.items, [dish('tai'), dish('chin', 1, 'không hành'), dish('tra-da')]);
    assert.equal(validDraft(draft, state), true);
    const request = add(draft.items, { table: 5, sessionId: 'test-table-5' });
    const saved = mutate(state, request, t0);
    assert.deepEqual(kitchenQueue(saved).map(({ dishId, qty, note }) => ({ id: dishId, qty, note })), draft.items);
    assert.equal(mutate(saved, request, t1), saved);
  }
});

test('Tách ghi chú cho đúng một tô trong câu gọi thêm', () => {
  const draft = parse('Bàn 5 thêm hai phở tái, một tô không hành', createState());
  assert.equal(draft.explicit, true);
  assert.deepEqual(draft.items, [dish('tai'), dish('tai', 1, 'không hành')]);
});

test('Câu phân loại phở thiếu số tô phải hỏi lại', () => {
  assert.equal(parse('Bàn 5 ba phở bò một tái một chín', createState()).intent, 'clarify');
});

test('Bản sao menu cũ thiếu phở chín phải yêu cầu làm rõ', () => {
  const state = createState();
  state.menu = state.menu.filter(item => item.id !== 'chin');
  assert.equal(parse('Bàn 5 hai phở bò một tái một chín', state).intent, 'clarify');
});

test('Chỉ sửa số lượng khi xác định đúng dòng món tham chiếu', () => {
  const draft = parse('Bàn 5 một trà đá hai phở tái một trà đá à trà đá ba thôi', createState());
  assert.equal(draft.intent, 'clarify');
});

test('Hỏi lại đúng các loại phở đang chờ nấu và hiểu cách nói đổi sang', () => {
  const state = mutate(createState(), add([dish('tai'), dish('chin')], { table: 5 }), t0);
  const incomplete = parse('Bàn 5 đổi một phở bò', state);
  assert.equal(incomplete.intent, 'clarify');
  assert.match(incomplete.question, /Phở tái hay Phở bò chín/);
  assert.equal(parse('Bàn 5 đổi một tái sang nạm', state).replacement, 'nam');
});


test('Sửa số lượng và ghi chú tại dòng hiện tại, giữ thứ tự bếp và không ghi lặp', () => {
  const state = open([dish('tai', 2), dish('bo-kho')]);
  const first = kitchenQueue(state)[0];
  const update = lineAction(state, 'amend', { qty: 3, expectedNote: '', note: 'ít hành' });
  const changed = mutate(state, update, t1);
  const lines = kitchenQueue(changed);
  assert.equal(lines.length, 2);
  assert.deepEqual([lines[0].id, lines[0].sequence, lines[0].qty, lines[0].note], [first.id, first.sequence, 3, 'ít hành']);
  assert.equal(lines[1].dishId, 'bo-kho');
  assert.equal(mutate(changed, update, t2), changed);
  assert.equal(validateSnapshot(changed), changed);
});

test('Sửa ghi chú không được ghi đè ghi chú vừa sửa từ thiết bị khác', () => {
  const state = open();
  const changed = mutate(state, lineAction(state, 'amend', { expectedNote: '', note: 'ít hành' }), t1);
  reject(() => mutate(changed, lineAction(changed, 'amend', { expectedNote: '', note: 'không hành' }), t2), 'CONFLICT');
});

test('Số bàn hai chữ số có thật không bị tách khi nhận giọng nói', () => {
  const state = createState();
  state.tableCount = 40;
  const draft = parse('Bàn số 32 hai tô phở', state);
  assert.equal(draft.table, 32);
  assert.deepEqual(draft.items, [dish('tai', 2)]);
  assert.equal(parse('Bàn số 32 tô phở', state).intent, 'clarify');
});

test('Phở mặc định tôn trọng biệt danh, món tạm hết và tên đã đổi trong thực đơn cũ', () => {
  const state = createState();
  const rare = state.menu.find(item => item.id === 'tai');
  const brisket = state.menu.find(item => item.id === 'nam');
  rare.active = false;
  assert.equal(parse('2 tô phở bàn 3', state).intent, 'clarify');
  rare.active = true;
  rare.name = 'Mì xào';
  assert.equal(parse('2 tô phở bàn 3', state).intent, 'clarify');
  rare.name = 'Phở tái';
  brisket.aliases.push('phở');
  assert.deepEqual(parse('2 tô phở bàn 3', state).items, [dish('nam', 2)]);
  brisket.active = false;
  assert.equal(parse('2 tô phở bàn 3', state).intent, 'clarify');
});
