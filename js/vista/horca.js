// Vista: el ahorcado dibujado en SVG.

/* ---------- El ahorcado dibujado ---------- */
const CUERPO = [
  `<circle cx="140" cy="72" r="20" pathLength="100"/>`,
  `<path d="M140 92 Q138 122 141 152" pathLength="100"/>`,
  `<path d="M140 108 Q126 118 111 134" pathLength="100"/>`,
  `<path d="M140 108 Q154 117 169 132" pathLength="100"/>`,
  `<path d="M141 152 Q128 172 117 195" pathLength="100"/>`,
  `<path d="M141 152 Q153 172 165 194" pathLength="100"/>`
];
function cara(err, estado){
  if (estado === "salvado") return `<g class="face pop"><circle class="eye" cx="133" cy="68" r="2.6"/><circle class="eye" cx="147" cy="68" r="2.6"/><path d="M130 77 Q140 90 150 77"/></g>`;
  if (estado === "muerto") return `<g class="face pop"><path d="M129 64 L136 71 M136 64 L129 71 M144 64 L151 71 M151 64 L144 71"/><path d="M132 84 Q140 77 148 84"/></g>`;
  const boca = err <= 2 ? `M132 79 Q140 86 148 79` : err <= 4 ? `M133 82 Q140 81 147 82` : `M132 84 Q140 77 148 84`;
  const cejas = err >= 4 ? `<path d="M128 61 L136 64 M152 61 L144 64"/>` : "";
  const gota = err >= 5 ? `<path d="M158 60 Q161 66 158 68 Q155 66 158 60" style="fill:var(--pen);stroke:var(--pen);stroke-width:1.5"/>` : "";
  return `<g class="face"><circle class="eye" cx="133" cy="69" r="2.4"/><circle class="eye" cx="147" cy="69" r="2.4"/><path d="${boca}"/>${cejas}${gota}</g>`;
}
function horca(err, {animar=false, estado="jugando", mini=false}={}){
  const salvado = estado === "salvado", muerto = estado === "muerto" || err >= MAX_FALLOS;
  let fig = "";
  if (salvado) {
    fig = `<g transform="translate(0 31)">${CUERPO[0]}${CUERPO[1]}<path d="M140 108 Q126 96 113 82"/><path d="M140 108 Q154 96 167 82"/>${CUERPO[4]}${CUERPO[5]}${cara(0,"salvado")}</g>`;
  } else {
    fig = CUERPO.slice(0, err).map((p,i) => (animar && i === err-1) ? p.replace("/>", ` class="draw"/>`) : p).join("");
    if (err >= 1 && !mini) fig += cara(err, muerto ? "muerto" : "jugando");
  }
  const cuerda = salvado ? `<path d="M140 20 Q143 28 140 36 M140 36 L136 41 M140 36 L144 40"/>` : `<path d="M140 20 Q143 36 140 52"/>`;
  return `<svg class="horca ${mini?"mini":""} ${muerto?"dead":""} ${salvado?"saved":""}" viewBox="0 0 200 240" role="img" aria-label="${salvado ? "Ahorcado salvado" : `Ahorcado: ${err} de ${MAX_FALLOS} fallos`}">
    <path class="ground" d="M6 229 Q100 233 194 228"/>
    <g class="wood"><path d="M14 226 Q80 222 156 227"/><path d="M50 228 Q47 120 52 18"/><path d="M46 22 Q100 17 144 21"/><path d="M50 58 Q66 40 86 20"/>${cuerda}</g>
    ${mini ? "" : `<g class="wood2"><path d="M56 226 Q54 130 57 26"/><path d="M52 27 Q100 23 136 26"/></g>`}
    <g class="guy">${fig}</g></svg>`;
}
function vidasHTML(err){
  const muerto = err >= MAX_FALLOS;
  const marcas = "/".repeat(err);
  return `<div class="lives ${muerto?"dead":""}">${muerto ? "¡Ahorcado!" : err === 0 ? "Sin fallos" : `Fallos: ${err} de ${MAX_FALLOS}`}<span class="tally">${marcas}</span></div>`;
}
