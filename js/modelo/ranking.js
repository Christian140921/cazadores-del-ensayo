// Modelo: orden de la tabla en vivo, empates y jugadores ausentes.

// Empates: más aciertos, luego menos fallos y, si siguen iguales, gana quien llegó primero a ese puntaje
const rankingVivo = js => Object.entries(js || {}).map(([id, j]) => ({ id, ...j })).sort((a,b) => (!!a.out - !!b.out) || ((b.pts||0) - (a.pts||0)) || ((b.dg||0) - (a.dg||0)) || ((b.ok||0) - (a.ok||0)) || ((a.err||0) - (b.err||0)) || ((a.alcanzado||Infinity) - (b.alcanzado||Infinity)));
function motivoDesempate(a, b){
  if (!a || !b || (a.pts||0) !== (b.pts||0) || !!a.out !== !!b.out) return "";
  const pts = `Empate a ${a.pts||0} puntos: `;
  if (a.dg) return pts + `gana ${a.nombre} por ganar la muerte súbita.`;
  if ((a.ok||0) !== (b.ok||0)) return pts + `gana ${a.nombre} por tener más respuestas correctas.`;
  if ((a.err||0) !== (b.err||0)) return pts + `gana ${a.nombre} por tener menos fallos.`;
  return pts + `gana ${a.nombre} por llegar primero a ese puntaje.`;
}
// Quien lleva más de 60 s desconectado ya no frena el final; un celular bloqueado un momento sí se espera
const AUSENTE_MS = 60000;
const ausente = j => j.conectado === false && Date.now() + ((VIVO && VIVO.desfase) || 0) - (j.actualizado || 0) > AUSENTE_MS;
const faltan = js => js.filter(j => !j.out && !j.terminado && !ausente(j)).length;
const nombreDe = id => ((VIVO && VIVO.jugadores[id]) || {}).nombre || "alguien";
const partesPregunta = t => { const m = t.match(/^«(.+)» (.+)$/); return m ? { frag:m[1], preg:m[2] } : { frag:"", preg:t }; };
