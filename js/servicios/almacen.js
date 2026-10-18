// Guardar datos en este navegador sin romper el juego si el almacenamiento está bloqueado (modo privado, permisos)
const Almacen = (() => {
  const area = tipo => tipo === "sesion" ? sessionStorage : localStorage;
  return {
    leer(clave, porDefecto = null, tipo){ try { const v = area(tipo).getItem(clave); return v === null ? porDefecto : v; } catch { return porDefecto; } },
    leerJSON(clave, porDefecto = null, tipo){ try { const v = area(tipo).getItem(clave); return v === null ? porDefecto : JSON.parse(v); } catch { return porDefecto; } },
    guardar(clave, valor, tipo){ try { area(tipo).setItem(clave, typeof valor === "string" ? valor : JSON.stringify(valor)); } catch {} },
    borrar(clave, tipo){ try { area(tipo).removeItem(clave); } catch {} },
  };
})();

// La sala que abrió este proyector, para ofrecer «Retomar sala» aunque se cierre la pestaña
const recordarSalaHost = code => Almacen.guardar("cz-host", { code, t:Date.now() });
const olvidarSalaHost = () => Almacen.borrar("cz-host");
function salaHostGuardada(){
  const g = Almacen.leerJSON("cz-host");
  return g && Date.now() - g.t < VIGENCIA_SALA_MS ? g.code : "";
}
