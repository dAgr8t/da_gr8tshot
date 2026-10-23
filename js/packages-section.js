/* =============================================================
   js/packages-section.js   (home page)
   - Opens a panel on mouse hover, tap, click or keyboard focus
   - Moves the soft light inside a panel to follow the cursor
   - Lifts the panels in one after another when scrolled into view
   ============================================================= */
(function () {
  var root = document.querySelector('.pkx');
  if (!root) return;
  var panels = [].slice.call(root.querySelectorAll('.pkx-panel'));
  var wide = matchMedia('(min-width: 900px)');

  root.classList.add('js');                         // turns on the expanding behaviour

  function open(panel) {
    panels.forEach(function (p) { p.classList.toggle('is-active', p === panel); });
  }

  panels.forEach(function (panel) {
    // Mouse hover opens it (desktop only, so touch scrolling isn't hijacked)
    panel.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse' && wide.matches) open(panel);
    });
    panel.addEventListener('click', function () { open(panel); });     // tap or click
    panel.addEventListener('focusin', function () { open(panel); });   // keyboard

    // Cursor light
    panel.addEventListener('pointermove', function (e) {
      var r = panel.getBoundingClientRect();
      panel.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      panel.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Entrance animation
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('anim');
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { root.classList.add('in'); io.disconnect(); }
    }, { threshold: .2 });
    io.observe(root.querySelector('.pkx-row'));
  }
})();