# 1. INTRODUCCIÓN

Buena parte de las labores del SOIVRE se realiza en su Red de Laboratorios, algunos de ellos acreditados por la **ENAC** según la norma **UNE-EN ISO/IEC 17025:2017**. Esta norma regula el Sistema de Gestión de la Calidad de los laboratorios de ensayo y calibración y establece los requisitos para demostrar su competencia. La acreditación nació de la necesidad de ofrecer un servicio de calidad a los operadores, sobre todo a los exportadores.

- **ENAC**: asociación sin ánimo de lucro, único organismo con potestad pública para acreditar según el **Real Decreto 1715/2010** y el **Reglamento (CE) 765/2008**
- **Marca de ENAC**: declara públicamente el cumplimiento de los requisitos y garantiza su aceptación internacional, con el respaldo de los Acuerdos Multilaterales de Reconocimiento de más de 120 países
- **Organizaciones internacionales**: EA y Global ACI, resultante desde el 1 de enero de 2026 de la fusión de ILAC e IAF
- **Red de Laboratorios SOIVRE**: 16 laboratorios de ensayo en la red periférica, algunos acreditados, y un Laboratorio Central en Madrid, también acreditado, dentro de la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior, con una creciente especialización de cada laboratorio
- **Funciones del Laboratorio Central** (creado en 1989): coordinar y armonizar la red y las aplicaciones informáticas, gestionar adquisiciones de instrumental, asesorar sobre reactivos, calibración y seguridad, poner a punto metodologías, dar soporte analítico, organizar ejercicios de intercomparación, seguir el programa de acreditación, formar y apoyar documentalmente

# 2. ERRORES EN ANÁLISIS INSTRUMENTAL: REGRESIÓN Y CORRELACIÓN

Si se repite una medida en las mismas condiciones no se obtiene siempre el mismo resultado, porque la muestra, los patrones, las operaciones, los equipos y el personal introducen variabilidad. El **error en el análisis instrumental** es la desviación entre el valor obtenido y el valor real de la muestra. Se procura que sea mínimo porque indica la calidad del método. Se distinguen errores sistemáticos y aleatorios.

## 2.1. Errores sistemáticos

**Errores sistemáticos.** Son inherentes al método, al personal o a los instrumentos y se deben a imperfecciones del método, de los equipos o a malas prácticas. Son detectables y corregibles durante la puesta a punto, tienen el mismo signo y magnitud en mediciones del mismo tipo y se ligan a la **exactitud**, que indica cuán cerca del valor real está el valor medido.

- Causas: poca recuperación del analito en las extracciones (con una recuperación del 60 % todas las determinaciones arrastran un error por defecto del 40 %), calibración deficiente por un patrón en mal estado o impuro, blancos de muestra no detectados, errores del personal, defectos del material volumétrico, muestreo incorrecto e interferencias
- Para detectarlos y minimizarlos se calibran los equipos con patrones de referencia certificados y conviene trabajar con un patrón interno
- Lo ideal son muestras certificadas de valor conocido, pero no existen para todos los análisis, sobre todo en alimentos por la variabilidad de las matrices. Un método válido para sodio en leche puede no serlo en aceite, así que se recurre a otros procedimientos según el caso
- Clasificación: **errores aditivos**, de valor constante e independiente de la cantidad de analito, y **errores proporcionales**, que varían en proporción a ella

## 2.2. Errores aleatorios

**Errores aleatorios.** Son impredecibles, se deben al azar y persisten una vez eliminadas todas las causas de error sistemático. No tienen causa asignable, solo se definen por un rango de variación alrededor de un valor central y se tratan con procedimientos estadísticos. Se ligan a la **precisión**, que es la dispersión de los valores de mediciones repetidas: cuanto menor la dispersión, mayor la precisión.

- Origen en los instrumentos: distinta sensibilidad influida por las condiciones atmosféricas, tiempo desde la última calibración y fluctuaciones de la red eléctrica
- Origen en el personal: distinta atención y percepción visual y variaciones imperceptibles del modo de trabajo

Para obtener valores respuesta de las muestras se emplean dos técnicas.

- **Análisis de correlación**: responde si existe dependencia estocástica entre las variables y cuál es su grado. La dependencia estocástica es Y = a + bX + e, donde e es el error o residuo. La dependencia funcional es Y = F(X) = a + bX
- **Análisis de regresión**: responde cuál es el tipo de dependencia y si pueden estimarse los valores de Y a partir de los de X, y con qué precisión

Hay regresión cuando una línea, la **línea de regresión**, se ajusta a la nube de puntos, y su ecuación es la **ecuación de regresión**. La variable conocida de las muestras es la **variable independiente X** y la obtenida por el análisis es la **variable dependiente Y**. Los errores del análisis hacen que los puntos no se ajusten exactamente a la línea.

# 3. GRÁFICAS DE CALIBRACIÓN, RECTAS DE REGRESIÓN, COEFICIENTE DE CORRELACIÓN Y ERRORES EN LA PENDIENTE Y LA ORDENADA

Este apartado describe los gráficos de calibración, el coeficiente de correlación y las rectas de regresión.

## 3.1. Calibración analítica

La mayoría de los métodos analíticos incluyen una etapa de calibración, normalmente la final, que relaciona la respuesta instrumental con la propiedad buscada, generalmente la concentración del analito, mediante un modelo de línea recta. En química la calibración tiene un doble significado.

- **Calibración instrumental**: expresa el valor conocido de un patrón en la misma magnitud que mide el instrumento, por ejemplo la absorbancia frente a disoluciones de dicromato potásico. Interesa porque las medidas instrumentales son relativas y permite estimar la incertidumbre de cada medida
- **Calibración analítica**: relaciona la respuesta del instrumento (área, absorbancia) con las concentraciones del analito. La respuesta no tiene que ser lineal, como en los métodos enzimáticos, pero conviene trabajar en intervalos lineales porque disminuye la incertidumbre de las medidas finales

## 3.2. Ecuación y recta de regresión

Para calcular la ecuación de regresión se parte de valores conocidos de X en muestras llamadas **patrones**. Es el procedimiento de construcción de la gráfica de calibración, que permite después hallar el valor desconocido de una muestra a partir de la lectura del aparato.

- **Regresión lineal simple**: las variables siguen una línea recta, Y = a + bX
- **Regresión no lineal o curvilínea**: la relación es curva (parabólica, exponencial, potencial)
- **Regresión múltiple**: hay varias variables independientes (X1, X2, ..., Xp), llamadas regresoras o predictoras, y una sola dependiente Y

La más simple y común es la recta. Si una recta no sirve, se puede buscar una función polinómica de ajuste mínimo cuadrático, pero resulta más práctico reducir el rango de aplicación al intervalo lineal. La dificultad está en detectar dónde empieza la curvatura, para lo cual se analizan los residuos eliminando sucesivamente valores extremos mientras mejore la dispersión.

**Linealización.** Los modelos potencial y exponencial se reducen a una recta tomando logaritmos.

- **Modelo potencial** Y = AXᵇ: log(Y) = log(A) + b·log(X). Se ajusta una recta a log(Y) frente a log(X), b coincide con la pendiente y A = antilog(a)
- **Modelo exponencial** Y = ABˣ: log(Y) = log(A) + X·log(B). Se ajusta log(Y) frente a X, A = antilog(a) y B = antilog(b)
- **Modelo logarítmico** Y = a + b·log(X): es una recta referida a log(X) e Y

También se cambia de variable. En las potenciometrías se representa el pH en lugar de la concentración de hidrogeniones, por la ecuación de Nernst. En las espectrometrías de absorción la relación es lineal si se representa la absorbancia, por la Ley de Lambert-Beer.

**Mínimos cuadrados.** Por la nube de puntos pasan infinitas rectas y se elige la que actúa como línea media y pasa lo más cerca posible de todos los puntos. El método de los mínimos cuadrados elige la recta que hace mínima la suma de los cuadrados de las distancias verticales de los puntos a la recta, llamadas errores o residuos. La pendiente es el sumatorio del producto de las desviaciones de X e Y respecto a sus medias dividido por el sumatorio de los cuadrados de las desviaciones de X respecto a su media. El cuadrado es siempre positivo aunque los puntos queden por encima o por debajo de la recta.

**Bondad de ajuste.** Haber obtenido la mejor recta no garantiza que sea buena, por lo que debe acompañarse de una medida de su representatividad. Con dispersiones pequeñas la bondad de ajuste es alta y con dispersiones grandes es baja. El **coeficiente de determinación** R² = σxy² / (σx²·σy²) indica el porcentaje de variaciones explicado por el modelo y está entre 0 y 1.

- Si R² ≈ 1 no hay residuos y existe dependencia funcional. Cuanto más cerca de 1, mayor poder explicativo
- Si R² ≈ 0, X no explica las variaciones de Y, y el modelo es inadecuado o las variables son independientes

Un R² alto puede no servir para predecir, porque justo en el rango de interés los puntos pueden alejarse de la recta. El poder predictivo solo se evalúa observando los gráficos de residuales.

## 3.3. Coeficiente de correlación

Los datos que teóricamente siguen una relación lineal pueden apartarse de la recta calculada. Las medidas de correlación cuantifican esa dispersión y, con ella, la magnitud de los errores accidentales.

**Covarianza.** Mide la variación conjunta de dos variables, en el mismo sentido o en sentido contrario. Es el sumatorio del producto de las desviaciones de X e Y respecto a sus medias dividido por el número de parejas de valores. Si es positiva, la relación es directa, si es negativa, inversa, y si las variables son independientes vale aproximadamente 0.

**Coeficiente de correlación de Pearson (r).** La covarianza depende de las unidades de medida. Dividirla entre el producto de las desviaciones típicas de X e Y da una medida adimensional de la relación lineal. Tiene el signo de la covarianza.

- Solo analiza relaciones lineales. Si las variables son independientes, r = 0, pero r = 0 no implica independencia, solo que la relación no es lineal
- Orientación: r de 0,9 permite buenos ajustes y valores de 0,5 o inferiores se rechazan generalmente
- En regresión lineal simple por mínimos cuadrados, r² = R², por lo que r está acotado entre −1 y +1. Con r = +1 la correlación positiva es perfecta y con r = −1, negativa perfecta

## 3.4. Errores en la pendiente y ordenada en el origen

Los errores de la pendiente y de la ordenada en el origen miden la fiabilidad del ajuste y la significación de los parámetros de mínimos cuadrados, lo que permite validar o no la recta obtenida. La desviación estándar (error estándar) de la pendiente y la de la ordenada se calculan a partir de la varianza de la variable independiente, pues sus incertidumbres derivan de los errores al medir X. Esa varianza refleja la desviación de los valores de Y respecto a la media y es una medida de la precisión del análisis.

# 4. CÁLCULO DE UNA CONCENTRACIÓN

**Calibración.** Es el conjunto de operaciones que establecen la relación entre los valores indicados por el instrumento y los valores conocidos de analito, patrón o magnitud medida. Permite corregir los errores sistemáticos del equipo, como defectos de construcción o deterioro del sistema óptico, y calcular la concentración de una muestra a partir de la relación entre respuesta y concentración.

Los pasos son los siguientes.

- Conseguir **patrones** de cantidades conocidas de analito y de elevada calidad, para evitar errores sistemáticos, y someterlos al método analítico para asociar una señal a cada concentración
- Con relación lineal, la ecuación es Y = a + bX, donde Y es la respuesta medida, X la concentración del analito, a la ordenada en el origen y b la pendiente
- Por los errores analíticos, los puntos se disponen alrededor de una recta sin formarla, así que se aplica el método de mínimos cuadrados, que hace mínima la suma de los cuadrados de las desviaciones de los puntos a la recta y da la pendiente y la ordenada
- Se mide la señal de la muestra problema Y0 y se obtiene su concentración X0 **gráficamente**, prolongando Y0 hasta la recta y leyendo X en el eje, o **directamente**, introduciendo Y0 en la ecuación y despejando X0

Para trazar la recta hacen falta **al menos 3 patrones** distintos, y cuantos más, mayor fiabilidad. La muestra problema debe caer dentro del tramo definido por los patrones, y si no, hay que ampliarlos. No deben extrapolarse resultados fuera del rango de X usado en el ajuste. La fiabilidad de la recta se conoce con la desviación estándar de la pendiente y la de la ordenada en el origen.

# 5. CONCLUSIÓN

Conocer los errores del análisis instrumental y las técnicas de regresión y correlación es imprescindible para que los resultados de los laboratorios SOIVRE tengan la fiabilidad que exigen los operadores y las autoridades de terceros países. La calibración analítica, bien ejecutada y validada estadísticamente, convierte una respuesta instrumental en un dato de concentración con trazabilidad. Dominar el coeficiente de correlación, la bondad de ajuste y los errores de pendiente y ordenada garantiza determinaciones reproducibles, defendibles ante reclamaciones y coherentes con la acreditación ENAC.
