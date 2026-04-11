// ===== VOYAGE SERVICE WORKER =====
// Enables offline support and PWA installation
 
const CACHE_NAME = 'voyage-cache-v2';
const ASSETS_TO_CACHE = [
  '/voyage.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];
 
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});
 
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
 
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
 
