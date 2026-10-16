import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const registry = JSON.parse(await readFile(resolve(import.meta.dirname, '../features/feature-registry.v1.json'), 'utf8'));
for (const feature of registry.features) {
  assert.ok(!feature.public_enabled || feature.state === 'released', `${feature.id} leaks to public before release`);
}
assert.ok(registry.features.some(feature => feature.state === 'studio_only'), 'Expected at least one Studio-only feature fixture');
console.log('Feature leakage policy test passed.');
