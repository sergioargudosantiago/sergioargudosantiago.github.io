# 1. INTRODUCCIÓN

- Parte de la labor del Servicio de Inspección **SOIVRE** se realiza en la **Red de Laboratorios del SOIVRE**, algunos acreditados por la **Entidad Nacional de Acreditación (ENAC)**.
- Los Laboratorios SOIVRE están acreditados según la Norma **UNE-EN ISO/IEC 17025:2017**, que:
  - Regula la implantación de un Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración.
  - Establece los requisitos para demostrar la competencia en la realización de ensayos.
- La **ENAC** es una asociación sin ánimo de lucro, declarada por el **Real Decreto 1715/2010** como único organismo con potestad pública para otorgar acreditaciones conforme al **Reglamento (CE) 765/2008**.
- La marca de ENAC es la garantía de cumplimiento de los requisitos de acreditación y de su aceptación internacional.
- Las Marcas de ENAC (ensayo, inspección, calibración, verificación medioambiental, certificación, intercomparaciones, verificación de emisiones) cuentan con el respaldo de Acuerdos Multilaterales de Reconocimiento, suscritos por más de **120 países**, gestionados por **EA (European Cooperation for Accreditation)** y **Global Accreditation Cooperation Incorporated (Global ACI)**, resultante desde el 1 de enero de 2026 de la fusión de **ILAC** e **IAF**.
- La Red de Laboratorios SOIVRE consta de **16 laboratorios de ensayo** en red periférica (Pontevedra, Bizkaia, Navarra, Girona, Barcelona, Valencia, Alicante, Murcia, Almería, Málaga, Sevilla, Cádiz, Huelva, Santa Cruz de Tenerife, Las Palmas y Madrid-Barajas) y un **Laboratorio Central** en Madrid, también acreditado, encuadrados en la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior de la Secretaría de Estado de Comercio (MECE).
- Se observa una progresiva especialización de cada laboratorio en un campo determinado.
- El **Laboratorio Central SOIVRE** (Centro Analítico de Inspección y Control de la Calidad del Comercio Exterior), creado en **1989**, tiene entre sus funciones principales:
  - Coordinar y armonizar la red periférica de laboratorios.
  - Coordinar las aplicaciones informáticas y planificar adquisiciones de material instrumental.
  - Asesorar sobre reactivos, calibración y seguridad.
  - Poner a punto nuevas metodologías y dar soporte analítico.
  - Planificar ejercicios de intercomparación y coordinar el programa de acreditación.
  - Coordinar actividades formativas y el apoyo documental.

# 2. ERRORES EN ANÁLISIS INSTRUMENTAL: REGRESIÓN Y CORRELACIÓN

- El análisis de una muestra está influido por factores no siempre controlables, por lo que medidas repetidas en las mismas condiciones no dan siempre el mismo resultado.
- El **Error en el análisis instrumental** es el grado de desviación entre el valor obtenido y el valor real, e indica la calidad del método. Se distinguen **errores sistemáticos** y **errores aleatorios**.

## 2.1. Errores sistemáticos

- Son inherentes al método, al personal o a los instrumentos, por imperfecciones o malas prácticas. Se detectan y corrigen durante la puesta a punto del método y están ligados a la **exactitud**.
- Tienen el mismo signo y magnitud para mediciones del mismo tipo. Causas frecuentes:
  - Poca recuperación de la sustancia en extracciones sólido/líquido o líquido/líquido.
  - Calibración deficiente, por ejemplo con patrones en mal estado o de baja pureza.
  - Blancos de muestra no detectados.
  - Pequeños errores del personal, defectos en el material o muestreo incorrecto.
  - Interferencia de las sustancias a analizar.
- Se minimizan calibrando con patrones de referencia certificados, recomendándose el uso de patrón interno y, cuando existen, muestras certificadas de valor conocido.
- Se clasifican en:
  - **Errores aditivos**: valor constante, independiente de la magnitud del analito.
  - **Errores proporcionales**: varían proporcionalmente a dicha magnitud.

## 2.2. Errores aleatorios

- Son impredecibles y debidos al azar. Pueden originarse en los instrumentos (distinta sensibilidad, descalibración, fluctuaciones eléctricas) o en el personal (atención, percepción visual, modo de trabajo).
- Persisten aunque se eliminen los errores sistemáticos, no tienen causa asignable y se tratan mediante procedimientos estadísticos. Están ligados a la **precisión** del método.

## 2.3. Regresión y correlación

- El **Análisis de Correlación** responde a si existe dependencia estocástica entre variables (**Y = a + bX + e**) y a su grado.
- El **Análisis de Regresión** responde al tipo de dependencia y a si pueden estimarse valores de Y a partir de X, y con qué precisión.
- Existe **regresión** cuando una línea (línea de regresión) se ajusta a la nube de puntos, denominándose **ecuación de regresión** a la que describe esa relación.
- La variable conocida de los patrones es la **variable independiente X**, y la obtenida por el análisis es la **variable dependiente Y**.

# 3. GRÁFICAS DE CALIBRACIÓN, RECTAS DE REGRESIÓN Y COEFICIENTE DE CORRELACIÓN

## 3.1. Calibración analítica

- La mayoría de métodos analíticos incluyen una etapa de **calibración analítica**, que relaciona la respuesta instrumental con la concentración del analito, normalmente mediante una recta.
- En medidas químicas, la calibración tiene doble significado:
  - **Calibración instrumental**: expresa el valor de un patrón en la misma magnitud que mide el instrumento, permitiendo estimar la incertidumbre de cada medida.
  - **Calibración analítica**: relaciona la respuesta del instrumento con concentraciones de un analito, siendo preferible trabajar en intervalos lineales para reducir la incertidumbre.

## 3.2. Ecuación y recta de regresión

- Se calcula a partir de valores conocidos de X en muestras denominadas **patrones**, obteniendo la gráfica de calibración.
- Tipos de ecuaciones de regresión:
  - **Regresión Lineal Simple**: Y = a + bX.
  - **Regresión no Lineal o Curvilínea**: parabólica, exponencial, potencial, etc.
  - **Regresión Múltiple**: varias variables independientes (regresoras) y una dependiente.
- Cuando la recta no ajusta bien, se recurre a funciones polinómicas o a reducir el rango de concentraciones al tramo lineal.
- La **linealización** permite convertir modelos potenciales y exponenciales en lineales mediante logaritmos:
  - **Modelo Potencial** (Y = AXᵇ): log(Y) = log(A) + b·log(X).
  - **Modelo Exponencial** (Y = ABˣ): log(Y) = log(A) + X·log(B).
  - **Modelo Logarítmico**: Y = a + b·log(X).
- También se recurre a cambios de variable, como el pH en potenciometría o la absorbancia en espectrometría, según la **Ley de Lambert-Beer**.
- La recta se obtiene por el **método de los mínimos cuadrados**, minimizando la suma de los cuadrados de las distancias verticales (errores o residuos) de los puntos a la recta.

## 3.3. Bondad de ajuste y coeficiente de determinación

- La recta de regresión, al tener carácter de línea media, debe acompañarse de una medida de su representatividad: la **Bondad de Ajuste**.
- El **Coeficiente de Determinación (R²)** indica el porcentaje de variación explicada por el modelo, con valores entre 0 y 1.
  - Si R² se aproxima a 1, mayor dependencia funcional y poder explicativo.
  - Si R² se aproxima a 0, el modelo es inadecuado o las variables son independientes.
- Un alto R² no garantiza buena capacidad predictiva, que solo puede evaluarse con el análisis de los gráficos de residuales.

## 3.4. Coeficiente de correlación

- La **Covarianza** mide la variación conjunta de dos variables: positiva indica relación directa, negativa relación inversa, y próxima a 0 indica independencia.
- El **Coeficiente de correlación de Pearson (r)** es una medida adimensional que resulta de dividir la covarianza entre el producto de las desviaciones típicas de X e Y.
- Solo mide relaciones de tipo lineal: si r = 0 no implica independencia, solo ausencia de relación lineal.
- Orientativamente, coeficientes de **0,9** permiten buenos ajustes mediante recta de regresión, mientras que valores de **0,5** o inferiores suelen rechazarse.
- En regresión lineal simple por mínimos cuadrados se cumple **r² = R²**, y r está acotado entre **-1 y +1**, siendo +1 correlación positiva perfecta y -1 negativa perfecta.

## 3.5. Errores en la pendiente y ordenada en el origen

- Permiten conocer la fiabilidad del ajuste y decidir sobre la validación de los resultados.
- La desviación estándar de la pendiente y de la ordenada en el origen se obtienen a partir de la varianza de la variable independiente, reflejando la precisión del análisis.

# 4. CÁLCULO DE UNA CONCENTRACIÓN

- La **calibración** es el conjunto de operaciones que relacionan los valores indicados por el instrumento con los valores conocidos de analito, patrón o magnitud medida.
- El cálculo de una concentración se basa en analizar patrones de valor conocido para establecer, mediante calibrado, la relación entre respuesta instrumental y concentración.
- Este procedimiento permite:
  - Corregir errores sistemáticos del equipo, como defectos de construcción o deterioro óptico.
  - Calcular la concentración de analito de una muestra a partir de la relación matemática del calibrado.
- Se requieren patrones de elevada calidad para evitar errores sistemáticos, sometidos al método analítico correspondiente.
- En la situación más común, la relación entre concentración y señal es lineal (**Y = a + bX**), donde:
  - Y es la respuesta medida.
  - X son las concentraciones del analito.
  - a es la ordenada en el origen.
  - b es la pendiente.
- La recta se ajusta por **mínimos cuadrados**, minimizando la suma de los cuadrados de las desviaciones.
- El valor de la concentración problema X0 se obtiene:
  - **Gráficamente**, extrapolando el valor de X0 a partir de la respuesta Y0.
  - **Directamente**, despejando X0 en la ecuación conociendo Y0, a y b.
- Para una recta de calibración se necesitan como mínimo **3 puntos** (3 patrones distintos), y cuantos más, mayor fiabilidad.
- La muestra problema debe caer dentro del tramo definido por los patrones, sin extrapolar más allá del rango de X utilizado para ajustar el modelo.
- La fiabilidad de la recta se valora mediante la desviación estándar de la pendiente y la de la ordenada en el origen.

# 5. CONCLUSIÓN

- El conocimiento de los errores del análisis instrumental y de las técnicas de regresión y correlación es imprescindible para que los resultados de los laboratorios SOIVRE tengan la fiabilidad exigida por operadores comerciales y autoridades de terceros países.
- La calibración analítica, correctamente ejecutada y validada estadísticamente, transforma una respuesta instrumental en un dato de concentración con significado analítico y trazabilidad demostrada.
- Dominar el coeficiente de correlación, la bondad de ajuste y los errores de pendiente y ordenada en el origen garantiza determinaciones reproducibles, defendibles ante reclamaciones y coherentes con la acreditación ENAC de la Red de Laboratorios SOIVRE.
