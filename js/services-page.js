/* =============================================================
   js/services-page.js   (Services page only)
   1. Fades sections in as they scroll into view
   2. Moves each service photo slightly while scrolling (parallax)
   3. "Find your fit": builds the occasion buttons and shows a
      suggestion when one is chosen
   Reduced-motion visitors get no animation, but the picker works.
   ============================================================= */
(function () {
  var page = document.querySelector('main.svc');
  if (!page) return;
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- 1 and 2: motion (skipped for reduced motion) ---- */
  if (!still && 'IntersectionObserver' in window) {
    page.classList.add('svc-js');                         // hides the pieces so they can animate in
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .2 });
    page.querySelectorAll('.svc-reveal').forEach(function (el) { io.observe(el); });

    // Parallax: --p goes from 1 (photo below the screen) to -1 (above it)
    var media = page.querySelectorAll('.svc-media');
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      media.forEach(function (m) {
        var r = m.getBoundingClientRect();
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        m.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
      });
      ticking = false;
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---- 3: find your fit ---- */
  var box = document.getElementById('svc-occ');
  var result = document.getElementById('svc-result');
  if (!box || !result) return;

  // Edit the occasions and suggestions here
  var OCCASIONS = [
    { label: 'Wedding',          title: 'Photography and video together',
      text: 'A wedding moves fast. Pairing photographs with a film means you keep both the stills and the feeling of the day.' },
    { label: 'Birthday',         title: 'Photography, with video if you like',
      text: 'Photographs capture the details and the smiles. Add a short film if you want to relive the energy of the celebration.' },
    { label: 'Graduation',       title: 'Photography',
      text: 'Portraits and milestone photographs, so the day is remembered as well as celebrated.' },
    { label: 'Personal branding', title: 'Photography and promotional video',
      text: 'Portraits and short videos that help you present yourself clearly on your website and social media.' },
    { label: 'Corporate event',  title: 'Event coverage',
      text: 'We capture the highlights, from the people to the atmosphere, in photographs, film, or both.' },
    { label: 'Creative project', title: 'Videography',
      text: 'A creative video or personal film shaped around your idea.' }
  ];

  var titleEl = document.getElementById('svc-result-title');
  var textEl = document.getElementById('svc-result-text');
  var buttons = [];

  function choose(i) {
    buttons.forEach(function (b, k) { b.setAttribute('aria-checked', k === i); b.tabIndex = (k === i) ? 0 : -1; });
    var show = function () {
      titleEl.textContent = OCCASIONS[i].title;
      textEl.textContent = OCCASIONS[i].text;
      result.classList.remove('swap');
    };
    if (still) { show(); return; }
    result.classList.add('swap');                          // fade out, swap the words, fade back in
    setTimeout(show, 260);
  }

  OCCASIONS.forEach(function (o, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false');
    b.tabIndex = i === 0 ? 0 : -1;
    b.textContent = o.label;
    b.addEventListener('click', function () { choose(i); });
    b.addEventListener('keydown', function (e) {           // arrow keys move between options
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % OCCASIONS.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + OCCASIONS.length) % OCCASIONS.length;
      if (n !== null) { e.preventDefault(); choose(n); buttons[n].focus(); }
    });
    box.appendChild(b);
    buttons.push(b);
  });
})();
