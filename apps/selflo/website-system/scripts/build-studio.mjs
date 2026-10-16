import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {navigation} from '../src/runtime/routes.mjs';

const systemRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(systemRoot, '..');
const environment = JSON.parse(await readFile(resolve(systemRoot, 'environments/studio.v1.json'), 'utf8'));
const registry = JSON.parse(await readFile(resolve(systemRoot, 'features/feature-registry.v1.json'), 'utf8'));
const buildInputs = [
  'index.html',
  'perspectives/index.html',
  'support/index.html',
  'privacy/index.html',
  'assets/public-shell.css',
  'assets/public-shell-static.js',
  'assets/perspectives-v3.js'
];
const sourceHash = createHash('sha256');
sourceHash.update(`${JSON.stringify(environment)}\n${JSON.stringify(registry)}\n`);
for (const path of buildInputs) sourceHash.update(await readFile(resolve(repoRoot, path)));
sourceHash.update(await readFile(resolve(systemRoot, 'src/pages/developer.html')));
sourceHash.update(await readFile(resolve(systemRoot, 'src/styles/studio-shell.css')));
const sourceRevision = sourceHash.digest('hex');
const buildID = `studio-s2-${sourceRevision.slice(0, 12)}`;
const output = resolve(repoRoot, 'studio/.website-build');
await mkdir(output, {recursive: true});

const enabledFeatures = registry.features.filter(feature => feature.studio_enabled && environment.allowed_feature_states.includes(feature.state)).map(feature => feature.id);
const routeMap = Object.fromEntries(navigation(environment).map(item => [item.id, item.href]));
const manifest = {
  schema_version: 'selflo.website-build.v1',
  build_id: buildID,
  target: 'studio',
  source_revision: sourceRevision,
  environment_revision: environment.revision,
  feature_registry_revision: registry.revision,
  content_channel: environment.content_channel,
  enabled_features: enabledFeatures,
  promoted_from_studio_build: null
};

await writeFile(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(resolve(output, 'route-map.json'), `${JSON.stringify(routeMap, null, 2)}\n`);

const publicBase = '/apps/selflo/';
const studioBase = environment.base_path;
const pages = [
  {id: 'home', source: 'index.html', output: 'studio/index.html', publicPath: publicBase},
  {id: 'perspectives', source: 'perspectives/index.html', output: 'studio/perspectives/index.html', publicPath: `${publicBase}perspectives/`},
  {id: 'support', source: 'support/index.html', output: 'studio/support/index.html', publicPath: `${publicBase}support/`},
  {id: 'privacy', source: 'privacy/index.html', output: 'studio/privacy/index.html', publicPath: `${publicBase}privacy/`}
];

const studioHeader = activeID => `<header class="selflo-site-header"><a class="selflo-shell-brand" href="${routeMap.home}" aria-label="Selflo Studio — Trang chủ"><img src="${publicBase}assets/images/public/selflo-leaf-mark.svg" alt=""><span>Selflo</span></a><button class="selflo-shell-toggle" type="button" aria-label="Mở điều hướng" aria-expanded="false">☰</button><nav aria-label="Điều hướng Studio">${navigation(environment).map(item => `<a${item.id === activeID ? ' class="active"' : ''} href="${item.href}">${item.label_vi}</a>`).join('')}</nav></header>`;
const studioFooter = `<footer class="selflo-site-footer"><div><a class="selflo-shell-brand" href="${routeMap.home}"><img src="${publicBase}assets/images/public/selflo-leaf-mark.svg" alt=""><span>Selflo</span></a><small>Studio · Không public.</small></div><nav>${navigation(environment).map(item => `<a href="${item.href}">${item.label_vi}</a>`).join('')}<a href="${publicBase}privacy-policy/">Privacy Policy</a></nav></footer>`;

function absolutePublicAssets(html, pagePath) {
  return html.replace(/\b(href|src)="([^"]+)"/g, (match, attribute, value) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(value)) return match;
    const url = new URL(value, `https://selflo.local${pagePath}`);
    return `${attribute}="${url.pathname}${url.search}${url.hash}"`;
  });
}

function studioPage(html, page) {
  let result = absolutePublicAssets(html, page.publicPath);
  result = result.replace(/<meta name="robots"[^>]*>/i, '');
  result = result.replace(/<head>/i, '<head><meta name="robots" content="noindex,nofollow">');
  result = result.replace(/<body[^>]*>/i, match => `${match}<div class="studio-context"><span>Selflo Studio</span><b>Không public</b></div>`);
  result = result.replace(/<header class="selflo-site-header">[\s\S]*?<\/header>/i, studioHeader(page.id));
  result = result.replace(/<footer class="selflo-site-footer">[\s\S]*?<\/footer>/i, studioFooter);
  result = result.replace('</head>', `<link rel="stylesheet" href="${studioBase}assets/studio-shell.css?v=1"></head>`);
  if (page.id === 'perspectives') result = result.replace(`${publicBase}assets/perspectives-v3.js?v=2`, `${studioBase}assets/perspectives-v3.js?v=1`);
  return result;
}

for (const page of pages) {
  const target = resolve(repoRoot, page.output);
  await mkdir(dirname(target), {recursive: true});
  await writeFile(target, studioPage(await readFile(resolve(repoRoot, page.source), 'utf8'), page));
}

const studioAssets = resolve(repoRoot, 'studio/assets');
await mkdir(studioAssets, {recursive: true});
await writeFile(resolve(studioAssets, 'studio-shell.css'), await readFile(resolve(systemRoot, 'src/styles/studio-shell.css'), 'utf8'));
const perspectivesRuntime = (await readFile(resolve(repoRoot, 'assets/perspectives-v3.js'), 'utf8')).replace("const base = '../perspective-library/release/vi/';", `const base = '${publicBase}perspective-library/release/vi/';`);
await writeFile(resolve(studioAssets, 'perspectives-v3.js'), perspectivesRuntime);

let developer = await readFile(resolve(systemRoot, 'src/pages/developer.html'), 'utf8');
developer = developer.replace('<!-- SELFLO_STUDIO_HEADER -->', studioHeader('developer')).replace('<!-- SELFLO_STUDIO_FOOTER -->', studioFooter);
const developerTarget = resolve(repoRoot, 'studio/developer/index.html');
await mkdir(dirname(developerTarget), {recursive: true});
await writeFile(developerTarget, developer);
console.log(`Built ${buildID}: 4 Studio pages, Developer and build metadata; public output untouched.`);
