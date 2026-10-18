// Servicio: conexión con Firebase Realtime Database.

let FB = null;
function cargarScript(src){ return new Promise((ok, mal) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => mal(new Error("red")); document.head.appendChild(s); }); }
async function fb(){
  if (FB) return FB;
  if (!FIREBASE_CONFIG) throw new Error("config");
  await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
  await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
  firebase.initializeApp(FIREBASE_CONFIG);
  FB = firebase.database();
  return FB;
}
const TS = () => firebase.database.ServerValue.TIMESTAMP;
const errorVivo = e => e && e.message === "config" ? "El modo en vivo todavía no está conectado a la base de datos." : "No se pudo conectar. Revisa que haya internet y vuelve a intentarlo.";
function escuchar(ref, fn){ const cb = ref.on("value", fn); VIVO.off.push(() => ref.off("value", cb)); }
