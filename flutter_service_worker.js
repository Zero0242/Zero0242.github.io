'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "a763e999e3c0677f86ea1dabcbf1f017",
"assets/AssetManifest.smcbin": "5475631c53e53f0ac747b8278af47a2b",
"assets/assets/icons/logo.png": "26c8bf4d404cb7d921f79e5e104153fb",
"assets/assets/icons/tewi-inaba-holding.png": "9529abcf95eba7c6a70a666136cc1971",
"assets/assets/images/burger_background.png": "d96461376b6e102d4c1663e6c145806e",
"assets/assets/images/error.png": "34a3c86257800bf5e90595c112370b19",
"assets/assets/images/gun.png": "eb466b5103ef84eaa3c6620f97682426",
"assets/assets/images/hat1.png": "698ded9884e2700c20de4cb4e65b15b7",
"assets/assets/images/neon_dark_sunset-1600x900.jpg": "68bea504b6e96bf818d7cf3ce7c2d894",
"assets/assets/images/new_neon.jpg": "4ee52c6abf0e60b9388c7a08bbddb621",
"assets/assets/images/tbh.jpeg": "6f1b16c620b402c069d7fa885a35fbca",
"assets/assets/images/tbh2.png": "c0462571abdaa897d575268109d6d56d",
"assets/assets/images/tewi-inaba-holding.png": "9529abcf95eba7c6a70a666136cc1971",
"assets/assets/sounds/bonk.mp3": "0163cd181b3dbf21152edd5be8029183",
"assets/assets/sounds/crit.mp3": "636e622a7a7264f9872dd55ad95220e6",
"assets/assets/sounds/fart.mp3": "cb42ea29c4fda924cd142ea377100b6f",
"assets/assets/sounds/pipe.mp3": "481e3aa0e4d4701d4a22edf09ae7149e",
"assets/assets/sounds/poink.mp3": "9e4b61e2d39379a94480ed81e716b23c",
"assets/assets/sounds/roland189.mp3": "fe05b394210e39e65df57d08da56f7df",
"assets/assets/sounds/slap.mp3": "90ce1c4dfb00faa35b257c9b7b1d797f",
"assets/assets/sounds/squish.mp3": "8ee43cabda05229f69cf60b59c4c7f7d",
"assets/assets/sounds/tbh2-ahh.mp3": "7f8e02bb6a3b37c3732ef47f1b613cae",
"assets/assets/sounds/yippee-147032.mp3": "0225131c9e67434b9003e07a51808b0c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "16c5e80a6a730f386c6550419d5134bf",
"assets/NOTICES": "d201876c169ce297e18253328c07ffc6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "951fcb1c774a4e75ced9e2b1e442a4d1",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "5a3a08bacc7bfa3e78a9d73df622a8c7",
"icons/Icon-512.png": "5f93bc083177e346efab16676b9b75b0",
"icons/Icon-maskable-192.png": "5a3a08bacc7bfa3e78a9d73df622a8c7",
"icons/Icon-maskable-512.png": "5f93bc083177e346efab16676b9b75b0",
"index.html": "da58230b2dbf7bdba81eb1204b8854e3",
"/": "da58230b2dbf7bdba81eb1204b8854e3",
"main.dart.js": "04c75449f25ad493679c8e0f20f7f3f6",
"manifest.json": "fd5d0ca027a01e33948394244ad5a673",
"version.json": "03acefc4795e8573b194262cd3a4419f"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
