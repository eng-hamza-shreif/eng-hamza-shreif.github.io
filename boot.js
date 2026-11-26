(function () {
  function root() { return document.getElementById('root'); }
  function loading() { return !!document.getElementById('hz-boot'); }
  function show(msg) {
    var r = root(); if (!r || !loading()) return;
    r.innerHTML = '';
    var d = document.createElement('div'); d.id = 'hz-boot';
    var b = document.createElement('b'); b.textContent = 'حمزة أكاديمي'; d.appendChild(b);
    var p = document.createElement('span'); p.textContent = msg; d.appendChild(p);
    var k = document.createElement('button'); k.textContent = 'حاول تاني';
    k.onclick = function () { location.reload(); }; d.appendChild(k);
    r.appendChild(d);
  }
  window.addEventListener('error', function (e) { if (loading()) show('حصلت مشكلة في التحميل. اتأكد من النت وجرب تاني.'); });
  var m = document.querySelector('script[type=module]');
  if (m) m.addEventListener('error', function () { show('الصفحة ما تحمّلتش، النت ضعيف أو اتقطع. جرب تاني.'); });
  setTimeout(function () { if (loading()) { var t = document.getElementById('hz-bt'); if (t) t.textContent = 'لسه بيحمّل... النت بطيء شوية. استنى شوية.'; } }, 12000);
  setTimeout(function () { if (loading()) show('التحميل أخد وقت طويل. جرب تحديث الصفحة.'); }, 45000);
})();
