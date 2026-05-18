# Spec: Mejoras Flujos Comerciales

**Fecha:** 2026-05-11  
**Proyecto:** sergioargudosantiago.github.io — `comercio-exterior.html`

---

## 1. Resumen

Cuatro mejoras al apartado de Flujos Comerciales:

1. **% UE en card analítica** — mostrar cuota UE27 en la card TVA para todos los niveles de industrial y agroalimentario
2. **Desagregación agroalimentaria** — añadir subcategorías: cítricos (4), melones/sandías (2), pesca (productos principales ES)
3. **Investigar TARIC plátanos/tomates** — diagnosticar discontinuidades de código CN
4. **Navbar fluido** — proporciones correctas en cualquier zoom/pantalla via `clamp()`

---

## 2. Arquitectura de datos

### 2.1 Script R: `scripts/generate_flujos_data.R`

**Entradas:** SGEYPC PostgreSQL via `comerciotools::taric()`  
**Salida:** CSV embebido actualizado en `comercio-exterior.html`

**Pasos:**

1. Definir vector `UE27_ISO3A` con los 27 códigos iso3a de miembros UE actuales (sin UK, sin NO, sin CH)

2. Para cada combinación flujo × año presente en el CSV actual:
   - `taric(flujo=f, desde=y, hasta=y, .codigo_agregado=FALSE)` → total por código
   - `taric(flujo=f, desde=y, hasta=y, iso3a=UE27_ISO3A, .codigo_agregado=FALSE)` → total UE por código
   - `pct_ue = valor_ue / valor_total * 100` por código
   - Agregar `pct_ue` a cada nivel (lv1=suma_hijos, lv2=suma_hijos, lv3=código, lv4=código)

3. Añadir columnas al CSV: `pct_ue_lv3`, `pct_ue_lv4` (NA si sin datos)

4. Añadir filas nuevas para desagregaciones (ver sección 3)

5. Re-embeber CSV en HTML: sustituir bloque entre backticks de `EMBEDDED_CSV_DATA`

### 2.2 Columnas nuevas en CSV

```
...,pct_ue_lv3,pct_ue_lv4
```

- Valor: número 0-100 redondeado a 1 decimal, o NA
- `pct_ue_lv3`: cuota UE del código lv3 (o agregado de sus hijos si tiene lv4)
- `pct_ue_lv4`: cuota UE del código lv4 terminal

---

## 3. Desagregaciones agroalimentarias

Todas las filas nuevas se añaden con la misma estructura que las existentes. Las categorías padre existentes se mantienen.

### 3.1 Cítricos → 4 subcategorías

Categoría padre actual: `lv3=181111, lit_lv3=Cítricos`  
Nueva jerarquía: Frutas → Cítricos → [subcategorías como lv4]

| lv4 | lit_lv4 | CN8 aprox. |
|-----|---------|-----------|
| 18111101 | Naranjas | 0805 10 |
| 18111102 | Mandarinas | 0805 20 |
| 18111103 | Limones | 0805 50 10 |
| 18111104 | Pomelos | 0805 40 |

Verificar códigos CN exactos via `taric(codigo="0805", nivel=8)` antes de usar.

### 3.2 Melones y sandías → 2 subcategorías

Categoría padre actual: `lv3=181112, lit_lv3=Melones y sandías`

| lv4 | lit_lv4 | CN8 aprox. |
|-----|---------|-----------|
| 18111201 | Sandías | 0807 11 |
| 18111202 | Melones | 0807 19 |

### 3.3 Pesca → productos principales España

Categoría padre actual: `lv3=131113, lit_lv3=Pescado congelado` + `131114 Moluscos/crustáceos` + otras

Productos a desagregar (lv4 dentro de sus lv3 correspondientes):

- Atún (0302/0303 70)
- Merluza (0302 71 / 0303 63)
- Bacalao (0302 50 / 0303 51)
- Pulpo (0307 43)
- Sepia/jibia (0307 49)
- Gamba/langostino (0306 17 / 0306 27)
- Dorada (0302 85)
- Lubina (0302 84)

Verificar códigos CN via `taric(codigo=c("0302","0303","0306","0307"), nivel=8)`.

---

## 4. Investigación TARIC plátanos/tomates

**Plátanos (actual: 181118):** Valor 2021 = 6,28 M€ (anómalamente bajo para España).  
Hipótesis: reclasificación CN desde 0803 → subcódigos distintos entre años.  
Acción: `taric(codigo="0803", nivel=8, desde=2019, hasta=2025)` → ver si hay saltos de código.

**Tomates:** Verificar si existe entrada en el CSV o está agrupada en "Las demás hortalizas frescas" (171119).  
Acción: `taric(codigo="0702", nivel=8, desde=2019, hasta=2025)` → confirmar código activo.

Documentar hallazgos como comentario en el script R.

---

## 5. UI — Card TVA + % UE

### 5.1 Layout de `card-tva`

La card se divide en dos mitades con `flex-col`:

```
┌─────────────────────┐
│  TASA VAR. ANUAL    │
│                     │
│    ▲ 12,3%          │
│  Comparativa 24-25  │
├─────────────────────┤  ← border-t border-primary/20
│  CUOTA UE           │
│                     │
│    67,4%            │
│  [████████░░] barra │
│  % hacia/desde UE   │
└─────────────────────┘
```

### 5.2 Badge % UE

- Color: fondo `#003399` con 15% opacidad, texto `#003399` (o variante dark)
- Barra: `div` con `width: pct_ue%`, color azul UE, altura 4px, fondo gris claro
- Etiqueta dinámica: exportaciones → "% hacia UE", importaciones → "% desde UE"
- Si `pct_ue` es NA → texto "No disponible" en gris muted

### 5.3 Lógica JS

En `updateDashboardMetrics(filtered, title, level)`:
- Calcular `pct_ue` ponderado de las filas filtradas: `sum(total * pct_ue) / sum(total)` donde `pct_ue != NA`
- Usar `pct_ue_lv3` o `pct_ue_lv4` según nivel de navegación
- Llamar `renderEUShare(pct_ue, currentFlow)` nueva función

---

## 6. Navbar fluido

Sustituir en `.nav-island`, `.nav-logo img`, `.nav-segment`:

```css
.nav-island {
  height: clamp(3rem, 4.2vw, 4.5rem);
  max-width: 96vw;
  padding: 0 clamp(0.15rem, 0.25vw, 0.25rem);
}
.nav-island img {
  width: clamp(140px, 12.5vw, 260px);
  height: auto;
}
.nav-segment {
  padding: 0 clamp(0.45rem, 0.9vw, 1.25rem);
  font-size: clamp(0.58rem, 0.62vw, 0.75rem);
}
```

Calibrado para: 27" a 75% zoom (≈1920px efectivos) = valores actuales. Comprime a pantallas/zooms menores.

---

## 7. Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `scripts/generate_flujos_data.R` | Nuevo — pipeline datos EU + desagregaciones |
| `comercio-exterior.html` | CSS navbar, HTML+JS card TVA, CSV embebido |

---

## 8. Fuera de scope

- Balanza de Pagos (sin cambios)
- Otras pestañas (temario, sobre-mi, enlaces)
- Datos no agroalimentarios ni pesca en desagregación (industrial sin cambios)
