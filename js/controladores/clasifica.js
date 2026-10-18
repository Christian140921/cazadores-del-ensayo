// Controlador: modo Clasifica (solo, por equipos o en un celular de la sala).

function bonusCita(q){
  return `<div class="bonus" id="bonus"><h4>Bonus +5: ¿para qué usa el autor las palabras entre comillas?</h4>
    <div class="row2">${shuffle(USOS_CITA.slice()).map(([v,t]) => `<button class="bq" data-v="${v}">${esc(t)}</button>`).join("")}</div><div id="bonusFb"></div></div>`;
}
function responderBonus(q, b){
  if (S.bonusListo) return;
  S.bonusListo = true;
  const correcta = q.k === "contra" ? "contra" : "apoyo", ok = b.dataset.v === correcta, eq = S.equipos[S.turno];
  document.querySelectorAll(".bq").forEach(x => { x.disabled = true; if (x.dataset.v === correcta) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
  if (ok) { eq.pts += 5; Sonido.acierto(); } else Sonido.error();
  const uso = correcta === "contra" ? "mostrar lo que piensan quienes no están de acuerdo y después responderles" : "respaldar su tesis con la voz de alguien más";
  $("#bonusFb").innerHTML = `<p>${ok ? "<b>¡Bien! +5.</b> " : "<b>No.</b> "}Las comillas indican que esas palabras son de ${esc(q.c)}, no del autor. Aquí las usa para ${uso}.</p>`;
  $("#scores").innerHTML = scoresHTML();
  publicarVivo();
}
function startClasifica(vivo){
  const enEquipos = !vivo && cfg.equipos;
  // Por equipos, la cantidad de recortes se ajusta a un múltiplo del número de equipos para que todos jueguen las mismas veces
  const n = enEquipos ? Math.max(cfg.nEquipos, Math.ceil(cfg.rondas / cfg.nEquipos) * cfg.nEquipos) : cfg.rondas;
  const cola = (vivo ? vivo.orden : armarCola(n)).map(i => POOL[i]);
  const equipos = enEquipos ? cfg.nombres.slice(0,cfg.nEquipos).map((nm,i)=>({nombre:(nm||"").trim()||`Equipo ${i+1}`, pts:0, ok:0, n:0, err:0, out:false, racha:0})) : [{nombre:(vivo ? vivo.nombre : cfg.jugador) || "Tú", pts:0, ok:0, n:0, err:0, out:false, racha:0}];
  S = { cola, i:0, equipos, turno:0, racha:0, respondido:false, fallos:[], vivo: vivo || null, stats:Object.fromEntries([...ORDEN_PARTES, "pon"].map(k=>[k,{ok:0,n:0}])) };
  // Volvió a entrar a una partida en curso: retoma su puntaje y sigue desde donde iba
  const prev = vivo && vivo.previo;
  if (prev) {
    Object.assign(equipos[0], { pts:prev.pts||0, ok:prev.ok||0, n:prev.n||0, err:prev.err||0, out:!!prev.out });
    S.ptsPublicados = prev.pts || 0;
    if (prev.terminado || prev.out || (prev.n||0) >= cola.length) { S.i = cola.length - 1; return final(); }
    S.i = prev.n || 0;
  }
  ronda();
}
function scoresHTML(){
  if (!cfg.equipos) return "";
  return `<div class="scores">${S.equipos.map((e,i)=>`<span class="score ${i===S.turno?"turn":""} ${e.out?"out":""}">${horca(e.err,{mini:true})}${esc(e.nombre)} <b>${e.pts}</b></span>`).join("")}</div>`;
}
function barra(){
  const pct = S.i / S.cola.length;
  return `<svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6 Q150 4 298 7" stroke="var(--grid)" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M2 6 Q150 4 298 7" stroke="var(--pen)" stroke-width="5" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="${pct*100} 200" filter="url(#rough)"/></svg>`;
}
function hudHTML(){
  return `<div class="hud">
    ${S.vivo ? `<span class="prog" id="vRank" style="color:var(--red)"></span>` : ""}<span class="prog">${S.cola[S.i]?.k === "pon" ? "Pregunta" : "Recorte"} ${Math.min(S.i+1,S.cola.length)} de ${S.cola.length}${S.racha>=2?`<small>racha de ${S.racha}</small>`:""}</span>
    <div class="pencil-bar">${barra()}</div>
    <span class="timer" id="timer" ${cfg.tiempo?"":"hidden"}></span>
    <div id="scores" style="width:100%">${scoresHTML()}</div>
  </div>`;
}
function ronda(){
  stopTimer();
  const q = S.cola[S.i], eq = S.equipos[S.turno];
  S.racha = eq.racha || 0;
  S.respondido = false;
  const esPon = q.k === "pon";
  const opts = esPon
    ? shuffle(q.ops.map((_, i) => i)).map((i,n)=>`<button class="ans" data-k="${i}" style="${cvar("pon")}"><span class="cap">${n+1}</span><span class="txt">${esc(q.ops[i])}</span></button>`).join("")
    : ORDEN_PARTES.map((k,n)=>`<button class="ans" data-k="${k}" style="${cvar(k)}"><span class="cap">${n+1}</span><span class="txt">${PARTES[k].nombre}</span></button>`).join("");
  app.innerHTML = `${hudHTML()}
    <div class="turnline">${cfg.equipos ? "Turno de" : "Juega"} <span class="hl" style="${cvar("intro")}">${esc(eq.nombre)}</span></div>
    <div class="stage">
      <div class="main">
        <div class="sheet clip"><div class="tema">${esPon ? `tema: <span class="hl" style="${cvar("pon")}">la ponencia</span>` : `del ensayo «${esc(q.tema)}»`}</div>
          <blockquote id="quote">${conCitas(esc(q.pq ? "«" + q.t + "»" : q.t))}</blockquote></div>
        <p class="pregunta">${esPon ? (q.pq ? esc(q.pq) : "Elige la respuesta correcta:") : PREGUNTAS_ENSAYO[S.i % PREGUNTAS_ENSAYO.length]}</p>
        <div class="answers ${esPon ? "pon" : ""}" id="answers">${opts}</div>
        <div class="tools-row"><button class="pista" id="pista"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Pista: quita 2 opciones (vale la mitad)</button></div>
      </div>
      <aside class="side" id="gallows">${horca(eq.err)}${vidasHTML(eq.err)}</aside>
    </div>
    <div id="fb"></div>
    <p class="keys">atajos: teclas 1 a ${esPon ? 4 : 5} para responder, P para la pista y Enter para seguir</p>`;
  $("#answers").addEventListener("click", e => { const b = e.target.closest(".ans"); if (b && !b.disabled) responder(b.dataset.k); });
  S.pista = false;
  $("#pista").onclick = usarPista;
  if (cfg.tiempo) {
    // El tiempo se calcula desde un límite fijo, así el reloj siempre baja de uno en uno aunque el navegador se atrase
    const limite = Date.now() + cfg.tiempo * 1000;
    S.restante = cfg.tiempo; pintarTimer();
    stopTimer();
    timer = setInterval(() => {
      const r = Math.max(0, Math.ceil((limite - Date.now()) / 1000));
      if (r === S.restante) return;
      S.restante = r; pintarTimer();
      if (r <= 5 && r > 0) Sonido.tic();
      if (r <= 0) { stopTimer(); responder(null); }
    }, 200);
  }
}
function pintarTimer(){ const t = $("#timer"); if (!t) return; t.textContent = S.restante + "s"; t.classList.toggle("low", S.restante <= 5); }
function usarPista(){
  if (!S || S.respondido || S.pista) return;
  S.pista = true; Sonido.tap();
  const q = S.cola[S.i];
  const correcta = q.k === "pon" ? String(q.ok) : q.k;
  shuffle([...document.querySelectorAll(".ans")].filter(b => b.dataset.k !== correcta)).slice(0, 2).forEach(b => { b.disabled = true; b.classList.add("out"); });
  if (q.k !== "pon") $("#quote").innerHTML = conCitas(marcarClaves(q.t, q.k));
  $("#pista").disabled = true;
}
function responder(k){
  if (!S || S.respondido) return;
  S.respondido = true; stopTimer();
  const q = S.cola[S.i], esPon = q.k === "pon", correcta = esPon ? String(q.ok) : q.k, ok = k === correcta, eq = S.equipos[S.turno];
  eq.n++; S.stats[q.k].n++;
  let ganados = 0;
  if (ok) {
    eq.racha = (eq.racha || 0) + 1; S.racha = eq.racha; eq.ok++; S.stats[q.k].ok++;
    ganados = 10 + (cfg.tiempo ? Math.round(S.restante / cfg.tiempo * 5) : 0) + (S.racha >= 3 ? 5 : 0);
    if (S.pista) ganados = Math.ceil(ganados / 2);
    eq.pts += ganados;
    Sonido.acierto();
  } else {
    eq.racha = 0; S.racha = 0; eq.err++;
    S.fallos.push({ q, k, quien: eq.nombre });
    if (eq.err >= MAX_FALLOS) eq.out = true;
    $("#gallows").innerHTML = horca(eq.err, {animar:true}) + vidasHTML(eq.err);
    Sonido.error(); Sonido.trazo();
    if (eq.out) setTimeout(() => Sonido.derrota(), 450);
  }
  if ($("#pista")) $("#pista").disabled = true;
  document.querySelectorAll(".ans").forEach(b => {
    b.disabled = true; b.classList.remove("out");
    if (b.dataset.k === correcta) b.classList.add("right");
    else if (b.dataset.k === k) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  const quote = $("#quote");
  quote.innerHTML = `<span class="hl sweep off" style="${cvar(q.k)}">${conCitas(esc(q.pq ? "«" + q.t + "»" : q.t))}</span>`;
  requestAnimationFrame(() => requestAnimationFrame(() => quote.firstChild.classList.remove("off")));
  const p = PARTES[q.k];
  let titulo = ok ? (S.racha >= 3 ? `¡Correcto! +${ganados} (racha de ${S.racha})` : `¡Correcto! +${ganados}`)
    : esPon ? (k === null ? `Se acabó el tiempo. La respuesta era: ${q.ops[q.ok]}` : `No. La respuesta correcta es: ${q.ops[q.ok]}`)
    : k === null ? `Se acabó el tiempo. Era ${p.nombre}.` : `No era ${PARTES[k].nombre}: es ${p.nombre}.`;
  if (eq.out) titulo += cfg.equipos ? ` ${eq.nombre} quedó ahorcado.` : " Quedaste ahorcado.";
  const fin = terminado();
  $("#fb").innerHTML = `<div class="fb ${ok?"ok":"no"}" role="status">
    <h3>${esc(titulo)}</h3>
    <p>${esc(q.w)}</p>
    ${esPon ? "" : `<p class="def"><b>${p.nombre}:</b> ${p.def}</p>`}
    ${q.c ? bonusCita(q) : ""}
    <div class="cta"><button class="btn go small" id="next">${fin?"Ver resultados":esPon?"Siguiente pregunta":"Siguiente recorte"}</button></div>
  </div>`;
  $("#next").onclick = siguiente;
  // En proyector la explicación va justo debajo del recorte, para que se vean juntos sin bajar
  if (matchMedia("(min-width:900px)").matches && $(".main .pregunta")) $(".main").insertBefore($("#fb"), $(".main .pregunta"));
  S.bonusListo = false;
  document.querySelectorAll(".bq").forEach(b => b.onclick = () => responderBonus(q, b));
  $("#next").focus({preventScroll:true});
  $("#fb").scrollIntoView({behavior: reduce ? "auto" : "smooth", block:"nearest"});
  $("#scores").innerHTML = scoresHTML();
  publicarVivo();
}
function siguiente(){
  if (terminado()) return final();
  S.i++;
  if (cfg.equipos) { do { S.turno = (S.turno + 1) % S.equipos.length; } while (S.equipos[S.turno].out); }
  ronda(); window.scrollTo(0,0);
  rankJugador();
}
// Repaso de los fragmentos en que hubo errores, para estudiar al final
function repasoHTML(){
  if (!S.fallos.length) return "";
  return `<div class="sheet repaso"><h3>Repasa tus errores</h3>${S.fallos.map(({q,k,quien}) => `<article>
    <blockquote><span class="hl" style="${cvar(q.k)}">${conCitas(esc(q.pq ? "«" + q.t + "» " + q.pq : q.t))}</span></blockquote>
    <div class="meta">${cfg.equipos ? esc(quien) + ": " : ""}${q.k === "pon"
      ? `${k ? `<s>${esc(q.ops[k])}</s> → ` : "se acabó el tiempo → "}<b>${esc(q.ops[q.ok])}</b>`
      : `${k ? `<s>${PARTES[k].nombre}</s> → ` : "se acabó el tiempo → "}<b>${PARTES[q.k].nombre}</b>`}</div>
    <p>${esc(q.w)}</p></article>`).join("")}</div>`;
}
function final(){
  stopTimer();
  S.fin = true;
  let cabecera, gano = false;
  if (cfg.equipos) {
    const rank = S.equipos.slice().sort((a,b)=>(a.out-b.out) || (b.pts-a.pts) || (a.err-b.err));
    const g = rank[0];
    const empate = rank.length > 1 && rank[1].out === g.out && rank[1].pts === g.pts && rank[1].err === g.err;
    gano = !g.out;
    const titulo = g.out ? "¡Todos ahorcados!" : empate ? "¡Empate!" : `¡Gana ${esc(g.nombre)}!`;
    cabecera = `<div class="result"><div>${horca(g.err, {estado: g.out ? "muerto" : "salvado"})}</div><div>
      <h2 class="${gano?"win":"lose"}">${titulo}</h2>
      ${!empate && rank.length > 1 && rank[1].out === g.out && rank[1].pts === g.pts ? `<p style="margin:4px 0 0">Empate a ${g.pts} puntos: gana ${esc(g.nombre)} por tener menos fallos.</p>` : ""}
      <div class="podium">${rank.map((e,i)=>`<div class="${e.out?"out":""}">${horca(e.err,{mini:true})}<span>${i+1}. ${esc(e.nombre)}${e.out?" (ahorcado)":""}</span><em>${e.pts} pts · ${e.ok}/${e.n}</em></div>`).join("")}</div></div></div>`;
  } else {
    const e = S.equipos[0];
    // El proyector cerró la partida antes de que este jugador llegara al final
    const cortada = !e.out && e.n < S.cola.length;
    gano = !e.out && !cortada;
    const msg = cortada ? `Respondiste ${e.n} de ${S.cola.length} recortes antes de que se cerrara la partida. Mira el proyector para ver el podio.`
      : e.out ? "Te faltaron recortes por resolver. Repasa la guía y vuelve a intentarlo."
      : e.err === 0 ? "Perfecto: no se dibujó ni una sola línea del muñeco."
      : `Llegaste al final con ${e.err} ${e.err===1?"fallo":"fallos"}. El muñeco se salvó por poco.`;
    cabecera = `<div class="result"><div>${horca(e.err, cortada ? {} : {estado: e.out ? "muerto" : "salvado"})}</div><div>
      <h2 class="${cortada ? "" : gano ? "win" : "lose"}">${cortada ? "La partida terminó" : e.out ? "¡Ahorcado!" : "¡Lo salvaste!"}</h2>
      <div class="sum">${e.ok} de ${e.n} correctas · ${e.pts} puntos</div>
      <p>${msg}</p></div></div>
      <div class="sheet records" id="recBox"><h3>Mejores puntajes</h3><div id="recList"></div></div>`;
  }
  const bk = [...ORDEN_PARTES, "pon"].filter(k=>S.stats[k].n).map(k=>{const s=S.stats[k];return `<div class="bk" style="${cvar(k)}"><span>${PARTES[k].nombre}</span><span class="track"><i style="width:${s.ok/s.n*100}%"></i></span><span class="v">${s.ok}/${s.n}</span></div>`;}).join("");
  app.innerHTML = `<section class="final">
    ${cabecera}
    <div class="sheet bars"><h3>${S.stats.pon.n ? "Aciertos por tema" : "Aciertos por parte del ensayo"}</h3>${bk}</div>
    ${repasoHTML()}
    <div class="cta"><button class="btn go" id="again">Jugar otra vez</button>${S.stats.pon.n ? "" : `<button class="btn" id="ord">Ordenar un ensayo</button>`}<button class="btn" id="home">Volver al inicio</button></div>
  </section>`;
  S.respondido = true;
  $("#again").onclick = () => startClasifica(); if ($("#ord")) $("#ord").onclick = () => startOrdena(); $("#home").onclick = inicio;
  // En modo individual el puntaje se guarda solo, con el nombre que se escribió al empezar
  if (S.vivo) {
    publicarVivo({ terminado:true });
    $("#recBox h3").textContent = "Tabla en vivo";
    $("#again").remove(); if ($("#ord")) $("#ord").remove();
    rankJugador();
  }
  if (!cfg.equipos && !S.guardado && !S.vivo) {
    S.guardado = true;
    const e = S.equipos[0], id = Date.now() + "-" + Math.random().toString(36).slice(2,6);
    const lista = guardarRecord({ id, nombre: e.nombre, pts: e.pts, ok: e.ok, n: e.n });
    const pos = lista.findIndex(r => r.id === id);
    $("#recList").innerHTML = recordsHTML(lista, id) + (pos >= 5 || pos < 0 ? `<p class="note" style="font-size:20px;margin:6px 0 0">esta vez no entraste al top 5. ¡Inténtalo otra vez!</p>` : "");
    if (pos === 0 && lista.length > 1) $("#recBox h3").textContent = "¡Nuevo récord!";
  }
  if (gano) { Sonido.victoria(); confeti(); }
  window.scrollTo(0,0);
}
