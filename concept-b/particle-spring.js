window.createParticleSpring = canvas => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pointer = null;
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') pointer = event;
  });
  for (const type of ['pointerleave', 'pointercancel']) {
    canvas.addEventListener(type, () => { pointer = null; });
  }

  return (dt, offsetX, offsetY, scaleX, scaleY) => {
    const bounds = pointer && !reduced.matches && canvas.getBoundingClientRect();
    const mouseX = bounds ? pointer.clientX - bounds.left : 0;
    const mouseY = bounds ? pointer.clientY - bounds.top : 0;
    const damping = Math.exp(-15 * dt);

    return (particle, homeX, homeY) => {
      if (reduced.matches) {
        particle.x = homeX;
        particle.y = homeY;
        particle.vx = particle.vy = 0;
        return;
      }
      let targetX = homeX, targetY = homeY;
      if (bounds && scaleX > 0 && scaleY > 0) {
        const dx = offsetX + homeX * scaleX - mouseX;
        const dy = offsetY + homeY * scaleY - mouseY;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 85) {
          const push = 44 * (1 - distance / 85) ** 2 / distance;
          targetX += dx * push / scaleX;
          targetY += dy * push / scaleY;
        }
      }
      particle.vx = (particle.vx + (targetX - particle.x) * 220 * dt) * damping;
      particle.vy = (particle.vy + (targetY - particle.y) * 220 * dt) * damping;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
    };
  };
};
