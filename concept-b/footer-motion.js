(() => {
const motionTargets=document.querySelectorAll('.site-footer,.expertise-page-hero');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const animatedFooter=document.querySelector('.contact-page-footer');
function reset(target){target.style.setProperty('--footer-x','0px');target.style.setProperty('--footer-y','0px');}
motionTargets.forEach(target=>{
 target.addEventListener('pointermove',event=>{
  if(reduced.matches||event.pointerType==='touch')return;
  const rect=target.getBoundingClientRect();
  target.style.setProperty('--footer-x',`${((event.clientX-rect.left)/rect.width-.5)*32}px`);
  target.style.setProperty('--footer-y',`${((event.clientY-rect.top)/rect.height-.5)*24}px`);
 },{passive:true});
 target.addEventListener('pointerleave',()=>reset(target));
});
reduced.addEventListener('change',()=>motionTargets.forEach(reset));
if(animatedFooter){
 let start=performance.now();
 const animate=(now)=>{
  if(reduced.matches){animatedFooter.style.setProperty('--footer-drift-x','0%');animatedFooter.style.setProperty('--footer-drift-y','0%');animatedFooter.style.setProperty('--footer-drift-scale','1.08');return;}
  const t=(now-start)/1000;
  animatedFooter.style.setProperty('--footer-drift-x',`${Math.sin(t*.22)*1.5}%`);
  animatedFooter.style.setProperty('--footer-drift-y',`${Math.cos(t*.18)*1}%`);
  animatedFooter.style.setProperty('--footer-drift-scale',`${1.12+Math.sin(t*.16)*.04}`);
  requestAnimationFrame(animate);
 };
 requestAnimationFrame(animate);
}
})();
