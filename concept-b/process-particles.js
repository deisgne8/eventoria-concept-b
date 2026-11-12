(() => {
  const cards = document.querySelectorAll('.process-page-steps .process-card');
  const names = ['listen', 'imagine', 'design', 'produce', 'deliver'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  cards.forEach((card, index) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'process-particle-art';
    canvas.setAttribute('aria-hidden', 'true');
    card.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const spring = window.createParticleSpring(canvas);
    const image = new Image();
    image.src = `assets/process/particle-${names[index]}.png`;
    image.onload = () => {
      const mask = document.createElement('canvas');
      mask.width = 600; mask.height = 400;
      const m = mask.getContext('2d', {willReadFrequently: true});
      m.drawImage(image, 0, 0, 600, 400);
      const data = m.getImageData(0, 0, 600, 400).data;
      const points = [];
      for (let y = 0; y < 400; y++) for (let x = 0; x < 600; x++) {
        const i = (y * 600 + x) * 4;
        if (data[i] > 100 && data[i + 1] > 100 && data[i + 2] > 100 && Math.random() < .42) points.push([(x + (Math.random() - .5) * 2.4) / 600, (y + (Math.random() - .5) * 2.4) / 400, Math.random() * 6.28]);
      }
      const particles = points.map(([x, y, phase]) => ({ x: Math.random(), y: Math.random(), tx: x, ty: y, vx: 0, vy: 0, phase }));
      let visible = false, frame = 0, last = 0;
      const draw = now => {
        const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
        if (!w || !h) return;
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = w * dpr; canvas.height = h * dpr; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        const scale = Math.min(w / 600, h / 400) * 1.32, ox = (w - 600 * scale) / 2, oy = (h - 400 * scale) / 2;
        const dt = last ? Math.min(.035, (now - last) / 1000) : .016;
        last = now;
        ctx.shadowColor = 'rgba(85,200,238,.5)'; ctx.shadowBlur = 1.4;
        const move = spring(dt, ox, oy, 600 * scale, 400 * scale);
        particles.forEach(p => {
          move(p, p.tx, p.ty);
          const mix = Math.max(0, Math.min(1, p.y * .72 + p.x * .28));
          const r = Math.round(35 + mix * 50), g = Math.round(130 + mix * 70), b = Math.round(165 + mix * 73);
          ctx.fillStyle = `rgba(${r},${g},${b},${.72 + Math.sin(now * .002 + p.phase) * .08})`;
          ctx.fillRect(ox + p.x * 600 * scale, oy + p.y * 400 * scale, .85, .85);
        });
        ctx.shadowBlur = 0;
        if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
      };
      const start = () => { cancelAnimationFrame(frame); last = 0; if (visible && !document.hidden) frame = requestAnimationFrame(draw); };
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; start(); }, {rootMargin:'150px'}).observe(card);
      else { visible = true; start(); }
      document.addEventListener('visibilitychange', start);
      addEventListener('resize', start);
      reduced.addEventListener('change', start);
    };
  });
})();
