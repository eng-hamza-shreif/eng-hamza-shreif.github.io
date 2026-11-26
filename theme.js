(function () {
  try {
    var v = localStorage.getItem('hz-theme');
    if (v !== 'light' && v !== 'auto') v = 'dark';
    var d = v === 'dark' || (v === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', d ? '#0a1322' : '#0a1f44');
  } catch (e) { document.documentElement.setAttribute('data-theme', 'dark'); }
})();
