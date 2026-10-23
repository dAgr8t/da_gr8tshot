/* =============================================================
   js/layout.js   (loaded on every page)
   Builds the shared header and footer so the menu and footer text
   live in ONE place. To add or rename a menu link, edit LINKS.
   The active page is highlighted using <body data-page="...">.
   Business details come from data/site.js.
   ============================================================= */
(function () {
  var SITE = window.SITE || {};
  var page = document.body.getAttribute('data-page') || '';

  // [page key, link, label]
  var LINKS = [
    ['home', 'index.html', 'Home'],
    ['about', 'about.html', 'About'],
    ['services', 'services.html', 'Services'],
    ['portfolio', 'portfolio.html', 'Portfolio'],
    ['contact', 'contact.html', 'Contact']
  ];

  // ---- Header ----
  var links = LINKS.map(function (l) {
    var on = l[0] === page;
    return '<a href="' + l[1] + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + l[2] + '</a>';
  }).join('');
  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML =
      '<div class="wrap">' +
      '<a class="logo" href="index.html"></a>' +
      // The menu button: three lines (drawn by css/layout.css) that turn into an X when open
      '<button id="menu" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>' +
      '<nav id="nav"><span class="links">' + links + '</span></nav>' +
      '</div>';
    header.querySelector('.logo').textContent = SITE.name || 'Your Name Photography';

    // Phone menu: open and close
    var menu = document.getElementById('menu'), nav = document.getElementById('nav');
    function setMenu(open) {
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menu.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });             // choosing a link closes the menu
    document.addEventListener('keydown', function (e) {                                                     // Esc closes it
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
    });
    document.addEventListener('click', function (e) {                                                       // tapping outside closes it
      if (nav.classList.contains('open') && !header.contains(e.target)) setMenu(false);
    });
    matchMedia('(min-width:861px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });   // back to desktop: reset
  }

  // ---- Footer ----
  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML =
      '<div class="wrap"><div class="fgrid">' +

      '<div><a class="logo" href="index.html" data-t="name"></a>' +
      '<p style="margin-top:.8rem">Photography built around stories, with every frame planned around what matters to you.</p></div>' +

      '<div><h3>Contact</h3><ul><li data-t="email"></li><li data-t="phone"></li><li><a href="' + (SITE.instagram || '#') + '">Instagram</a></li></ul></div>' +

      '<div><h3>Quick links</h3><ul>' +
      '<li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li>' +
      '<li><a href="services.html">Services</a></li></ul></div>' +
      '<div><h3>More</h3><ul>' +
      '<li><a href="portfolio.html">Portfolio</a></li>' +
      '<li><a href="contact.html">Contact</a></li></ul></div>' +
      '</div><div class="fbar">&copy; <span id="yr"></span> <span data-t="name"></span>. All rights reserved.</div></div>';
    footer.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = SITE[el.getAttribute('data-t')] || ''; });
    document.getElementById('yr').textContent = new Date().getFullYear();
  }

  // Any element marked data-site="email" (or name, phone, address) shows the value from data/site.js
  document.querySelectorAll('[data-site]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site')];
    if (v) el.textContent = v;
  });

  // Load the living background (css/background.css and js/background.js)
  var bg = document.createElement('script');
  bg.src = 'js/background.js';
  document.body.appendChild(bg);
})();

