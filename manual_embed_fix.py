import codecs
import os

print("Starting manual embedding process...")

# Paths
csv_path = 'datos_maestros_dashboard.csv'
html_path = 'comercio-exterior.html'
output_path = 'fuentes-de-datos-standalone.html'

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
marker_start = 'const EMBEDDED_CSV_DATA = `'
marker_end = '`;'

start_idx = html_content.find(marker_start)

if start_idx != -1:
    print("Found existing EMBEDDED_CSV_DATA variable. Replacing content...")
    content_start = start_idx + len(marker_start)
    
    # Find the end of the block. We look for `; starting from content_start
    # We hope the existing data doesn't have `; composed in a way that breaks this simple find.
    # Given the previous file content ending with `; and console.log, it should be the first backtick-semicolon.
    end_idx = html_content.find(marker_end, content_start)
    
    if end_idx != -1:
        # Construct new HTML
        new_html = html_content[:content_start] + csv_escaped + html_content[end_idx:]
        
        # Write output
        print(f"Writing to {output_path}...")
        with codecs.open(output_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Success! Created standalone file.")
        
    else:
        print("Error: Could not find end marker (`;) for EMBEDDED_CSV_DATA.")
        # Fallback: maybe just look for `var navigationState` or `<script>` end?
        # But for now, fail safe.
else:
    print("Error: Could not find 'const EMBEDDED_CSV_DATA = `' in HTML.")
    print("Trying to inject it if it's missing...")
    # Does the file have the placeholder comment? 
    # Or maybe it's a clean file?
    # If not found, we might need a different strategy, but based on inspection it SHOULD be there.

