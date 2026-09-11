# Arranque del ejercicio 1

Los 55 temas del primer ejercicio no tienen esquema. Ni uno. Es el hueco más grande del
temario y el único que no se arregla revisando: hay que escribirlo. Este documento fija
cómo, en qué orden y a qué coste.

## Por qué va aparte del resto de la revisión

`review/README.md` describe un proceso de **revisión**: hay 101 esquemas en los ejercicios
3 y 5, se extraen a texto, se auditan con reglas y solo lo que queda pasa por un modelo.
El ejercicio 1 es el problema inverso, de **generación**, y recorre el mismo pipeline al
revés:

```
escribir .docx  →  exportar .pdf  →  npm run temas:revisar  →  entra en el ledger
```

De ahí una regla que evita autoengañarse: **un tema no está hecho hasta que aparece en
`review/estado.json` con su hash**. Mientras solo exista un borrador, no cuenta. La
auditoría es la que decide, no quien escribe.

Hoy la maquinaria ni siquiera mira aquí: `scripts/extraer-temas.sh` recorre los
subdirectorios de `public/temas/`, y `ejercicio-1` no existe todavía. Lo único que sabe
decir `scripts/auditar-temas.js` del primer ejercicio es «faltan los 55».

## Los siete bloques

Los títulos oficiales son los de `EXERCISE_1_TITLES` en `js/main.js`. Agrupados por lo que
comparten, no por su número:

| Bloque | Temas | Materia | Marco normativo común |
|---|---|---|---|
| A | 1–13 | Sectores agroalimentarios | OCM única (Reglamento (UE) 1308/2013), normas de calidad |
| B | 14–20 | Energía, semimanufacturas, bienes de equipo y de consumo | Nomenclatura Combinada, TARIC |
| C | 21–24 | Comercio de servicios | GATS, BPM6, FRONTUR/EGATUR |
| D | 25–30 | CITES | Convenio + Reglamento (CE) 338/97 y Reglamento (CE) 865/2006 |
| E | 31–40 | Muestreo, análisis instrumental y laboratorio | ISO/IEC 17025, incertidumbre de medida |
| F | 41–44 | Normalización | CODEX, CEPE/NU, ISO, CEN, UNE |
| G | 45–55 | Control oficial, calidad comercial y APPCC | Reglamento (UE) 2017/625, Reglamento (CE) 852/2004 |

Agrupar importa por la misma razón que los lotes del README: el marco normativo se carga
una vez por bloque y no 55 veces. Los seis temas de CITES se apoyan en los mismos dos
reglamentos; escribirlos seguidos cuesta bastante menos que escribirlos sueltos.

**Orden de ataque: D primero.** Seis temas, fuente única, y es la materia que menos se
mueve de año en año. Sirve de piloto para medir el coste real antes de comprometerse con
los otros 49, igual que el lote 1 hace en la revisión. Después F, G, C, E, A, B — de lo
más estable a lo que más depende de datos que caducan.

## Cómo es un esquema

La plantilla no se inventa: se copia de los que ya existen. Tomando `ESQUEMA TEMA 21.docx`
del ejercicio 3 como referencia, un esquema es

- **de 800 a 1.200 palabras**, un centenar de líneas;
- **seis a ocho secciones numeradas**, la primera `1. Introducción` y la última
  `N. Conclusión`;
- con **subsecciones `4.1.`, `4.2.`** donde la materia lo pide, no sistemáticamente;
- escrito en **líneas telegráficas**, del tipo `Concepto: definición corta.`, sin párrafos
  de prosa. Es material para memorizar y cantar, no para leer;
- y cerrado con una conclusión que ancla el tema en la actualidad (un dato, una cifra, una
  reforma reciente).

Por debajo de 800 palabras el esquema se queda corto para veinte minutos de exposición, y
además dispara el aviso de «anormalmente corto» de la auditoría. La cuenta de
`review/estado.json` sale algo más alta que la del `.docx` porque mide el texto extraído
del PDF, que arrastra la cabecera de la primera página.

### Reglas de forma que comprueba la auditoría

Estas cuatro no son preferencias de estilo: `scripts/auditar-temas.js` las mira, y saltan
en el informe si se incumplen.

- **Con tildes.** Los 98 de 101 esquemas con tildes perdidas son deuda heredada de una
  exportación mal hecha. Los del ejercicio 1 no tienen por qué nacer con ella: `produccion`,
  `analisis`, `regimen` o `Espana` se marcan solos.
- **Citas normativas en la forma canónica** — `Reglamento (UE) 2017/625`,
  `Real Decreto 1/2024`, `Ley Orgánica 3/2018` — para que entren en el listado de normativa
  agrupado por tema, que es lo más útil del informe cuando toque reauditar.
- **Estadísticas con año y fuente explícitos.** Se dan por caducadas a los tres años, así
  que conviene que se vean: una cifra sin año no se puede revisar después.
- **Nada de UE-28, NAFTA ni Tratado de Niza** como marco vigente. Si aparecen, que sea en
  contexto histórico declarado.

## Nombres de fichero

Es lo que más fácil se rompe, porque `generateTopics()` en `js/main.js` construye **dos
nombres distintos** para el mismo tema:

- **Word:** `public/temas/ejercicio-1/ESQUEMA TEMA <n>.docx` — nombre plano, sin título.
- **PDF:** `public/temas/ejercicio-1/TEMA <n>. <título normalizado>.pdf` — el título oficial
  sin tildes (normalización NFD), con los `:` convertidos en `.`, sin los caracteres
  ilegales de Windows y sin punto final.

Para el tema 25, cuyo título oficial es `El Convenio CITES: Objetivos y estructura.`:

```
ESQUEMA TEMA 25.docx
TEMA 25. El Convenio CITES. Objetivos y estructura.pdf
```

Dos detalles que se pasan por alto: la conversión de `:` en `.` **no recapitaliza** lo que
venía detrás (por eso en el ejercicio 3 existe `TEMA 35. La cooperacion economica
internacional. el FMI.pdf`, con `el` en minúscula), y `extraer-temas.sh` deduce el número
de tema del nombre del PDF. Un fichero que no empiece por `TEMA <n>` se omite con un aviso
en stderr y nadie se entera.

## Lista de comprobación por tema

1. `.docx` en `public/temas/ejercicio-1/` como `ESQUEMA TEMA <n>.docx`.
2. Exportar a PDF con el nombre normalizado. Comprobar que las tildes sobreviven a la
   exportación: ahí es donde se perdieron las de los ejercicios 3 y 5.
3. Marcar el tema como disponible en `js/main.js`. Hoy la rama `exerciseNumber === 1` de
   `generateTopics()` está vacía a propósito y deja los 55 en `coming-soon`; hay que
   sustituirla por una lista explícita de temas publicados, al estilo de lo que ya hace el
   ejercicio 3 con sus tres descartes.
4. `npm run temas:revisar` y verificar que el tema sale en `review/estado.json` con hash,
   palabras y avisos, y que no arrastra avisos nuevos.

## Coste

Valen las reglas del paso 3 del README, con una diferencia que cambia el cálculo: **generar
cuesta bastante más que revisar**. En la revisión la salida es un JSONL de hallazgos, cuatro
campos por incidencia; aquí la salida es el esquema entero, mil palabras por tema, y los
tokens de salida son los caros. Un ejercicio completo son 55 esquemas de mil palabras.

De ahí que el bloque piloto no sea opcional: escribir los seis de CITES, medir lo que ha
costado de verdad, y solo entonces decidir sobre los 49 restantes. Si el coste por tema no
compensa, la alternativa no es rebajar la calidad del esquema sino reducir el alcance —
elegir qué bloques merecen esquema propio.

## Estado

| Bloque | Temas | Estado |
|---|---|---|
| D · CITES | 25–30 | pendiente (piloto) |
| F · Normalización | 41–44 | pendiente |
| G · Control oficial y calidad | 45–55 | pendiente |
| C · Servicios | 21–24 | pendiente |
| E · Laboratorio | 31–40 | pendiente |
| A · Agroalimentario | 1–13 | pendiente |
| B · Industrial | 14–20 | pendiente |

Esquemas del ejercicio 1 publicados: **0 de 55**.
