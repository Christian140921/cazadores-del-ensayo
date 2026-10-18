// Servicio: mejores puntajes guardados en este dispositivo.

/* ---------- Récords guardados en este dispositivo ---------- */
const leerRecords = () => Almacen.leerJSON("cz-records", []) || [];
function guardarRecord(r){
  const lista = leerRecords().concat(r).sort((a,b) => b.pts - a.pts || b.ok - a.ok).slice(0, 10);
  Almacen.guardar("cz-records", lista);
  return lista;
}
