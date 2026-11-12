(() => {
const section=document.querySelector('.about-section'),hero=document.querySelector('.hero'),identity=document.querySelector('.identity'),bottom=document.querySelector('.hero-bottom');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=v=>Math.max(0,Math.min(1,v));
let busy=false,frame;
function go(target){if(busy)return;const start=scrollY,distance=target-start,begin=performance.now();busy=true;const tick=now=>{const p=reduced.matches?1:clamp((now-begin)/1200);scrollTo(0,start+distance*(1-Math.pow(1-p,3)));if(p<1)frame=requestAnimationFrame(tick);else busy=false;};frame=requestAnimationFrame(tick);}
document.querySelector('.scroll').addEventListener('click',event=>{event.preventDefault();go(section.offsetTop);history.replaceState(null,'','#hero-end');});
const intro=document.querySelector('.about-intro'),details=document.querySelector('.about-details');
for(const [element,amount] of [[intro,.4],[details,.5]]){if(!element)continue;new IntersectionObserver(entries=>{for(const entry of entries)element.classList.toggle('is-in-view',entry.isIntersecting&&entry.intersectionRatio>=amount);},{threshold:[0,amount]}).observe(element);}
function update(){const p=clamp(scrollY/hero.offsetHeight);identity.style.opacity=1-clamp((p-.4)/.45);identity.style.filter=`blur(${clamp((p-.4)/.45)*8}px)`;identity.style.transform=`translateY(calc(-50% - ${clamp(p/.85)*36}px))`;bottom.style.opacity=1-clamp((p-.02)/.1);}
const approachObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in-view');approachObserver.unobserve(entry.target);}},{threshold:.12});document.querySelectorAll('.approach-reveal').forEach(element=>approachObserver.observe(element));
addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();
