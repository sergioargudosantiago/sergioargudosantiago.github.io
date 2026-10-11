# 1. INTRODUCCIÓN
- **Red de Laboratorios SOIVRE**: 16 laboratorios de ensayo periféricos + **Laboratorio Central** en Madrid (Centro Analítico de Inspección y Control de la Calidad del Comercio Exterior, desde **1989**)
  - Integrados en la Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior (Secretaría de Estado de Comercio, MECE)
  - Especialización creciente de cada laboratorio
- **Acreditación ENAC** según **UNE-EN ISO/IEC 17025:2017**
  - Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración
  - Requisitos para demostrar competencia en ensayos
  - Motivo: servicio de calidad a operadores, sobre todo exportadores
- **ENAC**: asociación sin ánimo de lucro, único organismo con potestad pública para acreditar (**Real Decreto 1715/2010**, **Reglamento (CE) 765/2008**)
  - Marca ENAC: declara públicamente el cumplimiento, aceptación internacional
  - Acuerdos Multilaterales de Reconocimiento: más de **120 países**, en **EA** y **Global ACI** (fusión de ILAC e IAF desde el 1 de enero de 2026)
- Funciones del Laboratorio Central
  - Coordinar y armonizar la red y las aplicaciones informáticas
  - Planificar adquisiciones de instrumental, asesorar en reactivos, calibración y seguridad
  - Poner a punto metodologías, dar soporte analítico
  - Ejercicios de intercomparación, seguimiento de la acreditación, formación, apoyo documental
- Objeto del tema: errores en el análisis instrumental y técnicas para detectarlos

# 2. ERRORES EN ANÁLISIS INSTRUMENTAL: REGRESIÓN Y CORRELACIÓN
- Repetir una medida en las mismas condiciones no da siempre el mismo resultado
  - Causas: muestra, patrones, operaciones, equipos, personal
- **Error** = desviación entre valor analítico y valor real, indicador de la calidad del método
- Dos tipos: **sistemáticos** y **aleatorios**

## 2.1. Errores sistemáticos
- Inherentes al método, personal o instrumentos, por imperfecciones o malas prácticas
- Se pueden **corregir y detectar** en la puesta a punto
- Ligados a la **exactitud** (cercanía al valor real)
- Mismo signo y magnitud en mediciones del mismo tipo
- Causas
  - Poca recuperación en extracciones sólido/líquido o líquido/líquido (recuperación 60 %, error por defecto 40 %)
  - Calibración deficiente (patrón en mal estado o de baja pureza)
  - Blancos de muestra no detectados
  - Errores del personal, defectos del material volumétrico
  - Muestreo incorrecto, interferencias
- Detección y minimización
  - Calibrar con **patrones de referencia certificados**
  - Adición de **patrón interno**
  - **Muestras certificadas** de valor conocido, no existen para todos los análisis (alimentos: gran variabilidad de matrices)
  - Un método válido para una matriz puede no serlo para otra
- Clasificación
  - **Aditivos**: valor constante, independiente de la cantidad de analito
  - **Proporcionales**: varían con la cantidad de analito

## 2.2. Errores aleatorios
- Impredecibles, debidos al azar, **sin causa asignable**
- Origen instrumental
  - Distinta sensibilidad de los equipos, condiciones atmosféricas
  - Tiempo desde la última calibración
  - Fluctuaciones de la red eléctrica
- Origen en el personal
  - Atención y percepción visual
  - Modo de trabajo
- Persisten tras eliminar los sistemáticos
- Se definen por un rango alrededor de un valor central, tratamiento **estadístico**
- Ligados a la **precisión**: dispersión de mediciones repetidas, menor dispersión = mayor precisión
- Dos técnicas: **análisis de correlación** y **análisis de regresión**
  - Correlación responde
    - ¿Existe dependencia estocástica?
    - ¿Qué grado tiene?
  - **Dependencia estocástica**: Y = a + bX + e (e = error o residuo)
  - **Dependencia funcional**: Y = F(X) = a + bX
  - Regresión responde
    - ¿Qué tipo de dependencia hay?
    - ¿Pueden estimarse Y desde X y con qué precisión?
- **Línea de regresión**: se ajusta a la nube de puntos, su ecuación es la **ecuación de regresión**
- X: variable independiente (valores conocidos de las muestras) · Y: variable dependiente (valores obtenidos por el análisis)
- Los errores impiden el ajuste exacto a la línea

# 3. GRÁFICAS DE CALIBRACIÓN EN ANÁLISIS INSTRUMENTAL. RECTAS DE REGRESIÓN. COEFICIENTE DE CORRELACIÓN. ERRORES EN LA PENDIENTE Y ORDENADA EN EL ORIGEN DE LA RECTA DE REGRESIÓN

## 3.1. Calibración analítica
- Etapa que relaciona respuesta instrumental con concentración del analito, normalmente con modelo de recta, suele ser la etapa final del método
- Doble significado
  - **Calibración instrumental**: expresar el valor de un patrón en la magnitud que mide el instrumento (absorbancia frente a patrón de absorbancia conocida)
    - Las medidas instrumentales son relativas, permite estimar la incertidumbre
  - **Calibración analítica**: respuesta (área, absorbancia) frente a concentración
    - No imprescindible linealidad (métodos enzimáticos con curva)
    - Conviene trabajar en intervalos lineales, menor incertidumbre

## 3.2. Ecuación y recta de regresión
- Se conocen X de los **patrones**, construir la ecuación = construir la **gráfica de calibración**
  - Luego se calcula Y desconocida de una muestra a partir de la lectura
- Tipos de regresión
  - **Lineal simple**: Y = a + bX
  - **No lineal o curvilínea**: parabólica, exponencial, potencial
  - **Múltiple**: varias variables independientes (regresoras o predictoras) y una Y
- Si la recta no sirve
  - Función polinómica con ajuste mínimo cuadrático, o mejor reducir el rango al tramo lineal
  - Detectar la curvatura con **análisis de residuales**, eliminando valores extremos
- **Linealización** con logaritmos
  - Potencial Y = AXᵇ: log(Y) = log(A) + b·log(X), A = antilog(a)
  - Exponencial Y = ABˣ: log(Y) = log(A) + X·log(B), A = antilog(a), B = antilog(b)
  - Logarítmico Y = a + b·log(X): recta respecto a log(X) e Y
- **Cambio de variable**
  - Potenciometría: pH (ecuación de **Nernst**, relación logarítmica)
  - Espectrometría de absorción: absorbancia (**Ley de Lambert-Beer**)
- Dependencia lineal: puntos agrupados en el **diagrama de dispersión** o nube de puntos
  - Recta con carácter de línea media, lo más cerca posible de todos los puntos
- **Mínimos cuadrados**
  - Mínima suma de cuadrados de las distancias verticales (errores o residuos)
  - Pendiente b = Σ(xi - x̄)(yi - ȳ) / Σ(xi - x̄)²
  - Cuadrados siempre positivos, residuos positivos o negativos
- **Bondad de ajuste**: representatividad de la recta, la mejor recta no garantiza que sea buena
  - Dispersión pequeña = bondad alta
- **Coeficiente de determinación**: R2 = σxy2 / (σx2·σy2), entre 0 y 1
  - R² ≈ 1: sin residuos, dependencia funcional
  - R² ≈ 0: X no explica Y, modelo inadecuado o variables independientes
- Alto R² no garantiza buena predicción: los puntos pueden alejarse justo en el rango de interés
  - El poder predictivo se evalúa con **gráficos de residuales**

## 3.3. Coeficiente de correlación
- **Medidas de correlación**: cuantifican la dispersión respecto a la recta (errores accidentales)
- **Covarianza**: variación conjunta de X e Y
  - Σ(xi - x̄)(yi - ȳ) / n
  - Positiva = relación directa · negativa = inversa · independientes = aprox. 0
  - Depende de las unidades de medida
- **Coeficiente de Pearson (r)**: covarianza / (σx·σy)
  - **Adimensional**
  - Solo mide relación **lineal**
  - Independientes implica r = 0, pero r = 0 no implica independencia (relación no lineal)
  - Mismo signo que la covarianza
- Orientación: r de **0,9** permite buenos ajustes · **0,5** o menos, generalmente rechazados
- En mínimos cuadrados (regresión lineal simple): **r2 = R2**
- r entre **-1 y +1**: r = +1 correlación positiva perfecta · r = -1 negativa perfecta

## 3.4. Errores en la pendiente y ordenada en el origen
- Miden la **fiabilidad del ajuste**: significación de los parámetros de mínimos cuadrados
  - Permiten validar o no la recta
- **Desviación estándar (error estándar) de la pendiente** y **de la ordenada en el origen**
  - Se obtienen a partir de la varianza
  - Las incertidumbres derivan de los errores al medir X
  - La varianza refleja la desviación de Y respecto a la media, medida de la **precisión** del análisis

# 4. CÁLCULO DE UNA CONCENTRACIÓN
- **Calibración**: operaciones que establecen la relación entre valores indicados por el instrumento y valores conocidos de analito, patrón o magnitud
- Permite
  - Corregir errores sistemáticos del equipo (defectos de construcción, deterioro del sistema óptico)
  - Calcular la concentración de una muestra desde la relación respuesta-concentración
- Pasos
  - **Patrones**: cantidades conocidas de analito, alta calidad para evitar errores sistemáticos, sometidos al método para asociar señal a concentración
  - Relación lineal: Y = a + bX
    - Y respuesta medida · X concentración · a ordenada en el origen · b pendiente
  - Los puntos rodean la recta sin formarla: **mínimos cuadrados** (mínima suma de cuadrados de desviaciones) da pendiente y ordenada
  - Medir la señal Y0 de la muestra y obtener la concentración X0
    - **Gráficamente**: prolongar Y0 hasta la recta y leer X en el eje
    - **Directamente**: introducir Y0 en la ecuación y despejar X0
- Condiciones
  - Mínimo **3 patrones**, mejor más (más fiabilidad)
  - Muestra problema dentro del tramo definido por los patrones, si no, ampliar patrones
  - **No extrapolar** fuera del rango de X del ajuste
- Fiabilidad de la recta: desviación estándar de la pendiente y de la ordenada en el origen

# 5. CONCLUSIÓN
- Conocer los errores y las técnicas de regresión y correlación da fiabilidad a los resultados ante operadores y autoridades de terceros países
- Calibración correcta y validada estadísticamente: respuesta instrumental pasa a concentración con **trazabilidad**
- Dominar r, bondad de ajuste y errores de pendiente y ordenada: determinaciones reproducibles, defendibles ante reclamación, acordes con la acreditación ENAC
