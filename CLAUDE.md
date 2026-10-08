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
- Chart.js por CDN (jsDelivr). Fuentes de Google: Atkinson Hyperlegible, Fraunces,
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
| `js/data-visualization.js`, `js/bde-api.js` | Gráficos; refresco de balanza de pagos desde la API del BdE |
| `data/` | Datos que carga la web (`balanza_data.js`, `flujos_data.csv`, correspondencias NC8) |
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
- **Balanza de pagos**: `node scripts/update_balanza_data.js` (Node ≥ 18, sin
  dependencias) regenera `data/balanza_data.js` desde la API del Banco de España.
- **Flujos comerciales**: `scripts/generate_flujos_data.R` (paquete `comerciotools`,
  ruta de Windows fija) regenera los datos de `comercio-exterior.html`. Se ejecuta en la
  máquina local.
- **Temario**: `npm run temas:revisar` extrae texto de los PDF y lanza la auditoría
  determinista (`scripts/auditar-temas.js`); la salida va a `review/`.
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
5. Gráfico «Servicios turísticos y no turísticos» de la balanza: usa dos ejes Y
   (barras en M€ y línea en %). Convendría partirlo en dos gráficos.
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

- **Fichas imprimibles del temario** (PDF A4 para opositores). Maquetas en
  <https://claude.ai/artifact/8Ro5mduFV3chbV2ncRfw6g> (privado): formato en tablas,
  en gráficos y mixto (KPI + gráfico + claves + hueco para notas) con el tema 6;
  índice de los temas 1–20 del ejercicio 1 y 23–24 con su encaje en las rúbricas
  de DataComex; cítricos (tema 2) y turismo (tema 23, balanza de pagos). Pendiente
  de que el autor elija formato. Después: generarlas todas con un script desde
  `data/flujos_data.csv` y `data/balanza_data.js` (no a mano) y publicarlas en
  `public/fichas/`.
- **Visualizaciones nuevas** (móvil primero) en
  <https://claude.ai/artifact/2fRUYTb3vMTJCnbyV63fGN> (privado): mosaico de sectores,
  mariposa exportación/importación, crecimiento, cuota UE, fichas con evolución,
  cascada de la balanza, calendario mensual e historias deslizables. Pendiente de
  que el autor elija cuáles llevar a `comercio-exterior.html`.
- **Modernizar los gráficos** de `comercio-exterior.html` (Chart.js): el autor
  prefiere hacerlo en su ordenador local, donde hay R y acceso a internet sin
  restricciones.
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
