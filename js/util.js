// Utilidades generales: buscar elementos, escapar texto, barajar.

const app = document.getElementById("app");
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const cvar = k => `--c:var(${PARTES[k].c})`;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
