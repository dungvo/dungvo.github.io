import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const readJSON = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const fail = message => { throw new Error(message); };
const states = new Set(['studio_only', 'public_candidate', 'released', 'retired']);

function validateEnvironment(value, expectedID) {
  if (value.schema_version !== 'selflo.website-environment.v1') fail(`${expectedID}: invalid schema_version`);
  if (value.id !== expectedID) fail(`${expectedID}: id mismatch`);
  if (!Number.isInteger(value.revision) || value.revision < 1) fail(`${expectedID}: revision must be positive integer`);
  if (!value.base_path?.startsWith('/') || !value.base_path.endsWith('/')) fail(`${expectedID}: base_path must be absolute and end with /`);
  if (!Array.isArray(value.allowed_feature_states) || !value.allowed_feature_states.every(state => states.has(state))) fail(`${expectedID}: invalid feature state policy`);
  if (expectedID === 'public') {
    if (value.base_path !== '/apps/selflo/') fail('public: unexpected base_path');
    if (value.developer_navigation || value.allow_authoring_data || value.allow_fixtures) fail('public: internal capability must be disabled');
    if (value.content_channel !== 'release' || value.output_policy !== 'release_only') fail('public: must be release-only');
    if (value.allowed_feature_states.some(state => state !== 'released')) fail('public: only released features are allowed');
  }
  if (expectedID === 'studio') {
    if (value.base_path !== '/apps/selflo/studio/') fail('studio: unexpected base_path');
    if (!value.developer_navigation || value.robots !== 'noindex,nofollow') fail('studio: Developer and noindex are required');
  }
}

function validateRegistry(value) {
  if (value.schema_version !== 'selflo.website-feature-registry.v1') fail('registry: invalid schema_version');
  if (!Number.isInteger(value.revision) || value.revision < 1 || !Array.isArray(value.features)) fail('registry: invalid revision/features');
  const ids = new Set();
  for (const feature of value.features) {
    if (!/^[a-z][a-z0-9_]*$/.test(feature.id)) fail(`registry: invalid id ${feature.id}`);
    if (ids.has(feature.id)) fail(`registry: duplicate id ${feature.id}`);
    ids.add(feature.id);
    if (!states.has(feature.state)) fail(`${feature.id}: invalid state`);
    if (feature.public_enabled && feature.state !== 'released') fail(`${feature.id}: public_enabled requires released state`);
    if (feature.public_enabled && !feature.studio_enabled) fail(`${feature.id}: public feature must also be visible in Studio`);
    if (feature.state === 'retired' && (feature.public_enabled || feature.studio_enabled)) fail(`${feature.id}: retired feature cannot be enabled`);
  }
}

const publicEnvironment = await readJSON('environments/public.v1.json');
const studioEnvironment = await readJSON('environments/studio.v1.json');
const registry = await readJSON('features/feature-registry.v1.json');
validateEnvironment(publicEnvironment, 'public');
validateEnvironment(studioEnvironment, 'studio');
validateRegistry(registry);
console.log(`Validated 2 environments and ${registry.features.length} features.`);
