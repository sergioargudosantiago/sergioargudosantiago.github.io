# 1. INTRODUCCIÓN

- **Red de Laboratorios SOIVRE**
  - Parte importante de las labores del Servicio de Inspección SOIVRE
  - Acreditación (ENAC) por necesidad de ofrecer servicio de calidad a operadores, sobre todo exportadores
  - Acreditados según **UNE-EN ISO/IEC 17025:2017**
    - Sistema de Gestión de la Calidad en laboratorios de ensayo y calibración
    - Requisitos para demostrar competencia en ensayos
  - Composición: **16 laboratorios** de ensayo periféricos (algunos acreditados) + **Laboratorio Central** en Madrid (acreditado)
  - Dependen de la Subdirección Gral. de Inspección, Certificación y Asistencia Técnica de Comercio Exterior (Secretaría de Estado de Comercio, MECE)
  - Tendencia actual: especialización de cada laboratorio
- **ENAC**
  - Asociación sin ánimo de lucro, único organismo con potestad pública para acreditar (**Real Decreto 1715/2010**, **Reglamento (CE) 765/2008**)
  - Marca ENAC: declara públicamente el cumplimiento y garantiza aceptación internacional
  - Acuerdos Multilaterales de Reconocimiento, más de 120 países, en **EA** y **Global ACI** (desde 1 de enero de 2026, fusión de ILAC e IAF)
- **Laboratorio Central** (Centro Analítico de Inspección y Control de la Calidad del Comercio Exterior), desde **1989**
  - Coordinar y armonizar la red periférica y las aplicaciones informáticas
  - Planificar adquisiciones de instrumental y asesorar en reactivos, calibración y seguridad
  - Poner a punto metodologías y dar soporte analítico
  - Organizar intercomparaciones, seguimiento de la acreditación, formación y apoyo documental
- **Control de calidad**: medidas para conservar la fiabilidad de un método analítico
  - **Interno o intralaboratorio**: evalúa a diario las determinaciones rutinarias
    - Preanalítica: toma y tratamiento de muestra
    - Analítica: validación de métodos, muestras de control, gráficos de control
    - Postanalítica: procesamiento estadístico y archivo
  - **Externo o interlaboratorio**: pruebas de intercomparación
- Objeto del tema: fundamentos, tipos (capa fina, gases, HPLC), detección, identificación y cuantificación, aplicaciones alimentarias y de seguridad industrial

# 2. FUNDAMENTOS GENERALES DE LA CROMATOGRAFÍA

- **Definición**: técnicas basadas en la **retención selectiva**
  - Objetivos: separar componentes, identificarlos, cuantificarlos
  - Origen: inicios del siglo XX, pigmentos vegetales (clorofilas, carotenoides) en columna de carbonato cálcico
- **Fase móvil** (gas o líquido) arrastra la muestra por la **fase estacionaria** (sólida o líquida)
  - Cada componente interacciona distinto, avanza a distinta velocidad y se separa
  - Después pasan por un **detector**, que genera señal según concentración y tipo de compuesto
- **Clasificación por fase estacionaria sólida**
  - **Adsorción**: fuerzas de Van der Waals
  - **Cambio iónico**: fuerzas electrostáticas
  - **Exclusión (geles)**: polímeros no iónicos porosos, separan por tamaño
  - **Afinidad**: adsorción con ligando enlazado (inhibidor enzimático, anticuerpo), uso bioquímico
- **Partición**: fase estacionaria líquida soportada en sólido inerte, el soluto se reparte entre las fases
- **Clasificación por fase móvil**
  - **Líquida**: líquido-líquido y líquido-sólido
  - **Gases**: gas-líquido y gas-sólido
- **Clasificación por soporte**: de **columna** y de **placa**

# 3. CROMATOGRAFÍA EN CAPA FINA

## 3.1. Descripción

- **Cromatografía plana**, la más simple de todas
- Fase estacionaria: sólido adsorbente en una placa (**alúmina activa**, **gel de sílice**). Fase móvil: líquido (eluyente)
- **Procedimiento**
  - Aplicar la muestra (mancha o banda) cerca de la base y evaporar el disolvente
  - Introducir la placa en el recipiente con eluyente, que asciende por capilaridad
  - Mayor polaridad del analito, mayor atracción por la fase estacionaria y menor recorrido
  - Sacar la placa al acercarse el eluyente al extremo superior
- **Revelado** (los solutos suelen ser incoloros)
  - Luz UV si el adsorbente lleva indicador fluorescente
  - Pulverizar reactivos que den productos coloreados o fluorescentes (ácido sulfúrico, yodo)
- **Identificación**: **Rf** o factor de retención = distancia recorrida por el compuesto / distancia recorrida por la fase móvil
  - Típico de cada compuesto en las mismas condiciones, se compara con patrón (cualitativo)
- **Cuantificación**: con patrones de cantidad conocida en la placa
  - Tamaño de la mancha (el área es proporcional a la cantidad)
  - **Fotodensitometría**: luz reflejada, la absorbida es proporcional a la cantidad
  - **Elución**: rascar la placa, disolver y valorar por espectroscopia

## 3.2. Aplicaciones en el ámbito alimentario

- Colorantes alimenticios, ácido ascórbico, fosfolípidos, tocoferoles
- Vitamina D (revelado por espectrofotometría UV)
- Quinina en agua tónica, cafeína en café
- Teobromina en cacao y té (espectrofotometría de emisión o reflexión)

# 4. CROMATOGRAFÍA DE GASES

## 4.1. Descripción

- Auge desde los **años 50**, técnica de rutina y control
- Los componentes se **volatilizan** y se detectan en fase gaseosa, sea la muestra gas, líquido o sólido
- **Esquema**: inyector (volatiliza por calentamiento), gas portador, columna con fase estacionaria, detector, registrador
- **Gas portador**: inerte, solo transporta, no interacciona con el analito
  - Nitrógeno, helio o hidrógeno
- **Muestra**: componentes volátiles a la temperatura de trabajo
  - Líquidas: las más empleadas, jeringa de inyección
  - Gaseosas: válvulas rotatorias (más reproducibles y automatizables)
  - Sólidas: se disuelven y se inyectan como líquidas
  - Cámara de inyección: volatiliza sin descomponer térmicamente
  - Temperatura de columna regulada, factor clave en la separación
- **Columna** enrollada
  - Empaquetada o rellena
  - **Capilar** (abierta): más común, más rápida y eficiente, menor diámetro y menos muestra
  - Inyectores **split/splitless** con capilares: la mayor parte del flujo va a desecho
- **Fase estacionaria**
  - Sólida (gas-sólido o adsorción): carbón activo, gel de sílice, alúmina activada
  - Líquida inmovilizada (gas-líquido o partición): la más usada
  - Elección: estructura química similar a la muestra. Polares en fases polares (polietilenglicoles, **Carbowax**), no polares en parafínicas (escualeno)
- **Separación**: por diferencias de volatilidad y solubilidad en la fase estacionaria
- **Sistemas de detección**
  - **TCD** (conductividad térmica): pérdida de calor según el gas, baja sensibilidad
  - **ECD** (captura electrónica): muy selectivo, mide descenso de corriente por analitos que captan electrones
    - Ideal para compuestos halogenados, mejor detector para **pesticidas**
    - Insensible a hidrocarburos, alcoholes y cetonas
  - **FID** (ionización de llama): universal, llama de hidrógeno ioniza las moléculas orgánicas
  - **NPD** (llama con sal sódica): selectivo para nitrógeno, fósforo y halógenos, pesticidas y muestras biológicas
  - **MSD** (espectrometría de masas): el más reciente
    - Ionización por impacto electrónico o ionización química
    - Identifica por tiempo de retención y por espectro de masas ("huella digital")
- **Identificación y cuantificación**
  - Cromatograma: picos por analito
  - Posición del pico, **tiempo de retención** (volatilidad y solubilidad): análisis cualitativo
  - **Área del pico**: análisis cuantitativo
  - Requiere datos de patrones previos

## 4.2. Aplicaciones en el ámbito alimentario

- Análisis cada vez más específicos, reproducibles y selectivos, con menores límites de detección
- **Residuos de plaguicidas**: análisis más rutinario del control de alimentos, sobre todo frutas y hortalizas
  - LMR: **Reglamento (CE) 396/2005**, **Reglamento (CE) 1107/2009**, **Reglamento (CE) 178/2002**
  - Dificultades
    - Descomposición por altas temperaturas
    - Gran número de plaguicidas, nuevos constantemente (actualizar métodos y patrones)
    - Límites muy bajos (0,001 ppm o menos), el límite de detección debe ser aún menor
    - Características físico-químicas muy distintas (varias extracciones, detectores y columnas), exige equipamiento y personal
  - Métodos **multirresiduos** habituales, algunos plaguicidas requieren método específico
- **Perfil de ácidos grasos**: identifica aceites y grasas
- **Esteroles**: identifican la materia grasa y dan el colesterol
- Alcoholes y graduación en bebidas alcohólicas. Metanol y acetona en vinagres
- Otras
  - Productos lácteos: componentes, residuos, contaminantes, conservadores, antioxidantes, aromas
  - Zumo de naranja: volátiles hidrosolubles (metanol, acetaldehído)
  - Azúcares
  - Aminoácidos y compuestos nitrogenados en carnes, pescados y huevos
  - Aditivos, aromas volátiles y vitaminas

## 4.3. Aplicaciones en el ámbito de la seguridad industrial

- Siempre con **espectrómetro de masas**
- Biocida **DMF** (dimetilfumarato) en muebles, textiles, calzado, bolsitas desecantes y parches antihumedad (**Reglamento (CE) 1907/2006**)
- **Ftalatos** en juguetes, calzado y prendas
- **Pentaclorofenol (PCP)** y sales en textiles (**UNE 59510:2007**) y calzado

# 5. CROMATOGRAFÍA LÍQUIDA DE ALTA RESOLUCIÓN

## 5.1. Descripción

- **HPLC**: versión moderna de la cromatografía líquida en columna
  - Alta resolución, rapidez y detección de cantidades muy pequeñas
  - Como la de gases, pero la fase móvil es **líquida** y sí interacciona con los analitos
- **Metodología**: muestra disuelta (a veces directa), inyector con jeringa o automático, arrastre por fase móvil, columna, detector
  - Factor clave: naturaleza de la fase móvil, además de presión y caudal
- **Tipos según fase móvil**
  - **Normal**: fase móvil y estacionaria polares
  - **Fase invertida o reversa**: móvil polar, estacionaria no polar, la más empleada
- **Modalidad**
  - **Isocrática**: composición constante
  - **Gradiente**: composición variable, más poder de separación, para polaridades muy distintas
- **Bomba de alta presión**: parte esencial, de su funcionamiento depende la separación
- **Columna**: no obligatoriamente termostatizada, la temperatura no es factor clave
  - Ayuda a reducir la viscosidad de la fase móvil y aumentar la solubilidad de la muestra
- **Principios de separación**
  - **Adsorción**: sólido activo polar (sílice, alúmina)
  - **Reparto**: líquido sobre soporte sólido, hoy **fases enlazadas** (compuesto ligado químicamente al soporte), retención según solubilidad
  - Intercambio iónico
  - Exclusión
- **Sistemas de detección**
  - Señal eléctrica continua, amplificada y registrada: cromatograma
  - Identificación por **tiempo de retención**, cuantificación por **área del pico**
  - Detectores **ópticos** (microcubeta atravesada por un rayo de luz)
    - **Índice de refracción**: mide el cambio frente a fase móvil pura, máxima sensibilidad con máxima diferencia muestra-fase móvil
    - **UV-visible**: absorción de energía por grupos funcionales, el más utilizado
    - **Fluorescencia**: tercer tipo más usado, compuestos fluorescentes naturales o por **derivatización**, muy selectivo

## 5.2. Aplicaciones en el ámbito alimentario

- **Aditivos**
  - Colorantes (UV-VIS a la longitud de onda del color, sin interferencias)
  - Conservantes: ácido sórbico y benzoico
  - **Tartracina**, usada para adulterar el poder colorante del **azafrán**, muy frecuente en el SOIVRE
- **Azúcares** (sacarosa, fructosa, glucosa): detector de índice de refracción
  - Composición o adición no declarada (azúcar en zumo)
- **Aminas biogénicas en pescados**: histamina, serotonina, tiramina y otras
  - Histamina elevada asociada a intoxicaciones
  - Derivatización y detector de **fluorescencia**
  - Muy frecuente en Vigo, Bilbao y Laboratorio Central
- **Residuos de plaguicidas**: la mayoría por gases, pero algunos por HPLC (se descomponen con el calor)
  - Plaguicidas **bencimidazólicos**
- **Vitaminas**: cereales de desayuno y lácteos, en el Laboratorio Central

## 5.3. Aplicaciones en el ámbito de la seguridad industrial

- **Colorantes azoicos** (**UNE-EN ISO 14362-1:2017**) en textiles y calzado, con detector UV-visible

# 6. CONCLUSIÓN

- Conjunto de técnicas más versátil y extendido en la Red SOIVRE
- Capa fina: cribado rápido y económico
- **Gases** y **HPLC**: complementarias, la elección depende de la naturaleza físico-química del analito
- Núcleo del control de residuos de plaguicidas, aditivos, contaminantes y aminas biogénicas
- Con espectrometría de masas, control de sustancias restringidas en textiles, calzado y juguetes
