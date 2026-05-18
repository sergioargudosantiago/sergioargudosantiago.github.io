readRenviron("C:/Users/sargudo/OneDrive - MINECO/Documentos/.Renviron")

library(comerciotools)
library(dplyr)

# ── DIAGNOSTICO: Platanos (CN 0803) ─────────────────────────────────────────
message("=== DIAGNOSTICO: Platanos ===")

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

# ── DIAGNOSTICO: Tomates (CN 0702) ──────────────────────────────────────────
message("=== DIAGNOSTICO: Tomates ===")

tomates_raw <- taric(
  codigo = "0702",
  nivel  = 4,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
)

cat("Filas tomates nivel=4:", nrow(tomates_raw), "\n")

# Try nivel=8 for tomates
tomates_8 <- taric(
  codigo = "0702",
  nivel  = 8,
  flujo  = "E",
  desde  = 2019,
  hasta  = 2025,
  .codigo_agregado = FALSE,
  .iso3a_agregado  = FALSE
)
cat("Filas tomates nivel=8:", nrow(tomates_8), "\n")

# Use whichever has data
tomates_use <- if (nrow(tomates_8) > 0) tomates_8 else tomates_raw

tomates_resumen <- tomates_use |>
  group_by(year, codigo) |>
  summarise(valor = sum(euros, na.rm = TRUE), .groups = "drop") |>
  arrange(codigo, year)

print(tomates_resumen, n = 50)
