
import os

file_path = 'js/main.js'
new_function = """// Download Helper Function
async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response or file not found');
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        
        a.click();
        
        setTimeout(() => {
            window.URL.revokeObjectURL(objectUrl);
            document.body.removeChild(a);
        }, 100);
    } catch (error) {
        console.warn('Advanced download failed (likely due to local file/CORS), falling back to direct link:', error);
        
        // Fallback: Trigger direct download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Attempt to set filename (browser might ignore on file://)
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}"""

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the start of the function to identify the block
start_marker = "async function downloadFile(url, filename) {"
end_marker = "alert('Error al descargar el archivo. Por favor, inténtelo de nuevo.');\n    }\n}"

# Find start and end indices
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find function start")
    # Try finding the comment
    start_marker = "// Download Helper Function\nasync function downloadFile(url, filename) {"
    start_idx = content.find(start_marker)

if start_idx != -1:
    # We want to replace from the start marker (or the comment before it)
    # The previous function ends with the alert and closing braces
    # Let's try to find the end of the function block more robustly
    # We know the specific alert content is in the old function
    alert_part = "alert('Error al descargar el archivo. Por favor, inténtelo de nuevo.');"
    alert_idx = content.find(alert_part, start_idx)
    
    if alert_idx != -1:
        # Find the closing brace after the alert
        end_idx = content.find("}", alert_idx) # Closing brace of catch
        end_idx = content.find("}", end_idx + 1) # Closing brace of function
        
        if end_idx != -1:
            # We found the range to replace
            # Check if we should include the comment
            comment_marker = "// Download Helper Function"
            comment_idx = content.rfind(comment_marker, 0, start_idx)
            
            replace_start = start_idx
            if comment_idx != -1 and content[comment_idx:start_idx].strip() == "":
                 replace_start = comment_idx

            original_text = content[replace_start:end_idx+1]
            print(f"Replacing:\\n{original_text}")
            
            new_content = content[:replace_start] + new_function + content[end_idx+1:]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully replaced downloadFile function")
        else:
             print("Could not find end of function")
    else:
        print("Could not find alert message in function")
else:
    print("Could not find downloadFile function")
