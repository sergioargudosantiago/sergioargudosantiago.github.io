# scripts/patch_filas_faltantes.R
# Añade filas faltantes al CSV ya embebido sin relanzar el pipeline completo.
# Productos: Atún, Merluza congelada, Mandarinas, Bacalao fresco, Bacalao congelado

library(comerciotools)
library(dplyr)
library(tidyr)
library(readr)

HTML_PATH <- "C:/sergioargudosantiago.github.io/sergioargudosantiago.github.io/comercio-exterior.html"
ANOS      <- 2021:2025

UE27_ISO3A <- c(
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
  "DEU","GRC","HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD",
  "POL","PRT","ROU","SVK","SVN","SWE"
)

# ── Productos a añadir ────────────────────────────────────────────────────────

NUEVOS_MAP <- list(
  list(
    lv4        = "13111301",
    lit_lv4    = "Atún",
    cn_prefixes = c("030231","030232","030233","030234","030235","030239"),
    parent_lv1 = "13", lit_lv1 = "Pesca y acuicultura",
    parent_lv2 = "1311", lit_lv2 = "Pesca",
    parent_lv3 = "131113", lit_lv3 = "Pescado congelado"
  ),
  list(
    lv4        = "13111302",
    lit_lv4    = "Merluza congelada",
    cn_prefixes = c("030366"),
    parent_lv1 = "13", lit_lv1 = "Pesca y acuicultura",
    parent_lv2 = "1311", lit_lv2 = "Pesca",
    parent_lv3 = "131113", lit_lv3 = "Pescado congelado"
  ),
  list(
    lv4        = "18111102",
    lit_lv4    = "Mandarinas",
    cn_prefixes = c("080521","080522","080529"),
    parent_lv1 = "18", lit_lv1 = "Frutas",
    parent_lv2 = "1811", lit_lv2 = "Frutas",
    parent_lv3 = "181111", lit_lv3 = "Cítricos"
  ),
  list(
    lv4        = "13111205",
    lit_lv4    = "Bacalao fresco",
    cn_prefixes = c("030444"),
    parent_lv1 = "13", lit_lv1 = "Pesca y acuicultura",
    parent_lv2 = "1311", lit_lv2 = "Pesca",
    parent_lv3 = "131112", lit_lv3 = "Pescado fresco"
  ),
  list(
    lv4        = "13111308",
    lit_lv4    = "Bacalao congelado",
    cn_prefixes = c("030471"),
    parent_lv1 = "13", lit_lv1 = "Pesca y acuicultura",
    parent_lv2 = "1311", lit_lv2 = "Pesca",
    parent_lv3 = "131113", lit_lv3 = "Pescado congelado"
  )
)

# ── Función: calcular pct_ue para vector de prefijos CN ──────────────────────

calcular_pct_ue_multi <- function(cn_prefixes, flujo, anos) {
  query_taric <- function(iso3a_filter = NULL) {
    rows <- lapply(cn_prefixes, function(cn) {
      nivel_use <- if (nchar(cn) >= 6) 6L else 4L
      args <- list(
        codigo = cn, nivel = nivel_use, flujo = flujo,
        desde = min(anos), hasta = max(anos),
        .codigo_agregado = FALSE, .iso3a_agregado = FALSE
      )
      if (!is.null(iso3a_filter)) args$iso3a <- iso3a_filter
      tryCatch(do.call(taric, args), error = function(e) {
        message(sprintf("    taric(%s) error: %s", cn, e$message)); NULL
      })
    })
    bind_rows(rows)
  }

  total_df <- query_taric() |>
    group_by(year) |>
    summarise(valor_total = sum(euros, na.rm = TRUE), .groups = "drop")

  ue_df <- query_taric(UE27_ISO3A) |>
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

# ── Leer CSV actual desde HTML ────────────────────────────────────────────────

message("Leyendo CSV actual del HTML...")
html_content <- read_file(HTML_PATH)
csv_match    <- regmatches(html_content,
  regexpr("(?<=const EMBEDDED_CSV_DATA = `)([\\s\\S]*?)(?=`;)", html_content, perl = TRUE))
if (length(csv_match) == 0) stop("No se encontró EMBEDDED_CSV_DATA")

csv_df <- read_csv(I(csv_match), show_col_types = FALSE) |>
  mutate(year = as.character(year), lv4 = as.character(lv4))

message(sprintf("CSV actual: %d filas", nrow(csv_df)))

# ── Generar filas nuevas ──────────────────────────────────────────────────────

todas_nuevas <- list()

for (prod in NUEVOS_MAP) {
  message(sprintf("Procesando: %s (CN: %s)", prod$lit_lv4, paste(prod$cn_prefixes, collapse=",")))

  filas_prod <- list()
  for (fl in c("E","I")) {
    pct_data <- tryCatch(
      calcular_pct_ue_multi(prod$cn_prefixes, fl, ANOS),
      error = function(e) { message(sprintf("  Error %s %s: %s", prod$lit_lv4, fl, e$message)); NULL }
    )
    if (is.null(pct_data) || nrow(pct_data) == 0) {
      message(sprintf("  Sin datos: %s flujo=%s", prod$lit_lv4, fl))
      next
    }

    for (yr in ANOS) {
      yr_row <- pct_data |> filter(year == yr)
      if (nrow(yr_row) == 0 || yr_row$valor_total == 0) next

      filas_prod[[length(filas_prod) + 1]] <- tibble(
        year           = as.character(yr),
        flujo          = fl,
        macro_sector   = "Agroalimentario",
        lv1            = prod$parent_lv1,
        lit_lv1        = prod$lit_lv1,
        lv2            = prod$parent_lv2,
        lit_lv2        = prod$lit_lv2,
        lv3            = prod$parent_lv3,
        lit_lv3        = prod$lit_lv3,
        lv4            = prod$lv4,
        lit_lv4        = prod$lit_lv4,
        total_millones = round(yr_row$valor_total / 1e6, 2),
        top_paises_lv1 = NA_character_,
        tva_lv1        = NA_real_,
        top_paises_lv2 = NA_character_,
        tva_lv2        = NA_real_,
        top_paises_lv3 = NA_character_,
        tva_lv3        = NA_real_,
        top_paises_lv4 = NA_character_,
        tva_lv4        = NA_real_,
        pct_ue_lv3     = NA_real_,
        pct_ue_lv4     = if_else(!is.na(yr_row$pct_ue), yr_row$pct_ue, NA_real_)
      )
    }
  }

  n_prod <- length(filas_prod)
  message(sprintf("  Filas generadas: %d", n_prod))
  if (n_prod > 0) todas_nuevas <- c(todas_nuevas, filas_prod)
}

nuevas_df <- bind_rows(todas_nuevas)
message(sprintf("Total filas nuevas: %d", nrow(nuevas_df)))

if (nrow(nuevas_df) == 0) {
  message("ADVERTENCIA: ninguna fila generada. Verificar códigos CN en SGEYPC.")
  quit(save = "no")
}

# ── Unir y re-embeber ─────────────────────────────────────────────────────────

csv_final <- bind_rows(csv_df, nuevas_df) |>
  arrange(year, flujo, macro_sector, lv1, lv2, lv3, lv4)

message(sprintf("CSV final: %d filas (%d anteriores + %d nuevas)",
  nrow(csv_final), nrow(csv_df), nrow(nuevas_df)))

csv_text_nuevo <- format_csv(csv_final, na = "NA")

pattern   <- "(?s)(const EMBEDDED_CSV_DATA = `)([^`]+)(`)"
html_nuevo <- sub(pattern, paste0("\\1", csv_text_nuevo, "\\3"), html_content, perl = TRUE)
write_file(html_nuevo, HTML_PATH)

message(sprintf("HTML actualizado. Tamaño: %.1f KB", nchar(html_nuevo) / 1024))
message("Patch completo.")
