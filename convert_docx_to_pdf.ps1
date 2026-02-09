
# Script to convert Word docs to PDF using installed Microsoft Word
# Usage: Run in PowerShell as Administrator if needed

$ErrorActionPreference = "Stop"

# Define Titles Mapping (Hardcoded to be standalone)
$Exercise3Titles = @{
    1 = "El comercio internacional. Marco general y principales magnitudes";
    2 = "Balanza de Pagos. Concepto. Presentaciones, metodología y estructura";
    3 = "El comercio exterior español. Principales rasgos";
    4 = "La empresa ante el comercio internacional";
    5 = "El marketing internacional. Concepto y funciones";
    6 = "Las formas de acceso a los mercados";
    7 = "Instrumentos financieros de apoyo a la internacionalización (I). El Crédito Oficial";
    8 = "Instrumentos financieros de apoyo a la internacionalización (II). El Seguro de Crédito";
    9 = "Instrumentos financieros de apoyo a la internacionalización (III). El FIEM";
    10 = "Instrumentos comerciales de apoyo a la internacionalización (I). ICEX";
    11 = "Instrumentos comerciales de apoyo a la internacionalización (II). Las Cámaras de Comercio";
    12 = "Instrumentos fiscales no aduaneros. IVA en comercio exterior. INTRASTAT";
    13 = "El factoring, el leasing y el forfaiting";
    14 = "Financiación de operaciones de comercio exterior. Mercado de divisas";
    15 = "Medios de pago y cobro internacionales";
    16 = "Contratación internacional (I). Generalidades. INCOTERMS";
    17 = "Contratación internacional (II). Incumplimiento y resolución de conflictos";
    18 = "Inversiones extranjeras. Inversión directa y en valores negociables";
    19 = "Inversión española en el exterior";
    20 = "Inversión extranjera en España";
    21 = "El régimen aduanero del comercio exterior. política aduanera comunitaria";
    22 = "Sistema de Preferencias Generalizadas";
    23 = "Regímenes aduaneros. Generalidades y tipos";
    24 = "Los regímenes especiales. Tránsito, depósito, perfeccionamiento";
    25 = "Instrumentos de defensa comercial. salvaguardia, antidumping, antisubvención";
    26 = "Comercio exterior de material de defensa y de doble uso";
    27 = "Obstáculos comerciales. Identificación y caracterización";
    28 = "Medidas sanitarias y fitosanitarias. Acuerdo MSF de la OMC";
    29 = "Medidas de armonización y transparencia en la UE";
    30 = "Política comunitaria en materia de normas y evaluación de la conformidad";
    31 = "Acuerdos de reconocimiento mutuo sobre evaluación de la conformidad";
    32 = "El transporte internacional marítimo y aéreo";
    33 = "El transporte internacional por carretera y ferrocarril";
    34 = "Naciones Unidas. Objetivos y Órganos principales";
    35 = "La cooperación económica internacional. el FMI";
    36 = "Instituciones multilaterales de financiación y ayuda al desarrollo";
    37 = "La OCDE. Objetivo, estructura y funciones";
    38 = "Las negociaciones comerciales multilaterales. evolución del GATT";
    39 = "La OMC y la economía mundial. Sistema, objetivo, funciones";
    40 = "La OMC y los Acuerdos multilaterales y plurilaterales";
    41 = "La Unión Europea. Antecedentes y evolución. Tratados";
    42 = "Las Instituciones de la Unión Europea";
    43 = "Toma de decisiones en la UE. Proceso legislativo, comitología";
    44 = "El Mercado Único Europeo. Libre circulación";
    45 = "La política agrícola de la UE. Organización común de mercado";
    46 = "La política pesquera de la UE";
    47 = "La política de calidad de productos agroalimentarios de la UE";
    48 = "Política de protección de consumidores de la UE";
    49 = "Política económica y monetaria de la UE";
    50 = "Política industrial y empresarial de la UE";
    51 = "Política de medio ambiente de la UE y compromisos internacionales";
    52 = "Política de Competencia de la UE";
    53 = "Política regional y de cohesión de la UE. Fondos europeos";
    54 = "Política comercial de la UE (I). Política comercial común";
    55 = "Política comercial de la UE (II). EEE, Reino Unido, Suiza, Turquía, Rusia, Balcanes";
    56 = "Política comercial de la UE (III). Euromediterráneo, África, Caribe, Pacífico";
    57 = "Política comercial de la UE (IV). Estados Unidos, Canadá, Latinoamérica";
    58 = "Política comercial de la UE (V). Asia, Oceanía, Golfo";
}

$Exercise5Titles = @{
    1 = "Objeto y método de la ciencia económica. Economistas clásicos y Marx";
    2 = "Evolución del pensamiento económico. Neoclásicos, Keynes";
    3 = "Teoría de la Demanda. Teoría de la producción. Teoría de los Costes";
    4 = "El funcionamiento del mercado. Competencia perfecta, monopolio, oligopolio";
    5 = "La política monetaria. Estrategias y efectos";
    6 = "La política fiscal. Disciplina fiscal y sostenibilidad";
    7 = "Crecimiento económico y desarrollo. Modelos de crecimiento";
    8 = "La globalización de la economía. Decisiones de inversión";
    9 = "La integración económica regional";
    10 = "La política agraria española en el marco de la PAC";
    11 = "Sector pesquero español. Evolución y situación actual en la UE";
    12 = "La política industrial en España. Medio Ambiente e I+D";
    13 = "La política energética española";
    14 = "El sector servicios en España. Construcción y vivienda";
    15 = "La política de desarrollo regional en España";
    16 = "El marco económico de la distribución comercial";
    17 = "Evolución de la actividad comercial. Ratios y formatos";
    18 = "Precios y márgenes en el canal de distribución. IPC";
    19 = "La Ordenación del Comercio Minorista";
    20 = "Instrumentos de apoyo al comercio minorista";
    21 = "El comercio mayorista en España. MERCASA";
    22 = "Servicios de la Sociedad de la Información y Comercio Electrónico";
    23 = "Otras formas comerciales. Franquicias, venta a distancia, venta automática";
    24 = "La protección al consumidor";
    25 = "La defensa de la libre competencia en España";
    26 = "Prácticas restrictivas de la competencia";
    27 = "Concentraciones económicas";
    28 = "Ayudas públicas. Regulación y control";
    29 = "Las fuentes del Derecho Administrativo";
    30 = "El reglamento. La potestad reglamentaria";
    31 = "El acto administrativo. concepto, clases y elementos";
    32 = "Los recursos administrativos";
    33 = "La jurisdicción contencioso-administrativa";
    34 = "Los contratos administrativos";
    35 = "El servicio público. concepto y gestión";
    36 = "El Procedimiento Administrativo Común";
    37 = "El Estatuto Básico del Empleado Público";
    38 = "El ciudadano y la Administración pública";
    39 = "La Constitución Española de 1978";
    40 = "El Gobierno y su presidente. Administración Central del Estado";
    41 = "Organización y competencias del Ministerio de Economía, Comercio y Empresa";
    42 = "Organización territorial del Estado. Comunidades Autónomas";
    43 = "El sistema tributario español";
    44 = "La Ley General Presupuestaria y las leyes anuales de presupuestos";
    45 = "Políticas Públicas. Igualdad, Violencia de Género, Discapacidad, LGTBI, Transparencia";
    46 = "Gobernanza Pública y Gobierno Abierto";
}

# Function to sanitize filename (replace illegal chars with nothing or dots)
function Get-SafeFilename($name) {
    return $name -replace '[:]', '.' -replace '[<>:"/\\|?*]', '' -replace '\.$', ''
}

# Initialize Word COM Object
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone
    Write-Host "Word application started successfully."
} catch {
    Write-Error "Could not start Microsoft Word. Please ensure it is installed."
    exit
}

# Process Function
function Convert-Exercise($exerciseNum, $titles) {
    $basePath = Join-Path (Get-Location) "public\temas\ejercicio-$exerciseNum"
    
    if (!(Test-Path $basePath)) {
        Write-Warning "Directory not found: $basePath"
        return
    }

    Write-Host "Processing Exercise $exerciseNum in $basePath..."

    foreach ($key in $titles.Keys) {
        $title = $titles[$key]
        $safeTitle = Get-SafeFilename "TEMA $key. $title"
        $pdfName = "$safeTitle.pdf"
        $pdfPath = Join-Path $basePath $pdfName

        # Check for source file (try multiple variations since renaming might have partially worked or failed)
        $possibleSources = @(
            "ESQUEMA TEMA $key.docx",
            "$safeTitle.docx"
        )

        $sourceFile = $null
        foreach ($src in $possibleSources) {
            $path = Join-Path $basePath $src
            if (Test-Path $path) {
                $sourceFile = $path
                break
            }
        }

        if ($sourceFile) {
            if (Test-Path $pdfPath) {
                Write-Host "Skipping $pdfName (Already exists)" -ForegroundColor Gray
                continue
            }

            Write-Host "Converting: $(Split-Path $sourceFile -Leaf) -> $pdfName"
            
            try {
                $doc = $word.Documents.Open($sourceFile, $false, $true) # ReadOnly
                
                # Save as PDF (Format 17)
                $doc.SaveAs([ref]$pdfPath, [ref]17)
                $doc.Close([ref]$false)
            } catch {
                Write-Error "Failed to convert $sourceFile : $_"
            }
        } else {
            Write-Warning "Source file for Topic $key not found."
        }
    }
}

# Run Conversions
Convert-Exercise 3 $Exercise3Titles
Convert-Exercise 5 $Exercise5Titles

# Cleanup
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Remove-Variable word
[GC]::Collect()
[GC]::WaitForPendingFinalizers()

Write-Host "Conversion completed."
