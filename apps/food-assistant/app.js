import { kitchenQueue, OrderError, total, validateSnapshot } from './domain.js';
import { parse, validDraft } from './language.js';
import { categories, fold, money, photos, stages, stageNames } from './menu.js';
import { normalizeEndpoint, openStore, reconcile, requestAPI, resolveFailure, submitDocument, transact, visible } from './storage.js';
import { esc, navigation, pad, page, receiptDetails } from './view.js';
import { icon } from './icons.js';
import { canRecordAudio, captureAudio } from './voice.js';

const content = document.querySelector('#content');
const dialog = document.querySelector('#dialog');
const toastBox = document.querySelector('#toast');
const ui = { page: 'tables', table: null, cart: [], cartSession: undefined, search: '', category: 'Tất cả', kitchenFilter: 'open' };
let db;
let doc;
let state;
let reachable = false;
let syncRun;
let mic;
let cloudMic;
let toastTimer;
let panelRevision = 0;
let device;

function toast(message, next) {
  clearTimeout(toastTimer);
  toastBox.replaceChildren(document.createTextNode(message));
  if (next) {
    const button = document.createElement('button');
    button.textContent = 'Hoàn tác';
    button.addEventListener('click', () => {
      button.disabled = true;
      next().catch(showError);
    }, { once: true });
    toastBox.append(button);
  }
  toastBox.classList.add('show');
  toastTimer = setTimeout(() => toastBox.classList.remove('show'), next ? 10000 : 4200);
}
function showError(error) {
  const message = error?.message ?? 'Thao tác chưa hoàn tất.';
  if (!dialog.open) { toast(message); return; }
  const alert = dialog.querySelector('#dialog-error');
  if (alert) { alert.hidden = false; alert.textContent = message; }
}
const status = () => !doc.config ? 'local' : doc.failure ? 'blocked' : !navigator.onLine || !reachable ? 'offline' : doc.pending.length ? 'pending' : 'ready';

function render(navOnly = false) {
  state = visible(doc);
  if (ui.table > state.tableCount) { ui.table = null; ui.cart = []; ui.cartSession = undefined; }
  const nav = navigation(ui.page, kitchenQueue(state).length, status());
  for (const [selector, html] of [['.sidebar', nav.side], ['.topbar', nav.top], ['#mobile-nav', nav.mobile]]) {
    const element = document.querySelector(selector);
    if (element.dataset.rendered !== html) {
      element.innerHTML = html;
      element.dataset.rendered = html;
    }
  }
  if (!navOnly) content.innerHTML = page(state, ui, doc);
}

function refresh(next, force = false) {
  const changed = next.snapshot.rev !== doc?.snapshot.rev || next.config?.id !== doc?.config?.id
    || next.aiEnabled !== doc?.aiEnabled || next.transcriptionEnabled !== doc?.transcriptionEnabled
    || next.config?.allowAI !== doc?.config?.allowAI || next.config?.allowAudio !== doc?.config?.allowAudio
    || JSON.stringify(next.pending) !== JSON.stringify(doc?.pending)
    || next.failure?.id !== doc?.failure?.id;
  if (cloudMic && (next.config?.id !== doc?.config?.id || !next.config?.allowAudio || !next.transcriptionEnabled)) cloudMic.abort();
  doc = next;
  const input = document.activeElement;
  const typing = content.contains(input) && input.matches('input, textarea, select');
  render(!force && (!changed || typing));
}

const channel = 'BroadcastChannel' in window ? new BroadcastChannel('food-assistant-store-v1') : null;
async function save(edit) {
  const next = await transact(db, edit);
  refresh(next, true);
  channel?.postMessage('updated');
  return next;
}

async function sync() {
  if (!doc?.config || !navigator.onLine) return;
  if (syncRun) return syncRun;
  syncRun = (async () => {
    try {
      const initial = await transact(db);
      const config = initial.config;
      if (!config) return;
      let next = initial;
      const limit = 32;
      for (let i = 0; i < limit; i++) {
        const item = next.failure ? null : next.pending[0];
        const { data, rejected } = await requestAPI(config, item ? 'command' : 'state', item?.action);
        if (data.state.rev < next.snapshot.rev && !rejected && !item) throw new Error('Máy chủ có bản dữ liệu cũ hơn. Kiểm tra bản sao lưu trước khi tiếp tục.');
        reachable = true;
        const changed = data.state.rev !== next.snapshot.rev || item
          || ['aiEnabled', 'transcriptionEnabled'].some(field => data[field] !== undefined && data[field] !== next[field]);
        if (changed) {
          next = await transact(db, current => reconcile(current, config, data, item?.action, rejected));
          channel?.postMessage('updated');
        } else next = await transact(db);
        refresh(next);
        if (next.config?.id !== config.id || !next.pending.length || next.failure) break;
      }
    } catch (error) {
      reachable = false;
      render(true);
      throw error;
    } finally { syncRun = null; }
  })();
  return syncRun;
}
const backgroundSync = () => sync().catch(() => {});
const action = (type, extra = {}) => ({ id: crypto.randomUUID(), device, type, ...extra });
const bound = (session, extra = {}) => ({ table: session.table, sessionId: session.id, ...extra });
const lineGuard = line => ({ lineId: line.id, expectedQty: line.qty, expectedStatus: line.status });

async function commit(command) {
  const result = await save(current => submitDocument(current, command, new Date().toISOString(), navigator.onLine && reachable));
  if (result.config) {
    if (command.type === 'pay') {
      try { await sync(); } catch { /* The durable outbox retries with the same id. */ }
      const saved = await transact(db);
      refresh(saved);
      if (saved.failure?.id === command.id) throw new OrderError(saved.failure.code, saved.failure.message);
      return Object.hasOwn(saved.snapshot.seen, command.id);
    }
    void backgroundSync();
  }
  return true;
}

function stopVoice() {
  if (mic) { mic.abort(); mic = null; }
  if (cloudMic) { cloudMic.abort(); cloudMic = null; }
}

function openPanel(title, html, closeLabel = 'Đóng') {
  panelRevision++;
  stopVoice();
  dialog.innerHTML = '<div class="dialog-shell"><header><h2 id="dialog-title">' + esc(title)
    + '</h2><button type="button" class="icon-button" data-action="close" aria-label="' + esc(closeLabel) + '">' + icon('close') + '</button></header>'
    + '<p id="dialog-error" class="notice" role="alert" hidden></p>' + html + '</div>';
  if (!dialog.open) dialog.showModal();
}
function closePanel() {
  panelRevision++;
  stopVoice();
  if (dialog.open) dialog.close();
}
function confirmPanel(title, html, label, callback) {
  openPanel(title, html + '<div class="modal-actions"><button class="btn outline" data-action="close">Quay lại</button>'
    + '<button id="confirm" class="btn primary">' + esc(label) + '</button></div>');
  dialog.querySelector('#confirm').addEventListener('click', event => {
    event.currentTarget.disabled = true;
    const button = event.currentTarget;
    Promise.resolve().then(callback).catch(error => { showError(error); if (button.isConnected) button.disabled = false; });
  });
}

function go(destination, table = ui.table) {
  if (ui.table !== table) {
    if (ui.cart.length) { toast('Giỏ của bàn hiện tại chưa gửi. Gửi bếp hoặc xóa từng món trước khi đổi bàn.'); return false; }
    ui.table = table;
    ui.cartSession = undefined;
  }
  if (destination === 'order' && !ui.table) ui.table = null;
  ui.page = destination;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  return true;
}

function cartChange(dish, change) {
  if (!ui.table || state.active[ui.table]?.billing) return;
  if (!ui.cart.length) ui.cartSession = state.active[ui.table]?.id ?? null;
  const item = ui.cart.find(entry => entry.id === dish);
  if (item) item.qty = Math.min(item.qty + change, 99);
  else if (change > 0 && ui.cart.length < 24) ui.cart.push({ id: dish, qty: 1, note: '' });
  ui.cart = ui.cart.filter(entry => entry.qty);
  render();
}

function createAdd(table, items, explicit) {
  const session = state.active[table];
  return action('add', { table, sessionId: session?.id ?? crypto.randomUUID(), open: !session, explicit, items: items.map(item => ({
    ...item, expectedPrice: state.menu.find(dish => dish.id === item.id)?.price,
  })) });
}
async function sendAdd(command, done) {
  const saveAdd = async next => {
    await commit(next);
    closePanel();
    done();
    toast(doc.config ? 'Đã lưu lượt gọi. Xem trạng thái đồng bộ trên thanh trên.' : 'Đã gửi lượt gọi vào màn bếp.', async () => {
      await commit(action('undo', { table: next.table, sessionId: next.sessionId, targetId: next.id }));
      toast('Đã hoàn tác lượt gọi.');
    });
  };
  try { await saveAdd(command); }
  catch (error) {
    if (error.code !== 'DUPLICATE') throw error;
    confirmPanel('Xác nhận gọi thêm', '<p class="notice">' + esc(error.message) + '</p>' + draftLines(command.items),
      'Gọi thêm một lượt', () => saveAdd({ ...command, repeatConfirmed: true }));
  }
}

function draftLines(items) {
  return '<ul class="line-list bill-lines">' + items.map(item => {
    const dish = state.menu.find(entry => entry.id === item.id);
    return '<li><span><strong>' + item.qty + '× ' + esc(dish?.name ?? item.id) + '</strong>'
      + (item.note ? '<small>' + esc(item.note) + '</small>' : '') + '</span>' + (dish ? '<strong>' + money(item.qty * dish.price) + '</strong>' : '') + '</li>';
  }).join('') + '</ul>';
}

function promptVoice(start) {
  const tableAtStart = ui.table;
  const sessionsAtStart = Object.fromEntries(Object.entries(state.active).map(([n, item]) => [n, item.id]));
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const cloudAvailable = doc.config?.allowAudio && doc.transcriptionEnabled && canRecordAudio();
  const speechHint = SpeechRecognition ? 'Chạm micro rồi nói bằng tiếng Việt.'
    : cloudAvailable ? 'Chọn thu âm qua máy chủ hoặc nhập câu gọi.'
      : 'Trình duyệt này chưa nhận giọng nói. Bạn có thể nhập câu lệnh.';
  openPanel('Trợ lý gọi món', '<div class="voice-box"><button id="record" class="record" aria-label="Bắt đầu nói"'
    + (SpeechRecognition ? '' : ' disabled') + '>' + icon('mic', 28)
    + '</button><p id="speech-status" role="status">' + speechHint + '</p>'
    + (cloudAvailable ? '<button id="record-api" class="btn outline" type="button">Thu âm qua máy chủ</button>' : '')
    + '</div><form id="utterance" class="form-stack"><label class="field">Câu gọi món<textarea id="transcript" name="transcript" maxlength="500" required rows="2" placeholder="Bàn 3 hai phở tái một bò kho"></textarea></label>'
    + '<button class="btn primary full" type="submit">Kiểm tra câu gọi' + icon('arrow', 17) + '</button></form>'
    + '<div class="example-buttons">' + (ui.page === 'kitchen'
      ? ['Bếp còn bao nhiêu tô?', 'Món nào cần nấu trước?']
      : ['Bàn 3 hai phở tái một bò kho', 'Bàn 3 thêm hai trà đá', 'Bàn 3 còn món gì chưa ra?'])
      .map(example => '<button type="button" class="example" data-example="' + esc(example) + '">' + esc(example) + '</button>').join('') + '</div>');
  const serial = panelRevision;
  const field = dialog.querySelector('#transcript');
  const record = dialog.querySelector('#record');
  const apiRecord = dialog.querySelector('#record-api');
  const feedback = dialog.querySelector('#speech-status');
  const form = dialog.querySelector('#utterance');
  let interpreting = false;
  async function review() {
    if (interpreting || !field.value.trim() || serial !== panelRevision) return;
    if (mic || cloudMic) { feedback.textContent = 'Dừng thu âm trước khi kiểm tra câu gọi.'; return; }
    interpreting = true;
    const transcript = field.value.trim();
    let draft = parse(transcript, state, tableAtStart);
    let source = 'Đã nhận diện câu gọi';
    if (draft.intent === 'clarify' && doc.config?.allowAI && doc.aiEnabled && reachable && navigator.onLine) {
      feedback.textContent = 'Đang kiểm tra câu này với AI…';
      try {
        const { data } = await requestAPI(doc.config, 'interpret', { transcript, table: draft.table ?? tableAtStart });
        if (validDraft(data.draft, state)) { draft = data.draft; source = 'AI đề xuất'; }
      } catch (error) {
        if (serial === panelRevision) feedback.textContent = error.message;
      }
    }
    interpreting = false;
    if (serial !== panelRevision) return;
    if (!validDraft(draft, state) || draft.intent === 'clarify') {
      feedback.textContent = draft.question || 'Chưa hiểu chắc câu này. Hãy nói lại hoặc chạm món.';
      field.focus();
      return;
    }
    if (draft.table && (state.active[draft.table]?.id ?? null) !== (sessionsAtStart[draft.table] ?? null)) {
      feedback.textContent = 'Lượt khách đã thay đổi. Đóng cửa sổ và mở lại để kiểm tra bàn.';
      return;
    }
    handleDraft(draft, source);
  }
  form.addEventListener('submit', event => { event.preventDefault(); void review().catch(showError); });
  function recordSpeech() {
    if (!SpeechRecognition) { if (!cloudAvailable) field.focus(); return; }
    if (cloudMic || interpreting) return;
    if (!navigator.onLine) { feedback.textContent = 'Thiết bị đang ngoại tuyến. Hãy gõ câu hoặc chạm món.'; return; }
    if (mic) { mic.stop(); return; }
    try {
      const recognition = new SpeechRecognition();
      let finalText = '';
      let speechError = '';
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = event => {
        if (serial !== panelRevision) return;
        let live = '';
        finalText = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) finalText += event.results[i][0].transcript + ' ';
          else live += event.results[i][0].transcript;
        }
        field.value = (finalText + live).trim().slice(0, 500);
      };
      recognition.onerror = event => {
        if (serial !== panelRevision) return;
        speechError = ['not-allowed', 'service-not-allowed'].includes(event.error)
          ? 'Micro hoặc dịch vụ nhận giọng nói chưa được cấp quyền. Bạn có thể nhập câu.'
          : 'Chưa nhận được giọng nói. Thử lại hoặc nhập câu gọi món.';
        feedback.textContent = speechError + (cloudAvailable ? ' Có thể thử nút Thu âm qua máy chủ.' : '');
      };
      recognition.onend = () => {
        if (mic === recognition) mic = null;
        if (serial !== panelRevision) return;
        record.classList.remove('listening');
        record.setAttribute('aria-label', 'Bắt đầu nói');
        if (apiRecord) apiRecord.disabled = false;
        if (speechError) return;
        feedback.textContent = finalText.trim() ? 'Đã nghe xong.' : 'Chưa nghe rõ. Chạm micro để thử lại.';
        if (finalText.trim()) void review().catch(showError);
      };
      mic = recognition;
      recognition.start();
      if (apiRecord) apiRecord.disabled = true;
      feedback.textContent = 'Đang nghe… Chạm micro lần nữa để dừng.';
      record.classList.add('listening');
      record.setAttribute('aria-label', 'Dừng nghe');
    } catch {
      mic = null;
      feedback.textContent = cloudAvailable ? 'Chưa thể mở micro trình duyệt. Hãy thử Thu âm qua máy chủ.'
        : 'Chưa thể mở micro. Bạn có thể nhập câu gọi món.';
    }
  }

  let stopRecording;
  async function recordViaServer() {
    if (cloudMic) { stopRecording?.(); return; }
    if (mic || interpreting) return;
    const config = doc.config;
    if (!navigator.onLine || !reachable || !config?.allowAudio || !doc.transcriptionEnabled) {
      feedback.textContent = 'Chưa kết nối được dịch vụ thu âm. Bạn có thể nhập câu hoặc chạm món.';
      return;
    }
    const controller = new AbortController();
    cloudMic = controller;
    field.readOnly = true;
    record.disabled = true;
    apiRecord.disabled = true;
    feedback.textContent = 'Đang mở micro…';
    try {
      const clip = await captureAudio(controller.signal, stop => {
        stopRecording = stop;
        apiRecord.disabled = false;
        apiRecord.textContent = 'Dừng và chuyển thành chữ';
        feedback.textContent = 'Đang thu âm · Tối đa 15 giây. Bản thu sẽ gửi qua máy chủ của quán.';
      });
      stopRecording = null;
      apiRecord.disabled = true;
      if (doc.config?.id !== config.id || !doc.config.allowAudio || !doc.transcriptionEnabled) {
        feedback.textContent = 'Kết nối hoặc quyền thu âm đã thay đổi. Mở lại trợ lý để thử lại.';
        return;
      }
      feedback.textContent = 'Đang chuyển bản thu thành chữ…';
      const { data } = await requestAPI(config, 'transcribe', clip, controller.signal);
      if (serial !== panelRevision || controller.signal.aborted) return;
      if (typeof data.transcript !== 'string' || !data.transcript.trim() || data.transcript.length > 500) {
        throw new Error('Máy chủ trả về câu gọi không hợp lệ. Thử lại hoặc nhập câu.');
      }
      field.value = data.transcript;
      feedback.textContent = 'Đọc lại câu vừa nhận, sửa nếu cần rồi bấm Kiểm tra câu gọi.';
    } catch (error) {
      if (serial === panelRevision) {
        feedback.textContent = controller.signal.aborted ? 'Đã dừng thu âm.'
          : error.name === 'NotAllowedError' ? 'Ứng dụng chưa được cấp quyền micro. Bạn có thể nhập câu gọi.'
            : error.name === 'TimeoutError' ? 'Máy chủ phản hồi chậm. Thử lại hoặc nhập câu gọi.'
              : error.message || 'Chưa nhận được bản thu. Thử lại hoặc nhập câu gọi.';
      }
    } finally {
      if (cloudMic === controller) cloudMic = null;
      if (serial === panelRevision) {
        stopRecording = null;
        field.readOnly = false;
        record.disabled = !SpeechRecognition;
        apiRecord.disabled = false;
        apiRecord.textContent = 'Thu âm qua máy chủ';
      }
    }
  }
  apiRecord?.addEventListener('click', recordViaServer);
  record.addEventListener('click', recordSpeech);
  if (start) recordSpeech();
  else field.focus();
}

function handleDraft(draft, source) {
  const { table, intent } = draft;
  const session = state.active[table];
  if (intent === 'select') { closePanel(); go('order', table); return; }
  if (intent === 'queue' || intent === 'pending') {
    const queue = kitchenQueue(state).filter(line => intent === 'queue' || line.table === table);
    const first = queue.find(line => line.status === 'waiting');
    openPanel(intent === 'queue' ? 'Bếp còn ' + queue.reduce((n, line) => n + line.qty, 0) + ' phần' : 'Món chưa ra · Bàn ' + pad(table),
      (first && intent === 'queue' ? '<p class="notice">Nấu trước <strong>Bàn ' + pad(first.table) + ' · ' + esc(first.name) + '</strong></p>' : '')
      + (queue.length ? '<ul class="line-list bill-lines">' + queue.map(line => '<li><strong>Bàn ' + pad(line.table) + ' · ' + line.qty
        + '× ' + esc(line.name) + '</strong><small>' + stageNames[line.status] + '</small></li>').join('') + '</ul>' : '<p>Không còn món chưa phục vụ.</p>')
      + '<button class="btn outline full" data-action="close">Xong</button>');
    return;
  }
  if (intent === 'bill') { showBill(table); return; }
  if (intent === 'add') {
    const pending = createAdd(table, draft.items, draft.explicit);
    confirmPanel('Kiểm tra lượt gọi · Bàn ' + pad(table),
      '<p class="muted">' + esc(source) + (session ? ' · Bàn đang có khách' : ' · Mở lượt khách mới') + '</p>' + draftLines(draft.items),
      'Gửi bếp', () => sendAdd(pending, () => { if (!ui.cart.length) go('order', table); }));
    return;
  }
  const requested = draft.items[0];
  const candidates = (session?.lines ?? []).filter(line => line.dishId === requested.id && line.status === 'waiting' && line.qty >= requested.qty && (!requested.note || fold(line.note) === fold(requested.note)));
  if (candidates.length !== 1) {
    openPanel('Cần chọn món · Bàn ' + pad(table), '<p>' + (candidates.length
      ? 'Có nhiều lượt gọi giống nhau. Chọn đúng dòng món trong đơn của bàn.'
      : 'Không có dòng món chờ nấu với đủ số lượng. Kiểm tra đơn của bàn.') + '</p><button class="btn primary full" data-table="' + table + '">Xem đơn của bàn</button>');
    return;
  }
  const line = candidates[0];
  const replace = intent === 'replace';
  const dish = state.menu.find(item => item.id === draft.replacement);
  const pending = action(intent, bound(session, { ...lineGuard(line), qty: requested.qty, ...(replace ? { dishId: dish.id, expectedPrice: dish.price } : {}) }));
  confirmPanel((replace ? 'Xác nhận đổi món' : 'Xác nhận hủy món') + ' · Bàn ' + pad(table),
    '<p><strong>' + requested.qty + '× ' + esc(line.name) + '</strong>'
    + (replace ? ' thành <strong>' + esc(dish.name) + '</strong>' : '') + '</p>',
    replace ? 'Đổi món' : 'Hủy món', async () => {
      await commit(pending); closePanel(); toast(replace ? 'Đã lưu đổi món.' : 'Đã lưu hủy món.');
    });
}

function showBill(table) {
  const session = state.active[table];
  if (!session) { toast('Bàn ' + pad(table) + ' chưa có đơn đang mở.'); return; }
  const unfinished = session.lines.some(line => line.qty && line.status !== 'served');
  const details = '<p class="session-code">Lượt khách ' + esc(session.id.slice(-8).toUpperCase()) + '</p>' + receiptDetails(session)
    + (unfinished ? '<p class="notice">Bàn vẫn còn món chưa phục vụ. Bếp tiếp tục xử lý trước khi đóng bàn.</p>' : '');
  if (!session.billing) {
    const command = action('billing', bound(session, { billing: true, expectedBilling: false }));
    confirmPanel('Hóa đơn · Bàn ' + pad(table), details, 'Chuyển sang chờ thu tiền', async () => {
      await commit(command);
      showBill(table);
    });
    return;
  }
  const paymentWaiting = doc.pending.some(item => item.action.type === 'pay');
  openPanel('Chờ thu tiền · Bàn ' + pad(table), details + (paymentWaiting ? '<p class="notice">Đang chờ máy chủ xác nhận thanh toán.</p>' : '')
    + '<form id="payment" class="form-stack"><label class="field">Phương thức<select name="method"><option value="cash">Tiền mặt</option>'
    + '<option value="transfer">Chuyển khoản</option></select></label><button class="btn primary full" type="submit"'
    + (unfinished || paymentWaiting ? ' disabled' : '') + '>Xác nhận đã thu ' + money(total(session)) + '</button></form>'
    + '<button type="button" id="reopen" class="btn outline full"' + (paymentWaiting ? ' disabled' : '') + '>Mở lại để gọi hoặc sửa món</button>');
  dialog.querySelector('#payment').addEventListener('submit', event => {
    event.preventDefault();
    const { method } = Object.fromEntries(new FormData(event.currentTarget));
    const button = event.submitter;
    button.disabled = true;
    commit(action('pay', bound(session, { method, expectedTotal: total(session), expectedSessionRev: session.rev }))).then(confirmed => {
      closePanel(); toast(confirmed ? 'Đã thu ' + money(total(session)) + ' và đóng bàn.' : 'Đang chờ máy chủ xác nhận thu tiền.');
    }).catch(error => { showError(error); button.disabled = false; });
  });
  dialog.querySelector('#reopen').addEventListener('click', event => {
    event.currentTarget.disabled = true;
    commit(action('billing', bound(session, { billing: false, expectedBilling: true })))
      .then(() => { closePanel(); toast('Đã mở lại bàn.'); }).catch(showError);
  }, { once: true });
}

function editDish(id) {
  const editing = state.menu.find(item => item.id === id);
  const expectedRev = state.rev;
  openPanel(editing ? 'Sửa món và giá' : 'Thêm món', '<form id="dish-form" class="form-stack">'
    + '<label class="field">Tên món<input name="name" maxlength="70" required value="' + esc(editing?.name) + '"></label>'
    + '<label class="field">Giá (đồng)<input name="price" inputmode="numeric" type="number" min="0" max="50000000" required value="' + esc(editing?.price) + '"></label>'
    + '<label class="field">Nhóm món<select name="category">' + categories.map(item => '<option' + (item === editing?.category ? ' selected' : '') + '>' + item + '</option>').join('') + '</select></label>'
    + '<label class="field">Tên gọi tắt (phân cách bằng dấu phẩy)<input name="aliases" maxlength="450" value="' + esc(editing?.aliases.join(', ')) + '"></label>'
    + '<label class="field">Ảnh thực đơn<select name="photo"><option value="">Ảnh mặc định</option>' + photos.map(item => '<option value="' + item + '"'
      + (item === editing?.photo ? ' selected' : '') + '>' + esc(({ tai: 'Phở tái', nam: 'Phở nạm', 'bo-kho': 'Bò kho', 'banh-mi': 'Bánh mì bò kho',
        'com-ga': 'Cơm gà', 'goi-cuon': 'Gỏi cuốn', 'tra-da': 'Trà đá', 'ca-phe': 'Cà phê' })[item]) + '</option>').join('') + '</select></label>'
    + '<label class="checkbox"><input type="checkbox" name="active"' + (editing?.active !== false ? ' checked' : '') + '>Đang bán</label>'
    + '<button class="btn primary full" type="submit">Lưu thực đơn</button></form>');
  dialog.querySelector('#dish-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const dish = { id: editing?.id ?? crypto.randomUUID(), name: values.name.trim(), price: Number(values.price),
      category: values.category, photo: values.photo, aliases: values.aliases.split(',').map(name => name.trim()).filter(Boolean), active: values.active === 'on' };
    const menu = editing ? state.menu.map(item => item.id === editing.id ? dish : item) : [...state.menu, dish];
    const button = event.submitter;
    button.disabled = true;
    commit(action('menu', { menu, expectedRev })).then(() => { closePanel(); toast('Đã lưu thực đơn.'); })
      .catch(error => { showError(error); button.disabled = false; });
  });
}

async function connect(form) {
  const { endpoint, token } = Object.fromEntries(new FormData(form));
  const config = { url: normalizeEndpoint(endpoint, location), token: token.trim(), id: crypto.randomUUID(), allowAI: false, allowAudio: false };
  const rev = doc.snapshot.rev;
  const { data } = await requestAPI(config, 'state');
  async function pair() {
    const again = await requestAPI(config, 'state');
    await save(current => {
      if (current.config || current.snapshot.rev !== rev) throw new Error('Dữ liệu cục bộ vừa thay đổi. Kiểm tra lại trước khi kết nối.');
      return { config, snapshot: again.data.state, pending: [], failure: null,
        aiEnabled: Boolean(again.data.aiEnabled), transcriptionEnabled: Boolean(again.data.transcriptionEnabled) };
    });
    ui.cart = [];
    ui.cartSession = undefined;
    reachable = true;
    render();
    closePanel();
    toast('Đã kết nối cùng dữ liệu của quán.');
  }
  if (rev) {
    confirmPanel('Dùng dữ liệu của máy đồng bộ?', '<p>Máy đồng bộ có ' + data.state.receipts.length + ' hóa đơn và '
      + Object.keys(data.state.active).length + ' bàn đang mở. Kết nối sẽ thay dữ liệu cục bộ hiện tại. Có thể tải bản sao trước khi kết nối.</p>', 'Dùng dữ liệu máy chủ', pair);
  } else await pair();
}

function backup() {
  if (doc.pending.length) { toast('Đợi các lệnh đồng bộ xong trước khi tải bản sao.'); return; }
  const blob = new Blob([JSON.stringify(doc.snapshot)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'food-assistant-' + new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()) + '.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  toast('Đã tạo tệp sao lưu.');
}

async function restore(file) {
  if (!file) return;
  if (file.size > 50 * 1024 * 1024) throw new Error('Tệp sao lưu vượt giới hạn 50 MB.');
  let snapshot;
  try { snapshot = validateSnapshot(JSON.parse(await file.text())); }
  catch (error) { throw new Error(error.code ? error.message : 'Tệp sao lưu không hợp lệ.'); }
  const rev = doc.snapshot.rev;
  confirmPanel('Khôi phục bản sao?', '<p>Tệp chứa ' + snapshot.receipts.length + ' hóa đơn và ' + Object.keys(snapshot.active).length
    + ' bàn đang mở. Khi xác nhận, bản sao sẽ thay dữ liệu của thiết bị này.</p>', 'Khôi phục dữ liệu', async () => {
    await save(current => {
      if (current.config || current.snapshot.rev !== rev) throw new Error('Dữ liệu vừa thay đổi. Mở lại tệp để kiểm tra.');
      return { ...current, snapshot };
    });
    ui.cart = [];
    ui.cartSession = undefined;
    closePanel();
    go('tables', null);
    toast('Đã khôi phục bản sao.');
  });
}

const commands = {
  voice: () => promptVoice(true),
  type: () => promptVoice(false),
  close: closePanel,
  cart: () => document.querySelector('#cart-panel')?.scrollIntoView({ behavior: 'smooth' }),
  bill: () => showBill(ui.table),
  'new-dish': () => editDish(),
  'send-cart': () => {
    if (!ui.cart.length || !ui.table) return;
    if (ui.cartSession !== (state.active[ui.table]?.id ?? null)) {
      throw new Error('Lượt khách đã thay đổi. Xóa giỏ cũ và tạo lượt gọi mới.');
    }
    return sendAdd(createAdd(ui.table, ui.cart, true), () => { ui.cart = []; render(); });
  },
  backup,
  restore: () => document.querySelector('#restore-file')?.click(),
  'sync-now': async () => { await sync(); toast(doc.failure ? 'Cần xử lý lệnh đang lỗi.' : 'Đã kiểm tra máy đồng bộ.'); },
  disconnect: () => {
    if (doc.pending.length) throw new Error('Xử lý các lệnh đang chờ trước khi ngắt kết nối.');
    confirmPanel('Ngắt kết nối thiết bị?', '<p>Thiết bị giữ một bản dữ liệu hiện tại. Các đơn mới trên thiết bị sẽ chỉ lưu cục bộ.</p>', 'Ngắt kết nối', async () => {
      await save(current => {
        if (current.pending.length) throw new Error('Vẫn còn lệnh đang chờ đồng bộ.');
        return { ...current, config: null, aiEnabled: false, transcriptionEnabled: false };
      });
      reachable = false;
      closePanel();
      toast('Đã chuyển sang chế độ lưu cục bộ.');
    });
  },
  'repeat-sync': async () => { await save(current => resolveFailure(current, true)); void backgroundSync(); },
  'discard-sync': () => confirmPanel('Bỏ lệnh đang lỗi?', '<p>Lệnh này chưa được máy đồng bộ chấp nhận.</p>', 'Bỏ lệnh', async () => {
    await save(current => resolveFailure(current, false)); closePanel(); void backgroundSync();
  }),
};

function cancelLine(id) {
  const session = state.active[ui.table];
  const line = session?.lines.find(item => item.id === id);
  if (!line) return;
  const alternatives = state.menu.filter(dish => dish.active && dish.id !== line.dishId);
  openPanel('Sửa món · Bàn ' + pad(ui.table), '<form id="cancel-form" class="form-stack"><p><strong>' + esc(line.name)
    + '</strong> · Còn ' + line.qty + ' phần chờ nấu.</p><label class="field">Số phần cần sửa<input type="number" min="1" max="' + line.qty
    + '" name="qty" value="1" required></label><label class="field">Thao tác<select name="replacement"><option value="">Hủy phần đã chọn</option>'
    + alternatives.map(dish => '<option value="' + esc(dish.id) + '">Đổi thành ' + esc(dish.name) + ' · ' + money(dish.price) + '</option>').join('')
    + '</select></label><button class="btn primary full" type="submit">Xác nhận thay đổi</button></form>');
  dialog.querySelector('#cancel-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const qty = Number(form.get('qty'));
    const replacement = alternatives.find(dish => dish.id === form.get('replacement'));
    const button = event.submitter;
    button.disabled = true;
    const change = replacement ? { dishId: replacement.id, expectedPrice: replacement.price } : {};
    commit(action(replacement ? 'replace' : 'cancel', bound(session, { ...lineGuard(line), qty, ...change }))).then(() => {
      closePanel(); toast(replacement ? 'Đã đổi món.' : 'Đã hủy ' + qty + ' phần ' + line.name + '.');
    }).catch(error => { showError(error); button.disabled = false; });
  });
}

function noteCart(id) {
  const item = ui.cart.find(entry => entry.id === id);
  if (!item) return;
  openPanel('Ghi chú món', '<form id="note-form" class="form-stack"><label class="field">Yêu cầu của khách<textarea name="note" rows="3" maxlength="180" placeholder="Ví dụ: không hành">'
    + esc(item.note) + '</textarea></label><button class="btn primary full" type="submit">Lưu ghi chú</button></form>');
  dialog.querySelector('#note-form').addEventListener('submit', event => {
    event.preventDefault();
    item.note = new FormData(event.currentTarget).get('note').trim();
    closePanel(); render();
  });
}

async function onButton(button) {
  const data = button.dataset;
  if (data.page) { go(data.page); return; }
  if (data.table) { closePanel(); go('order', Number(data.table)); return; }
  if (data.action && commands[data.action]) { await commands[data.action](); return; }
  if (data.dish) { cartChange(data.dish, 1); return; }
  if (data.cartChange) { cartChange(data.id, Number(data.cartChange)); return; }
  if (data.category) { ui.category = data.category; render(); return; }
  if (data.kitchen) { ui.kitchenFilter = data.kitchen; render(); return; }
  if (data.stage) {
    const line = kitchenQueue(state).find(item => item.id === data.stage);
    if (!line) return;
    await commit(action('stage', { table: line.table, sessionId: line.sessionId, ...lineGuard(line), status: stages[stages.indexOf(line.status) + 1] }));
    return;
  }
  if (data.cancel) { cancelLine(data.cancel); return; }
  if (data.note) { noteCart(data.note); return; }
  if (data.edit) { editDish(data.edit); return; }
  if (data.example) {
    const field = dialog.querySelector('#transcript');
    field.value = data.example;
    field.focus();
    return;
  }
  if (data.receipt) {
    const receipt = state.receipts.find(entry => entry.id === data.receipt);
    if (receipt) openPanel('Đã thanh toán · Bàn ' + pad(receipt.table), receiptDetails(receipt) + '<p>'
      + (receipt.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản') + '</p><button class="btn outline full" data-action="close">Đóng</button>');
  }
}

function wire() {
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled || !Object.keys(button.dataset).length || button.dataset.busy) return;
    button.dataset.busy = 'true';
    Promise.resolve(onButton(button)).catch(showError).finally(() => { delete button.dataset.busy; });
  });
  document.addEventListener('submit', event => {
    const type = event.target.dataset.form;
    if (!type) return;
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    let work;
    if (type === 'connect') work = connect(event.target);
    else if (type === 'voice-settings') {
      const form = new FormData(event.target);
      const id = doc.config?.id;
      work = save(current => {
        if (!id || current.config?.id !== id) throw new Error('Kết nối đã thay đổi. Mở lại Cài đặt.');
        return { ...current, config: { ...current.config, allowAI: form.has('allowAI'), allowAudio: form.has('allowAudio') } };
      }).then(() => toast('Đã lưu cài đặt trợ lý.'));
    } else {
      work = commit(action('tables', { count: Number(new FormData(event.target).get('count')), expectedCount: state.tableCount }))
        .then(() => toast('Đã lưu số bàn.'));
    }
    work.catch(showError).finally(() => { button.disabled = false; });
  });
  document.addEventListener('input', event => {
    if (event.target.id !== 'menu-search') return;
    ui.search = event.target.value;
    const holder = document.createElement('template');
    holder.innerHTML = page(state, ui, doc);
    content.querySelector('#dishes').replaceChildren(...holder.content.querySelector('#dishes').childNodes);
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'table-select' && !go('order', Number(event.target.value) || null)) event.target.value = ui.table;
    if (event.target.id === 'restore-file') void restore(event.target.files[0]).catch(showError);
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
  channel?.addEventListener('message', () => transact(db).then(next => refresh(next)).catch(showError));
  window.addEventListener('online', () => { render(true); void backgroundSync(); });
  window.addEventListener('offline', () => { reachable = false; render(true); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cloudMic?.abort();
    else transact(db).then(next => { refresh(next, true); void backgroundSync(); }).catch(showError);
  });
  setInterval(() => { if (!document.hidden) void backgroundSync(); }, 2000);
}

async function boot() {
  db = await openStore();
  const key = 'food-assistant-device-v1';
  try {
    device = localStorage.getItem(key) ?? crypto.randomUUID();
    localStorage.setItem(key, device);
  } catch { device = crypto.randomUUID(); }
  doc = await transact(db);
  if (location.hash === '#bep') ui.page = 'kitchen';
  wire();
  render();
  void backgroundSync();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}
boot().catch(error => {
  content.innerHTML = '<div class="notice" role="alert"><strong>Chưa mở được kho dữ liệu trên thiết bị</strong>'
    + '<p>Kiểm tra quyền lưu trữ của trình duyệt rồi tải lại trang.</p><small>' + esc(error.message) + '</small></div>';
});
