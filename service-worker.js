self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('PWA-Toxdetect-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/index.js',
                '/styles.css', 
                '/abon.html',
                '/audio.html', 
                '/auth.html',
                '/conditions.html', 
                '/confidentialite.html',
                '/faq.html', 
                '/infos.html',
                '/infos.js', 
                '/journal.html',
                '/journal.js', 
                '/parametres.html',
                '/quiz.html', 
                '/quiz.js',
                '/urgences.html',
                '/urgences.js', 
                '/video.html',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
