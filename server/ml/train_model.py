import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
import joblib

# Load cleaned input text
X_train = pd.read_csv("X_train.csv")["clean_text"]
X_test = pd.read_csv("X_test.csv")["clean_text"]

# ✅ Load category labels (NOT encoded values)
y_train_labels = pd.read_csv("y_train.csv")["category"]
y_test_labels = pd.read_csv("y_test.csv")["category"]

# Encode readable category labels
label_encoder = LabelEncoder().fit(y_train_labels)
y_train = label_encoder.transform(y_train_labels)
y_test = label_encoder.transform(y_test_labels)

# Save label encoder
joblib.dump(label_encoder, "label_encoder.pkl")

# Build pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression(max_iter=1000))
])

# Train model
pipeline.fit(X_train, y_train)

# Evaluate
predictions = pipeline.predict(X_test)
print(classification_report(y_test, predictions))

# Save trained pipeline
joblib.dump(pipeline, "transaction_classifier.pkl")
print("✅ Model and label encoder saved.")
