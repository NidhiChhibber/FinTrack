# ml/retrain_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
import joblib
import os

DATA_PATH = 'retrain/training_data.csv'
MODEL_PATH = 'ml/transaction_classifier.pkl'  # Save with original model name

def retrain():
    df = pd.read_csv(DATA_PATH)
    if df.empty:
        raise ValueError("Training data is empty")

    X = df['name']
    y = df['category']

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression(max_iter=500))
    ])

    pipeline.fit(X, y)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model retrained and saved to {MODEL_PATH}")

if __name__ == '__main__':
    retrain()
