// Controlador: piezas compartidas por el proyector y los celulares en vivo.

function salirVivo(){
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (!VIVO) return;
  VIVO.off.forEach(f => { try { f(); } catch {} });
  if (VIVO.rol === "jugador" && VIVO.yo) VIVO.yo.update({ conectado:false }).catch(() => {});
  if (VIVO.rol === "host") { VIVO.ref.update({ estado:"cerrada" }).catch(() => {}); olvidarSalaHost(); }
  VIVO = null;
}
// Si Firebase rechaza un cambio de la sala (por ejemplo, una sala de más de 6 horas), avisarlo en vez de no hacer nada
function guardarSala(cambios, ref = VIVO.ref){
  const sala = VIVO;
  return ref.update(cambios).catch(e => { if (VIVO === sala) pantallaMsg("No se pudo actualizar la sala", errorVivo(e)); throw e; });
}
// Un setTimeout que se cancela solo si se sale de la sala antes de que se cumpla
function despues(ms, fn){
  const t = setTimeout(fn, ms);
  VIVO.off.push(() => clearTimeout(t));
}
function publicarVivo(extra = {}){
  if (!S || !S.vivo || !VIVO) return;
  const e = S.equipos[0];
  // "alcanzado" guarda cuándo llegó a su puntaje actual, para desempatar por rapidez
  const nuevo = e.pts !== S.ptsPublicados; S.ptsPublicados = e.pts;
  VIVO.yo.update({ pts:e.pts, ok:e.ok, n:e.n, err:e.err, out:e.out, i:S.i, racha:S.racha, ...extra, ...(nuevo ? { alcanzado:TS() } : {}), actualizado:TS() }).catch(() => {});
}
