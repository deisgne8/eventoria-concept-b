(() => {
  const section = document.querySelector('.about-beliefs-process');
  if (!section) return;
  const cards = [...section.querySelectorAll('.process-card')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = () => section.classList.add('is-visible');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    reveal();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, {threshold: .18});
  observer.observe(section);
})();
