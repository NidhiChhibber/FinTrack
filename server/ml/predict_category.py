import sys
import joblib
import pandas as pd


# Get input from command line
if len(sys.argv) < 2:
    print("Usage: python3 predict_category.py \"Your transaction description\"")
    sys.exit(1)

input_text = sys.argv[1]

model_path = "/Users/divynidhichhibber/Downloads/FinTrack/server/ml/transaction_classifier.pkl"
label_map_path = "/Users/divynidhichhibber/Downloads/FinTrack/server/ml/category_label_map.csv"

# Load trained model
model = joblib.load(model_path)

# Predict numeric category
predicted_label = model.predict([input_text])[0]

# Load category label map
label_map_df = pd.read_csv(label_map_path, header=None, names=["category", "label"])
label_map = dict(zip(label_map_df["label"], label_map_df["category"]))

# Decode number to category name
predicted_category = label_map.get(predicted_label, "Unknown")

print(predicted_category)
