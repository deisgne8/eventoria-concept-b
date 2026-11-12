(() => {
  const canvas = document.querySelector('.expertise-particle-field');
  const section = document.querySelector('.expertise-page-disciplines');
  if (!canvas || !section) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let particles = [], width = 0, height = 0, raf = 0;
  const colors = ['rgba(83,196,224,.5)', 'rgba(157,203,217,.38)'];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = section.clientWidth; height = section.clientHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(180, Math.max(70, Math.round(width * height / 18000)));
    particles = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.6 + .35, vx: (Math.random() - .5) * .14,
      vy: (Math.random() - .5) * .14, color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      if (!reduced.matches) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
    });
    if (!reduced.matches) raf = requestAnimationFrame(draw);
  }
  addEventListener('resize', resize);
  resize(); draw();
})();

/* Individual particle illustrations beside each discipline. */
(() => {
  const cards=[...document.querySelectorAll('.expertise-content-card')];
  if(!cards.length) return;
  cards.forEach(card=>{
    const img=card.querySelector('img'); if(!img) return;
    const canvas=document.createElement('canvas'); canvas.className='expertise-card-particle'; canvas.setAttribute('aria-hidden','true');
    card.insertBefore(canvas,card.firstChild);
const draw=()=>{const w=720,h=440,d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;canvas.style.width='100%';canvas.style.height='100%';const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);const off=document.createElement('canvas');off.width=w;off.height=h;const o=off.getContext('2d');const s=Math.min(w/img.naturalWidth,h/img.naturalHeight),iw=img.naturalWidth*s,ih=img.naturalHeight*s;o.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih);const a=o.getImageData(0,0,w,h).data,targets=[];for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){const i=(y*w+x)*4;if(a[i+3]>24&&((a[i]+a[i+1]+a[i+2])/3)>120)targets.push([x,y]);}const stride=Math.max(1,Math.ceil(targets.length/22000)),chosen=targets.filter((_,i)=>i%stride===0),p=chosen.map(t=>({x:Math.random()*w,y:Math.random()*h,vx:0,vy:0,t:[(t[0]-w/2)*1.32+w/2+(Math.random()-.5)*1.8,(t[1]-h/2)*1.32+h/2+(Math.random()-.5)*1.8],seed:Math.random()*6.28,size:.65+Math.random()*1.05,alpha:.72+Math.random()*.28})),dust=Array.from({length:260},()=>({x:Math.random()*w,y:Math.random()*h,r:.35+Math.random()*.7,a:.12+Math.random()*.2}));let last=performance.now();const frame=now=>{const dt=Math.min(.04,(now-last)/1000);last=now;c.clearRect(0,0,w,h);for(const m of dust){c.fillStyle=`rgba(40,125,175,${m.a})`;c.fillRect(m.x,m.y,m.r,m.r)}c.shadowColor='rgba(85,200,238,.45)';c.shadowBlur=1.2;for(const q of p){q.vx+=(q.t[0]-q.x)*dt*15;q.vy+=(q.t[1]-q.y)*dt*15;q.vx*=Math.pow(.84,dt*60);q.vy*=Math.pow(.84,dt*60);q.x+=q.vx*dt;q.y+=q.vy*dt;const twinkle=.9+Math.sin(now*.002+q.seed)*.1,mix=Math.max(0,Math.min(1,(q.y/h)*.72+(q.x/w)*.28)),r=Math.round(16+mix*69),g=Math.round(43+mix*157),b=Math.round(53+mix*185);c.fillStyle=`rgba(${r},${g},${b},${q.alpha*twinkle})`;c.fillRect(q.x,q.y,q.size,q.size);}c.shadowBlur=0;requestAnimationFrame(frame)};requestAnimationFrame(frame)};
    if(img.complete) draw(); else img.addEventListener('load',draw,{once:true});
  });
})();

/* Re-render the existing discipline illustrations as the Eventoria particle mark. */
(() => {
  const canvas = document.querySelector('.expertise-illustration-particles');
  const visual = document.querySelector('.expertise-split-visual');
  const images = [...document.querySelectorAll('.expertise-split-visual img')];
  if (!canvas || !visual || !images.length) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0, dpr=1, particles=[], targetIndex=0, last=0;
  const rand = (n) => Math.random()*n;
  const resize = () => { dpr=Math.min(devicePixelRatio||1,2); width=visual.clientWidth; height=visual.clientHeight; canvas.width=width*dpr; canvas.height=height*dpr; canvas.style.width=width+'px'; canvas.style.height=height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); rebuild(); };
  const sample = (img) => {
    const ow=720, oh=440, off=document.createElement('canvas'); off.width=ow; off.height=oh;
    const o=off.getContext('2d'); o.clearRect(0,0,ow,oh);
    const scale=Math.min(ow/img.naturalWidth,oh/img.naturalHeight), dw=img.naturalWidth*scale, dh=img.naturalHeight*scale;
    o.drawImage(img,(ow-dw)/2,(oh-dh)/2,dw,dh);
    const data=o.getImageData(0,0,ow,oh).data, points=[];
    let bg=0; for(const [x,y] of [[2,2],[ow-3,2],[2,oh-3],[ow-3,oh-3]]){const i=(y*ow+x)*4;bg+=(data[i]+data[i+1]+data[i+2])/3;} bg/=4;
    const darkAsset=false;
    for(let y=0;y<oh;y++) for(let x=0;x<ow;x++){const i=(y*ow+x)*4,a=data[i+3],lum=(data[i]+data[i+1]+data[i+2])/3; if(a>24 && (darkAsset?lum<70:lum>120)){points.push([x/ow,y/oh]); if(x%2===0&&y%2===0) points.push([(x+1)/ow,(y+.35)/oh]);}}
    return points;
  };
  const rebuild = () => { const active=images.findIndex(i=>i.classList.contains('is-active')); targetIndex=active<0?0:active; const points=sample(images[targetIndex]); const count=Math.min(12000,Math.max(2600,points.length)); particles=Array.from({length:count},(_,i)=>{const p=points[i%Math.max(1,points.length)]||[.5,.5]; return {x:rand(width),y:rand(height),tx:(p[0]-.5)*width*.88+width/2+(Math.random()-.5)*.8,ty:(p[1]-.5)*height*.72+height/2+(Math.random()-.5)*.8,vx:0,vy:0,life:rand(1)};}); };
  const draw = (now) => { const dt=Math.min(.035,(now-last)/1000||.016); last=now; const active=images.findIndex(i=>i.classList.contains('is-active')); if(active>=0&&active!==targetIndex) rebuild(); ctx.clearRect(0,0,width,height); for(const p of particles){const dx=p.tx-p.x,dy=p.ty-p.y;p.vx+=dx*dt*9;p.vy+=dy*dt*9;p.vx*=.86;p.vy*=.86;p.x+=p.vx*dt;p.y+=p.vy*dt; const glow=.52+Math.sin(now*.002+p.life*8)*.08,mix=Math.max(0,Math.min(1,(p.y/height)*.72+(p.x/width)*.28)),r=Math.round(16+mix*69),g=Math.round(43+mix*157),b=Math.round(53+mix*185);ctx.fillStyle=`rgba(${r},${g},${b},${glow})`;ctx.shadowColor='rgba(85,200,238,.5)';ctx.shadowBlur=1.4;ctx.fillRect(p.x,p.y,.9,.9);} ctx.shadowBlur=0; if(!reduced.matches) requestAnimationFrame(draw); };
  const ready=images.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve());
  addEventListener('resize',resize);
  Promise.all(ready).then(()=>{resize();requestAnimationFrame(draw);setTimeout(()=>{resize();},180);});
})();
