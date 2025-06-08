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
y_encoded = le.fit_transform(df["category"])

# Create proper label mapping CSV
label_mapping_data = []
for i, category in enumerate(le.classes_):
    label_mapping_data.append([category, i])

label_mapping_df = pd.DataFrame(label_mapping_data, columns=['category', 'label'])
label_mapping_df.to_csv("category_label_map.csv", index=False)

print("✅ Created proper label mapping:")
print(label_mapping_df)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"], y_encoded, test_size=0.2, random_state=42
)

# Save for model use
X_train.to_csv("X_train.csv", index=False)
X_test.to_csv("X_test.csv", index=False)
pd.Series(y_train).to_csv("y_train.csv", index=False, header=['category'])
pd.Series(y_test).to_csv("y_test.csv", index=False, header=['category'])

print("✅ Preprocessing complete!")
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
print(f"Unique categories: {len(le.classes_)}")
print("Categories:", list(le.classes_))