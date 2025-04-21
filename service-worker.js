const CACHE_NAME = 'PWA-Toxdetect-cache';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/index.js',
    '/styles.css', 
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

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
    );
});

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

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});

