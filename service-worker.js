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
    '/icons/icon-512x512.png',
    '/offline.html' // page de secours offline à créer
];

// Installation et précache des ressources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
    );
    self.skipWaiting(); // active direct ce worker
});

// Activation et suppression des anciens caches
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
    self.clients.claim(); // force la prise en charge des clients
});

// Gestion des fetch et fallback offline
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
            // Fallback image par exemple
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-192x192.png');
            }
          })
        );
      })
    );
  }
});

// Background Sync : récupération des actions offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-todo') {
        event.waitUntil(syncTodos());
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
