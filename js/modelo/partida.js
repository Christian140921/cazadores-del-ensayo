// Modelo: reglas de la partida en curso.

const vivos = () => S.equipos.filter(e => !e.out);
const terminado = () => S.i >= S.cola.length - 1 || vivos().length === 0;
