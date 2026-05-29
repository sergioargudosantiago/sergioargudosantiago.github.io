# sergioargudosantiago.github.io

Portal personal de Sergio Argudo Santiago. Recursos para la preparación de las oposiciones al **Cuerpo de Inspectores del SOIVRE** e **Ingenieros Técnicos del SOIVRE**, junto con un visualizador interactivo de comercio exterior español.

URL actual: <https://sergioargudosantiago.github.io/>
Dominio previsto: `sergioargudoSOIVRE.es` (próximo).

## Páginas

| Página | Descripción |
|---|---|
| `index.html` | Landing con introducción y motivación. |
| `temario.html` | Resúmenes y esquemas del temario (PDF/Word). |
| `sobre-mi.html` | Sobre el autor. |
| `enlaces.html` | Recursos y enlaces oficiales. |
| `comercio-exterior.html` | Visualizador interactivo de balanza comercial española (2021-2025). |

## Estructura del repo

```
.
├── *.html              # Páginas
├── css/                # Estilos (futuro: theme extraído)
├── js/                 # Scripts cliente (main.js, cookies.js, data-visualization.js)
├── images/, logos/     # Assets gráficos
├── public/temas/       # PDFs del temario
├── data/               # CSVs y datasets (futuro)
├── scripts/            # Utilidades de build/conversión (futuro)
├── balanza/            # Comprobaciones de datos (Excel + CSVs INE/AEAT)
├── sitemap.xml, robots.txt
└── README.md
```

## Datos

El visualizador `comercio-exterior.html` utiliza datos oficiales de:

- [DataComex — Ministerio de Economía, Comercio y Empresa](https://datacomex.comercio.es/Metadata/Comex)
- [Estadísticas de comercio exterior — Agencia Tributaria](https://sede.agenciatributaria.gob.es/Sede/estadisticas/estadisticas-comercio-exterior.html)
- [Boletín Estadístico Capítulo 17 — Banco de España](https://www.bde.es/webbe/es/estadisticas/otras-clasificaciones/publicaciones/boletin-estadistico/capitulo-17.html)

Comprobación cruzada de cifras: ver `balanza/Comprobaciones sectores.xlsx`.

## Stack

- HTML estático servido por GitHub Pages.
- Tailwind CSS (CDN — pendiente compilar a CSS estático).
- Chart.js (via CDN) para gráficos del visualizador.
- Tipografías Google Fonts: Orbitron + Share Tech Mono (estética arcade).

## Desarrollo local

No requiere build. Servir cualquier servidor estático:

```bash
python -m http.server 8000
# o
npx serve .
```

Abrir <http://localhost:8000>.

## Licencia

Contenido propio. Datos de terceros bajo sus respectivas condiciones (DataComex, AEAT).
