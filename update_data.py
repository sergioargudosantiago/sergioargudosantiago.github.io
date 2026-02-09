import re

# File path
file_path = 'comercio-exterior.html'

# Read file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSV part
# Regex to capture the content inside `...`
# We use non-greedy .*? and DOTALL (s)
csv_match = re.search(r'const EMBEDDED_CSV_DATA = `(.*?)`;', content, re.DOTALL)

if not csv_match:
    print("❌ Could not find EMBEDDED_CSV_DATA in " + file_path)
    exit(1)

csv_data = csv_match.group(1)
original_csv_data = csv_data

# Define replacements (from fix_names.py + new ones)
replacements = [
    # Truncated names (Agroalimentario)
    ('invertebrados acuá', 'invertebrados acuáticos'),
    ('demás frutas frescas y desecadas y demás fr', 'demás frutas frescas y desecadas'),
    ('Las demas grasas y aceites vegetales, y de orig', 'Las demás grasas y aceites vegetales'),
    ('Extractos y jugos y otros productos de origen a', 'Extractos y jugos de origen animal'),
    ('Gomas, resinas y demás jugos y extractos vegeta', 'Gomas, resinas y extractos vegetales'),
    ('Chocolate y preparaciones alimenticias con caca', 'Chocolate y preparaciones con cacao'),
    ('Otras preparaciones a base de harina y cereales', 'Otras preparaciones de harina y cereales'),
    ('ACEITES ESENCIALES Y PERFUMADO', 'ACEITES ESENCIALES Y PERFUMADOS'),
    ('MAT. PRIMAS ANIMALES Y VEGETAL', 'MAT. PRIMAS ANIMALES Y VEGETALES'),
    ('MAQ. ESPECIFICA CIERTAS INDUST', 'MAQ. ESPECIFICA CIERTAS INDUSTRIAS'),
    
    # Missing accents (case-sensitive) - Agroalimentario
    (',Maiz,', ',Maíz,'),
    (',Esparragos,', ',Espárragos,'),
    ('Las demas hortalizas', 'Las demás hortalizas'),
    ('Las demas grasas', 'Las demás grasas'),
    ('NEUMATICOS Y CAMARAS', 'NEUMÁTICOS Y CÁMARAS'),
    ('Café, té, cacao y azucar', 'Café, té, cacao y azúcar'),
    ('Sucedaneos de café', 'Sucedáneos de café'),
    (',Azucar,', ',Azúcar,'),
    ('MAQUINARIAS AGRICOLA', 'MAQUINARIA AGRÍCOLA'),
    ('Otros productos del cápitulo 12', 'Otros productos del capítulo 12'),
    ('VEHIC. TRANS. MERCANCIAS CARR.', 'VEHIC. TRANS. MERCANCÍAS CARR.'),
    ('Articulos sin cacao', 'Artículos sin cacao'),
    ('Residuos de porductos alimentarios', 'Residuos de productos alimentarios'),

    # Uppercase Industrial Corrections
    ('QUIMICOS', 'QUÍMICOS'),
    ('PLASTICOS', 'PLÁSTICOS'),
    ('VEHICULOS', 'VEHÍCULOS'),
    ('AUTOMOVILES', 'AUTOMÓVILES'),
    ('AUTOMOVIL', 'AUTOMÓVIL'),
    ('ELECTRONICOS', 'ELECTRÓNICOS'),
    ('ELECTRONICA', 'ELECTRÓNICA'),
    ('ELECTRICOS', 'ELÉCTRICOS'),
    ('TELECOMUNICACION', 'TELECOMUNICACIÓN'),
    ('METALICOS', 'METÁLICOS'),
    ('MAQUINAS', 'MÁQUINAS'),
    ('CONFECCION', 'CONFECCIÓN'),
    ('ALFARERIA', 'ALFARERÍA'),
    ('JOYERIA', 'JOYERÍA'),
    ('FARMACEUTICOS', 'FARMACÉUTICOS'),
    ('ORGANICOS', 'ORGÁNICOS'),
    ('INORGANICOS', 'INORGÁNICOS'),
    ('PLASTICAS', 'PLÁSTICAS'),
    ('FUNDICION', 'FUNDICIÓN'),
    ('CUCHILLERIA', 'CUCHILLERÍA'),
    ('FRIO', 'FRÍO'),
    ('ELEVACION', 'ELEVACIÓN'),
    ('AGRICOLA', 'AGRÍCOLA'),
    ('CARTON', 'CARTÓN'),
    ('TELEFONIA', 'TELEFONÍA'),
    ('TELEVISION', 'TELEVISIÓN'),
    ('GRABACION', 'GRABACIÓN'),
    ('MEDICOS', 'MÉDICOS'),
    ('QUIRURGICOS', 'QUIRÚRGICOS'),
    ('RELOJERIA', 'RELOJERÍA'),
    ('OPTICOS', 'ÓPTICOS'),
    ('OPTICO', 'ÓPTICO'),
    ('FOTOGRAFICOS', 'FOTOGRÁFICOS'),
    ('FOTOGRAFICO', 'FOTOGRÁFICO'),
    ('AERONAUTICA', 'AERONÁUTICA'),
    ('MERCANCIAS', 'MERCANCÍAS'),
    ('MARITIMO', 'MARÍTIMO'),
    ('AEREA', 'AÉREA'),
    ('ELECTRODOMESTICOS', 'ELECTRODOMÉSTICOS'),
    
    # NEW Additions for Industrial
    ('ENERGETICOS', 'ENERGÉTICOS'),
    ('CARBON', 'CARBÓN'),
    ('PETROLEO', 'PETRÓLEO'),
    ('ELECTRICA', 'ELÉCTRICA'),
    ('CONSTRUCCION', 'CONSTRUCCIÓN'),
    ('PRECISION', 'PRECISIÓN')
]

# Apply replacements
count = 0
for pattern, replacement in replacements:
    if pattern in csv_data:
        csv_data = csv_data.replace(pattern, replacement)
        count += 1

if original_csv_data == csv_data:
    print("⚠️ No changes made to CSV data.")
else:
    # Replace in full content
    new_content = content.replace(original_csv_data, csv_data)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated {file_path} with corrected names (Replaced {count} patterns).")
