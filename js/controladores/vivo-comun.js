// Controlador: piezas compartidas por el proyector y los celulares en vivo.

function salirVivo(){
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (!VIVO) return;
  VIVO.off.forEach(f => { try { f(); } catch {} });
  if (VIVO.rol === "jugador" && VIVO.yo) VIVO.yo.update({ conectado:false }).catch(() => {});
  if (VIVO.rol === "host") { VIVO.ref.update({ estado:"cerrada" }).catch(() => {}); olvidarSalaHost(); }
  VIVO = null;
}
function publicarVivo(extra = {}){
  if (!S || !S.vivo || !VIVO) return;
  const e = S.equipos[0];
  // "alcanzado" guarda cuándo llegó a su puntaje actual, para desempatar por rapidez
  const nuevo = e.pts !== S.ptsPublicados; S.ptsPublicados = e.pts;
  VIVO.yo.update({ pts:e.pts, ok:e.ok, n:e.n, err:e.err, out:e.out, i:S.i, racha:S.racha, ...extra, ...(nuevo ? { alcanzado:TS() } : {}), actualizado:TS() }).catch(() => {});
}
