import os
import zipfile
import shutil
import tempfile
import xml.dom.minidom

def scrub_docx_xml(file_path):
    """
    Remove metadata from a .docx file by modifying its internal XML.
    """
    temp_dir = tempfile.mkdtemp()
    temp_zip_path = os.path.join(temp_dir, "temp.zip")
    
    try:
        # Create a new zip file
        with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_zip_path, 'w') as zout:
            for item in zin.infolist():
                # Skip core.xml, app.xml, custom.xml which contain metadata
                if item.filename in ['docProps/core.xml', 'docProps/app.xml', 'docProps/custom.xml']:
                    continue
                
                # Copy other files as is
                zout.writestr(item, zin.read(item.filename))
        
        # Replace original file content with scrubbed content
        shutil.move(temp_zip_path, file_path)
        print(f"✅ Deep Scrubbed: {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to scrub {file_path}: {e}")
        return False
    finally:
        shutil.rmtree(temp_dir)

def main():
    target_dir = os.path.join(os.getcwd(), "public", "temas")
    print(f"Starting deep metadata scrub in: {target_dir}")
    
    count = 0
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith(".docx") and not file.startswith("~$"):
                file_path = os.path.join(root, file)
                if scrub_docx_xml(file_path):
                    count += 1
                    
    print(f"\n✨ Finished! Deep scrubbed {count} files.")

if __name__ == "__main__":
    main()
