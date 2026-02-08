"""
Test the repackaged model
"""
from ultralytics import YOLO
import os

model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'Model', 'best_model.pt')

print(f"Testing model: {model_path}")
print(f"File exists: {os.path.exists(model_path)}")
print(f"File size: {os.path.getsize(model_path) / (1024*1024):.2f} MB")

try:
    model = YOLO(model_path)
    print("\n✓ Model loaded successfully!")
    print(f"\n=== Model Information ===")
    print(f"Model names: {model.names}")
    print(f"Number of classes: {len(model.names)}")
    print("\n=== Class Mapping ===")
    for class_id, class_name in model.names.items():
        print(f"  {class_id}: {class_name}")
    
except Exception as e:
    print(f"\n✗ Failed to load model: {e}")
    import traceback
    traceback.print_exc()
