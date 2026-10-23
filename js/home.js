/* =============================================================
   js/home.js   (home page only)
   1. Soft light that follows the cursor over the hero
   2. Endless loop for the hero's scrolling photo columns
   ============================================================= */
(function () {
  // 1. Cursor light (skipped for visitors who prefer reduced motion)
  var hero = document.getElementById('hero');
  if (hero && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--x', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  }

  // 2. Repeat each column's photos once so the scroll animation loops without a jump
  document.querySelectorAll('.marq .col').forEach(function (c) { c.innerHTML += c.innerHTML; });
})();


