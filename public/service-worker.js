const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/css/styles.css",
    "/js/index.js",
    "/js/idb.js",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png"
];
  
// Install the service worker
self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log('Your files were pre-cached successfully!');
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
});
  
// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME) {
              console.log('Removing old cache data', key);
              return caches.delete(key);
            }
          })
        );
        })
    );
  
    self.clients.claim();
});
  
// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) { // if cache is available, respond with cache
          return request
        } else {       // if there are no cache, try fetching request
          return fetch(e.request)
        }
      })
    )
});