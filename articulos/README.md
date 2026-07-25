# Artículos

La fuente de verdad son los `.md` de esta carpeta. Todo lo demás lo genera
`scripts/build-articulos.js`:

```bash
npm run articulos
```

Eso escribe `articulos/<slug>.html`, `articulos/index.html`, `feed.xml`, las
entradas de artículos de `sitemap.xml` y un borrador de post de LinkedIn por
artículo en `review/linkedin/`.

**No edites a mano los `.html` de esta carpeta**: se sobrescriben en cada pasada.
Los `.html` y el `feed.xml` sí se commitean, porque son lo que sirve GitHub
Pages; los borradores de `review/linkedin/` no, porque se regeneran igual y no
forman parte del sitio.

## Frontmatter

```markdown
---
titulo: Qué mide (y qué no) la cuota UE de un sector
fecha: 2026-07-26
autores: [sergio]
resumen: Una frase que se usa en el índice, en el feed, en las etiquetas Open Graph y como arranque del post de LinkedIn.
tags: [comercio exterior, metodología]
slug: cuota-ue-que-mide
imagen: images/og-cover.png
puntos:
  - Frase suelta para los puntos del borrador de LinkedIn.
  - Son opcionales; si no las pones, el borrador sale solo con el resumen.
---

El cuerpo del artículo, en Markdown.
```

Obligatorios: `titulo`, `fecha` (AAAA-MM-DD) y `resumen`. Si falta alguno, o la
fecha no tiene ese formato, o el `slug` choca con otro, el build aborta sin
escribir nada. `autores` por defecto es `[sergio]`; `slug` se deriva del título
si no lo pones; `imagen` cae en `images/og-cover.png`.

## Colaboradores

Para firmar con alguien más, añádelo a `autores.json` con una clave corta:

```json
{
  "clave-corta": {
    "nombre": "Nombre Apellidos",
    "cargo": "Cargo o filiación (opcional)",
    "url": "https://enlace-a-su-perfil (opcional)"
  }
}
```

y ponlo en el frontmatter: `autores: [sergio, clave-corta]`. El orden es el de
la firma. Si un artículo cita un autor que no está en `autores.json`, el build
falla a propósito en lugar de publicar una firma vacía.

## Markdown admitido

Encabezados `##` a `#####` (el `#` de nivel 1 lo pone la plantilla con el
título), párrafos, **negrita**, *cursiva*, `código`, enlaces, imágenes, listas
con y sin numerar, citas, tablas, reglas horizontales y bloques de código con
valla. Un bloque que empiece por `<` en la columna 0 se copia tal cual, por si
hace falta incrustar algo puntual.

Es un subconjunto deliberado (`scripts/lib/markdown.js`), no CommonMark
completo. Si algún día se queda corto, se sustituye `render()` por `marked` y el
generador no se entera.
