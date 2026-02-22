const CACHE_NAME = 'pycrypt-v3';
const ASSETS = [
  './pycrypt.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/monokai.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js'
];

// Install: cache all core assets (NOT Pyodide — too large for mobile)
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate: clear old caches when version bumps
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, network fallback. Skip Pyodide entirely.
self.addEventListener('fetch', e => {
  if (e.request.url.includes('pyodide')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
