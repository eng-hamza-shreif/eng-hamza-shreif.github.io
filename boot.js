(function () {
  function root() { return document.getElementById('root'); }
  function loading() { return !!document.getElementById('hz-boot'); }
  var tries = 0;
  function retryScript() {
    if (!loading() || tries >= 3) { return false; }
    tries++;
    var m = document.querySelector('script[type=module]');
    if (!m) return false;
    var src = (m.getAttribute('src') || '').split('?')[0];
    setTimeout(function () {
      if (!loading()) return;
      var s = document.createElement('script');
      s.type = 'module'; s.src = src + '?r=' + tries;
      s.addEventListener('error', function () { if (!retryScript()) giveUp(); });
      document.head.appendChild(s);
    }, 3000 * tries);
    return true;
  }
  function note(msg) { var t = document.getElementById('hz-bt'); if (t) t.textContent = msg; }
  function addButton() {
    var d = document.getElementById('hz-boot');
    if (!d || document.getElementById('hz-rb')) return;
    var k = document.createElement('button'); k.id = 'hz-rb'; k.textContent = 'حاول تاني';
    k.onclick = function () { location.reload(); }; d.appendChild(k);
  }
  function giveUp() { note('النت ضعيف أو اتقطع. الصفحة لسه بتحاول، أو اضغط حاول تاني.'); addButton(); }
  var m = document.querySelector('script[type=module]');
  if (m) m.addEventListener('error', function () { if (!retryScript()) giveUp(); });
  setTimeout(function () { if (loading()) note('لسه بيحمّل... النت بطيء شوية. متقفلش الصفحة.'); }, 15000);
  setTimeout(function () { if (loading()) note('النت بطيء جداً. استنى، أول مرة بس هي اللي بتاخد وقت.'); }, 60000);
  setTimeout(function () { if (loading()) addButton(); }, 120000);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }
})();
