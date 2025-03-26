self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('pwa-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './new_register.html',
        './main.html',
        './style.css',
        './main.js',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
