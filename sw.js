var APP_PREFIX = 'scapegoat_';
var VERSION = 'v1' 
var CACHE_NAME = APP_PREFIX + VERSION;

var urlsToCache = [
  '/scapegoat/',
  '/scapegoat/app.js',
  '/scapegoat/styles.css',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (request) {
            return request || fetch(e.request);
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheAllowlist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheAllowlist.push(CACHE_NAME);
            return Promise.all(keyList.map(function (key, i) {
            if (cacheAllowlist.indexOf(key) === -1) {
                return caches.delete(keyList[i]);
            }
            }));
        })
    );
});
