Option Explicit

Dim word, doc, fso
Set fso = CreateObject("Scripting.FileSystemObject")

On Error Resume Next
Set word = CreateObject("Word.Application")
If Err.Number <> 0 Then
    WScript.Echo "Error: Could not start Microsoft Word."
    WScript.Quit
End If
On Error Goto 0

word.Visible = False
word.DisplayAlerts = 0 ' wdAlertsNone

Sub ConvertToPdf(exerciseNum, topicNum, title)
    Dim originalName, sanitizedName, sourcePath, pdfPath, folderPath
    
    ' Construct base path relative to script location
    folderPath = fso.GetParentFolderName(WScript.ScriptFullName) & "\public\temas\ejercicio-" & exerciseNum
    
    If Not fso.FolderExists(folderPath) Then
        ' WScript.Echo "Folder not found: " & folderPath
        Exit Sub
    End If
    
    originalName = "ESQUEMA TEMA " & topicNum & ".docx"
    sanitizedName = "TEMA " & topicNum & ". " & title & ".docx"
    
    ' Define paths
    sourcePath = folderPath & "\" & originalName
    
    ' Check if sanitized file exists (renaming might have worked partially)
    If Not fso.FileExists(sourcePath) Then
        sourcePath = folderPath & "\" & sanitizedName
        If Not fso.FileExists(sourcePath) Then
            ' WScript.Echo "Source file not found: " & originalName
            Exit Sub
        End If
    End If
    
    ' PDF Output Path
    Dim pdfName
    pdfName = "TEMA " & topicNum & ". " & title & ".pdf"
    pdfPath = folderPath & "\" & pdfName
    
    If fso.FileExists(pdfPath) Then
        WScript.Echo "Skipping (PDF exists): " & pdfName
        Exit Sub
    End If
    
    WScript.Echo "Converting Ex " & exerciseNum & " - Topic " & topicNum & "..."
    
    On Error Resume Next
    Set doc = word.Documents.Open(sourcePath, False, True, False) ' ReadOnly, No addToRecentFiles
    If Err.Number <> 0 Then
        WScript.Echo "Error opening: " & sourcePath
        Err.Clear
        Exit Sub
    End If
    
    ' Save as PDF (wdFormatPDF = 17)
    doc.SaveAs pdfPath, 17
    If Err.Number <> 0 Then
        WScript.Echo "Error saving PDF: " & pdfName
        Err.Clear
    Else
        ' WScript.Echo "Created: " & pdfName
    End If
    
    doc.Close 0 ' wdDoNotSaveChanges
    On Error Goto 0
    
End Sub

WScript.Echo "Starting PDF Conversion..."

' Exercise 3 Titles
ConvertToPdf 3, 1, "El comercio internacional. Marco general y principales magnitudes"
ConvertToPdf 3, 2, "Balanza de Pagos. Concepto. Presentaciones, metodologia y estructura"
ConvertToPdf 3, 3, "El comercio exterior espanol. Principales rasgos"
ConvertToPdf 3, 4, "La empresa ante el comercio internacional"
ConvertToPdf 3, 5, "El marketing internacional. Concepto y funciones"
ConvertToPdf 3, 6, "Las formas de acceso a los mercados"
ConvertToPdf 3, 7, "Instrumentos financieros de apoyo a la internacionalizacion (I). El Credito Oficial"
ConvertToPdf 3, 8, "Instrumentos financieros de apoyo a la internacionalizacion (II). El Seguro de Credito"
ConvertToPdf 3, 9, "Instrumentos financieros de apoyo a la internacionalizacion (III). El FIEM"
ConvertToPdf 3, 10, "Instrumentos comerciales de apoyo a la internacionalizacion (I). ICEX"
ConvertToPdf 3, 11, "Instrumentos comerciales de apoyo a la internacionalizacion (II). Las Camaras de Comercio"
ConvertToPdf 3, 12, "Instrumentos fiscales no aduaneros. IVA en comercio exterior. INTRASTAT"
ConvertToPdf 3, 13, "El factoring, el leasing y el forfaiting"
ConvertToPdf 3, 14, "Financiacion de operaciones de comercio exterior. Mercado de divisas"
ConvertToPdf 3, 15, "Medios de pago y cobro internacionales"
ConvertToPdf 3, 16, "Contratacion internacional (I). Generalidades. INCOTERMS"
ConvertToPdf 3, 17, "Contratacion internacional (II). Incumplimiento y resolucion de conflictos"
ConvertToPdf 3, 18, "Inversiones extranjeras. Inversion directa y en valores negociables"
ConvertToPdf 3, 19, "Inversion espanola en el exterior"
ConvertToPdf 3, 20, "Inversion extranjera en Espana"
ConvertToPdf 3, 21, "El regimen aduanero del comercio exterior. politica aduanera comunitaria"
ConvertToPdf 3, 22, "Sistema de Preferencias Generalizadas"
ConvertToPdf 3, 23, "Regimenes aduaneros. Generalidades y tipos"
ConvertToPdf 3, 24, "Los regimenes especiales. Transito, deposito, perfeccionamiento"
ConvertToPdf 3, 25, "Instrumentos de defensa comercial. salvaguardia, antidumping, antisubvencion"
ConvertToPdf 3, 26, "Comercio exterior de material de defensa y de doble uso"
ConvertToPdf 3, 27, "Obstaculos comerciales. Identificacion y caracterizacion"
ConvertToPdf 3, 28, "Medidas sanitarias y fitosanitarias. Acuerdo MSF de la OMC"
ConvertToPdf 3, 29, "Medidas de armonizacion y transparencia en la UE"
ConvertToPdf 3, 30, "Politica comunitaria en materia de normas y evaluacion de la conformidad"
ConvertToPdf 3, 31, "Acuerdos de reconocimiento mutuo sobre evaluacion de la conformidad"
ConvertToPdf 3, 32, "El transporte internacional maritimo y aereo"
ConvertToPdf 3, 33, "El transporte internacional por carretera y ferrocarril"
ConvertToPdf 3, 34, "Naciones Unidas. Objetivos y Organos principales"
ConvertToPdf 3, 35, "La cooperacion economica internacional. el FMI"
ConvertToPdf 3, 36, "Instituciones multilaterales de financiacion y ayuda al desarrollo"
ConvertToPdf 3, 37, "La OCDE. Objetivo, estructura y funciones"
ConvertToPdf 3, 38, "Las negociaciones comerciales multilaterales. evolucion del GATT"
ConvertToPdf 3, 39, "La OMC y la economia mundial. Sistema, objetivo, funciones"
ConvertToPdf 3, 40, "La OMC y los Acuerdos multilaterales y plurilaterales"
ConvertToPdf 3, 41, "La Union Europea. Antecedentes y evolucion. Tratados"
ConvertToPdf 3, 42, "Las Instituciones de la Union Europea"
ConvertToPdf 3, 43, "Toma de decisiones en la UE. Proceso legislativo, comitologia"
ConvertToPdf 3, 44, "El Mercado Unico Europeo. Libre circulacion"
ConvertToPdf 3, 45, "La politica agricola de la UE. Organizacion comun de mercado"
ConvertToPdf 3, 46, "La politica pesquera de la UE"
ConvertToPdf 3, 47, "La politica de calidad de productos agroalimentarios de la UE"
ConvertToPdf 3, 48, "Politica de proteccion de consumidores de la UE"
ConvertToPdf 3, 49, "Politica economica y monetaria de la UE"
ConvertToPdf 3, 50, "Politica industrial y empresarial de la UE"
ConvertToPdf 3, 51, "Politica de medio ambiente de la UE y compromisos internacionales"
ConvertToPdf 3, 52, "Politica de Competencia de la UE"
ConvertToPdf 3, 53, "Politica regional y de cohesion de la UE. Fondos europeos"
ConvertToPdf 3, 54, "Politica comercial de la UE (I). Politica comercial comun"
ConvertToPdf 3, 55, "Politica comercial de la UE (II). EEE, Reino Unido, Suiza, Turquia, Rusia, Balcanes"
ConvertToPdf 3, 56, "Politica comercial de la UE (III). Euromediterraneo, Africa, Caribe, Pacifico"
ConvertToPdf 3, 57, "Politica comercial de la UE (IV). Estados Unidos, Canada, Latinoamerica"
ConvertToPdf 3, 58, "Politica comercial de la UE (V). Asia, Oceania, Golfo"

' Exercise 5 Titles
ConvertToPdf 5, 1, "Objeto y metodo de la ciencia economica. Economistas clasicos y Marx"
ConvertToPdf 5, 2, "Evolucion del pensamiento economico. Neoclasicos, Keynes"
ConvertToPdf 5, 3, "Teoria de la Demanda. Teoria de la produccion. Teoria de los Costes"
ConvertToPdf 5, 4, "El funcionamiento del mercado. Competencia perfecta, monopolio, oligopolio"
ConvertToPdf 5, 5, "La politica monetaria. Estrategias y efectos"
ConvertToPdf 5, 6, "La politica fiscal. Disciplina fiscal y sostenibilidad"
ConvertToPdf 5, 7, "Crecimiento economico y desarrollo. Modelos de crecimiento"
ConvertToPdf 5, 8, "La globalizacion de la economia. Decisiones de inversion"
ConvertToPdf 5, 9, "La integracion economica regional"
ConvertToPdf 5, 10, "La politica agraria espanola en el marco de la PAC"
ConvertToPdf 5, 11, "Sector pesquero espanol. Evolucion y situacion actual en la UE"
ConvertToPdf 5, 12, "La politica industrial en Espana. Medio Ambiente e I+D"
ConvertToPdf 5, 13, "La politica energetica espanola"
ConvertToPdf 5, 14, "El sector servicios en Espana. Construccion y vivienda"
ConvertToPdf 5, 15, "La politica de desarrollo regional en Espana"
ConvertToPdf 5, 16, "El marco economico de la distribucion comercial"
ConvertToPdf 5, 17, "Evolucion de la actividad comercial. Ratios y formatos"
ConvertToPdf 5, 18, "Precios y margenes en el canal de distribucion. IPC"
ConvertToPdf 5, 19, "La Ordenacion del Comercio Minorista"
ConvertToPdf 5, 20, "Instrumentos de apoyo al comercio minorista"
ConvertToPdf 5, 21, "El comercio mayorista en Espana. MERCASA"
ConvertToPdf 5, 22, "Servicios de la Sociedad de la Informacion y Comercio Electronico"
ConvertToPdf 5, 23, "Otras formas comerciales. Franquicias, venta a distancia, venta automatica"
ConvertToPdf 5, 24, "La proteccion al consumidor"
ConvertToPdf 5, 25, "La defensa de la libre competencia en Espana"
ConvertToPdf 5, 26, "Practicas restrictivas de la competencia"
ConvertToPdf 5, 27, "Concentraciones economicas"
ConvertToPdf 5, 28, "Ayudas publicas. Regulacion y control"
ConvertToPdf 5, 29, "Las fuentes del Derecho Administrativo"
ConvertToPdf 5, 30, "El reglamento. La potestad reglamentaria"
ConvertToPdf 5, 31, "El acto administrativo. concepto, clases y elementos"
ConvertToPdf 5, 32, "Los recursos administrativos"
ConvertToPdf 5, 33, "La jurisdiccion contencioso-administrativa"
ConvertToPdf 5, 34, "Los contratos administrativos"
ConvertToPdf 5, 35, "El servicio publico. concepto y gestion"
ConvertToPdf 5, 36, "El Procedimiento Administrativo Comun"
ConvertToPdf 5, 37, "El Estatuto Basico del Empleado Publico"
ConvertToPdf 5, 38, "El ciudadano y la Administracion publica"
ConvertToPdf 5, 39, "La Constitucion Espanola de 1978"
ConvertToPdf 5, 40, "El Gobierno y su presidente. Administracion Central del Estado"
ConvertToPdf 5, 41, "Organizacion y competencias del Ministerio de Economia, Comercio y Empresa"
ConvertToPdf 5, 42, "Organizacion territorial del Estado. Comunidades Autonomas"
ConvertToPdf 5, 43, "El sistema tributario espanol"
ConvertToPdf 5, 44, "La Ley General Presupuestaria y las leyes anuales de presupuestos"
ConvertToPdf 5, 45, "Politicas Publicas. Igualdad, Violencia de Genero, Discapacidad, LGTBI, Transparencia"
ConvertToPdf 5, 46, "Gobernanza Publica y Gobierno Abierto"

word.Quit
Set word = Nothing
Set fso = Nothing
WScript.Echo "All Done!"
