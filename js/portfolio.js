/* =============================================================
   js/portfolio.js   (Portfolio page only)
   Builds everything from data/photos.js, so adding a photo only
   means adding one line there:
   1. One row per category (in the order each first appears), each
      with a title, two arrow buttons and a sliding row of cards
   2. The full-size viewer: click a photo, then use the arrow keys,
      swipe, or the side buttons. Esc or the X closes it. It moves
      through that category's photos.
   Optional per photo in data/photos.js:
     pos    which part stays in view when the square card crops it, e.g. "50% 20%"
     date   shown under the title, e.g. "March 2022"
   A link like  portfolio.html#events  scrolls straight to that category.
   ============================================================= */
(function () {
  var host = document.getElementById('pf-cats');
  var page = document.querySelector('main.pf');
  if (!host) return;

  var photos = window.PHOTOS || [];
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;

  if (!photos.length) {
    host.innerHTML = '<p class="pf-empty">New photos are on their way.</p>';
    return;
  }

  var ARROW_UP_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---- Group the photos by category, in order of first appearance ---- */
  var groups = [], byName = {};
  photos.forEach(function (p, i) {
    var name = p.category || 'More work';
    if (!byName[name]) { byName[name] = { name: name, cards: [] }; groups.push(byName[name]); }
    byName[name].cards.push(i);
  });

  var sections = [];

  /* ---- 1. Category rows ---- */
  groups.forEach(function (g) {
    var sec = document.createElement('section');
    sec.className = 'pf-cat';
    sec.id = slug(g.name);
    sec.setAttribute('aria-labelledby', sec.id + '-title');

    var head = document.createElement('div');
    head.className = 'pf-cat-head';
    var title = document.createElement('h2');
    title.className = 'pf-cat-title';
    title.id = sec.id + '-title';
    title.textContent = g.name;
    var arrows = document.createElement('div');
    arrows.className = 'pf-arrows';
    arrows.innerHTML =
      '<button type="button" class="pf-arrow pf-prev" aria-label="Previous in ' + g.name.replace(/"/g, '') + '">' + CHEV_L + '</button>' +
      '<button type="button" class="pf-arrow pf-next" aria-label="Next in ' + g.name.replace(/"/g, '') + '">' + CHEV_R + '</button>';
    head.appendChild(title);
    head.appendChild(arrows);
    sec.appendChild(head);

    var track = document.createElement('div');
    track.className = 'pf-track';
    sec.appendChild(track);

    var cards = [];
    g.cards.forEach(function (index, k) {
      var p = photos[index];

      var card = document.createElement('article');
      card.className = 'pf-card';
      card.style.setProperty('--k', Math.min(k, 6));         // delay for the rise-in, capped so it stays quick

      var media = document.createElement('a');
      media.className = 'pf-media';
      media.href = p.src;                                    // without JavaScript this opens the photo itself
      media.setAttribute('aria-label', 'View ' + (p.title || 'photo') + ' larger');
      var img = document.createElement('img');
      img.alt = p.title || '';
      img.loading = 'lazy';
      if (p.pos) img.style.objectPosition = p.pos;
      img.addEventListener('load', function () { img.classList.add('ld'); });
      img.src = p.src;
      if (img.complete) img.classList.add('ld');
      media.appendChild(img);
      card.appendChild(media);

      var meta = document.createElement('div');
      meta.className = 'pf-meta';
      var left = document.createElement('div');
      var name = document.createElement('h3'); name.className = 'pf-name'; name.textContent = p.title || '';
      left.appendChild(name);
      if (p.date) { var d = document.createElement('p'); d.className = 'pf-date'; d.textContent = p.date; left.appendChild(d); }
      var view = document.createElement('a');
      view.className = 'pf-view';
      view.href = p.src;
      view.setAttribute('aria-hidden', 'true');              // the photo itself is already a link
      view.tabIndex = -1;
      view.innerHTML = 'View photo ' + ARROW_UP_RIGHT;
      meta.appendChild(left);
      meta.appendChild(view);
      card.appendChild(meta);

      [media, view].forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // let "open in new tab" work
          e.preventDefault();
          openViewer(cards, k, media);
        });
      });

      cards.push({ el: card, index: index });
      track.appendChild(card);
    });

    /* Arrow buttons: slide by one card; switch off at the ends; hide when everything already fits */
    var prev = arrows.querySelector('.pf-prev');
    var next = arrows.querySelector('.pf-next');
    function step(dir) {
      var c = track.querySelector('.pf-card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      track.scrollBy({ left: dir * ((c ? c.offsetWidth : 300) + gap), behavior: still ? 'auto' : 'smooth' });
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      arrows.hidden = max <= 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();

    sections.push(sec);
    host.appendChild(sec);
  });

  /* ---- Entrance: each row's cards rise in when it scrolls into view ---- */
  if (page && !still && 'IntersectionObserver' in window) {
    page.classList.add('pf-js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .15 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---- A link like portfolio.html#events scrolls to that category ---- */
  var wanted = slug(decodeURIComponent(location.hash.slice(1)));
  var target = wanted && document.getElementById(wanted);
  if (target) target.scrollIntoView();

  /* ---- 2. Viewer ---- */
  var lb = document.createElement('div');
  lb.className = 'pf-lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<p class="pf-lb-count"></p>' +
    '<button type="button" class="pf-lb-btn pf-lb-close" aria-label="Close viewer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<button type="button" class="pf-lb-btn pf-lb-prev" aria-label="Previous photo">' + CHEV_L + '</button>' +
    '<button type="button" class="pf-lb-btn pf-lb-next" aria-label="Next photo">' + CHEV_R + '</button>' +
    '<div class="pf-lb-stage"><img class="pf-lb-img" alt=""></div>' +
    '<div class="pf-lb-cap"><p class="pf-lb-title"></p><p class="pf-lb-meta"></p></div>';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector('.pf-lb-img');
  var titleEl = lb.querySelector('.pf-lb-title');
  var metaEl = lb.querySelector('.pf-lb-meta');
  var countLb = lb.querySelector('.pf-lb-count');
  var closeBtn = lb.querySelector('.pf-lb-close');
  var prevBtn = lb.querySelector('.pf-lb-prev');
  var nextBtn = lb.querySelector('.pf-lb-next');
  var list = [], pos = 0, opener = null;

  function paint(i) {
    var p = photos[list[i].index];
    imgEl.src = p.src;
    imgEl.alt = p.title || '';
    titleEl.textContent = p.title || '';
    metaEl.textContent = [p.category, p.date].filter(Boolean).join(' · ');
    countLb.textContent = (i + 1) + ' / ' + list.length;
    prevBtn.hidden = nextBtn.hidden = list.length < 2;
    [1, -1].forEach(function (d) {                           // load the neighbours early, so moving on feels instant
      if (list.length > 1) new Image().src = photos[list[(i + d + list.length) % list.length].index].src;
    });
  }

  function show(i) {
    pos = (i + list.length) % list.length;
    if (still) { paint(pos); return; }
    lb.classList.add('swap');                                // fade out, change the photo, fade back in
    setTimeout(function () { paint(pos); lb.classList.remove('swap'); }, 160);
  }

  function openViewer(cardList, i, from) {
    list = cardList;
    opener = from || null;
    pos = i;
    paint(pos);
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('open');
    document.documentElement.classList.add('pf-lock');
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeViewer() {
    lb.classList.remove('open', 'swap');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('pf-lock');
    document.removeEventListener('keydown', onKey);
    if (opener) opener.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowRight') show(pos + 1);
    else if (e.key === 'ArrowLeft') show(pos - 1);
    else if (e.key === 'Tab') {                              // keep keyboard focus inside the viewer
      var f = [closeBtn, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  closeBtn.addEventListener('click', closeViewer);
  prevBtn.addEventListener('click', function () { show(pos - 1); });
  nextBtn.addEventListener('click', function () { show(pos + 1); });
  lb.querySelector('.pf-lb-stage').addEventListener('click', function (e) { if (e.target === this) closeViewer(); });   // click outside the photo

  // Swipe left or right on touch screens
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
