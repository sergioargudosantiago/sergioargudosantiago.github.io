# Diseño: Rediseño Estética Arcade — index.html

**Fecha:** 2026-05-01  
**Alcance:** index.html (página piloto; el resto de páginas se aplicarán tras validar)

---

## Objetivo

Transformar la estética actual (glassmorphism, bordes redondeados, colores azul corporativo) a una estética minimalista arcade de los 90: formas completamente rectas, tipografía geométrica técnica, paleta amarillo pastel + negro.

---

## Paleta de colores

| Rol | Color | Hex |
|---|---|---|
| Fondo principal | Amarillo pastel | `#FFFBDB` |
| Texto y bordes | Negro puro | `#000000` |
| Líneas SVG fondo | Amarillo oscuro | `#B8860B` |
| Hover/activo (invertido) | Negro fondo, amarillo texto | `#000` / `#FFFBDB` |

---

## Tipografía

- **Títulos y navegación:** Orbitron (Google Fonts) — geométrica, angular, sin curvas orgánicas
- **Cuerpo de texto:** Share Tech Mono (Google Fonts) — monoespaciada técnica, legible
- Todos los `border-radius` → `0px`

---

## Fondo — Ilustración SVG contenedores

- Torres de contenedores marítimos apilados en SVG
- Posición: esquina inferior derecha (principal) y esquina inferior izquierda (secundaria, más pequeña)
- Opacidad: 8-12% — sutil, no invasiva
- Estilo: líneas finas en `#B8860B`, puramente rectangular, sin curvas
- Cada contenedor: rectángulo exterior + línea horizontal central + pequeño rectángulo de puerta
- Fixed en el fondo (z-index: -1), no interfiere con el scroll del contenido

---

## Navegación

- Barra horizontal fija, ancho completo, parte superior
- Fondo: `#000000`
- Texto: Orbitron, color `#FFFBDB`
- Links separados visualmente (con padding, sin `|` literal)
- Link activo: fondo `#FFFBDB`, texto `#000000` — inversión total
- Sin blur, sin transparencias, sin border-radius
- Borde inferior: `2px solid #000`
- Mobile: menú desplegable rectangular negro, mismo estilo

---

## Hero — Tarjeta central

- Eliminar glassmorphism completo (sin `backdrop-filter`, sin transparencias)
- Contenedor con borde doble negro (bisel arcade): `border: 3px solid #000` + `outline: 2px solid #000` con offset, o doble `box-shadow`
- Fondo interior: `#FFFBDB` sólido
- Tabs (`Inicio` / `¿Por qué Inspector del SOIVRE?`):
  - Botones rectangulares con `border: 2px solid #000`
  - Tab activo: fondo negro, texto amarillo
  - Tab inactivo: fondo amarillo, texto negro
- Botón CTA "Explorar Temario":
  - Rectangular, `border: 2px solid #000`
  - Sombra sólida desplazada: `box-shadow: 4px 4px 0 #000`
  - Hover: inversión de color + sombra desaparece (efecto "pulsado")
- Título principal en Orbitron Bold
- Texto descriptivo en Share Tech Mono

---

## Footer

- Barra fija inferior, fondo `#000000`
- Iconos sociales en color `#FFFBDB`
- Sin border-radius, sin transparencias

---

## Eliminaciones respecto al diseño actual

- Todo glassmorphism (`backdrop-filter`, `blur`, transparencias en backgrounds)
- Todos los `border-radius` (reemplazados por `0`)
- Fondo de puntos (dot grid) → reemplazado por SVG de contenedores
- Nav island flotante con blur → reemplazada por barra sólida
- Sombras difuminadas → reemplazadas por sombras sólidas desplazadas o eliminadas
- Fuentes Inter y Noto Serif → reemplazadas por Orbitron + Share Tech Mono
- Colores azul primario → paleta negro/amarillo
- Modo oscuro (dark theme) → se elimina por ahora (la estética es inherentemente de alto contraste)

---

## Restricciones

- Mantener toda la funcionalidad actual: carousel de slides, búsqueda, menú mobile, cookies
- No romper los scripts JS existentes (`main.js`, `cookies.js`)
- Seguir siendo estático (sin build tools, solo HTML + CSS inline + Tailwind CDN)
