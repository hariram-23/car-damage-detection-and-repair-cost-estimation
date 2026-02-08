"""
Repackage the extracted model directory into a proper .pt file
"""
import zipfile
import os

# Paths
extracted_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'Model', 'best_damage_yolov8.pt', 'best')
output_file = os.path.join(os.path.dirname(__file__), '..', '..', 'Model', 'best_model.pt')

print(f"Source directory: {extracted_dir}")
print(f"Output file: {output_file}")
print(f"Source exists: {os.path.exists(extracted_dir)}")

try:
    # Create a ZIP file (PyTorch .pt files are ZIP archives)
    # Files must be in a subdirectory (e.g., "archive/")
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_STORED) as zipf:
        # Walk through the directory
        for root, dirs, files in os.walk(extracted_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Get the relative path from the extracted_dir
                rel_path = os.path.relpath(file_path, extracted_dir)
                # Add to archive with "archive/" prefix
                arcname = os.path.join('archive', rel_path).replace('\\', '/')
                print(f"Adding: {arcname}")
                zipf.write(file_path, arcname)
    
    print(f"\n✓ Model repackaged successfully!")
    print(f"New model file: {output_file}")
    print(f"File size: {os.path.getsize(output_file) / (1024*1024):.2f} MB")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
