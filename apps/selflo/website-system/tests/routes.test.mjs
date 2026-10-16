import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {navigation, routeUrl, storyUrl} from '../src/runtime/routes.mjs';

const root = resolve(import.meta.dirname, '..');
const read = async name => JSON.parse(await readFile(resolve(root, `environments/${name}.v1.json`), 'utf8'));
const publicEnvironment = await read('public');
const studioEnvironment = await read('studio');

assert.deepEqual(navigation(publicEnvironment).map(item => item.id), ['home', 'perspectives', 'support', 'privacy']);
assert.deepEqual(navigation(studioEnvironment).map(item => item.id), ['home', 'perspectives', 'support', 'privacy', 'developer']);
assert.equal(routeUrl(publicEnvironment, 'perspectives'), '/apps/selflo/perspectives/');
assert.equal(routeUrl(studioEnvironment, 'perspectives'), '/apps/selflo/studio/perspectives/');
assert.equal(storyUrl(studioEnvironment, 'story.example id'), '/apps/selflo/studio/perspectives/read/?story=story.example%20id');
assert.throws(() => routeUrl(publicEnvironment, 'developer'), /disabled/);
console.log('Route helper tests passed.');
