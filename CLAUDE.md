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
- Chart.js por CDN (jsDelivr). Fuentes de Google (Orbitron, Share Tech Mono, Inter):
  estética arcade.
- Analítica: GoatCounter (sin cookies). `js/cookies.js` gestiona el aviso.
- **Todo lo que está versionado se publica**, no solo los `.html`. Antes de añadir un
  fichero, pregúntate si debe poder descargarse desde la web.
- Dominio propio: **pendiente de decidir**. `scripts/cambiar-dominio.js` lo cambia en
  todo el repo de una pasada (canonical, og:url, sitemap, robots, feed, CNAME); el
  dominio de destino está escrito en ese script y hay que confirmarlo antes de usarlo.

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
- Cambios de navegación, footer o `<head>` se replican en **todas** las páginas
  (no hay plantillas compartidas).
- El dominio absoluto aparece en canonical, Open Graph, sitemap, robots y feed:
  no escribirlo a mano, usar `scripts/cambiar-dominio.js`.

## Estado

Fase actual: **revisión previa a la publicación y compra del dominio** (octubre 2026).
El plan de revisión y el calendario de artículos se acuerdan con el autor; cuando
estén cerrados, resumir aquí las decisiones tomadas.
