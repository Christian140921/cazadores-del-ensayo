// Modelo: reglas de la partida en curso.

const MAX_FALLOS = 6;
// Equipos de la configuración elegida, con sus contadores en cero
const equiposDeCfg = (extra = {}) => cfg.nombres.slice(0, cfg.nEquipos).map((nm, i) => ({ nombre:(nm || "").trim() || `Equipo ${i + 1}`, pts:0, err:0, out:false, ...extra }));
// Clasificación de equipos: primero los no ahorcados, luego más puntos y luego menos fallos
const ordenarEquipos = eqs => eqs.slice().sort((a, b) => (a.out - b.out) || (b.pts - a.pts) || (a.err - b.err));
const empatados = (a, b) => !!b && a.out === b.out && a.pts === b.pts && a.err === b.err;
const vivos = () => S.equipos.filter(e => !e.out);
const terminado = () => S.i >= S.cola.length - 1 || vivos().length === 0;
