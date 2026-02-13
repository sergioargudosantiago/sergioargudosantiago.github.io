"""
Embed Balanza de Pagos data into comercio-exterior.html.
Reads balanza_data.js and inserts the constants with _RAW suffix
right at the start of the script section.
"""
import re

HTML_FILE = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\comercio-exterior.html'
DATA_FILE = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\balanza_data.js'

# Read data file
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data_js = f.read()

# Rename constants to _RAW
data_js = data_js.replace('const BALANZA_171 =', 'const BALANZA_171_RAW =')
data_js = data_js.replace('const BALANZA_174 =', 'const BALANZA_174_RAW =')
data_js = data_js.replace('const BALANZA_174A =', 'const BALANZA_174A_RAW =')
data_js = data_js.replace('const BALANZA_174C =', 'const BALANZA_174C_RAW =')

# Read HTML
with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

# Find the EMBEDDED_CSV_DATA line and insert after the next line that starts with const EMBEDDED_CSV_DATA
# Actually, find the marker for where to insert - right after the script tag opens
# Let's insert before "const EMBEDDED_CSV_DATA"
marker = 'const EMBEDDED_CSV_DATA'
idx = html.find(marker)
if idx == -1:
    print("ERROR: Could not find EMBEDDED_CSV_DATA marker")
    exit(1)

# Insert data before EMBEDDED_CSV_DATA
insert_text = '\n        // ========== BALANZA DE PAGOS RAW DATA ==========\n'
for line in data_js.strip().split('\n'):
    if line.strip():
        insert_text += '        ' + line.strip() + '\n'
    else:
        insert_text += '\n'
insert_text += '\n        '

html = html[:idx] + insert_text + html[idx:]

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully embedded Balanza data into HTML")
print(f"Inserted {len(insert_text)} characters")
