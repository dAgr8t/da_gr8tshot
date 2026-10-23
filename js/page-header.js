/* =============================================================
   js/page-header.js   (every inner page)
   Builds the scrolling photo columns behind the page title:
   5 columns, alternating up and down, each filled with photos
   from data/photos.js and doubled so the loop never jumps.
   ============================================================= */
(function () {
  var S = window.SiteFrames;
  var rows = document.querySelector('.rows');
  if (!S || !rows) return;

  for (var k = 0; k < 5; k++) {
    var col = document.createElement('div');
    col.className = 'track' + (k % 2 ? ' rev' : '');      // every second column scrolls the other way
    for (var i = 0; i < 8; i++) col.appendChild(S.make(i, k * 2));
    col.innerHTML += col.innerHTML;                         // duplicate for a seamless loop
    rows.appendChild(col);
  }
})();
