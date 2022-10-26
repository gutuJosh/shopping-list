const version = "V1.0.2";
const offlineCacheName = "offline" + version;

const cacheList = [offlineCacheName];

const offlineAppFiles = [
  "favicon.ico",
  "/images/logo-48.png",
  "/images/logo-96.png",
  "/images/logo-128.png",
  "/images/logo-144.png",
  "/images/logo-192.png",
  "/images/logo-512.png",
  "manifest.json",
  "service-worker.js",
  "index.html",
];

const Domain = "";

/*//////////////////////////////////////////////
--------------------CHACHE----------------
 cache static resource: .css, .js, img,  .html files
*/ ///////////////////////////////////////////////

addEventListener("install", (installEvent) => {
  skipWaiting(); // make sure the service worker takes control immediately, without having to close your browser window.
  installEvent.waitUntil(
    caches.open(offlineCacheName).then((offlineCache) => {
      // Cache app must have files here
      offlineCache.addAll(offlineAppFiles);
      return offlineCache.addAll([]);
    }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener("activate", (activateEvent) => {
  //event is triggered when someone returns to your site
  activateEvent.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheList.includes(cacheName) === false) {
              return caches.delete(cacheName);
            } // end if
          }) // end map
        ); // end return Promise.all
      }) // end keys then
      .then(() => {
        return clients.claim();
      }) // end then
  ); // end waitUntil
});

addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;

  fetchEvent.respondWith(
    //Look for a cached version of the file
    caches.match(request).then((responseFromCache) => {
      if (responseFromCache) {
        // Fetch a fresh version from the network
        fetchEvent.waitUntil(
          fetch(request)
            .then((responseFromFetch) => {
              // Update the cache
              caches.open(offlineCacheName).then((pageCache) => {
                return pageCache
                  .put(request, responseFromFetch)
                  .catch((error) => {
                    console.log(error.message);
                    //trimCache(offlineAppFiles, 10);
                  });
              }); // end open then
            }) // end fetch then
            .catch((error) => {
              console.log(error);
            })
        ); // end waitUntil

        return responseFromCache;
      } //end if responseFromCache
      // Otherwise fetch the file from the network
      return fetch(request)
        .then((responseFromFetch) => {
          // Put a copy in the cache
          const copy = responseFromFetch.clone();
          fetchEvent.waitUntil(
            caches.open(offlineCacheName).then((pageCache) => {
              return pageCache.put(request, copy).catch((error) => {
                console.log(error.message);
                //trimCache(offlineAppFiles, 10);
              });
            }) // end open then
          ); // end waitUntil
          return responseFromFetch;
        }) // end fetch then and return
        .catch((error) => {
          console.log(error.message);
        }); // end fetch catch and return
    })
  ); // end respondWith
});

//delete items from cache
function trimCache(cacheName, maxItems) {
  caches.open((cacheName) => {
    cache.keys().then((items) => {
      if (items.length > maxItems) {
        cache.delete(items[0]).then(trimCache(cacheName, maxItems)); // end delete then
      } // end if
    }); // end keys then
  }); // end open
} // end function
