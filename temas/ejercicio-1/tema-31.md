# 1. INTRODUCCIÓN

Gran parte de las labores del Servicio de Inspección SOIVRE se realiza en la Red de Laboratorios del SOIVRE, algunos de ellos acreditados por la Entidad Nacional de Acreditación (ENAC) según la Norma UNE-EN ISO/IEC 17025:2017, que regula el Sistema de Gestión de la Calidad de los laboratorios de ensayo y calibración y establece los requisitos para demostrar la competencia en la realización de ensayos. La ENAC es una asociación sin ánimo de lucro, el único organismo con potestad pública para acreditar según el **Real Decreto 1715/2010** y el **Reglamento (CE) 765/2008**. Su marca respalda la aceptación internacional de los informes gracias a los Acuerdos Multilaterales de Reconocimiento, suscritos por más de 120 países y gestionados por EA y Global ACI (resultado, desde el 1 de enero de 2026, de la fusión de ILAC e IAF).

La red consta de 16 laboratorios de ensayo en la red periférica, algunos acreditados, y un Laboratorio Central en Madrid, creado en 1989 y también acreditado, integrados en la Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior. Cada laboratorio tiende a especializarse en un campo.

Funciones principales del Laboratorio Central:

- Coordinar y armonizar la red periférica y las aplicaciones informáticas
- Planificar las adquisiciones de material instrumental y asesorar sobre reactivos, suministradores, calibración y seguridad
- Poner a punto nuevas metodologías y dar soporte analítico
- Organizar ejercicios de intercomparación y seguir el programa de acreditación
- Realizar actividades formativas y apoyo documental

# 2. CONNOTACIONES DEL MUESTREO FÍSICO Y DEL MUESTREO ESTADÍSTICO

**Población.** La estadística estudia poblaciones, colectivos o universos, es decir, conjuntos de individuos, cosas o elementos con características comunes. Como no siempre se puede estudiar toda la población (por razones económicas, de rapidez o porque los elementos se destruyen al analizarlos), se examina una parte, la **muestra**, que para ser válida debe ser representativa, esto es, tener las mismas características que la población en las variables estudiadas.

Los experimentos pueden ser deterministas (las mismas causas producen los mismos efectos) o aleatorios (reproducidos en las mismas condiciones, su resultado es incierto o depende del azar). La estadística estudia los aleatorios. El **espacio muestral** es el conjunto de todos los sucesos elementales o posibles resultados de un experimento aleatorio, y para definir la variable aleatoria hay que conocer sus valores y su probabilidad asociada.

**Muestreo.** Es la técnica para seleccionar una muestra a partir de una población. La clave está en elegir bien la muestra representativa, y hay dos tipos:

- **Muestreo estadístico** (probabilístico o aleatorio): la muestra se selecciona mediante un experimento aleatorio previamente definido, de modo que se conoce la probabilidad de seleccionar cada elemento. La muestra reproduce fielmente la población
- **Muestreo físico**: una persona escoge según su criterio las unidades de la muestra. No es aleatorio, pero a veces es el más aconsejable o el único posible, por ejemplo para detectar una variedad diferente en una partida de fruta

# 3. POBLACIÓN Y MUESTRA. TIPOS DE MUESTREO

**Población.** Conjunto de elementos del que se quieren obtener conclusiones pero que, en la mayoría de los casos, es inaccesible para estudiarlo entero. **Muestra.** Conjunto accesible y limitado de elementos sobre el que se hacen comprobaciones para generalizar conclusiones a la población.

El diseño básico es el **muestreo aleatorio**, que no sigue un criterio personal sino un fundamento estadístico: todos los individuos tienen la misma probabilidad de ser elegidos. Existen varios tipos, que permiten adaptarse a cada población.

- **Muestreo aleatorio simple**: ideal cuando la población es homogénea respecto a la variable estudiada
  - Se numeran todos los elementos y se extraen números al azar con un sistema mecánico, una tabla de números aleatorios o un programa informático
  - Puede ser con reemplazamiento (el elemento analizado vuelve a la población y puede salir de nuevo) o sin reemplazamiento
  - Si la población es grande respecto a la muestra, es prácticamente indiferente, pero el análisis es siempre más simple con reemplazamiento
- **Muestreo aleatorio estratificado**: se clasifican los elementos en grupos homogéneos llamados estratos y se selecciona una muestra aleatoria de cada uno. Reduce la variación de los resultados y da mayor precisión. Es constante o proporcional según que los estratos tengan o no el mismo tamaño. Se usa cuando se sabe a priori que la característica varía según el estrato, como el índice azúcar/acidez de una variedad de naranja por categorías
- **Muestreo por conglomerados**: similar al estratificado pero más económico. Se aplica cuando los elementos están agrupados de forma natural en áreas o conglomerados y cada uno puede suponerse representativo de la población. Después se analizan todos sus elementos o se hace un muestreo aleatorio simple. Es cómodo en áreas urbanas (familias, edificios, manzanas)
- **Muestreo aleatorio sistemático**: cuando los elementos están ordenados en listas, se escoge el primero al azar y los siguientes a intervalos fijos (si se elige uno de cada 10 y el primero fue el 3, los siguientes son el 13, 23, 33...)
- **Muestreo de aceptación**: propio del control de calidad, inspecciona una muestra de un lote de materia prima, partes o productos terminados para aceptar o rechazar todo el lote con un determinado grado de confianza

La regla general de todos los procedimientos es que cualquier información previa debe usarse para subdividir la población y asegurar la mayor representatividad de la muestra.

# 4. FASES O ETAPAS DEL MUESTREO

- **Objetivos y motivos**: definición de la población, de los caracteres a estudiar y del objetivo del muestreo
- **Condiciones, recursos y limitaciones**: el Plan de Trabajo, con los límites presupuestarios, la legislación y la oportunidad de fechas
- **Programa de operaciones**: diseño del esquema lógico-matemático, unidades de muestreo, método de selección y estimación, tamaño de la muestra, métodos de recolección y medición de datos y preparación del personal y el equipo
- **Ejecución del programa y recolección de datos**: es la realización del muestreo. Conviene hacer antes una o más muestras piloto en las que se pone a prueba todo el programa
- **Análisis y aprovechamiento de los resultados**: elaboración, codificación y cálculo de las estimaciones con sus errores de muestreo. Es importante comparar el error máximo admisible fijado en la primera fase con el error de muestreo calculado a posteriori

# 5. MUESTREO PROBABILÍSTICO: ESTIMADORES, ESTIMACIÓN DE LA MEDIA Y DEL TOTAL, PRECISIÓN DE LAS ESTIMACIONES Y TAMAÑO DE LA MUESTRA

Para seleccionar una muestra probabilística se numeran los elementos de la población del 1 al N (tamaño de la población) y se toman los números aleatorios que indique la tabla o el programa, obteniendo una muestra de tamaño n. Se considera el muestreo con reemplazamiento, más simple de calcular y casi igual al muestreo sin reemplazamiento en muestras grandes. Así, cada elemento tiene probabilidad **1/N** de ser elegido.

La probabilidad de que un elemento de la muestra tome un valor menor que X coincide con la proporción de elementos de la población con valores menores que X. La **función de probabilidad** (función densidad si la variable es continua) asocia a cada valor Xi su probabilidad, y la **función de distribución** asocia a cada Xi la probabilidad de tomar valores menores o iguales a Xi. Esto permite estimar los valores de la población a partir de la muestra, lo que se llama **inferencia estadística**: el conjunto de métodos que permiten deducir cómo se distribuye la población y la relación estocástica entre variables a partir de la muestra.

## 5.1. Inferencia estadística

Según el conocimiento de la distribución en la población:

- **Inferencia paramétrica**: se conoce la forma de la distribución (Normal, Binomial, Poisson...) pero no sus parámetros, sobre los que se hacen inferencias
- **Inferencia no paramétrica**: se desconocen forma y parámetros, y se infieren características que no son parámetros de una distribución conocida (mediana, estadísticos de orden)

Según cómo se estudian los parámetros desconocidos:

- **Estimación**: se dan estimaciones de los parámetros sin hipótesis previas sobre sus valores. Es la que desarrolla el tema
- **Contraste de hipótesis**: se plantean hipótesis sobre los parámetros y se comprueba su verosimilitud

## 5.2. Estimadores

**Estimador.** Función numérica que permite estimar el parámetro poblacional a partir de los estadísticos muestrales. El valor que toma para una muestra concreta es la **estimación**, que puede ser puntual (un valor concreto, como la media) o por intervalos (indica con una probabilidad que el valor verdadero está entre los límites de un intervalo, con lo que se pierde exactitud y se gana en precisión).

Un buen estimador tiene dos cualidades básicas:

- **Insesgado**: su esperanza matemática coincide con el parámetro a estimar, sin desviación
- **Varianza mínima**: si el estimador converge al valor verdadero al aumentar la muestra, la varianza y el error disminuyen y se dice que es **consistente**

Si cumple las dos condiciones, es **eficiente**. Para obtener el estimador existen varios métodos:

- **Máxima Verosimilitud**: el más conocido. Toma como parámetro poblacional el valor de la muestra más probable, maximizando la función de densidad bajo independencia. Suele dar estimadores consistentes y eficientes
- **Método Analógico**: el más sencillo. Va de lo particular a lo particular, comparando dos fenómenos parecidos pero no idénticos para inferir las causas del menos conocido a partir del más conocido
- **Mínimos Cuadrados**: minimiza la suma de cuadrados de los errores (diferencias entre valores observados y esperados). Muy usado en modelos de regresión

## 5.3. Estimación de la media y el total

**Media.** La mejor estimación de la media exacta es la media aritmética muestral, la suma de los valores de la muestra dividida entre el número de elementos de la muestra. Es más probable que se acerque al valor verdadero cuanto mayor sea el número de mediciones.

**Total poblacional.** Es la suma de los valores de todos los elementos de la población. No se calcula directamente, se estima multiplicando la media muestral por el tamaño de la población: Total estimado = N × x̅, siendo N el tamaño de la población y x̅ la media muestral. Es más fiable cuanto mayor es la muestra y menor la variabilidad de la población.

**Proporción muestral.** Si los elementos solo pueden tomar dos valores (éxito o no, como en la binomial), se usa la proporción, que es la división entre los éxitos y el tamaño de la muestra. Expresada en porcentaje, se suman los elementos con la característica, se multiplica por 100 y se divide entre n, el tamaño muestral.

## 5.4. Precisión de las estimaciones

Tan importante como estimar el parámetro es conocer la precisión de la estimación, es decir, la representatividad del valor calculado, lo que se mide con las medidas de dispersión.

**Varianza.** Es la suma de las desviaciones de cada dato respecto a la media, elevadas al cuadrado para que sean positivas, dividida entre el tamaño de la muestra. Indica la mayor o menor dispersión respecto a la media y, por tanto, su representatividad. Su inconveniente es que viene en el cuadrado de las unidades de la variable.

**Desviación típica.** Es la raíz cuadrada positiva de la varianza y se expresa en las mismas unidades que la variable, por lo que es más apta como medida de dispersión.

Al aumentar el tamaño de la muestra (n) disminuye la variabilidad o el error de muestreo, y si la muestra coincidiese con la población no habría error de muestreo.

## 5.5. Tamaño de la muestra

Hay que encontrar un tamaño suficiente para estimaciones precisas pero sin que el análisis resulte tedioso por un exceso de muestra. En la fórmula del intervalo de confianza intervienen: IC (intervalo de confianza), x̅ (media), σ (desviación típica), n (tamaño de la muestra), zα/2 (valor crítico según el nivel de confianza) y ε (precisión o máximo error admisible).

Para elegir el tamaño:

- Debe especificarse la precisión
- Debe hallarse una ecuación que relacione el tamaño con la precisión deseada, estimando los parámetros poblacionales desconocidos que figuren en ella
- Debe comprobarse que el n elegido es aceptable con los recursos disponibles

**Marco normativo.** El **Reglamento (UE) 2017/625** (arts. 34, 35 y 36) establece los requisitos generales y específicos de la toma de muestras en los controles oficiales. A nivel nacional lo desarrolla el **Real Decreto 562/2025**, sobre controles y otras actividades oficiales en la cadena agroalimentaria, en vigor desde el 3 de julio de 2025, que derogó el **Real Decreto 1945/1983** en el control oficial de productos alimenticios (conserva vigencia residual en defensa del consumidor ajena a la seguridad alimentaria). Su Capítulo II regula la toma de muestras y el análisis: la cantidad debe ser suficiente para las determinaciones analíticas y, frente al antiguo esquema por triplicado, se toma una única muestra salvo que el operador anuncie que pedirá un análisis contradictorio.

El tamaño de la muestra, que determina la eficacia, rapidez y economicidad de la inspección, depende de:

- Grado de reiteración del control y experiencia del inspector
- Naturaleza de la mercancía
- Límites de tolerancia o nivel de calidad aceptable
- Niveles de inspección (intensidad reducida, normal o rigurosa)
- Volumen de la partida

Es proporcional al tamaño de la población, al nivel de confianza y a la varianza de la población, e inversamente proporcional a la precisión o máximo error admisible. También varía según el método de muestreo, que depende de la homogeneidad de la partida y del tamaño del lote. Hay normativa específica, como el **Real Decreto 1801/2008**, sobre cantidades nominales de productos envasados y control de su contenido efectivo.

# 6. CONCLUSIÓN

El muestreo sustenta toda la actividad analítica del Servicio de Inspección SOIVRE, porque la validez de cualquier resultado del laboratorio depende de la representatividad de la muestra. Un muestreo mal planificado invalida las conclusiones por exhaustivo que sea el análisis posterior.

Elegir bien el tipo de muestreo, calcular el tamaño adecuado y conocer los estimadores permite al inspector actuar con rigor técnico y objetividad, de modo que las decisiones sobre partidas completas se apoyen en una base estadística sólida y se concilie la exhaustividad del control con la agilidad del tráfico comercial.
