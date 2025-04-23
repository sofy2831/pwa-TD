const CACHE_NAME = 'PWA-Toxdetect-cache-v3';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/index.js',
  '/abon.html',
  '/audio.html',
  '/auth.html',
  '/conditions.html',
  '/confidentialite.html',
  '/drop.html',
  '/faq.html',
  '/infos.html',
  '/infos.js',
  '/monjournal.html',
  '/parametres.html',
  '/photo.html',
  '/quiz.html',
  '/quiz.js',
  '/share.html',
  '/video.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Installation du service worker et ajout des fichiers au cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting(); // Activation immédiate
});

// Activation du service worker et suppression des anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Interception des fetch avec fallback sur index.html pour les navigations
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          }).catch(() => {
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-192x192.png');
            }
          })
        );
      })
    );
  }
});

// Exemple de Background Sync (optionnel)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  console.log('Background Sync actif : synchronisation des données offline...');
  // Synchronisation à développer ici
}

// Optionnel : skip waiting depuis la page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
