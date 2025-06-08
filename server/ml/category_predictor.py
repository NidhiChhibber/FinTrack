# server/ml/category_predictor.py
import joblib
import pandas as pd
import json
import sys
from pathlib import Path

class CategoryPredictor:
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = Path(__file__).parent
        else:
            model_dir = Path(model_dir)
            
        self.model_path = model_dir / "transaction_classifier.pkl"
        self.label_map_path = model_dir / "category_label_map.csv"
        
        self.model = None
        self.label_map = None
        self.is_loaded = False
        
    def load_model(self):
        """Load the ML model and label mapping"""
        try:
            # Load model
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found: {self.model_path}")
                
            self.model = joblib.load(self.model_path)
            
            # Load label mapping
            if not self.label_map_path.exists():
                raise FileNotFoundError(f"Label map not found: {self.label_map_path}")
                
            label_map_df = pd.read_csv(self.label_map_path)
            label_map_df = label_map_df.dropna()
            
            # Create mapping from label to category
            self.label_map = dict(zip(label_map_df["label"], label_map_df["category"]))
            
            self.is_loaded = True
            return True
            
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            return False
    
    def predict(self, transaction_text, merchant_name=""):
        """Predict category for transaction"""
        if not self.is_loaded:
            if not self.load_model():
                return {
                    "category": "Uncategorized",
                    "confidence": 0.1,
                    "error": "Model not loaded"
                }
        
        try:
            # Combine text
            input_text = f"{transaction_text} {merchant_name}".strip()
            
            # Predict
            predicted_label = self.model.predict([input_text])[0]
            
            # Get category name
            category = self.label_map.get(predicted_label, "Uncategorized")
            
            # Get confidence if available
            confidence = 0.8
            if hasattr(self.model, 'predict_proba'):
                try:
                    probabilities = self.model.predict_proba([input_text])[0]
                    confidence = float(max(probabilities))
                except:
                    confidence = 0.8
            
            return {
                "category": category,
                "confidence": confidence,
                "label": int(predicted_label)
            }
            
        except Exception as e:
            return {
                "category": "Uncategorized", 
                "confidence": 0.1,
                "error": str(e)
            }

# For command line usage (if needed for testing)
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Transaction description required"}))
        sys.exit(1)
    
    predictor = CategoryPredictor()
    description = sys.argv[1]
    merchant = sys.argv[2] if len(sys.argv) > 2 else ""
    
    result = predictor.predict(description, merchant)
    print(json.dumps(result))