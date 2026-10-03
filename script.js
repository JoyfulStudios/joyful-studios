/* Joyful Studios: shared scripts (all pages) */

// Mobile menu
(function () {
  var header = document.getElementById('site-header');
  var btn = document.getElementById('menu-toggle');
  if (!header || !btn) return;
  btn.addEventListener('click', function () {
    var open = header.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
  header.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// "Packages" dropdowns (header + footer)
// Desktop with a mouse: opens on hover / keyboard focus (CSS). Touch + mobile: opens on tap.
(function () {
  var canHover = window.matchMedia('(hover: hover) and (min-width: 761px)');
  var dropdowns = document.querySelectorAll('.has-dropdown');

  function setOpen(dd, open) {
    dd.classList.toggle('is-open', open);
    dd.querySelector('.dd-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.dd-toggle');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (canHover.matches) return;           // hover/focus handles it
      var willOpen = !dd.classList.contains('is-open');
      dropdowns.forEach(function (other) { setOpen(other, false); });
      setOpen(dd, willOpen);
    });

    // keep aria-expanded accurate for mouse + keyboard users
    dd.addEventListener('mouseenter', function () { if (canHover.matches) toggle.setAttribute('aria-expanded', 'true'); });
    dd.addEventListener('mouseleave', function () { if (canHover.matches && !dd.contains(document.activeElement)) toggle.setAttribute('aria-expanded', 'false'); });
    dd.addEventListener('focusin', function () { if (canHover.matches) toggle.setAttribute('aria-expanded', 'true'); });
    dd.addEventListener('focusout', function (e) { if (canHover.matches && !dd.contains(e.relatedTarget)) toggle.setAttribute('aria-expanded', 'false'); });
  });

  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dd) { if (!dd.contains(e.target)) setOpen(dd, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    dropdowns.forEach(function (dd) {
      if (dd.contains(document.activeElement)) document.activeElement.blur();
      setOpen(dd, false);
    });
  });
})();

// Hero slider (only runs on pages that have one)
(function () {
  var slides = document.querySelectorAll('.slide');
  var dotsWrap = document.querySelector('.hero__dots');
  if (!slides.length || !dotsWrap) return;
  var i = 0, timer;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach(function (_, n) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (n + 1));
    b.addEventListener('click', function () { go(n); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }
  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(function () { go(i + 1); }, 6000);
  }
  document.querySelector('.hero__arrow--prev').addEventListener('click', function () { go(i - 1); restart(); });
  document.querySelector('.hero__arrow--next').addEventListener('click', function () { go(i + 1); restart(); });
  go(0); restart();
})();
