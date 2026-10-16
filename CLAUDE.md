# CLAUDE.md

Contexto del proyecto para cualquier sesión de Claude Code, en local o en la nube.
**Este fichero es público** (el repositorio lo es y GitHub Pages sirve todo lo que hay
en él): aquí no van datos personales, rutas privadas ni nada que no pueda leer cualquiera.

## Qué es

Portal personal de Sergio Argudo Santiago (Inspector del SOIVRE), publicado en
<https://sergioargudo.es/> desde el 13 de octubre de 2026. Tres pilares:

1. **Esquemas** de las oposiciones al Cuerpo de Inspectores del SOIVRE
   (`esquemas.html`, `public/temas/`) y **fichas** de datos por tema (`fichas.html`,
   `public/fichas/`).
2. **Comercio exterior**: visualizador interactivo de balanza comercial y balanza de
   pagos de España (`comercio-exterior.html`) con su ficha metodológica (`metodologia.html`).
3. **Artículos** de análisis, que se publican en la web y se difunden en LinkedIn.

Objetivo: **divulgación**. Por orden: reconocimiento profesional y difusión del cuerpo,
y ayudar a quien oposita. La web no vende nada: sin precios ni llamadas a apuntarse.
Públicos: opositores, gente que quiere saber qué es el SOIVRE y gente que busca datos
de comercio exterior.

Todo el contenido, la interfaz y los commits están en **español**.

## Stack y publicación

- HTML estático en GitHub Pages, sin framework. `sergioargudosantiago.github.io` y `www`
  redirigen a `sergioargudo.es` (HTTPS obligatorio).
- Tailwind compilado a `css/tailwind.css` (`npm run build:css`, fuente en `src/input.css`).
  Tras tocar clases de Tailwind en cualquier `.html` o `.js`, recompilar y commitear el CSS.
- Gráficos propios en SVG (`js/graficos.js`), sin dependencias, con la paleta única
  de `data/paleta.json` (`npm run paleta` la valida y la escribe como variables
  `--p-*` en `css/sitio.css`). Fuentes servidas desde la propia web (`fonts/` y
  `css/fuentes.css`, solo latin y latin-ext; la web no llama a Google): Newsreader
  (titulares), Public Sans (texto), IBM Plex Mono (cifras) y Orbitron (marca).
- Analítica: GoatCounter, sin cookies. Lo cargan el parcial `src/parciales/recursos.html`
  y `scripts/generar-esquemas.js`, solo si el host es `sergioargudo.es`; las descargas
  cuentan como eventos `descarga: <ruta>`. Sin banner: la web no usa cookies (solo guarda
  el tema claro/oscuro en `localStorage`). **Cualquier servicio externo nuevo se declara
  antes en `legal.html`.**
- GitHub Pages construye con **Jekyll** desde `main`. Jekyll publica todo lo
  versionado salvo lo que excluye `_config.yml` (scripts, código fuente, material de
  trabajo, `.md`). **Al añadir un fichero que no deba poder descargarse desde la web,
  añádelo a esa lista.** Ojo: el repositorio en sí es público en GitHub igualmente.
- Dominio: **`sergioargudo.es`**. Correo: `contacto@sergioargudo.es`.
  `scripts/cambiar-dominio.js --aplicar` cambia las URL en todo el repo de una pasada
  (canonical, og:url, sitemap, robots, feed, CNAME).

## Mapa del repositorio

| Ruta | Qué es |
|---|---|
| `index.html`, `esquemas.html`, `fichas.html`, `sobre-mi.html`, `enlaces.html`, `legal.html` | Páginas del sitio. `temario.html` solo redirige a `esquemas.html` (conserva `?q=`) |
| `comercio-exterior.html`, `metodologia.html` | Visualizador y su metodología |
| `js/main.js` | Navegación, modales y listado de esquemas |
| `js/esquemas-fechas.js`, `js/esquemas-programa.js` | Generados por `npm run esquemas -- --publicar`: no editar |
| `js/graficos.js` | Gráficos SVG de la web (líneas, apiladas, ranking, mancuernas) |
| `data/` | Datos que carga la web (`balanza_data.js`, `flujos_data.csv`) y la paleta (`paleta.json`) |
| `articulos/` | Artículos: los `.md` son la fuente; los `.html` se generan |
| `temas/ejercicio-N/tema-NN.md` | Esquemas en Markdown: la fuente de `public/temas/` |
| `temas/actualizado.json`, `temas/programa.json` | Fecha de cada esquema rehecho y enunciados oficiales del BOE |
| `public/temas/ejercicio-N/` | Esquemas publicados (HTML y PDF) y los Word/PDF antiguos que quedan |
| `public/fichas/` | Fichas por tema (HTML y PDF) |
| `scripts/` | Generadores y pipelines (Node) |
| `balanza/` | CSV del BdE y comprobaciones cruzadas (material de trabajo) |

No versionados (ver `.gitignore`): `review/`, `docs/`, `fuentes/`, `.claude/`.
Viven solo en la máquina local; una sesión en la nube no los tiene.

## Flujos de trabajo

- **Cabecera, pie y fuentes comunes**: viven en `src/parciales/` (`cabecera.html`,
  `pie.html`, `recursos.html`) y en las páginas van entre marcas
  `<!-- nombre:inicio -->` / `<!-- nombre:fin -->`. **No editarlos en las páginas**:
  cambiar el parcial y ejecutar `npm run parciales` (páginas sueltas + artículos).
  Los estilos comunes del diseño C están en `css/sitio.css`, que se carga el último.
  Una página en diseño C lleva `<body class="c-pagina">`.
- **Artículos**: escribir `articulos/<slug>.md` con frontmatter y ejecutar
  `npm run articulos`. Genera el `.html`, el índice, `feed.xml`, las entradas del
  sitemap, el bloque de último artículo de la portada (marcas `ultimo-articulo:`) y un
  borrador de post de LinkedIn en `review/linkedin/`. **No editar a mano los `.html` de
  `articulos/`**. Formato completo en `articulos/README.md`. Los gráficos interactivos
  salen de R (ggiraph) como fragmentos en `articulos/fragmentos/`.
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
- **Marca**: la geometría y los colores del símbolo (la S de intercambio: arriba sale,
  abajo entra, el trazo central es el saldo) están en `scripts/lib/simbolo.js`.
  `npm run marca` reescribe los SVG de `logos/` y el banner de LinkedIn;
  `npm run marca:png` saca PNG, `favicon.ico`, `apple-touch-icon.png`,
  `images/og-cover.png` y el PNG del banner en `review/linkedin/` (necesita Playwright y
  conexión). Si cambia el icono, subir `?v=N` en los tres enlaces de iconos (PNG,
  `favicon.ico` y `apple-touch-icon.png`) de las páginas y de `scripts/build-articulos.js`.
- **Flujos comerciales**: `data/flujos_data.csv` sale de un pipeline privado del autor
  que **no está en este repositorio** (a propósito: solo se publica el CSV, que el
  visualizador lee con `fetch`; no se ofrece como descarga). Lee la estadística de
  Aduanas, valida cobertura, cuota UE y desgloses antes de escribir y sustituye el
  fichero entero. No editarlo a mano. La correspondencia de sectores con códigos NC8
  **no se publica**. Tras regenerarlos: `npm run fichas && npm run fichas:pdf`.
- **Fichas** (ejercicio 1, temas 1–20, más tres de balanza de pagos): `npm run fichas`
  genera `public/fichas/tema-NN.html` (resumen, exportación e importación por
  subsector) desde `data/flujos_data.csv`, según `scripts/fichas/temas.json`, y
  `scripts/generar-fichas-balanza.js` saca `bp-balanza.html` (ej. 3, tema 2),
  `bp-turismo.html` (ej. 1, tema 23) y `bp-servicios.html` (ej. 1, tema 24), solo con
  años completos. También rellena `fichas.html` (marcas `fichas:`). `npm run fichas:pdf`
  saca los PDF en `public/fichas/pdf/`. Regenerarlas cada vez que cambien los datos.
  Las «claves para el tema» se redactan con reglas fijas: leerlas antes de publicar.
- **Esquemas**: los Markdown de `temas/` son la fuente. Los agentes que los crean y los
  contrastan con los temas desarrollados, y los propios temas, son **privados**: no
  están en este repositorio ni deben subirse a él. Plantilla en
  `scripts/generar-esquemas.js` (`npm run esquemas`) y PDF en `scripts/esquemas-pdf.js`
  (`npm run esquemas:pdf`; `CHROMIUM=<ruta>` usa un Chromium ya instalado). Por defecto
  escriben en `review/esquemas/`; `-- 1/6` hace solo un tema; `--publicar` escribe en
  `public/temas/` solo los que tienen fecha en `temas/actualizado.json`. Un
  `![pie](fichero.png)` solo en su línea mete una figura (el fichero va junto al `.md`).
  **Para pasar un esquema al formato nuevo**: rehacerlo y sellar su fecha en el
  repositorio privado, `npm run esquemas -- --publicar && npm run esquemas:pdf --
  --publicar`, restaurar con `git checkout` los HTML/PDF de otros temas que solo cambian
  de fin de línea, borrar de `public/temas/ejercicio-N/` su `ESQUEMA TEMA N.docx` y su
  `TEMA N. ….pdf`, y actualizar las cifras de las tarjetas de `esquemas.html` y de la
  portada.
- **Auditoría de temas**: `npm run temas:revisar` extrae texto de los PDF antiguos y
  lanza `scripts/auditar-temas.js`; la salida va a `review/`.
- Servir en local: `python -m http.server 8000`. Para PDF y capturas hace falta
  Playwright (`npm install --no-save playwright && npx playwright install chromium`).

## Convenciones

- Commits: `tipo: frase en español` (`feat`, `fix`, `chore`, `docs`, `style`,
  `revert`; ámbito opcional, p. ej. `fix(comercio exterior): ...`). La frase describe
  el efecto para quien usa la web, no el cambio de código.
- Las cifras publicadas citan fuente oficial (Aduanas/AEAT, BdE, INE, Eurostat,
  Census) y periodo. Si un dato no se puede verificar, no se publica.
- **DataComex no se cita como fuente** en `comercio-exterior.html`, `metodologia.html` ni en el
  pie (decisión del autor, 15 oct): ahí la fuente de los flujos es la estadística de comercio
  exterior de Aduanas (AEAT) y el enlace va a la Agencia Tributaria. Esquemas, fichas,
  enlaces y artículos pueden seguir citándolo.
- **La web ofrece esquemas, no temario**: la palabra «temario» no aparece en nada que lea
  el visitante, salvo la fórmula «Esquemas del temario de Inspectores del SOIVRE».
  Código interno sin renombrar.
- Los temas se nombran con el enunciado oficial del anexo I de la convocatoria
  (BOE-A-2025-26899), en `temas/programa.json` (lo escribe `scripts/programa-boe.js`).
  Se enseñan con dos pesos (`scripts/lib/enunciado.js`). Los `EXERCISE_N_TITLES` de
  `js/main.js` solo dan el nombre de fichero de los PDF antiguos: no tocarlos mientras
  quede alguno.
- La navegación, el pie y las fuentes salen de `src/parciales/`; el resto del
  `<head>` (meta, Open Graph) sigue siendo propio de cada página.
- El dominio absoluto aparece en canonical, Open Graph, sitemap, robots y feed:
  no escribirlo a mano, usar `scripts/cambiar-dominio.js`.
- Aspecto: **diseño C, híbrido**. Base sobria para datos y artículos (fondo claro,
  Public Sans, Newsreader, IBM Plex Mono); verde salvia (`#3B4533` / `#C2D9C2`) en la
  barra y los acentos; la estética arcade (Orbitron, sombra de píxel) solo para la marca
  y lo de estudio (esquemas, fichas).

## Estado (16 de octubre de 2026)

- **Esquemas**: 159 en total. Formato nuevo (en línea y PDF, con fecha): ejercicio 1
  completo (55) y ejercicio 3 salvo los temas 47 a 53 (51 de 58). El ejercicio 5 (46) y
  los temas 47 a 53 del ejercicio 3 siguen con Word y PDF antiguos y el listado dice
  «En actualización».
- **Artículos**: ninguno publicado todavía; el feed está vacío.
- **SEO**: la rama `claude/seo-indexar-esquemas` (esquemas y fichas indexables, sitemap
  de 122 URL) está sin fusionar y por detrás de `main`.

## Pendiente

Por decidir o por hacer, sin orden de prioridad salvo la primera:

1. **Calendario del 27 de octubre**: el `.md` de los 5 gráficos lleva esa fecha y la
   tabla de abajo ponía el de las dos estadísticas. Elegir uno y mover el otro.
2. **Novedades**: página y bloque en portada que se escriban solos (fechas de
   `temas/actualizado.json`, artículos y datos). Maquetas con tres alternativas de
   portada y tres de novedades: <https://claude.ai/artifact/HtiZLR1ksKyp9BKy8XLMs2>
   (privado, del autor).
3. **Portada**: hoy solo habla a opositores; abrirla a quien busca datos y al cuerpo
   (mismas maquetas).
4. **SEO**: fusionar o rehacer la rama de indexación y añadir enlaces visibles a cada
   tema en `esquemas.html` (hoy solo aparecen al pulsar la tarjeta).
5. **Balanza de pagos mensual con GitHub Actions**, con las validaciones actuales.
6. **Visualizaciones nuevas** por elegir: <https://claude.ai/artifact/2fRUYTb3vMTJCnbyV63fGN>
   (privado).
7. **Autor**: revisar las «claves para el tema» de las fichas.
8. Comprobar los enlaces externos (desde una red que llegue a ellos).
9. Cuando no quede ningún esquema antiguo, adaptar `scripts/extraer-temas.sh` (lee
   `TEMA N.….pdf`) y los textos de `scripts/auditar-temas.js` que hablan del `.docx`.
10. Ramas locales `articulo-5-graficos`, `dominio` y `claude/epic-edison-9bfk3y`: del
    historial anterior a la reescritura del 10 de octubre; borrarlas si el autor lo confirma.

Aparcado: chat con IA sobre los temas (necesita servidor y API de pago).

## Calendario de artículos

Dos al mes, martes, con post de LinkedIn el mismo día (`npm run articulos` genera el
borrador). Comprobar normativa y datos vigentes antes de redactar cada uno.

| Fecha | Artículo | Base |
|---|---|---|
| 27 oct | El comercio exterior español en 5 gráficos (fecha del `.md`; ver Pendiente 1) | `articulos/comercio-exterior-5-graficos.md` |
| por fijar | Por qué dos estadísticas oficiales no dan la misma cifra de exportaciones | `balanza/informe_discrepancias_agroalimentario.md` |
| 10 nov | Qué mide (y qué no) la cuota UE de un sector | `metodologia.html` |
| 24 nov | La balanza de pagos de España en 2026 | `data/balanza_data.js` |
| dic | Aranceles de EE. UU., segunda parte | artículo de julio y sus scripts de R |
| dic | CBAM en su periodo definitivo | esquemas del ej. 3 |
| ene | Qué hace un inspector del SOIVRE | experiencia del autor |
| ene | CITES y comercio de especies | esquemas del ej. 1, temas 25–30 |
| después | Cómo consultar DataComex en 10 minutos; serie para opositores | — |
