// Vista: confeti de papelitos.

/* ---------- Confeti de papelitos ---------- */
function confeti(){
  if (reduce) return;
  const cv = $("#confeti"), g = cv.getContext("2d");
  cv.hidden = false; cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#FFE45E","#FF9DCB","#86E0A3","#FFB867","#9BCFFF"];
  const ps = Array.from({length:110}, () => ({x:Math.random()*cv.width, y:-20-Math.random()*cv.height*.4, w:6+Math.random()*8, h:4+Math.random()*6,
    vy:2+Math.random()*3, vx:-1.5+Math.random()*3, r:Math.random()*6, vr:-.15+Math.random()*.3, c:cols[Math.floor(Math.random()*5)]}));
  const t0 = performance.now();
  (function frame(t){
    g.clearRect(0,0,cv.width,cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w/2,-p.h/2,p.w,p.h); g.restore(); });
    if (t - t0 < 3200) requestAnimationFrame(frame); else { g.clearRect(0,0,cv.width,cv.height); cv.hidden = true; }
  })(t0);
}
