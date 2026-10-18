// Modelo: banco de preguntas y cómo se arma cada partida.

/* ---------- Clasifica ---------- */
const POOL = [];
ENSAYOS.forEach(e => e.f.forEach(([k,t,w,c]) => POOL.push({k,t,w,c,tema:e.tema})));
// Si empieza con «…», el fragmento va en la hoja y lo demás es la pregunta de abajo
SIN_PISTAS.forEach(([tema,k,t,w]) => POOL.push({k,t,w,tema,dif:true}));
PONENCIA.forEach(([t,ops,w]) => { const m = t.match(/^«(.+)» (.+)$/); POOL.push({k:"pon", t: m ? m[1] : t, pq: m ? m[2] : "", ops, ok:0, w, tema:"La ponencia"}); });
// Arma una partida como lista de posiciones en POOL, para poder compartirla en vivo
function armarCola(n){
  const pon = shuffle(POOL.map((_, i) => i).filter(i => POOL[i].k === "pon"));
  return cfg.tema === "ponencia" ? pon.slice(0, n) : colaEnsayo(n);
}
function colaEnsayo(n){
  if (n <= 0) return [];
  // Al azar, sin vueltas fijas: nunca dos de la misma parte seguidas y sin abusar de una sola parte
  const idx = shuffle(POOL.map((_, i) => i).filter(i => POOL[i].k !== "pon"));
  const maxParte = Math.ceil(n / 5) + 1, maxDif = n <= 5 ? 1 : n <= 10 ? 3 : n;
  const cuenta = {}, cola = []; let dif = 0;
  for (let estricto = 1; estricto >= 0 && cola.length < n; estricto--)
    for (const i of idx) {
      if (cola.length >= n) break;
      const q = POOL[i];
      if (cola.includes(i) || (cola.length && POOL[cola[cola.length - 1]].k === q.k)) continue;
      if (estricto && ((cuenta[q.k] || 0) >= maxParte || (q.dif && dif >= maxDif))) continue;
      cola.push(i); cuenta[q.k] = (cuenta[q.k] || 0) + 1; if (q.dif) dif++;
    }
  // Que aparezca al menos una cita entre comillas (reemplaza un recorte de la misma parte)
  if (!cola.some(i => POOL[i].c)) {
    const citas = idx.filter(i => POOL[i].c);
    let j = cola.findIndex(i => ["arg","contra"].includes(POOL[i].k)), cita;
    if (j >= 0) cita = citas.find(i => POOL[i].k === POOL[cola[j]].k);
    else for (j = 0; j < cola.length && cita === undefined; j++) {
      const vec = [cola[j - 1], cola[j + 1]].filter(x => x !== undefined).map(x => POOL[x].k);
      cita = citas.find(i => !vec.includes(POOL[i].k));
      if (cita !== undefined) j--;
    }
    if (cita !== undefined && j >= 0 && j < cola.length) cola[j] = cita;
  }
  return cola;
}
// Huella del banco de preguntas: si el proyector y un celular tienen versiones distintas, los números de pregunta no coinciden
const VERSION_PREGUNTAS = (() => { let h = 0; const t = JSON.stringify([POOL.map(q => q.t), DIFICILES]); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return (h >>> 0).toString(36); })();
