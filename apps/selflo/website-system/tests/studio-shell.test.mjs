import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const systemRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(systemRoot, '..');
const build = spawnSync(process.execPath, [resolve(systemRoot, 'scripts/build-studio.mjs')], {encoding: 'utf8'});
assert.equal(build.status, 0, build.stderr || build.stdout);

for (const route of ['', 'perspectives/', 'support/', 'privacy/', 'developer/']) {
  const html = await readFile(resolve(repoRoot, `studio/${route}index.html`), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.match(html, /Selflo Studio/);
  assert.match(html, /href="\/apps\/selflo\/studio\/developer\/">Developer<\/a>/);
  assert.match(html, /href="\/apps\/selflo\/studio\/perspectives\/">Góc nhìn<\/a>/);
  assert.doesNotMatch(html, /perspective-library\/authoring/);
}

const publicHome = await readFile(resolve(repoRoot, 'index.html'), 'utf8');
assert.doesNotMatch(publicHome, />Developer<\/a>/);
assert.doesNotMatch(publicHome, /Selflo Studio/);
console.log('Studio shell acceptance tests passed for 5 routes.');
