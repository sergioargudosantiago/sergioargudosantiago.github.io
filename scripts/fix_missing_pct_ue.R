# fix_missing_pct_ue.R
# Reintenta calcular pct_ue para los 22 combos que fallaron.
# Prueba nivel=4 si nivel=6 falla (algunos CN solo tienen datos agregados).

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

# Combos que faltan
MISSING <- list(
  list(lv3="141121", flujo="I"),
  list(lv3="151111", flujo="E"), list(lv3="151111", flujo="I"),
  list(lv3="151112", flujo="E"), list(lv3="151112", flujo="I"),
  list(lv3="161111", flujo="E"), list(lv3="161111", flujo="I"),
  list(lv3="171112", flujo="E"), list(lv3="171112", flujo="I"),
  list(lv3="171113", flujo="E"), list(lv3="171113", flujo="I"),
  list(lv3="171114", flujo="E"), list(lv3="171114", flujo="I"),
  list(lv3="171115", flujo="E"), list(lv3="171115", flujo="I"),
  list(lv3="171116", flujo="E"), list(lv3="171116", flujo="I"),
  list(lv3="171117", flujo="E"), list(lv3="171117", flujo="I"),
  list(lv3="171118", flujo="E"), list(lv3="171118", flujo="I"),
  list(lv3="171119", flujo="E")
)

# Mapa CN
corr_df <- readr::read_delim(CORR_PATH, delim = ";", show_col_types = FALSE,
                              col_types = readr::cols(.default = "c")) |>
  mutate(codigo_nc = trimws(codigo_nc), lv3 = trimws(lv3)) |>
  filter(nchar(codigo_nc) >= 6)

AGRO_CN_MAP <- corr_df |>
  mutate(cn_prefix = substr(codigo_nc, 1, 6)) |>
  distinct(lv3, cn_prefix)

calc_pct <- function(cn_prefixes, fl, nivel = 6L) {
  query <- function(iso_filter = NULL) {
    rows <- lapply(cn_prefixes, function(cn) {
      args <- list(codigo = cn, nivel = nivel, flujo = fl,
                   desde = min(ANOS), hasta = max(ANOS),
                   .codigo_agregado = FALSE, .iso3a_agregado = FALSE)
      if (!is.null(iso_filter)) args$iso3a <- iso_filter
      tryCatch(do.call(taric, args), error = function(e) NULL)
    })
    bind_rows(rows)
  }
  total_df <- tryCatch(
    query() |> group_by(year) |> summarise(valor_total = sum(euros, na.rm=TRUE), .groups="drop"),
    error = function(e) NULL
  )
  if (is.null(total_df) || nrow(total_df) == 0) return(NULL)
  ue_df <- tryCatch(
    query(UE27_ISO3A) |> group_by(year) |> summarise(valor_ue = sum(euros, na.rm=TRUE), .groups="drop"),
    error = function(e) tibble(year = integer(), valor_ue = numeric())
  )
  left_join(total_df, ue_df, by="year") |>
    mutate(valor_ue = replace_na(valor_ue, 0),
           pct_ue = if_else(valor_total > 0, round(pmin(valor_ue/valor_total*100, 100), 1), NA_real_))
}

total <- length(MISSING)
for (i in seq_along(MISSING)) {
  item <- MISSING[[i]]
  lv3_code <- item$lv3
  fl <- item$flujo
  message(sprintf("[%d/%d] lv3=%s flujo=%s", i, total, lv3_code, fl))

  cn_prefixes <- AGRO_CN_MAP |> filter(lv3 == lv3_code) |> pull(cn_prefix)
  if (length(cn_prefixes) == 0) {
    message("  Sin CN, saltando")
    next
  }
  message(sprintf("  Probando nivel=6 (%d CN)...", length(cn_prefixes)))
  result <- calc_pct(cn_prefixes, fl, nivel = 6L)

  if (is.null(result)) {
    message("  nivel=6 fallo, probando nivel=4...")
    cn4 <- unique(substr(cn_prefixes, 1, 4))
    result <- calc_pct(cn4, fl, nivel = 4L)
  }

  if (is.null(result)) {
    message("  Sin datos en ningún nivel, saltando")
    next
  }

  out <- result |>
    mutate(lv3 = lv3_code, flujo = fl, macro_sector = "Agroalimentario",
           year = as.character(year)) |>
    select(macro_sector, lv3, flujo, year, pct_ue) |>
    filter(!is.na(pct_ue))

  readr::write_csv(out, OUT_PATH, append = TRUE)
  message(sprintf("  OK: %d filas guardadas", nrow(out)))
}

message("=== Completo ===")
final <- readr::read_csv(OUT_PATH, show_col_types = FALSE) |>
  distinct(macro_sector, lv3, flujo, year, .keep_all = TRUE)
readr::write_csv(final, OUT_PATH)
message(sprintf("Total filas en pct_ue_results.csv: %d", nrow(final)))
