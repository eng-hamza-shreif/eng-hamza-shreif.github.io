// Offline cache: hashed assets are cache-first, pages are stale-while-revalidate.
var C = 'hz-v3';
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

// Study reminder push (no payload): the worker wakes us, we show a fixed message.
self.addEventListener('push', function (e) {
  e.waitUntil(self.registration.showNotification('علمنا · وقت مذاكرتك', {
    body: 'ابدأ بتحدي النهاردة أو كمّل من آخر درس.',
    icon: './icon-192.png', badge: './favicon-48.png', tag: 'hz-study', renotify: false, lang: 'ar', dir: 'rtl', data: { url: './#/challenge' }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ('focus' in cs[i]) { cs[i].navigate(url).catch(function () {}); return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
