# PowerShell script to create standalone HTML with embedded CSV data

Write-Host "Reading CSV data..." -ForegroundColor Green
$csvContent = Get-Content "datos_maestros_dashboard.csv" -Raw -Encoding UTF8

Write-Host "Reading HTML template..." -ForegroundColor Green  
$htmlContent = Get-Content "comercio-exterior.html" -Raw -Encoding UTF8

# Escape backticks and dollar signs for JavaScript template literal
$csvEscaped = $csvContent -replace '\\', '\\' -replace '`', '\`' -replace '\$', '\$'

# Create the embedded script tag
$embeddedScript = @"
<!-- ========== STANDALONE VERSION WITH EMBEDDED DATA ========== -->
    <script>
        // Embedded CSV Data (280KB approx) - This allows the dashboard to work without a server
        const EMBEDDED_CSV_DATA = ``$csvEscaped``;
        console.log('📦 Standalone version loaded - CSV data embedded directly');
    </script>

"@

# Insert before the main script tag
$newHTML = $htmlContent -replace '<script>', ($embeddedScript + '    <script>')

# Replace the loadData function
$loadDataPattern = '(?s)// ========== DATA LOADING ==========.*?(?=\s+// ========== FLOW)'

$newLoadFunction = @'
// ========== DATA LOADING (EMBEDDED MODE FOR STANDALONE) ==========
        async function loadData() {
            const container = document.querySelector('.glass-card');
            const loadingMsg = document.createElement('div');
            loadingMsg.id = 'loadingMessage';
            loadingMsg.className = 'text-center text-primary text-xl font-bold mt-8';
            loadingMsg.innerHTML = '✅ Cargando datos embebidos...';
            container.appendChild(loadingMsg);

            try {
                console.log('📥 Using embedded data (standalone version - no server needed)');
                
                // Use the embedded CSV data instead of fetching from file
                const text = EMBEDDED_CSV_DATA;
                console.log(`📄 Embedded data loaded: ${text.length} characters`);

                allData = parseCSV(text);
                console.log(`✅ Data processed successfully: ${allData.length} records`);

                // Log sample for verification  
                if (allData.length > 0) {
                    console.table(allData.slice(0, 5));
                }

                // Remove loading message
                const msg = document.getElementById('loadingMessage');
                if (msg) msg.remove();

            } catch (error) {
                console.error('❌ Error processing embedded data:', error);
                const msg = document.getElementById('loadingMessage');
                if (msg) {
                    msg.innerHTML = `❌ Error: ${error.message}. Open console (F12) for details.`;
                    msg.className = 'text-center text-red-600 text-xl font-bold mt-8';
                }
            }
        }

        
'@

$newHTML = $newHTML -replace $loadDataPattern, $newLoadFunction

# Write the standalone file
Set-Content "fuentes-de-datos-standalone.html" -Value $newHTML -Encoding UTF8

$fileSize = (Get-Item "fuentes-de-datos-standalone.html").Length / 1KB

Write-Host "`n✅ Standalone file created successfully!" -ForegroundColor Green
Write-Host "📁 File: fuentes-de-datos-standalone.html" -ForegroundColor Cyan
Write-Host "📊 Total size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
Write-Host "`n🎯 Ready to use! Just double-click to open the file." -ForegroundColor Yellow
Write-Host "   No server needed - all data is embedded." -ForegroundColor Yellow
