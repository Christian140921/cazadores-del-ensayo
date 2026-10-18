// Datos: las partes del ensayo (y la ponencia) con su nombre, color y definición.

const PARTES = {
  intro:  {nombre:"Introducción", c:"--hl-intro", def:"Presenta el tema y despierta el interés del lector. Da contexto: de qué se va a hablar y por qué importa.", donde:"Al comienzo del ensayo.", claves:["Hoy en día…","En la actualidad…","Cada vez más…","Una pregunta, un dato o una situación cotidiana"]},
  tesis:  {nombre:"Tesis", c:"--hl-tesis", def:"Es la postura u opinión del autor sobre el tema. Todo el ensayo existe para defenderla, por eso debe ser clara y discutible.", donde:"Normalmente al final de la introducción.", claves:["Considero que…","En mi opinión…","Sostengo que…","Mi postura es…"]},
  arg:    {nombre:"Argumento", c:"--hl-arg", def:"Razones, ejemplos, datos, comparaciones o citas de una autoridad que apoyan la tesis. Forman el desarrollo o cuerpo del ensayo.", donde:"En el desarrollo, uno o varios párrafos.", claves:["En primer lugar…","Además…","Por ejemplo…","Según un estudio…"]},
  contra: {nombre:"Contraargumento", c:"--hl-contra", def:"Presenta una opinión contraria a la tesis y luego la refuta, mostrando por qué no es suficiente. Hace el ensayo más convincente.", donde:"En el desarrollo, casi siempre antes de la conclusión.", claves:["Algunos piensan que…","Es cierto que…","Sin embargo…","No obstante…"]},
  concl:  {nombre:"Conclusión", c:"--hl-concl", def:"Cierra el ensayo: retoma la tesis, resume las ideas principales y puede dejar una reflexión o propuesta.", donde:"Al final del ensayo.", claves:["En conclusión…","En resumen…","Por todo lo anterior…","En definitiva…"]}
};
PARTES.pon = {nombre:"Ponencia", c:"--hl-pon", def:"Exposición oral preparada en la que un ponente presenta un tema ante un público."};
const ORDEN_PARTES = ["intro","tesis","arg","contra","concl"];
