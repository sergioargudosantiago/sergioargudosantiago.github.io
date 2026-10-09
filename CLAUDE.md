# CLAUDE.md

Contexto del proyecto para cualquier sesión de Claude Code, en local o en la nube.
**Este fichero es público** (el repositorio lo es y GitHub Pages sirve todo lo que hay
en él): aquí no van datos personales, rutas privadas ni nada que no pueda leer cualquiera.

## Qué es

Portal personal de Sergio Argudo Santiago (Inspector del SOIVRE). Tres pilares:

1. **Temario** de las oposiciones SOIVRE: temas y esquemas en PDF/Word (`public/temas/`).
2. **Comercio exterior**: visualizador interactivo de balanza comercial y balanza de
   pagos de España (`comercio-exterior.html`) con su ficha metodológica (`metodologia.html`).
3. **Artículos** de análisis, que se publican en la web y se difunden en LinkedIn.

Todo el contenido, la interfaz y los commits están en **español**.

## Stack y publicación

- HTML estático en GitHub Pages, sin framework. URL actual:
  <https://sergioargudosantiago.github.io/>.
- Tailwind compilado a `css/tailwind.css` (`npm run build:css`, fuente en `src/input.css`).
  Tras tocar clases de Tailwind en cualquier `.html` o `.js`, recompilar y commitear el CSS.
- Gráficos propios en SVG (`js/graficos.js`), sin dependencias, con la paleta única
  de `data/paleta.json` (`npm run paleta` la valida y la escribe como variables
  `--p-*` en `css/sitio.css`). Fuentes de Google: Atkinson Hyperlegible, Fraunces,
  IBM Plex Mono y Orbitron (ver «Aspecto» en Estado).
- Analítica: GoatCounter (sin cookies), comentado en cada página hasta que el autor
  cree la cuenta. Sin banner de cookies: la web no usa ninguna.
- GitHub Pages construye con **Jekyll** desde `main`. Jekyll publica todo lo
  versionado salvo lo que excluye `_config.yml` (scripts, código fuente, material de
  trabajo, `.md`). **Al añadir un fichero que no deba poder descargarse desde la web,
  añádelo a esa lista.** Ojo: el repositorio en sí es público en GitHub igualmente.
- Dominio propio: **`sergioargudo.es`** (decidido). Correo: `contacto@sergioargudo.es`.
  `scripts/cambiar-dominio.js --aplicar` cambia las URL en todo el repo de una pasada
  (canonical, og:url, sitemap, robots, feed, CNAME) e imprime los pasos de DNS.

## Mapa del repositorio

| Ruta | Qué es |
|---|---|
| `index.html`, `temario.html`, `sobre-mi.html`, `enlaces.html` | Páginas del sitio |
| `comercio-exterior.html`, `metodologia.html` | Visualizador y su metodología |
| `js/main.js` | Navegación, modales y **títulos oficiales del temario** (ejercicios 1, 3 y 5) |
| `js/graficos.js` | Gráficos SVG de la web (líneas, apiladas, ranking, mancuernas) |
| `data/` | Datos que carga la web (`balanza_data.js`, `flujos_data.csv`, correspondencias NC8) y la paleta (`paleta.json`) |
| `articulos/` | Artículos: los `.md` son la fuente; los `.html` se generan |
| `public/temas/ejercicio-N/` | PDFs y Word del temario |
| `scripts/` | Generadores y pipelines (Node y R) |
| `balanza/` | CSV del BdE y comprobaciones cruzadas (material de trabajo) |
| `.claude/agents/esquema-ejercicio-1.md` | Agente que redacta esquemas del ejercicio 1 (única parte de `.claude/` versionada, a propósito) |

No versionados (ver `.gitignore`): `review/`, `docs/`, `fuentes/`, el resto de `.claude/`.
Viven solo en la máquina local; una sesión en la nube no los tiene.

## Flujos de trabajo

- **Cabecera, pie y fuentes comunes**: viven en `src/parciales/` (`cabecera.html`,
  `pie.html`, `recursos.html`) y en las páginas van entre marcas
  `<!-- nombre:inicio -->` / `<!-- nombre:fin -->`. **No editarlos en las páginas**:
  cambiar el parcial y ejecutar `npm run parciales` (páginas sueltas + artículos).
  Los estilos comunes del diseño C están en `css/sitio.css`, que se carga el último.
  Una página ya migrada al diseño C lleva `<body class="c-pagina">`.

- **Artículos**: escribir `articulos/<slug>.md` con frontmatter y ejecutar
  `npm run articulos`. Genera el `.html`, el índice, `feed.xml`, las entradas del
  sitemap y un borrador de post de LinkedIn en `review/linkedin/`. **No editar a mano
  los `.html` de `articulos/`**. Formato completo en `articulos/README.md`.
  Los gráficos interactivos salen de R (ggiraph) como fragmentos en `articulos/fragmentos/`.
- **Balanza de pagos**: `npm run balanza` descarga de la API del Banco de España,
  valida y regenera `data/balanza_data.js` y las fichas (Node ≥ 18, sin dependencias).
  `npm run balanza:comprobar` valida sin escribir. Las validaciones están en
  `scripts/lib/validar-balanza.js` (identidades contables, huecos, nulos, historia
  perdida frente al fichero anterior); con cualquier error no se toca el fichero.
  El informe, con las revisiones del BdE, queda en `review/balanza/`. `npm test`
  prueba el validador. La web solo lee `data/balanza_data.js`: no llama a la API.
- **Gráficos y colores**: los colores de datos solo se cambian en `data/paleta.json`
  y luego `npm run paleta` (comprueba contraste ≥ 3:1 en claro y oscuro) y
  `npm run fichas`. Los titulares de los gráficos se calculan con los datos. Para
  revisarlos: `npm run capturas` (Playwright) deja capturas a 375 y 1280 px, en claro
  y oscuro, en `review/capturas/`. Cómo usar la paleta en R: `articulos/README.md`.
- **Flujos comerciales**: `data/flujos_data.csv` y
  `data/correspondencias-sectores-nc8.csv` salen de un pipeline privado del autor que
  **no está en este repositorio** (a propósito: solo se publican los CSV). Lee la
  estadística de Aduanas, valida cobertura, cuota UE y desgloses antes de escribir y
  sustituye los dos ficheros enteros. No editarlos a mano. Tras regenerarlos:
  `npm run fichas && npm run fichas:pdf`.
- **Temario**: `npm run temas:revisar` extrae texto de los PDF y lanza la auditoría
  determinista (`scripts/auditar-temas.js`); la salida va a `review/`.
- **Fichas del temario** (ejercicio 1, temas 1–20): `npm run fichas` genera
  `public/fichas/tema-NN.html` (tres páginas A4: resumen, exportación e importación
  por subsector) desde `data/flujos_data.csv`; qué rúbricas forman cada tema está en
  `scripts/fichas/temas.json` (admite filtros por lv4 y `renombrarGrupo`; los
  frutos secos se separan por TARIC en el pipeline privado). También rellena el
  listado de `fichas.html`. `npm run fichas:pdf` saca los PDF en
  `public/fichas/pdf/` (necesita Playwright). Regenerarlas cada vez que cambien los
  datos. Las «claves para el tema» se redactan con reglas fijas: leerlas antes de
  publicar. El mismo `npm run fichas` ejecuta `scripts/generar-fichas-balanza.js`,
  que saca de `data/balanza_data.js` tres fichas de dos páginas: `bp-balanza.html`
  (ej. 3, tema 2), `bp-turismo.html` (ej. 1, tema 23) y `bp-servicios.html`
  (ej. 1, tema 24). Solo usan años completos. Tras actualizar la balanza:
  `npm run fichas && npm run fichas:pdf`.
- **Esquemas del ejercicio 1**: el agente `esquema-ejercicio-1` destila exclusivamente
  los temas del opositor; no investiga ni añade materia. Sin fuente, no escribe.
- Servir en local: `python -m http.server 8000`.

## Convenciones

- Commits: `tipo: frase en español` (`feat`, `fix`, `chore`, `docs`, `style`,
  `revert`; ámbito opcional, p. ej. `fix(comercio exterior): ...`). La frase describe
  el efecto para quien usa la web, no el cambio de código.
- Las cifras publicadas citan fuente oficial (DataComex, AEAT, BdE, INE, Eurostat,
  Census) y periodo. Si un dato no se puede verificar, no se publica.
- La navegación, el pie y las fuentes salen de `src/parciales/`; el resto del
  `<head>` (meta, Open Graph) sigue siendo propio de cada página.
- El dominio absoluto aparece en canonical, Open Graph, sitemap, robots y feed:
  no escribirlo a mano, usar `scripts/cambiar-dominio.js`.

## Estado

Fase actual: **revisión previa a la publicación**. Lanzamiento previsto: semana del
12 de octubre de 2026.

Decisiones tomadas con el autor (octubre 2026):

- Público principal: **opositores SOIVRE y gente interesada en el comercio
  internacional**. La marca personal es consecuencia, no objetivo.
- Los temas y esquemas de `public/temas/` son del autor y se publican.
- Scripts y material de trabajo fuera del sitio; solo se publican los datos públicos
  (`data/`).
- Ritmo de artículos: **dos al mes**, cada uno con su post de LinkedIn el mismo día.
- Aspecto: **opción C, híbrido**. Base sobria y muy legible para datos y artículos
  (fondo claro, Atkinson Hyperlegible para texto, Fraunces para titulares, IBM Plex
  Mono para cifras); el verde salvia (`#3B4533` / `#C2D9C2`) pasa a barra de
  navegación y acentos; la estética arcade (Orbitron, cajas con sombra de píxel) se
  reserva para la marca y para lo de estudio (temario, esquemas, progreso). El logo
  del barco se mantiene. Maquetas: <https://claude.ai/artifact/5P7JjrFa9vqEyPvYTBVEpR>
  (privado, del autor).

## Plan de lanzamiento (octubre 2026)

Lanzamiento el **martes 13 de octubre** (el lunes 12 es festivo nacional).
Trabajo en la rama `claude/epic-edison-9bfk3y`; se fusiona en `main` el día 12.

Hecho el 7 de octubre:
- [x] `CLAUDE.md`, `_config.yml` (la web solo sirve el sitio), `.gitignore` limpio.
- [x] Dominio y correo pasados a `sergioargudo.es`.
- [x] Fichero temporal de Excel borrado.

Pendiente, por orden:
1. **Autor**: comprar `sergioargudo.es` (Cloudflare no vende `.es`: comprarlo en
   otro registrador y, si se quiere el correo gratis, delegar el DNS en Cloudflare).
2. ~~**Diseño C**~~ (hecho el 7 oct): las 7 páginas y los artículos en diseño C,
   parciales comunes, Tailwind recompilado (solo las clases en uso) y fuentes
   recortadas a Atkinson Hyperlegible, Fraunces, IBM Plex Mono y Orbitron.
   Gráficos de comercio exterior con la paleta `--g-*` de `css/sitio.css`.
3. ~~**Cookies**~~ (hecho el 7 oct): fuera el banner; la web no usa cookies (solo
   guarda el tema claro/oscuro en el navegador). GoatCounter sigue comentado en
   cada página: activarlo exige crear la cuenta (decisión del autor).
4. **Pendiente de decidir con el autor**: aviso legal y privacidad mínimos; si
   se activa GoatCounter; nota de autoría de los temas (el temario dice que se
   basa en los temas de su preparador).
5. ~~Gráfico de dos ejes Y de la balanza~~ (hecho el 9 oct): sustituido por dos
   paneles con la misma escala al rehacer los gráficos.
6. ~~**Revisión técnica**~~ (hecho el 7 oct): axe WCAG 2 AA sin fallos en las 8
   páginas (claro y oscuro), enlaces internos y 202 descargas del temario
   comprobados, títulos y descripciones unificados. **Pendiente**: los ~26
   enlaces externos, que la red de la sesión en la nube no deja comprobar
   (hacerlo en local o abriéndolos a mano).
7. **Autor**: leer todos los textos el fin de semana.
8. **Día 12**: fusionar en `main`, `node scripts/cambiar-dominio.js --aplicar`,
   DNS, HTTPS obligatorio, Google Search Console, sitemap.
9. **Día 13**: lanzamiento y post de LinkedIn presentando la web.

## Trabajo abierto (8 de octubre)

**Para retomar en otro ordenador** (p. ej. el del trabajo, con la cuenta personal
de GitHub): `git clone` del repositorio, `git checkout claude/epic-edison-9bfk3y`,
`git config user.name/user.email` con los datos personales (no los del trabajo),
`npm install`. Todo lo hecho hasta el 8 de octubre está en esa rama. Primer
trabajo recomendado allí: `npm run fichas:pdf` (los datos ya están
regenerados, ver «Datos de flujos regenerados»); después, modernizar los gráficos y el
artículo que tiene pensado el autor. Para generar los PDF hace falta Playwright
(`npm install --no-save playwright && npx playwright install chromium`).

- **Fichas imprimibles del temario** (PDF A4 para opositores). Maquetas en
  <https://claude.ai/artifact/8Ro5mduFV3chbV2ncRfw6g> (privado): formato en tablas,
  en gráficos y mixto (KPI + gráfico + claves + hueco para notas) con el tema 6;
  índice de los temas 1–20 del ejercicio 1 y 23–24 con su encaje en las rúbricas
  de DataComex; cítricos (tema 2) y turismo (tema 23, balanza de pagos).
  **Elegido el formato C** (8 oct), ampliado: pág. 1 resumen; pág. 2 exportación
  y pág. 3 importación por subcategoría (nivel 3 de DataComex), cada una con valor,
  variación frente al año anterior (calculada sobre el valor), cuota UE y tres
  principales destinos u orígenes. Ojo: en los sectores con nivel 4 (cítricos…)
  el CSV repite en cada hijo los países, la cuota UE y la TVA del padre; para
  esas filas solo el valor es propio. **Hechas** (8 oct) las 20 fichas de comercio
  y las 3 de balanza de pagos, con sus PDF. El listado está en la página
  `fichas.html` (diseño C, enlazada desde `temario.html`), que `npm run fichas`
  rellena entre las marcas `fichas:inicio`/`fichas:fin`. Pendiente: que el autor
  revise las claves.
- **Visualizaciones nuevas** (móvil primero) en
  <https://claude.ai/artifact/2fRUYTb3vMTJCnbyV63fGN> (privado): mosaico de sectores,
  mariposa exportación/importación, crecimiento, cuota UE, fichas con evolución,
  cascada de la balanza, calendario mensual e historias deslizables. Pendiente de
  que el autor elija cuáles llevar a `comercio-exterior.html`.
- ~~**Modernizar los gráficos**~~ (hecho el 9 oct): `comercio-exterior.html` ya no usa
  Chart.js. Flujos: exportaciones e importaciones con la banda de saldo. Balanza:
  suma móvil de 12 meses, saldos apilados, ranking de turismo por país, ingresos y
  pagos por tipo de servicio y turismo frente al resto. Paleta única para web,
  fichas y artículos (el artículo de los 5 gráficos debe usarla).
- **Datos de flujos regenerados** (9 oct): el CSV anterior tenía desgloses de
  nivel 4 inventados (reparto fijo), cuota UE sin Rumanía, plátano, tomate y aceite
  de oliva 2021–2023 incompletos (TVA de +500 % falsas) y años de descargas
  distintas. Ahora todo sale de una sola extracción validada, con TVA también en
  2021 y columna `estado` (definitivo/provisional). Pendiente: `npm run fichas:pdf`.
- **Esquemas del ejercicio 1**: no están en el repositorio. Solo hubo seis
  borradores (temas 25–30), descartados en septiembre por no salir de los temas
  del opositor. Si existen, están en la máquina local (`review/`, `fuentes/` o
  `D:\BLOQUE 1`).

Después del lanzamiento: actualización mensual de la balanza de pagos con GitHub
Actions y validaciones; página «qué ha cambiado» en el temario. El chat con IA sobre
los temas queda aparcado (necesita servidor y API de pago).

## Calendario de artículos

Dos al mes, martes, con post de LinkedIn el mismo día (`npm run articulos` genera el
borrador). Comprobar normativa y datos vigentes antes de redactar cada uno.

| Fecha | Artículo | Base |
|---|---|---|
| 13 oct | Post de lanzamiento (solo LinkedIn) | — |
| 27 oct | Por qué dos estadísticas oficiales no dan la misma cifra de exportaciones | `balanza/informe_discrepancias_agroalimentario.md` |
| 10 nov | Qué mide (y qué no) la cuota UE de un sector | `metodologia.html` |
| 24 nov | La balanza de pagos de España en 2026 | `data/balanza_data.js` |
| dic | Aranceles de EE. UU., segunda parte | artículo de julio y sus scripts de R |
| dic | CBAM en su periodo definitivo | temario ej. 3 |
| ene | Qué hace un inspector del SOIVRE | experiencia del autor |
| ene | CITES y comercio de especies | bloque piloto temas 25–30 |
| después | Cómo consultar DataComex en 10 minutos; serie para opositores | — |
