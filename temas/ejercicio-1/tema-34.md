# 1. INTRODUCCIÓN

La Red de Laboratorios del SOIVRE consta de 16 laboratorios de ensayo en la red periférica, algunos acreditados, y un Laboratorio Central en Madrid (creado en 1989), también acreditado. Los acredita la **ENAC** según la norma **UNE-EN ISO/IEC 17025:2017**, que regula el sistema de gestión de la calidad de los laboratorios de ensayo y calibración y los requisitos para demostrar su competencia. La ENAC es el único organismo con potestad pública para acreditar (**Real Decreto 1715/2010** y **Reglamento (CE) 765/2008**), y su marca cuenta con el respaldo de acuerdos multilaterales de reconocimiento suscritos por más de 120 países.

**Control de calidad.** Conjunto de medidas necesarias para observar y conservar la fiabilidad de un método analítico. Puede ser interno o intralaboratorio (evaluación diaria de las determinaciones rutinarias) y externo o interlaboratorio (pruebas de intercomparación).

El control interno tiene tres fases:

- **Preanalítica**: toma de muestras y su tratamiento previo
- **Analítica**: validación de métodos, muestras de control y gráficos de control
- **Postanalítica**: procesamiento estadístico y archivo de resultados

# 2. VALIDACIÓN DE MÉTODOS

**Validación.** Obtención de pruebas documentadas de que un método es lo bastante fiable como para dar resultados con una incertidumbre adecuada al uso previsto, sin errores sistemáticos, en los rangos y el tipo de muestra ensayados.

Un método debe validarse cuando se desarrolla uno nuevo, se revisa uno establecido, se amplían o modifican métodos normalizados, el control de calidad indica que el método cambia con el tiempo, un método establecido se usa en otro laboratorio o se quiere comparar con otro método.

Las fases de la validación son:

- **Protocolo de validación**: define el sistema, los parámetros a validar y los criterios de aceptación
- **Realización**: se ejecuta el método recogiendo todos los datos primarios
- **Evaluación de resultados**: frente a los límites fijados en el procedimiento normalizado de trabajo (PNT), y si difieren de lo esperado se justifican los cambios en el protocolo
- **Informes técnicos**: calibración y cualificación de instrumentos, método definitivo, resultados con datos primarios y criterios de aceptación y conclusiones
- **Certificado de validación**: lo firman el Jefe de Servicio de Laboratorio (A1) o el Jefe de Sección de Laboratorio (A2)
- **Archivo** de todos los documentos generados

La **revalidación**, total o parcial, se exige cuando cambian de forma significativa las condiciones originales (aparatos, materiales, muestra, técnica) o cuando el método lleva mucho tiempo utilizándose.

# 3. CRITERIOS FUNDAMENTALES DE VALIDACIÓN

Los métodos deben presentar tres tipos de características de funcionamiento:

- **Fiabilidad**: capacidad de mantener los criterios de validación a lo largo del tiempo, con cinco criterios, no siempre aplicables
  - Proporcionalidad entre concentración y respuesta: linealidad, intervalo y sensibilidad
  - Dispersión alrededor de un valor central: precisión, repetibilidad, reproducibilidad y robustez
  - Diferencia entre valor hallado y valor verdadero: exactitud y recuperación
  - Cantidad mínima de analito para un resultado significativo: sensibilidad, límite de detección y de cuantificación
  - Determinación sin interferencias: selectividad y especificidad
- **Practicabilidad**: si el método es realizable en la práctica (tiempo, coste, tamaño de muestra, personal, seguridad, equipo)
- **Idoneidad**: parámetros que garantizan que el sistema responde en el momento del análisis a lo fijado en la validación, normalmente la verificación del buen funcionamiento de los instrumentos

## 3.1. Exactitud

**Exactitud.** Grado de concordancia entre el resultado experimental y el valor de referencia aceptado (valor real). Debe evaluarse en puntos suficientes para asegurarla en todo el rango de medida y presupone disponer de un valor de referencia.

El valor de referencia puede provenir de:

- **Material de referencia certificado o patrón químico**: el test debe tener en cuenta la incertidumbre del valor certificado y la repetibilidad del método
- **Método alternativo normalizado**: la muestra debe tener homogeneidad conocida y valor de la propiedad con su incertidumbre, por lo que el método debe estar evaluado con rigor
- **Ensayo de intercomparación**: su precisión debe ser aceptable y estar calculada con datos reales del experimento
- **Método de adiciones**: a falta de lo anterior, se compara la diferencia entre muestra y muestra adicionada con el valor teórico de la adición

Se determina de dos formas. Estadísticamente, con el test t de Student, para ver si la media medida y el valor verdadero no difieren a una probabilidad dada: texp = (X̅ − µ) × √n / Sr, donde X̅ es la media medida, µ el valor verdadero, n el número de repeticiones y Sr la desviación estándar. Si texp es menor que la t teórica tabulada, no hay diferencias significativas y el método es trazable al material de referencia. Con el porcentaje de recuperación se calcula de forma análoga. Matemáticamente, se expresa como porcentaje de recuperación del analito presente en la muestra.

## 3.2. Precisión

**Precisión.** Grado de concordancia entre los resultados de aplicar repetidas veces el procedimiento bajo condiciones establecidas.

- **Repetibilidad**: mismas condiciones (operador, laboratorio, aparato, corto intervalo de tiempo y misma muestra)
- **Reproducibilidad**: misma muestra con condiciones distintas (analista, días, aparatos)

Se compara la reproducibilidad con la repetibilidad según su diferencia:

- Por debajo del 10 %: reproducibilidad aceptable y condiciones compatibles
- Entre el 10 % y el 30 %: puede ser aceptable según la importancia de la aplicación y los costes de medición, calibración o reparación
- Por encima del 30 %: debe mejorarse el sistema de medición

También se expresa como **coeficiente de variación**, adimensional y útil para comparar medidas en distintos rangos o unidades: C.V. = (Sx / X̅) × 100, donde Sx es la desviación estándar y X̅ la media. La precisión contribuye a la incertidumbre del ensayo, por lo que debe conocerse y estar por debajo de un nivel fijado según el uso de las medidas.

## 3.3. Linealidad y proporcionalidad

**Linealidad.** Capacidad de un método instrumental de dar resultados linealmente proporcionales a la concentración de analito dentro de un rango. Se ensaya con soluciones patrón o con muestras de concentración creciente.

Las fases del ensayo son:

- Comprobar con un tanteo previo que el intervalo lineal del instrumento es más amplio que el que se va a estudiar
- Preparar entre 3 y 10 patrones de concentración creciente
- Analizar al menos por duplicado (por triplicado en cromatografía, salvo patrón interno)
- Trazar la curva de calibrado por mínimos cuadrados. Si la recta no pasa por el origen, indica un error sistemático
- Tratamiento estadístico con el coeficiente de correlación y los límites de confianza de la recta (anchura de las hipérbolas)

## 3.4. Sensibilidad

**Sensibilidad.** Capacidad de un método de registrar ligeras variaciones de concentración.

- **De calibrado**: pendiente de la recta de calibración, es decir, señal por unidad de concentración
- **Analítica**: sensibilidad de calibrado dividida por la desviación estándar de la respuesta

Dos técnicas con la misma sensibilidad de calibrado tienen mayor sensibilidad analítica la más precisa.

## 3.5. Límite de detección y Límite de cuantificación

- **Límite de detección**: menor concentración de analito que puede detectarse, no necesariamente cuantificarse. Se determina con análisis repetidos de un blanco y corresponde a la respuesta media del blanco más 3 desviaciones típicas
- **Límite de cuantificación**: menor concentración que puede determinarse con precisión y exactitud aceptables. Es mayor que el de detección, se establece con una muestra o material de referencia apropiado y suele corresponder al punto inferior de la curva de calibración (sin el blanco), por lo que no se determina por extrapolación

El límite de detección es la mínima cantidad detectable y el de cuantificación, la mínima medible. Su determinación es laboriosa y se emplean la relación señal/ruido, la menor cantidad detectable, el análisis repetido del blanco, la extrapolación a concentración cero de muestras de baja concentración o la ordenada en el origen expresada en unidades de concentración.

## 3.6. Selectividad y Especificidad

**Selectividad.** Capacidad de un método de dar resultados correctos para un analito en una muestra compleja, sin interferencia de impurezas, productos de degradación o componentes de la matriz. Se refiere sobre todo a los métodos químicos y es un parámetro a considerar al fijar el alcance del método.

Un método perfectamente selectivo para un analito o grupo de analitos se dice **específico**.

# 4. CÁLCULO DE LA INCERTIDUMBRE DEL MÉTODO

Al repetir una medida en las mismas condiciones no siempre se obtiene el mismo resultado, por la variabilidad de la muestra, los patrones, las operaciones, los equipos y el personal.

**Incertidumbre.** Estimación unida al resultado de un ensayo que caracteriza el intervalo en el que se espera que esté el valor verdadero. Se expresa como Valor +/− Incertidumbre y debe considerar todas las fuentes de error del proceso de medida.

Se distinguen dos tipos de errores:

- **Errores aleatorios o tipo A**: causas accidentales e impredecibles, ligadas a la precisión (distinta sensibilidad de equipos, derivas desde la última calibración)
- **Errores sistemáticos o tipo B**: ligados a la exactitud, por imperfecciones del método (patrones, curvas de calibración), de los equipos, malas prácticas, muestreo incorrecto o patrón en mal estado o de baja pureza

## 4.1. Estimación de los errores tipo A

Se parte de los resultados de la validación (exactitud, precisión). Si no se conoce el modelo de distribución de la medida y las repeticiones son menos de 10, la varianza de la media se estima con Chi-cuadrado, usando Sr (desviación estándar muestral en condiciones de reproducibilidad), σ (desviación poblacional), n (repeticiones) y el factor de Wecc (W), que varía con el número de determinaciones. Con ello se cubre aproximadamente el 95 % de probabilidad de que el valor verdadero esté en el intervalo. Si la distribución es normal, en lugar de W se usa la t de Student, que varía con el número de repeticiones.

## 4.2. Estimación de los errores tipo B

Solo se dispone de un único valor de xi, procedente de una única medida, de la experiencia o de la literatura científica o información previa, como un certificado de calibración.

## 4.3. Cálculo de la incertidumbre combinada

Primero se estima la varianza o magnitud asociada a cada variable, con tres aproximaciones:

- Si se conoce la distribución de la población, la varianza se estima en función del número de repeticiones
- Si solo se conoce un intervalo máximo de variación 2a, se supone una distribución rectangular
- Si viene de una fuente externa como un certificado de calibración, se divide la incertidumbre expandida por K, el factor de seguridad que acompaña al certificado

Estas incertidumbres están en las unidades de las magnitudes de entrada, no del mensurando, y existe una función que las une. La incertidumbre combinada se calcula por:

- **Propagación de varianzas**: si las magnitudes Xi son independientes, se calculan las desviaciones estándar relativas de cada etapa y se combinan por raíz cuadrática
- **Derivadas parciales**, fijando consecutivamente todas las variables menos una
- **Incertidumbre final o expandida**: combina las contribuciones A y B (raíz cuadrada de su suma cuadrática) con un factor de seguridad K, que normalmente vale entre 2 y 3 y da niveles de confianza del 95 % y 99 %, respectivamente

# 5. COMPARACIÓN DE MÉTODOS ANALÍTICOS

Entre las pruebas más usadas están:

- **Método de las adiciones**: compara el resultado de la muestra con posibles interferencias con el de otra sin ellas, mediante el test t de Student
- **Método de confirmación**: analiza repetidamente una misma muestra con ambos métodos para identificar errores sistemáticos, es decir, si el nuevo método da resultados significativamente más altos o más bajos que el inicial

En el método de confirmación se obtienen dos conjuntos de resultados con sus medias y dispersiones. La trazabilidad se verifica comparando las medias con un test t de Student, tras comprobar con un test de Levene, que usa el estadígrafo F de Fisher, si las varianzas difieren significativamente. Si las diferencias no son significativas, el nuevo método no presenta sesgo sistemático respecto al de referencia.

# 6. CONCLUSIÓN

La validación permite al SOIVRE acreditar documentalmente que sus procedimientos son aptos para el fin previsto, con la seguridad jurídica y técnica que exige un ámbito en el que los resultados pueden determinar la admisión o el rechazo de una partida.

Dominar los parámetros de validación y el cálculo de la incertidumbre permite al inspector defender la solidez de un resultado analítico. Un método no validado no es una herramienta fiable de control oficial, por avanzada que sea la instrumentación.
