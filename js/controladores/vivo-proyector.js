// Controlador: el proyector crea la sala, muestra la tabla y maneja la muerte súbita.

/* El proyector: crea la sala, muestra quién entra y la carrera en vivo */
/* Antes de crear la sala: ¿ensayo o ponencia? */
function elegirSala(){
  salirVivo(); stopTimer(); S = null;
  const temas = [["ensayo","El ensayo","Leen recortes y eligen si son introducción, tesis, argumento, contraargumento o conclusión.","intro"],
                 ["ponencia","La ponencia","Preguntas sobre qué es una ponencia, sus partes y cómo prepararla y presentarla.","pon"]];
  app.innerHTML = `<section class="vivo"><div class="sheet" style="max-width:860px">
    <h2 style="font-family:var(--f-marker);font-size:clamp(30px,4vw,42px);margin:0 0 6px">Nueva sala</h2>
    <p class="lead" style="max-width:none">¿Sobre qué van a jugar?</p>
    <div class="temas2" id="temas2">${temas.map(([v,t,d,c]) => `<button class="temaop" data-v="${v}" style="${cvar(c)}" aria-pressed="${cfg.tema===v}"><b>${t}</b><span>${d}</span></button>`).join("")}</div>
    <div class="opts" style="margin-top:18px">
      <div class="opt"><span>¿Cuántas preguntas?</span><div class="seg" id="sR">${[5,10,15,20].map(n=>`<button data-v="${n}" aria-pressed="${cfg.rondas===n}">${n}</button>`).join("")}</div></div>
      <div class="opt"><span>¿Con reloj?</span><div class="seg" id="sT">${[[0,"sin reloj"],[30,"30 s"],[20,"20 s"],[12,"12 s"]].map(([v,t])=>`<button data-v="${v}" aria-pressed="${cfg.tiempo===v}">${t}</button>`).join("")}</div></div>
    </div>
    <div class="cta"><button class="btn go" id="sCrear">Crear sala</button><button class="btn" id="sVolver">Volver</button></div>
  </div></section>`;
  const marcar = (id, fn) => $(id).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return;
    Sonido.tap(); $(id).querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); fn(b.dataset.v); });
  marcar("#temas2", v => cfg.tema = v);
  marcar("#sR", v => cfg.rondas = +v);
  marcar("#sT", v => cfg.tiempo = +v);
  $("#sCrear").onclick = crearSala;
  $("#sVolver").onclick = inicio;
  window.scrollTo(0, 0);
}
async function crearSala(){
  salirVivo(); stopTimer(); S = null;
  pantallaMsg("Creando la sala…", "Un momento.", false);
  try {
    const db = await fb();
    let code, ref;
    for (let n = 0; n < 8; n++) {
      code = Array.from({length:4}, () => LETRAS[Math.floor(Math.random()*LETRAS.length)]).join("");
      ref = db.ref("salas/" + code);
      const snap = await ref.get();
      if (!snap.exists()) break;
    }
    await ref.set({ estado:"espera", creada:TS(), version:VERSION_PREGUNTAS, tema:cfg.tema, rondas:cfg.rondas, tiempo:cfg.tiempo, orden:armarCola(cfg.rondas) });
    conectarHost(code, ref);
  } catch (e) { pantallaMsg("No se pudo crear la sala", errorVivo(e)); }
}
function conectarHost(code, ref, retomada = false){
  VIVO = { rol:"host", code, ref, jugadores:{}, estado:null, pantalla:null, off:[], celebrado:false, desUsadas:[], retomada };
  recordarSalaHost(code);
  escuchar(ref.child("estado"), s => { VIVO.estado = s.val() || "espera"; pintarHost(); });
  escuchar(ref.child("jugadores"), s => { VIVO.jugadores = s.val() || {}; pintarHost(); });
  escuchar(ref.child("desempate"), s => { VIVO.des = s.val(); if (VIVO.estado === "desempate") pintarHost(); });
  VIVO.desTick = setInterval(revisarDesempate, 250);
  VIVO.finTick = setInterval(() => revisarFin(), 5000);
  if (ref.root) escuchar(ref.root.child(".info/serverTimeOffset"), s => { VIVO.desfase = s.val() || 0; });
  VIVO.off.push(() => { clearInterval(VIVO.desTick); clearInterval(VIVO.finTick); });
}
/* Si el proyector recargó la página, puede volver a tomar el control de su sala */
async function retomarSala(code){
  salirVivo(); stopTimer(); S = null;
  pantallaMsg("Retomando la sala…", "Un momento.", false);
  try {
    const db = await fb(), ref = db.ref("salas/" + code), sala = (await ref.get()).val();
    if (!sala || sala.estado === "cerrada" || Date.now() - (sala.creada || 0) > VIGENCIA_SALA_MS) {
      olvidarSalaHost();
      return pantallaMsg("No se pudo retomar", "Esa sala ya no está disponible. Crea una nueva.");
    }
    cfg.tema = sala.tema || "ensayo"; cfg.rondas = sala.rondas || 10; cfg.tiempo = sala.tiempo || 0;
    conectarHost(code, ref, true);
    VIVO.celebrado = sala.estado === "fin";
  } catch (e) { pantallaMsg("No se pudo retomar", errorVivo(e)); }
}
function urlSala(){ return URL_JUEGO + "?sala=" + VIVO.code; }
function narrar(js){
  const v = VIVO.voz || (VIVO.voz = { racha:{}, out:{}, lider:null, tLider:0 });
  const frases = [];
  js.forEach((j, i) => {
    const r = j.racha || 0, nom = j.nombre;
    if (r < 5) v.racha[j.id] = 0;
    else if (r % 5 === 0 && v.racha[j.id] !== r) {
      v.racha[j.id] = r;
      if (i === 0) v.rachaTop = r;
      frases.push(i < 5 ? `¡${nom} lleva ${r} seguidas y está en ${PUESTOS[i]} puesto!` : `¡${nom} lleva ${r} respuestas seguidas!`);
    }
    if (j.out && !v.out[j.id]) { v.out[j.id] = true; frases.push(`¡Ay no! Ahorcaron a ${nom}.`); }
  });
  const top = js[0], rTop = v.rachaTop; v.rachaTop = 0;
  if (top && (top.pts || 0) > 0 && top.id !== v.lider && Date.now() - v.tLider > 7000) {
    const con = rTop ? ` con ${rTop} seguidas` : "";
    if (rTop) frases.shift();
    frases.unshift(v.lider ? `¡${top.nombre} pasa al primer puesto${con}!` : `¡${top.nombre} toma la delantera${con}!`);
    v.lider = top.id; v.tLider = Date.now();
  }
  if (frases.length) Voz.decir(frases.slice(0, 2).join(" "));
}
function pintarHost(){
  if (!VIVO || VIVO.rol !== "host") return;
  const est = VIVO.estado, js = rankingVivo(VIVO.jugadores);
  if (est === "desempate") { VIVO.pantalla = est; return pintarDesempateHost(); }
  const clave = est === "fin" ? "fin:" + js.slice(0, 3).map(j => j.id + (j.dg ? "*" : "")).join(",") : est;
  if (VIVO.pantalla !== clave) {
    VIVO.pantalla = clave;
    if (est === "espera") {
      app.innerHTML = `<section class="vivo">
        <div class="sheet"><div class="sala-top"><div>
          <p class="lead">Entra desde tu celular a</p><div class="qr-url" style="font-size:clamp(24px,3vw,34px)">${esc(URL_JUEGO.replace(/^https:\/\//, ""))}</div>
          <p class="lead" style="margin-top:12px">toca "Unirme a una sala" y escribe el código:</p><div class="codigo">${VIVO.code}</div></div>
          <div class="qr" id="qrSala"></div></div></div>
        <div class="hud" style="margin-top:20px"><h2 class="vtitle" id="vCount"></h2>
          <div class="cta" style="margin:0"><button class="btn go" id="vStart" disabled>¡Empezar!</button><button class="btn small" id="vSalir">Cerrar sala</button></div></div>
        <div class="vlobby" id="vList"></div>
        <p class="note" style="font-size:20px">${textoConfigSala()}</p>
        ${Voz.ok ? `<div class="opt" id="vozRow" style="margin-top:14px"><span>Voz del narrador</span>
          <div class="cta" style="margin:0;align-items:center"><select id="vozSel" class="tbtn" aria-label="Voz del narrador" style="max-width:min(100%,420px)"></select><button class="btn small" id="vozTest">Probar voz</button></div>
          <span class="note" style="font-size:18px">Si suena robótica, prueba otra. En Microsoft Edge salen voces "Natural" que suenan casi humanas.</span></div>` : ""}
      </section>`;
      pintarQR($("#qrSala"), 220, urlSala());
      $("#vStart").onclick = () => VIVO.ref.update({ estado:"jugando", inicio:TS() });
      if (Voz.ok) {
        const llenar = () => { const sel = $("#vozSel"); if (!sel) return;
          sel.innerHTML = Voz.lista.length ? Voz.lista.map(v => `<option ${v === Voz.actual ? "selected" : ""}>${esc(v.name)}</option>`).join("") : `<option>voz del navegador</option>`; };
        llenar(); Voz.onCambio(llenar);
        $("#vozSel").onchange = e => { Voz.usar(e.target.value); Voz.decir("¡Hola! Así sueno yo.", true); };
        $("#vozTest").onclick = () => Voz.decir("¡Juan pasa al primer puesto con 5 seguidas!", true);
      }
      $("#vSalir").onclick = inicio;
    } else if (est === "jugando") {
      app.innerHTML = `<section class="vivo">
        <div class="hud"><span class="prog">Sala <span class="hl" style="${cvar("tesis")}">${VIVO.code}</span> · en vivo</span><span class="prog" id="vCount"></span>
          <div class="cta" style="margin:0">${Voz.ok ? `<button class="btn small" id="vVoz" aria-pressed="${Voz.on}">${Voz.on ? "Voz: sí" : "Voz: no"}</button>` : ""}<button class="btn small" id="vFin">Terminar partida</button></div></div>
        <div class="board" id="vList"></div>
        <div class="mini-join"><div class="qr" id="qrSala"></div><span class="note">¿llegaste tarde? escanea y entra con el código <b>${VIVO.code}</b></span></div>
      </section>`;
      pintarQR($("#qrSala"), 96, urlSala());
      $("#vFin").onclick = cerrarPartida;
      VIVO.cerrando = false; VIVO.resolviendo = 0;
      if ($("#vVoz")) $("#vVoz").onclick = e => { Voz.set(!Voz.on); e.currentTarget.textContent = Voz.on ? "Voz: sí" : "Voz: no"; e.currentTarget.setAttribute("aria-pressed", Voz.on); };
      VIVO.voz = null;
      if (VIVO.retomada) VIVO.retomada = false; else Voz.decir("¡Que empiece el juego! Mucha suerte a todos.", true);
    } else {
      const [p1, p2, p3] = js;
      const col = (j, n, c, h) => j ? `<div><span>${esc(j.nombre)}</span><small>${j.pts||0} pts</small><div class="step" style="--c:var(${c});height:${h}px">${n}</div></div>` : `<div></div>`;
      app.innerHTML = `<section class="vivo final">
        <h2 class="vtitle" style="font-size:clamp(40px,7vw,72px)">${p1 ? `¡Gana ${esc(p1.nombre)}!` : "Partida terminada"}</h2>
        ${motivoDesempate(p1, p2) ? `<p class="lead" style="max-width:none;color:var(--pen)">${esc(motivoDesempate(p1, p2))}</p>` : ""}
        <div class="podio3">${col(p2,2,"--hl-concl",120)}${col(p1,1,"--hl-intro",170)}${col(p3,3,"--hl-contra",90)}</div>
        <div class="board" id="vList"></div>
        <div class="cta"><button class="btn go" id="vOtra">Otra partida con los mismos</button><button class="btn" id="vSalir">Cerrar sala</button></div>
      </section>`;
      $("#vOtra").onclick = () => {
        const upd = { estado:"espera", tema:cfg.tema, rondas:cfg.rondas, tiempo:cfg.tiempo, orden:armarCola(cfg.rondas) };
        Object.keys(VIVO.jugadores).forEach(id => Object.assign(upd, { [`jugadores/${id}/pts`]:0, [`jugadores/${id}/ok`]:0, [`jugadores/${id}/n`]:0, [`jugadores/${id}/err`]:0, [`jugadores/${id}/out`]:false, [`jugadores/${id}/i`]:0, [`jugadores/${id}/terminado`]:false, [`jugadores/${id}/alcanzado`]:null, [`jugadores/${id}/racha`]:0, [`jugadores/${id}/dg`]:null }));
        upd.desempate = null;
        VIVO.celebrado = false; VIVO.ref.update(upd);
      };
      $("#vSalir").onclick = inicio;
      const faltaDg = VIVO.des && VIVO.des.ganador && p1 && p1.id !== VIVO.des.ganador;
      if (!VIVO.celebrado && !faltaDg) { VIVO.celebrado = true; Sonido.victoria(); confeti(); if (p1) setTimeout(() => Voz.decir(`¡${p1.nombre} gana la partida con ${p1.pts || 0} puntos!${p2 ? ` Segundo lugar para ${p2.nombre}.` : ""}${p3 ? ` Y tercero, ${p3.nombre}.` : ""}`, true), 900); }
    }
  }
  const conectados = js.filter(j => j.conectado !== false);
  if (est === "espera") {
    $("#vCount").textContent = conectados.length ? `${conectados.length} ${conectados.length === 1 ? "jugador" : "jugadores"} en la sala` : "Esperando jugadores…";
    $("#vStart").disabled = !conectados.length;
    const cols = ["--hl-intro","--hl-tesis","--hl-arg","--hl-contra","--hl-concl"];
    $("#vList").innerHTML = conectados.map((j,i) => `<span style="--c:var(${cols[i%5]});--r:${(i*37%7)-3}deg">${esc(j.nombre)}</span>`).join("");
    return;
  }
  const total = (VIVO.rondasActual || cfg.rondas);
  pintarTabla(js, total);
  if (est === "jugando") {
    $("#vCount").textContent = `${js.length} jugando · ${faltan(js)} sin terminar`;
    narrar(js);
    revisarFin(js);
  }
}
function revisarFin(js){
  if (!VIVO || VIVO.rol !== "host" || VIVO.estado !== "jugando") return;
  js = js || Object.values(VIVO.jugadores);
  if (js.length && !faltan(js)) cerrarPartida();
}
// Tabla del proyector: solo los 10 primeros, y cada fila se actualiza sin redibujar toda la tabla
function pintarTabla(js, total){
  const cont = $("#vList"); if (!cont) return;
  const MAX = innerHeight < 800 ? 8 : 10, vis = js.slice(0, MAX), vistos = new Set();
  if (VIVO.filasDe !== cont) { VIVO.filas = {}; VIVO.filasDe = cont; cont.innerHTML = ""; }
  vis.forEach((j, i) => {
    vistos.add(j.id);
    let f = VIVO.filas[j.id];
    if (!f) {
      f = document.createElement("div"); f._err = -1;
      f.innerHTML = `<span class="pos"></span><span class="mh"></span><span class="nm"></span><span class="bar"><i></i></span><span class="estado"></span><span class="pts"></span>`;
      VIVO.filas[j.id] = f;
    }
    f.className = `vrow ${j.out?"out":""} ${j.conectado===false?"off":""} ${i===0&&!j.out?"top":""}`;
    f.querySelector(".pos").textContent = i + 1;
    if (f._err !== (j.err||0)) { f._err = j.err||0; f.querySelector(".mh").innerHTML = horca(j.err||0, {mini:true}); }
    f.querySelector(".nm").textContent = j.nombre || "";
    f.querySelector(".bar i").style.width = Math.min(100, (j.n||0) / total * 100) + "%";
    f.querySelector(".estado").textContent = j.out ? "ahorcado" : j.terminado ? "terminó" : `${j.n||0}/${total}`;
    f.querySelector(".pts").textContent = j.pts || 0;
    cont.appendChild(f);
  });
  Object.keys(VIVO.filas).forEach(id => { if (!vistos.has(id)) { VIVO.filas[id].remove(); delete VIVO.filas[id]; } });
  let mas = cont.querySelector(".vmas");
  if (js.length > MAX) { if (!mas) { mas = document.createElement("p"); mas.className = "vmas note"; } mas.textContent = `y ${js.length - MAX} más jugando`; cont.appendChild(mas); }
  else if (mas) mas.remove();
}
/* Muerte súbita: si hay empate en el primer lugar, solo los empatados responden una pregunta difícil */
function cerrarPartida(){
  if (!VIVO || VIVO.cerrando) return;
  VIVO.cerrando = true;
  const js = rankingVivo(VIVO.jugadores), top = js[0];
  const empatados = top && !top.out && (top.pts || 0) > 0 ? js.filter(j => !j.out && j.conectado !== false && (j.pts || 0) === top.pts) : [];
  if (empatados.length >= 2) iniciarDesempate(empatados.map(j => j.id), 1, top.pts);
  else VIVO.ref.update({ estado:"fin" });
}
function iniciarDesempate(ids, ronda, pts){
  const lista = DIFICILES[cfg.tema] || DIFICILES.ensayo;
  VIVO.desUsadas = VIVO.desUsadas || [];
  let libres = lista.map((_, i) => i).filter(i => !VIVO.desUsadas.includes(i));
  if (!libres.length) { VIVO.desUsadas = []; libres = lista.map((_, i) => i); }
  const q = shuffle(libres)[0]; VIVO.desUsadas.push(q);
  VIVO.ref.update({ estado:"desempate", desempate:{ ids:Object.fromEntries(ids.map(i => [i, true])), orden:ids, tema:cfg.tema in DIFICILES ? cfg.tema : "ensayo", q, ronda, pts, limite:Date.now() + (DES_SEG + 3) * 1000 } });
  Voz.decir(ronda === 1 ? `¡Empate! Muerte súbita entre ${ids.map(nombreDe).join(" y ")}.` : "¡Nadie acertó! Va otra pregunta.", true);
}
function revisarDesempate(){
  const d = VIVO && VIVO.des;
  if (!d || d.ganador || VIVO.estado !== "desempate") return;
  const r = Math.max(0, Math.ceil((d.limite - Date.now()) / 1000) - 3), el = $("#desReloj");
  if (el) { el.textContent = r + "s"; el.classList.toggle("low", r <= 5); }
  const resp = Object.entries(d.resp || {}).filter(([id, x]) => d.ids[id] && x.ronda === d.ronda);
  if (resp.length >= d.orden.length || Date.now() >= d.limite) resolverDesempate(d, resp);
}
function resolverDesempate(d, resp){
  if (VIVO.resolviendo === d.ronda) return;
  VIVO.resolviendo = d.ronda;
  const aciertos = resp.filter(([, x]) => x.ok).sort((a, b) => (a[1].t || 0) - (b[1].t || 0));
  const lista = DIFICILES[d.tema];
  if (!aciertos.length && d.ronda < 3 && lista.length > VIVO.desUsadas.length) { setTimeout(() => iniciarDesempate(d.orden, d.ronda + 1, d.pts), 2500); return; }
  // Gana quien acertó primero; si nadie acertó en 3 rondas, se mantiene el orden de la tabla
  const gan = aciertos.length ? aciertos[0][0] : d.orden[0];
  VIVO.ref.child("desempate").update({ ganador:gan });
  Voz.decir(`¡${nombreDe(gan)} gana la muerte súbita!`, true);
  setTimeout(() => { if (VIVO) VIVO.ref.update({ [`jugadores/${gan}/dg`]:1 }).then(() => VIVO && VIVO.ref.update({ estado:"fin" })); }, 5500);
}
function pintarDesempateHost(){
  const d = VIVO.des; if (!d) return;
  const q = DIFICILES[d.tema][d.q], { frag, preg } = partesPregunta(q[0]), resp = d.resp || {};
  const estado = id => { const x = resp[id]; if (!x || x.ronda !== d.ronda) return d.ganador ? `<span class="no">sin responder</span>` : "pensando…";
    return d.ganador ? (x.ok ? `<span class="ok">¡correcta!</span>` : `<span class="no">incorrecta</span>`) : "ya respondió"; };
  app.innerHTML = `<section class="vivo">
    <div class="hud"><h2 class="vtitle" style="font-size:clamp(40px,7vw,72px)">¡Muerte súbita!</h2>${d.ganador ? "" : `<span class="timer" id="desReloj"></span>`}</div>
    <p class="lead" style="max-width:none">Empate a ${d.pts} puntos. Solo ${d.orden.map(id => esc(nombreDe(id))).join(" y ")} responden esta pregunta difícil en su celular${d.ronda > 1 ? ` (ronda ${d.ronda})` : ""}. Gana quien acierte primero.</p>
    <div class="sheet clip" style="margin-top:16px"><div class="tema">pregunta difícil</div><blockquote>${frag ? `«${esc(frag)}»` : esc(preg)}</blockquote>${frag ? `<p class="pregunta" style="margin-top:14px">${esc(preg)}</p>` : ""}</div>
    <div class="duelo">${d.orden.map(id => `<div class="${d.ganador === id ? "gana" : ""}"><span>${esc(nombreDe(id))}</span><span>${estado(id)}</span></div>`).join("")}</div>
    ${d.ganador ? `<p class="lead" style="max-width:none">La respuesta correcta era: <b>${esc(q[1][0])}</b>. ${esc(q[2])}</p><h3 class="vtitle">¡Gana ${esc(nombreDe(d.ganador))}!</h3>` : ""}
  </section>`;
  if (d.ganador && VIVO.desConfeti !== d.ronda) { VIVO.desConfeti = d.ronda; confeti(); Sonido.victoria(); }
  revisarDesempate();
}
function textoConfigSala(){ return `Tema: ${cfg.tema === "ponencia" ? "la ponencia" : "el ensayo"} · ${cfg.rondas} ${cfg.tema === "ponencia" ? "preguntas" : "recortes"} · ${cfg.tiempo ? cfg.tiempo + " s cada una" : "sin reloj"}`; }
