// Vista: piezas reutilizables (botones de sonido, pistas, citas, QR, récords, mensajes).

function pintarToggles(){
  const bloqueada = Sonido.st.musica && !Sonido.listo();
  $("#tMusic").classList.toggle("wake", bloqueada);
  $("#tMusic .on").textContent = bloqueada ? "Activar música" : "Música";
  $("#tMusic").setAttribute("aria-pressed", Sonido.st.musica);
  $("#tSfx").setAttribute("aria-pressed", Sonido.st.efectos);
}
function marcarClaves(t, k){
  let h = esc(t);
  (CLAVES[k] || []).forEach(c => { const e = esc(c); const re = new RegExp("(^|[\\s¿¡(])(" + e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "g"); h = h.replace(re, (m, a, b) => a + "\u0001" + b + "\u0002"); });
  return h.replace(/\u0001/g, '<span class="clave">').replace(/\u0002/g, "</span>");
}
/* ---------- Citas: lo que va entre comillas es de otra persona ---------- */
const conCitas = h => h.replace(/“([^”]*)”/g, '<span class="cita">“$1”</span>');
function pintarQR(el, tam, texto = URL_JUEGO){
  if (!el) return;
  if (typeof QRCode === "undefined") { el.hidden = true; return; }
  el.innerHTML = "";
  new QRCode(el, { text: texto, width: tam, height: tam, colorDark: "#1D2740", colorLight: "#FFFFFF", correctLevel: QRCode.CorrectLevel.M });
}
function qrGrande(){
  const d = document.createElement("div");
  d.className = "qr-big"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Código QR del juego");
  d.innerHTML = `<h2>Escanea y juega</h2><div class="qr" id="qrBig"></div><div class="qr-url">${esc(URL_JUEGO.replace(/^https:\/\//, ""))}</div><button class="btn go" id="qrClose">Cerrar</button>`;
  document.body.appendChild(d);
  pintarQR($("#qrBig"), 460);
  const cerrar = () => { d.remove(); document.removeEventListener("keydown", esc_); };
  const esc_ = e => { if (e.key === "Escape") cerrar(); };
  $("#qrClose").onclick = cerrar; $("#qrClose").focus();
  document.addEventListener("keydown", esc_);
}
function recordsHTML(lista, yo){
  if (!lista.length) return `<p style="margin:0;color:var(--soft)">Todavía no hay récords. ¡El primero puede ser el tuyo!</p>`;
  return `<ol>${lista.slice(0,5).map((r,i)=>`<li class="${yo && r.id===yo ? "me" : ""}"><span class="pos">${i+1}.</span><span>${esc(r.nombre)}</span><span class="p">${r.pts} pts · ${r.ok}/${r.n}</span></li>`).join("")}</ol>`;
}
function pantallaMsg(titulo, texto, boton = true){
  app.innerHTML = `<section class="final"><div class="sheet" style="max-width:620px"><h2 style="font-family:var(--f-marker);font-size:36px">${titulo}</h2><p>${texto}</p>${boton ? `<div class="cta"><button class="btn" id="vHome">Volver al inicio</button></div>` : ""}</div></section>`;
  if (boton) $("#vHome").onclick = inicio;
}
