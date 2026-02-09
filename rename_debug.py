
import os

directory = 'public/temas/ejercicio-3'
print(f"Checking directory: {os.path.abspath(directory)}")

if os.path.exists(directory):
    print("Directory exists.")
    files = os.listdir(directory)
    print(f"Found {len(files)} files.")
    if files:
        print(f"First 5 files: {files[:5]}")
        
        # Try finding Topic 1
        target = "ESQUEMA TEMA 1.docx"
        if target in files:
            print(f"Found target: {target}")
            # Construct new name
            new_name = "TEMA 1. El comercio internacional. Marco general y principales magnitudes.docx"
            try:
                # os.rename(os.path.join(directory, target), os.path.join(directory, new_name))
                # print(f"Successfully renamed to: {new_name}")
                # Don't actually rename in debug, just check if we CAN
                pass
            except Exception as e:
                print(f"Error renaming: {e}")
        else:
            print(f"Target {target} not found in list.")
else:
    print("Directory does NOT exist.")
