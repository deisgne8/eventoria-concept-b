import * as THREE from './assets/vendor/three.module.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const cards = [...document.querySelectorAll('.expertise-content-card')];

function makePoints(image, count = 22000) {
  const w = 720, h = 440, mask = document.createElement('canvas');
  mask.width = w; mask.height = h;
  const ctx = mask.getContext('2d', {willReadFrequently:true});
  const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);
  const iw = image.naturalWidth * scale, ih = image.naturalHeight * scale;
  ctx.drawImage(image, (w-iw)/2, (h-ih)/2, iw, ih);
  const pixels = ctx.getImageData(0,0,w,h).data, source = [];
  for (let y=0; y<h; y+=2) for (let x=0; x<w; x+=2) {
    const i=(y*w+x)*4, lum=(pixels[i]+pixels[i+1]+pixels[i+2])/3;
    if (pixels[i+3] > 24) source.push([x,y]);
  }
  const stride = Math.max(1, Math.ceil(source.length/count)), positions=[], colors=[];
  for (let i=0; i<source.length; i+=stride) {
    const [x,y]=source[i], px=(x-w/2)/w*2.7, py=(h/2-y)/h*1.65;
    positions.push(px+(Math.random()-.5)*.012, py+(Math.random()-.5)*.012, (Math.random()-.5)*.04);
    const c = y < h*.5 ? new THREE.Color(0x55c8ee) : new THREE.Color(0x3fa9d0);
    colors.push(c.r,c.g,c.b);
  }
  return {positions, colors};
}

async function mount(card) {
  const image = card.querySelector('img');
  if (!image) return;
  let canvas = card.querySelector('.expertise-card-particle');
  if (!canvas) { canvas=document.createElement('canvas'); canvas.className='expertise-card-particle'; canvas.setAttribute('aria-hidden','true'); card.insertBefore(canvas,image); }
  const source = new Image();
  source.src = image.currentSrc || image.src;
  await new Promise(resolve => { if (source.complete && source.naturalWidth) resolve(); else { source.addEventListener('load', resolve, {once:true}); source.addEventListener('error', resolve, {once:true}); } });
  if (!source.naturalWidth) return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.z = 7.8;
  const group = new THREE.Group(); scene.add(group);
  const sample = makePoints(source);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(sample.positions,3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(sample.colors,3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({size:2.1,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.95,depthWrite:false}));
  group.add(points);
  const dust=[], dustColors=[];
  for(let i=0;i<450;i++){dust.push((Math.random()-.5)*7,(Math.random()-.5)*4.5,(Math.random()-.5)*2);const c=new THREE.Color(0x3fa9d0);dustColors.push(c.r,c.g,c.b)}
  const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.Float32BufferAttribute(dust,3)); dg.setAttribute('color',new THREE.Float32BufferAttribute(dustColors,3));
  scene.add(new THREE.Points(dg,new THREE.PointsMaterial({size:.02,vertexColors:true,transparent:true,opacity:.55,depthWrite:false})));
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();group.scale.setScalar(Math.min(h*.52,w*.72)/2.7)};
  new ResizeObserver(resize).observe(canvas); resize();
  let active=false, frame=0, time=0, last=0;
  const render=now=>{if(!active||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;group.rotation.y+=(Math.sin(time*.22)*.16+Math.sin(time*.37)*.04-group.rotation.y)*.04;group.position.y=Math.sin(time*.7)*.03;renderer.render(scene,camera);if(!reduced.matches)frame=requestAnimationFrame(render)};
  const resume=()=>{cancelAnimationFrame(frame);last=0;if(active&&!document.hidden)frame=requestAnimationFrame(render)};
  new IntersectionObserver(entries=>{active=entries[0].isIntersecting;resume()},{rootMargin:'100px'}).observe(card);
  document.addEventListener('visibilitychange',resume);
}

cards.forEach(mount);
