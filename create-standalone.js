// Script to create standalone dashboard
const fs = require('fs');

// Read CSV data
const csvData = fs.readFileSync('datos_maestros_dashboard.csv', 'utf8');

// Read HTML template
const htmlTemplate = fs.readFileSync('comercio-exterior.html', 'utf8');

// Create the embedded data constant
const embeddedData = `
    <script>
        // ========== EMBEDDED CSV DATA (STANDALONE VERSION) ==========
        const EMBEDDED_CSV_DATA = \`${csvData.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    </script>
`;

// Replace the script tag
const standalone = htmlTemplate.replace(
    '<script>',
    embeddedData + '\n    <script>'
);

// Replace the loadData function
const standaloneWithLoader = standalone.replace(
    /\/\/ ========== DATA LOADING ==========[\s\S]*?(?=\s+\/\/ ========== FLOW)/,
    `// ========== DATA LOADING (EMBEDDED MODE) ==========
        async function loadData() {
            const container = document.querySelector('.glass-card');
            const loadingMsg = document.createElement('div');
            loadingMsg.id = 'loadingMessage';
            loadingMsg.className = 'text-center text-primary text-xl font-bold mt-8';
            loadingMsg.innerHTML = '⏳ Procesando datos embebidos...';
            container.appendChild(loadingMsg);

            try {
                console.log('📥 Usando datos embebidos (versión standalone)...');
                const text = EMBEDDED_CSV_DATA;
                console.log(\`📄 Datos disponibles: \${text.length} caracteres\`);

                allData = parseCSV(text);
                console.log(\`✅ Datos cargados exitosamente: \${allData.length} registros\`);

                const msg = document.getElementById('loadingMessage');
                if (msg) msg.remove();

            } catch (error) {
                console.error('❌ Error al procesar datos embebidos:', error);
                const msg = document.getElementById('loadingMessage');
                if (msg) {
                    msg.innerHTML = '❌ Error al procesar los datos. Verifica la consola (F12).';
                    msg.className = 'text-center text-red-600 text-xl font-bold mt-8';
                }
            }
        }

        `
);

// Write the standalone file
fs.writeFileSync('fuentes-de-datos-standalone.html', standaloneWithLoader, 'utf8');

console.log('✅ Archivo standalone creado: fuentes-de-datos-standalone.html');
console.log(`📊 Tamaño total: ${(standaloneWithLoader.length / 1024).toFixed(2)} KB`);
