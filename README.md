# Cazadores del Ensayo

Juego para clase sobre las partes del ensayo y la ponencia. Cada fallo dibuja una parte del ahorcado; con 6 fallos se pierde.
Se juega solo, por equipos en el proyector o en vivo (proyector + celulares, con Firebase).

Página publicada: https://christian140921.github.io/cazadores-del-ensayo/

## Cómo está organizado

Es una página estática: no necesita compilar nada. `index.html` carga los estilos y los scripts en este orden,
de lo más básico a lo que arma las pantallas (cada capa solo usa lo que se cargó antes):

```
index.html            estructura fija de la página (barra superior, contenedor #app)
css/estilos.css       todo el diseño
js/
  datos/              contenido: partes del ensayo, recortes, preguntas de ponencia y de muerte súbita, textos
  config.js           Firebase, dirección del juego y límites de las salas
  util.js             utilidades pequeñas ($, esc, shuffle)
  servicios/          lo que habla con el navegador o con internet: almacenamiento, sonido, voz, Firebase, récords
  modelo/             estado y reglas: la partida actual (S), la sala en vivo (VIVO), cómo se arma cada partida, la tabla y los empates
  vista/              piezas que dibujan: el ahorcado, el confeti, QR, récords y mensajes
  controladores/      cada pantalla: inicio, guía, Clasifica, Ordena, proyector en vivo y celular en vivo
  main.js             conecta los botones fijos y abre la primera pantalla
herramientas/
  empaquetar.py       junta todo en un solo .html, por si se necesita un archivo suelto
```

## Cómo cambiar el contenido

- Recortes de ensayos: `js/datos/recortes.js`.
- Preguntas de la ponencia: `js/datos/ponencia.js` (la primera opción es la correcta; el juego las baraja).
- Preguntas de la muerte súbita: `js/datos/desempate.js`.

Si cambias preguntas, todos los celulares deben recargar la página: el juego compara una huella del banco de preguntas
entre el proyector y cada celular, y avisa si no coinciden.

## Probar en tu computador

Abre `index.html` en el navegador. El modo en vivo necesita internet (Firebase); los demás modos funcionan sin conexión
salvo las fuentes y el código QR.
