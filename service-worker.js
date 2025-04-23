const CACHE_NAME = 'PWA-Toxdetect-cache-v2';
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
    '/video.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Installation du service worker et ajout des fichiers au cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHE_URLS);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event avec fallback à offline.html
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
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
async function syncTodos() {
    // Exemple simple pour la démo
    console.log('Background Sync actif : synchronisation des données offline...');
    // ici tu pourrais envoyer les données sauvegardées localement à ton serveur
}

// Optionnel : skip waiting depuis la page
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
