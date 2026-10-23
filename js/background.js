/* =============================================================
   js/background.js   (every page)
   Adds the living background layers behind the page and makes the
   soft spotlight follow the cursor (desktop only).
   The styles are in css/background.css, which this file loads for
   you if the page hasn't linked it already.
   ============================================================= */
(function () {
  if (document.querySelector('.bg-fx')) return;

  // Load the stylesheet (skipped if the page already links it)
  if (!document.querySelector('link[href$="background.css"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/background.css';
    document.head.appendChild(link);
  }

  // The layers, in the order they stack
  var fx = document.createElement('div');
  fx.className = 'bg-fx';
  fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML =
    '<span class="bg-blob a"></span><span class="bg-blob b"></span><span class="bg-blob c"></span>' +
    '<span class="bg-thirds"></span><span class="bg-grain"></span><span class="bg-cursor"></span>';
  document.body.insertBefore(fx, document.body.firstChild);

  // Spotlight: only on devices with a mouse, and not for reduced motion
  var mouse = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!mouse || still) return;

  var light = fx.querySelector('.bg-cursor');
  var tx = 0, ty = 0, x = 0, y = 0, running = false, shown = false;

  // Glide toward the pointer, and stop animating once it arrives (saves battery)
  function tick() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    light.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(tick);
    else running = false;
  }

  addEventListener('pointermove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { x = tx; y = ty; shown = true; light.style.opacity = 1; }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });

  document.addEventListener('mouseleave', function () { light.style.opacity = 0; shown = false; });
})();
