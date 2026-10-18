// Modelo: configuración elegida y estado de la partida actual (S) y de la sala en vivo (VIVO).

const cfg = { tema:"ensayo", equipos:false, nEquipos:2, nombres:["Los Lectores","Los Escritores","Los Críticos","Los Poetas"], rondas:10, tiempo:0, jugador:"" };
let S = null, timer = null;
// Sala en vivo: null si no hay sala, o { rol:"host"|"jugador", code, ref, jugadores, estado, ... }
let VIVO = null;
function stopTimer(){ if (timer) { clearInterval(timer); timer = null; } }
