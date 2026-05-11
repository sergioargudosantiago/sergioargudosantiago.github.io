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

# ── Verificación CN: Cítricos (0805) ────────────────────────────────────────
message("=== CÓDIGOS CN: Cítricos ===")

citricos_cn <- taric(
  codigo = "0805",
  nivel  = 4,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(euros, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(citricos_cn)
# HALLAZGO: BD sólo devuelve nivel=4 → una sola fila con codigo="0805"

# ── Verificación CN: Melones y Sandías (0807) ───────────────────────────────
message("=== CÓDIGOS CN: Melones/Sandías ===")

melones_cn <- taric(
  codigo = "0807",
  nivel  = 4,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(euros, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(melones_cn)
# HALLAZGO: BD sólo devuelve nivel=4 → una sola fila con codigo="0807"

# ── Verificación CN: Pesca ───────────────────────────────────────────────────
message("=== CÓDIGOS CN: Pesca ===")

pesca_cn <- taric(
  codigo = c("0302","0303","0306","0307"),
  nivel  = 4,
  flujo  = "E",
  desde  = 2024,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
) |>
  group_by(codigo) |>
  summarise(valor_total = sum(euros, na.rm = TRUE)) |>
  arrange(desc(valor_total))

print(pesca_cn, n = 40)

# ── Mapping desagregaciones (códigos verificados) ────────────────────────────
#
# HALLAZGO nivel CN: La BD sólo tiene datos a nivel=4 (4 dígitos CN).
#   nivel=6 y nivel=8 devuelven 0 filas. El campo "codigo" siempre es
#   un string de 4 dígitos ("0805", "0807", "0302", etc.).
#   Por tanto cn_prefix debe ser 4 dígitos y la desagregación sub-producto
#   (naranjas vs mandarinas) NO es posible desde esta BD.
#   CITRICOS y MELONES se tratan como una sola entrada por código CN.
#   PESCA se desagrega por los 4 códigos CN disponibles (0302/0303/0306/0307).

CITRICOS_MAP <- list(
  list(lv4 = "18111101", lit_lv4 = "Cítricos", cn_prefix = "0805")
)

MELONES_MAP <- list(
  list(lv4 = "18111201", lit_lv4 = "Melones y sandías", cn_prefix = "0807")
)

# Pesca: los 4 códigos CN con datos en la BD (por valor total 2024-2025):
#   0307 = moluscos (2.47B), 0303 = pescado congelado (1.76B),
#   0302 = pescado fresco/refrigerado (1.44B), 0306 = crustáceos (0.98B)
PESCA_MAP <- list(
  list(lv4 = "13111401", lit_lv4 = "Moluscos",              cn_prefix = "0307", parent_lv3 = "131114"),
  list(lv4 = "13111301", lit_lv4 = "Pescado congelado",     cn_prefix = "0303", parent_lv3 = "131113"),
  list(lv4 = "13111201", lit_lv4 = "Pescado fresco",        cn_prefix = "0302", parent_lv3 = "131112"),
  list(lv4 = "13111402", lit_lv4 = "Crustáceos",            cn_prefix = "0306", parent_lv3 = "131114")
)
