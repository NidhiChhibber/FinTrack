import pandas as pd
import string
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load CSV
df = pd.read_csv("sample_transactions.csv")

# Basic text cleaning
def clean(text):
    return (
        str(text)
        .lower()
        .translate(str.maketrans("", "", string.punctuation))
        .strip()
    )

df["clean_text"] = df["name"].fillna("") + " " + df["merchant_name"].fillna("")
df["clean_text"] = df["clean_text"].apply(clean)

# Encode target
le = LabelEncoder()
df["category"] = le.fit_transform(df["category"])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"], df["category"], test_size=0.2, random_state=42
)

# Save for model use
X_train.to_csv("X_train.csv", index=False)
X_test.to_csv("X_test.csv", index=False)
y_train.to_csv("y_train.csv", index=False)
y_test.to_csv("y_test.csv", index=False)

# Save label mapping for decoding later
label_mapping = dict(zip(le.classes_, le.transform(le.classes_)))
pd.Series(label_mapping).to_csv("category_label_map.csv")
