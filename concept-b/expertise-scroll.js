(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.expertise-content-card'));
  var splitImages = Array.prototype.slice.call(document.querySelectorAll('.expertise-split-visual img'));
  if (splitImages.length) {
    var splitFrame = 0;
    function updateSplit() {
      splitFrame = 0;
      var focusLine = innerHeight * .42, active = 0;
      cards.forEach(function (card, index) { if (card.getBoundingClientRect().top <= focusLine) active = index; });
      splitImages.forEach(function (image, imageIndex) { image.classList.toggle('is-active', imageIndex === active); });
    }
    function requestSplit() { if (!splitFrame) splitFrame = requestAnimationFrame(updateSplit); }
    addEventListener('scroll', requestSplit, {passive:true});
    addEventListener('resize', requestSplit);
    requestSplit();
    var splitObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = cards.indexOf(entry.target);
        if (index < 0) return;
        splitImages.forEach(function (image, imageIndex) { image.classList.toggle('is-active', imageIndex === index); });
      });
    }, {rootMargin: '-42% 0px -42% 0px', threshold: 0});
    cards.forEach(function (card) { splitObserver.observe(card); });
  }
  var hero = document.querySelector('.expertise-page-hero');
  cards.forEach(function (card) {
    [card.querySelector('span'), card.querySelector('h3'), card.querySelector('p')].concat(Array.prototype.slice.call(card.querySelectorAll('li'))).filter(Boolean).forEach(function (part, partIndex) {
      part.style.setProperty('--expertise-reveal-delay', (partIndex === 0 ? 0 : partIndex === 1 ? 100 : partIndex === 2 ? 180 : 180 + (partIndex - 2) * 80) + 'ms');
      part.classList.add('expertise-reveal-item');
    });
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (card) { card.classList.add('is-visible'); });
    if (hero) hero.classList.add('is-visible');
    return;
  }
  if (!window.gsap || !window.ScrollTrigger) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold: 0.14});
    cards.forEach(function (card) { observer.observe(card); });
    if (hero) hero.classList.add('is-visible');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  cards.forEach(function (card, index) {
    var textParts = [card.querySelector('span'), card.querySelector('h3'), card.querySelector('p')].concat(Array.prototype.slice.call(card.querySelectorAll('li'))).filter(Boolean);
    textParts.forEach(function (part, partIndex) { part.style.setProperty('--expertise-reveal-delay', (partIndex === 0 ? 0 : partIndex === 1 ? 100 : partIndex === 2 ? 180 : 180 + (partIndex - 2) * 80) + 'ms'); part.classList.add('expertise-reveal-item'); });
    gsap.from(card, {
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      delay: index * 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: function () { card.classList.add('expertise-text-visible'); }
      }
    });
  });
  var textObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('expertise-text-visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, {rootMargin: '0px 0px -20% 0px', threshold: 0.01});
  cards.forEach(function (card) { textObserver.observe(card); });
})();
