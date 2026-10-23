/* =============================================================
   js/closing-cta.js   (home page)
   Plays the closing section's entrance animation once, when it
   scrolls into view. Skipped for visitors who prefer reduced
   motion, who simply see the finished section.
   ============================================================= */
(function () {
  var el = document.querySelector('.ccta');
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches || !('IntersectionObserver' in window)) return;

  el.classList.add('js');                      // hides the pieces so they can animate in
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { el.classList.add('in'); io.disconnect(); }
  }, { threshold: .3 });
  io.observe(el);
})();
