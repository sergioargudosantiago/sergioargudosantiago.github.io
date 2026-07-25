# Revisión del temario

Proceso para comprobar que el contenido de los esquemas es correcto, gastando lo
mínimo. La idea de fondo: **todo lo que puede decidir una regla, lo decide una regla**;
el modelo solo se usa para lo que de verdad requiere criterio.

## Por qué está montado así

Los 101 esquemas suman unas 111.000 palabras. Pasárselos a un modelo en PDF cuesta del
orden de diez veces más que en texto plano, y buena parte de los fallos típicos de un
temario de oposición (normativa derogada, organismos renombrados, cifras viejas, tildes
perdidas) se detectan con una expresión regular. Gastar créditos en eso es tirar dinero.

## Los tres pasos

```bash
npm run temas:revisar
```

Eso encadena los dos primeros, que son gratuitos:

**1 · Extracción** — `scripts/extraer-temas.sh`
Convierte cada PDF a texto con `pdftotext`, en UTF-8 y deduplicando la cabecera que se
repite en cada página (ahorra en torno a un 11 % de palabras). Salida en `review/txt/`,
que está en `.gitignore` porque se regenera en segundos.

**2 · Auditoría determinista** — `scripts/auditar-temas.js`
Sin coste de modelo. Comprueba:

- temas que faltan respecto al temario oficial de `js/main.js`;
- títulos de fichero que no coinciden con el título oficial;
- esquemas anormalmente cortos;
- organismos y tratados renombrados o sustituidos;
- estadísticas citadas con más de tres años;
- palabras del dominio sin tilde;
- y extrae **todas** las citas normativas agrupadas por tema, que es lo más útil para
  revisar de un vistazo qué puede haber cambiado.

Escribe `review/auditoria-automatica.md` y `review/estado.json`.

**3 · Revisión de contenido con modelo** — solo lo que quede después del paso 2.

## Reglas de coste para el paso 3

- El modelo lee **únicamente los `.txt`**. Nunca un PDF.
- **Por lotes temáticos**, no tema a tema: así el contexto normativo compartido se carga
  una vez. Agrupación sugerida:

  | Lote | Temas | Bloque |
  |---|---|---|
  | 1 | ej3 21–31 | Aduanas, defensa comercial, obstáculos |
  | 2 | ej3 41–53 | UE: instituciones y políticas internas |
  | 3 | ej3 54–58 | Política comercial común y acuerdos |
  | 4 | ej3 34–40 | Organismos internacionales, OMC, FMI |
  | 5 | ej3 1–20 | Comercio exterior español, financiación |
  | 6–8 | ej5 | Economía, políticas sectoriales, derecho administrativo |

- **Salida obligatoria en JSONL corto**: `{tema, tipo, gravedad, cita, correccion}`. Los
  tokens de salida son los caros; un informe en prosa por tema multiplica el coste sin
  añadir nada.
- **Modelo pequeño para el triaje, grande solo para lo que el triaje marque como grave.**
- **Empezar por un lote piloto** (el 1, once temas) y medir el coste real antes de
  comprometerse con los ocho.

## El ledger

`review/estado.json` guarda un hash del texto de cada tema. Si al volver a auditar el
hash no ha cambiado, ese tema ya no necesita revisarse otra vez: es lo que impide pagar
dos veces por el mismo contenido entre sesiones. Al anotar una revisión, rellena
`revisado` (fecha) y `hallazgos` (número) en la entrada correspondiente.

## Estado actual

Última auditoría automática: **25 de julio de 2026**.

- 101 esquemas extraídos, 111.135 palabras.
- **58 temas sin esquema**: los 55 del ejercicio 1 (no hay ninguno) y los temas 12, 33
  y 43 del ejercicio 3.
- 7 avisos de contenido, ninguno grave.
- **98 de 101 esquemas con tildes perdidas.** Es el hallazgo con más recorrido y no
  necesita IA: se corrige sobre los `.docx` de `public/temas/` y se reexporta el PDF.
- Revisión con modelo: **pendiente**, no se ha lanzado ningún lote todavía.
