import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createFoodServer, exportBackup, importBackup } from '../server/api.mjs';

const token = 'test-token-only-never-production';
const start = async (t, options = {}) => {
  const directory = await mkdtemp(join(tmpdir(), 'food-test-'));
  const file = join(directory, 'shop.sqlite');
  const server = createFoodServer({ file, token, allowedOrigins: ['https://dungvo.github.io'], ...options });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(directory, { recursive: true, force: true }); });
  return { url: 'http://127.0.0.1:' + server.address().port, file };
};
const headers = { Authorization: 'Bearer ' + token };
const add = (id, dish, values = {}) => ({
  id, device: 'station-1', type: 'add', table: 3, sessionId: 'session-a', open: true, items: [{ id: dish, qty: 1 }], ...values,
});
const request = (base, action, key = action.id) => fetch(base + '/api/command', {
  method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(action),
});
test('API phục vụ app và JavaScript với MIME hợp lệ', async t => {
  const { url } = await start(t);
  const response = await fetch(url + '/apps/food-assistant/');
  assert.match(await response.text(), /Food Assistant/);
  assert.match((await fetch(url + '/app.js')).headers.get('Content-Type'), /javascript/);
  assert.equal((await fetch(url + '/server/api.mjs')).status, 404);
});
test('API từ chối mã kết nối sai hoặc origin ngoài danh sách', async t => {
  const { url } = await start(t);
  assert.equal((await fetch(url + '/api/state')).status, 401);
  assert.equal((await fetch(url + '/api/state', { headers: { ...headers, Origin: 'https://untrusted.example' } })).status, 403);
  const allowed = await fetch(url + '/api/command', { method: 'OPTIONS', headers: { Origin: 'https://dungvo.github.io' } });
  assert.equal(allowed.status, 204);
  assert.match(allowed.headers.get('access-control-allow-headers'), /Idempotency-Key/i);
});
test('API yêu cầu header idempotency khớp mã lệnh', async t => {
  const { url } = await start(t);
  assert.equal((await request(url, add('first', 'tai'), 'other')).status, 400);
  assert.equal((await (await fetch(url + '/api/state', { headers })).json()).state.rev, 0);
});
test('Hai thiết bị gửi đồng thời trên cùng bàn đang mở giữ đủ cả hai lượt', async t => {
  const { url } = await start(t);
  assert.equal((await request(url, add('opening', 'tai'))).status, 200);
  const actions = [add('second', 'bo-kho'), add('third', 'tra-da', { device: 'station-2' })];
  const results = await Promise.all(actions.map(item => request(url, item)));
  assert.deepEqual(results.map(result => result.status), [200, 200]);
  const { state } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(state.active[3].lines.length, 3);
  assert.deepEqual(state.active[3].lines.map(line => line.sequence), [1, 2, 3]);
});
test('Hai máy đồng thời gửi cùng UUID chỉ tạo một dòng trong SQLite', async t => {
  const { url, file } = await start(t);
  const action = add('same', 'tai');
  const results = await Promise.all([request(url, action), request(url, action)]);
  assert.deepEqual(results.map(result => result.status), [200, 200]);
  assert.equal(JSON.parse(exportBackup(file)).active[3].lines.length, 1);
});
test('Hai máy mở cùng một bàn với hai phiên trả một thành công và một xung đột', async t => {
  const { url } = await start(t);
  const results = await Promise.all([request(url, add('first', 'tai')), request(url, add('second', 'tra-da', { sessionId: 'other' }))]);
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  assert.equal((await results.find(result => result.status === 409).json()).code, 'SESSION');
});
test('SQLite sao lưu, khôi phục và giữ mã thao tác để chống gửi trùng', async t => {
  const { url, file } = await start(t);
  const action = add('first', 'tai');
  await request(url, action);
  const json = exportBackup(file);
  const restoredFile = file + '-restore';
  importBackup(restoredFile, json);
  assert.deepEqual(JSON.parse(exportBackup(restoredFile)), JSON.parse(json));
  const reopened = createFoodServer({ file: restoredFile, token });
  reopened.listen(0, '127.0.0.1');
  await once(reopened, 'listening');
  t.after(() => new Promise(resolve => reopened.close(resolve)));
  const { state } = await (await request('http://127.0.0.1:' + reopened.address().port, action)).json();
  assert.equal(state.rev, 1);
});
test('AI tắt khi chưa cấu hình, không ghi đơn', async t => {
  const { url } = await start(t);
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: '{}' });
  assert.equal(response.status, 503);
});
test('AI adapter chỉ trả bản nháp đã xác thực', async t => {
  const { url } = await start(t, { aiKey: 'mock-test', interpret: async (key, model, input) => {
    assert.equal(input.selectedTable, 3);
    assert.equal(input.activeItems[0].dishId, 'tai');
    assert.equal(key, 'mock-test');
    return { table: 3, intent: 'add', items: [{ id: 'tra-da', qty: 1, note: '' }], replacement: null, explicit: true, question: '' };
  } });
  await request(url, add('first', 'tai'));
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 3, transcript: 'Cho khách thêm ly nước như hôm trước' }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).draft.items[0].id, 'tra-da');
  assert.equal((await (await fetch(url + '/api/state', { headers })).json()).state.rev, 1);
});
test('AI adapter từ chối món bịa đặt, schema không được tự ghi', async t => {
  const { url } = await start(t, { aiKey: 'mock-test', interpret: async () => ({
    table: 1, intent: 'add', items: [{ id: 'hallucination', qty: 1, note: '' }], replacement: null, explicit: false, question: '',
  }) });
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ transcript: 'Món hồi nãy' }) });
  assert.equal(response.status, 502);
  assert.equal((await (await fetch(url + '/api/state', { headers })).json()).state.rev, 0);
});
