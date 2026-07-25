---
titulo: Qué mide (y qué no) la cuota UE de un sector
fecha: 2026-07-26
autores: [sergio]
resumen: La cuota UE del visualizador es una media ponderada por valor, no un promedio de porcentajes. La diferencia entre las dos cosas puede ser de varios puntos.
tags: [comercio exterior, metodología, UE]
slug: cuota-ue-que-mide
imagen: images/og-cover.png
puntos:
  - Promediar porcentajes por partida da un número distinto al que sale de sumar valores. No es un matiz.
  - En el visualizador la cuota se calcula sobre el valor en euros, partida a partida de la Nomenclatura Combinada.
  - Cuando parte del tramo no tiene dato, la tarjeta dice sobre qué porcentaje del valor está calculando.
---

La tarjeta de **cuota UE27** del visualizador responde a una pregunta concreta:
de cada euro que exporta un sector, ¿cuántos céntimos van a los otros veintiséis
Estados miembros? Parece trivial y no lo es, porque hay dos formas de calcularlo
y dan resultados distintos.

## Las dos cuentas que se pueden hacer

Supongamos un sector con dos partidas:

| Partida | Valor exportado | Cuota UE |
|---|---|---|
| Una que vende mucho | 900 M€ | 40 % |
| Otra que vende poco | 100 M€ | 95 % |

Si se promedian los dos porcentajes sale **67,5 %**. Si se suma el valor que va
a la UE y se divide entre el valor total —360 + 95 sobre 1.000— sale **45,5 %**.
Veintidós puntos de diferencia entre dos números que se llaman igual.

El segundo es el que describe el sector; el primero describe las partidas, que
es otra cosa. El visualizador usa el segundo:

> La cuota se calcula a nivel de partida de la Nomenclatura Combinada y se
> agrega ponderando por valor, no promediando porcentajes.

## Por qué el promedio simple es tan tentador

Porque es lo que sale solo. Si tienes una tabla con una columna de porcentajes y
la metes en una hoja de cálculo, el botón de la media hace el promedio simple.
Nadie decide hacerlo mal: se hace mal por omisión.

En el código del visualizador la ponderación es explícita:

```js
// Media ponderada de pct_ue por total_millones. Equivale a
// Σ valor_UE / Σ valor_total, porque pct_ue ya es una ratio sobre el valor.
const val = parseNumericValue(row.total_millones);
weightedSum += (pct / 100) * val;
totalValue += val;
```

## El problema de los huecos

Queda un detalle que no se puede resolver con una fórmula mejor: **no todas las
partidas tienen dato de cuota UE**. Dos agrupaciones residuales del
agroalimentario no lo traen. Son poca cosa —alrededor de medio punto del valor
del sector— pero plantean la pregunta de qué hacer con ellas.

Hay tres salidas y solo una es honesta:

1. Tratarlas como si su cuota fuera cero. Falsea el resultado a la baja.
2. Excluirlas del cálculo y no decirlo. El número queda bien y el lector no
   sabe que está mirando una foto recortada.
3. Excluirlas y decir sobre qué parte del valor se está calculando.

El visualizador hace la tercera: cuando la cobertura baja del 99,9 % del valor
del tramo, la tarjeta añade una línea del tipo *«calculado sobre el 99,5 % del
valor del tramo»*. No arregla el hueco, pero deja de esconderlo.

---

Los datos salen de [DataComex](https://datacomex.comercio.es/Metadata/Comex) y
el detalle completo del cálculo está en la
[ficha metodológica](../metodologia.html). El dataset se puede descargar entero
desde el propio [visualizador](../comercio-exterior.html) si quieres rehacer las
cuentas por tu cuenta, que es justo lo que deberías poder hacer.
