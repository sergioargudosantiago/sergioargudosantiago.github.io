# Script to create standalone dashboard with embedded CSV
import codecs

# Read CSV data
with codecs.open('datos_maestros_dashboard.csv', 'r', encoding='utf-8') as f:
    csv_data = f.read()

# Read HTML template
with codecs.open('comercio-exterior.html', 'r', encoding='utf-8') as f:
    html_template = f.read()

# Escape backticks and dollar signs for JavaScript template literal
csv_escaped = csv_data.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

# Create the embedded data script
embedded_script = f'''<!-- STANDALONE VERSION WITH EMBEDDED DATA -->
    <script>
        // ========== EMBEDDED CSV DATA ==========
        const EMBEDDED_CSV_DATA = `{csv_escaped}`;
        console.log('📦 Versión standalone cargada con datos embebidos');
    </script>
'''

# Insert the embedded data before the main script tag
standalone_html = html_template.replace('<script>', embedded_script + '\n    <script>')

# Find and replace the loadData function
# Find the start of async function loadData()
loaddata_start = standalone_html.find('async function loadData()')
if loaddata_start == -1:
    print('⚠️  No se encontró la función loadData, buscando alternativa...')
    # Try without async
    loaddata_start = standalone_html.find('function loadData()')

if loaddata_start != -1:
    # Find the end of the function (next function or script closing)
    # Look for the closing brace of loadData function
    brace_count = 0
    func_start_brace = standalone_html.find('{', loaddata_start)
    i = func_start_brace
    while i < len(standalone_html):
        if standalone_html[i] == '{':
            brace_count += 1
        elif standalone_html[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                loaddata_end = i + 1
                break
        i += 1
    
    # Replace the old loadData function with the new one
    new_loader = '''async function loadData() {
            const container = document.querySelector('.glass-card');
            const loadingMsg = document.createElement('div');
            loadingMsg.id = 'loadingMessage';
            loadingMsg.className = 'text-center text-primary text-xl font-bold mt-8';
            loadingMsg.innerHTML = '✅ Cargando datos embebidos...';
            container.appendChild(loadingMsg);

            try {
                console.log('📥 Usando datos embebidos (versión standalone)');
                
                // Use embedded data instead of fetch
                const text = EMBEDDED_CSV_DATA;
                console.log(`📄 Datos cargados: ${text.length} caracteres`);

                allData = parseCSV(text);
                console.log(`✅ Datos procesados: ${allData.length} registros`);

                // Remove loading message
                const msg = document.getElementById('loadingMessage');
                if (msg) msg.remove();

            } catch (error) {
                console.error('❌ Error:', error);
                const msg = document.getElementById('loadingMessage');
                if (msg) {
                    msg.innerHTML = `❌ Error: ${error.message}. Abre la consola (F12) para más detalles.`;
                    msg.className = 'text-center text-red-600 text-xl font-bold mt-8';
                }
            }
        }'''
    
    standalone_html = standalone_html[:loaddata_start] + new_loader + standalone_html[loaddata_end:]
    print('✅ Función loadData reemplazada correctamente')
else:
    print('❌ ADVERTENCIA: No se pudo encontrar la función loadData()')

# Write the standalone file
with codecs.open('fuentes-de-datos-standalone.html', 'w', encoding='utf-8') as f:
    f.write(standalone_html)

file_size = len(standalone_html) / 1024
print(f'✅ Archivo standalone creado: fuentes-de-datos-standalone.html')
print(f'📊 Tamaño total: {file_size:.2f} KB')
print(f'📦 Datos CSV embebidos: {len(csv_data)} caracteres')
print(f'✅ Listo para usar - solo abre el archivo con doble click!')
