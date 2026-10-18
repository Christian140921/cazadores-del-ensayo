// Configuración: Firebase, dirección del juego y límites de las salas.

/* ---------- En vivo: sala con tabla en tiempo real (Firebase) ---------- */
// Datos del proyecto de Firebase (no son secretos: están pensados para ir en la página)
const FIREBASE_CONFIG = { apiKey:"AIzaSyCWwGWVsfn0ycgfmB2G6_bUqfwSO7tMLTk", authDomain:"cazadores-del-ensayo.firebaseapp.com", databaseURL:"https://cazadores-del-ensayo-default-rtdb.firebaseio.com", projectId:"cazadores-del-ensayo", storageBucket:"cazadores-del-ensayo.firebasestorage.app", messagingSenderId:"897841295777", appId:"1:897841295777:web:29556d4b2a552ade6edbe0" };
/* ---------- Código QR para entrar desde el celular ---------- */
const URL_JUEGO = /github\.io$/.test(location.hostname) ? location.origin + location.pathname : "https://christian140921.github.io/cazadores-del-ensayo/";
// Letras para los códigos de sala (sin I ni O, que se confunden con 1 y 0)
const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
// Una sala vive 6 horas; las reglas de Firebase usan el mismo límite (21600000 ms)
const VIGENCIA_SALA_MS = 6 * 3600e3;
