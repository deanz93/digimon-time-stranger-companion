const CACHE = 'dts-shell-v2';
const SHELL = ['/', '/digimon', '/planner', '/team', '/collection', '/manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Browser extensions and other non-web schemes cannot be stored in Cache API.
  if (request.method !== 'GET' || !['http:', 'https:'].includes(url.protocol)) return;

  // Leave third-party fonts, extensions, API hosts and other cross-origin traffic alone.
  if (url.origin !== self.location.origin) return;

  // Framework assets and development hot-reload traffic must always bypass the app cache.
  if (url.pathname.startsWith('/_next/') || url.pathname.includes('webpack-hmr')) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const fallback = await caches.match('/');
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
