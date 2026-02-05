#!/bin/bash
# Simple script to create standalone HTML

echo "Creating standalone HTML with embedded CSV..."

# Read existing HTML
html_content=$(<comercio-exterior.html)

# Read CSV
csv_content=$(<datos_maestros_dashboard.csv)

# Escape special characters for JavaScript
csv_escaped="${csv_content//\\/\\\\}"  # Escape backslashes
csv_escaped="${csv_escaped//\`/\\\`}"  # Escape backticks  
csv_escaped="${csv_escaped//\$/\\\$}"  # Escape dollar signs

# Create the embedded data script
embed_script="<!-- ========== STANDALONE VERSION WITH EMBEDDED DATA ========== -->
    <script>
        // Embedded CSV Data (~280KB) - Allows dashboard to work without server
        const EMBEDDED_CSV_DATA = \`${csv_escaped}\`;
        console.log('📦 Standalone version - CSV data embedded');
    </script>

"

# Insert embedded script before main <script> tag
standalone_html="${html_content//<script>/${embed_script}    <script>}"

# Replace loadData function to use embedded data
new_load_function="// ========== DATA LOADING (EMBEDDED MODE) ==========
        async function loadData() {
            const container = document.querySelector('.glass-card');
            const loadingMsg = document.createElement('div');
            loadingMsg.id = 'loadingMessage';
            loadingMsg.className = 'text-center text-primary text-xl font-bold mt-8';
            loadingMsg.innerHTML = '✅ Cargando datos embebidos...';
            container.appendChild(loadingMsg);

            try {
                console.log('📥 Using embedded data (standalone version)');
                const text = EMBEDDED_CSV_DATA;
                console.log(\`📄 Data loaded: \${text.length} characters\`);

                allData = parseCSV(text);
                console.log(\`✅ Data processed: \${allData.length} records\`);

                const msg = document.getElementById('loadingMessage');
                if (msg) msg.remove();

            } catch (error) {
                console.error('❌ Error:', error);
                const msg = document.getElementById('loadingMessage');
                if (msg) {
                    msg.innerHTML = \`❌ Error: \${error.message}\`;
                    msg.className = 'text-center text-red-600 text-xl font-bold mt-8';
                }
            }
        }

        "

# Replace the loadData function in the HTML
standalone_html=$(echo "$standalone_html" | sed '/\/\/ ========== DATA LOADING ==========/,/\/\/ ========== FLOW/c\'"$new_load_function"'\/\/ ========== FLOW')

# Write to file
echo "$standalone_html" > fuentes-de-datos-standalone.html

filesize=$(wc -c < fuentes-de-datos-standalone.html)
filesize_kb=$((filesize / 1024))

echo "✅ Standalone file created!"
echo "📁 File: fuentes-de-datos-standalone.html"  
echo "📊 Size: ${filesize_kb} KB"
echo "🎯 Ready! Just double-click to open."
