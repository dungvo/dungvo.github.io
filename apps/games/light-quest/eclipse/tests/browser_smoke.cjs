const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

async function run() {
    let server;
    let base = process.env.ECLIPSE_BASE_URL;
    if (!base) {
        const root = path.resolve(__dirname, '../build/web');
        server = http.createServer((req, res) => {
            const filename = path.join(root, new URL(req.url, 'http://localhost').pathname);
            if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
            try {
                res.setHeader('Content-Type', filename.endsWith('.wasm') ? 'application/wasm' : filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.html') ? 'text/html' : 'application/octet-stream');
                res.end(fs.readFileSync(filename));
            } catch { res.writeHead(404).end(); }
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        base = `http://127.0.0.1:${server.address().port}/index.html`;
    }
    const browser = await chromium.launch({
        executablePath: process.env.ECLIPSE_CHROME,
        args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
    });
    const evidence = path.resolve(__dirname, '../visual-qa');
    fs.mkdirSync(evidence, { recursive: true });
    try {
        for (const mobile of [false, true]) {
            const width = mobile ? 812 : 960, height = mobile ? 375 : 540;
            const context = await browser.newContext({ viewport: { width, height }, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: mobile ? 3 : 1 });
            const page = await context.newPage();
            const errors = [], consoleLines = [], responses = new Map();
            page.on('pageerror', error => errors.push(error.message));
            page.on('console', message => {
                consoleLines.push(message.text());
                if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text());
            });
            page.on('response', response => responses.set(new URL(response.url()).pathname.split('/').pop(), response.status()));
            await page.route('**/index.html*', async route => {
                const response = await route.fetch();
                const shell = await response.text();
                const probe = shell.replace('"args":[]', '"args":["--","--eclipse-render-probe"]');
                assert.notEqual(shell, probe, 'Godot export accepts diagnostic args');
                await route.fulfill({ response, body: probe });
            });
            await page.goto(base);
            await page.locator('#status').waitFor({ state: 'detached', timeout: 60000 });
            assert.equal(responses.get('index.wasm'), 200, 'WASM loads');
            assert.equal(responses.get('index.pck'), 200, 'PCK loads');
            const canvas = page.locator('#canvas');
            const box = await canvas.boundingBox();
            assert.equal(box.width, width);
            assert.equal(box.height, height);
            const scale = height / 540, inset = (width - 960 * scale) / 2;
            const at = (id, x, y) => ({ id, x: inset + x * scale, y: y * scale });
            const tap = async (x, y) => {
                const p = at(0, x, y);
                if (mobile) await page.touchscreen.tap(p.x, p.y);
                else await page.mouse.click(p.x, p.y);
            };
            await canvas.screenshot({ path: path.join(evidence, `web-${mobile ? 'touch' : 'desktop'}-menu.png`) });
            for (let chapter = 0; chapter < 3; chapter++) {
                // Godot PopupMenu is drawn inside the canvas, rather than as DOM options.
                await tap(480, 289);
                await page.waitForTimeout(150);
                await tap(480, 326 + 27 * chapter);
                await page.waitForTimeout(150);
                const who = chapter === 1 ? 'Kha' : 'An';
                const expected = `ECLIPSE CHAPTER: ${chapter} ${who}`;
                const started = page.waitForEvent('console', { predicate: message => message.text().includes(expected), timeout: 10000 });
                started.catch(() => {});
                const probe = page.waitForEvent('console', { predicate: message => message.text().includes('ECLIPSE RENDER PROBE:'), timeout: 15000 });
                probe.catch(() => {});
                await tap(480, who === 'An' ? 340 : 390);
                await page.waitForTimeout(300);

                await started;
                if (mobile) await tap(898, 299); // actual touch interaction
                else await page.keyboard.press('e');
                await page.waitForTimeout(200);
                const before = await canvas.screenshot();
                if (mobile) {
                    const session = await context.newCDPSession(page);
                    const initial = at(0, 105, 452), direction = at(0, 156, 452), jump = at(1, 880, 379), sword = at(2, 805, 449);
                    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [initial] });
                    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [direction] });
                    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [direction, jump, sword] });
                    await page.waitForTimeout(220);
                    await canvas.screenshot({ path: path.join(evidence, `web-touch-chapter-${chapter + 1}.png`) });
                    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
                } else {
                    await page.keyboard.down('d');
                    await page.keyboard.down('Space');
                    await page.keyboard.press('j');
                    await page.waitForTimeout(240);
                    await page.keyboard.up('Space');
                    await page.keyboard.up('d');
                    await canvas.screenshot({ path: path.join(evidence, `web-desktop-chapter-${chapter + 1}.png`) });
                }
                assert.notDeepEqual(await canvas.screenshot(), before, 'movement / jump / attack changes rendered gameplay');
                const line = (await probe).text();
                const match = line.match(/([\d.]+) FPS, cap (\d+), viewport (\d+)x(\d+)/);
                assert(match, 'engine render profile is reported');
                const [, fps, cap, renderWidth, renderHeight] = match.map(Number);
                assert.equal(cap, mobile ? 30 : 60);
                assert(fps >= 6 && fps <= cap + 6, 'actual rendered frames within profile');
                assert.equal(renderWidth, 960);
                assert.equal(renderHeight, 540);
                console.log(`WEB CHAPTER PASS: ${mobile ? 'touch 3x DPR' : 'desktop'} / ${expected} / ${line}`);
                await tap(880, 102); // pause and return to chapter menu
                await page.waitForTimeout(150);
            }
            assert.deepEqual(errors, [], 'no browser or Godot runtime errors');
            await context.close();
        }
        console.log('ECLIPSE WEB PASS: actual Godot WASM, all 3 chapter selectors, An/Kha, desktop / touch, three-finger input, viewport budget, no runtime errors');
    } finally {
        await browser.close();
        if (server) server.close();
    }
}
run().catch(error => { console.error(error); process.exit(1); });
