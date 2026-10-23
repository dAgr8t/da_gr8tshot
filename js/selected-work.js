/* =============================================================
   js/selected-work.js   (home page)
   Fills the Selected Work grid from data/photos.js.
   - Uses photos marked  featured: true  (up to 6)
   - If none are marked, it uses the first 6 photos in the list
   - If you have fewer than 6, photos repeat until the grid is full
   - An optional  pos: "50% 20%"  on a photo sets which part stays in view when it is cropped
   Then plays a rise-in animation when the section scrolls into view.
   ============================================================= */
(function () {
  var root = document.querySelector('.ws');
  var grid = document.getElementById('ws-grid');
  if (!root || !grid) return;

  var all = window.PHOTOS || [];
  var featured = all.filter(function (p) { return p.featured; });
  var list = (featured.length ? featured : all).slice(0, 6);

  // Fallback gradients, shown if a photo is missing
  var fallback = ['#6b4f3a', '#3d5a6b', '#5a4a7a', '#4a6a5a', '#7a5a45', '#4a5a8a'];
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';

  for (var i = 0; i < 6; i++) {
    var p = list.length ? list[i % list.length] : null;
    var a = document.createElement('a');
    a.className = 'ws-item';
    a.href = 'portfolio.html';
    a.style.setProperty('--i', i);
    a.style.setProperty('--g', 'linear-gradient(160deg,' + fallback[i] + ',#16181d)');
    if (p) a.setAttribute('aria-label', 'View ' + (p.title || 'this photo') + ' in the portfolio');

    if (p && p.src) {
      var img = document.createElement('img');
      img.src = p.src;
      img.alt = p.title || '';
      img.loading = 'lazy';
      if (p.pos) img.style.objectPosition = p.pos;   // optional focus point from data/photos.js, e.g. pos: "50% 20%"
      a.appendChild(img);
    }

    var cap = document.createElement('span');
    cap.className = 'ws-cap';
    var t = document.createElement('span'); t.className = 'ws-title'; t.textContent = p ? (p.title || '') : '';
    var c = document.createElement('span'); c.className = 'ws-cat';   c.textContent = p ? (p.category || '') : '';
    cap.appendChild(t); cap.appendChild(c);
    a.appendChild(cap);

    var ar = document.createElement('span');
    ar.className = 'ws-arrow';
    ar.setAttribute('aria-hidden', 'true');
    ar.innerHTML = arrow;
    a.appendChild(ar);

    grid.appendChild(a);
  }

  // Entrance animation (skipped for reduced motion; everything then just shows)
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { root.classList.add('in'); io.disconnect(); }
    }, { threshold: .15 });
    io.observe(grid);
  }
})();
