# calc_pct_ue_only.R
# Checkpoint incremental: guarda cada combo nada mas terminar.
# Reanudar: relanza el script, salta automaticamente lo ya calculado.
# Sin paralelizacion (era el problema anterior).

library(comerciotools)
library(dplyr)
library(tidyr)
library(readr)

HTML_PATH <- "C:/sergioargudosantiago.github.io/sergioargudosantiago.github.io/comercio-exterior.html"
OUT_PATH  <- "C:/sergioargudosantiago.github.io/sergioargudosantiago.github.io/scripts/pct_ue_results.csv"
CORR_PATH <- "C:/sergioargudosantiago.github.io/sergioargudosantiago.github.io/Correspondencias_Para_Importar.csv"
ANOS      <- 2021:2025

UE27_ISO3A <- c(
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
  "DEU","GRC","HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD",
  "POL","PRT","ROU","SVK","SVN","SWE"
)

# ── Leer CSV embebido ──────────────────────────────────────────────────────────
html_content <- readr::read_file(HTML_PATH)
csv_match <- regmatches(html_content,
  regexpr("(?<=const EMBEDDED_CSV_DATA = `)([\\s\\S]*?)(?=`;)", html_content, perl=TRUE))
if (length(csv_match) == 0) stop("No se encontro EMBEDDED_CSV_DATA en HTML")

csv_df <- readr::read_csv(I(csv_match), show_col_types = FALSE) |>
  mutate(year = as.character(year), lv3 = as.character(lv3))

agro_lv3 <- csv_df |> filter(macro_sector == "Agroalimentario", !is.na(lv3), lv3 != "NA") |> distinct(lv3) |> pull(lv3)
ind_lv3  <- csv_df |> filter(macro_sector != "Agroalimentario", !is.na(lv3), lv3 != "NA") |> distinct(lv3) |> pull(lv3)
message(sprintf("Agro lv3: %d | Industrial lv3: %d", length(agro_lv3), length(ind_lv3)))

# Mapa CN agroalimentario
corr_df <- readr::read_delim(CORR_PATH, delim = ";", show_col_types = FALSE,
                              col_types = readr::cols(.default = "c")) |>
  mutate(codigo_nc = trimws(codigo_nc), lv3 = trimws(lv3)) |>
  filter(nchar(codigo_nc) >= 6)

AGRO_CN_MAP <- corr_df |>
  mutate(cn_prefix = substr(codigo_nc, 1, 6)) |>
  distinct(lv3, cn_prefix)

# ── Checkpoint: cargar ya calculados ──────────────────────────────────────────
if (file.exists(OUT_PATH)) {
  prev <- readr::read_csv(OUT_PATH, show_col_types = FALSE) |>
    mutate(year = as.character(year), lv3 = as.character(lv3))
  done_keys <- paste(prev$macro_sector, prev$lv3, prev$flujo, sep="|") |> unique()
  message(sprintf("Reanudando: %d combos ya calculados", length(done_keys)))
} else {
  prev <- tibble(macro_sector=character(), lv3=character(), flujo=character(),
                 year=character(), pct_ue=numeric())
  done_keys <- character(0)
  readr::write_csv(prev, OUT_PATH)  # crea fichero vacio con cabecera
}

# ── Funcion guardar una fila de resultado ──────────────────────────────────────
append_result <- function(df) {
  readr::write_csv(df, OUT_PATH, append = TRUE)
}

# ── AGROALIMENTARIO ────────────────────────────────────────────────────────────
message("=== AGROALIMENTARIO ===")
total_agro <- length(agro_lv3) * 2
done_agro  <- 0

for (lv3_code in agro_lv3) {
  cn_prefixes <- AGRO_CN_MAP |> filter(lv3 == lv3_code) |> pull(cn_prefix)

  for (fl in c("E","I")) {
    done_agro <- done_agro + 1
    key <- paste("Agroalimentario", lv3_code, fl, sep="|")

    if (key %in% done_keys) {
      message(sprintf("  [%d/%d] SKIP lv3=%s flujo=%s", done_agro, total_agro, lv3_code, fl))
      next
    }

    if (length(cn_prefixes) == 0) {
      message(sprintf("  [%d/%d] SIN CN lv3=%s flujo=%s", done_agro, total_agro, lv3_code, fl))
      next
    }

    message(sprintf("  [%d/%d] lv3=%s flujo=%s (%d CN)...", done_agro, total_agro, lv3_code, fl, length(cn_prefixes)))

    query_taric <- function(iso_filter = NULL) {
      rows <- lapply(cn_prefixes, function(cn) {
        args <- list(codigo = cn, nivel = 6L, flujo = fl,
                     desde = min(ANOS), hasta = max(ANOS),
                     .codigo_agregado = FALSE, .iso3a_agregado = FALSE)
        if (!is.null(iso_filter)) args$iso3a <- iso_filter
        tryCatch(do.call(taric, args), error = function(e) NULL)
      })
      bind_rows(rows)
    }

    total_df <- tryCatch(
      query_taric() |> group_by(year) |> summarise(valor_total = sum(euros, na.rm=TRUE), .groups="drop"),
      error = function(e) { message("    Error total: ", e$message); NULL }
    )
    if (is.null(total_df) || nrow(total_df) == 0) next

    ue_df <- tryCatch(
      query_taric(UE27_ISO3A) |> group_by(year) |> summarise(valor_ue = sum(euros, na.rm=TRUE), .groups="drop"),
      error = function(e) tibble(year = integer(), valor_ue = numeric())
    )

    result <- left_join(total_df, ue_df, by="year") |>
      mutate(valor_ue = replace_na(valor_ue, 0),
             pct_ue = if_else(valor_total > 0, round(valor_ue/valor_total*100, 1), NA_real_),
             lv3 = lv3_code, flujo = fl, macro_sector = "Agroalimentario") |>
      select(macro_sector, lv3, flujo, year, pct_ue)

    append_result(result)
    done_keys <- c(done_keys, key)
    message(sprintf("    OK: %d filas guardadas", nrow(result)))
  }
}

# ── INDUSTRIAL ─────────────────────────────────────────────────────────────────
message("=== INDUSTRIAL ===")
total_ind <- length(ind_lv3) * 2
done_ind  <- 0

for (lv3_code in ind_lv3) {
  for (fl in c("E","I")) {
    done_ind <- done_ind + 1
    key <- paste("Industrial", lv3_code, fl, sep="|")

    if (key %in% done_keys) {
      message(sprintf("  [%d/%d] SKIP lv3=%s flujo=%s", done_ind, total_ind, lv3_code, fl))
      next
    }

    message(sprintf("  [%d/%d] lv3=%s flujo=%s...", done_ind, total_ind, lv3_code, fl))

    total_ind_df <- tryCatch(
      sec(codigo = lv3_code, nivel = 3, flujo = fl,
          desde = min(ANOS), hasta = max(ANOS),
          .codigo_agregado = FALSE, .iso3a_agregado = FALSE) |>
        group_by(year) |> summarise(valor_total = sum(euros, na.rm=TRUE), .groups="drop"),
      error = function(e) { message("    Error total: ", e$message); NULL }
    )
    if (is.null(total_ind_df) || nrow(total_ind_df) == 0) next

    ue_ind_df <- tryCatch(
      sec(codigo = lv3_code, nivel = 3, flujo = fl,
          desde = min(ANOS), hasta = max(ANOS),
          iso3a = UE27_ISO3A,
          .codigo_agregado = FALSE, .iso3a_agregado = FALSE) |>
        group_by(year) |> summarise(valor_ue = sum(euros, na.rm=TRUE), .groups="drop"),
      error = function(e) tibble(year = integer(), valor_ue = numeric())
    )

    result <- left_join(total_ind_df, ue_ind_df, by="year") |>
      mutate(valor_ue = replace_na(valor_ue, 0),
             pct_ue = if_else(valor_total > 0, round(valor_ue/valor_total*100, 1), NA_real_),
             lv3 = lv3_code, flujo = fl, macro_sector = "Industrial") |>
      select(macro_sector, lv3, flujo, year, pct_ue)

    append_result(result)
    done_keys <- c(done_keys, key)
    message(sprintf("    OK: %d filas guardadas", nrow(result)))
  }
}

message(sprintf("=== COMPLETO. Total filas: %d ===", nrow(readr::read_csv(OUT_PATH, show_col_types=FALSE))))
