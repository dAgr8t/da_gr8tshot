/* =============================================================
   js/reveal.js   (loaded on every page)
   Fades cards, albums, plans, posts and quotes in as they scroll
   into view. Skipped for visitors who prefer reduced motion.
   ============================================================= */
(function () {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.card,.album,.plan,.post,blockquote,.facts,.stack').forEach(function (el) {
    el.classList.add('rv');
    io.observe(el);
  });
})();
