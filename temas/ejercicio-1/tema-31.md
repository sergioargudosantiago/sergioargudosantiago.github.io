# 1. INTRODUCCIÓN
- **Laboratorios SOIVRE**: parte importante de las labores del Servicio de Inspección SOIVRE
  - Acreditación nacida de la necesidad de ofrecer servicio de calidad a operadores del sector exterior, sobre todo exportadores
  - Acreditados según **UNE-EN ISO/IEC 17025:2017**
    - Regula el Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración
    - Fija requisitos para demostrar competencia en ensayos
- **ENAC**: asociación sin ánimo de lucro, único organismo con potestad pública para acreditar
  - **Real Decreto 1715/2010** y **Reglamento (CE) 765/2008**
  - Marca ENAC: declara públicamente el cumplimiento de requisitos, garantiza aceptación internacional
  - Respaldo de **Acuerdos Multilaterales de Reconocimiento**, más de 120 países
  - Organizaciones: **EA** y **Global ACI** (desde el 1 de enero de 2026, fusión de ILAC e IAF)
- **Red de Laboratorios SOIVRE**
  - **16 laboratorios** de ensayo en la red periférica, algunos acreditados
  - **Laboratorio Central** en Madrid, acreditado
  - Dependen de la Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior (Secretaría de Estado de Comercio, MECE)
  - Tendencia actual: especialización de cada laboratorio
- **Funciones del Laboratorio Central** (creado en 1989)
  - Coordinar y armonizar la red periférica y las aplicaciones informáticas
  - Planificar adquisiciones de instrumental, asesorar sobre reactivos, calibración y seguridad
  - Poner a punto metodologías y dar soporte analítico
  - Organizar ejercicios de intercomparación, seguir el programa de acreditación
  - Formación y apoyo documental
- **Esquema de la exposición**: muestreo físico y estadístico, población y muestra, tipos, fases, muestreo probabilístico, estimadores, media y total, precisión, tamaño de la muestra

# 2. CONNOTACIONES DEL MUESTREO FÍSICO Y DEL MUESTREO ESTADÍSTICO
- **Población** (colectivo, universo): conjunto de elementos con características comunes
- **Muestra**: parte de la población, necesaria por razones económicas, de rapidez o por destrucción del elemento
  - Válida si es **representativa**: mismas características en las variables estudiadas
- **Experimentos**
  - Deterministas: mismas causas, mismos efectos
  - Aleatorios: resultado incierto, dependen del azar, objeto de la estadística
- **Espacio muestral**: conjunto de sucesos elementales de un experimento aleatorio
  - Variable aleatoria definida: valores posibles más probabilidad asociada
- **Muestreo**: técnica de selección de una muestra de una población
  - **Estadístico** (probabilístico o aleatorio): selección mediante experimento aleatorio definido, probabilidad conocida de cada elemento, muestra representativa
  - **Físico**: una persona elige las unidades según su criterio, no aleatorio, a veces el único posible o aconsejable

# 3. POBLACIÓN Y MUESTRA. TIPOS DE MUESTREO
- **Población**: conjunto del que se quieren conclusiones, normalmente inaccesible en su totalidad
- **Muestra**: conjunto accesible y limitado sobre el que se hacen comprobaciones para generalizar
- **Muestreo aleatorio**: diseño básico, sin criterio personal, todos con igual probabilidad
- **Aleatorio simple**
  - Ideal con elementos homogéneos respecto a la variable
  - Se numeran los elementos y se extraen al azar (sistema mecánico, tabla de números aleatorios, programa)
  - **Con reemplazamiento**: el elemento vuelve y puede ser extraído de nuevo, análisis más simple
  - **Sin reemplazamiento**: no vuelve
  - Con población grande frente a la muestra, es indiferente
- **Aleatorio estratificado**
  - Población en grupos homogéneos (**estratos**), muestra aleatoria de cada uno (aleatorio simple)
  - Reduce la variación y da mayor precisión
  - Constante o proporcional, según estratos de igual tamaño o no
  - Se usa si la característica varía según el estrato
- **Por conglomerados**
  - Similar al estratificado, más económico
  - Elementos agrupados de forma natural en áreas, cada conglomerado se supone representativo
  - Se analizan todos sus elementos o se hace aleatorio simple
- **Aleatorio sistemático**
  - Elementos en listas, primero al azar, siguientes a intervalos fijos
- **De aceptación**
  - Control de calidad, inspección de lotes de materia prima, partes o productos terminados
  - Inspecciona una muestra para aceptar o rechazar todo el lote
- **Regla general**: usar la información previa para subdividir la población y asegurar la máxima representatividad

# 4. FASES O ETAPAS DEL MUESTREO
- **Objetivos y motivos**: definir población, caracteres a estudiar y objetivo del muestreo
- **Condiciones, recursos y limitaciones** (Plan de Trabajo)
  - Límites presupuestarios
  - Legislación
  - Oportunidad de fechas
- **Programa de operaciones**
  - Esquema lógico-matemático
  - Unidades de muestreo
  - Método de selección y estimación
  - Tamaño de la muestra
  - Recolección y medición de datos
  - Preparación del personal y equipo
- **Ejecución y recolección de datos**
  - Primero una o más **muestras piloto** que prueban todo el programa
- **Análisis y aprovechamiento de resultados**
  - Elaboración, codificación y cálculo de estimaciones con sus errores de muestreo
  - Comparar el **error máximo admisible** de la primera fase con el error calculado a posteriori

# 5. MUESTREO PROBABILÍSTICO: ESTIMADORES, ESTIMACIÓN DE LA MEDIA Y DEL TOTAL, PRECISIÓN DE LAS ESTIMACIONES Y TAMAÑO DE LA MUESTRA
- Selección con números aleatorios: elementos numerados de 1 a **N**, muestra de tamaño **n**
- Se explica el muestreo **con reemplazamiento** (cálculo más simple, casi igual en muestras grandes)
- Probabilidad de cada elemento: **1/N**
- **Función de probabilidad** (densidad si es continua): asocia a cada valor Xi su probabilidad
- **Función de distribución**: probabilidad de valores menores o iguales a Xi
- **Inferencia estadística**: métodos que deducen la distribución de la población y la relación entre variables a partir de la muestra

## 5.1. Inferencia estadística
- Según el conocimiento de la distribución
  - **Paramétrica**: forma conocida (Normal, Binomial, Poisson), parámetros desconocidos
  - **No paramétrica**: forma y parámetros desconocidos (mediana, estadísticos de orden)
- Según el estudio de los parámetros
  - **Estimación**: sin hipótesis previas, es la que se desarrolla en el tema
  - **Contraste de hipótesis**: se contrasta la verosimilitud de una hipótesis

## 5.2. Estimadores
- **Estimador**: función que estima el parámetro poblacional desde estadísticos muestrales. **Estimación**: valor para una muestra concreta
- Tipos de estimación
  - **Puntual**: valor concreto (la media)
  - **Por intervalos**: el valor está entre unos límites con cierta probabilidad, se pierde exactitud y se gana precisión
- Cualidades de un buen estimador
  - **Insesgado**: esperanza igual al parámetro
  - **Varianza mínima**: si converge al valor real al crecer la muestra es **consistente**
  - Ambas cualidades: **eficiente**
- Métodos
  - **Máxima Verosimilitud**: el valor muestral más probable, estimadores consistentes y eficientes
  - **Analógico**: el más sencillo, de lo particular a lo particular
  - **Mínimos Cuadrados**: minimiza la suma de cuadrados de los errores, usado en regresión

## 5.3. Estimación de la media y el total
- **Media**: media aritmética de la muestra, mejor cuanto mayor el número de mediciones
- **Total poblacional**: Total estimado = N × x̅
  - Más fiable con muestra mayor y menor variabilidad
- **Proporción**: elementos con solo dos valores, caso binomial
  - Proporción muestral (%) = (suma de elementos con la característica × 100) / n

## 5.4. Precisión de las estimaciones
- Conocer la precisión es tan importante como la estimación, se mide con **medidas de dispersión**
- **Varianza**: desviaciones respecto a la media al cuadrado, divididas por el tamaño de la muestra
  - Inconveniente: unidades al cuadrado
- **Desviación típica**: raíz cuadrada positiva de la varianza, mismas unidades que la variable
- Al aumentar **n** disminuye el error de muestreo, con muestra igual a la población no hay error

## 5.5. Tamaño de la muestra
- Tamaño suficiente para estimaciones precisas sin análisis excesivo
- Símbolos del intervalo de confianza: **IC**, media x̅, desviación típica σ, tamaño n, valor crítico zα/2, precisión o máximo error admisible ε
- Pasos
  - Especificar la precisión
  - Hallar ecuación que relacione n con la precisión, estimando parámetros desconocidos
  - Comprobar si n es aceptable con los recursos
- Marco normativo
  - **Reglamento (UE) 2017/625**, arts. 34, 35 y 36, toma de muestras en controles oficiales
  - **Real Decreto 562/2025**, controles oficiales en la cadena agroalimentaria, en vigor desde el 3 de julio de 2025
    - Deroga el **Real Decreto 1945/1983** en control oficial de alimentos, que conserva vigencia residual en defensa del consumidor
    - Capítulo II: toma de muestras y análisis, cantidad suficiente según las determinaciones
    - Una única muestra, salvo que el operador pida análisis contradictorio (antes, triplicado)
- Condicionantes del tamaño (eficacia, rapidez y economicidad de la inspección)
  - Grado de reiteración del control
  - Experiencia del inspector
  - Naturaleza de la mercancía
  - Límites de tolerancia o nivel de calidad aceptable
  - Niveles de inspección (reducida, normal, rigurosa)
  - Volumen de la partida
- Proporcional a tamaño de la población, nivel de confianza y varianza. Inversamente proporcional al máximo error admisible
- Varía según el método de muestreo, que depende de la homogeneidad de la partida y del tamaño del lote
- Normativa específica: **Real Decreto 1801/2008**, cantidades nominales de productos envasados y control de su contenido efectivo

# 6. CONCLUSIÓN
- El muestreo sustenta la actividad analítica del SOIVRE
  - La validez del resultado depende de la **representatividad** de la muestra
  - Un muestreo mal planificado invalida las conclusiones
- Tipo de muestreo, tamaño de muestra y estimadores permiten rigor técnico y objetividad en las decisiones sobre partidas
- Comercio exterior más volumétrico y diversificado: conciliar exhaustividad del control y agilidad del tráfico
