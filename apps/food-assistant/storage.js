import { createState, mutate, OrderError, validateSnapshot } from './domain.js';

const blank = () => ({ snapshot: createState(), pending: [], config: null, failure: null, aiEnabled: false });

export function openStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('food-assistant-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('documents');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export function transact(db, edit) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', edit ? 'readwrite' : 'readonly');
    const store = tx.objectStore('documents');
    const request = store.get('shop');
    let result;
    let cause;
    tx.oncomplete = () => resolve(result);
    tx.onabort = () => reject(cause ?? tx.error);
    request.onsuccess = () => {
      try {
        result = request.result ?? blank();
        if (edit) {
          result = edit(result);
          store.put(result, 'shop');
        }
      } catch (error) {
        cause = error;
        tx.abort();
      }
    };
  });
}

export function visible(doc) {
  let state = doc.snapshot;
  for (const item of doc.pending) {
    if (item.action.type === 'pay' || item.action.id === doc.failure?.id) break;
    try { state = mutate(state, item.action, item.at); }
    catch (error) {
      if (!(error instanceof OrderError)) throw error;
      break;
    }
  }
  return state;
}

export function submitDocument(doc, action, now = new Date().toISOString(), online = true) {
  if (!doc.config) return { ...doc, snapshot: mutate(doc.snapshot, action, now) };
  if (doc.failure) throw new OrderError('SYNC', 'Xử lý lệnh đang chờ kiểm tra trong Cài đặt trước.');
  if (doc.pending.some(item => item.action.id === action.id) || Object.hasOwn(doc.snapshot.seen, action.id)) return doc;
  if (doc.pending.some(item => item.action.type === 'pay') || (action.type === 'pay' && (!online || doc.pending.length))) {
    throw new OrderError('SYNC', 'Cần kết nối và đồng bộ xong trước khi xác nhận thu tiền.');
  }
  mutate(visible(doc), action, now);
  return { ...doc, pending: [...doc.pending, { action, at: now }] };
}

export function reconcile(doc, config, payload, sent, rejected) {
  if (doc.config?.id !== config.id) return doc;
  const snapshot = payload.state.rev >= doc.snapshot.rev ? payload.state : doc.snapshot;
  const pending = doc.pending.filter(item => !Object.hasOwn(snapshot.seen, item.action.id));
  const failure = rejected && sent && pending[0]?.action.id === sent.id
    ? { id: sent.id, code: payload.code, message: payload.message }
    : pending.some(item => item.action.id === doc.failure?.id) ? doc.failure : null;
  return { ...doc, snapshot, pending, failure, aiEnabled: payload.aiEnabled ?? doc.aiEnabled };
}

export function resolveFailure(doc, repeat) {
  if (!doc.failure) return doc;
  const pending = doc.pending.filter(item => item.action.id !== doc.failure.id);
  if (repeat && doc.failure.code === 'DUPLICATE') {
    const first = doc.pending.find(item => item.action.id === doc.failure.id);
    return { ...doc, pending: [{ ...first, action: { ...first.action, repeatConfirmed: true } }, ...pending], failure: null };
  }
  return { ...doc, pending, failure: null };
}

export function normalizeEndpoint(raw, location) {
  let url;
  try { url = new URL(raw); } catch { throw new Error('Nhập địa chỉ API đầy đủ, ví dụ https://api.example.com.'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  const sameOrigin = location?.origin === url.origin;
  if (url.username || url.password || url.search || url.hash || !['https:', 'http:'].includes(url.protocol)
    || (url.protocol !== 'https:' && !local && !sameOrigin)) throw new Error('API từ trang công khai phải dùng HTTPS.');
  return url.href.replace(/\/+$/, '');
}

export async function requestAPI(config, path, input) {
  const response = await fetch(config.url + '/api/' + path, {
    method: input === undefined ? 'GET' : 'POST',
    signal: AbortSignal.timeout(path === 'interpret' ? 20000 : 6000),
    headers: { Authorization: 'Bearer ' + config.token, ...(input === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(path === 'command' ? { 'Idempotency-Key': input.id } : {}) },
    ...(input === undefined ? {} : { body: JSON.stringify(input) }),
    cache: 'no-store', credentials: 'omit', redirect: 'error',
  });
  const data = await response.json();
  if (!response.ok && response.status !== 409) throw new Error(data.message ?? 'Không kết nối được máy đồng bộ.');
  if (path !== 'interpret') validateSnapshot(data.state);
  return { data, rejected: response.status === 409 };
}
