/* =============================================================
   js/frames.js   (loaded on every page)
   Photo helper. It puts your photos from data/photos.js into the
   photo "frames" on the page, and offers SiteFrames.make() so
   other scripts can build new frames (used by the gallery and
   the page banners).
   ============================================================= */
(function () {
  var photos = window.PHOTOS || [];
  var urls = photos.map(function (p) { return p.src; });
  var POS = ['50% 50%', '30% 40%', '70% 60%', '50% 20%', '20% 70%', '80% 40%']; // crop focus, so repeats look different

  // Build one frame: a gradient placeholder with a photo on top (if any photos exist).
  function make(i, offset, url, alt) {
    var d = document.createElement('div');
    d.className = 'frame';
    d.style.setProperty('--g', 'linear-gradient(160deg,hsl(' + ((i * 47 + offset * 60) % 360) + ',28%,34%),#16181d)');
    if (url || urls.length) {
      var im = document.createElement('img');
      im.alt = alt || '';
      im.loading = 'lazy';
      im.src = url || urls[(i + offset) % urls.length];
      im.style.objectPosition = (20 + (i * 23) % 60) + '% ' + (25 + (i * 31) % 50) + '%';
      d.appendChild(im);
    }
    return d;
  }

  // Fill the frames already written in the page's HTML, in order, cycling through your photos.
  function fillStatic() {
    if (!urls.length) return;
    document.querySelectorAll('.frame').forEach(function (f, i) {
      if (f.querySelector('img')) return;
      var im = document.createElement('img');
      im.src = urls[i % urls.length];
      im.alt = '';
      im.loading = 'lazy';
      im.style.objectPosition = POS[(i * 5) % POS.length];
      f.appendChild(im);
    });
  }

  window.SiteFrames = { photos: photos, make: make };
  fillStatic();
})();
