# 1. INTRODUCCIÓN
- **Red de Laboratorios SOIVRE**: 16 laboratorios periféricos + **Laboratorio Central** (Madrid, creado 1989)
  - Dependen de la Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior (Secretaría de Estado de Comercio, MECE)
- **Acreditación** según **UNE-EN ISO/IEC 17025:2017**: sistema de gestión de la calidad y requisitos de competencia en ensayos
- **ENAC**: único organismo con potestad pública para acreditar (**Real Decreto 1715/2010**, **Reglamento (CE) 765/2008**)
  - Marca ENAC: cumplimiento y aceptación internacional
  - Acuerdos de Reconocimiento (más de 120 países) en **EA** y **Global ACI** (ILAC + IAF desde 1-1-2026)
- Funciones del Laboratorio Central
  - Coordinar y armonizar la red
  - Adquisiciones, reactivos, calibración y seguridad
  - Nuevas metodologías y soporte analítico
  - Intercomparaciones, acreditación, formación
- **Control de calidad**
  - **Interno**: preanalítica (muestreo), analítica (validación, muestras y gráficos de control), postanalítica (estadística y archivo)
  - **Externo**: pruebas de intercomparación

# 2. FUNDAMENTOS GENERALES DE LA ESPECTROMETRÍA
- Interacciones materia-radiación
  - Sin intercambio de energía: difracción, refracción, rotación óptica
  - Con intercambio (analíticamente más importantes): absorbancia UV/V, fluorescencia/fosforescencia, reacción fotoquímica
- Especie pasa del estado fundamental a uno excitado y regresa liberando energía
- Energías cuantificadas y características de cada especie
  - **Ecuación de Planck**: ΔE = h · ν
  - Longitud de onda absorbida o emitida = variable cualitativa
  - Transiciones electrónicas requieren mucha más energía que vibracionales y rotacionales
- Técnicas
  - **UV/V**: UV 200-400 nm, visible 400-700 nm, mide energía absorbida
  - **Fluorescencia molecular**: mide energía emitida
  - **Absorción IR**: 700 nm a 1.000 µm, solo vibraciones y rotaciones
  - **Raman**: diferencia de longitud de onda entre radiación incidente y dispersada
  - **Absorción atómica** y **emisión atómica** (esta, sobre todo Na, K, Li y Ca)

# 3. ESPECTROFOTOMETRÍA UV/VIS
- Base: **grupos cromóforos** absorben radiación visible o UV
- Intensidad absorbida da la concentración, tipo de radiación identifica características

## 3.1. Instrumentación y metodología
- **Fuente**: continua, estable y uniforme
  - UV: arco de deuterio
  - Visible: halógena de wolframio
- **Monocromador**: longitud de onda fija (cuantitativo) o de barrido (cuantitativo y cualitativo)
- **Celda**: UV de cuarzo o sílice fundida, visible de vidrio, cuarzo o plástico
- **Detector**: señal de luz a eléctrica, compara energía transmitida e incidente (fotodiodo, fotomultiplicador, matriz de fotodiodos)
- **Registrador**: espectrograma
- **Doble haz**: celda de referencia, se resta la absorción del disolvente

## 3.2. Procedimiento de calibración
- **Semestral**
  - Exactitud y repetibilidad de longitud de onda
  - Exactitud y repetibilidad fotométrica en UV y visible
  - Límite de luz difusa
  - Poder de resolución
  - Cubetas (doble haz)

## 3.3. Métodos de identificación y cuantificación
- **Identificación**: máximo de absorción característico, comparar espectro problema con patrón, derivadas si son muy similares
- **Cuantificación**: aplicación más importante
  - **Ley de Lambert-Beer**: Abs = log(I0/I) = ε · b · c
  - ε absortividad molar, b espesor, c concentración

## 3.4. Aplicaciones en el ámbito alimentario y de seguridad industrial
- Alimentario
  - Carnes: hidroxiprolina, nitritos, nitratos
  - Fungicidas ortofenilfenol y tiabendazol en frutas y hortalizas
  - Aguardientes compuestos: furfural
  - Pimentón y azafrán: poder colorante, safranal, picrocrocina
  - Aceites: extinción a 270 y 232 nm, delta K
  - Bebidas alcohólicas: cafeína y quinina
  - Abonos: Biuret en urea, boro soluble
- Seguridad industrial
  - **Cromo VI** en calzado o guantes
    - Cuero ≤ 3,0 mg/kg (**Reglamento (UE) 301/2014**, **UNE-EN ISO 20345:2022**)
    - Textil ≤ 1,0 mg/kg (**Reglamento (UE) 2018/1513**)
  - **Formaldehído** en melamina
    - **Reglamento (UE) 10/2011**, plásticos en contacto con alimentos
    - **Reglamento (UE) 284/2011**, poliamida y melamina de China y Hong Kong, migración específica 15 mg/kg

# 4. ESPECTROMETRÍA DE ABSORCIÓN Y EMISIÓN ATÓMICA

## 4.1. Espectrometría de emisión atómica: fundamentos y descripción
- Átomos o iones libres excitados vuelven al fundamental y emiten radiación característica (espectro de líneas)
  - Placa fotográfica: cualitativo
  - Receptor fotoeléctrico: cuantitativo (fotones proporcionales a átomos excitados)
- Instrumentación: fuente de excitación, monocromador, detector
- **Fuente de excitación**: gasifica la muestra y excita el máximo de átomos
  - **Llama** (fotometría de llama): combustible + oxidante, muestra líquida nebulizada, espectros sencillos
  - **Arco y chispa**: más energéticos, electrodos de grafito, muestra normalmente sólida
  - **Plasma**: gas noble, por encima de 8.000 K
- **Monocromador**: prismas, filtros interferenciales o red de difracción
- **Detector**
  - Fotometría de llama (cuantitativa): fotocélulas o fotomultiplicadores
  - Emisión (cualitativa): fotográfico o fotoeléctrico

## 4.2. Espectrometría de absorción atómica: fundamentos y descripción
- Radiación monocromática atraviesa la llama, átomos en estado fundamental absorben, disminución lineal con la concentración
- Proceso inverso a la emisión atómica
- **Fuente**: lámpara de **cátodo hueco** (argón o helio, ánodo de wolframio, cátodo del elemento), también multielemento
- **Atomizador**
  - **Llama fría**: átomos sin excitar, gotas uniformes
  - **Cámara de grafito**: secado 100 ºC, incineración 800-1.000 ºC, atomización por encima de 2.650 ºC, muestras pequeñas y difíciles
  - **Vapor frío**: Hg, con cloruro de estaño o borohidruro sódico
  - **Generación de hidruros**: As, Se, Te, Sb, Bi, Sn, Ge, con borohidruro sódico, separa analito y matriz
- **Monocromadores**: prisma, red, filtros
- **Detector**: fotomultiplicadores (absorbancia o transmitancia)

## 4.3. Procedimientos de calibración
- Desgaste de la lámpara
- Exactitud de la escala de longitud de onda
- Sensibilidad próxima a la del fabricante
- Límites de detección y cuantificación
- Linealidad y precisión de la curva de calibrado

## 4.4. Métodos de cuantificación
- **Fotometría de llama**: eminentemente cuantitativa, alcalinos y alcalinotérreos
  - **Curva de calibración**: concentración frente a intensidad de emisión
  - **Adición de patrón**: muestra (I1) y muestra + igual volumen de patrón (I2)
  - **Patrón interno**: elemento ausente en la muestra, cociente de intensidades
- **Emisión atómica**: fundamentalmente cualitativa
  - Comparar con patrones puros y atlas, hasta 70 elementos, rayas características (últimas)
  - Cuantitativo menor: ennegrecimiento proporcional a la concentración, con patrón interno
- **Absorción atómica**: eminentemente cuantitativa, metales a concentraciones muy pequeñas
  - T = I/I0 y Abs = log(I0/I) = ε · b · c
  - Recta absorbancia-concentración por el origen, pendiente ε·b
  - Curva de calibrado con patrones, resultado en ppm

## 4.5. Aplicaciones en el ámbito alimentario y de seguridad industrial
- **Fotometría de llama**: Na en pan dietético, neutralización de la leche, vino con intercambio catiónico (Na y K)
- **Emisión atómica**: poco usada por coste, oligoelementos en aguas minerales y metales en productos dietéticos
- **Absorción atómica**: metales pesados
  - Pb, Cd y Hg en productos de pesca
  - Sn y Pb en vinos y conservas
  - Cu y Zn en vinagre y cerveza
  - Cd y Pb en cárnicos y cerámica alimentaria
  - Juguetes: migración de As, Ba, Cd, Cr, Hg, Pb, Sb y Se (**UNE-EN 71-3:2020+A2:2024**)

# 5. ESPECTROMETRÍA DE MASAS
- Una de las técnicas más usadas en la Red de Laboratorios SOIVRE

## 5.1. Fundamento
- Mezclas complejas de gases, líquidos o sólidos, rápido y exacto
- Bombardeo electrónico de muestra gaseosa: fragmentos con carga positiva
- Campo eléctrico acelera los iones, campo magnético los separa por **relación masa/carga**
- Reproducibilidad: mismas condiciones de excitación dan los mismos iones

## 5.2. Descripción
- **Entrada de muestra**: gasificada a unos 400 ºC, cámara de ionización
- **Acelerador**: 3 ranuras
- **Separador**: campo magnético, vacío elevado
  - Un enfoque (180º), de sector (60-90º), **doble enfoque** (preferido)
- **Detector** con amplificadores y registrador
- **Espectrograma de masas**
  - Abscisas: masa/carga
  - Ordenadas: abundancia relativa
  - **Pico base** = 100

## 5.3. Aplicaciones en el ámbito alimentario y de seguridad industrial
- Se combina con cromatografía de gases o HPLC
- **Cualitativas**
  - Peso molecular: pico de mayor m/e = **masa patrón**
  - Fórmula molecular
  - Identificación por **fragmentación patrón**
  - Polímeros, productos de reacción, metabolitos, impurezas a pocas ppm
- **Cuantitativas**: intensidad relativa de picos, calibración con patrones, sobre todo isótopos
- **Seguridad industrial** (con cromatografía de gases)
  - Biocida **DMF** en muebles, textiles, calzado y desecantes (**Reglamento (CE) 1907/2006**)
  - Ftalatos en juguetes, calzado y prendas
  - **Pentaclorofenol (PCP)** en textiles (**UNE 59510:2007**) y calzado

# 6. ESPECTROMETRÍA DE INFRARROJOS

## 6.1. Fundamento
- Absorción en la región infrarroja, identifica compuestos y composición
- Enlaces con frecuencias de vibración específicas
  - Requisito: cambio del momento dipolar
  - 6 vibraciones: estiramiento simétrico y asimétrico, tijera, rotación, giro (twisting), balanceo (wagging)
- Rango habitual 4.000-400 cm-1
- Casi solo enlaces covalentes, útil en química orgánica y mezclas complejas

## 6.2. Preparación de la muestra
- **Líquidas**: entre placas de NaCl, muestra y medio anhidros
- **Sólidas**: mezcla con KBr, pastilla prensada a alta presión
- Las sales no absorben IR

## 6.3. Aplicaciones en el ámbito alimentario y de seguridad industrial
- Rápida y fiable: medidas, control de calidad, análisis dinámicos
- Equipos portátiles, medidas de campo
- Identificación automática con espectros de referencia
- Grado de polimerización en fabricación de polímeros
- CO2 en invernaderos y cámaras de crecimiento
- Análisis forense y pigmentos en arte

## 6.4. Espectrometría de infrarrojos por transformada de Fourier
- **FTIR**: luz con todas las longitudes de onda por un **interferómetro**, transformada de Fourier del interferograma
- Ventajas
  - Más barato (interferómetro más simple que monocromador)
  - Más rápido, todas las frecuencias a la vez
  - Promedio de lecturas aumenta la sensibilidad
- Casi todos los equipos modernos

# 7. CONCLUSIÓN
- Mismo fundamento físico, respuestas complementarias
- UV/Vis y absorción atómica: cuantitativas
- Masas: identificación estructural
- IR: control dinámico y análisis forense
