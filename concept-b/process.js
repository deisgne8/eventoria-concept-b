(() => {
const section=document.querySelector('.process-section'),stage=section.querySelector('.process-stage'),cards=[...section.querySelectorAll('.process-card')],reduced=matchMedia('(prefers-reduced-motion: reduce)'),angles=[-9,8,-6,6,-4];
const cta=section.querySelector('.process-intro a');
if(cta) cta.href='Contact.html';
/* Only the dedicated Process page uses the editorial timeline layout. */
if(document.body.classList.contains('process-page')){
  document.body.classList.add('process-timeline-layout');
  const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible','is-revealed');
      entry.target.style.setProperty('--arrow-inset','0%');
      revealObserver.unobserve(entry.target);
    }
  }),{threshold:.28,rootMargin:'0px 0px -10% 0px'}):null;
  cards.forEach(card=>revealObserver?.observe(card));
  if(reduced.matches){cards.forEach(card=>{card.classList.add('is-visible','is-active');card.style.setProperty('--scroll-reveal-y','0px');card.style.setProperty('--scroll-parallax','0px');card.style.setProperty('--scroll-scale','1');card.style.setProperty('--arrow-progress','1');card.style.setProperty('--arrow-inset','0%');});return;}
  const updateScrollMotion=()=>{
    const center=innerHeight*.52;
    let activeIndex=0;
    const distances=[];
    cards.forEach((card,i)=>{
      const rect=card.getBoundingClientRect();
      const distance=(rect.top+rect.height/2-center)/innerHeight;
      distances.push(distance);
      const parallax=Math.max(-28,Math.min(28,distance*-20));
      const centered=Math.max(0,1-Math.abs(distance)/.62);
      const scale=.94+(centered*.06);
      const reveal=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.68)));
      const revealEase=1-Math.pow(1-reveal,3);
      const arrowProgress=Math.max(0,Math.min(1,(innerHeight-(rect.bottom+innerHeight*.08))/(innerHeight*.58)));
      card.classList.toggle('is-near-active',Math.abs(distance)<.7);
      card.style.setProperty('--scroll-parallax',`${parallax.toFixed(1)}px`);
      card.style.setProperty('--scroll-scale',scale.toFixed(3));
      card.style.setProperty('--scroll-reveal-y',`${((1-revealEase)*20).toFixed(1)}px`);
      card.style.setProperty('--arrow-progress',arrowProgress.toFixed(3));
      if(card.classList.contains('is-revealed'))card.style.setProperty('--arrow-inset','0%');
      if(Math.abs(distance)<Math.abs(distances[activeIndex]??Infinity))activeIndex=i;
    });
    cards.forEach((card,i)=>{
      card.classList.toggle('is-active',i===activeIndex);
      card.classList.toggle('is-before-active',i===activeIndex-1);
      card.classList.toggle('is-after-active',i===activeIndex+1);
    });
    const progress=Math.max(0,Math.min(1,(activeIndex)/(Math.max(1,cards.length-1))));
    document.body.style.setProperty('--process-scroll-progress',progress.toFixed(3));
    document.body.style.setProperty('--process-active-step',String(activeIndex+1).padStart(2,'0'));
  };
  addEventListener('scroll',updateScrollMotion,{passive:true});
  addEventListener('resize',updateScrollMotion);
  updateScrollMotion();
  return;
}
const timeline=section.querySelector('.process-cards');
if(timeline&&'IntersectionObserver' in window){
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}
  }),{threshold:.18});
  cards.forEach(card=>reveal.observe(card));
  const line=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){timeline.classList.add('is-visible');line.disconnect();}
  }),{threshold:.05});
  line.observe(timeline);
}else if(timeline){timeline.classList.add('is-visible');}
let pending=false;
const clamp=n=>Math.max(0,Math.min(1,n));
function render(){pending=false;const timelineRect=timeline?.getBoundingClientRect();if(timelineRect){const lineProgress=clamp((innerHeight-timelineRect.top)/(timelineRect.height+innerHeight*.35));timeline.style.setProperty('--timeline-progress',lineProgress.toFixed(3));cards.forEach(card=>{const cardRect=card.getBoundingClientRect(),centerOffset=(innerHeight/2-(cardRect.top+cardRect.height/2))/innerHeight;card.style.setProperty('--image-shift',`${Math.max(-12,Math.min(12,centerOffset*18)).toFixed(1)}px`);});}if(reduced.matches||innerWidth<=760||innerHeight<=650){cards.forEach(card=>{card.style.transform='none';card.style.opacity=1;});return;}const rect=section.getBoundingClientRect(),p=clamp(-rect.top/(section.offsetHeight-stage.offsetHeight)),step=p*(cards.length===3?2.65:4.8);
stage.style.setProperty('--intro-drift',`${-p*60}px`);stage.style.setProperty('--process-progress',p);
cards.forEach((card,i)=>{const arrival=clamp(step-i+.85),leave=clamp(step-i-.65),e=1-Math.pow(1-arrival,3),y=(1-e)*(innerHeight*.9)-leave*(innerHeight*.95),rotation=angles[i]*(1-e*.7)-leave*12;card.style.transform=`translateY(${y}px) rotate(${rotation}deg) scale(${.94+.06*e-.07*leave})`;card.style.opacity=clamp(arrival*5)*(1-clamp((leave-.7)/.3));card.style.zIndex=i+1;});}
function request(){if(!pending){pending=true;requestAnimationFrame(render);}}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);render();
})();
