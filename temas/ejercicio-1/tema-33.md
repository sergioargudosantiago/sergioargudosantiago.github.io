# 1. INTRODUCCIÓN

Los laboratorios de la Red de Laboratorios del SOIVRE, algunos acreditados por la Entidad Nacional de Acreditación (ENAC), responden a la necesidad de ofrecer un servicio de calidad a los operadores del sector exterior, sobre todo exportadores. La acreditación se concede según la **Norma UNE-EN ISO/IEC 17025:2017**, que regula la implantación de un Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración y establece los requisitos para demostrar la competencia en los ensayos.

**ENAC.** Asociación sin ánimo de lucro declarada por el **Real Decreto 1715/2010** como único organismo con potestad pública para otorgar acreditaciones según el **Reglamento (CE) 765/2008**. Su marca en los informes garantiza las ventajas de la acreditación, incluida su aceptación internacional, gracias a los Acuerdos Multilaterales de Reconocimiento suscritos por más de 120 países y gestionados por EA y por Global Accreditation Cooperation Incorporated (Global ACI), resultante desde el 1 de enero de 2026 de la fusión de ILAC e IAF.

**Red de Laboratorios SOIVRE.** Consta de 16 laboratorios de ensayo en la red periférica, algunos acreditados, y un Laboratorio Central en Madrid, también acreditado, integrados en la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior. Cada laboratorio tiende a especializarse en un campo.

**Funciones del Laboratorio Central** (creado en 1989):

- Coordinar y armonizar la red periférica y las aplicaciones informáticas
- Planificar adquisiciones de instrumental y asesorar sobre reactivos, suministradores, material y calibración
- Poner a punto nuevas metodologías y dar soporte analítico
- Planificar y organizar ejercicios de intercomparación
- Coordinar el programa de acreditación, la formación, el apoyo documental y el asesoramiento en seguridad

**Control de calidad.** Conjunto de medidas necesarias para observar y conservar la fiabilidad de un método analítico. Un laboratorio debe producir datos de alta calidad mediante medidas estrictas, fiables y adecuadas al fin propuesto, y lo logra con un control planificado y documentado que compruebe la validez de los ensayos y calibraciones.

- **Control interno o intralaboratorio**: evalúa a diario la fiabilidad de las determinaciones rutinarias
- **Control externo o interlaboratorio**: participación en pruebas de intercomparación entre laboratorios

El control interno tiene tres fases: la **preanalítica** (toma de muestras y tratamiento previo), la **analítica** (validación de métodos, muestras de control y gráficos de control) y la **postanalítica** (procesamiento estadístico y archivo de resultados).

# 2. GRÁFICO DE CONTROL

**Gráfico de control.** Representación gráfica de los valores de una muestra de control introducida en el análisis de rutina con una frecuencia preestablecida. Permite evidenciar diferencias en el proceso analítico e imponer acciones correctivas lo antes posible. Es una representación visual de la calidad basada en un valor esperado y unos límites establecidos, y hace falta un gráfico por parámetro. Permite contrastar el valor individual, el valor medio, el porcentaje de recuperación, la desviación estándar y el recorrido.

**Muestras de control.** Líquidos de referencia o analitos de concentración conocida que se someten al mismo procedimiento que las muestras de rutina para evaluar el funcionamiento analítico del laboratorio. El material de control debe cumplir estos requisitos:

- Ser estable, en condiciones de conservación definidas, durante largos periodos
- Tener poca variabilidad entre viales
- Ser representativo de la matriz y la concentración del analito de las muestras de rutina
- Haber en cantidad suficiente para usarse como control durante un periodo relativamente largo
- Estar en recipientes que no influyan en la muestra ni cambien su cantidad restante, por ejemplo por evaporación al abrirlos

**Tipos de muestras de control:**

- **Disoluciones estándar o patrón**: composición conocida, elevada pureza y estables a temperatura ambiente, pesadas con una precisión mínima del 0,1 %. El patrón primario sirve de referencia en valoraciones o estandarizaciones. El patrón secundario o disolución valorante necesita casi siempre al primario para conocer su concentración exacta
- **Blancos**: muestra sin los componentes a determinar. Siguen el proceso de las muestras de rutina y sirven para establecer el nivel del blanco
- **Muestras naturales**: normalmente un pool de sueros o plasmas del propio laboratorio, con analitos dentro de la normalidad y concentración desconocida. Controlan la precisión, no la exactitud
- **Muestras naturales fortificadas**: dan una matriz representativa en experiencias de recuperación. Se añade una concentración conocida de estándar a una alícuota de la muestra original, se analizan ambas y se calcula el porcentaje de recuperación (método de adición estándar)
- **Muestras sintéticas**: contienen el analito y otros componentes, posibles interferencias, en concentraciones conocidas. Normalmente comerciales, verifican precisión y exactitud
- **Calibradores**: sirven para hacer curvas de calibración o calibrar aparatos de medida
- **Materiales de referencia certificados**: materiales naturales o artificiales cuyo contenido se establece con un estricto proceso de organismos de normalización. Son las muestras más caras, por lo que no suelen usarse en el control rutinario

## 2.1. Tipos de gráficos de control y su construcción

Hay tres tipos principales: los de Shewhart, los de Recorrido y los de Cusum (Cumulative Sum).

**Gráficos de Shewhart (de Levey-Jennings o convencionales).** Son los más utilizados y sirven para conocer la exactitud del proceso. En ordenadas se representan los valores obtenidos (observaciones individuales o medias) o diferencias entre resultados repetidos, y en abscisas el tiempo o el número de muestra. Llevan una línea central con la mejor estimación del valor central de la variable.

Para construir la gráfica de Levey-Jennings:

- Antes de analizar muestras, se hacen determinaciones repetidas del analito en un control comercial, al menos veinte y en días distintos
- Se calcula la media (x̅) y la desviación estándar (DE) de esos valores
- Se traza una línea central en la media y tres líneas a cada lado, a la media +/− 1, 2 y 3 DE
- Una vez iniciado el análisis simultáneo de muestras y control, cada día se anota el valor del control. Una gráfica suele recoger un mes (31 días)

La media y los límites se fijan antes de empezar el control, con el análisis previo y repetido. Los límites son:

- **Límite de aviso**: media +/− 1 DE, nivel de confianza del 68 %
- **Límite de alarma**: media +/− 2 DE, nivel de confianza del 95 %
- **Límite de acción**: media +/− 3 DE, nivel de confianza del 99,73 %

La inspección visual descubre alteraciones de la determinación:

- **Desplazamiento**: desviación de todos los valores por encima o por debajo de la media. Si es progresivo se llama tendencia al alza o a la baja. Indica inexactitud por error sistemático
- **Oscilación**: numerosos valores muy superiores e inferiores a la media. Si solo se aleja un valor, se llama salto. Ambos se deben a errores aleatorios

Las normas para detectar resultados fuera de control son:

- Un resultado fuera del límite de aviso no exige acción si el siguiente cae dentro de los límites de alarma
- Dos resultados consecutivos fuera de los límites de aviso pero dentro de los de acción obligan a revisar el proceso. Si están al mismo lado de la media indican un error sistemático. Si están en lados distintos, errores aleatorios considerables
- Un resultado fuera del límite de acción significa que el sistema está fuera de control estadístico. Se rechazan todos los datos desde el último resultado dentro de los límites y se actúa para corregirlo. El control se restablece cuando tres resultados consecutivos nuevos de la muestra de control están dentro de los límites

Los gráficos de Shewhart detectan errores de gran magnitud, errores sistemáticos (tendencias, cambios de la media) y aleatorios (dispersión de valores individuales), y controlan la exactitud. Tienen variantes:

- **Gráficos de media**: representan las medias de varias repeticiones sobre la misma muestra. Los límites de control se fijan en +/− 2σ/√n y +/− 3σ/√n, donde n es el número de medidas repetidas
- **Gráficos de blancos**: tipo especial de gráfico de media para controlar reactivos y sistemas de medida. Se representa la señal medida, no resultados ni concentraciones. Dan un valor preciso del blanco y detectan derivas, errores instrumentales y desviaciones debidas a los reactivos
- **Gráficos de recuperación**: detectan errores producidos por la matriz y ofrecen un control limitado de la exactitud, en concreto de errores sistemáticos proporcionales. Exigen muestras naturales fortificadas

**Gráficos de Recorrido y de Desviación Estándar.** A diferencia de los de Shewhart, evalúan la precisión. Representan los recorridos de repeticiones del mismo análisis sobre la muestra control a lo largo del tiempo. La línea central es la media de los recorridos de experiencias previas: R̅ = ΣRi / K, donde Ri es el recorrido (diferencia entre el valor más alto y el más bajo del subgrupo, con más de 2 medidas) y K el número de subgrupos.

Los límites de aviso y de control son múltiplos de R̅, con factores de tablas estadísticas que dependen del número de repeticiones y del nivel de confianza. Para recorridos de medidas duplicadas, el límite de aviso está a +2,512 R̅ y el de acción a +3,267 R̅. Una serie de valores por debajo de R̅ no es una tendencia fuera de control, sino una mejora de la precisión. En los gráficos de desviación estándar se usan las desviaciones de los subgrupos en lugar de los recorridos.

- Desviación estándar y recorridos varían con la concentración del analito, por lo que se construye un gráfico para cada tipo de matriz
- Las muestras control suelen ser muestras reales de la serie, introducidas al principio y al final de la serie
- Combinados con los gráficos de valor central, permiten saber si el proceso sufre errores sistemáticos, aleatorios o ambos

**Gráficos de Cusum.** Ante cambios graduales por errores pequeños, como la deriva de instrumentos, los de Shewhart responden con lentitud. En Cusum el eje de ordenadas muestra la suma acumulativa de las diferencias entre el valor de cada día y la media calculada con determinaciones previas. Sin error significativo, las sumas oscilan en una línea quebrada alrededor de la horizontal de la media. Si el rumbo se vuelve muy vertical, hay un error sistemático. Se emplean por tanto para descubrir errores sistemáticos, falta de exactitud y derivas.

# 3. EVALUACIÓN EXTERNA DE LA CALIDAD DE UN LABORATORIO: EJERCICIOS INTERLABORATORIO. CUESTIONES GENERALES. EVALUACIÓN ESTADÍSTICA DE LOS RESULTADOS

La exactitud de los resultados de un laboratorio puede verificarse de tres maneras:

- Comparando los resultados de un método A con los de otro método B
- Empleando materiales de referencia certificados
- Comparando con los resultados de otros laboratorios, mediante ejercicios interlaboratorio

**Ejercicios interlaboratorio.** Consisten en realizar ensayos sobre la misma muestra en dos o más laboratorios y comparar críticamente los resultados. No se fija metodología: cada laboratorio usa su propio procedimiento y se evalúa solo el resultado final. Los diseña, planifica, desarrolla y dirige una organización competente e independiente. Permiten la evaluación externa de la calidad (ensayos de pericia, de aptitud o de intercalibración) y su objetivo principal es evaluar el buen funcionamiento de los laboratorios.

Según su finalidad se distingue entre:

- **Ejercicios de aptitud**: comparan la competencia de los laboratorios, cada uno con su propio método analítico
- **Ejercicios colaborativos**: comprueban la idoneidad de una metodología nueva o recién modificada
- **Ejercicios de certificación**: establecen el valor de referencia y la incertidumbre de la propiedad certificada en un material de referencia

## 3.1. Evaluación estadística de los resultados

La organización recibe los datos de los laboratorios y calcula el valor medio y la desviación estándar entre las réplicas de cada uno, por lo general 5. Después los representa y los analiza estadísticamente.

- **Representación gráfica**: de medias y desviaciones estándar. La simple observación revela resultados anómalos que se desvían claramente de los de los otros laboratorios
- **Análisis estadístico**: detecta y rechaza resultados aberrantes mediante contrastes de hipótesis, que son procedimientos para aceptar o rechazar hipótesis sobre un parámetro u otra característica de la población

**Contraste de hipótesis.** La hipótesis nula (Ho) es la que se somete a comprobación y se acepta o rechaza como conclusión. La alternativa (Ha) se acepta si se rechaza Ho. Se rechaza la nula cuando hay diferencias significativas entre valores muestrales y teóricos, y se acepta en caso contrario. Esas diferencias se miden con el estadístico de contraste, que sigue una distribución conocida y toma un valor particular para cada muestra.

Los criterios habituales son el Test C de Cochran, el Test de Grubbs simple y doble, el Test Q de Dixon y el análisis de la varianza ANOVA.

**Test C de Cochran.** Elimina los resultados de laboratorios cuya varianza intralaboratorio es significativamente mayor que la de los demás para un material dado. Se calcula la varianza intralaboratorio (S²) de cada laboratorio y se divide la máxima entre la suma de todas: C = S²máx / ΣS². Si C supera el valor crítico tabulado, el laboratorio es aberrante y eliminable. También sirve como alternativa simple a pruebas de homoscedasticidad (varianza de los errores constante) como el test de Levene.

**Criterio R de Grubbs.** Elimina laboratorios con valores medios extremos, inconsistentes con una distribución gaussiana de las medias (valores atípicos o sospechosos). Se calcula R = (Xq − X̅) / S, donde Xq es el valor informado de concentración que se sospecha atípico, X̅ la media y S la desviación estándar de la muestra, con Xq y X̅ calculados sobre el conjunto completo de resultados. Si R supera el valor tabulado para el nivel de significancia y los grados de libertad, se confirma el valor discrepante.

Una variante más sencilla, usada por algunas organizaciones, es el **Z-Score** (tipificación, de cálculo similar a R):

- Z < 2: satisfactorio
- 2 < Z < 3: cuestionable
- Z > 3: no satisfactorio

**Test Q de Dixon.** Usa relaciones entre las diferencias de los datos que parecen atípicos. Con los valores ordenados por magnitud, Q es la diferencia entre el valor sospechoso Xq y su vecino Xq−1 dividida por la diferencia entre el primer valor X1 y el último Xn. Si el valor absoluto de Qcal supera el Q tabulado, el valor sospechoso es discrepante para el nivel de significancia elegido.

**Análisis de la varianza (ANOVA).** Detecta si algún laboratorio da resultados que difieren de forma estadísticamente significativa de los demás. Sus etapas son:

- Revisar los valores y eliminar los no válidos, es decir, los que no siguieron el protocolo de trabajo
- Calcular media, desviación estándar, repetibilidad y reproducibilidad
- Detectar y eliminar datos discrepantes con los tests de Cochran y de Grubbs
- Recalcular los parámetros sin los discrepantes
- Interpretar según ANOVA, que contrasta la igualdad de medias cuando hay más de dos grupos experimentales

La hipótesis nula es que todas las medias poblacionales de las que provienen las muestras son iguales, y la alternativa que no todas lo son, con un nivel de significación prefijado. La lógica es que, si los laboratorios no tienen errores sistemáticos, las medias no diferirán mucho y su dispersión, debida a errores aleatorios, será comparable a la dispersión individual de cada laboratorio. Por eso se hallan dos varianzas y se comparan con el **Test F de Snedecor**:

- **Variabilidad total (Q)**: suma de la variabilidad dentro de cada muestra (QD, debida solo al azar) y la existente entre muestras (QE, debida al azar y, si Ha es cierta, a poblaciones con medias distintas)
- **QD**: mide las desviaciones entre las observaciones Xij de cada laboratorio y la media de su grupo. Dividida por N−K grados de libertad da la varianza dentro de los laboratorios
- **QE**: mide las desviaciones entre laboratorios y, dividida por K−1 grados de libertad, da la varianza entre laboratorios
- **Estadístico de contraste**: cociente entre la variabilidad entre y la variabilidad dentro, una vez hechas comparables, que sigue una F de Snedecor con K−1 y N−K grados de libertad

Si Fexp supera la F tabulada, se rechaza la igualdad de medias y se acepta que existe algún error sistemático (σE² > σD²) y que al menos un laboratorio difiere de forma significativa. Si no hay diferencia significativa, predominan los errores aleatorios como causa de la discrepancia entre medias.

ANOVA es una prueba de significación global: indica si hay diferencia pero no dónde. Por eso hacen falta contrastes posteriores para ver qué pares de medias difieren, como LSD, Tukey, Bonferroni o Dunnet, según las características de las muestras.

# 4. CONCLUSIÓN

El control de calidad, interno y externo, permite a los laboratorios del SOIVRE demostrar de forma continuada la fiabilidad de sus determinaciones. Los gráficos de control ofrecen una herramienta visual e inmediata para detectar desviaciones antes de que comprometan la validez de los resultados, y los ejercicios interlaboratorio dan una evaluación externa objetiva frente al resto de la red.

Su aplicación sistemática garantiza que un mismo producto analizado en laboratorios distintos arroje resultados comparables y coherentes, lo que refuerza la confianza de los operadores comerciales y de las administraciones de terceros países en el control de calidad comercial español.
