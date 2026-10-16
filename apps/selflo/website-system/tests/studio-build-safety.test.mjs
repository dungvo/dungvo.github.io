import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdir, readFile, stat} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
import {spawnSync} from 'node:child_process';

const systemRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(systemRoot, '..');
const protectedRoots = ['index.html', 'perspectives', 'support', 'privacy', 'privacy-policy', 'assets'];

async function filesAt(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];
  const entries = await readdir(path, {withFileTypes: true});
  const nested = await Promise.all(entries.map(entry => filesAt(resolve(path, entry.name))));
  return nested.flat();
}

async function snapshot() {
  const files = (await Promise.all(protectedRoots.map(name => filesAt(resolve(repoRoot, name))))).flat().sort();
  const result = {};
  for (const file of files) result[relative(repoRoot, file)] = createHash('sha256').update(await readFile(file)).digest('hex');
  return result;
}

const before = await snapshot();
const build = spawnSync(process.execPath, [resolve(systemRoot, 'scripts/build-studio.mjs')], {encoding: 'utf8'});
assert.equal(build.status, 0, build.stderr || build.stdout);
const after = await snapshot();
assert.deepEqual(after, before, 'Studio build changed a protected public file');
const manifest = JSON.parse(await readFile(resolve(repoRoot, 'studio/.website-build/manifest.json'), 'utf8'));
assert.equal(manifest.target, 'studio');
assert.equal(manifest.promoted_from_studio_build, null);
console.log(`Studio safety test passed across ${Object.keys(before).length} protected public files.`);
