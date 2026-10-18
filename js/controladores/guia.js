// Controlador: guía de estudio.

/* ---------- Guía ---------- */
function guia(){
  stopTimer(); S = null;
  app.innerHTML = `<section class="guide">
    <h2>Las partes del ensayo</h2>
    <p>Un ensayo argumentativo defiende una opinión. Estas son sus partes, en el orden en que suelen aparecer, con las palabras que ayudan a reconocerlas.</p>
    ${ORDEN_PARTES.map((k,i)=>{const p=PARTES[k];return `<article class="part">
      <div class="n">${i+1}</div>
      <div><h3><span class="hl" style="${cvar(k)}">${p.nombre}</span></h3><p>${p.def}</p><p class="where">Dónde va: ${p.donde}</p>
      <div class="keys2">${p.claves.map(c=>`<span>${c}</span>`).join("")}</div></div></article>`;}).join("")}
    <article class="part">
      <div class="n">“ ”</div>
      <div><h3><span class="hl" style="--c:var(--grid)">Las citas entre comillas</span></h3>
      <p>Cuando un ensayo usa las <b>palabras exactas de otra persona</b>, las escribe entre comillas (“ ”) y dice quién las dijo. Así el lector sabe que esa idea no es del autor del ensayo.</p>
      <p>Una cita no es una parte nueva del ensayo: va <b>dentro</b> de otra parte. Si apoya la tesis, es un <b>argumento</b> (se llama argumento de autoridad). Si muestra lo que piensan quienes no están de acuerdo, es parte del <b>contraargumento</b>.</p>
      <p class="where">Ejemplo: Como escribió Cervantes, <span class="cita">“el que lee mucho y anda mucho, ve mucho y sabe mucho”</span>.</p>
      <div class="keys2"><span>Como dijo…</span><span>Según…</span><span>Como escribió…</span><span>Se atribuye a…</span></div></div></article>
    <p class="note" style="margin-top:6px">ojo: los argumentos y el contraargumento forman el desarrollo (el cuerpo) del ensayo</p>
    <h2 style="margin-top:34px">Tema extra: <span class="hl" style="${cvar("pon")}">la ponencia</span></h2>
    <p>Una ponencia es una <b>exposición oral preparada</b> en la que una persona, el <b>ponente</b>, presenta un tema ante un público para informarlo o convencerlo. Se hace en congresos, foros, simposios y en clase. En los eventos, un <b>moderador</b> presenta a los ponentes, cuida el tiempo y organiza las preguntas.</p>
    <p>Se parece al ensayo porque tiene introducción, desarrollo y conclusión. La diferencia es que el ensayo se escribe para leerse y la ponencia se presenta en voz alta frente a otras personas. En congresos y eventos académicos, la ponencia también suele tener una versión escrita que el ponente prepara antes y luego expone.</p>
    ${[["Introducción","Saluda, presenta el tema y di el objetivo: qué vas a explicar y por qué importa.",["Buenos días…","Hoy les voy a hablar de…","El objetivo es…"]],
       ["Desarrollo","Explica las ideas en orden, con datos, ejemplos y apoyos visuales. Si usas ideas de otra persona, di de quién son.",["En primer lugar…","Según…","Como muestra esta gráfica…"]],
       ["Conclusión","Resume las ideas principales, deja un mensaje final y agradece.",["Para cerrar…","En resumen…","Muchas gracias por su atención"]],
       ["Ronda de preguntas","El público pregunta y el ponente responde con respeto. Si no sabes algo, dilo con honestidad.",["¿Alguna pregunta?","Gracias por la pregunta…"]]]
      .map(([t,d,c],i)=>`<article class="part pon"><div class="n">${i+1}</div><div><h3><span class="hl" style="${cvar("pon")}">${t}</span></h3><p>${d}</p><div class="keys2">${c.map(x=>`<span>${x}</span>`).join("")}</div></div></article>`).join("")}
    <article class="part pon"><div class="n">✓</div><div><h3><span class="hl" style="${cvar("pon")}">Cómo prepararla y presentarla</span></h3>
      <p><b>Antes:</b> elige y delimita el tema, investiga en fuentes confiables, haz un guion con las ideas clave, prepara diapositivas con poco texto y letra grande, y ensaya en voz alta midiendo el tiempo.</p>
      <p><b>Durante:</b> habla claro y sin correr, mira al público, mantén una postura erguida y tranquila, evita las muletillas ("eh", "o sea", "este") y respeta el tiempo.</p></div></article>
    <div class="cta"><button class="btn go" id="gPlay">Ir a jugar</button></div>
  </section>`;
  $("#gPlay").onclick = inicio;
  window.scrollTo(0,0);
}
