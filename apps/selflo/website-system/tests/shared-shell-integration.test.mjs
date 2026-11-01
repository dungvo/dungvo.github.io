import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const root = resolve(import.meta.dirname, '../../');
const shared = await readFile(resolve(root, 'assets/site-shell-bridge.js'), 'utf8');
const css = await readFile(resolve(root, 'assets/site-shell-bridge.css'), 'utf8');
const brand = await readFile(resolve(root, 'assets/public-shell.css'), 'utf8');
const studioTools = [
  'review/index.html', 'quotes/index.html', 'reader/index.html',
  'review-matrix/index.html', 'content-catalog/index.html',
  'knowledge-maze/index.html', 'story-landscape/index.html',
  'story-landscape/classics.html', 'story-seed/index.html',
  'website-preview/index.html'
];
const publicLegacy = ['about/index.html','privacy-policy/index.html','story-landscape/index.html'];
for (const rel of studioTools) {
  const html = await readFile(resolve(root, 'studio', rel), 'utf8');
  assert.match(html, /assets\/site-shell-bridge\.js\?v=1/, rel);
  assert.match(html, /assets\/site-shell-bridge\.css\?v=1/, rel);
  assert.match(html, /assets\/public-shell\.css\?v=3/, rel);
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/, rel);
}
for (const rel of publicLegacy) {
  const html = await readFile(resolve(root, rel), 'utf8');
  assert.match(html, /assets\/site-shell-bridge\.js\?v=1/, rel);
}
assert.match(css, /top: 72px !important/, 'tool header offset avoids covering global navigation');
assert.match(css, /max-width:680px/, 'mobile shell');
assert.match(css, /prefers-reduced-motion/, 'accessibility');
assert.match(brand, /^@import url\('https:\/\/fonts\.googleapis\.com\//, 'brand font loaded for Support and Privacy');

function simulate(pathname) {
  const events = {};
  let node;
  const toggle = {
    expanded: 'false',
    getAttribute: () => toggle.expanded,
    setAttribute: (_k, value) => {toggle.expanded = value;},
    addEventListener: (k, fn) => {events['toggle:'+k]=fn;}
  };
  const nav = {
    classList: {toggle:()=>{},remove:()=>{}},
    addEventListener: (k, fn) => {events['nav:'+k]=fn;}
  };
  const document = {
    readyState: 'complete',
    body: {
      prepend: value => {node=value;},
      classList: {add:()=>{}}
    },
    querySelector: () => null,
    createElement: () => ({
      dataset: {},
      querySelector: key => key==='nav'?nav:toggle
    }),
    addEventListener: (k, fn) => {events['document:'+k]=fn;}
  };
  runInNewContext(shared, {document,window:{location:{pathname}}});
  assert.ok(node, 'header is mounted');
  assert.equal(node.dataset.selfloBridge,pathname.includes('/studio/')?'studio':'public');
  assert.match(node.innerHTML, /selflo-leaf-mark\.svg/, 'same official Selflo logo');
  assert.match(node.innerHTML, /Quyền riêng tư/, 'global navigation complete');
  assert.match(node.innerHTML, /Góc nhìn/, 'global navigation complete');
  assert.match(node.innerHTML, /Hỗ trợ/, 'global navigation complete');
  if (pathname.includes('/studio/')) {
    assert.match(node.innerHTML, /Developer/, 'Studio has Developer');
    assert.match(node.innerHTML, /aria-current="page">Developer/, 'Studio tool highlights Developer');
  } else {
    assert.doesNotMatch(node.innerHTML, /Developer/, 'public shell does not include Developer');
  }
  assert.equal(typeof events['toggle:click'], 'function', 'mobile nav can open');
}
simulate('/apps/selflo/studio/review-matrix/');
simulate('/apps/selflo/studio/story-landscape/');
simulate('/apps/selflo/about/');
simulate('/apps/selflo/privacy-policy/');
console.log('Shared shell integration guards passed:',studioTools.length,'Studio tools,',publicLegacy.length,'legacy Public pages.');
