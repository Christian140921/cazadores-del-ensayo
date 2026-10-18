// Controlador: el celular entra a la sala y juega.

/* El celular: entra a la sala y juega Clasifica con su propio ahorcado */
function unirseSala(codigo = ""){
  salirVivo(); stopTimer(); S = null;
  app.innerHTML = `<section class="final"><div class="sheet" style="max-width:560px">
    <h2 style="font-family:var(--f-marker);font-size:38px">Unirme a una sala</h2>
    <form id="joinForm" class="opts">
      <div class="opt"><span>Código de la sala</span><div class="teams"><input id="jCode" maxlength="4" autocomplete="off" autocapitalize="characters" aria-label="Código de la sala" value="${esc(codigo)}" style="text-transform:uppercase;letter-spacing:.25em;font-size:34px"></div></div>
      <div class="opt"><span>Tu nombre</span><div class="teams"><input id="jName" maxlength="18" autocomplete="off" aria-label="Tu nombre"></div></div>
      <p class="note" id="jAviso" style="color:var(--red);font-size:21px;margin:0" hidden></p>
      <div class="cta" style="margin-top:4px"><button class="btn go" type="submit" id="jBtn">Entrar</button><button class="btn small" type="button" id="jHome">Volver</button></div>
    </form></div></section>`;
  (codigo ? $("#jName") : $("#jCode")).focus();
  $("#jHome").onclick = inicio;
  const aviso = t => { $("#jAviso").textContent = t; $("#jAviso").hidden = false; $("#jBtn").disabled = false; $("#jBtn").textContent = "Entrar"; };
  $("#joinForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    const code = $("#jCode").value.trim().toUpperCase(), nombre = $("#jName").value.trim();
    if (code.length !== 4) return aviso("El código tiene 4 letras. Míralo en el proyector.");
    if (!nombre) return aviso("Escribe tu nombre para que aparezca en la tabla.");
    $("#jBtn").disabled = true; $("#jBtn").textContent = "Entrando…";
    try {
      const db = await fb(), ref = db.ref("salas/" + code), snap = await ref.get();
      if (!snap.exists()) return aviso("No hay ninguna sala con ese código. Revisa las letras.");
      const sala = snap.val();
      if (sala.estado === "cerrada") return aviso("Esa sala ya se cerró. Mira el código nuevo en el proyector.");
      if (sala.estado === "fin") return aviso("Esa partida ya terminó. Espera a que el proyector empiece otra.");
      if (sala.version && sala.version !== VERSION_PREGUNTAS) { aviso("Tu página tiene una versión distinta a la del proyector. Recárgala y vuelve a entrar."); $("#jBtn").textContent = "Recargar"; $("#jBtn").onclick = e => { e.preventDefault(); location.reload(); }; return; }
      const jugadores = sala.jugadores || {}, mismoNombre = ([, j]) => (j.nombre || "").toLowerCase() === nombre.toLowerCase();
      // Solo se retoma un puesto desde el mismo celular: misma pestaña (sessionStorage) o la misma sala abierta antes en este navegador (localStorage)
      let pid = Almacen.leer("cz-pid", null, "sesion");
      if (!pid) { const g = Almacen.leerJSON("cz-sala"); if (g && g.code === code && jugadores[g.pid] && jugadores[g.pid].conectado === false && mismoNombre([g.pid, jugadores[g.pid]])) pid = g.pid; }
      if (!pid) pid = Math.random().toString(36).slice(2, 10);
      if (Object.entries(jugadores).some(e => e[0] !== pid && mismoNombre(e))) return aviso("Ese nombre ya está en la sala. Agrega tu apellido o una inicial. Si eras tú en otra pestaña, ciérrala y espera un momento.");
      Almacen.guardar("cz-pid", pid, "sesion"); Almacen.guardar("cz-sala", { code, pid });
      const yo = ref.child("jugadores/" + pid), previo = jugadores[pid];
      if (previo) await yo.update({ nombre, conectado:true, actualizado:TS() });
      else await yo.set({ nombre, pts:0, ok:0, n:0, err:0, out:false, i:0, terminado:false, conectado:true, actualizado:TS() });
      VIVO = { rol:"jugador", code, ref, yo, pid, nombre, jugadores:{}, estado:null, off:[], previo: previo && sala.estado === "jugando" ? previo : null };
      // Cada vez que vuelve la conexión (pantalla bloqueada, mala señal), vuelve a marcarse como conectado
      escuchar(db.ref(".info/connected"), s => { if (s.val() === true && VIVO) { yo.onDisconnect().update({ conectado:false, actualizado:TS() }); yo.update({ conectado:true }).catch(() => {}); } });
      // En la sala, 30 celulares con música a la vez tapan al narrador
      if (Sonido.st.musica) Sonido.pausarMusica();
      escuchar(ref.child("jugadores"), s => { if (!VIVO) return; VIVO.jugadores = s.val() || {}; rankJugador(); });
      escuchar(ref.child("desempate"), s => { if (!VIVO) return; VIVO.des = s.val(); if (VIVO.estado === "desempate") desempateJugador(); });
      escuchar(ref.child("estado"), async s => {
        if (!VIVO) return;
        const antes = VIVO.estado; VIVO.estado = s.val();
        if (VIVO.estado === "espera") { S = null; stopTimer(); VIVO.desPintado = VIVO.desResp = null; esperaJugador(); }
        else if (VIVO.estado === "jugando" && antes !== "jugando") {
          const sala = (await ref.get()).val();
          cfg.equipos = false; cfg.tiempo = sala.tiempo || 0; cfg.rondas = sala.rondas || 10;
          if (sala.version && sala.version !== VERSION_PREGUNTAS) return pantallaMsg("Recarga la página", "Tu página tiene una versión distinta a la del proyector. Recárgala y vuelve a entrar con el mismo nombre.");
          const previo = VIVO.previo; VIVO.previo = null;
          startClasifica({ orden: sala.orden, nombre, previo });
        } else if (VIVO.estado === "desempate") desempateJugador();
        else if (VIVO.estado === "fin") {
          const d = VIVO.des;
          if (d && d.ids && d.ids[VIVO.pid] && d.ganador) { stopTimer();
            pantallaMsg(d.ganador === VIVO.pid ? "¡Ganaste la muerte súbita!" : "Perdiste la muerte súbita", d.ganador === VIVO.pid ? "Quedaste en el primer lugar. Mira el podio en el proyector." : `Ganó ${esc(nombreDe(d.ganador))}. ¡Estuviste muy cerca! Mira el podio en el proyector.`);
            if (d.ganador === VIVO.pid) { Sonido.victoria(); confeti(); } }
          else if (S && S.vivo && !S.fin && !VIVO.desPintado) final();
          else if (!(S && S.vivo) || VIVO.desPintado) pantallaMsg("La partida terminó", "Mira el proyector para ver el podio.");
        } else if (VIVO.estado === "cerrada") { stopTimer(); S = null; const v = VIVO; salirVivo(); v && pantallaMsg("La sala se cerró", "El proyector cerró la sala. ¡Gracias por jugar!"); }
      });
    } catch (e) { aviso(errorVivo(e)); }
  });
}
function desempateJugador(){
  const d = VIVO.des; if (!d || d.ganador) return;
  if (!d.ids || !d.ids[VIVO.pid]) {
    if (VIVO.desPintado !== "mirar") { VIVO.desPintado = "mirar"; stopTimer();
      pantallaMsg("¡Hay muerte súbita!", `Hubo empate en el primer lugar entre ${d.orden.map(id => esc(nombreDe(id))).join(" y ")}. Mira el proyector para ver quién gana.`, false); }
    return;
  }
  const clave = "ronda" + d.ronda;
  if (VIVO.desPintado === clave) return;
  VIVO.desPintado = clave; stopTimer();
  const q = DIFICILES[d.tema][d.q], { frag, preg } = partesPregunta(q[0]);
  app.innerHTML = `<div class="hud"><span class="prog" style="color:var(--red)">Muerte súbita${d.ronda > 1 ? ` · ronda ${d.ronda}` : ""}</span><span class="timer" id="timer"></span></div>
    <div class="turnline">Empate en el primer lugar. ¡Acierta antes que ${d.orden.filter(id => id !== VIVO.pid).map(id => esc(nombreDe(id))).join(" y ")}!</div>
    <div class="sheet clip"><div class="tema">pregunta difícil</div><blockquote>${frag ? `«${esc(frag)}»` : esc(preg)}</blockquote></div>
    <p class="pregunta">${frag ? esc(preg) : "Elige la respuesta correcta:"}</p>
    <div class="answers pon" id="desAns">${shuffle(q[1].map((_, i) => i)).map((i, n) => `<button class="ans" data-k="${i}" style="${cvar("pon")}"><span class="cap">${n + 1}</span><span class="txt">${esc(q[1][i])}</span></button>`).join("")}</div>
    <div id="desFb"></div>`;
  window.scrollTo(0, 0);
  const responder = k => {
    if (VIVO.desResp === clave) return;
    VIVO.desResp = clave; stopTimer();
    const ok = k === 0;
    VIVO.ref.child("desempate/resp/" + VIVO.pid).set({ k, ok, t:TS(), ronda:d.ronda }).catch(() => {});
    document.querySelectorAll("#desAns .ans").forEach(b => { b.disabled = true; const i = +b.dataset.k;
      if (i === 0) b.classList.add("right"); else if (i === k) b.classList.add("wrong"); else b.classList.add("dim"); });
    ok ? Sonido.acierto() : Sonido.error();
    $("#desFb").innerHTML = `<div class="fb ${ok ? "ok" : "no"}" role="status"><h3>${k === null ? "Se acabó el tiempo." : ok ? "¡Correcto!" : "Incorrecto."}</h3><p>${esc(q[2])}</p><p><b>Mira el proyector para ver quién gana.</b></p></div>`;
  };
  $("#desAns").addEventListener("click", e => { const b = e.target.closest(".ans"); if (b && !b.disabled) responder(+b.dataset.k); });
  const limite = Date.now() + DES_SEG * 1000;
  S && (S.restante = DES_SEG);
  timer = setInterval(() => {
    const r = Math.max(0, Math.ceil((limite - Date.now()) / 1000)), t = $("#timer");
    if (t) { t.textContent = r + "s"; t.classList.toggle("low", r <= 5); }
    if (r <= 5 && r > 0) Sonido.tic();
    if (r <= 0) responder(null);
  }, 250);
}
function esperaJugador(){
  app.innerHTML = `<section class="final"><div class="result"><div>${horca(0)}</div><div>
    <h2 style="font-family:var(--f-marker);font-size:clamp(40px,8vw,72px)">¡Estás dentro!</h2>
    <div class="sum">Hola, ${esc(VIVO.nombre)}. Sala ${VIVO.code}</div>
    <p>Mira el proyector: cuando empiece la partida, aquí te aparecerá el primer recorte.</p></div></div></section>`;
}
function rankJugador(){
  if (!VIVO || VIVO.rol !== "jugador" || !S || !S.vivo) return;
  const r = rankingVivo(VIVO.jugadores), p = r.findIndex(x => x.id === VIVO.pid) + 1;
  const rk = $("#vRank"); if (rk) rk.textContent = p ? `puesto ${p} de ${r.length}` : "";
  const box = $("#recList");
  if (box && S.respondido && !$("#answers")) {
    box.innerHTML = recordsHTML(r.map(j => ({ id:j.id, nombre:j.nombre, pts:j.pts||0, ok:j.ok||0, n:j.n||0 })), VIVO.pid)
      + (p > 5 ? `<p class="note" style="font-size:22px;margin:6px 0 0">vas en el puesto ${p} de ${r.length}</p>` : "");
  }
}
