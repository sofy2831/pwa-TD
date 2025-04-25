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
  self.skipWaiting();
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
  const url = new URL(event.request.url);

  // Gestion des requêtes de fichiers
  if (url.pathname.startsWith('/pwa-TD/handle-file')) {
    event.respondWith(handleFileRequest(event.request));
  } else if (url.protocol === 'myapp:') {
    // Gestion des protocoles personnalisés (ex : myapp://)
    event.respondWith(handleProtocolRequest(event.request));
  } else {
    if (event.request.method !== 'GET') {
    return;
  } else {
    // Requête classique (fallback)
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
  }
});

// Gestion des requêtes de fichiers (file handlers)
async function handleFileRequest(request) {
  const fileType = request.headers.get('accept'); // Exemple de lecture des types acceptés
  // Logique pour gérer le fichier en fonction de son type
  return new Response(`Fichier accepté de type : ${fileType}`);
}

// Gestion des protocoles personnalisés (protocol handlers)
async function handleProtocolRequest(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  // Logique pour gérer le protocole personnalisé (myapp://)
  return new Response(`Protocole personnalisé reçu avec l'URL : ${targetUrl}`);
}

// Background Sync pour les entrées de journal
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

// Synchronisation des données offline depuis IndexedDB
async function syncTodos() {
  console.log('Synchronisation en arrière-plan : récupération des journaux offline...');

  const data = await getJournalEntriesFromIndexedDB();

  if (data && data.length > 0) {
    try {
      const response = await fetch('/sync-endpoint', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        console.log('Journaux synchronisés avec succès.');
        clearJournalEntriesFromIndexedDB();
      }
    } catch (error) {
      console.error('Erreur de synchronisation', error);
    }
  }
}

// Lecture des entrées depuis IndexedDB
function getJournalEntriesFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("toxDetectDB", 1);

    request.onerror = (event) => {
      console.error("Erreur d'ouverture IndexedDB : ", event.target.errorCode);
      resolve([]);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["journalEntries"], "readonly");
      const store = transaction.objectStore("journalEntries");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };

      getAllRequest.onerror = (event) => {
        console.error("Erreur de lecture : ", event.target.error);
        reject(event.target.error);
      };
    };
  });
}

// Suppression des entrées après synchro
function clearJournalEntriesFromIndexedDB() {
  const request = indexedDB.open("toxDetectDB", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["journalEntries"], "readwrite");
    const store = transaction.objectStore("journalEntries");
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      console.log("Entrées de journal effacées après synchro.");
    };

    clearRequest.onerror = (event) => {
      console.error("Erreur lors du clear : ", event.target.error);
    };
  };
}

// Périodic Sync (si supporté)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-periodic') {
    event.waitUntil(syncTodos());
  }
});

// Optionnel : skip waiting depuis la page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
