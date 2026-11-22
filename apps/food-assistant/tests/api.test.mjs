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
  assert.deepEqual(await (await fetch(url + '/api/health')).json(), { status: 'ok' });
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

const webm = Buffer.from('1a45dfa301020304', 'hex');
const mp4 = Buffer.from('000000186674797069736f6d', 'hex');
const ogg = Buffer.from('4f67675300010203', 'hex');
const sendClip = (url, bytes, contentType = 'audio/webm', authorization = headers) => fetch(url + '/api/transcribe', {
  method: 'POST', headers: { ...authorization, 'Content-Type': contentType }, body: bytes,
});

test('Kết nối công bố khả năng nhận giọng nói riêng, mặc định tắt khi chỉ có khóa', async t => {
  const { url } = await start(t, { aiKey: 'test-key' });
  const { aiEnabled, transcriptionEnabled } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(aiEnabled, true);
  assert.equal(transcriptionEnabled, false);
  assert.equal((await sendClip(url, webm)).status, 503);
});

test('Bật thu âm nhưng thiếu khóa vẫn tắt khả năng chuyển giọng nói', async t => {
  const { url } = await start(t, { allowTranscription: true });
  assert.equal((await (await fetch(url + '/api/state', { headers })).json()).transcriptionEnabled, false);
  assert.equal((await sendClip(url, webm)).status, 503);
});

for (const [type, data] of [['audio/webm;codecs=opus', webm], ['audio/mp4', mp4], ['audio/ogg', ogg]]) {
  test('Nhận bản thu ' + type + ' và chỉ trả về văn bản', async t => {
    const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: async (key, audio, signal) => {
      assert.equal(key, 'test-key');
      assert.equal(audio.type, type.split(';')[0]);
      assert.deepEqual(Buffer.from(await audio.arrayBuffer()), data);
      assert.equal(signal.aborted, false);
      return '  Bàn 4 hai phở tái  ';
    } });
    const response = await sendClip(url, data, type);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { transcript: 'Bàn 4 hai phở tái' });
    const doc = await (await fetch(url + '/api/state', { headers })).json();
    assert.equal(doc.state.rev, 0);
    assert.equal(doc.transcriptionEnabled, true);
  });
}

test('Audio endpoint kiểm tra quyền, loại tệp, header và dung lượng trước khi gọi AI', async t => {
  const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: () => {
    assert.fail('invalid clips must not reach the provider');
  } });
  assert.equal((await sendClip(url, webm, 'audio/webm', {})).status, 401);
  assert.equal((await sendClip(url, webm, 'text/plain')).status, 415);
  assert.equal((await sendClip(url, mp4, 'audio/webm')).status, 400);
  assert.equal((await sendClip(url, Buffer.alloc(0))).status, 400);
  const large = Buffer.alloc(2 * 1024 * 1024 + 1);
  assert.equal((await sendClip(url, large)).status, 413);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(large); controller.close(); } });
  const response = await fetch(url + '/api/transcribe', {
    method: 'POST', headers: { ...headers, 'Content-Type': 'audio/webm' }, body: stream, duplex: 'half',
  });
  assert.equal(response.status, 413);
});

test('Phản hồi transcript trống hoặc quá dài yêu cầu nói lại', async t => {
  let result = ' ';
  const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: () => result });
  assert.equal((await sendClip(url, webm)).status, 422);
  result = 'a'.repeat(501);
  assert.equal((await sendClip(url, webm)).status, 422);
});

test('Lỗi nhà cung cấp âm thanh trả thông báo chung, không lộ khóa', async t => {
  const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: () => { throw new Error('test-key'); } });
  const response = await sendClip(url, webm);
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /test-key/);
});

test('Máy chủ giới hạn chuyển bản thu theo phút', async t => {
  let used = 0;
  const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: () => { used++; return 'Bàn 1 trà đá'; } });
  for (let i = 0; i < 12; i++) assert.equal((await sendClip(url, webm)).status, 200);
  assert.equal((await sendClip(url, webm)).status, 429);
  assert.equal(used, 12);
});

test('Yêu cầu thu tiếp theo bị chặn khi đã có ba bản đang xử lý', async t => {
  let processing = 0;
  let release;
  let reached;
  const active = new Promise(resolve => { reached = resolve; });
  const pending = new Promise(resolve => { release = resolve; });
  const { url } = await start(t, { aiKey: 'test-key', allowTranscription: true, transcribe: async () => {
    if (++processing === 3) reached();
    await pending;
    return 'Bàn 1 trà đá';
  } });
  const requests = [sendClip(url, webm), sendClip(url, webm), sendClip(url, webm)];
  await active;
  try { assert.equal((await sendClip(url, webm)).status, 429); }
  finally { release(); }
  assert.deepEqual((await Promise.all(requests)).map(response => response.status), [200, 200, 200]);
});

test('AI không được đổi bàn đã nói thành bàn đang chọn hoặc bàn khác', async t => {
  let requested;
  const { url } = await start(t, { aiKey: 'test-key', interpret: async (key, model, input) => {
    requested = input;
    return { table: 2, intent: 'add', items: [{ id: 'tai', qty: 1, note: '' }], replacement: null, explicit: false, question: '' };
  } });
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 2, transcript: 'Bàn 5 một tái giúp tôi' }) });
  assert.equal(response.status, 502);
  assert.equal(requested.selectedTable, 2);
  assert.equal((await (await fetch(url + '/api/state', { headers })).json()).state.rev, 0);
});

test('Hạn mức dùng chung qua hai kết nối SQLite và chặn lượt gọi mới trước chi phí', async t => {
  let providerCalls = 0;
  const options = { aiKey: 'test-key', allowTranscription: true, budget: { limit: 30, warning: 20 },
    transcribe: () => { providerCalls++; return 'Bàn 1 trà đá'; } };
  const { url, file } = await start(t, options);
  const second = createFoodServer({ ...options, token, file });
  second.listen(0, '127.0.0.1');
  await once(second, 'listening');
  t.after(() => new Promise(resolve => second.close(resolve)));
  const otherUrl = 'http://127.0.0.1:' + second.address().port;
  const results = await Promise.all([sendClip(url, webm), sendClip(otherUrl, webm)]);
  assert.deepEqual(results.map(response => response.status).sort(), [200, 429]);
  assert.equal(providerCalls, 1);
  const { aiUsage, state } = await (await fetch(otherUrl + '/api/state', { headers })).json();
  assert.equal(aiUsage.used, 30);
  assert.equal(aiUsage.atWarning, true);
  assert.equal(aiUsage.audioCalls, 1);
  assert.equal(state.rev, 0);
  const blockedText = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 1, transcript: 'một món' }) });
  assert.equal(blockedText.status, 429);
  assert.match((await blockedText.json()).message, /hạn mức/);
  assert.equal((await request(url, add('without-ai', 'tai'))).status, 200);
});

test('Đối chiếu chi phí văn bản theo số token trả về', async t => {
  const { url } = await start(t, { aiKey: 'test-key', interpret: () => ({
    draft: { table: 5, intent: 'add', items: [{ id: 'tai', qty: 1, note: '' }], replacement: null, explicit: false, question: '' },
    usage: { input_tokens: 100, output_tokens: 50 },
  }) });
  const result = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 5, transcript: 'một tô tái' }) });
  assert.equal(result.status, 200);
  const { aiUsage } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(aiUsage.textCalls, 1);
  assert.equal(aiUsage.used, 4);
});

test('API không chuyển nhiều bàn cho AI và không tiêu ngân sách', async t => {
  const { url } = await start(t, { aiKey: 'test-key', interpret: () => assert.fail('must not reach provider') });
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ transcript: 'Bàn 5 tái bàn 3 nạm' }) });
  assert.equal(response.status, 400);
  const { aiUsage } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(aiUsage.used, 0);
});

test('Groq chọn JSON Schema, chuẩn hóa token và kiểm tra bản nháp trước khi trả về', async t => {
  let sent = 0;
  const { url } = await start(t, { aiKey: 'fake-groq-key', provider: 'groq', providerFetch: async (target, options) => {
    sent++;
    assert.equal(target, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer fake-groq-key');
    const json = JSON.parse(options.body);
    assert.equal(json.model, 'openai/gpt-oss-20b');
    assert.equal(json.response_format.json_schema.strict, true);
    assert.equal(json.response_format.json_schema.schema.additionalProperties, false);
    assert.match(json.messages[1].content, /trà đá/);
    return Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({
      intent: 'add', table: 5, items: [{ id: 'tra-da', qty: 1, note: '' }], replacement: null, explicit: false, question: '',
    }) } }], usage: { prompt_tokens: 100, completion_tokens: 50 } });
  } });
  const result = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 5, transcript: 'một trà đá' }) });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).draft.items[0].id, 'tra-da');
  assert.equal(sent, 1);
  const { state, aiUsage, aiProvider } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(aiProvider, 'groq');
  assert.equal(aiUsage.provider, 'groq');
  assert.equal(aiUsage.textCalls, 1);
  assert.equal(aiUsage.used, 1);
  assert.equal(state.rev, 0);
});

test('Groq chuyển giọng nói qua multipart tiếng Việt và dự toán tối thiểu 10 giây', async t => {
  const { url } = await start(t, { aiKey: 'fake-groq-key', provider: 'groq', allowTranscription: true,
    prepareAudio: async () => ({ audio: new Blob(['RIFF'], { type: 'audio/wav' }), milliseconds: 3500 }),
    providerFetch: async (target, options) => {
      assert.equal(target, 'https://api.groq.com/openai/v1/audio/transcriptions');
      assert.equal(options.headers.Authorization, 'Bearer fake-groq-key');
      assert.equal(options.body.get('language'), 'vi');
      assert.equal(options.body.get('model'), 'whisper-large-v3-turbo');
      const audio = options.body.get('file');
      assert.equal(audio.type, 'audio/wav');
      assert.equal(audio.name, 'cau-goi-mon.wav');
      return Response.json({ text: 'Bàn năm hai phở tái' });
    } });
  const response = await sendClip(url, webm);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { transcript: 'Bàn năm hai phở tái' });
  const { aiUsage, state } = await (await fetch(url + '/api/state', { headers })).json();
  assert.equal(aiUsage.used, 3);
  assert.equal(aiUsage.audioCalls, 1);
  assert.equal(state.rev, 0);
});

test('Groq hết hạn mức trả lỗi rõ và đặt món tay vẫn hoạt động', async t => {
  let calls = 0;
  const { url } = await start(t, { aiKey: 'fake-groq-key', provider: 'groq', providerFetch: async target => {
    calls++;
    assert.ok(target.startsWith('https://api.groq.com/'));
    return Response.json({ error: { message: 'fake-groq-key should never appear' } }, { status: 429 });
  } });
  const response = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 5, transcript: 'một trà đá' }) });
  assert.equal(response.status, 429);
  const data = await response.json();
  assert.match(data.message, /giới hạn lượt sử dụng/);
  assert.doesNotMatch(data.message, /fake-groq-key/);
  assert.equal(calls, 1);
  assert.equal((await request(url, add('using-menu', 'tai'))).status, 200);
});

test('Groq trả lỗi xác thực an toàn và không tự chuyển sang một API khác', async t => {
  let calls = 0;
  const { url } = await start(t, { aiKey: 'fake-groq-key', provider: 'groq', providerFetch: async target => {
    calls++;
    assert.ok(target.startsWith('https://api.groq.com/'));
    return Response.json({ error: { message: 'fake-groq-key should never appear' } }, { status: 401 });
  } });
  const result = await fetch(url + '/api/interpret', { method: 'POST', headers, body: JSON.stringify({ table: 5, transcript: 'một trà đá' }) });
  assert.equal(result.status, 503);
  assert.match((await result.json()).message, /Kiểm tra khóa/);
  assert.equal(calls, 1);
});
