# sergioargudo.es

Portal personal de Sergio Argudo Santiago, Inspector del SOIVRE: esquemas gratuitos de
las oposiciones al **Cuerpo de Inspectores del SOIVRE**, un visualizador del comercio
exterior español con datos oficiales y artículos de análisis.

Web: <https://sergioargudo.es/>

## Páginas

| Página | Descripción |
|---|---|
| `index.html` | Portada |
| `esquemas.html` | Un esquema de cada tema, en línea y en PDF (`temario.html` redirige aquí) |
| `fichas.html` | Fichas de datos por tema |
| `comercio-exterior.html` | Visualizador de balanza comercial y balanza de pagos |
| `metodologia.html` | Fuentes y método de los datos |
| `articulos/` | Artículos de análisis (feed en `feed.xml`) |
| `sobre-mi.html`, `enlaces.html`, `legal.html` | Autor, enlaces y aviso legal |

## Datos

- Estadística de comercio exterior de Aduanas (Agencia Tributaria).
- Balanza de pagos del Banco de España, descargada de su API y validada antes de publicar.

## Desarrollo

HTML estático en GitHub Pages, Tailwind compilado y gráficos SVG propios sin
dependencias. Servir en local:

```bash
python -m http.server 8000
```

Comandos y flujos de trabajo en `CLAUDE.md` y en `package.json`.

## Licencia

Contenido propio. Datos de terceros bajo sus respectivas condiciones (AEAT, Banco de España).
