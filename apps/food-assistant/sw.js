const scope = new URL(self.registration.scope);
const prefix = 'food-assistant:' + scope.pathname + ':';
const cacheKey = prefix + '1.3.0';
const shell = [
  './', './index.html', './styles.css', './app.js', './view.js', './domain.js', './language.js',
  './menu.js', './storage.js', './icons.js', './voice.js', './manifest.webmanifest', './assets/hero.webp',
  './assets/icon-192.png', './assets/icon-512.png', './assets/tai.webp', './assets/nam.webp',
  './assets/bo-kho.webp', './assets/banh-mi.webp', './assets/com-ga.webp', './assets/goi-cuon.webp',
  './assets/tra-da.webp', './assets/ca-phe.webp',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheKey).then(cache => cache.addAll(shell.map(path => new Request(path, { cache: 'reload' })))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheKey).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(scope.href) || event.request.headers.has('Authorization')) return;
  const relative = './' + url.pathname.slice(scope.pathname.length);
  if (!shell.includes(relative)) return;
  event.respondWith(caches.open(cacheKey).then(async cache => {
    const cached = await cache.match(relative);
    if (cached) return cached;
    return fetch(event.request);
  }));
});
