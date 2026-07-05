const CACHE = 'vm-cache-v2';
addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) {
    return c.addAll(['/']);
  }));
  skipWaiting();
});
addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
      })
    ])
  );
});
addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.match(/\.(js|css|html)$/)) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        return caches.open(CACHE).then(function(c) { c.put(e.request, res.clone()); return res; });
      }).catch(function() {
        return caches.match(e.request).then(function(r) { return r || new Response('Offline', { status: 503 }); });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(r) {
        return r || fetch(e.request).then(function(res) {
          return caches.open(CACHE).then(function(c) { c.put(e.request, res.clone()); return res; });
        }).catch(function() { return new Response('Offline', { status: 503 }); });
      })
    );
  }
});
