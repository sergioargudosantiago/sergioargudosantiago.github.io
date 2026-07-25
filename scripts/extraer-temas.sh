#!/usr/bin/env bash
# Extrae a texto plano los esquemas en PDF de public/temas/.
#
# Por qué existe: revisar el contenido de los temas con un modelo cuesta del orden de
# diez veces más si se le pasa el PDF que si se le pasa el texto. Esta extracción es
# local, gratuita y se hace una sola vez; a partir de aquí todo trabaja sobre .txt.
#
# Uso:  bash scripts/extraer-temas.sh
# Salida: review/txt/<ejercicio>-<numero>.txt
#
# Requiere pdftotext (viene con poppler-utils; en Git Bash para Windows ya está en
# /mingw64/bin). Si no está, el script aborta en vez de generar ficheros vacíos.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/public/temas"
OUT="$ROOT/review/txt"

if ! command -v pdftotext >/dev/null 2>&1; then
    echo "ERROR: no se encuentra pdftotext. Instala poppler-utils." >&2
    exit 1
fi

mkdir -p "$OUT"

total=0
vacios=0

for dir in "$SRC"/*/; do
    [ -d "$dir" ] || continue
    ejercicio="$(basename "$dir")"

    for pdf in "$dir"*.pdf; do
        [ -e "$pdf" ] || continue
        base="$(basename "$pdf" .pdf)"

        # Los ficheros se llaman "TEMA 12. Titulo del tema.pdf". Nos quedamos con el
        # número para tener un nombre estable aunque el título cambie.
        num="$(printf '%s' "$base" | sed -n 's/^[Tt][Ee][Mm][Aa][[:space:]]*\([0-9]\{1,3\}\).*/\1/p')"
        if [ -z "$num" ]; then
            echo "AVISO: no se puede deducir el número de tema de '$base', se omite" >&2
            continue
        fi

        dest="$OUT/${ejercicio}-$(printf '%02d' "$num").txt"

        # -nopgbrk evita los saltos de página de control.
        # -enc UTF-8 es imprescindible: por defecto sale en Latin-1 y destroza las tildes.
        pdftotext -enc UTF-8 -nopgbrk "$pdf" "$dest.raw"

        # Los esquemas repiten la cabecera del tema en cada página. Dejarla infla el
        # corpus en torno a un 15 % de tokens que se acaban pagando en la revisión,
        # así que se conserva solo la primera aparición de cada línea repetida larga.
        awk '
            {
                line = $0
                gsub(/^[ \t]+|[ \t]+$/, "", line)
                if (length(line) > 60 && seen[line]++) next
                print
            }
        ' "$dest.raw" \
        | cat -s > "$dest"

        rm -f "$dest.raw"

        # Primera línea: título original del fichero, para que la auditoría pueda
        # contrastarlo con el título oficial del temario sin volver a mirar el PDF.
        printf '#FUENTE: %s\n%s\n' "$base" "$(cat "$dest")" > "$dest.tmp"
        mv "$dest.tmp" "$dest"

        palabras=$(wc -w < "$dest")
        total=$((total + 1))
        if [ "$palabras" -lt 50 ]; then
            vacios=$((vacios + 1))
            echo "AVISO: '$dest' solo tiene $palabras palabras" >&2
        fi
    done
done

echo "Extraídos $total temas en $OUT"
[ "$vacios" -gt 0 ] && echo "  ($vacios sospechosamente cortos)"
exit 0
