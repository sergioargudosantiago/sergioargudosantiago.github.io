import re

# Read the CSV file
with open('full_embed_data.csv', 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements: (pattern, replacement)
replacements = [
    # Truncated names
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
    
    # Missing accents (case-sensitive)
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
    
    # Typos
    ('Residuos de porductos alimentarios', 'Residuos de productos alimentarios'),
]

# Apply all replacements
for pattern, replacement in replacements:
    content = content.replace(pattern, replacement)

# Write the corrected CSV
with open('full_embed_data.csv', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSV file corrected successfully!")
print("Replacements applied:", len(replacements))
