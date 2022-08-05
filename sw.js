
var CACHE_NAME = 'scapegoat-v1-cache';

var urlsToCache = [
  '/scapegoat/',
  '/scapegoat/app.js',
  '/scapegoat/styles.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response);
            return response;
          });
        })
        .catch(function() {
          caches.match(event.request).then(function(response) {
            return response;
          });
        })
    );
});
