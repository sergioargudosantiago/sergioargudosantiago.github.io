import os

print("Starting fix_names_debug.py...")
file_path = 'full_embed_data.csv'

if not os.path.exists(file_path):
    print(f"ERROR: {file_path} not found!")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Read {len(content)} bytes.")

if 'QUIMICOS' in content:
    print("Found 'QUIMICOS' in content. Proceeding with replacement.")
else:
    print("WARNING: 'QUIMICOS' NOT found in content!")

replacements = [
    ('QUIMICOS', 'QUÍMICOS'),
    ('PLASTICOS', 'PLÁSTICOS'),
    # Just a few to test
]

for pattern, replacement in replacements:
    content = content.replace(pattern, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Wrote updated content.")

with open(file_path, 'r', encoding='utf-8') as f:
    new_content = f.read()

if 'QUÍMICOS' in new_content:
    print("SUCCESS: Found 'QUÍMICOS' in new content.")
else:
    print("FAILURE: 'QUÍMICOS' NOT found in new content.")
