import os
from docx import Document

def scrub_metadata(directory):
    """
    Recursively remove metadata from all .docx files in the given directory.
    """
    print(f"Scrubbing metadata from .docx files in: {directory}")
    count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".docx"):
                file_path = os.path.join(root, file)
                try:
                    doc = Document(file_path)
                    core_props = doc.core_properties
                    
                    # Clear core properties
                    core_props.author = ""
                    core_props.last_modified_by = ""
                    core_props.comments = ""
                    core_props.title = ""
                    core_props.subject = ""
                    core_props.keywords = ""
                    core_props.category = ""
                    
                    # Save the file (overwriting the original)
                    doc.save(file_path)
                    print(f"✅ Scrubbed: {file}")
                    count += 1
                except Exception as e:
                    print(f"❌ Failed to scrub {file}: {e}")

    print(f"\n✨ Finished! Scrubbed metadata from {count} files.")

if __name__ == "__main__":
    # Target directory is ./public/temas relative to this script
    target_dir = os.path.join(os.getcwd(), "public", "temas")
    
    if os.path.exists(target_dir):
        scrub_metadata(target_dir)
    else:
        print(f"Directory not found: {target_dir}")
