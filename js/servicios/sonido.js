// Servicio: música y efectos de sonido con Web Audio.

/* ---------- Sonido: música y efectos con Web Audio ---------- */
const Sonido = (() => {
  const leer = (k,d) => { const v = Almacen.leer(k); return v === null ? d : v === "1"; };
  const guardar = (k,v) => Almacen.guardar(k, v ? "1" : "0");
  const st = { musica: leer("cz-musica", true), efectos: leer("cz-efectos", true) };
  let alCambiar = () => {};
  let ctx = null, master, mus, sfx, ruidoBuf, reloj = null, paso = 0, prox = 0;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function init(){
    if (ctx) { if (ctx.state !== "running") ctx.resume(); if (st.musica) arrancar(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .85;
    const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    mus = ctx.createGain(); mus.gain.value = 0;
    const suave = ctx.createBiquadFilter(); suave.type = "lowpass"; suave.frequency.value = 2200; mus.connect(suave); suave.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = st.efectos ? .7 : 0; sfx.connect(master);
    ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * .6, ctx.sampleRate);
    const d = ruidoBuf.getChannelData(0); for (let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
    // Cuando el navegador por fin deja sonar el audio, reprograma la música desde "ahora"
    ctx.onstatechange = () => {
      if (ctx.state !== "running") return;
      if (st.musica) { if (reloj) { prox = ctx.currentTime + .05; mus.gain.cancelScheduledValues(ctx.currentTime); mus.gain.setTargetAtTime(VOL_MUSICA, ctx.currentTime, 1.2); } else arrancar(); }
      alCambiar();
    };
    if (ctx.state !== "running") ctx.resume();
    if (st.musica) arrancar();
  }
  function tono(m, t, dur, {tipo="triangle", vol=.2, dest=sfx, ataque=.006, slide=0}={}){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(hz(m), t);
    if (slide) o.frequency.exponentialRampToValueAtTime(hz(m + slide), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .03);
  }
  function ruido(t, dur, {vol=.1, freq=6000, q=.8, tipo="highpass", dest=sfx}={}){
    const s = ctx.createBufferSource(); s.buffer = ruidoBuf;
    const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()*.3); s.stop(t + dur + .03);
  }

  // Canción alegre en Do mayor: Do – Sol – La menor – Fa, ritmo de ukelele
  const VOL_MUSICA = .3; // música de fondo suave, por debajo de los efectos
  const OCT = 60 / 116 / 2;
  const ACORDES = [[60,64,67],[55,59,62],[57,60,64],[53,57,60]];
  const MEL = [
    72,0,76,0,79,76,74,72,  74,0,71,0,67,0,71,74,  72,0,69,0,72,76,0,74,  72,0,69,0,65,0,67,0,
    76,0,79,0,84,0,79,76,   74,76,74,71,67,0,0,0,  69,72,76,0,74,72,69,0, 65,67,69,71,72,0,0,0 ];
  function tocar(s, t){
    const compas = Math.floor(s / 8), b = s % 8, ch = ACORDES[compas % 4];
    const m = MEL[s % MEL.length];
    if (m) { tono(m, t, OCT*1.7, {tipo:"triangle", vol:.07, dest:mus}); tono(m+12, t, OCT*1.1, {tipo:"sine", vol:.02, dest:mus}); }
    if (b === 0 || b === 4) tono(ch[0]-24, t, OCT*1.9, {tipo:"triangle", vol:.26, dest:mus});
    if (b === 6) tono(ch[2]-24, t, OCT*1.2, {tipo:"triangle", vol:.18, dest:mus});
    if (b % 2 === 1) ch.forEach((n,i) => tono(n, t + i*.012, OCT*.9, {tipo:"triangle", vol:.04, dest:mus, ataque:.003}));
    if (b === 2 || b === 6) ruido(t, .1, {vol:.11, freq:1700, tipo:"bandpass", q:.7, dest:mus});
    ruido(t, .035, {vol: b % 2 ? .045 : .025, freq:8000, dest:mus});
  }
  function programar(){ while (prox < ctx.currentTime + .18) { tocar(paso, prox); paso++; prox += OCT; } }
  let sonoAntes = false;
  setInterval(() => { sonoAntes = !!ctx && ctx.state === "running" && !!reloj; }, 300);
  function arrancar(){
    if (!ctx || reloj) return;
    paso = 0; prox = ctx.currentTime + .1;
    mus.gain.cancelScheduledValues(ctx.currentTime); mus.gain.setTargetAtTime(VOL_MUSICA, ctx.currentTime, 1.2);
    reloj = setInterval(programar, 40);
  }
  function parar(){ if (!reloj) return; clearInterval(reloj); reloj = null; mus.gain.setTargetAtTime(0, ctx.currentTime, .08); }
  function bajar(seg){ if (!ctx || !reloj) return; const t = ctx.currentTime; mus.gain.cancelScheduledValues(t); mus.gain.setTargetAtTime(VOL_MUSICA * .25, t, .05); mus.gain.setTargetAtTime(VOL_MUSICA, t + seg, .6); }
  document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) parar(); else if (st.musica) arrancar(); });

  const fx = fn => { if (!ctx || !st.efectos) return; fn(ctx.currentTime + .01); };
  return {
    onCambio(fn){ alCambiar = fn; },
    init, st, listo: () => !!ctx && ctx.state === "running",
    sonando: () => !!ctx && ctx.state === "running" && !!reloj && sonoAntes,
    musica(v){ st.musica = v; guardar("cz-musica", v); init(); if (!ctx) return; v ? arrancar() : parar(); },
    pausarMusica(){ st.musica = false; if (ctx) parar(); if (alCambiar) alCambiar(); },
    efectos(v){ st.efectos = v; guardar("cz-efectos", v); init(); if (sfx) sfx.gain.value = v ? .7 : 0; },
    acierto(){ fx(t => { [72,76,79,84].forEach((m,i) => tono(m, t+i*.07, .28, {tipo:"square", vol:.06})); tono(96, t+.28, .4, {vol:.05}); }); },
    error(){ fx(t => { tono(50, t, .38, {tipo:"sawtooth", vol:.07, slide:-8}); tono(57, t, .3, {tipo:"square", vol:.03, slide:-6}); }); },
    trazo(){ fx(t => { for (let i=0;i<5;i++) ruido(t + .12 + i*.07, .06, {vol:.16, freq:3600, tipo:"bandpass", q:1.4}); }); },
    tap(){ fx(t => tono(84, t, .07, {vol:.07})); },
    tic(){ fx(t => tono(93, t, .05, {tipo:"square", vol:.025})); },
    bajar,
    victoria(){ bajar(2.2); fx(t => { [[67,0],[72,.12],[76,.24],[79,.36],[76,.6],[79,.72],[84,.84]].forEach(([m,d]) => tono(m, t+d, d > .7 ? .9 : .22, {tipo:"square", vol:.06})); }); },
    derrota(){ bajar(2.6); fx(t => { [67,66,65].forEach((m,i) => tono(m, t+i*.38, .36, {tipo:"sawtooth", vol:.05})); tono(64, t+1.14, 1, {tipo:"sawtooth", vol:.05, slide:-1}); }); }
  };
})();
