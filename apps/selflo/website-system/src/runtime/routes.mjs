const ROUTES = Object.freeze({
  home: '',
  perspectives: 'perspectives/',
  support: 'support/',
  privacy: 'privacy/',
  privacy_policy: 'privacy-policy/',
  developer: 'developer/'
});

export function normalizeBasePath(basePath) {
  if (typeof basePath !== 'string' || !basePath.startsWith('/')) {
    throw new TypeError('basePath must be an absolute site path');
  }
  return basePath.endsWith('/') ? basePath : `${basePath}/`;
}

export function routeUrl(environment, routeID) {
  if (!environment || typeof environment !== 'object') throw new TypeError('environment is required');
  if (!(routeID in ROUTES)) throw new RangeError(`Unknown route: ${routeID}`);
  if (routeID === 'developer' && !environment.developer_navigation) {
    throw new RangeError('Developer route is disabled for this environment');
  }
  return `${normalizeBasePath(environment.base_path)}${ROUTES[routeID]}`;
}

export function storyUrl(environment, storyID) {
  if (!storyID) throw new TypeError('storyID is required');
  return `${routeUrl(environment, 'perspectives')}read/?story=${encodeURIComponent(storyID)}`;
}

export function navigation(environment) {
  const items = [
    ['home', 'Trang chủ'],
    ['perspectives', 'Góc nhìn'],
    ['support', 'Hỗ trợ'],
    ['privacy', 'Quyền riêng tư']
  ];
  if (environment.developer_navigation) items.push(['developer', 'Developer']);
  return items.map(([id, label_vi]) => ({id, label_vi, href: routeUrl(environment, id)}));
}
