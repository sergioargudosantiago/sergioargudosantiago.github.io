# 1. INTRODUCCIÓN

- Gran parte de la labor del Servicio de Inspección **SOIVRE** se desarrolla en la **Red de Laboratorios del SOIVRE**, algunos acreditados por la **Entidad Nacional de Acreditación (ENAC)**.
- La acreditación responde a la necesidad de ofrecer un servicio de calidad a los operadores comerciales, especialmente exportadores. Los laboratorios están acreditados según la Norma **UNE-EN ISO/IEC 17025:2017**, que:
  - Regula la implantación de un Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración.
  - Establece los requisitos para demostrar competencia en la realización de ensayos.
- **ENAC** es una asociación sin ánimo de lucro declarada, por el **Real Decreto 1715/2010**, único organismo con potestad pública para otorgar acreditaciones conforme al **Reglamento (CE) 765/2008**.
- Las Marcas de ENAC cuentan con el respaldo de Acuerdos Multilaterales de Reconocimiento, suscritos por más de **120 países**, gestionados por **EA** y por **Global Accreditation Cooperation Incorporated (Global ACI)**, resultante desde el 1 de enero de 2026 de la fusión de **ILAC** e **IAF**.
- La Red periférica cuenta con **16 laboratorios de ensayo**: Pontevedra (Vigo), Bizkaia (Bilbao), Navarra (Pamplona), Girona (Figueras), Barcelona, Valencia, Alicante, Murcia, Almería, Málaga, Sevilla, Cádiz (Algeciras), Huelva, Santa Cruz de Tenerife, Las Palmas de Gran Canaria y Madrid (Barajas), además de un **Laboratorio Central** en Madrid, todos adscritos a la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior (MECE).
- El **Laboratorio Central SOIVRE** (Centro Analítico de Inspección y Control de la Calidad del Comercio Exterior), creado en **1989**, coordina la red periférica, las aplicaciones informáticas, las adquisiciones, el asesoramiento técnico, la puesta a punto de metodologías, el soporte analítico, los ejercicios de intercomparación, la acreditación, la formación, el apoyo documental y la seguridad.
- El objetivo de todo laboratorio analítico es producir datos de alta calidad mediante un **control de calidad** planificado y documentado, entendido como el conjunto de medidas para conservar la fiabilidad de un método analítico. Existen dos tipos:
  - **Control de calidad interno o intralaboratorio**: evalúa diariamente la fiabilidad de las determinaciones rutinarias, en tres fases: **preanalítica** (toma y tratamiento de muestras), **analítica** (validación de métodos, muestras de control, gráficos de control) y **postanalítica** (tratamiento estadístico y archivo).
  - **Control de calidad externo o interlaboratorio**: participación en ejercicios de intercomparación entre laboratorios.

# 2. GRÁFICOS DE CONTROL

- Un **gráfico de control** representa los valores de una muestra de control introducida con frecuencia preestablecida en el análisis de rutina, para detectar desviaciones e imponer acciones correctivas. Es necesario un gráfico por parámetro.
- Permiten contrastar valor individual, valor medio, porcentaje de recuperación, desviación estándar y recorrido.
- Las **muestras de control** son líquidos de referencia o analitos de concentración conocida. Deben ser estables, homogéneas entre viales, representativas de la matriz y concentración de rutina, disponibles en cantidad suficiente y no verse afectadas por el envase.
- Tipos de muestras de control:
  - **Disoluciones estándar o patrón**: composición conocida y elevada pureza, con precisión mínima de pesada del **0,1 %**. Existen patrones primarios y secundarios (estos últimos necesitan del primario para fijar su concentración).
  - **Blancos**: muestras exentas del analito, para fijar el nivel del blanco.
  - **Muestras naturales**: pool de sueros o plasmas de concentración desconocida, útiles para controlar la precisión.
  - **Muestras naturales fortificadas**: se añade una concentración conocida de estándar a una alícuota, para calcular el porcentaje de recuperación (método de adición estándar).
  - **Muestras sintéticas**: comerciales, con analito e interferencias en concentraciones conocidas, para verificar precisión y exactitud.
  - **Calibradores**: para curvas de calibración o calibrar equipos.
  - **Materiales de referencia certificados**: establecidos por organismos de normalización, los más caros y menos usados en rutina.

## 2.1. Tipos de gráficos de control

- Existen tres tipos: **Shewhart**, **de Recorrido** y **de Cusum**.
- **Gráficos de Shewhart (Levey-Jennings)**: los más utilizados, muestran la exactitud. Se construyen a partir de al menos **veinte determinaciones** repetidas en días distintos, calculando media y desviación estándar (DE), y trazando una línea central y tres pares de líneas equidistantes (media ± 1, 2 y 3 DE), normalmente para un mes (31 días).
  - **Límite de aviso** (media ± 1 DE): confianza del **68 %**.
  - **Límite de alarma** (media ± 2 DE): confianza del **95 %**.
  - **Límite de acción** (media ± 3 DE): confianza del **99,73 %**.
  - Alteraciones detectables: **desplazamiento** (desviación sostenida hacia un lado, por error sistemático) y **oscilación** o **salto** (por errores aleatorios).
  - Reglas de control: un resultado fuera del límite de aviso no requiere acción si el siguiente vuelve a los límites de alarma, dos consecutivos fuera de aviso pero dentro de acción exigen revisión (mismo lado: error sistemático, lados distintos: errores aleatorios), un resultado fuera del límite de acción implica sistema fuera de control, rechazo de los datos posteriores al último válido y necesidad de tres resultados consecutivos dentro de límites para restablecer el control.
  - Variantes: **gráficos de media** (límites en ±2σ/√n y ±3σ/√n), **gráficos de blancos** (control de reactivos y sistemas de medida) y **gráficos de recuperación** (con muestras naturales fortificadas, para errores sistemáticos proporcionales).
- **Gráficos de Recorrido y de Desviación Estándar**: evalúan la precisión, no la exactitud. La línea central es la media aritmética de los recorridos (R̅ = ΣRi/K). Para medidas duplicadas, el límite de aviso se sitúa en **+2,512 R̅** y el de acción en **+3,267 R̅**. Deben construirse gráficos distintos por matriz, con muestras reales introducidas al inicio y al final de la serie.
- **Gráficos de Cusum**: representan la suma acumulativa de las diferencias entre el valor diario y la media histórica. Son más sensibles que los de Shewhart ante cambios graduales (deriva instrumental) y detectan errores sistemáticos.

# 3. EVALUACIÓN EXTERNA DE LA CALIDAD: EJERCICIOS INTERLABORATORIO

- La exactitud de un laboratorio puede verificarse comparando métodos, empleando materiales de referencia certificados o mediante **ejercicios interlaboratorio**: ensayos sobre una misma muestra realizados por dos o más laboratorios, sin metodología impuesta, organizados por una entidad independiente.
- Según su finalidad:
  - **Ejercicios de aptitud**: comparan la competencia de los laboratorios con su propio método.
  - **Ejercicios colaborativos**: comprueban la idoneidad de una metodología nueva o modificada.
  - **Ejercicios de certificación**: establecen el valor de referencia y la incertidumbre de un material de referencia.

## 3.1. Evaluación estadística de los resultados

- Cada laboratorio calcula la media y la desviación estándar de sus réplicas (habitualmente 5), que la organización trata mediante representación gráfica y análisis estadístico basado en contrastes de hipótesis (hipótesis nula H0 frente a hipótesis alternativa Ha).
- Principales pruebas:
  - **Test C de Cochran**: elimina laboratorios con varianza intralaboratorio significativamente mayor, mediante C = S²máx/ΣS². También sirve como alternativa al test de Levene de homoscedasticidad.
  - **Criterio R de Grubbs**: identifica valores medios extremos mediante R = (Xq – X̅)/S. Variante simplificada: **Z-Score**, con puntuaciones **Z < 2** satisfactorias, **2 < Z < 3** cuestionables y **Z > 3** no satisfactorias.
  - **Test Q de Dixon**: compara la diferencia entre el valor sospechoso y su vecino con el recorrido total de la serie ordenada.
  - **Análisis de la varianza (ANOVA)**: detecta si algún laboratorio difiere significativamente de los demás, mediante revisión y eliminación de valores no válidos, cálculo de parámetros, detección de discrepantes (Cochran y Grubbs) y contraste mediante el **Test F de Snedecor**, comparando la variabilidad entre laboratorios (QE) y dentro de laboratorios (QD). Si Fexp supera el valor tabulado, se rechaza H0 y se concluye que existe error sistemático. ANOVA indica que hay diferencias, pero no cuáles, por lo que requiere contrastes posteriores (LSD, Tukey, Bonferroni, Dunnet).

# 4. CONCLUSIÓN

- El control de calidad interno y externo permite a los laboratorios del SOIVRE demostrar de forma continuada la fiabilidad de sus determinaciones analíticas.
- Los gráficos de control ofrecen una herramienta visual para detectar desviaciones antes de que comprometan los resultados, mientras que los ejercicios interlaboratorio aportan una evaluación externa objetiva de cada laboratorio.
- Esta aplicación sistemática resulta especialmente relevante para una red distribuida como la del SOIVRE, al garantizar resultados comparables entre laboratorios y reforzar la confianza de operadores y administraciones de terceros países.
