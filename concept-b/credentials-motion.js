(() => {
  const section = document.querySelector('.about-credentials');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
  } else {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(section);
  }

  const items = [...section.querySelectorAll('.credential-list article')];
  const images = [...section.querySelectorAll('.credentials-image img')];
  if (items.length === 3) {
    const extraItem = document.createElement('article');
    extraItem.innerHTML = '<span>Connected</span><p>One team keeps the creative, technical and production work connected from first idea to final delivery.</p>';
    section.querySelector('.credential-list').append(extraItem);
    const extraImage = document.createElement('img');
    extraImage.src = 'assets/approach-eventoria-crew.png';
    extraImage.alt = 'Event production crew preparing a live experience';
    section.querySelector('.credentials-image').append(extraImage);
  }
  const allItems = [...section.querySelectorAll('.credential-list article')];
  const allImages = [...section.querySelectorAll('.credentials-image img')];
  const suppliedImages = ['assets/credentials-01.jpg','assets/credentials-02.jpg','assets/credentials-03.jpg','assets/credentials-connected-1042.jpg?v=20261112-1232'];
  allImages.forEach((image,index) => { if (suppliedImages[index]) image.src = suppliedImages[index]; });
  if (!allItems.length) return;
  const labels = ['Approved references', 'Partner credits', 'Delivery credentials', 'Connected'];
  const copy = [
    'Reference projects and client endorsements can be shared on request, subject to approval and confidentiality.',
    'We work with trusted creative, technical, cultural and production partners, with every contribution clearly credited.',
    'UAE-based experience across ceremonies, national occasions, cultural programmes, destinations, launches and live shows.',
    'One team keeps creative, technical and production work connected from first sketch to final show.'
  ];
  allItems.forEach((item, index) => {
    const label = item.querySelector('span');
    const paragraph = item.querySelector('p');
    if (label) label.textContent = labels[index] || labels[3];
    if (paragraph) paragraph.textContent = copy[index] || copy[3];
    item.tabIndex = 0;
  });

  const setActive = (index) => {
    allItems.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
      item.setAttribute('aria-current', itemIndex === index ? 'true' : 'false');
    });
    allImages.forEach((image, imageIndex) => image.classList.toggle('is-active', imageIndex === index));
  };

  setActive(0);
})();
