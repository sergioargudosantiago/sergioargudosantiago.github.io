# scripts/generate_flujos_data.R
# Pipeline de datos para comercio-exterior.html
# Genera CSV con pct_ue y desagregaciones, lo embebe en el HTML

library(comerciotools)
library(dplyr)
library(tidyr)
library(stringr)
library(readr)

# ── Constantes ──────────────────────────────────────────────────────────────

HTML_PATH <- "C:/sergioargudosantiago.github.io/sergioargudosantiago.github.io/comercio-exterior.html"
ANOS <- 2021:2025  # Años presentes en el CSV actual

# ISO3A de los 26 socios UE27 (España excluida como país reportante)
UE27_ISO3A <- c(
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
  "DEU","GRC","HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD",
  "POL","PRT","ROU","SVK","SVN","SWE"
)

# HALLAZGO Platanos (CN 0803): codigo estable "0803" en todos los anos 2019-2025.
#   Sin cambio de CN. Datos disponibles solo en nivel=4 (nivel=8 devuelve 0 filas).
#   Columnas reales de taric(): year (no "ano"), euros (no "valor").
#   .iso3a_agregado = TRUE causa error SQL (la tabla iso3a no tiene columna "codigo").
#   Usar .iso3a_agregado = FALSE y agrupar manualmente.
#   Valores exportacion: 68M EUR (2019) -> 112M EUR (2024), tendencia creciente.
#
# HALLAZGO Tomates (CN 0702): codigo estable "0702" en todos los anos 2019-2025.
#   Sin cambio de CN ni anos con datos faltantes.
#   Datos disponibles solo en nivel=4 (nivel=8 devuelve 0 filas).
#   Valores exportacion: 933M EUR (2019) -> 1.2B EUR (2023), ligera caida en 2024-2025.

# ── Diagnóstico: Plátanos (CN 0803) ─────────────────────────────────────────
message("=== DIAGNÓSTICO: Plátanos ===")

platanos_raw <- taric(
  codigo = "0803",
  nivel  = 4,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
)

platanos_resumen <- platanos_raw |>
  group_by(year, codigo) |>
  summarise(valor = sum(euros, na.rm = TRUE), .groups = "drop") |>
  arrange(codigo, year)

print(platanos_resumen, n = 50)
# Buscar: ¿cambia el código CN entre años? ¿Hay salto de 08030010 a otro?

# ── Diagnóstico: Tomates (CN 0702) ──────────────────────────────────────────
message("=== DIAGNÓSTICO: Tomates ===")

tomates_raw <- taric(
  codigo = "0702",
  nivel  = 4,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
)

tomates_resumen <- tomates_raw |>
  group_by(year, codigo) |>
  summarise(valor = sum(euros, na.rm = TRUE), .groups = "drop") |>
  arrange(codigo, year)

print(tomates_resumen, n = 50)

# ── Verificación CN: Cítricos subcategorías ──────────────────────────────────
message("=== CÓDIGOS CN: Cítricos subcategorías ===")

citricos_verify <- bind_rows(
  taric(codigo="080510", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Naranjas"),
  taric(codigo="080520", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Mandarinas"),
  taric(codigo="080550", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Limones"),
  taric(codigo="080540", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Pomelos")
) |>
  group_by(producto) |>
  summarise(valor_total = sum(euros, na.rm=TRUE)) |>
  arrange(desc(valor_total))

print(citricos_verify)

# ── Verificación CN: Melones/Sandías subcategorías ──────────────────────────
message("=== CÓDIGOS CN: Melones/Sandías ===")

melones_verify <- bind_rows(
  taric(codigo="080711", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Sandías"),
  taric(codigo="080719", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Melones")
) |>
  group_by(producto) |>
  summarise(valor_total = sum(euros, na.rm=TRUE)) |>
  arrange(desc(valor_total))

print(melones_verify)

# ── Verificación CN: Pesca subcategorías ────────────────────────────────────
message("=== CÓDIGOS CN: Pesca subcategorías ===")

pesca_verify <- bind_rows(
  taric(codigo="030370", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Atún congelado"),
  taric(codigo="030263", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Merluza congelada"),
  taric(codigo="030271", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Merluza fresca"),
  taric(codigo="030251", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Bacalao fresco"),
  taric(codigo="030743", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Pulpo"),
  taric(codigo="030749", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Sepia/Jibia"),
  taric(codigo="030617", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Gamba"),
  taric(codigo="030627", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Langostino"),
  taric(codigo="030285", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Dorada"),
  taric(codigo="030284", nivel=6, flujo="E", desde=2024, hasta=2024, .codigo_agregado=FALSE, .iso3a_agregado=FALSE) |> mutate(producto="Lubina")
) |>
  group_by(producto) |>
  summarise(valor_total = sum(euros, na.rm=TRUE)) |>
  arrange(desc(valor_total))

print(pesca_verify)

# ── Mapping desagregaciones (códigos CN completos verificados) ───────────────
#
# CORRECCIÓN: taric() acepta el prefijo CN completo (6 dígitos) en "codigo".
#   nivel=6 devuelve datos cuando se pasa el código correcto.
#   Ejemplo verificado: taric(codigo="080510", nivel=6, ...) → 668 filas naranjas.
#
# parent_lv3:
#   "131112" = Pescado fresco (dorada, lubina, merluza fresca, bacalao fresco)
#   "131113" = Pescado congelado (atún congelado, merluza congelada)
#   "131114" = Moluscos/crustáceos (pulpo, sepia, gamba, langostino)

CITRICOS_MAP <- list(
  list(lv4 = "18111101", lit_lv4 = "Naranjas",    cn_prefix = "080510"),
  list(lv4 = "18111102", lit_lv4 = "Mandarinas",  cn_prefix = "080520"),
  list(lv4 = "18111103", lit_lv4 = "Limones",     cn_prefix = "080550"),
  list(lv4 = "18111104", lit_lv4 = "Pomelos",     cn_prefix = "080540")
)

MELONES_MAP <- list(
  list(lv4 = "18111201", lit_lv4 = "Sandías", cn_prefix = "080711"),
  list(lv4 = "18111202", lit_lv4 = "Melones",  cn_prefix = "080719")
)

# Pesca: incluir sólo productos con valor_total > 0 en pesca_verify.
# Bacalao fresco (030251) omitido si devuelve 0 filas — verificar en ejecución.
PESCA_MAP <- list(
  list(lv4 = "13111301", lit_lv4 = "Atún",             cn_prefix = "030370", parent_lv3 = "131113"),
  list(lv4 = "13111302", lit_lv4 = "Merluza congelada",cn_prefix = "030263", parent_lv3 = "131113"),
  list(lv4 = "13111303", lit_lv4 = "Merluza fresca",   cn_prefix = "030271", parent_lv3 = "131112"),
  list(lv4 = "13111304", lit_lv4 = "Pulpo",            cn_prefix = "030743", parent_lv3 = "131114"),
  list(lv4 = "13111305", lit_lv4 = "Sepia/Jibia",      cn_prefix = "030749", parent_lv3 = "131114"),
  list(lv4 = "13111306", lit_lv4 = "Gamba",            cn_prefix = "030617", parent_lv3 = "131114"),
  list(lv4 = "13111307", lit_lv4 = "Langostino",       cn_prefix = "030627", parent_lv3 = "131114"),
  list(lv4 = "13111201", lit_lv4 = "Dorada",           cn_prefix = "030285", parent_lv3 = "131112"),
  list(lv4 = "13111202", lit_lv4 = "Lubina",           cn_prefix = "030284", parent_lv3 = "131112")
)

# ── Función: calcular pct_ue por código CN ───────────────────────────────────

calcular_pct_ue <- function(cn_prefix, flujo, anos, nivel = 6L) {
  message(sprintf("  pct_ue: %s flujo=%s %d-%d", cn_prefix, flujo, min(anos), max(anos)))

  total_df <- taric(
    codigo = cn_prefix,
    nivel  = nivel,
    flujo  = flujo,
    desde  = min(anos),
    hasta  = max(anos),
    .codigo_agregado = FALSE,
    .iso3a_agregado  = FALSE
  ) |>
    group_by(year) |>
    summarise(valor_total = sum(euros, na.rm = TRUE), .groups = "drop")

  ue_df <- taric(
    codigo = cn_prefix,
    nivel  = nivel,
    flujo  = flujo,
    desde  = min(anos),
    hasta  = max(anos),
    iso3a  = UE27_ISO3A,
    .codigo_agregado = FALSE,
    .iso3a_agregado  = FALSE
  ) |>
    group_by(year) |>
    summarise(valor_ue = sum(euros, na.rm = TRUE), .groups = "drop")

  left_join(total_df, ue_df, by = "year") |>
    mutate(
      valor_ue = replace_na(valor_ue, 0),
      pct_ue   = if_else(valor_total > 0,
                         round(valor_ue / valor_total * 100, 1),
                         NA_real_)
    )
}

# ── Función: generar filas CSV para una desagregación ───────────────────────

generar_filas_desagregacion <- function(
    map_entry, flujos = c("E","I"), anos = ANOS,
    parent_lv1, parent_lv2, parent_lv3,
    lit_lv1, lit_lv2, lit_lv3
) {
  rows <- list()

  for (fl in flujos) {
    pct_data <- calcular_pct_ue(map_entry$cn_prefix, fl, anos)

    for (yr in anos) {
      yr_row <- pct_data |> filter(year == yr)
      if (nrow(yr_row) == 0 || yr_row$valor_total == 0) next

      total_mill <- round(yr_row$valor_total / 1e6, 2)
      pct_ue_val <- yr_row$pct_ue

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
        total_millones  = total_mill,
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

# ── Mapping código interno → prefijo CN para pct_ue filas base ──────────────
# Permite calcular pct_ue para las categorías agregadas del CSV base

CODIGO_CN_MAP <- tibble::tribble(
  ~lv3,       ~cn_prefix,
  # Frutas
  "181111",   "080510",   # Cítricos → naranjas como proxy (mayoritario)
  "181112",   "080711",   # Melones/sandías → sandías como proxy
  "181114",   "081010",   # Fresas
  "181118",   "0803",     # Plátano (solo 4-digit disponible)
  "181119",   "081190",   # Los demás frutos rojos
  # Hortalizas
  "171112",   "070960",   # Pimiento
  "171113",   "070700",   # Pepino
  # Pesca
  "131112",   "030271",   # Pescado fresco → merluza fresca como proxy
  "131113",   "030370",   # Pescado congelado → atún como proxy
  "131114",   "030743"    # Moluscos → pulpo como proxy
)

# ── Leer CSV base desde HTML embebido ────────────────────────────────────────
message("Leyendo CSV base del HTML...")

html_content <- readr::read_file(HTML_PATH)

# Extract text between backticks of EMBEDDED_CSV_DATA
csv_match <- regmatches(html_content,
  regexpr("(?<=const EMBEDDED_CSV_DATA = `)([\\s\\S]*?)(?=`;)", html_content, perl=TRUE))

if (length(csv_match) == 0) stop("No se encontró EMBEDDED_CSV_DATA en el HTML")

csv_df <- readr::read_csv(csv_match, show_col_types = FALSE) |>
  mutate(
    year       = as.character(year),
    lv4        = as.character(lv4),
    pct_ue_lv3 = NA_real_,
    pct_ue_lv4 = NA_real_
  )

message(sprintf("CSV base: %d filas", nrow(csv_df)))

# ── Calcular pct_ue_lv3 para filas base con CN mapping ───────────────────────
message("Calculando pct_ue_lv3 para filas base...")

# Get unique combinations of lv3+flujo that have a CN mapping
mapped_lv3 <- CODIGO_CN_MAP$lv3

for (i in seq_len(nrow(CODIGO_CN_MAP))) {
  lv3_code <- CODIGO_CN_MAP$lv3[i]
  cn        <- CODIGO_CN_MAP$cn_prefix[i]
  nivel_use <- if (nchar(cn) >= 6) 6L else 4L

  for (fl in c("E","I")) {
    pct_data <- tryCatch(
      calcular_pct_ue(cn, fl, ANOS, nivel = nivel_use),
      error = function(e) { message(sprintf("  Error %s %s: %s", lv3_code, fl, e$message)); NULL }
    )
    if (is.null(pct_data)) next

    # Update csv_df rows where lv3==lv3_code and flujo==fl
    for (yr in ANOS) {
      yr_row <- pct_data |> filter(year == yr)
      if (nrow(yr_row) == 0) next

      csv_df <<- csv_df |>
        mutate(pct_ue_lv3 = if_else(
          lv3 == lv3_code & flujo == fl & year == as.character(yr),
          yr_row$pct_ue,
          pct_ue_lv3
        ))
    }
  }
  message(sprintf("  Procesado lv3=%s cn=%s", lv3_code, cn))
}

# ── Generar filas desagregadas ────────────────────────────────────────────────

message("Generando filas: Cítricos...")
filas_citricos <- bind_rows(lapply(CITRICOS_MAP, function(m) {
  generar_filas_desagregacion(
    map_entry  = m,
    parent_lv1 = "18", lit_lv1 = "Frutas",
    parent_lv2 = "1811", lit_lv2 = "Frutas",
    parent_lv3 = "181111", lit_lv3 = "Cítricos"
  )
}))
message(sprintf("  Filas cítricos: %d", nrow(filas_citricos)))

message("Generando filas: Melones/Sandías...")
filas_melones <- bind_rows(lapply(MELONES_MAP, function(m) {
  generar_filas_desagregacion(
    map_entry  = m,
    parent_lv1 = "18", lit_lv1 = "Frutas",
    parent_lv2 = "1811", lit_lv2 = "Frutas",
    parent_lv3 = "181112", lit_lv3 = "Melones y sandías"
  )
}))
message(sprintf("  Filas melones/sandías: %d", nrow(filas_melones)))

message("Generando filas: Pesca...")
filas_pesca <- bind_rows(lapply(PESCA_MAP, function(m) {
  # Find parent lit from base CSV
  parent_row <- csv_df |>
    filter(flujo == "E", lv3 == m$parent_lv3, year == "2024") |>
    slice(1)

  if (nrow(parent_row) == 0) {
    message(sprintf("  AVISO: parent_lv3=%s no encontrado en CSV base", m$parent_lv3))
    return(tibble())
  }

  generar_filas_desagregacion(
    map_entry  = m,
    parent_lv1 = parent_row$lv1,  lit_lv1 = parent_row$lit_lv1,
    parent_lv2 = parent_row$lv2,  lit_lv2 = parent_row$lit_lv2,
    parent_lv3 = m$parent_lv3,    lit_lv3 = parent_row$lit_lv3
  )
}))
message(sprintf("  Filas pesca: %d", nrow(filas_pesca)))

# ── Unir todo ────────────────────────────────────────────────────────────────
csv_final <- bind_rows(csv_df, filas_citricos, filas_melones, filas_pesca) |>
  arrange(year, flujo, macro_sector, lv1, lv2, lv3, lv4)

message(sprintf("CSV final: %d filas (%d base + %d nuevas)",
  nrow(csv_final), nrow(csv_df), nrow(csv_final) - nrow(csv_df)))

csv_text_nuevo <- readr::format_csv(csv_final, na = "NA")

# ── Re-embeber CSV en HTML ────────────────────────────────────────────────────

reembeber_csv <- function(html_path, csv_text_nuevo) {
  html <- readr::read_file(html_path)

  # Find start and end of embedded CSV
  pattern <- "(?s)(const EMBEDDED_CSV_DATA = `)([^`]+)(`)"

  if (!grepl(pattern, html, perl = TRUE)) {
    stop("No se encontró EMBEDDED_CSV_DATA en el HTML. Verifica el patrón.")
  }

  html_nuevo <- sub(pattern, paste0("\\1", csv_text_nuevo, "\\3"), html, perl = TRUE)

  readr::write_file(html_nuevo, html_path)
  message(sprintf("HTML actualizado: %s", html_path))
  message(sprintf("Tamaño HTML: %.1f KB", nchar(html_nuevo) / 1024))
}

# Execute
reembeber_csv(HTML_PATH, csv_text_nuevo)
message("Pipeline completo.")
