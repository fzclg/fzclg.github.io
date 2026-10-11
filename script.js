(function () {
  'use strict';

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () {
    setMenu(btn.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Highlight the current section in the nav
  var links = menu.querySelectorAll('a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  // Hide images that are not uploaded yet so the CSS placeholders show
  document.querySelectorAll('.thumb img, .portrait img').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

  // Effects
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  function progress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  progress();

  if (!reduce && 'IntersectionObserver' in window) {
    // Reveal on scroll, staggered inside each group
    document.documentElement.classList.add('js');
    var groups = document.querySelectorAll('.about, .grid, .links, .chips, .contact, .facts, .section > .wrap');
    var seen = new Set();
    groups.forEach(function (g) {
      var items = g.matches('.about, .contact, .section > .wrap') ? g.children : g.querySelectorAll(':scope > *');
      Array.prototype.forEach.call(items, function (el, i) {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i, 5) * 90 + 'ms';
      });
    });
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    seen.forEach(function (el) { rio.observe(el); });

    // Pointer spotlight on cards and profile links
    document.querySelectorAll('.card, .links a').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
