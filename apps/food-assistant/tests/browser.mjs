import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { createFoodServer } from '../server/api.mjs';
import { boundedAudio } from '../server/audio.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const folder = await mkdtemp(join(tmpdir(), 'food-browser-'));
const token = 'browser-test-pair-token-not-real';
const external = process.env.FOOD_TEST_URL;
const capturedAudio = [];
const server = external ? null : createFoodServer({ file: join(folder, 'test.sqlite'), token,
  aiKey: 'browser-test-fake', provider: 'groq', allowTranscription: true, prepareAudio: boundedAudio,
  transcribe: async (key, audio) => {
    assert.equal(key, 'browser-test-fake');
    assert.equal(audio.type, 'audio/wav');
    assert.ok(audio.size > 1600);
    capturedAudio.push(audio.size);
    return 'Bàn 4 hai phở tái';
  },
});
let browser;
let root = external;
const widths = [
  { name: 'iphone', width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: 'android', width: 412, height: 915, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 834, height: 1112, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1280, height: 880, isMobile: false, hasTouch: false },
];
const scope = name => name === 'desktop' || name === 'tablet' ? '.main-nav' : '#mobile-nav';
const nav = (page, location, name) => page.locator(scope(name) + ' [data-page="' + location + '"]').click();
const waitText = (root, expected) => root.getByText(expected, { exact: false }).first().waitFor({ state: 'visible' });
const ensureViewport = async page => {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'page overflows horizontally');
  assert.equal(await page.evaluate(() => !!document.querySelector('main h1')), true);
};
async function utterance(page, value) {
  await page.locator('button[data-action=type]').click();
  await page.getByRole('textbox', { name: 'Câu gọi món' }).fill(value);
  await page.getByRole('button', { name: 'Kiểm tra câu gọi' }).click();
}

try {
  if (server) {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    root = 'http://127.0.0.1:' + server.address().port + '/apps/food-assistant/';
  }
  browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || undefined,
    args: ['--no-sandbox', ...(server ? ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] : [])] });
  const screenshotDirectory = process.env.FOOD_SCREENSHOTS;
  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });

  for (const { name, width, height, isMobile, hasTouch } of widths) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile, hasTouch });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(root);
    await page.getByRole('heading', { name: 'Quản lý bàn', exact: true }).waitFor();
    await ensureViewport(page);
    assert.equal(await page.locator('.table-card').count(), 8);
    if (screenshotDirectory) await page.screenshot({ path: join(screenshotDirectory, name + '-tables.png') });

    await utterance(page, 'Bàn 3 hai phở tái một bò kho');
    await page.getByRole('heading', { name: 'Kiểm tra lượt gọi · Bàn 03' }).waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    await page.getByRole('heading', { name: 'Gọi món · Bàn 03' }).waitFor();
    await ensureViewport(page);
    await page.waitForFunction(() => document.querySelector('.dish-picture img')?.naturalWidth > 0);
    if (screenshotDirectory && name !== 'android') await page.screenshot({ path: join(screenshotDirectory, name + '-order.png'), fullPage: true });

    await nav(page, 'tables', name);
    await utterance(page, 'Bàn 3 hai phở tái một bò kho');
    await page.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    await page.getByRole('heading', { name: 'Xác nhận gọi thêm' }).waitFor();
    await page.getByRole('button', { name: 'Quay lại' }).click();

    await utterance(page, 'Bàn 3 thêm hai trà đá');
    await page.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    await page.getByRole('heading', { name: 'Gọi món · Bàn 03' }).waitFor();
    await page.reload();
    await page.locator('button[data-table="3"]').click();
    await waitText(page.locator('.order-sidebar'), '185.000');

    await nav(page, 'kitchen', name);
    await ensureViewport(page);
    assert.deepEqual(await page.locator('.ticket h2').allTextContents(), ['Phở tái', 'Bò kho', 'Trà đá']);
    if (screenshotDirectory) await page.screenshot({ path: join(screenshotDirectory, name + '-kitchen.png') });
    await nav(page, 'order', name);
    await page.getByRole('button', { name: 'Tính tiền' }).click();
    await page.getByRole('button', { name: 'Chuyển sang chờ thu tiền' }).click();
    await waitText(page.getByRole('dialog'), 'Bàn vẫn còn món chưa phục vụ');
    assert.equal(await page.getByRole('button', { name: /Xác nhận đã thu/ }).isDisabled(), true);
    await page.getByRole('button', { name: 'Đóng', exact: true }).click();

    await nav(page, 'kitchen', name);
    for (let i = 0; i < 3; i++) {
      const ticket = page.locator('.ticket').first();
      await ticket.getByRole('button', { name: 'Bắt đầu nấu' }).click();
      await ticket.getByRole('button', { name: 'Đánh dấu sẵn sàng' }).click();
      await ticket.getByRole('button', { name: 'Đã phục vụ', exact: true }).click();
    }
    await waitText(page.locator('main'), 'Chưa có món trong mục này');
    await nav(page, 'order', name);
    await page.getByRole('button', { name: 'Mở hóa đơn' }).click();
    await page.getByRole('button', { name: /Xác nhận đã thu/ }).click();
    await waitText(page.locator('#toast'), 'đóng bàn');
    await nav(page, 'receipts', name);
    await waitText(page.locator('.receipts').first(), '185.000');
    assert.deepEqual(errors, []);
    console.log('PASS ' + name + ' ' + width + '×' + height + ' · Voice transcript → duplicate review → kitchen → checkout → persisted receipt');
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const mobile = await context.newPage();
    await mobile.goto(root);
    await utterance(mobile, 'Bàn 5 hai phở bò, một tái một chín. Tô chín không hành. Hai trà đá, à một thôi.');
    await mobile.getByRole('heading', { name: 'Kiểm tra lượt gọi · Bàn 05' }).waitFor();
    assert.equal(await mobile.locator('main .table-card.pending').count(), 0);
    await mobile.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    await nav(mobile, 'kitchen', 'iphone');
    assert.deepEqual(await mobile.locator('.ticket h2').allTextContents(), ['Phở tái', 'Phở bò chín', 'Trà đá']);
    assert.deepEqual(await mobile.locator('.ticket-qty').allTextContents(), ['×1', '×1', '×1']);
    await waitText(mobile.locator('.ticket-note'), 'không hành');
    console.log('PASS multi-item correction · Exact table, split, quantity, note and order in kitchen');
    await context.close();
  }

  if (server) {
    const waiter = await browser.newContext();
    const chef = await browser.newContext();
    const a = await waiter.newPage();
    const b = await chef.newPage();
    for (const page of [a, b]) {
      await page.goto(root + '#ket-noi');
      await page.getByLabel('Địa chỉ API').waitFor();
      assert.equal(await page.getByLabel('Địa chỉ API').inputValue(), new URL(root).origin);
      await page.getByLabel('Mã kết nối quán').fill(token);
      await page.getByRole('button', { name: 'Kết nối', exact: true }).click();
      await waitText(page.locator('main'), '0 lệnh đang chờ');
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    }
    await nav(b, 'kitchen', 'desktop');
    await nav(a, 'tables', 'desktop');
    await waiter.setOffline(true);
    await utterance(a, 'Bàn 3 một phở nạm không hành');
    await a.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    await a.getByRole('heading', { name: 'Gọi món · Bàn 03' }).waitFor();
    assert.equal(await b.locator('.ticket').count(), 0);
    await a.reload();
    await a.locator('button[data-table="3"]').click();
    await waitText(a.locator('.order-sidebar'), '59.000');
    await waiter.setOffline(false);
    await waitText(b.locator('.ticket'), 'Phở nạm');
    await waitText(b.locator('.ticket-note'), 'không hành');
    assert.equal(await b.locator('.ticket').count(), 1);
    await b.getByRole('button', { name: 'Bắt đầu nấu' }).click();
    await waitText(a.locator('.order-sidebar'), 'không hành');
    await a.waitForFunction(() => document.querySelectorAll('.order-sidebar [data-cancel]').length === 0);
    console.log('PASS two independent browsers · Offline reload → outbox reconnect → kitchen sees one order → state returns to waiter');

    await a.addInitScript(() => {
      const startMediaRecorder = MediaRecorder.prototype.start;
      MediaRecorder.prototype.start = function (...args) {
        window.recordedBytes = 0;
        this.addEventListener('dataavailable', event => { window.recordedBytes += event.data.size; });
        return startMediaRecorder.apply(this, args);
      };
      window.SpeechRecognition = class {
        start() {
          queueMicrotask(() => { this.onerror({ error: 'network' }); this.onend(); });
        }
        abort() {}
      };
    });
    await a.reload();
    await a.locator('.hero [data-action="voice"]').click();
    await waitText(a.getByRole('dialog'), 'Chưa nhận được giọng nói');
    assert.equal(await a.getByRole('button', { name: 'Thu âm qua máy chủ' }).count(), 0);
    await a.getByRole('button', { name: 'Đóng', exact: true }).click();
    await nav(a, 'settings', 'desktop');
    await waitText(a.locator('main'), 'Chi phí AI ước tính tháng');
    await waitText(a.locator('main'), 'bản thu được gửi tới Groq');
    await a.getByRole('checkbox', { name: 'Cho phép nút thu âm qua máy chủ' }).check();
    await a.getByRole('button', { name: 'Lưu cài đặt trợ lý' }).click();
    await waitText(a.locator('#toast'), 'Đã lưu cài đặt trợ lý');
    await a.reload();

    const openVoice = () => a.locator('.hero [data-action="voice"]').click();
    await openVoice();
    await waitText(a.getByRole('dialog'), 'Có thể thử nút Thu âm qua máy chủ.');
    await a.getByRole('button', { name: 'Thu âm qua máy chủ' }).click();
    await waitText(a.getByRole('dialog'), 'Đang thu âm');
    await a.getByRole('button', { name: 'Đóng', exact: true }).click();
    assert.equal(capturedAudio.length, 0);
    assert.equal(await b.locator('.ticket').count(), 1);

    await openVoice();
    await a.getByRole('button', { name: 'Thu âm qua máy chủ' }).click();
    await a.getByRole('button', { name: 'Dừng và chuyển thành chữ' }).waitFor();
    await a.waitForFunction(() => window.recordedBytes > 1600);
    await a.getByRole('button', { name: 'Dừng và chuyển thành chữ' }).click();
    await waitText(a.getByRole('dialog'), 'Đọc lại câu vừa nhận').catch(async error => {
      throw new Error(await a.locator('#speech-status').textContent(), { cause: error });
    });
    assert.equal(capturedAudio.length, 1);
    assert.equal(await a.getByRole('textbox', { name: 'Câu gọi món' }).inputValue(), 'Bàn 4 hai phở tái');
    assert.equal(await b.locator('.ticket').count(), 1);

    await a.getByRole('textbox', { name: 'Câu gọi món' }).fill('Bàn 4 một phở tái');
    await a.getByRole('button', { name: 'Kiểm tra câu gọi' }).click();
    await a.getByRole('heading', { name: 'Kiểm tra lượt gọi · Bàn 04' }).waitFor();
    await a.getByRole('dialog').getByRole('button', { name: 'Gửi bếp' }).click();
    const ticket = b.locator('.ticket').filter({ has: b.getByRole('heading', { name: 'Phở tái' }) });
    await ticket.waitFor();
    assert.equal(await ticket.locator('.ticket-qty').textContent(), '×1');
    console.log('PASS recorded browser audio · Browser STT error → opt-in → cancel without upload → API transcript → edit → kitchen');
  }
} finally {
  await browser?.close();
  if (server?.listening) await new Promise(resolve => server.close(resolve));
  await rm(folder, { recursive: true, force: true });
}
