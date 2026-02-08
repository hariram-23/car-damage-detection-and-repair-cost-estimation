import sys
import json
import torch
from ultralytics import YOLO
from PIL import Image
import os
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Model path - use the properly packaged trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'Model', 'best_model.pt')

model = None
model_source = "trained"

# Load the trained damage detection model
try:
    print(json.dumps({"status": "Loading trained damage detection model..."}), file=sys.stderr)
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Trained model not found at: {MODEL_PATH}")
    
    model = YOLO(MODEL_PATH, task='detect')
    model_source = "trained"
    print(json.dumps({"status": f"Trained model loaded successfully. Classes: {list(model.names.values())}"}), file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Failed to load trained model: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

def predict_damage(image_path):
    """
    Predict damage from an image using trained YOLOv8 damage detection model
    The model directly predicts damage types and severity
    """
    try:
        print("\n" + "="*80, file=sys.stderr)
        print("🔍 STARTING DAMAGE ANALYSIS", file=sys.stderr)
        print("="*80, file=sys.stderr)
        print(f"📁 Image Path: {image_path}", file=sys.stderr)
        print(f"🤖 Model: {MODEL_PATH}", file=sys.stderr)
        print(f"📊 Model Source: {model_source}", file=sys.stderr)
        print(f"🎯 Confidence Threshold: 25%", file=sys.stderr)
        print("-"*80, file=sys.stderr)
        
        # Run inference with verbose=False to suppress output
        print("⚙️  Running inference...", file=sys.stderr)
        results = model(image_path, conf=0.25, verbose=False)
        
        # Process results
        detections = []
        total_area = 0
        
        print("\n📋 PROCESSING DETECTIONS:", file=sys.stderr)
        print("-"*80, file=sys.stderr)
        
        for result in results:
            boxes = result.boxes
            
            if len(boxes) == 0:
                print("⚠️  No detections found in image", file=sys.stderr)
            
            for idx, box in enumerate(boxes, 1):
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                
                # Get damage type directly from trained model
                damage_type = model.names[class_id]
                
                # Calculate area
                area = (x2 - x1) * (y2 - y1)
                total_area += area
                
                # Print detection details
                print(f"\n🔎 Detection #{idx}:", file=sys.stderr)
                print(f"   ├─ Damage Type: {damage_type}", file=sys.stderr)
                print(f"   ├─ Confidence: {round(confidence * 100, 2)}%", file=sys.stderr)
                print(f"   ├─ Class ID: {class_id}", file=sys.stderr)
                print(f"   ├─ Bounding Box: ({round(x1, 2)}, {round(y1, 2)}) → ({round(x2, 2)}, {round(y2, 2)})", file=sys.stderr)
                print(f"   ├─ Width: {round(x2 - x1, 2)}px", file=sys.stderr)
                print(f"   ├─ Height: {round(y2 - y1, 2)}px", file=sys.stderr)
                print(f"   └─ Area: {round(area, 2)} px²", file=sys.stderr)
                
                detections.append({
                    "damageType": damage_type,
                    "confidence": round(confidence * 100, 2),
                    "boundingBox": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2)
                    },
                    "area": round(area, 2)
                })
        
        # Determine overall severity based on number of detections and total area
        if len(detections) == 0:
            print("\n" + "="*80, file=sys.stderr)
            print("❌ ANALYSIS FAILED: No damage detected", file=sys.stderr)
            print("="*80 + "\n", file=sys.stderr)
            return {
                "success": False,
                "error": "No damage detected in the image. Please upload a clear image with visible vehicle damage. Ensure the damage is one of these types: dent, scratch, crack, glass shatter, lamp broken, or tire flat."
            }
        
        # Sort by confidence to get primary damage
        detections.sort(key=lambda x: x['confidence'], reverse=True)
        primary_damage = detections[0]['damageType']
        avg_confidence = sum(d['confidence'] for d in detections) / len(detections)
        
        # Determine severity based on detections and area
        if len(detections) >= 3 or total_area > 50000:
            severity = "Severe"
        elif len(detections) >= 2 or total_area > 20000:
            severity = "Moderate"
        else:
            severity = "Minor"
        
        # Print summary
        print("\n" + "="*80, file=sys.stderr)
        print("📊 ANALYSIS SUMMARY", file=sys.stderr)
        print("="*80, file=sys.stderr)
        print(f"✅ Total Detections: {len(detections)}", file=sys.stderr)
        print(f"🎯 Primary Damage: {primary_damage}", file=sys.stderr)
        print(f"📈 Average Confidence: {round(avg_confidence, 2)}%", file=sys.stderr)
        print(f"📏 Total Affected Area: {round(total_area, 2)} px²", file=sys.stderr)
        print(f"⚠️  Severity Level: {severity}", file=sys.stderr)
        
        # Print all detected damage types
        print(f"\n🏷️  Detected Damage Types:", file=sys.stderr)
        damage_counts = {}
        for det in detections:
            damage_type = det['damageType']
            damage_counts[damage_type] = damage_counts.get(damage_type, 0) + 1
        
        for damage_type, count in damage_counts.items():
            print(f"   • {damage_type}: {count}x", file=sys.stderr)
        
        # Print confidence distribution
        print(f"\n📊 Confidence Distribution:", file=sys.stderr)
        high_conf = sum(1 for d in detections if d['confidence'] >= 80)
        med_conf = sum(1 for d in detections if 60 <= d['confidence'] < 80)
        low_conf = sum(1 for d in detections if d['confidence'] < 60)
        print(f"   • High (≥80%): {high_conf}", file=sys.stderr)
        print(f"   • Medium (60-79%): {med_conf}", file=sys.stderr)
        print(f"   • Low (<60%): {low_conf}", file=sys.stderr)
        
        # Print severity calculation details
        print(f"\n🔢 Severity Calculation:", file=sys.stderr)
        print(f"   • Number of detections: {len(detections)}", file=sys.stderr)
        print(f"   • Total area: {round(total_area, 2)} px²", file=sys.stderr)
        print(f"   • Severity rules:", file=sys.stderr)
        print(f"     - Minor: 1 detection, area < 20,000 px²", file=sys.stderr)
        print(f"     - Moderate: 2 detections OR area 20,000-50,000 px²", file=sys.stderr)
        print(f"     - Severe: 3+ detections OR area > 50,000 px²", file=sys.stderr)
        print(f"   • Result: {severity}", file=sys.stderr)
        
        print("\n" + "="*80, file=sys.stderr)
        print("✅ ANALYSIS COMPLETED SUCCESSFULLY", file=sys.stderr)
        print("="*80 + "\n", file=sys.stderr)
        
        return {
            "success": True,
            "damageType": primary_damage,
            "severity": severity,
            "confidence": round(avg_confidence, 2),
            "affectedArea": round(total_area, 2),
            "detections": detections,
            "totalDetections": len(detections),
            "modelSource": model_source
        }
        
    except Exception as e:
        print("\n" + "="*80, file=sys.stderr)
        print("❌ ERROR DURING ANALYSIS", file=sys.stderr)
        print("="*80, file=sys.stderr)
        print(f"Error: {str(e)}", file=sys.stderr)
        print("="*80 + "\n", file=sys.stderr)
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image not found: {image_path}"}))
        sys.exit(1)
    
    result = predict_damage(image_path)
    print(json.dumps(result))
