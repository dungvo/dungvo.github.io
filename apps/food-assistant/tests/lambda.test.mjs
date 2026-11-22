import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFoodServer } from '../server/api.mjs';
import { lambdaHttp } from '../server/lambda-http.mjs';

const token = 'lambda-test-only-secret-1234';
const origin = 'https://pilot.example.com';
const event = (method, rawPath, headers = {}, body, isBase64Encoded = false) => ({
  rawPath, headers, body, isBase64Encoded, requestContext: { http: { method } },
});

test('Lambda Function URL nhận CORS, xác thực, JSON và gửi lại lệnh đúng một lần', async () => {
  const api = createFoodServer({ file: ':memory:', token, allowedOrigins: [origin], pollIntervalMs: 6000 });
  const handler = lambdaHttp(api.listeners('request')[0]);
  try {
    const preflight = await handler(event('OPTIONS', '/api/command', { origin }));
    assert.equal(preflight.statusCode, 204);
    assert.equal(preflight.headers['access-control-allow-origin'], origin);
    assert.equal((await handler(event('GET', '/', {}))).statusCode, 404);
    assert.equal((await handler(event('GET', '/api/state', { Origin: origin }))).statusCode, 401);
    const headers = { Authorization: 'Bearer ' + token, origin, 'idempotency-key': 'lambda-round-1', 'content-type': 'application/json' };
    const raw = JSON.stringify({ id: 'lambda-round-1', device: 'ios-example', type: 'add', table: 3, sessionId: 'session-3', open: true,
      items: [{ id: 'tai', qty: 2 }] });
    const first = await handler(event('POST', '/api/command', headers, raw));
    const retry = await handler(event('POST', '/api/command', headers, raw));
    assert.equal(first.statusCode, 200);
    assert.equal(retry.statusCode, 200);
    assert.equal(JSON.parse(retry.body).state.rev, 1);
    assert.equal(JSON.parse(first.body).pollIntervalMs, 6000);
  } finally { api.close(); }
});

test('Lambda chuyển payload audio base64 về bytes cho adapter giọng nói', async () => {
  const api = createFoodServer({ file: ':memory:', token, aiKey: 'mock', allowTranscription: true,
    transcribe: async (key, audio) => {
      assert.deepEqual(Buffer.from(await audio.arrayBuffer()), Buffer.from('1a45dfa301020304', 'hex'));
      return 'Bàn 3 hai phở';
    } });
  try {
    const handler = lambdaHttp(api.listeners('request')[0]);
    const result = await handler(event('POST', '/api/transcribe', {
      authorization: 'Bearer ' + token, 'content-type': 'audio/webm',
    }, Buffer.from('1a45dfa301020304', 'hex').toString('base64'), true));
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { transcript: 'Bàn 3 hai phở' });
  } finally { api.close(); }
});
