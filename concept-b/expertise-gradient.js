(() => {
  document.querySelectorAll('.expertise-content-card').forEach(card => {
    const img=card.querySelector('img'); if(!img) return;
    const canvas=document.createElement('canvas'); canvas.className='expertise-gradient-overlay'; card.insertBefore(canvas,card.firstChild);
    const draw=()=>{const w=720,h=440,d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;canvas.style.width='100%';canvas.style.height='100%';const c=canvas.getContext('2d'),m=document.createElement('canvas');m.width=w;m.height=h;c.setTransform(d,0,0,d,0,0);const o=m.getContext('2d');const s=Math.min(w/img.naturalWidth,h/img.naturalHeight),iw=img.naturalWidth*s,ih=img.naturalHeight*s;o.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih);const a=o.getImageData(0,0,w,h).data;const pts=[];for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){if(a[(y*w+x)*4+3]>24)pts.push([x,y])}const step=Math.max(1,Math.ceil(pts.length/22000));let last=performance.now();const loop=now=>{const dt=Math.min(.04,(now-last)/1000);last=now;c.clearRect(0,0,w,h);for(let i=0;i<pts.length;i+=step){const q=pts[i],x=q[0],y=q[1],mix=(x/w+y/h)/2,r=Math.round(245*(1-mix)+255*mix),g=Math.round(245*(1-mix)+204*mix),b=Math.round(240*(1-mix)+51*mix);c.fillStyle=`rgba(${r},${g},${b},.9)`;c.fillRect(x,y,1.1,1.1)}requestAnimationFrame(loop)};requestAnimationFrame(loop)};
    img.loading='eager'; if(img.complete&&img.naturalWidth) draw(); else img.addEventListener('load',draw,{once:true});
  });
})();
