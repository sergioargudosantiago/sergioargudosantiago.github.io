# Informe discrepancias — Agroalimentario 2025

Fuente web: `comercio-exterior.html` (constante `EMBEDDED_CSV_DATA`, filtro `year=2025, macro=Agroalimentario`).
Fuente Excel: `balanza/Comprobaciones sectores.xlsx` (hoja única, año 2025).

Unidades: millones de euros. Tolerancia comparación: 0,5 M€.

## Nota metodológica

CSV embebido contiene filas agregadas a nivel lv3 (lv4=NA) Y desagregadas a lv4. Para totalizar lv3/lv2/lv1 hay que usar SOLO las filas con `lv4='NA'`. Si el sitio agrega sin ese filtro, los valores se duplican en sectores con detalle lv4 (Pesca, Frutas/Cítricos, Aceite de oliva). Conviene revisar la lógica de `parseCSV` / agregación en `comercio-exterior.html`.

## Totales

| Métrica | Web (lv4=NA) | Excel | Δ |
|---|---:|---:|---:|
| EXPORT Agroalimentario | 76 893,43 | 76 893,69 | −0,26 |
| IMPORT Agroalimentario | 59 253,16 | 59 307,36 | −54,20 |

Exportaciones cuadran. Importaciones del CSV web son sistemáticamente inferiores al Excel (~54 M€). Todas las discrepancias detectadas están en IMPORT.

## Discrepancias por nivel

### Nivel 1 (sector 2 dígitos)

| Código | Sector | Web E / I | Excel E / I | Δ E | Δ I |
|---|---|---:|---:|---:|---:|
| 11 | Sectores Cárnicos | 12 961,36 / 5 011,53 | 12 961,38 / 5 033,55 | −0,02 | **−22,02** |
| 13 | Pesca | 5 740,42 / 9 361,96 | 5 740,42 / 9 362,99 | 0,00 | −1,03 |
| 15 | Industrias alimentarias y piensos | 1 893,75 / 2 790,83 | 1 893,75 / 2 792,72 | 0,00 | −1,89 |
| 21 | Tabaco | 548,23 / 1 769,53 | 548,23 / 1 784,03 | 0,00 | **−14,50** |
| 22 | Grasas y aceites | 7 615,11 / 5 161,21 | 7 615,19 / 5 165,88 | −0,08 | −4,67 |
| 23 | Semillas, oleaginosas, mandioca y forraje | 963,62 / 2 431,13 | 963,68 / 2 431,91 | −0,06 | −0,78 |
| 24 | Café, té, cacao y azúcar | 2 559,81 / 5 407,11 | 2 559,81 / 5 415,88 | 0,00 | **−8,77** |

### Nivel 2 (subsector 4 dígitos)

| Código | Subsector | Web E / I | Excel E / I | Δ E | Δ I |
|---|---|---:|---:|---:|---:|
| 1111 | Bovino | 2 112,33 / 2 223,15 | 2 112,33 / 2 243,60 | 0,00 | **−20,45** |
| 1114 | Aves y huevos | 1 343,54 / 1 362,09 | 1 343,54 / 1 363,10 | 0,00 | −1,01 |
| 1115 | Otros animales | 211,66 / 100,68 | 211,67 / 101,26 | −0,01 | −0,58 |
| 1311 | Pesca | 5 740,42 / 9 361,96 | 5 740,42 / 9 362,99 | 0,00 | −1,03 |
| 1511 | Industrias alimentarias | 1 893,75 / 2 790,83 | 1 893,75 / 2 792,72 | 0,00 | −1,89 |
| 2111 | Tabaco | 548,23 / 1 769,53 | 548,23 / 1 784,03 | 0,00 | −14,50 |
| 2211 | Grasas y aceites | 7 615,11 / 5 161,21 | 7 615,19 / 5 165,88 | −0,08 | −4,67 |
| 2311 | Semillas, oleaginosas, mandioca y forraje | 963,62 / 2 431,13 | 963,68 / 2 431,91 | −0,06 | −0,78 |
| 2411 | Café, té, cacao y azúcar | 2 559,81 / 5 407,11 | 2 559,81 / 5 415,88 | 0,00 | −8,77 |

### Nivel 3 (producto 6 dígitos) — origen de los desfases

| Código | Producto | Web E / I | Excel E / I | Δ E | Δ I |
|---|---|---:|---:|---:|---:|
| 111111 | Animales vivos de bovinos | 234,09 / 668,83 | 234,09 / 689,27 | 0,00 | **−20,44** |
| 111412 | Carne de aves | 629,53 / 738,62 | 629,53 / 739,41 | 0,00 | −0,79 |
| 111512 | Carne de otros animales | 119,16 / 28,82 | 119,17 / 29,40 | −0,01 | −0,58 |
| 151111 | Residuos de productos alimentarios | 427,94 / 1 677,82 | 427,94 / 1 679,60 | 0,00 | −1,78 |
| 211111 | Tabaco | 548,23 / 1 769,53 | 548,23 / 1 784,03 | 0,00 | **−14,50** |
| 221117 | Residuos (grasas/aceites) | 455,01 / 1 297,96 | 455,01 / 1 302,44 | 0,00 | −4,48 |
| 231113 | Otros productos del capítulo 12 | 457,99 / 868,64 | 458,05 / 869,43 | −0,06 | −0,79 |
| 241116 | Azúcar | 151,70 / 881,40 | 151,70 / 890,16 | 0,00 | **−8,76** |

## Diagnóstico

1. **Solo IMPORT está desfasado.** Todas las exportaciones cuadran.
2. **Las discrepancias agregadas (lv1/lv2) son la suma de las discrepancias lv3 hijas** — no hay un error de agregación, son los valores fuente de IMPORT en el CSV embebido los que están desactualizados frente al Excel.
3. **Productos con mayor desfase de IMPORT:** Animales vivos de bovinos (−20,44 M€), Tabaco (−14,50 M€), Azúcar (−8,76 M€), Café/cacao restantes (subimport en código 24), Residuos de grasas (−4,48 M€).
4. **Riesgo adicional (no es discrepancia actual, pero sí latente):** si en algún punto el código agregador suma sin filtrar `lv4='NA'`, sectores con detalle lv4 (Pesca, Cítricos, Aceite de oliva, etc.) se duplican. Verificar en `comercio-exterior.html`.

## Acción recomendada

Regenerar el bloque `EMBEDDED_CSV_DATA` con los valores actualizados del Excel para los 8 productos lv3 listados arriba. Las exportaciones no requieren cambios.
