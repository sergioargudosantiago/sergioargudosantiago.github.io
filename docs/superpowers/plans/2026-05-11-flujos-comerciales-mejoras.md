# Flujos Comerciales — Mejoras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir cuota UE27 en card analítica, desagregar productos agroalimentarios clave, diagnosticar discontinuidades TARIC, y hacer el navbar proporcional a cualquier zoom/pantalla.

**Architecture:** El script R `scripts/generate_flujos_data.R` consulta SGEYPC via `comerciotools::taric()`, calcula `pct_ue` por código producto y genera filas nuevas para subcategorías. Su output CSV se re-embebe en `comercio-exterior.html`. La UI se modifica para mostrar el % UE en la card TVA dividida. El navbar pasa a `clamp()` fluido.

**Tech Stack:** R + comerciotools, HTML/CSS/JS (vanilla), Tailwind CDN, Chart.js

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `scripts/generate_flujos_data.R` | Crear | Pipeline R: EU %, desagregaciones, diagnóstico TARIC |
| `comercio-exterior.html` | Modificar | CSS navbar, HTML+JS card TVA, CSV embebido |

---

### Task 1: Navbar fluido con clamp()

**Files:**
- Modify: `comercio-exterior.html` (bloque CSS `.nav-island`, `.nav-segment`, logo img)

- [ ] **Step 1: Localizar el bloque CSS del navbar**

En `comercio-exterior.html`, busca el comentario `/* ========== ARCADE NAVIGATION BAR ==========*/` (~línea 187). Las reglas a modificar son `.nav-island` y `.nav-segment`.

- [ ] **Step 2: Sustituir `.nav-island` con valores fluidos**

Reemplaza el bloque `.nav-island` existente por:

```css
.nav-island {
    position: fixed;
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    align-items: center;
    padding: 0 clamp(0.1rem, 0.2vw, 0.25rem);
    background: #C2D9C2;
    border: 2px solid #3B4533;
    box-shadow: 4px 4px 0 #3B4533;
    height: clamp(3rem, 4.2vw, 4.5rem);
    white-space: nowrap;
    max-width: 96vw;
}
```

- [ ] **Step 3: Sustituir `.nav-segment` con valores fluidos**

```css
.nav-segment {
    position: relative;
    padding: 0 clamp(0.45rem, 0.85vw, 1.25rem);
    height: 100%;
    display: flex;
    align-items: center;
    font-family: 'Orbitron', monospace;
    font-size: clamp(0.58rem, 0.62vw, 0.75rem);
    font-weight: 600;
    color: #3B4533;
    text-decoration: none;
    border-right: 1px solid rgba(59, 69, 51, 0.2);
    letter-spacing: 0.05em;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
}
```

- [ ] **Step 4: Añadir regla fluida para el logo dentro del nav**

Añade esta regla nueva justo después del bloque `.nav-segment`:

```css
.nav-island img {
    width: clamp(140px, 12.5vw, 260px);
    height: auto;
}
```

- [ ] **Step 5: Verificar visualmente**

Abre `comercio-exterior.html` en el navegador. Comprueba:
- A 27" al 75% zoom: logo ~260px, segmentos con padding normal, altura ~4.5rem
- Reducir zoom al 50%: todo se comprime proporcionalmente, sin overflow horizontal
- Aumentar zoom al 100%: navbar más compacto pero sin elementos cortados

- [ ] **Step 6: Commit**

```bash
git add comercio-exterior.html
git commit -m "feat: navbar fluido con clamp() para cualquier zoom/pantalla"
```

---

### Task 2: Card TVA — layout dividido TVA + % UE

**Files:**
- Modify: `comercio-exterior.html` (HTML de `#card-tva`, CSS nuevo para `.eu-share-*`)

- [ ] **Step 1: Localizar el HTML de `#card-tva`**

Busca `id="card-tva"` (~línea 927). El bloque actual contiene `tvaContainer` y el label de comparativa.

- [ ] **Step 2: Sustituir el HTML de `#card-tva`**

Reemplaza el contenido interno del div `id="card-tva"` por:

```html
<div id="card-tva"
    class="glass-card p-6 md:p-10 flex flex-col items-center justify-center text-center transition-all duration-300">
    <!-- Mitad superior: TVA -->
    <div class="flex flex-col items-center w-full flex-1 justify-center pb-4">
        <h4 class="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 md:mb-6">
            Tasa Var. Anual (TVA)</h4>
        <div id="tvaContainer"
            class="flex flex-col items-center scale-125 md:scale-150 py-2 md:py-4">
            <!-- Dynamic TVA badge -->
        </div>
        <p class="text-[10px] text-muted-foreground mt-6 md:mt-8 italic uppercase tracking-wider">
            Comparativa <span id="tvaYearLabel">2024-2025</span></p>
    </div>

    <!-- Divisor -->
    <div class="w-full border-t border-primary/20 my-2"></div>

    <!-- Mitad inferior: % UE -->
    <div class="flex flex-col items-center w-full flex-1 justify-center pt-4">
        <h4 class="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Cuota UE27</h4>
        <div id="euShareContainer" class="flex flex-col items-center w-full px-4">
            <!-- Dynamic EU share — renderizado por renderEUShare() -->
        </div>
        <p id="euShareLabel"
            class="text-[10px] text-muted-foreground mt-3 italic uppercase tracking-wider">
            % hacia UE</p>
    </div>
</div>
```

- [ ] **Step 3: Añadir CSS para el badge UE**

Añade estas reglas en el bloque `<style>` del HTML, justo después de las reglas `.tva-badge`:

```css
.eu-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}
.eu-pct {
    font-family: 'Orbitron', monospace;
    font-size: 1.4rem;
    font-weight: 900;
    color: #003399;
    letter-spacing: -0.02em;
}
html.dark .eu-pct { color: #6699ff; }
.eu-bar-track {
    width: 100%;
    height: 5px;
    background: rgba(0,51,153,0.12);
    position: relative;
    overflow: hidden;
}
.eu-bar-fill {
    position: absolute;
    left: 0; top: 0; height: 100%;
    background: #003399;
    transition: width 0.5s ease;
}
html.dark .eu-bar-fill { background: #6699ff; }
.eu-na {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    font-style: italic;
}
```

- [ ] **Step 4: Verificar layout**

Abre el HTML en el navegador. La card TVA debe mostrar dos mitades visualmente equilibradas con el divisor entre ellas. El `euShareContainer` estará vacío (se rellena en Task 3).

- [ ] **Step 5: Commit**

```bash
git add comercio-exterior.html
git commit -m "feat: card TVA dividida en dos mitades para mostrar TVA + cuota UE27"
```

---

### Task 3: JS — función renderEUShare y actualización de updateDashboardMetrics

**Files:**
- Modify: `comercio-exterior.html` (bloque `<script>` inline — funciones `renderEUShare`, `updateDashboardMetrics`)

- [ ] **Step 1: Añadir función `renderEUShare`**

Localiza la función `renderTVA` en el script inline (~línea 3939). Añade esta nueva función JUSTO DESPUÉS de `renderTVA`:

```javascript
function renderEUShare(pctUE, flow) {
    const container = document.getElementById('euShareContainer');
    const label = document.getElementById('euShareLabel');

    // Update directional label
    if (label) {
        label.textContent = flow === 'E' ? '% hacia UE' : '% desde UE';
    }

    if (pctUE === null || pctUE === undefined || isNaN(pctUE)) {
        container.innerHTML = '<span class="eu-na">No disponible</span>';
        return;
    }

    const pct = Math.round(pctUE * 10) / 10;
    const barWidth = Math.min(Math.max(pct, 0), 100);

    container.innerHTML = `
        <div class="eu-badge">
            <span class="eu-pct">${pct.toFixed(1)}%</span>
            <div class="eu-bar-track">
                <div class="eu-bar-fill" style="width:${barWidth}%"></div>
            </div>
        </div>
    `;
}
```

- [ ] **Step 2: Añadir helper `computeWeightedEUShare`**

Añade esta función justo después de `renderEUShare`:

```javascript
function computeWeightedEUShare(filteredRows, level) {
    // level: 'lv3' or 'lv4' — which pct_ue column to use
    const col = level === 'lv4' ? 'pct_ue_lv4' : 'pct_ue_lv3';
    let totalValue = 0;
    let weightedSum = 0;
    let hasData = false;

    filteredRows.forEach(row => {
        const val = parseNumericValue(row.total_millones);
        const pct = parseFloat(row[col]);
        if (!isNaN(val) && val > 0 && !isNaN(pct)) {
            weightedSum += val * pct;
            totalValue += val;
            hasData = true;
        }
    });

    if (!hasData || totalValue === 0) return null;
    return weightedSum / totalValue;
}
```

- [ ] **Step 3: Actualizar `updateDashboardMetrics` para llamar a renderEUShare**

Localiza la función `updateDashboardMetrics`. Al final de su cuerpo (antes del cierre `}`), añade:

```javascript
// Render EU share
const euLevel = (level === 'final' || level === 'lv4') ? 'lv4' : 'lv3';
const euPct = computeWeightedEUShare(filteredData, euLevel);
renderEUShare(euPct, currentFlow);
```

Nota: `filteredData` es el parámetro que recibe `updateDashboardMetrics`. Verifica el nombre exacto del parámetro en la función existente y adáptalo si difiere.

- [ ] **Step 4: Verificar comportamiento con datos sin pct_ue**

Como el CSV aún no tiene las columnas `pct_ue_lv3/lv4`, la función debe mostrar "No disponible" en todos los niveles. Abre el HTML, navega a cualquier sector y confirma que la mitad inferior de la card TVA muestra "No disponible" sin errores en consola.

- [ ] **Step 5: Commit**

```bash
git add comercio-exterior.html
git commit -m "feat: renderEUShare y computeWeightedEUShare en card analítica"
```

---

### Task 4: Script R — diagnóstico TARIC plátanos y tomates

**Files:**
- Create: `scripts/generate_flujos_data.R`

- [ ] **Step 1: Crear el fichero con cabecera y librerías**

```r
# scripts/generate_flujos_data.R
# Pipeline de datos para comercio-exterior.html
# Genera CSV con pct_ue y desagregaciones, lo embebe en el HTML

library(comerciotools)
library(dplyr)
library(tidyr)
library(stringr)
library(readr)

# ── Constantes ──────────────────────────────────────────────────────────────

HTML_PATH <- here::here("comercio-exterior.html")
ANOS <- 2021:2025  # Años presentes en el CSV actual

# ISO3A de los 26 socios UE27 (España excluida como país reportante)
UE27_ISO3A <- c(
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
  "DEU","GRC","HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD",
  "POL","PRT","ROU","SVK","SVN","SWE"
)
```

- [ ] **Step 2: Añadir sección de diagnóstico plátanos**

```r
# ── Diagnóstico: Plátanos (CN 0803) ─────────────────────────────────────────
message("=== DIAGNÓSTICO: Plátanos ===")

platanos_raw <- taric(
  codigo = "0803",
  nivel  = 8,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = TRUE
)

platanos_resumen <- platanos_raw |>
  group_by(ano, codigo) |>
  summarise(valor = sum(valor, na.rm = TRUE), .groups = "drop") |>
  arrange(codigo, ano)

print(platanos_resumen, n = 50)
# Buscar: ¿cambia el código CN entre años? ¿Hay salto de 08030010 a otro?
```

- [ ] **Step 3: Añadir diagnóstico tomates**

```r
# ── Diagnóstico: Tomates (CN 0702) ──────────────────────────────────────────
message("=== DIAGNÓSTICO: Tomates ===")

tomates_raw <- taric(
  codigo = "0702",
  nivel  = 8,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = TRUE
)

tomates_resumen <- tomates_raw |>
  group_by(ano, codigo) |>
  summarise(valor = sum(valor, na.rm = TRUE), .groups = "drop") |>
  arrange(codigo, ano)

print(tomates_resumen, n = 50)
```

- [ ] **Step 4: Ejecutar solo la sección diagnóstico**

En RStudio o consola R, ejecuta las secciones de diagnóstico:

```r
source("scripts/generate_flujos_data.R")  # O seleccionar y ejecutar solo esas líneas
```

Observa el output. Para plátanos: ¿aparecen códigos distintos en diferentes años? Para tomates: ¿el total 2024-2025 es coherente con los años anteriores?

Documenta los hallazgos como comentario en el script:

```r
# HALLAZGO Plátanos: [describir aquí qué se encontró]
# HALLAZGO Tomates: [describir aquí qué se encontró]
```

- [ ] **Step 5: Commit**

```bash
git add scripts/generate_flujos_data.R
git commit -m "feat: script R inicial con diagnóstico TARIC plátanos y tomates"
```

---

### Task 5: Script R — verificar códigos CN desagregaciones y construir mapping

**Files:**
- Modify: `scripts/generate_flujos_data.R`

- [ ] **Step 1: Añadir verificación cítricos (CN 0805)**

```r
# ── Verificación CN: Cítricos (0805) ────────────────────────────────────────
message("=== CÓDIGOS CN: Cítricos ===")

citricos_cn <- taric(
  codigo = "0805",
  nivel  = 8,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = TRUE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(valor, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(citricos_cn)
# Confirmar: 080510xx = naranjas, 080520xx = mandarinas,
#            080540xx = pomelos, 080550xx = limones/limas
```

- [ ] **Step 2: Añadir verificación melones/sandías (CN 0807)**

```r
# ── Verificación CN: Melones y Sandías (0807) ───────────────────────────────
message("=== CÓDIGOS CN: Melones/Sandías ===")

melones_cn <- taric(
  codigo = "0807",
  nivel  = 8,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = TRUE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(valor, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(melones_cn)
# Confirmar: 0807 11 = sandías, 0807 19 = melones
```

- [ ] **Step 3: Añadir verificación pesca (CN 0302, 0303, 0306, 0307)**

```r
# ── Verificación CN: Pesca ───────────────────────────────────────────────────
message("=== CÓDIGOS CN: Pesca ===")

pesca_cn <- taric(
  codigo = c("0302","0303","0306","0307"),
  nivel  = 6,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = TRUE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(valor, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(pesca_cn, n = 40)
# Identificar los 8-10 códigos con mayor valor para España
```

- [ ] **Step 4: Construir mapping de desagregaciones**

Tras revisar el output, añade el mapping como constante en el script:

```r
# ── Mapping desagregaciones (ajustar códigos CN según output verificación) ───

CITRICOS_MAP <- list(
  list(lv4 = "18111101", lit_lv4 = "Naranjas",    cn_prefix = "080510"),
  list(lv4 = "18111102", lit_lv4 = "Mandarinas",  cn_prefix = "080520"),
  list(lv4 = "18111103", lit_lv4 = "Limones",     cn_prefix = "080550"),
  list(lv4 = "18111104", lit_lv4 = "Pomelos",     cn_prefix = "080540")
)

MELONES_MAP <- list(
  list(lv4 = "18111201", lit_lv4 = "Sandías",  cn_prefix = "080711"),
  list(lv4 = "18111202", lit_lv4 = "Melones",  cn_prefix = "080719")
)

# Pesca: completar con los códigos reales tras verificación
PESCA_MAP <- list(
  list(lv4 = "13111301", lit_lv4 = "Atún",           cn_prefix = "030370", parent_lv3 = "131113"),
  list(lv4 = "13111302", lit_lv4 = "Merluza",        cn_prefix = "030263", parent_lv3 = "131112"),
  list(lv4 = "13111303", lit_lv4 = "Bacalao",        cn_prefix = "030251", parent_lv3 = "131112"),
  list(lv4 = "13111401", lit_lv4 = "Pulpo",          cn_prefix = "030743", parent_lv3 = "131114"),
  list(lv4 = "13111402", lit_lv4 = "Sepia/Jibia",    cn_prefix = "030749", parent_lv3 = "131114"),
  list(lv4 = "13111403", lit_lv4 = "Gamba/Langostino", cn_prefix = "030617", parent_lv3 = "131114"),
  list(lv4 = "13111201", lit_lv4 = "Dorada",         cn_prefix = "030285", parent_lv3 = "131112"),
  list(lv4 = "13111202", lit_lv4 = "Lubina",         cn_prefix = "030284", parent_lv3 = "131112")
)
# IMPORTANTE: Ajustar cn_prefix y parent_lv3 según output real de verificación
```

- [ ] **Step 5: Ejecutar verificaciones y ajustar mapping**

```r
source("scripts/generate_flujos_data.R")  # Solo las secciones de verificación
```

Revisa el output. Si un cn_prefix no existe en los datos, ajusta el código en `CITRICOS_MAP`, `MELONES_MAP` o `PESCA_MAP`. Verifica que los `parent_lv3` coinciden con los códigos `lv3` del CSV actual.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate_flujos_data.R
git commit -m "feat: verificación CN y mapping desagregaciones cítricos/melones/pesca"
```

---

### Task 6: Script R — cálculo pct_ue y generación de filas desagregadas

**Files:**
- Modify: `scripts/generate_flujos_data.R`

- [ ] **Step 1: Añadir función para calcular pct_ue por código CN y año**

```r
# ── Función: calcular pct_ue por código CN ───────────────────────────────────

calcular_pct_ue <- function(flujo, anos) {
  message(sprintf("Calculando pct_ue: flujo=%s, años=%s-%s", flujo, min(anos), max(anos)))

  total_df <- taric(
    flujo = flujo,
    desde = min(anos),
    hasta = max(anos),
    .codigo_agregado = FALSE,
    .iso3a_agregado  = TRUE
  ) |>
    group_by(ano, codigo) |>
    summarise(valor_total = sum(valor, na.rm = TRUE), .groups = "drop")

  ue_df <- taric(
    flujo  = flujo,
    desde  = min(anos),
    hasta  = max(anos),
    iso3a  = UE27_ISO3A,
    .codigo_agregado = FALSE,
    .iso3a_agregado  = TRUE
  ) |>
    group_by(ano, codigo) |>
    summarise(valor_ue = sum(valor, na.rm = TRUE), .groups = "drop")

  left_join(total_df, ue_df, by = c("ano", "codigo")) |>
    mutate(
      valor_ue = replace_na(valor_ue, 0),
      pct_ue   = if_else(valor_total > 0, round(valor_ue / valor_total * 100, 1), NA_real_)
    )
}
```

- [ ] **Step 2: Añadir función para agregar pct_ue a nivel superior (suma ponderada)**

```r
agregar_pct_ue <- function(pct_ue_df, codigos_hijo, ano_val) {
  sub <- pct_ue_df |>
    filter(ano == ano_val, str_starts(codigo, paste(codigos_hijo, collapse="|")))
  if (nrow(sub) == 0 || sum(sub$valor_total) == 0) return(NA_real_)
  round(sum(sub$valor_ue, na.rm=TRUE) / sum(sub$valor_total, na.rm=TRUE) * 100, 1)
}
```

- [ ] **Step 3: Añadir función para generar filas desagregadas**

```r
# ── Función: generar filas CSV para una desagregación ───────────────────────

generar_filas_desagregacion <- function(
    csv_base, map_entry, pct_ue_df,
    flujos = c("E","I"), anos = ANOS,
    parent_lv1, parent_lv2, parent_lv3,
    lit_lv1, lit_lv2, lit_lv3
) {
  rows <- list()

  for (fl in flujos) {
    pct_df <- pct_ue_df[[fl]]

    for (yr in anos) {
      # Buscar valor total para este CN y año
      cn <- map_entry$cn_prefix
      valor_rows <- pct_df |>
        filter(ano == yr, str_starts(codigo, cn))

      if (nrow(valor_rows) == 0) next

      total_val <- sum(valor_rows$valor_total, na.rm = TRUE)
      if (total_val == 0) next

      pct_ue_val <- if (sum(valor_rows$valor_total) > 0) {
        round(sum(valor_rows$valor_ue, na.rm=TRUE) / sum(valor_rows$valor_total) * 100, 1)
      } else NA_real_

      rows[[length(rows) + 1]] <- tibble(
        year            = as.character(yr),
        flujo           = fl,
        macro_sector    = "Agroalimentario",
        lv1             = parent_lv1,
        lit_lv1         = lit_lv1,
        lv2             = parent_lv2,
        lit_lv2         = lit_lv2,
        lv3             = parent_lv3,
        lit_lv3         = lit_lv3,
        lv4             = map_entry$lv4,
        lit_lv4         = map_entry$lit_lv4,
        total_millones  = round(total_val / 1e6, 2),
        top_paises_lv1  = NA_character_,
        tva_lv1         = NA_character_,
        top_paises_lv2  = NA_character_,
        tva_lv2         = NA_character_,
        top_paises_lv3  = NA_character_,
        tva_lv3         = NA_character_,
        top_paises_lv4  = NA_character_,
        tva_lv4         = NA_character_,
        pct_ue_lv3      = NA_real_,
        pct_ue_lv4      = if_else(!is.na(pct_ue_val), pct_ue_val, NA_real_)
      )
    }
  }

  bind_rows(rows)
}
```

- [ ] **Step 4: Añadir sección principal de generación**

```r
# ── Main: calcular pct_ue para todos los flujos ─────────────────────────────

pct_ue_list <- list(
  "E" = calcular_pct_ue("E", ANOS),
  "I" = calcular_pct_ue("I", ANOS)
)

# ── Leer CSV base embebido ────────────────────────────────────────────────────
# Extraer el bloque CSV del HTML
html_content <- read_file(HTML_PATH)

csv_start <- str_locate(html_content, "const EMBEDDED_CSV_DATA = `")[2] + 1
csv_end   <- str_locate(html_content, "`;\n")[1] - 1
# Ajustar si hay múltiples backtick-closes: tomar el primero después de csv_start
csv_text <- substr(html_content, csv_start, csv_end)

csv_df <- read_csv(csv_text, show_col_types = FALSE) |>
  mutate(
    year = as.character(year),
    lv4  = as.character(lv4),
    pct_ue_lv3 = NA_real_,
    pct_ue_lv4 = NA_real_
  )

message(sprintf("CSV base leído: %d filas", nrow(csv_df)))
```

- [ ] **Step 5: Añadir pct_ue a las filas existentes del CSV**

```r
# ── Añadir pct_ue a filas existentes ─────────────────────────────────────────

# Para cada fila existente, buscar el pct_ue del código lv3/lv4
# Necesitamos mapear los códigos internos (ej. 181111) a códigos CN (ej. 080510xx)
# Este mapping es parcial: solo las categorías que tienen CN directo identificado

# Usar lv4 si no es NA, si no lv3
csv_df <- csv_df |>
  rowwise() |>
  mutate(
    pct_ue_lv3 = {
      # Para sectores con código CN conocido — completar con hallazgos verificación
      NA_real_  # Placeholder: completar tras Task 5
    },
    pct_ue_lv4 = NA_real_
  ) |>
  ungroup()

message("Nota: pct_ue_lv3 de filas base requiere mapping CN→código_interno.")
message("Completar tras verificar códigos CN en Task 5.")
```

- [ ] **Step 6: Generar filas desagregadas cítricos**

```r
# ── Generar filas: Cítricos ───────────────────────────────────────────────────
filas_citricos <- bind_rows(lapply(CITRICOS_MAP, function(m) {
  generar_filas_desagregacion(
    csv_base    = csv_df,
    map_entry   = m,
    pct_ue_df   = pct_ue_list,
    parent_lv1  = "18",
    parent_lv2  = "1811",
    parent_lv3  = "181111",
    lit_lv1     = "Frutas",
    lit_lv2     = "Frutas",
    lit_lv3     = "Cítricos"
  )
}))

message(sprintf("Filas cítricos generadas: %d", nrow(filas_citricos)))
```

- [ ] **Step 7: Generar filas desagregadas melones/sandías**

```r
# ── Generar filas: Melones y Sandías ─────────────────────────────────────────
filas_melones <- bind_rows(lapply(MELONES_MAP, function(m) {
  generar_filas_desagregacion(
    csv_base    = csv_df,
    map_entry   = m,
    pct_ue_df   = pct_ue_list,
    parent_lv1  = "18",
    parent_lv2  = "1811",
    parent_lv3  = "181112",
    lit_lv1     = "Frutas",
    lit_lv2     = "Frutas",
    lit_lv3     = "Melones y sandías"
  )
}))

message(sprintf("Filas melones/sandías generadas: %d", nrow(filas_melones)))
```

- [ ] **Step 8: Generar filas desagregadas pesca**

```r
# ── Generar filas: Pesca ─────────────────────────────────────────────────────
filas_pesca <- bind_rows(lapply(PESCA_MAP, function(m) {
  # Buscar lit_lv3 desde csv_df para el parent_lv3 correspondiente
  parent_row <- csv_df |>
    filter(flujo == "E", lv3 == m$parent_lv3, year == "2024") |>
    slice(1)

  if (nrow(parent_row) == 0) {
    message(sprintf("AVISO: no se encontró parent_lv3=%s en CSV base", m$parent_lv3))
    return(tibble())
  }

  generar_filas_desagregacion(
    csv_base    = csv_df,
    map_entry   = m,
    pct_ue_df   = pct_ue_list,
    parent_lv1  = parent_row$lv1,
    parent_lv2  = parent_row$lv2,
    parent_lv3  = m$parent_lv3,
    lit_lv1     = parent_row$lit_lv1,
    lit_lv2     = parent_row$lit_lv2,
    lit_lv3     = parent_row$lit_lv3
  )
}))

message(sprintf("Filas pesca generadas: %d", nrow(filas_pesca)))
```

- [ ] **Step 9: Unir todo y escribir CSV final**

```r
# ── Unir CSV base + filas nuevas ─────────────────────────────────────────────
csv_final <- bind_rows(csv_df, filas_citricos, filas_melones, filas_pesca) |>
  arrange(year, flujo, macro_sector, lv1, lv2, lv3, lv4)

message(sprintf("CSV final: %d filas (%d originales + %d nuevas)",
  nrow(csv_final), nrow(csv_df),
  nrow(csv_final) - nrow(csv_df)))

# Serializar a texto CSV
csv_text_nuevo <- format_csv(csv_final, na = "NA")
```

- [ ] **Step 10: Commit parcial del script**

```bash
git add scripts/generate_flujos_data.R
git commit -m "feat: funciones R para pct_ue y generación filas desagregadas"
```

---

### Task 7: Script R — re-embeber CSV en HTML

**Files:**
- Modify: `scripts/generate_flujos_data.R`

- [ ] **Step 1: Añadir función de re-embebido**

```r
# ── Re-embeber CSV en HTML ────────────────────────────────────────────────────

reembeber_csv <- function(html_path, csv_text_nuevo) {
  html <- read_file(html_path)

  # Patrón: buscar EMBEDDED_CSV_DATA = `...`
  pattern <- "(?s)(const EMBEDDED_CSV_DATA = `)([^`]+)(`)"

  if (!str_detect(html, pattern)) {
    stop("No se encontró EMBEDDED_CSV_DATA en el HTML. Verifica el patrón.")
  }

  html_nuevo <- str_replace(
    html,
    pattern,
    paste0("\\1", csv_text_nuevo, "\\3")
  )

  write_file(html_nuevo, html_path)
  message(sprintf("HTML actualizado: %s", html_path))
  message(sprintf("Tamaño HTML nuevo: %.1f KB", nchar(html_nuevo) / 1024))
}

# Ejecutar
reembeber_csv(HTML_PATH, csv_text_nuevo)
```

- [ ] **Step 2: Ejecutar el script completo**

```r
source("scripts/generate_flujos_data.R")
```

Verificar en consola:
- Sin errores fatales
- Filas cítricos > 0 por flujo/año
- Filas melones > 0
- Filas pesca > 0
- "HTML actualizado" al final

- [ ] **Step 3: Verificar el HTML actualizado en el navegador**

Abre `comercio-exterior.html` → Flujos Comerciales → Agroalimentario → Frutas → Cítricos.

Confirmar:
- Aparece un nivel adicional con Naranjas, Mandarinas, Limones, Pomelos
- Al hacer click en una subcategoría, muestra datos de esa fruta
- La card TVA muestra % UE con barra (si hay datos) o "No disponible" (si pct_ue = NA)

Abre → Frutas → Melones y sandías:
- Aparecen Sandías y Melones como subcategorías separadas

Abre → Pesca → [cualquier categoría]:
- Aparecen los productos desagregados

- [ ] **Step 4: Verificar navbar a distintos zooms**

Abre en Chrome. Prueba: Ctrl+- hasta 50%, luego Ctrl+= hasta 150%. El navbar debe escalar proporcionalmente sin overflow ni elementos cortados.

- [ ] **Step 5: Commit final**

```bash
git add scripts/generate_flujos_data.R comercio-exterior.html
git commit -m "feat: re-embeber CSV con pct_ue y desagregaciones en HTML"
```

---

### Task 8: Completar pct_ue en filas base del CSV

**Files:**
- Modify: `scripts/generate_flujos_data.R`

**Contexto:** En Task 6 Step 5 se dejó `pct_ue_lv3 = NA_real_` como placeholder para las filas base. Esta tarea completa ese mapping usando los códigos CN verificados en Task 5.

- [ ] **Step 1: Crear tabla de mapping código_interno → prefijo CN**

Añade esta constante al script (tras los MAPS del Task 5):

```r
# Mapping: código lv3/lv4 interno → prefijo CN para buscar pct_ue
# Completar con los códigos verificados en Task 5
CODIGO_CN_MAP <- tribble(
  ~codigo_interno, ~cn_prefix,  ~nivel,
  # Agroalimentario - Cárnicos
  "111111", "020110", "lv4",  # Bovino fresco
  "111112", "020120", "lv4",
  "111113", "020130", "lv4",
  # Frutas
  "181111", "0805",   "lv3",  # Cítricos agregado
  "181112", "0807",   "lv3",  # Melones/sandías agregado
  "181114", "081010", "lv4",  # Fresas
  "181118", "0803",   "lv4",  # Plátano
  # Hortalizas
  "171112", "070960", "lv4",  # Pimiento
  "171113", "070700", "lv4",  # Pepino
  # Pesca
  "131112", "0302",   "lv3",  # Pescado fresco
  "131113", "0303",   "lv3",  # Pescado congelado
  "131114", "0307",   "lv3",  # Moluscos/crustáceos
  # Aceite de oliva (Industrial alimentario)
  # ... completar según verificación
)
```

- [ ] **Step 2: Actualizar el cálculo de pct_ue en filas base**

Reemplaza el placeholder de Task 6 Step 5 por:

```r
csv_df <- csv_df |>
  left_join(
    CODIGO_CN_MAP |> rename(lv3 = codigo_interno, cn_lv3 = cn_prefix, nivel_lv3 = nivel),
    by = "lv3"
  ) |>
  rowwise() |>
  mutate(
    pct_ue_lv3 = {
      if (is.na(cn_lv3)) {
        NA_real_
      } else {
        pct_rows <- pct_ue_list[[flujo]] |>
          filter(ano == as.integer(year), str_starts(codigo, cn_lv3))
        if (nrow(pct_rows) == 0 || sum(pct_rows$valor_total) == 0) {
          NA_real_
        } else {
          round(sum(pct_rows$valor_ue, na.rm=TRUE) / sum(pct_rows$valor_total) * 100, 1)
        }
      }
    },
    pct_ue_lv4 = NA_real_
  ) |>
  ungroup() |>
  select(-cn_lv3, -nivel_lv3)
```

- [ ] **Step 3: Re-ejecutar script completo y re-embeber**

```r
source("scripts/generate_flujos_data.R")
```

- [ ] **Step 4: Verificar % UE en browser**

Abre `comercio-exterior.html` → Flujos → Agroalimentario → Frutas → Cítricos.  
La card analítica debe mostrar un % UE con barra azul (ej. ~72% para exportación).  
Comprueba también Industrial → cualquier sector: muestra "No disponible" si no hay mapping CN, sin error en consola.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate_flujos_data.R comercio-exterior.html
git commit -m "feat: pct_ue completo en filas base via mapping CN→código interno"
```

---

## Self-Review

**Spec coverage:**
- [x] % UE en card analítica → Tasks 2, 3, 6, 7, 8
- [x] Desagregación cítricos → Tasks 5, 6
- [x] Desagregación melones/sandías → Tasks 5, 6
- [x] Desagregación pesca → Tasks 5, 6
- [x] Diagnóstico plátanos/tomates → Task 4
- [x] Navbar fluido → Task 1
- [x] Script R genera CSV + re-embebe → Tasks 6, 7

**Gaps identificados y resueltos:**
- El pct_ue para filas base del CSV requería un segundo paso (Task 8) que no estaba en el plan inicial
- Los códigos CN de pesca necesitan verificación real antes de usar (documentado en Task 5)
- El mapping código_interno→CN es parcial y debe completarse tras verificación

**Type consistency:** `renderEUShare(pctUE, flow)` y `computeWeightedEUShare(filteredRows, level)` — nombrados consistentemente en Tasks 3 y usados como tal. `pct_ue_lv3`/`pct_ue_lv4` como nombres de columna son consistentes entre R (Tasks 6-8) y JS (Task 3).
