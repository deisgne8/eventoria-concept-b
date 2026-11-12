(() => {
  const cards = document.querySelectorAll('.expertise-content-card');
  if (!cards.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('text-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
  cards.forEach(card => { card.classList.add('text-reveal-ready'); observer.observe(card); });
})();
