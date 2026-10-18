// Controlador: modo Ordena el ensayo.

/* ---------- Ordena ---------- */
let ultimoEnsayo = -1;
function startOrdena(){
  stopTimer(); S = null;
  let idx; do { idx = Math.floor(Math.random()*ENSAYOS.length); } while (ENSAYOS.length > 1 && idx === ultimoEnsayo);
  ultimoEnsayo = idx;
  const e = ENSAYOS[idx];
  const items = shuffle(e.f.map(([k,t],i)=>({k,t,i})));
  const nuevosEquipos = () => cfg.equipos
    ? cfg.nombres.slice(0,cfg.nEquipos).map((n,i)=>({nombre:(n||"").trim()||`Equipo ${i+1}`, pts:0, err:0, out:false}))
    : [{nombre: cfg.jugador.trim() || "Tú", pts:0, err:0, out:false}];
  const O = { orden:[], equipos:nuevosEquipos(), turno:0, malo:-1, nuevoErr:false, celebrado:false };
  const vivosO = () => O.equipos.filter(x => !x.out);
  const pasarTurno = () => { if (!cfg.equipos || !vivosO().length) return; do { O.turno = (O.turno + 1) % O.equipos.length; } while (O.equipos[O.turno].out); };
  const pintar = () => {
    const eq = O.equipos[O.turno];
    const perdio = vivosO().length === 0, completo = O.orden.length === items.length, fin = perdio || completo;
    const rank = O.equipos.slice().sort((a,b)=>(a.out-b.out) || (b.pts-a.pts) || (a.err-b.err));
    const ganador = rank[0], empate = cfg.equipos && rank.length > 1 && rank[1].out === ganador.out && rank[1].pts === ganador.pts && rank[1].err === ganador.err;
    const msg = fin ? (completo ? "Así queda el ensayo, de principio a fin." : (cfg.equipos ? "Todos los equipos quedaron ahorcados. Este era el orden correcto." : "Quedaste ahorcado. Este era el orden correcto."))
      : O.aviso ? `${esc(O.aviso)} ¿Cuál va en el lugar ${O.orden.length+1}?`
      : O.orden.length === 0 ? "¿Cuál párrafo va primero?" : `Bien. ¿Cuál va en el lugar ${O.orden.length+1}?`;
    O.aviso = "";
    const chips = cfg.equipos ? `<div class="scores">${O.equipos.map((x,i)=>`<span class="score ${!fin && i===O.turno?"turn":""} ${x.out?"out":""}">${horca(x.err,{mini:true})}${esc(x.nombre)} <b>${x.pts}</b></span>`).join("")}</div>` : "";
    const lado = fin && completo ? ganador : eq;
    app.innerHTML = `<div class="hud"><span class="prog">Ordena «${esc(e.tema)}»</span><div style="width:100%">${chips}</div></div>
      ${!fin ? `<div class="turnline">${cfg.equipos ? "Turno de" : "Juega"} <span class="hl" style="${cvar("intro")}">${esc(eq.nombre)}</span></div>` : ""}
      <div class="stage">
        <div class="main"><p class="lead">${msg}</p><div class="olist" id="olist" style="margin-top:14px"></div></div>
        <aside class="side">${horca(lado.err, {animar:O.nuevoErr, estado: fin && completo && !lado.out ? "salvado" : "jugando"})}${fin && completo && !lado.out ? `<div class="lives" style="color:var(--green)">¡Salvado!</div>` : vidasHTML(lado.err)}</aside>
      </div>
      <div id="ofb"></div>
      <div class="cta">${fin
        ? `<button class="btn go" id="otro">Otro ensayo</button><button class="btn" id="home">Volver al inicio</button>`
        : `<button class="btn small" id="reset">Empezar de nuevo</button>`}</div>`;
    O.nuevoErr = false;
    const list = $("#olist");
    if (fin) {
      e.f.forEach(([k,t],j) => {
        const d = document.createElement("div");
        d.className = "strip placed"; d.style.opacity = 1;
        d.innerHTML = `<span class="num">${j+1}</span><span>${conCitas(esc(t))}<br><span class="tag hl" style="${cvar(k)}">${PARTES[k].nombre}</span></span>`;
        list.appendChild(d);
      });
      const titulo = !completo ? "¡Ahorcado!"
        : cfg.equipos ? (empate ? "¡Empate!" : `¡Gana ${esc(ganador.nombre)}!`)
        : (eq.err === 0 ? "¡Orden perfecto, sin fallos!" : `¡Lo lograste con ${eq.err} ${eq.err===1?"fallo":"fallos"}!`);
      const podio = cfg.equipos ? `<div class="podium">${rank.map((x,i)=>`<div class="${x.out?"out":""}">${horca(x.err,{mini:true})}<span>${i+1}. ${esc(x.nombre)}${x.out?" (ahorcado)":""}</span><em>${x.pts} pts</em></div>`).join("")}</div>` : "";
      $("#ofb").innerHTML = `<div class="fb ${completo?"ok":"no"}"><h3>${titulo}</h3>${podio}
        <p>Un ensayo sigue esta ruta: introducción, tesis, argumentos, contraargumento y conclusión. Los argumentos pueden ir en cualquier orden entre sí.</p></div>`;
      $("#otro").onclick = () => startOrdena(); $("#home").onclick = inicio;
      if (!O.celebrado) { O.celebrado = true; if (completo) { Sonido.victoria(); confeti(); } }
      return;
    }
    items.forEach((it, n) => {
      const pos = O.orden.indexOf(n);
      const b = document.createElement("button");
      b.className = "strip" + (pos>=0 ? " placed" : "") + (n===O.malo ? " nope" : "");
      b.innerHTML = `<span class="num">${pos>=0?pos+1:""}</span><span>${conCitas(esc(it.t))}${pos>=0?`<br><span class="tag hl" style="${cvar(it.k)}">${PARTES[it.k].nombre}</span>`:""}</span>`;
      if (pos >= 0) b.disabled = true;
      else b.onclick = () => {
        const esperado = e.f[O.orden.length][0], actual = O.equipos[O.turno];
        if (it.k === esperado) { O.orden.push(n); O.malo = -1; actual.pts += 10; Sonido.acierto(); }
        else {
          actual.err++; O.malo = n; O.nuevoErr = true; Sonido.error(); Sonido.trazo();
          if (actual.err >= MAX_FALLOS) { actual.out = true; setTimeout(() => Sonido.derrota(), 450); }
        }
        // En equipos: si aciertan siguen jugando; si fallan, el turno pasa al siguiente equipo en juego
        if (O.nuevoErr && cfg.equipos && O.orden.length < items.length) {
          pasarTurno(); O.nuevoErr = false;
          if (vivosO().length) O.aviso = `${actual.nombre} se equivocó${actual.out ? " y quedó ahorcado" : ""}. Turno de ${O.equipos[O.turno].nombre}.`;
        }
        pintar();
      };
      list.appendChild(b);
    });
    $("#reset").onclick = () => { O.orden = []; O.equipos = nuevosEquipos(); O.turno = 0; O.malo = -1; pintar(); };
  };
  pintar(); window.scrollTo(0,0);
}
