const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function run() {
    const width = 812;
    const height = 375;
    const browser = await chromium.launch({
        executablePath: process.env.ECLIPSE_CHROME,
        args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
    });
    try {
        const page = await browser.newPage({
            viewport: { width, height },
            deviceScaleFactor: 3,
            hasTouch: true,
            isMobile: true,
        });
        const errors = [];
        const loaded = new Map();
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text());
        });
        page.on('response', response => loaded.set(new URL(response.url()).pathname, response.status()));

        await page.route('**/index.html', async route => {
            const response = await route.fetch();
            const exportShell = await response.text();
            const testShell = exportShell.replace('"args":[]', '"args":["--","--eclipse-render-probe"]');
            assert.notEqual(exportShell, testShell, 'export shell accepts the diagnostic flag');
            await route.fulfill({ response, body: testShell });
        });
        await page.goto('http://127.0.0.1:8000/index.html');
        await page.locator('#status').waitFor({ state: 'detached', timeout: 45000 });
        assert.equal(loaded.get('/index.wasm'), 200, 'WASM loads');
        assert.equal(loaded.get('/index.pck'), 200, 'Godot PCK loads');
        const canvas = page.locator('#canvas');
        const viewport = await canvas.boundingBox();
        assert.equal(viewport.width, width);
        assert.equal(viewport.height, height);

        const scale = height / 540;
        const inset = (width - 960 * scale) * 0.5;
        const at = (id, x, y) => ({ id, x: inset + x * scale, y: y * scale });
        const title = await canvas.screenshot();
        const an = at(0, 528, 250);
        const renderProbe = page.waitForEvent('console', {
            predicate: message => message.text().includes('ECLIPSE RENDER PROBE:'),
            timeout: 15000,
        });
        await page.touchscreen.tap(an.x, an.y);
        const hero = at(0, 95, 348);
        const heroRegion = { x: Math.round(hero.x), y: Math.round(hero.y), width: 76, height: 54 };
        await page.waitForTimeout(300);
        const play = await canvas.screenshot({ path: 'visual-qa/web-landscape.png' });
        assert.notDeepEqual(play, title, 'tapping An changes the rendered scene');

        const session = await page.context().newCDPSession(page);
        const touch = (type, touchPoints) => session.send('Input.dispatchTouchEvent', { type, touchPoints });
        const initial = at(0, 105, 452);
        const direction = at(0, 156, 452);
        const jump = at(1, 880, 379);
        const sword = at(2, 805, 449);
        const before = await page.screenshot({ clip: heroRegion });
        await touch('touchStart', [initial]);
        await touch('touchMove', [direction]);
        await touch('touchStart', [direction, jump, sword]);
        await page.waitForTimeout(150);
        await page.screenshot({ path: 'visual-qa/web-three-fingers.png' });
        await touch('touchEnd', []);
        await page.waitForTimeout(240);
        const after = await page.screenshot({ clip: heroRegion });
        assert.notDeepEqual(after, before, 'combined input moves the render');
        const probe = (await renderProbe).text();
        console.log(probe);
        const result = probe.match(/([\d.]+) FPS, cap (\d+), viewport (\d+)x(\d+)/);
        assert(result, 'Godot reports the measured mobile render budget');
        const [, fps, cap, renderWidth, renderHeight] = result.map(Number);
        assert.equal(cap, 30, 'touch Web selects the lightweight profile');
        assert(fps >= 8 && fps <= 36, 'engine draws within the mobile FPS budget');
        assert.equal(renderWidth, 960, 'gameplay is rendered at logical width on 3x DPR');
        assert.equal(renderHeight, 540, 'gameplay is rendered at logical height on 3x DPR');
        assert.deepEqual(errors, [], 'no browser runtime errors');
        console.log('ECLIPSE WEB PASS: WASM, landscape canvas, touch character selection and combined input');
    } finally {
        await browser.close();
    }
}

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
