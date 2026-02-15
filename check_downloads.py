import os
import re

def parse_js_titles(js_content):
    """
    Parses the main.js content to find exercise titles.
    Returns a dict: {exercise_num: {topic_num: title}}
    """
    exercises = {}
    
    # regex to find const EXERCISE_X_TITLES = { ... };
    # This is a simple parser, assuming standard formatting in the file.
    # It looks for the start of the object and then processes lines until '};'
    
    lines = js_content.split('\n')
    current_exercise = None
    
    for line in lines:
        ex_match = re.search(r'const EXERCISE_(\d+)_TITLES = {', line)
        if ex_match:
            current_exercise = int(ex_match.group(1))
            exercises[current_exercise] = {}
            continue
            
        if current_exercise is not None:
            if '};' in line:
                current_exercise = None
                continue
                
            # Match: key: "Value", or key: 'Value'
            # 1: "Title...",
            topic_match = re.search(r'^\s*(\d+):\s*["\'](.+)["\'],?', line)
            if topic_match:
                topic_num = int(topic_match.group(1))
                title = topic_match.group(2)
                exercises[current_exercise][topic_num] = title
                
    return exercises

import unicodedata

def check_files(base_dir, exercises):
    missing_report = []
    
    # Map exercise numbers to folder names
    folder_map = {
        1: "ejercicio-1",
        3: "ejercicio-3",
        5: "ejercicio-5"
    }
    
    for ex_num, topics in exercises.items():
        if ex_num not in folder_map:
            continue
            
        folder_name = folder_map[ex_num]
        folder_path = os.path.join(base_dir, folder_name)
        
        if not os.path.exists(folder_path):
            missing_report.append(f"⚠️ Folder missing for Exercise {ex_num}: {folder_path}")
            continue
            
        # Get actual files
        try:
            files = os.listdir(folder_path)
            # Normalize files to NFD for comparison if needed, though usually FS returns composed.
            # But let's stick to simple string match.
        except Exception as e:
            missing_report.append(f"Error reading {folder_path}: {e}")
            continue
            
        # Check each topic
        for topic_num, title in topics.items():
            # Match main.js logic:
            # 1. Normalize and strip accents
            # 2. Remove illegal chars
            # 3. Remove trailing dot
            
            # JS: .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            normalized_title = unicodedata.normalize('NFD', title).encode('ascii', 'ignore').decode('utf-8')
            
            # JS: .replace(/:/g, ".")
            safe_title = normalized_title.replace(":", ".")
            
            # JS: .replace(/[<>:"/\\|?*]/g, "")  (Note: we already replaced colon with dot above, but regex has colon too)
            # Python equivalent of removing characters < > " / \ | ? *
            # The JS regex was `[<>:"/\\|?*]`. Since we swapped : for ., we just remove the rest.
            # Wait, JS swapped : FIRST. So it becomes a dot. Then the regex removes : (which is gone) and others.
            
            for char in ['<', '>', '"', '/', '\\', '|', '?', '*']:
                safe_title = safe_title.replace(char, "")
                
            # JS: .replace(/\.$/, "")
            if safe_title.endswith("."):
                safe_title = safe_title[:-1]
                
            displayName = f"TEMA {topic_num}. {safe_title}"
            
            expected_name = f"{displayName}.pdf"
            
            if expected_name not in files:
                missing_report.append(f"❌ Missing Ex {ex_num} Topic {topic_num}: {expected_name}")

    return missing_report

def main():
    js_path = os.path.join("js", "main.js")
    public_dir = os.path.join("public", "temas")
    
    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
    except FileNotFoundError:
        print(f"Could not find {js_path}")
        return

    exercises = parse_js_titles(js_content)
    
    print(f"Parsed {len(exercises)} exercises from JS.")
    for ex, topics in exercises.items():
        print(f"  - Exercise {ex}: {len(topics)} topics defined")
        
    print("\nChecking file existence...")
    report = check_files(public_dir, exercises)
    
    if report:
        print("\n".join(report))
    else:
        print("✅ All files present!")

if __name__ == "__main__":
    main()
