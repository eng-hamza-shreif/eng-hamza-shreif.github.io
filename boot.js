(function () {
  // 1) Storage that throws (blocked cookies / private modes) must not kill the app.
  ['localStorage', 'sessionStorage'].forEach(function (n) {
    var ok = true;
    try { var s = window[n]; s.setItem('__t', '1'); s.removeItem('__t'); } catch (e) { ok = false; }
    if (!ok) {
      var mem = {};
      var fake = { getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; }, clear: function () { mem = {}; }, key: function (i) { return Object.keys(mem)[i] || null; } };
      Object.defineProperty(fake, 'length', { get: function () { return Object.keys(mem).length; } });
      try { Object.defineProperty(window, n, { value: fake, configurable: true }); } catch (e) {}
      window.__hzStore = 'mem';
    }
  });
  function root() { return document.getElementById('root'); }
  function loading() { return !!document.getElementById('hz-boot'); }
  function blank() { var r = root(); return !!r && (loading() || r.children.length === 0); }
  var errors = [];
  function ua() { var m = (navigator.userAgent || '').match(/(Chrome|Firefox|Version|SamsungBrowser|CriOS|FxiOS)\/[\d.]+/); var a = (navigator.userAgent.match(/Android [\d.]+|iPhone OS [\d_]+/) || [''])[0]; return (m ? m[0] : 'ua?') + ' ' + a; }
  function feat() {
    var f = [];
    f.push('mod:' + (('noModule' in HTMLScriptElement.prototype) ? 'y' : 'n'));
    f.push('sw:' + ('serviceWorker' in navigator ? 'y' : 'n'));
    f.push('fetch:' + (typeof fetch));
    if (window.__hzStore) f.push('store:mem');
    return f.join(' ');
  }
  function res() {
    try {
      var out = [];
      performance.getEntriesByType('resource').forEach(function (e) {
        if (/assets\/index-.*\.(js|css)/.test(e.name)) out.push(e.name.split('/').pop().replace(/-[A-Za-z0-9_]+\./, '.') + ':' + Math.round(e.duration) + 'ms/' + (e.transferSize || 0) + 'B');
      });
      return out.join(' ');
    } catch (e) { return ''; }
  }
  function diag() {
    var d = document.getElementById('hz-dg'); if (!d) return;
    d.textContent = 'code: ' + (errors.slice(-2).join(' | ') || 'none') + ' | ' + ua() + ' | ' + feat() + ' | ' + res();
  }
  function ensureBox() {
    var r = root(); if (!r) return null;
    var d = document.getElementById('hz-boot');
    if (!d) {
      r.innerHTML = '';
      d = document.createElement('div'); d.id = 'hz-boot';
      var b = document.createElement('b'); b.textContent = 'علمنا'; d.appendChild(b);
      var s = document.createElement('span'); s.id = 'hz-bt'; d.appendChild(s);
      r.appendChild(d);
    }
    if (!document.getElementById('hz-dg')) {
      var g = document.createElement('small'); g.id = 'hz-dg'; g.setAttribute('dir', 'ltr');
      g.style.cssText = 'max-width:92%;word-break:break-all;font-size:11px;opacity:.8;user-select:all';
      d.appendChild(g);
    }
    return d;
  }
  function note(msg) { ensureBox(); var t = document.getElementById('hz-bt'); if (t) t.textContent = msg; }
  function addButton() {
    var d = ensureBox();
    if (!d || document.getElementById('hz-rb')) return;
    var k = document.createElement('button'); k.id = 'hz-rb'; k.textContent = 'حاول تاني';
    k.onclick = function () { location.reload(); }; d.appendChild(k);
  }
  function fail(msg) {
    errors.push(String(msg).slice(0, 180));
    if (!blank()) return;
    note('حصلت مشكلة في التحميل. ابعت الكود اللي تحت لحمزة.');
    addButton(); diag();
  }
  window.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t !== window && (t.src || t.href)) { fail('load-fail ' + String(t.src || t.href).split('/').pop()); return; }
    fail((e.message || 'error') + (e.filename ? ' @' + String(e.filename).split('/').pop() + ':' + e.lineno : ''));
  }, true);
  window.addEventListener('unhandledrejection', function (e) { fail('rej ' + (e.reason && (e.reason.message || e.reason))); });
  // 2) Retry the entry script a few times if it fails outright.
  var tries = 0;
  function retryScript() {
    if (!loading() || tries >= 3) return false;
    tries++;
    var m = document.querySelector('script[type=module]');
    if (!m) return false;
    var src = (m.getAttribute('src') || '').split('?')[0];
    setTimeout(function () {
      if (!loading()) return;
      var s = document.createElement('script');
      s.type = 'module'; s.src = src + '?r=' + tries;
      s.addEventListener('error', function () { retryScript(); });
      document.head.appendChild(s);
    }, 3000 * tries);
    return true;
  }
  var m0 = document.querySelector('script[type=module]');
  if (m0) m0.addEventListener('error', function () { retryScript(); });
  if (!('noModule' in HTMLScriptElement.prototype)) { note('المتصفح قديم ومش بيشغّل الموقع. حدّث Chrome أو افتحه من متصفح تاني.'); addButton(); }
  setTimeout(function () { if (loading()) { note('لسه بيحمّل... النت بطيء شوية. متقفلش الصفحة.'); ensureBox(); diag(); } }, 15000);
  setTimeout(function () { if (loading()) { note('لسه مفتحش. لو ده طول، ابعت الكود اللي تحت لحمزة.'); addButton(); diag(); } }, 40000);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }
})();
