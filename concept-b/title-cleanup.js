(() => {
  document.querySelectorAll('h1, h2, h3').forEach((title) => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    const last = nodes.at(-1);
    if (last) last.textContent = last.textContent.replace(/\.\s*$/, '');
  });
})();
