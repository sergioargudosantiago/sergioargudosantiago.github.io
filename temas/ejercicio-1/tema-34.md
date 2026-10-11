# 1. INTRODUCCIÓN
- **Red de Laboratorios SOIVRE**: 16 laboratorios de ensayo en red periférica + **Laboratorio Central** en Madrid (acreditado)
  - Dependen de la **Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior** (Secretaría de Estado de Comercio, MECE)
  - Tendencia actual: especialización de cada laboratorio
- **Acreditación** según **UNE-EN ISO/IEC 17025:2017**
  - Implanta Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración
  - Requisitos para demostrar competencia en ensayos
- **ENAC**: asociación sin ánimo de lucro, único organismo con potestad pública para acreditar (**Real Decreto 1715/2010**, **Reglamento (CE) 765/2008**)
  - Marca ENAC: declara públicamente el cumplimiento y da aceptación internacional
  - Acuerdos Multilaterales de Reconocimiento con más de **120 países**, gestionados por **EA** y **Global ACI** (fusión de ILAC e IAF desde 1 de enero de 2026)
- **Laboratorio Central** (creado en **1989**), funciones
  - Coordinar y armonizar la red y las aplicaciones informáticas
  - Planificar adquisiciones, asesorar en reactivos, material y calibración
  - Poner a punto metodologías y dar soporte analítico
  - Organizar intercomparaciones y seguimiento de la acreditación
  - Formación, apoyo documental y seguridad
- **Control de calidad**: medidas para observar y conservar la fiabilidad de un método
  - **Interno** (intralaboratorio): evalúa a diario las determinaciones rutinarias
  - **Externo** (interlaboratorio): pruebas de intercomparación
  - Fases del interno: **preanalítica** (toma y tratamiento de muestra), **analítica** (validación de métodos, muestras de control, gráficos de control), **postanalítica** (estadística y archivo)

# 2. VALIDACIÓN DE MÉTODOS
- **Validación**: pruebas documentadas de que un método es fiable, con incertidumbre adecuada al uso, sin errores sistemáticos, para el rango y tipo de muestra
- **Cuándo validar**
  - Método nuevo o revisión de uno establecido
  - Ampliaciones o modificaciones de métodos normalizados
  - Control de calidad indica deriva en el tiempo
  - Método establecido usado en otro laboratorio
  - Comparación con otro método
- **Fases**
  - **Protocolo**: sistema a validar, parámetros, criterios de aceptación
  - **Realización**: ejecución recogiendo datos primarios
  - **Evaluación** según límites del **PNT** (procedimiento normalizado de trabajo) de validación, dejando constancia de cambios y razones
  - **Informes técnicos**: calibración y cualificación de instrumentos, método definitivo, resultados con datos primarios, criterios y conclusiones
  - **Certificado de validación**: firma Jefe de Servicio de Laboratorio (**A1**) o Jefe de Sección (**A2**)
  - **Archivo** de toda la documentación
- **Revalidación** total o parcial
  - Cambio significativo en aparatos, materiales, muestra o técnica
  - Método utilizado largo tiempo

# 3. CRITERIOS FUNDAMENTALES DE VALIDACIÓN
- **Características de fiabilidad** (mantener criterios en el tiempo, 5 criterios)
  - Proporcionalidad: linealidad, intervalo, sensibilidad
  - Dispersión: precisión, repetibilidad, reproducibilidad, robustez
  - Diferencia con el valor verdadero: exactitud, recuperación
  - Cantidad mínima de analito: sensibilidad, límite de detección y de cuantificación
  - Ausencia de interferencias: selectividad, especificidad
- **Practicabilidad**: tiempo, coste, tamaño de muestra, personal, seguridad, equipo
- **Idoneidad**: parámetros que garantizan que el sistema responde en el momento del análisis, sobre todo verificación del buen funcionamiento de instrumentos

## 3.1. Exactitud
- Concordancia entre resultado experimental y **valor de referencia aceptado**
  - Evaluar en puntos que cubran todo el rango
  - Requiere valor de referencia para detectar diferencias significativas
- **Fuentes del valor de referencia**
  - **Material de referencia certificado**: el test considera incertidumbre del certificado y repetibilidad
  - **Método alternativo** normalizado: muestra homogénea y con valor e incertidumbre conocidos
  - **Ensayo de intercomparación**: precisión aceptable y calculada con datos reales
  - **Método de adiciones**: si faltan las anteriores, comparar muestra/muestra adicionada con el valor teórico de la adición
- **Estadísticamente**: test **t de Student**
  - `texp = (X̅ - µ) × √n / Sr`
  - texp < t tabulado: sin diferencias significativas, método **trazable** al material de referencia
  - Con recuperación, se sustituye el valor medido por el % de recuperación
- **Matemáticamente**: **% de recuperación** del analito

## 3.2. Precisión
- Concordancia entre resultados de aplicar el procedimiento repetidas veces
  - **Repetibilidad**: mismas condiciones (operador, laboratorio, aparato, corto tiempo, misma muestra)
  - **Reproducibilidad**: misma muestra con condiciones cambiadas (analista, días, aparatos)
- Comparar reproducibilidad con repetibilidad
  - Diferencia **< 10 %**: reproducibilidad aceptable
  - **10 % a 30 %**: aceptable según importancia de la aplicación y costes
  - **> 30 %**: mejorar el sistema de medición
- **Coeficiente de variación**: `C.V. = (Sx / X̅) × 100`
  - Adimensional, compara medidas en distintos rangos o unidades
- Contribuye a la incertidumbre del ensayo, debe estar bajo un nivel fijado a priori

## 3.3. Linealidad y proporcionalidad
- Propias de métodos instrumentales: resultados linealmente proporcionales a la concentración en un rango
- Ensayo sobre soluciones patrón o muestras con concentración creciente
- **Fases**
  - Intervalo lineal del instrumento mayor que el de estudio, con tanteo previo
  - Entre **3 y 10** patrones crecientes
  - Análisis mínimo por **duplicado** (cromatografía: **triplicado**, salvo patrón interno)
  - **Curva de calibrado** por mínimos cuadrados, si no pasa por el origen indica error sistemático
  - Estadística: **coeficiente de correlación** y límites de confianza de la recta (hipérbolas)
- Existen tests específicos de linealidad y de proporcionalidad

## 3.4. Sensibilidad
- Capacidad de registrar ligeras variaciones de concentración
- **Sensibilidad de calibrado**: pendiente de la recta de calibración
- **Sensibilidad analítica**: sensibilidad de calibrado / desviación estándar de la respuesta
  - Con igual sensibilidad de calibrado, mayor en la técnica más precisa

## 3.5. Límite de detección y Límite de cuantificación
- **Límite de detección (LD)**: menor concentración detectable, no necesariamente cuantificable
  - Análisis repetitivo de un blanco
  - Respuesta = media del blanco + **3 desviaciones típicas**
- **Límite de cuantificación (LC)**: menor concentración determinable con precisión y exactitud aceptables
  - Mayor que el LD
  - Con muestra o material de referencia, punto inferior de la curva (sin blanco), nunca por extrapolación
- LD = mínima cantidad detectable, LC = mínima cantidad medible
- Procedimientos
  - Relación señal/ruido
  - Menor cantidad detectable
  - Análisis repetido del blanco
  - Extrapolación a concentración cero
  - Ordenada en el origen en unidades de concentración

## 3.6. Selectividad y Especificidad
- **Selectividad**: resultados correctos en muestra compleja (impurezas, productos de degradación, matriz) sin interferencias
  - Propia de métodos químicos, fija el alcance del método
- **Específico**: método perfectamente selectivo para un analito o grupo

# 4. CÁLCULO DE LA INCERTIDUMBRE DEL MÉTODO
- **Incertidumbre**: estimación unida al resultado que caracteriza el intervalo donde se espera el valor verdadero
  - Se expresa **Valor +/- Incertidumbre**
  - Debe considerar todas las fuentes de error
- **Errores aleatorios o tipo A**: azar, relacionados con la **precisión** (sensibilidad de equipos, derivas desde la última calibración)
- **Errores sistemáticos o tipo B**: relacionados con la **exactitud** (método, equipos, malas prácticas, muestreo incorrecto, patrón en mal estado o de baja pureza)

## 4.1. Estimación de los errores tipo A
- Se usan los resultados de la validación (exactitud, precisión)
- Distribución desconocida y **n < 10**: varianza de la media por **Chi-cuadrado**, con Sr (desviación muestral en reproducibilidad), σ, n y el **factor de Wecc (W)**
  - Cubre aproximadamente el **95 %**
- Distribución normal: se usa la **t de Student** en lugar de W

## 4.2. Estimación de los errores tipo B
- Un único valor xi, procedente de
  - Una medida
  - Experiencia
  - Literatura o información previa (certificado de calibración)

## 4.3. Cálculo de la incertidumbre combinada
- Primero, varianza de cada variable, con tres aproximaciones
  - Distribución conocida: varianza según repeticiones
  - Solo intervalo máximo **2a**: distribución **rectangular**
  - Fuente externa (certificado): incertidumbre expandida / **K**
- Las incertidumbres están en unidades de las magnitudes de entrada, no del mensurando, y existe una función que las une
- **Incertidumbre combinada**
  - **Propagación de varianzas**: magnitudes Xi independientes, desviaciones estándar relativas y raíz cuadrática
  - **Derivadas parciales**: fijando todas las variables menos una
- **Incertidumbre expandida**: raíz de la suma cuadrática de contribuciones A y B, por **K**
  - K entre **2 y 3**: confianza **95 %** y **99 %**

# 5. COMPARACIÓN DE MÉTODOS ANALÍTICOS
- **Método de las adiciones**: muestra con posibles interferencias frente a otra sin ellas, con **test t de Student**
- **Método de confirmación**: misma muestra analizada repetidamente con ambos métodos
  - Objetivo: identificar **errores sistemáticos** (resultados más altos o bajos que el método inicial)
  - Trazabilidad: comparar medias con **t de Student**
  - Antes, **test de Levene** (estadígrafo **F de Fisher**) para ver si las varianzas difieren
  - Diferencias no significativas: el nuevo método no tiene sesgo sistemático

# 6. CONCLUSIÓN
- Validación: el SOIVRE acredita documentalmente que sus métodos son aptos, con seguridad jurídica y técnica
- Los resultados pueden implicar admisión o rechazo de una partida comercial
- Un método no validado no es herramienta fiable de control oficial
