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
