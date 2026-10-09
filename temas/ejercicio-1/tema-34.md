# 1. INTRODUCCIÓN

- Una parte importante de la labor del Servicio de Inspección **SOIVRE** se realiza en la **Red de Laboratorios del SOIVRE**, algunos acreditados por la **Entidad Nacional de Acreditación (ENAC)**.
- La acreditación responde a la necesidad de ofrecer un servicio de calidad a los operadores, sobre todo exportadores. Los laboratorios SOIVRE están acreditados según la **Norma UNE-EN ISO/IEC 17025:2017**, que:
  - Regula la implantación de un Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración.
  - Establece los requisitos para demostrar la competencia en la realización de ensayos.
- **ENAC** es una asociación sin ánimo de lucro, declarada por el **Real Decreto 1715/2010** como único organismo con potestad pública para otorgar acreditaciones conforme al **Reglamento (CE) 765/2008**.
- La marca ENAC garantiza el cumplimiento de los requisitos de acreditación y su aceptación internacional, respaldada por los Acuerdos Multilaterales de Reconocimiento, suscritos por más de **120 países** y gestionados por **EA** (European Cooperation for Accreditation) y **Global Accreditation Cooperation Incorporated (Global ACI)**, resultante desde el 1 de enero de 2026 de la fusión de ILAC e IAF.
- La Red de Laboratorios SOIVRE cuenta con **16 laboratorios de ensayo periféricos** (Pontevedra, Bizkaia, Navarra, Girona, Barcelona, Valencia, Alicante, Murcia, Almería, Málaga, Sevilla, Cádiz, Huelva, Santa Cruz de Tenerife, Las Palmas y Madrid) y un **Laboratorio Central en Madrid**, todos encuadrados en la Subdirección General de Inspección, Certificación y Asistencia Técnica de Comercio Exterior.
- El **Laboratorio Central SOIVRE** (Centro Analítico de Inspección y Control de la Calidad del Comercio Exterior), creado en **1989**, coordina la red periférica, gestiona aplicaciones informáticas y adquisiciones, asesora sobre reactivos y calibración, desarrolla metodologías, da soporte analítico, organiza intercomparaciones, coordina la acreditación y la formación, y asesora en seguridad.
- El objetivo de un laboratorio analítico es producir datos de alta calidad mediante un **control de calidad** planificado y documentado, entendido como el conjunto de medidas para conservar la fiabilidad de un método analítico. Se distinguen:
  - **Control interno o intralaboratorio**: evalúa diariamente la fiabilidad de las determinaciones rutinarias, con tres fases: preanalítica (toma de muestras), analítica (validación de métodos y gráficos de control) y postanalítica (procesamiento estadístico y archivo).
  - **Control externo o interlaboratorio**: participación en ensayos de intercomparación.

# 2. VALIDACIÓN DE MÉTODOS

- **Validación**: obtención de pruebas documentadas de que un método analítico es fiable, produce resultados con incertidumbre adecuada al uso previsto y sin errores sistemáticos.
- Un método debe validarse cuando: se desarrolla uno nuevo, se revisa uno establecido, se amplía o modifica un método normalizado, el control de calidad indica que cambia con el tiempo, se usa en otro laboratorio o se compara con otro método.
- Fases de la validación:
  - **Protocolo de validación**: define el sistema, los parámetros a validar y los criterios de aceptación.
  - **Realización de la validación**: ejecución del método, recogiendo los datos primarios.
  - **Evaluación de resultados**: conforme a los límites recogidos en el **Procedimiento Normalizado de Trabajo (PNT)**.
  - **Informes técnicos**: referencias de calibración, método definitivo, resultados y criterios de aceptación.
  - **Emisión del certificado de validación**: firmado por el Jefe de Servicio (grupo A1) o el Jefe de Sección de Laboratorio (grupo A2).
  - **Archivo** de toda la documentación generada.
- La **revalidación** (total o parcial) procede cuando se introduce un cambio significativo en las condiciones originales o cuando el método lleva largo tiempo en uso.

## 2.1. Criterios fundamentales de validación

- Los métodos deben presentar características de:
  - **Fiabilidad**: proporcionalidad concentración-respuesta (linealidad, sensibilidad), dispersión de resultados (precisión, repetibilidad, reproducibilidad, robustez), diferencia con el valor verdadero (exactitud, recuperación), cantidad mínima de analito detectable (límite de detección y cuantificación) y capacidad de discriminar interferencias (selectividad, especificidad).
  - **Practicabilidad**: tiempo, coste, tamaño de muestra, cualificación del personal, seguridad y equipo.
  - **Idoneidad**: verificación del buen funcionamiento de los instrumentos en el momento del análisis.
- **Exactitud**: concordancia entre el resultado experimental y el valor de referencia. El valor de referencia puede provenir de un material de referencia certificado, un método alternativo, un ensayo de intercomparación o el método de adiciones. Se calcula estadísticamente (test t de Student) o matemáticamente (porcentaje de recuperación).
- **Precisión**: concordancia entre resultados repetidos en las mismas condiciones (**repetibilidad**) o en condiciones modificadas (**reproducibilidad**). Se considera aceptable si la diferencia entre ambas es inferior al 10 %, dudosa entre el 10 % y el 30 %, e inaceptable por encima del 30 %. También se expresa como coeficiente de variación.
- **Linealidad y proporcionalidad**: capacidad de obtener resultados proporcionales a la concentración de analito. Se estudia con patrones de concentración creciente (entre 3 y 10), analizados por duplicado o triplicado, mediante curva de calibrado ajustada por mínimos cuadrados y tratamiento estadístico del coeficiente de correlación.
- **Sensibilidad**: capacidad de registrar variaciones de concentración. Se distingue entre sensibilidad de calibrado (pendiente de la recta) y sensibilidad analítica (sensibilidad de calibrado dividida por la desviación estándar).
- **Límite de detección**: menor concentración detectable, aunque no cuantificable, equivalente a la respuesta media del blanco más 3 desviaciones típicas.
- **Límite de cuantificación**: menor concentración determinable con precisión y exactitud aceptables, siempre mayor que el límite de detección.
- **Selectividad**: capacidad de dar resultados correctos en presencia de otros componentes de la matriz. Un método perfectamente selectivo se denomina **específico**.

# 3. CÁLCULO DE LA INCERTIDUMBRE DEL MÉTODO

- **Incertidumbre**: estimación asociada al resultado de un ensayo que caracteriza el intervalo de valores en el que se espera esté el valor verdadero, expresada como Valor +/- Incertidumbre.
- Tipos de errores:
  - **Errores aleatorios o tipo A**: producidos por causas accidentales, relacionados con la precisión.
  - **Errores sistemáticos o tipo B**: relacionados con la exactitud, por imperfecciones del método, equipos o malas prácticas.
- **Estimación de errores tipo A**: se basa en los resultados de la validación. Si no se conoce el modelo de distribución y el número de repeticiones es inferior a 10, se emplea el Factor de Wecc (chi-cuadrado). Si la distribución es normal, se emplea la t de Student.
- **Estimación de errores tipo B**: se dispone de un único valor, procedente de una única medida, de la experiencia o de un certificado de calibración.
- **Cálculo de la incertidumbre combinada**: requiere estimar la varianza de cada variable, mediante conocimiento de la distribución poblacional, mediante una distribución rectangular si solo se conoce el intervalo máximo de variación, o importando el dato de un certificado de calibración (dividiendo la incertidumbre expandida entre el factor de seguridad K).
- La incertidumbre combinada se calcula por el **método de propagación de varianzas** (magnitudes independientes, raíz cuadrática) o por el sistema de derivadas parciales.
- La **incertidumbre expandida** se obtiene como raíz cuadrada de la suma cuadrática de las contribuciones A y B, aplicando un factor de seguridad K entre 2 y 3, que da niveles de confianza del 95 % y del 99 %, respectivamente.

# 4. COMPARACIÓN DE MÉTODOS ANALÍTICOS

- **Método de las adiciones**: compara los resultados de una muestra con posibles interferencias frente a otra sin ellas, mediante el test t de Student.
- **Método de confirmación**: compara los resultados de dos métodos aplicados repetidamente sobre la misma muestra, para detectar errores sistemáticos. Se obtienen dos conjuntos de resultados cuyas medias se comparan con un test t de Student, previa comprobación de la igualdad de varianzas mediante un test de Levene con el estadígrafo F de Fisher. Si las diferencias no son significativas, el nuevo método no presenta sesgo respecto al de referencia.

# 5. CONCLUSIÓN

- La validación de métodos analíticos permite al SOIVRE acreditar documentalmente que sus procedimientos son aptos para el fin previsto, aportando seguridad jurídica y técnica en el comercio exterior, donde los resultados analíticos pueden condicionar la admisión o el rechazo de una partida.
- El conocimiento riguroso de la exactitud, la precisión, la linealidad, la sensibilidad, los límites de detección y cuantificación, la selectividad y la especificidad, junto con el cálculo de la incertidumbre, dota al inspector de los elementos técnicos para defender la solidez de un resultado analítico.
- Un método no validado no puede considerarse una herramienta fiable de control oficial, por avanzada que sea la instrumentación empleada.
