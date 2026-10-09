# 1. INTRODUCCIÓN

- Los **Laboratorios del SOIVRE** están acreditados según la Norma **UNE-EN ISO/IEC 17025:2017**, que regula el Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración y establece los requisitos de competencia técnica
- La **ENAC** es el único organismo con potestad pública para otorgar acreditaciones en España, según el **Real Decreto 1715/2010** y el **Reglamento (CE) 765/2008**
- Las Marcas de ENAC cuentan con el respaldo de los Acuerdos Multilaterales de Reconocimiento, gestionados por **EA** (European Cooperation for Accreditation) y **Global ACI** (Global Accreditation Cooperation Incorporated), resultante de la fusión de **ILAC** e **IAF**
- La **Red de Laboratorios SOIVRE** consta de **16 laboratorios** de ensayo periféricos y un **Laboratorio Central** en Madrid, encuadrados en la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior
- El **Laboratorio Central SOIVRE** (creado en **1989**) coordina la red periférica, gestiona adquisiciones y reactivos, desarrolla nuevas metodologías, organiza ejercicios de intercomparación y coordina el programa de acreditación y la formación

# 2. CONNOTACIONES DEL MUESTREO FÍSICO Y DEL MUESTREO ESTADÍSTICO

- La estadística estudia poblaciones o universos, es decir, conjuntos de elementos con características comunes
- La **muestra** es la parte de la población que se examina cuando no es posible o conveniente estudiarla en su totalidad, y debe ser representativa
- Existen dos tipos de experimentos
  - **Deterministas**: las mismas causas producen los mismos efectos
  - **Aleatorios**: su resultado es incierto o depende del azar, y son objeto de estudio de la estadística
- El **espacio muestral** es el conjunto de todos los sucesos elementales o posibles resultados de un experimento aleatorio
- El **muestreo** es la técnica para seleccionar una muestra a partir de una población, y puede ser
  - **Muestreo estadístico o probabilístico**: la selección se realiza mediante un experimento aleatorio previamente definido, de forma que se conoce la probabilidad de cada elemento de ser seleccionado
  - **Muestreo físico**: la selección la realiza una persona según su criterio, sin aleatoriedad

# 3. POBLACIÓN Y MUESTRA. TIPOS DE MUESTREO

- **Población**: conjunto de elementos del que se pretenden obtener conclusiones, generalmente inaccesible en su totalidad
- **Muestra**: conjunto accesible y limitado sobre el que se realizan comprobaciones para generalizar conclusiones a la población
- Tipos de muestreo aleatorio
  - **Muestreo aleatorio simple**: cada elemento de la población tiene la misma probabilidad de ser elegido, puede realizarse con o sin reemplazamiento
  - **Muestreo aleatorio estratificado**: clasifica la población en estratos homogéneos y selecciona una muestra aleatoria de cada uno, puede ser constante o proporcional
  - **Muestreo por conglomerados**: aprovecha agrupaciones naturales de la población, es más económico que el estratificado
  - **Muestreo aleatorio sistemático**: se aplica sobre poblaciones ordenadas en listas, eligiendo el primer elemento al azar y los siguientes a intervalos fijos
  - **Muestreo de aceptación**: propio del control de calidad, inspecciona lotes para aceptarlos o rechazarlos según un nivel de calidad y confianza determinados
- Regla general: cualquier información previa debe utilizarse para subdividir la población y aumentar la representatividad de la muestra

# 4. FASES O ETAPAS DEL MUESTREO

- **Objetivos y motivos**: definición de la población, caracteres a estudiar y objetivo del muestreo
- **Condiciones, recursos y limitaciones** (Plan de Trabajo)
  - Límites presupuestarios
  - Legislación
  - Oportunidad de fechas
- **Programa de operaciones**
  - Diseño del esquema lógico-matemático
  - Unidades de muestreo
  - Método de selección y estimación
  - Tamaño de la muestra
  - Métodos de recolección y medición de datos
  - Preparación del personal y equipo
- **Ejecución del programa y recolección de datos**, con muestras piloto previas
- **Análisis y aprovechamiento de los resultados**, comparando el error máximo admisible con el error de muestreo calculado a posteriori

# 5. MUESTREO PROBABILÍSTICO: ESTIMADORES, ESTIMACIÓN DE LA MEDIA Y DEL TOTAL, PRECISIÓN DE LAS ESTIMACIONES Y TAMAÑO DE LA MUESTRA

## 5.1. Inferencia estadística

- La **inferencia estadística** deduce cómo se distribuye la población y la relación entre variables a partir de la información de la muestra
- Según el conocimiento de la distribución
  - **Paramétrica**: se conoce la forma de la distribución pero no sus parámetros
  - **No paramétrica**: se desconocen forma y parámetros
- Según el enfoque
  - **Estimación**: da estimaciones de los parámetros desconocidos sin hipótesis previas
  - **Contraste de hipótesis**: plantea hipótesis sobre los parámetros y comprueba su verosimilitud

## 5.2. Estimadores

- Un **estimador** es la función que permite estimar el parámetro poblacional a partir de la muestra, el valor obtenido se denomina estimación
- La estimación puede ser
  - **Puntual**: da un valor concreto
  - **Por intervalos**: indica, con determinada probabilidad, el intervalo donde se encuentra el parámetro, se pierde exactitud y se gana precisión
- Un buen estimador debe ser **insesgado** (su esperanza coincide con el parámetro) y tener **varianza mínima** (consistente), si cumple ambas es **eficiente**
- Métodos de estimación
  - **Máxima verosimilitud**: toma como parámetro el valor de la muestra más probable, produce estimadores consistentes y eficientes
  - **Método analógico**: compara fenómenos parecidos pero no idénticos para inferir causas
  - **Mínimos cuadrados**: minimiza la suma de cuadrados de los errores, muy usado en modelos de regresión

## 5.3. Estimación de la media y el total

- La **media** se estima mediante la media aritmética de los valores muestrales
- El **total poblacional** se estima como el producto de la media muestral por el tamaño de la población (N × x̅)
- Cuando conviene hablar de proporción, se estima dividiendo los éxitos entre el tamaño de la muestra
- La **proporción muestral** se expresa en porcentaje

## 5.4. Precisión de las estimaciones

- La precisión se cuantifica mediante medidas de dispersión
- La **varianza** mide la magnitud de las desviaciones de los valores muestrales respecto a la media, elevadas al cuadrado
- La **desviación típica** es la raíz cuadrada de la varianza, se expresa en las mismas unidades que la variable, por lo que es más apta como medida de dispersión
- Al aumentar el tamaño de la muestra disminuye la variabilidad o error de muestreo

## 5.5. Tamaño de la muestra

- El tamaño de muestra debe ser suficientemente preciso sin resultar excesivo para el análisis
- Elementos de la fórmula del intervalo de confianza: IC (intervalo de confianza), x̅ (media), σ (desviación típica), n (tamaño de la muestra), zα/2 (valor crítico según nivel de confianza), ε (precisión o error máximo admisible)
- El **Reglamento (UE) 2017/625**, en sus artículos 34, 35 y 36, establece los requisitos generales y específicos de la toma de muestras en los controles oficiales, siendo el marco de referencia comunitario
- A nivel nacional, el **Real Decreto 562/2025**, sobre los controles y otras actividades oficiales de la cadena agroalimentaria, desarrolla ese marco
- El Real Decreto 562/2025 dedica su Capítulo II a la toma de muestras y al análisis, y sustituye la antigua toma por triplicado por una única muestra, salvo que el operador solicite análisis contradictorio
- El tamaño de la muestra depende de
  - Grado de reiteración del control
  - Experiencia del inspector
  - Naturaleza de la mercancía
  - Límites de tolerancia o nivel de calidad aceptable
  - Niveles de inspección (reducida, normal o rigurosa)
  - Volumen de la partida
- El tamaño de la muestra es proporcional al tamaño de la población, al nivel de confianza y a la varianza de la población, e inversamente proporcional a la precisión o error máximo admisible
- El método de muestreo depende también de la homogeneidad de la partida y del tamaño del lote
- El **Real Decreto 1801/2008** establece normas sobre cantidades nominales de productos envasados y control de su contenido efectivo

# 6. CONCLUSIÓN

- El muestreo constituye la base de toda la actividad analítica del Servicio de Inspección SOIVRE, ya que la validez del resultado de laboratorio depende de la representatividad de la muestra
- Un muestreo mal planificado invalida las conclusiones, por exhaustivo que sea el análisis posterior
- La correcta selección del tipo de muestreo, del tamaño de muestra y el conocimiento de los estimadores estadísticos permiten al inspector actuar con rigor técnico y objetividad en un comercio exterior cada vez más volumétrico y diversificado
