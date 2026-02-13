import os

balanza_dir = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\balanza'
out_path = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\balanza_preview.txt'

output = []

for fname in sorted(os.listdir(balanza_dir)):
    fpath = os.path.join(balanza_dir, fname)
    with open(fpath, 'rb') as f:
        raw = f.read()
    
    output.append(f"FILE: {fname} | Size: {len(raw)} bytes")
    output.append(f"First 40 bytes hex: {raw[:40].hex()}")
    
    # Detect BOM
    if raw[:2] == b'\xff\xfe':
        enc = 'utf-16-le'
        raw_data = raw[2:]
    elif raw[:2] == b'\xfe\xff':
        enc = 'utf-16-be'
        raw_data = raw[2:]
    elif raw[:3] == b'\xef\xbb\xbf':
        enc = 'utf-8-sig'
        raw_data = raw[3:]
    else:
        enc = 'utf-8'
        raw_data = raw
    
    output.append(f"Encoding: {enc}")
    
    try:
        text = raw_data.decode(enc)
    except:
        try:
            text = raw_data.decode('latin-1')
            output.append("Fallback to latin-1")
        except:
            output.append("COULD NOT DECODE")
            continue
    
    lines = text.split('\n')
    output.append(f"Total lines: {len(lines)}")
    
    # Check separator
    first_line = lines[0] if lines else ''
    if '\t' in first_line:
        sep = 'TAB'
    elif ';' in first_line:
        sep = 'SEMICOLON'  
    elif ',' in first_line:
        sep = 'COMMA'
    else:
        sep = 'UNKNOWN'
    output.append(f"Separator: {sep}")
    
    output.append("--- First 20 lines ---")
    for i, line in enumerate(lines[:20]):
        output.append(f"L{i+1}: {line.rstrip()}")
    
    output.append("--- Last 5 lines ---")
    for line in lines[-6:]:
        output.append(line.rstrip())
    
    output.append("=" * 80)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))
