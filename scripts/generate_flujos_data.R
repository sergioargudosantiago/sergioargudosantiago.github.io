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
