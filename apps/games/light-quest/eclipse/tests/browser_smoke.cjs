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
        await page.addInitScript(() => {
            // Sample actual WebGL drawing, independently of the display's refresh rate.
            const original = WebGL2RenderingContext.prototype.drawElements;
            let drew = false;
            let present = 0;
            WebGL2RenderingContext.prototype.drawElements = function (...args) {
                drew = true;
                return original.apply(this, args);
            };
            const sample = () => {
                if (drew) present++;
                drew = false;
                requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
            window.eclipseDraws = () => present;
        });
        const errors = [];
        const loaded = new Map();
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text());
        });
        page.on('response', response => loaded.set(new URL(response.url()).pathname, response.status()));

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
        const renderedFps = await page.evaluate(async () => {
            const start = performance.now();
            const first = window.eclipseDraws();
            await new Promise(resolve => setTimeout(resolve, 2200));
            return (window.eclipseDraws() - first) * 1000 / (performance.now() - start);
        });
        console.log('ECLIPSE MOBILE WEB: %s rendered FPS at DPR 3', renderedFps.toFixed(1));
        assert(renderedFps >= 8 && renderedFps <= 38, 'mobile Web draws at a measurable rate within the 30 FPS budget');
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
