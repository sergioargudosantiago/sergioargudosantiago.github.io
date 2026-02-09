"""
Final extraction: Clean CSV format conversion
The external CSV has: "value1,""value2"",""value3""..."  (whole row quoted, values double-quoted)
We need: value1,"value2","value3"  (standard CSV format)
"""

csv_path = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\datos_maestros_dashboard.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Clean each line
def clean_line(line):
    """Convert from weird format to standard CSV"""
    line = line.strip()
    if not line:
        return None
    
    # Remove outer quotes
    if line.startswith('"') and line.endswith('"'):
        line = line[1:-1]
    
    # Replace ,""value"" with ,"value" pattern
    # The original has: value1,""value2"",""value3""
    # We want: value1,"value2","value3"
    import re
    # Replace ,""...,"" with ,"...",
    cleaned = line.replace('""', '\x00')  # Temp placeholder
    cleaned = cleaned.replace('\x00', '"')  # Now just single quotes
    
    return cleaned

# Process header
header = clean_line(lines[0])
print(f"Cleaned header: {header}")

# Count columns
import csv
from io import StringIO

reader = csv.reader(StringIO(header))
header_cols = next(reader)
print(f"Header columns ({len(header_cols)}): {header_cols}")

# Process all data lines
all_data = []
for i, line in enumerate(lines[1:], start=2):
    cleaned = clean_line(line)
    if not cleaned:
        continue
    try:
        reader = csv.reader(StringIO(cleaned))
        row = next(reader)
        if len(row) >= 12:
            all_data.append(row)
    except Exception as e:
        print(f"Error line {i}: {e}")
        continue

print(f"\nTotal data rows: {len(all_data)}")

# Count by sector (column 2 is macro_sector)
agro = [r for r in all_data if r[2] == 'Agroalimentario']
indus = [r for r in all_data if r[2] == 'Industrial']
print(f"Agroalimentario: {len(agro)}")
print(f"Industrial: {len(indus)}")

# Sample
if indus:
    print("\nSample Industrial row:")
    for i, val in enumerate(indus[0]):
        col_name = header_cols[i] if i < len(header_cols) else f'col{i}'
        print(f"  {col_name}: {val}")

# Generate output in embed-friendly format
# Target columns: year,flujo,macro_sector,lv1,lit_lv1,lv2,lit_lv2,lv3,lit_lv3,lv4,lit_lv4,total_millones,top_paises_lv1,tva_lv1,top_paises_lv2,tva_lv2,top_paises_lv3,tva_lv3,top_paises_lv4,tva_lv4

embed_header = 'year,flujo,macro_sector,lv1,lit_lv1,lv2,lit_lv2,lv3,lit_lv3,lv4,lit_lv4,total_millones,top_paises_lv1,tva_lv1,top_paises_lv2,tva_lv2,top_paises_lv3,tva_lv3,top_paises_lv4,tva_lv4'

# The external CSV column order is:
# year,flujo,macro_sector,lv1,lit_lv1,lv2,lit_lv2,lv3,lit_lv3,lv4,lit_lv4,total_millones,top_lv1,tva_lv1,top_lv2,tva_lv2,top_lv3,tva_lv3,top_lv4,tva_lv4
# Which is exactly what we need (just rename top_lv1 -> top_paises_lv1 conceptually)

def format_row_for_embed(row):
    """Format a row for embedding"""
    # Ensure 20 columns
    while len(row) < 20:
        row.append('NA')
    
    # Format each value
    formatted = []
    for val in row[:20]:
        if val is None or val == '':
            val = 'NA'
        if ',' in val:
            val = f'"{val}"'
        formatted.append(val)
    
    return ','.join(formatted)

output_lines = [embed_header]
for row in all_data:
    output_lines.append(format_row_for_embed(row))

# Write to output file
output_path = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\full_embed_data.csv'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"\nOutput written to: {output_path}")
print(f"Total rows: {len(output_lines) - 1}")

# Samples
print("\n=== Sample output ===")
print("Header:", output_lines[0])
print("\nAgro sample:")
for line in output_lines[1:10]:
    if 'Agroalimentario' in line:
        print(line[:150])
        break
print("\nIndustrial sample:")
for line in output_lines:
    if 'Industrial' in line:
        print(line[:200])
        break
