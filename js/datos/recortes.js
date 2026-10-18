// Datos: los recortes de ensayos que se clasifican, con su explicación.

/* Recortes "sin pistas": no traen conectores típicos, hay que reconocer qué hace el párrafo */
const SIN_PISTAS = [
  ["El celular en clase","tesis","El celular no debería estar prohibido en clase; lo que hace falta son reglas claras sobre cuándo y para qué se usa.","No dice «en mi opinión», pero es la postura que el resto del ensayo va a defender: es la tesis."],
  ["El celular en clase","concl","Al final, la pregunta no es si el celular entra al salón, sino si aprendemos a usarlo con responsabilidad.","Retoma la postura del autor y deja una reflexión para cerrar, aunque no empiece con «En conclusión»."],
  ["Reciclaje en el colegio","arg","Una botella de plástico tarda cientos de años en descomponerse; reciclada, puede convertirse en una camiseta o en una silla. Separar la basura en el colegio sí cambia algo.","Trae un dato y lo usa para defender que reciclar en el colegio vale la pena. No es una introducción: ya está apoyando la postura del autor, así que es un argumento."],
  ["Reciclaje en el colegio","contra","¿Y si reciclar le quita tiempo a las clases? La experiencia de otros colegios muestra que cinco minutos por curso bastan.","Plantea la objeción de quien no está de acuerdo, en forma de pregunta, y luego la responde: es un contraargumento."],
  ["Leer por gusto","intro","En la biblioteca del colegio hay libros que nadie ha pedido prestados en años.","Abre el tema con una situación concreta y todavía no da ninguna opinión: es la introducción."],
  ["Leer por gusto","concl","Hemos visto que leer por gusto ayuda a concentrarse, a imaginar y a pensar por nuestra cuenta. Un libro no compite con una pantalla: vale la pena hacerle un espacio.","Recoge las razones que ya se dieron (concentrarse, imaginar, pensar) y cierra con una invitación: es la conclusión, no la tesis."],
  ["Más educación física","arg","Los estudiantes que hacen deporte con regularidad duermen mejor y llegan más descansados a clase.","Da una razón a favor de más educación física: es un argumento, aunque no tenga conector."],
  ["Más educación física","intro","Suena el timbre del descanso y la mitad del curso se queda sentada mirando el celular.","Pinta una escena cotidiana para presentar el problema. El autor aún no opina: es la introducción."],
  ["Las redes sociales","contra","Prohibir las redes a los menores parece una solución sencilla. El problema es que lo prohibido se usa a escondidas y sin nadie que oriente.","Presenta la postura contraria (prohibirlas) y muestra por qué no basta: es un contraargumento."],
  ["El uniforme escolar","arg","Con uniforme, nadie llega al salón preguntándose si su ropa es lo bastante buena para que no se burlen.","Muestra un beneficio del uniforme que apoya la tesis: es un argumento."],
  ["El uniforme escolar","intro","Cada enero, en las tiendas del centro se forman filas de familias que compran sacos, jardineras y zapatos negros.","Describe una escena para presentar el tema y todavía no hay opinión: es la introducción."],
  ["Los videojuegos","tesis","Los videojuegos, jugados con medida, pueden enseñar tanto como muchas actividades que los adultos sí aprueban.","Es la idea que el autor va a defender, sin «considero que»: es la tesis."],
  ["Las tareas para la casa","concl","Después de todo lo dicho, la idea queda clara: menos tareas no significa estudiar menos, sino estudiar mejor y llegar al día siguiente con ganas de aprender.","«Después de todo lo dicho» muestra que retoma lo que ya se explicó y cierra con una idea para recordar: es la conclusión, no la tesis."],
  ["Comida sana en el colegio","arg","Un estudiante que almuerza fruta, arroz y proteína se concentra mejor en la tarde que uno que solo come paquetes y gaseosa.","Compara dos casos para apoyar la tesis de la comida sana: es un argumento."],
  ["Aprender otro idioma","contra","Hoy cualquier celular traduce en segundos, ¿para qué estudiar inglés entonces? Porque una aplicación no puede hacer amigos ni entender un chiste por nosotros.","Pone en boca de otros una objeción (el traductor) y la responde: es un contraargumento."],
  ["La música en el colegio","tesis","La clase de música merece tantas horas como la de matemáticas.","Es una opinión discutible que el ensayo va a defender: es la tesis, aunque no diga «a mi juicio»."]
];
const ENSAYOS = [
 {tema:"El celular en clase", f:[
  ["intro","Hoy casi todos los estudiantes llevan un celular en la maleta. Lo usamos para conversar, buscar información y entretenernos, y por eso muchos colegios se preguntan qué hacer con él durante las clases.","Presenta el tema con una situación cotidiana y plantea la pregunta del ensayo, pero todavía no da una opinión."],
  ["tesis","En mi opinión, el celular debería permitirse en clase solo cuando el profesor lo indique para una actividad, porque bien usado es una herramienta de aprendizaje.","\"En mi opinión\" anuncia la postura del autor. Es la idea que el resto del ensayo va a defender."],
  ["arg","Por ejemplo, con el celular podemos consultar un diccionario, revisar un mapa o responder un cuestionario en línea en pocos segundos, lo que hace la clase más dinámica.","Da ejemplos concretos (\"Por ejemplo\") que apoyan la tesis de que el celular sirve para aprender."],
  ["arg","Además, aprender a usarlo con reglas nos prepara para el futuro, ya que en la universidad y en el trabajo tendremos que manejar la tecnología de forma responsable.","\"Además\" suma una nueva razón a favor de la tesis. Es un argumento del desarrollo."],
  ["contra","Es cierto que algunos piensan que “el celular solo sirve para distraerse con juegos y redes sociales”. Sin embargo, la distracción disminuye cuando hay normas claras y el profesor decide en qué momento se usa.","Pone entre comillas lo que piensan otras personas (\"algunos piensan\") y luego lo refuta con \"Sin embargo\". Es un contraargumento.","quienes piensan distinto"],
  ["concl","En conclusión, prohibir el celular por completo desaprovecha una herramienta útil. Lo mejor es enseñarnos a usarlo con responsabilidad dentro del aula.","\"En conclusión\" marca el cierre: retoma la tesis y deja una propuesta final."]
 ]},
 {tema:"Reciclaje en el colegio", f:[
  ["intro","Cada día, en un colegio se botan cientos de botellas, hojas y envoltorios. Parecen pocas cosas, pero al final del año forman una verdadera montaña de basura.","Abre con una imagen que despierta interés y muestra el problema. Aún no dice qué opina el autor."],
  ["tesis","Considero que todos los colegios deberían tener un programa obligatorio de reciclaje dirigido por los propios estudiantes.","\"Considero que\" expresa una postura clara y discutible: esa es la tesis."],
  ["arg","En primer lugar, separar los residuos reduce la basura que llega a los rellenos sanitarios, y materiales como el papel y el plástico pueden volver a usarse.","\"En primer lugar\" ordena las razones del desarrollo. Esta apoya la tesis con un beneficio concreto."],
  ["arg","En segundo lugar, cuando los estudiantes organizan el programa, aprenden a trabajar en equipo y a cuidar su entorno con acciones concretas.","\"En segundo lugar\" introduce otra razón a favor de la tesis."],
  ["arg","Como dice una conocida frase atribuida al químico Antoine Lavoisier: “En la naturaleza nada se crea, nada se pierde, todo se transforma”. Reciclar es aplicar esa idea a nuestra basura.","Usa la frase de un científico famoso, entre comillas, para apoyar la tesis. Es un argumento de autoridad.","Antoine Lavoisier"],
  ["contra","Algunas personas dicen que reciclar le quita tiempo a las clases. No obstante, bastan unos minutos al día y turnos por curso para que funcione sin afectar el estudio.","Presenta la objeción (\"Algunas personas dicen\") y la responde con \"No obstante\"."],
  ["concl","Por todo lo anterior, un programa de reciclaje es una lección práctica sobre el cuidado del planeta que cualquier colegio puede aplicar.","\"Por todo lo anterior\" resume lo dicho y cierra reafirmando la tesis."]
 ]},
 {tema:"Leer por gusto", f:[
  ["intro","Vivimos rodeados de videos cortos y mensajes rápidos. En medio de tanta información, leer un libro completo parece una actividad de otra época.","Describe el contexto actual para introducir el tema de la lectura, sin dar todavía una postura."],
  ["tesis","Pienso que leer por gusto sigue siendo uno de los mejores hábitos que puede tener un joven, porque nos ayuda a pensar y a expresarnos mejor.","\"Pienso que\" introduce la opinión central que se defenderá en el ensayo."],
  ["arg","Diversos estudios señalan que quienes leen con frecuencia tienen un vocabulario más amplio y escriben con mayor claridad, algo que se nota en todas las asignaturas.","Usa evidencia (\"Diversos estudios señalan\") para respaldar la tesis."],
  ["arg","Asimismo, la lectura desarrolla la empatía: al seguir la historia de un personaje, nos ponemos en el lugar de otras personas y entendemos realidades distintas.","\"Asimismo\" agrega otra razón que apoya la tesis."],
  ["arg","Como escribió Miguel de Cervantes en Don Quijote: “El que lee mucho y anda mucho, ve mucho y sabe mucho”. Leer nos permite conocer el mundo sin salir de casa.","Usa una cita de un autor reconocido para apoyar la tesis. Por eso es un argumento: se llama argumento de autoridad.","Miguel de Cervantes"],
  ["contra","Hay quienes afirman que leer es aburrido y que se aprende lo mismo viendo videos. Pero un video nos entrega todo resuelto, mientras que un libro nos obliga a imaginar y a concentrarnos por más tiempo.","Recoge una idea opuesta (\"Hay quienes afirman\") y la rebate con \"Pero\"."],
  ["concl","En resumen, leer no pasa de moda. Dedicar aunque sea veinte minutos al día a un libro puede mejorar nuestra forma de pensar, escribir y convivir.","\"En resumen\" cierra el ensayo y deja una recomendación final."]
 ]},
 {tema:"Más educación física", f:[
  ["intro","Muchos estudiantes pasan gran parte del día sentados: en el salón, frente a una pantalla y luego haciendo tareas. El movimiento ocupa cada vez menos espacio en nuestra rutina.","Plantea la situación que da origen al tema. Todavía no hay opinión, solo contexto."],
  ["tesis","Por eso, defiendo que el colegio debería aumentar las horas de educación física a la semana.","\"Defiendo que\" deja clara la postura del autor: es la tesis."],
  ["arg","La Organización Mundial de la Salud recomienda que niños y adolescentes hagan al menos 60 minutos de actividad física al día, y el colegio es un buen lugar para lograrlo.","Cita una fuente confiable (la OMS) como prueba a favor de la tesis."],
  ["arg","Además, hacer ejercicio ayuda a concentrarse: después de moverse, es más fácil prestar atención en las clases siguientes.","\"Además\" suma una razón más que apoya la tesis."],
  ["arg","Hace casi dos mil años, el poeta romano Juvenal escribió: “mente sana en cuerpo sano”. Esa idea sigue vigente: cuidar el cuerpo también nos ayuda a pensar mejor.","Trae las palabras de un autor antiguo, entre comillas, para respaldar la tesis. Es un argumento de autoridad.","el poeta Juvenal"],
  ["contra","Se podría objetar que más horas de deporte significan menos tiempo para matemáticas o lenguaje. Aun así, un estudiante sano y descansado aprovecha mejor las horas que sí tiene en esas asignaturas.","\"Se podría objetar\" presenta la idea contraria y \"Aun así\" la refuta."],
  ["concl","Así, sumar horas de educación física es una inversión en la salud y el rendimiento de los estudiantes, y vale la pena que el colegio lo considere.","Cierra retomando la tesis y proponiendo una acción. Es la conclusión."]
 ]},
 {tema:"Las redes sociales", f:[
  ["intro","Las redes sociales forman parte de la vida diaria de los adolescentes. Allí compartimos fotos, conversamos y nos enteramos de lo que pasa en el mundo.","Introduce el tema mostrando lo presente que está en nuestra vida, sin tomar postura."],
  ["tesis","A mi juicio, las redes sociales no son buenas ni malas por sí mismas: su efecto depende de cuánto tiempo y de cómo las usemos.","\"A mi juicio\" anuncia la opinión del autor que guiará todo el texto."],
  ["arg","Por un lado, permiten mantener el contacto con amigos y familiares que viven lejos, y también difundir campañas solidarias en poco tiempo.","\"Por un lado\" presenta una razón que respalda la tesis con ejemplos."],
  ["arg","Por otro lado, el mismo uso puede hacer daño: pasar horas comparándose con otros afecta la autoestima. Eso confirma que el problema no son las redes, sino la forma en que las usamos.","Muestra un riesgo, pero lo usa para reforzar la tesis («depende de cómo las usemos»). No responde a nadie que piense distinto: es un argumento."],
  ["contra","Algunos adultos sostienen que “lo mejor sería prohibirlas a los menores de edad”. Sin embargo, la prohibición no enseña a usarlas bien, y tarde o temprano los jóvenes llegarán a ellas sin preparación.","Pone entre comillas la postura contraria (\"Algunos adultos sostienen\") y la refuta con \"Sin embargo\". Es un contraargumento.","algunos adultos"],
  ["concl","En definitiva, más que alejarnos de las redes, necesitamos aprender a usarlas con criterio, cuidando nuestro tiempo y nuestro bienestar.","\"En definitiva\" señala el cierre y la idea final del ensayo."]
 ]},
 {tema:"El uniforme escolar", f:[
  ["intro","El uniforme escolar es una tradición en muchos colegios de Latinoamérica. Cada año, al comprarlo, vuelve la misma pregunta: ¿es realmente necesario?","Presenta el tema y lanza una pregunta para atrapar al lector."],
  ["tesis","Mi postura es que el uniforme sí es útil, porque reduce las diferencias entre estudiantes y facilita la vida diaria.","\"Mi postura es\" expresa directamente la tesis."],
  ["arg","Cuando todos visten igual, disminuyen las burlas por la ropa o las marcas, y los estudiantes se fijan más en las personas que en lo que llevan puesto.","Explica una razón que apoya la tesis: el uniforme reduce diferencias."],
  ["arg","También ahorra tiempo y dinero a las familias, porque no hay que decidir cada mañana qué ponerse ni comprar ropa distinta para cada día.","\"También\" agrega otra razón a favor de la tesis."],
  ["contra","Quienes están en contra dicen que “el uniforme limita la libertad de expresión”. Es un punto válido, pero los estudiantes pueden expresar su personalidad de muchas otras formas, como en sus ideas y sus trabajos.","Cita la idea de quienes piensan distinto (\"Quienes están en contra dicen\") y la responde con \"pero\". Es un contraargumento.","quienes están en contra del uniforme"],
  ["concl","Por estas razones, considero que el uniforme debe mantenerse, aunque su diseño podría revisarse con la participación de los propios estudiantes.","\"Por estas razones\" resume y reafirma la tesis para cerrar."]
 ]},
 {tema:"Los videojuegos", f:[
  ["intro","Muchos adolescentes dedican parte de su tiempo libre a los videojuegos. Para algunos padres son una pérdida de tiempo; para otros, una forma más de aprender y divertirse.","Presenta el tema y muestra que hay opiniones distintas, pero el autor todavía no dice la suya."],
  ["tesis","Considero que los videojuegos pueden ser beneficiosos para los jóvenes, siempre que se jueguen con moderación.","\"Considero que\" anuncia la postura del autor. El resto del ensayo la va a defender."],
  ["arg","Por ejemplo, muchos juegos exigen resolver problemas, planificar estrategias y tomar decisiones rápidas, habilidades que también sirven en el colegio.","\"Por ejemplo\" introduce una razón concreta que apoya la tesis."],
  ["arg","Además, los juegos en equipo enseñan a comunicarse y a colaborar con otras personas para lograr un objetivo común.","\"Además\" suma otra razón a favor de la tesis."],
  ["contra","Es verdad que algunos jóvenes juegan tantas horas que descuidan sus estudios. Sin embargo, ese problema se debe al exceso y no al videojuego en sí, y se soluciona con horarios claros.","Reconoce una crítica (\"Es verdad que\") y la refuta con \"Sin embargo\"."],
  ["concl","En conclusión, los videojuegos no son enemigos del aprendizaje: bien administrados, pueden ayudar a desarrollar habilidades útiles.","\"En conclusión\" cierra el ensayo y reafirma la tesis."]
 ]},
 {tema:"Las tareas para la casa", f:[
  ["intro","Al terminar la jornada escolar, muchos estudiantes llegan a casa con la maleta llena de tareas. Algunos días pasan horas frente a los cuadernos antes de poder descansar.","Describe una situación conocida para presentar el tema, sin dar todavía una opinión."],
  ["tesis","En mi opinión, las tareas deberían ser menos y más cortas, pero bien pensadas para reforzar lo aprendido en clase.","\"En mi opinión\" expresa la postura que el ensayo va a defender."],
  ["arg","En primer lugar, el descanso es necesario para aprender: un estudiante agotado rinde menos y olvida con más facilidad lo que estudió.","\"En primer lugar\" ordena la primera razón a favor de la tesis."],
  ["arg","En segundo lugar, una tarea corta y bien diseñada permite practicar lo esencial sin quitarle tiempo a la familia, al deporte o a la lectura.","\"En segundo lugar\" agrega otra razón que apoya la tesis."],
  ["contra","Algunos profesores piensan que “muchas tareas forman el hábito del estudio”. No obstante, el hábito depende más de la constancia que de la cantidad, y una tarea breve diaria también lo crea.","Pone entre comillas la idea de otras personas que piensan distinto (\"Algunos profesores piensan\") y luego la refuta con \"No obstante\". Es un contraargumento.","algunos profesores"],
  ["concl","En resumen, menos tareas pero de mejor calidad nos ayudarían a aprender más y a vivir con menos estrés.","\"En resumen\" retoma la tesis para cerrar el ensayo."]
 ]},
 {tema:"Comida sana en el colegio", f:[
  ["intro","En los descansos, las tiendas escolares de muchos colegios venden papas fritas, galletas y bebidas con mucha azúcar. Es lo más fácil de comprar y, a veces, lo único que hay.","Muestra el problema con una escena cotidiana. Aún no hay opinión del autor."],
  ["tesis","Sostengo que los colegios deberían ofrecer principalmente alimentos saludables en sus tiendas escolares y comedores.","\"Sostengo que\" presenta la postura central del ensayo."],
  ["arg","Una alimentación equilibrada entrega la energía que el cuerpo y el cerebro necesitan para aprender durante toda la jornada.","Da una razón que explica por qué la tesis es correcta."],
  ["arg","Asimismo, el colegio es un lugar donde se forman hábitos: si nos acostumbramos a comer fruta o comida hecha en casa, es más probable que lo sigamos haciendo de adultos.","\"Asimismo\" suma un nuevo argumento a favor de la tesis."],
  ["contra","Hay quienes dicen que cada estudiante debe ser libre de comer lo que quiera. Pero el colegio no prohíbe nada fuera de él; solo se trata de que lo que ofrece sea sano.","Recoge la objeción (\"Hay quienes dicen\") y la rebate con \"Pero\"."],
  ["concl","Por todo lo anterior, ofrecer comida saludable en el colegio es una forma sencilla de cuidar la salud y el rendimiento de los estudiantes.","\"Por todo lo anterior\" resume lo dicho y cierra el ensayo."]
 ]},
 {tema:"Adoptar mascotas", f:[
  ["intro","Cada año, miles de perros y gatos viven en la calle o en refugios esperando una familia. Al mismo tiempo, muchas personas compran animales de raza en tiendas.","Presenta el contexto del tema con datos que llaman la atención, sin tomar postura."],
  ["tesis","Pienso que, antes de comprar una mascota, las familias deberían considerar adoptar una.","\"Pienso que\" introduce la opinión que se defenderá."],
  ["arg","Adoptar le da un hogar a un animal que lo necesita y ayuda a disminuir la cantidad de animales abandonados.","Explica una razón que apoya la tesis."],
  ["arg","También suele ser más económico, porque muchos refugios entregan a las mascotas vacunadas y esterilizadas.","\"También\" agrega otra razón a favor de adoptar."],
  ["contra","Algunas personas creen que los animales adoptados tienen problemas de comportamiento. Sin embargo, la mayoría se adapta bien con cariño y paciencia, igual que cualquier otra mascota.","Expone una creencia contraria (\"Algunas personas creen\") y la refuta con \"Sin embargo\"."],
  ["concl","En definitiva, adoptar es una decisión responsable y solidaria que cambia la vida de un animal y la de su nueva familia.","\"En definitiva\" marca el cierre y la idea final."]
 ]},
 {tema:"Aprender otro idioma", f:[
  ["intro","Hoy podemos conversar con personas de otros países por internet, ver series de todo el mundo y viajar con más facilidad que antes.","Describe el mundo actual para introducir el tema, sin dar todavía una opinión."],
  ["tesis","Por eso, considero que aprender un segundo idioma desde el colegio es más importante que nunca.","\"Considero que\" deja clara la postura del autor."],
  ["arg","Hablar otro idioma abre más oportunidades de estudio y de trabajo, ya que muchas becas y empleos lo piden como requisito.","Da una razón concreta que respalda la tesis."],
  ["arg","Además, aprender un idioma nos acerca a otras culturas y nos ayuda a entender mejor nuestra propia lengua.","\"Además\" suma otra razón a favor de la tesis."],
  ["arg","Se atribuye a Nelson Mandela esta frase: “Si le hablas a una persona en un idioma que entiende, llegas a su cabeza. Si le hablas en su propio idioma, llegas a su corazón”. Aprender otro idioma es una forma de acercarnos a los demás.","Cita las palabras de una persona importante para reforzar la tesis. Es un argumento de autoridad.","Nelson Mandela"],
  ["contra","Se podría pensar que hoy basta con un traductor automático. Aun así, un traductor no reemplaza la capacidad de conversar con alguien de forma natural ni de entender su cultura.","\"Se podría pensar\" presenta la objeción y \"Aun así\" la refuta."],
  ["concl","Así, dedicar tiempo a un segundo idioma es una inversión que nos acompañará toda la vida.","Cierra reafirmando la tesis con una idea final."]
 ]},
 {tema:"La música en el colegio", f:[
  ["intro","La música está presente en casi todos los momentos de nuestra vida: en las fiestas, en el transporte y hasta mientras hacemos tareas.","Abre con una observación cotidiana que presenta el tema."],
  ["tesis","A mi juicio, la clase de música debería tener la misma importancia que las demás asignaturas.","\"A mi juicio\" anuncia la opinión que guiará todo el ensayo."],
  ["arg","Según diversas investigaciones, aprender a tocar un instrumento ayuda a mejorar la memoria y la concentración.","Usa evidencia (\"Según diversas investigaciones\") para apoyar la tesis."],
  ["arg","Por otro lado, la música permite expresar emociones y trabajar en grupo, por ejemplo al formar una banda o un coro.","\"Por otro lado\" agrega una razón distinta a favor de la tesis."],
  ["arg","Al filósofo griego Platón se le atribuye la idea de que “la música es para el alma lo que la gimnasia es para el cuerpo”. Es decir, la música también nos forma como personas.","Trae la idea de un pensador famoso, entre comillas, para apoyar la tesis. Es un argumento de autoridad.","Platón"],
  ["contra","Quienes no están de acuerdo dicen que la música no sirve para conseguir trabajo. Es una opinión comprensible, pero las habilidades que desarrolla, como la disciplina y la creatividad, sirven en cualquier profesión.","Reconoce la postura contraria (\"Quienes no están de acuerdo\") y la responde con \"pero\"."],
  ["concl","En conclusión, la música es una parte valiosa de la formación de los estudiantes y merece su lugar en el colegio.","\"En conclusión\" cierra y retoma la tesis."]
 ]}
];
