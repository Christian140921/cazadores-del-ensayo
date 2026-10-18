// Servicio: narrador por voz del proyector (speechSynthesis).

/* Voz del proyector: anuncia rachas, cambios de líder y ahorcados */
const Voz = (() => {
  const ok = "speechSynthesis" in window;
  let on = Almacen.leer("cz-voz") !== "0";
  let voz = null, lista = [], alCambiar = null;
  let preferida = Almacen.leer("cz-voz-nombre", "");
  // las voces "Natural"/"Online" (Edge) y las de Google (Chrome) suenan mucho menos robóticas que las de Windows
  const puntaje = v => (/natural/i.test(v.name) ? 8 : 0) + (/online/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 3 : 0)
    + (/es[-_](419|MX|US|CO)/i.test(v.lang) ? 1 : 0) - (v.localService && !/google/i.test(v.name) ? 2 : 0);
  const elegir = () => {
    lista = ok ? speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)).sort((a,b) => puntaje(b) - puntaje(a)) : [];
    voz = lista.find(v => v.name === preferida) || lista[0] || null;
    if (alCambiar) alCambiar();
  };
  if (ok) { elegir(); speechSynthesis.onvoiceschanged = elegir; }
  return {
    ok, get on(){ return on; },
    get lista(){ return lista; }, get actual(){ return voz; },
    onCambio(fn){ alCambiar = fn; },
    usar(nombre){ preferida = nombre; Almacen.guardar("cz-voz-nombre", nombre); elegir(); },
    set(v){ on = v; Almacen.guardar("cz-voz", v ? "1" : "0"); if (!v && ok) speechSynthesis.cancel(); },
    decir(txt, urgente){
      if (!ok || !on) return;
      if (urgente || speechSynthesis.pending) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = voz ? voz.lang : "es-ES"; if (voz) u.voice = voz; u.rate = 1; u.pitch = 1;
      Sonido.bajar(Math.min(6, 1.2 + txt.length / 14));
      speechSynthesis.speak(u);
    }
  };
})();
