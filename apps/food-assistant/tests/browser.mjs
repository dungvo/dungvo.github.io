import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { createFoodServer } from '../server/api.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const folder = await mkdtemp(join(tmpdir(), 'food-browser-'));
const token = 'browser-test-pair-token-not-real';
const external = process.env.FOOD_TEST_URL;
const server = external ? null : createFoodServer({ file: join(folder, 'test.sqlite'), token });
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
  browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || undefined, args: ['--no-sandbox'] });
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

  if (server) {
    const waiter = await browser.newContext();
    const chef = await browser.newContext();
    const a = await waiter.newPage();
    const b = await chef.newPage();
    for (const page of [a, b]) {
      await page.goto(root);
      await nav(page, 'settings', 'desktop');
      await page.getByLabel('Địa chỉ API').fill(new URL(root).origin);
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
  }
} finally {
  await browser?.close();
  if (server?.listening) await new Promise(resolve => server.close(resolve));
  await rm(folder, { recursive: true, force: true });
}
