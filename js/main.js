// Arranque: conecta los botones fijos de la página y abre la pantalla inicial.

// Los navegadores solo dejan sonar audio después de un gesto del usuario: lo intentamos en cada toque hasta que suene
const desbloquear = () => { Sonido.init(); if (Sonido.listo()) ["pointerdown","click","touchend","keydown"].forEach(ev => document.removeEventListener(ev, desbloquear, true)); };
["pointerdown","click","touchend","keydown"].forEach(ev => document.addEventListener(ev, desbloquear, true));
// Si la música aún no sonaba (primer toque), este clic la enciende en vez de apagarla
$("#tMusic").onclick = () => { Sonido.musica(Sonido.st.musica && !Sonido.sonando() ? true : !Sonido.st.musica); pintarToggles(); };
$("#tSfx").onclick = () => { Sonido.efectos(!Sonido.st.efectos); pintarToggles(); };
Sonido.onCambio(pintarToggles);
pintarToggles();
document.addEventListener("keydown", e => {
  if (!S || !$("#answers") || e.target.matches("input")) return;
  if (!S.respondido && /^[1-5]$/.test(e.key)) { const b = document.querySelectorAll(".ans")[+e.key-1]; if (b && !b.disabled) responder(b.dataset.k); }
  else if (!S.respondido && (e.key === "p" || e.key === "P")) usarPista();
  else if (S.respondido && e.key === "Enter" && document.activeElement?.id !== "next" && !document.activeElement?.classList.contains("bq")) { e.preventDefault(); siguiente(); }
});
{ // botón "Menú principal": visible fuera del inicio; en plena partida pide un segundo toque para no salir por accidente
  const btn = $("#goMenu"), txt = btn.querySelector("span"), ETQ = txt.innerHTML; let armado = null;
  const enPartida = () => (VIVO && (VIVO.rol === "host" || VIVO.estado !== "fin")) || (!!app.querySelector(".stage") && !app.querySelector(".result"));
  btn.onclick = () => {
    if (!enPartida() || armado) { clearTimeout(armado); armado = null; txt.innerHTML = ETQ; inicio(); window.scrollTo(0, 0); return; }
    txt.textContent = "¿Salir? Toca otra vez"; btn.style.borderColor = "var(--red)";
    armado = setTimeout(() => { armado = null; txt.innerHTML = ETQ; btn.style.borderColor = ""; }, 3000);
  };
  $("#goHome").onclick = () => btn.onclick();
  // En la sala en vivo la Guía borraría la partida (y serviría para copiarse), así que se oculta
  new MutationObserver(() => { btn.hidden = !!app.querySelector(".hero"); $("#goGuide").hidden = !!VIVO; if (!armado) btn.style.borderColor = ""; }).observe(app, { childList:true });
  // Avisar antes de recargar o cerrar la pestaña en plena sala
  addEventListener("beforeunload", e => { if (VIVO && VIVO.estado !== "fin" && VIVO.estado !== "cerrada") { e.preventDefault(); e.returnValue = ""; } });
}
$("#goGuide").onclick = guia;
const salaURL = new URLSearchParams(location.search).get("sala");
if (salaURL) unirseSala(salaURL.toUpperCase().slice(0, 4)); else inicio();
