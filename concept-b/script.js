(() => {
  const workStory = document.querySelector('.work-story');
  const workScroll = document.querySelector('.work-scroll');
  if (workStory && workScroll) { workStory.id = 'project-story'; workScroll.href = '#project-story'; }
  const toggle = document.querySelector('.menu-toggle'), panel = document.querySelector('.full-menu'), main = document.querySelector('main'), footer = document.querySelector('.site-footer');
  document.querySelectorAll('a[href="#contact"], a[href="index.html#contact"]').forEach(link => { link.href = 'Contact.html'; });
  // Keep display titles clean while leaving punctuation in body copy untouched.
  document.querySelectorAll('h1, h2, h3').forEach(title => {
    title.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\.\s*$/, '');
    });
  });
  document.querySelectorAll('.site-footer .footer-column:last-child span').forEach(link => {
    link.textContent = link.textContent.replace(/\s*↗\s*$/, '');
  });
  if (!toggle || !panel) return;
  let open = false;
  const setOpen = (value) => { open = value; document.body.classList.toggle('menu-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); panel.inert = !open; if (main) main.inert = open; if (footer) footer.inert = open; document.body.style.overflow = open ? 'hidden' : ''; (open ? panel.querySelector('a') : toggle)?.focus({preventScroll:true}); };
  toggle.addEventListener('click', () => setOpen(!open)); panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => { if (!open) return; if (event.key === 'Escape') setOpen(false); if (event.key === 'Tab') { const items = [toggle, ...panel.querySelectorAll('a')], first = items[0], last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.14});
    document.querySelectorAll('.work-story-card, .additional-card').forEach(item => observer.observe(item));
  }

  const storyData = [
    ['work-story-old.jpg?v=20261112-1124','CLIENT + OBJECTIVE / INSIGHT','Start with<br>what the moment<br>must mean','We define the client ambition, audience, place and occasion before a creative direction is approved.','portfolio-gala.jpg'],
    ['portfolio-gala.jpg','STORY + IDEA / MAKING','Turn a clear thought into a live world','The narrative becomes a designed experience through creative development, spatial thinking and production planning.','portfolio-festival.jpg'],
    ['portfolio-festival.jpg','CHALLENGE + MOMENT / OUTCOME','Make the difficult part feel effortless','We solve the practical challenge, direct the live moment and measure the outcome against the original brief.','portfolio-forum.jpg'],
    ['portfolio-forum.jpg','ROLE + CREDITS / APPROVALS','Make every contribution visible','Eventoria’s role, partners, approvals and delivery responsibilities are documented clearly from first sketch to final show.','portfolio-summit.jpg']
  ];
  const story = document.querySelector('.work-story-timeline');
  if (story) {
    const storySection = story.closest('.work-story');
    const buttons = [...story.querySelectorAll('[data-story]')];
    const nav = story.querySelector('.work-story-nav');
    const source = {image: story.querySelector('[data-story-image]'), side: story.querySelector('[data-story-side-image]'), step: story.querySelector('[data-story-step]'), label: story.querySelector('[data-story-label]'), title: story.querySelector('[data-story-title]'), copy: story.querySelector('[data-story-copy]')};
    const track = document.createElement('div');
    track.className = 'work-story-track';
    story.insertBefore(track, nav);
    const preview = document.createElement('div');
    preview.className = 'work-story-preview';
    preview.innerHTML = '<img alt="Next stage preview">';
    track.appendChild(preview);
    const panels = storyData.map((item, index) => {
      const panel = document.createElement('article');
      panel.className = 'work-story-panel';
      panel.innerHTML = `<div class="work-story-visual"><img src="assets/${item[0]}" alt="${item[2]}"></div><div class="work-story-detail"><span class="work-step">0${index + 1}</span><p class="work-card-label">${item[1]}</p><h3>${item[2]}</h3><p>${item[3]}</p></div>`;
      track.appendChild(panel);
      return panel;
    });
    [source.image?.closest('.work-story-visual'), source.image?.closest('.work-story-detail'), source.side?.closest('.work-story-side-visual')].forEach(node => node?.remove());
    source.step?.closest('.work-story-detail')?.remove();
    const setStory = index => buttons.forEach((button, i) => button.classList.toggle('is-active', i === index));
    let storyStart = 0, storyOffset = 0;
    const measureStory = () => {
      const wasFixed = story.classList.contains('is-fixed');
      story.classList.remove('is-fixed');
      const sectionTop = storySection.getBoundingClientRect().top + window.scrollY;
      storyStart = story.getBoundingClientRect().top + window.scrollY;
      storyOffset = storyStart - sectionTop;
      if (wasFixed) story.classList.add('is-fixed');
    };
    measureStory();
    buttons.forEach((button, i) => button.addEventListener('click', () => { const travel = Math.max(1, storySection.offsetHeight - storyOffset - window.innerHeight); window.scrollTo({top:storyStart + (i / (storyData.length - 1)) * travel, behavior:reducedMotion ? 'auto' : 'smooth'}); }));
    let queued = false, index = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
const updateFromScroll = () => { queued = false; if (window.innerWidth <= 760) { story.classList.remove('is-fixed'); storySection.classList.remove('is-story-active'); track.style.transform = 'none'; preview.style.display = 'none'; return; } const travel = Math.max(1, storySection.offsetHeight - storyOffset - window.innerHeight); const progress = clamp((window.scrollY - storyStart) / travel); const active = window.scrollY >= storyStart && window.scrollY <= storyStart + travel; story.classList.toggle('is-fixed', active); storySection.classList.toggle('is-story-active', active); const position = progress * (storyData.length - 1); const stage = Math.min(storyData.length - 1, Math.floor(position)); const fraction = stage === storyData.length - 1 ? 0 : position - stage; index = Math.max(0, Math.min(storyData.length - 1, stage)); track.style.transform = `translate3d(${-position * (100 / storyData.length)}%,0,0)`; panels.forEach((panel, panelIndex) => { panel.classList.toggle('is-current', panelIndex === index); panel.classList.toggle('is-next', panelIndex === index + 1); }); const showPreview = active && index < storyData.length - 1; preview.style.display = showPreview ? 'block' : 'none'; if (showPreview) { preview.querySelector('img').src = `assets/${storyData[index + 1][0]}`; const morphProgress = clamp((fraction - .18) / .42); preview.style.borderRadius = `${50 - morphProgress * 50}%`; const size = `clamp(${150 + fraction * 190}px, ${10 + fraction * 14}vw, ${180 + fraction * 260}px)`; preview.style.width = size; preview.style.height = size; preview.style.right = 'auto'; preview.style.left = `calc(76vw - ${position * 35}vw)`; preview.style.transform = 'translate3d(0, -50%, 0)'; } setStory(index); };
    const keepPreviewInPanel = () => {
      const activePanel = story.querySelector('.work-story-panel.is-current');
      if (!activePanel) return;
      if (preview.parentElement !== activePanel) activePanel.appendChild(preview);
      preview.style.left = 'auto';
      preview.style.right = '5vw';
    };
    const requestUpdate = () => { if (!queued) { queued = true; requestAnimationFrame(() => { updateFromScroll(); keepPreviewInPanel(); }); } };
    window.addEventListener('scroll', requestUpdate, {passive:true}); window.addEventListener('resize', () => { measureStory(); requestUpdate(); }); updateFromScroll(); keepPreviewInPanel();
  }

  const closeMedia = document.querySelector('.work-close-media');
  if (closeMedia && !reducedMotion) {
    const closeCards = [...closeMedia.querySelectorAll('.work-close-image')];
    let centerIndex = 2;
    let carouselTimer;
    const updateCloseCarousel = () => {
      closeCards.forEach((card, index) => {
        const offset = (index - centerIndex + closeCards.length) % closeCards.length;
        card.dataset.carouselPosition = offset === 0 ? 'center' : offset === 1 ? 'right-near' : offset === 2 ? 'right-far' : offset === 3 ? 'left-far' : 'left-near';
      });
    };
    const startCloseCarousel = () => {
      window.clearInterval(carouselTimer);
      carouselTimer = window.setInterval(() => { centerIndex = (centerIndex + 1) % closeCards.length; updateCloseCarousel(); }, 2600);
    };
    updateCloseCarousel();
    closeMedia.addEventListener('mouseenter', () => window.clearInterval(carouselTimer));
    closeMedia.addEventListener('mouseleave', startCloseCarousel);
    startCloseCarousel();
  }

})();
