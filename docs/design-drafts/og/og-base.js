// ?lang=en|ko, ?theme=light|dark (default light: OG is a fixed image, not OS-dependent).
// Elements with data-ko swap their text on ko; [lang-only] blocks are hidden by CSS.
(function () {
  var q = new URLSearchParams(location.search);
  var d = document.documentElement;
  d.lang = q.get('lang') === 'ko' ? 'ko' : 'en';
  d.dataset.theme = q.get('theme') === 'dark' ? 'dark' : 'light';
  var KM = '<svg class="km" viewBox="0 0 16 16" aria-hidden="true"><rect class="tile" width="16" height="16" rx="3.5"/>' +
    '<path class="ink" d="M3 4h1v8H3z M5.8 4H7.2L4 9V7z M4.7 7.9L5.6 6.8L7.3 12H5.9z M8 4h1v8H8z M12 4h1v8h-1z M8.4 4H9.5L10.5 7.4L11.5 4H12.6L11.1 9.4H9.9z"/></svg>';
  document.addEventListener('DOMContentLoaded', function () {
    if (d.lang === 'ko') document.querySelectorAll('[data-ko]').forEach(function (e) { e.textContent = e.dataset.ko; });
    document.querySelectorAll('[data-km]').forEach(function (e) {
      e.innerHTML = KM;
      if (e.dataset.km === 'inv') e.firstChild.classList.add('inv');
    });
  });
})();
