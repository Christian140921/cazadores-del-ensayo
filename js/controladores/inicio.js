// Controlador: portada y configuración de la partida.

/* ---------- Inicio ---------- */
function inicio(){
  salirVivo(); stopTimer(); S = null;
  const flecha = `<i aria-hidden="true">→</i>`;
  const piezas = ORDEN_PARTES.map(k => `<span class="hl" style="${cvar(k)}">${PARTES[k].nombre}</span>`).join(flecha);
  const piezasPon = ["Introducción","Desarrollo","Conclusión","Preguntas"].map(t => `<span class="hl" style="${cvar("pon")}">${t}</span>`).join(flecha);
  app.innerHTML = `
  <section class="hero">
    <div>
      <h1>Cazadores del <span class="hl">Ensayo</span></h1>
      <div class="y-pon">y de la <span class="hl" style="${cvar("pon")}">ponencia</span></div>
      <p>Dos temas para jugar: las partes del ensayo y la ponencia. Cada vez que te equivocas, se dibuja una parte más del ahorcado. Con seis fallos, pierdes.</p>
      <div class="pieces" aria-label="Las cinco partes del ensayo, en orden"><b>El ensayo</b>${piezas}</div>
      <div class="pieces pon" aria-label="Las partes de la ponencia, en orden"><b>La ponencia</b>${piezasPon}</div>
    </div>
    <div class="hero-art" aria-hidden="true">
      ${horca(3)}
      <span class="note">¡no dejes que lo cuelguen!</span>
      <svg class="arrow" viewBox="0 0 70 60"><path d="M4 6 Q30 4 50 40 M50 40 L40 36 M50 40 L52 29" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" filter="url(#rough)"/></svg>
    </div>
  </section>
  <section class="modes">
    <div class="sheet players" style="grid-column:1/-1">
      <h2>¿Quiénes juegan?</h2>
      <div class="opts">
        <div class="opt"><span>modo</span>
          <div class="seg" id="segModo"><button data-v="0" aria-pressed="${!cfg.equipos}">yo solo</button><button data-v="1" aria-pressed="${cfg.equipos}">por equipos</button></div>
        </div>
        <div class="opt" id="rowNombre" ${cfg.equipos?"hidden":""}><span>¿Cómo te llamas?</span>
          <div class="teams"><input id="playerName" maxlength="18" placeholder="Escribe tu nombre" aria-label="Tu nombre" autocomplete="off"></div>
          <span class="note" id="nombreAviso" style="font-size:20px;color:var(--red)" hidden>escribe tu nombre para entrar a la tabla de récords</span>
        </div>
        <div class="opt" id="rowEquipos" ${cfg.equipos?"":"hidden"}><span>¿Cuántos equipos?</span>
          <div class="seg" id="segN">${[2,3,4].map(n=>`<button data-v="${n}" aria-pressed="${cfg.nEquipos===n}">${n}</button>`).join("")}</div>
          <div class="teams" id="teams"></div>
        </div>
      </div>
      <p class="note" style="font-size:20px;margin-top:10px">sirve para los dos juegos: Clasifica y Ordena</p>
    </div>
    <div class="sheet tilt-l">
      <h2>Clasifica</h2>
      <p>Aparece un recorte y eliges a qué parte del ensayo pertenece. También puedes jugar con el tema de la ponencia. Después de cada respuesta verás por qué.</p>
      <div class="opts">
        <div class="opt"><span>¿Qué tema?</span>
          <div class="seg" id="segTema">${[["ensayo","el ensayo"],["ponencia","la ponencia"]].map(([v,t],i)=>`<button data-v="${i}" aria-pressed="${cfg.tema===v}">${t}</button>`).join("")}</div>
        </div>
        <div class="opt"><span>¿Cuántos recortes?</span>
          <div class="seg" id="segR">${[5,10,15,20].map(n=>`<button data-v="${n}" aria-pressed="${cfg.rondas===n}">${n}</button>`).join("")}</div>
        </div>
        <div class="opt"><span>¿Con reloj?</span>
          <div class="seg" id="segT">${[[0,"sin reloj"],[30,"30 s"],[20,"20 s"],[12,"12 s"]].map(([v,t])=>`<button data-v="${v}" aria-pressed="${cfg.tiempo===v}">${t}</button>`).join("")}</div>
        </div>
      </div>
      <div class="cta"><button class="btn go" id="playC">¡A jugar!</button></div>
    </div>
    <div class="sheet tilt-r">
      <h2>Ordena</h2>
      <p>Un ensayo completo llega desordenado. Toca los párrafos del primero al último. Un párrafo fuera de lugar también cuenta como fallo. En equipos, quien acierta sigue jugando y quien falla pasa el turno.</p>
      <p class="note" style="margin-top:14px">ideal para jugar toda la clase con el proyector</p>
      <div class="cta"><button class="btn" id="playO">Ordenar un ensayo</button></div>
    </div>
    <div class="sheet" style="grid-column:1/-1">
      <h2>En vivo, como Kahoot</h2>
      <p>El proyector crea una sala y muestra en tiempo real quién va ganando, mientras cada uno juega Clasifica en su celular con su propio ahorcado.</p>
      <div class="cta"><button class="btn go" id="vCrear">Crear sala (proyector)</button><button class="btn" id="vUnir">Unirme a una sala</button></div>
      <p class="note" style="font-size:20px;margin:6px 0 0">al crear la sala eliges si juegan con el ensayo o con la ponencia</p>
    </div>
    <div class="sheet tilt-r">
      <h2>Juega desde tu celular</h2>
      <div class="qr-row" style="margin-top:14px"><div class="qr" id="qrSmall"></div>
        <div><div class="qr-url">${esc(URL_JUEGO.replace(/^https:\/\//, ""))}</div><div class="cta" style="margin-top:12px"><button class="btn small" id="qrShow">Mostrar QR en grande</button></div></div></div>
    </div>
    <div class="sheet tilt-l records">
      <h3>Mejores puntajes</h3>
      ${recordsHTML(leerRecords())}
      <p class="note" style="font-size:20px;margin:0">se guardan en este aparato · en modo "yo solo" tu puntaje entra solo a la tabla</p>
    </div>
  </section>`;
  pintarQR($("#qrSmall"), 132);
  $("#qrShow").onclick = qrGrande;
  const teams = () => { $("#teams").innerHTML = cfg.nombres.slice(0,cfg.nEquipos).map((n,i)=>`<input id="team${i}" aria-label="Nombre del equipo ${i+1}" value="${esc(n)}" maxlength="18">`).join("");
    $("#teams").querySelectorAll("input").forEach((inp,i)=>inp.addEventListener("input",()=>cfg.nombres[i]=inp.value)); };
  teams();
  const seg = (id, fn) => $(id).addEventListener("click", e => { const b = e.target.closest("button"); if(!b) return;
    Sonido.tap(); $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", x===b)); fn(+b.dataset.v); });
  seg("#segModo", v => { cfg.equipos = !!v; $("#rowEquipos").hidden = !v; $("#rowNombre").hidden = !!v; });
  $("#playerName").addEventListener("input", e => { cfg.jugador = e.target.value; $("#nombreAviso").hidden = true; });
  seg("#segN", v => { cfg.nEquipos = v; teams(); });
  seg("#segR", v => cfg.rondas = v);
  seg("#segTema", v => cfg.tema = TEMAS[v]);
  seg("#segT", v => cfg.tiempo = v);
  $("#playC").onclick = () => {
    if (!cfg.equipos) {
      cfg.jugador = $("#playerName").value.trim();
      if (!cfg.jugador) { $("#nombreAviso").hidden = false; $("#playerName").focus(); Sonido.error(); return; }
    }
    startClasifica();
  };
  $("#playO").onclick = () => { cfg.jugador = $("#playerName").value.trim(); startOrdena(); };
  $("#vCrear").onclick = elegirSala;
  const salaHost = salaHostGuardada();
  if (salaHost) {
    const b = document.createElement("button"); b.className = "btn"; b.textContent = `Retomar sala ${salaHost}`;
    b.onclick = () => retomarSala(salaHost); $("#vCrear").parentNode.prepend(b);
  }
  $("#vUnir").onclick = () => unirseSala();
  window.scrollTo(0,0);
}
