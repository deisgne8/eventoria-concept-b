(() => {
  const selectors = [
    '.expertise-page-hero h1',
    '.work-hero h1',
    '.process-page-hero h1',
    '.about-page-hero h1',
    '.contact-page-hero h1'
  ];
  document.querySelectorAll(selectors.join(',')).forEach((heading) => {
    heading.querySelectorAll('em').forEach((em) => {
      em.textContent = em.textContent.replace(/\.+$/, '');
    });
    heading.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\.+$/g, '');
    });
  });
})();
