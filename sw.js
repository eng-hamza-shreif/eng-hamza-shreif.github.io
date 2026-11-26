// Offline cache: hashed assets are cache-first, pages are stale-while-revalidate.
var C = 'hz-v2';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (/version\.json$/.test(u.pathname) || /sw\.js$/.test(u.pathname)) return;
  if (/\/assets\//.test(u.pathname)) {
    e.respondWith(caches.open(C).then(function (c) {
      return c.match(r).then(function (m) {
        return m || fetch(r).then(function (res) { if (res.ok) c.put(r, res.clone()); return res; });
      });
    }));
    return;
  }
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(r, { ignoreSearch: true }).then(function (m) {
      var net = fetch(r).then(function (res) { if (res.ok) c.put(r, res.clone()); return res; }).catch(function () { return m; });
      return m || net;
    });
  }));
});
