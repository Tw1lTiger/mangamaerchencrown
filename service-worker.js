const CACHE_NAME = 'maerchen-v1';
const URLS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/manifest.json',
  '/img/banner.jpeg',
  '/img/poster.jpg',
  // Кэшируем все главы и картинки (jpg/jpeg)
  // Можно добавить больше вручную или сделать динамически
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(resp => {
        // Кэшировать новые картинки глав на лету
        if (resp.ok && event.request.url.match(/\/ch\//)) {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return resp;
      }).catch(() => caches.match('/index.html'))
    )
  );
});
