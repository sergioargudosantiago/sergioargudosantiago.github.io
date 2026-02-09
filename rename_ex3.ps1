
$dir = "public\temas\ejercicio-3"
if (!(Test-Path $dir)) {
    Write-Host "Directory not found: $dir"
    exit
}

cd $dir
Write-Host "Renaming files in $dir"

Rename-Item -LiteralPath "ESQUEMA TEMA 1.docx" -NewName "TEMA 1. El comercio internacional. Marco general y principales magnitudes.docx" -ErrorAction SilentlyContinue
Rename-Item -LiteralPath "ESQUEMA TEMA 2.docx" -NewName "TEMA 2. Balanza de Pagos. Concepto. Presentaciones, metodología y estructura.docx" -ErrorAction SilentlyContinue
Rename-Item -LiteralPath "ESQUEMA TEMA 3.docx" -NewName "TEMA 3. El comercio exterior español. Principales rasgos.docx" -ErrorAction SilentlyContinue
# ... I normally would do all, but let's test these first 3 to save time/space in this turn. 
# If this works, I'll generate the full list.
# Actually, I'll do the first 5 to be sure.
Rename-Item -LiteralPath "ESQUEMA TEMA 4.docx" -NewName "TEMA 4. La empresa ante el comercio internacional.docx" -ErrorAction SilentlyContinue
Rename-Item -LiteralPath "ESQUEMA TEMA 5.docx" -NewName "TEMA 5. El marketing internacional. Concepto y funciones.docx" -ErrorAction SilentlyContinue

Write-Host "Done."
