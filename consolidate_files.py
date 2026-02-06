import codecs
import os

print("Starting manual embedding process - CONSOLIDATION")

# Paths
csv_path = 'datos_maestros_dashboard.csv'
# We read AND write to the same file (effectively), or rather read it, embed, and overwrite.
html_path = 'comercio-exterior.html' 
output_path = 'comercio-exterior.html'

# Check if files exist
if not os.path.exists(csv_path):
    print(f"Error: {csv_path} not found.")
    exit(1)
if not os.path.exists(html_path):
    print(f"Error: {html_path} not found.")
    exit(1)

# Read CSV
print(f"Reading {csv_path}...")
with codecs.open(csv_path, 'r', encoding='utf-8') as f:
    csv_data = f.read()
print(f"Read {len(csv_data)} characters from CSV.")

# Read HTML
print(f"Reading {html_path}...")
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()
print(f"Read {len(html_content)} characters from HTML.")

# Escape CSV for JS template literal
csv_escaped = csv_data.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

# Marker for embedding
# We know the specific structure: const EMBEDDED_CSV_DATA = `...`;
marker_start = 'const EMBEDDED_CSV_DATA = `'
marker_end = '`;'

start_idx = html_content.find(marker_start)

if start_idx != -1:
    print("Found existing EMBEDDED_CSV_DATA variable. Replacing content...")
    content_start = start_idx + len(marker_start)
    
    # Find the end of the block.
    end_idx = html_content.find(marker_end, content_start)
    
    if end_idx != -1:
        # Construct new HTML
        # We replace whatever is currently in there with the NEW csv data
        new_html = html_content[:content_start] + csv_escaped + html_content[end_idx:]
        
        # Write output
        print(f"Overwriting {output_path} with embedded data...")
        with codecs.open(output_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Success! comercio-exterior.html is now standalone.")
        
    else:
        print("Error: Could not find end marker (`;) for EMBEDDED_CSV_DATA.")
else:
    print("Error: Could not find 'const EMBEDDED_CSV_DATA = `' in HTML.")

# Cleanup duplicate if exists
if os.path.exists('fuentes-de-datos-standalone.html'):
    print("Removing redundant file: fuentes-de-datos-standalone.html")
    os.remove('fuentes-de-datos-standalone.html')
