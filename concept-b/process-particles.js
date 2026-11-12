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
    let pointer = null;
    canvas.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
    });
    const clearPointer = () => { pointer = null; };
    canvas.addEventListener('pointerleave', clearPointer);
    canvas.addEventListener('pointercancel', clearPointer);
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
        const bounds = pointer && canvas.getBoundingClientRect();
        const mouseX = bounds ? pointer.x - bounds.left : 0;
        const mouseY = bounds ? pointer.y - bounds.top : 0;
        const radius = 65;
        particles.forEach(p => {
          if (reduced.matches) { p.x = p.tx; p.y = p.ty; }
          else {
            let targetX = p.tx, targetY = p.ty;
            if (bounds) {
              const dx = ox + p.tx * 600 * scale - mouseX;
              const dy = oy + p.ty * 400 * scale - mouseY;
              const distance = Math.hypot(dx, dy);
              if (distance > 0 && distance < radius) {
                const push = 30 * (1 - distance / radius) ** 2 / distance;
                targetX += dx * push / (600 * scale);
                targetY += dy * push / (400 * scale);
              }
            }
            p.vx += (targetX - p.x) * dt * 9; p.vy += (targetY - p.y) * dt * 9;
            p.vx *= .86; p.vy *= .86; p.x += p.vx * dt; p.y += p.vy * dt;
          }
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
