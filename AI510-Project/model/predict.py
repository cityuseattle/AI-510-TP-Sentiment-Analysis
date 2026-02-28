from flask import Flask, request, jsonify
import joblib
import re

# -----------------------------
# Text cleaning (same as training)
# -----------------------------
def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

# -----------------------------
# Load model + vectorizer
# -----------------------------
with open("artifacts/sentiment_model.pkl", "rb") as f:
    model = joblib.load(f)

with open("artifacts/tfidf.pkl", "rb") as f:
    vectorizer = joblib.load(f)

# -----------------------------
# Flask app
# -----------------------------
app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Request must contain a 'text' field"}), 400

    raw_text = data["text"]
    cleaned = clean_text(raw_text)

    transformed = vectorizer.transform([cleaned])
    prediction = model.predict(transformed)[0]

    return jsonify({
        "input": raw_text,
        "cleaned_text": cleaned,
        "sentiment": prediction
    })

# -----------------------------
# Local run
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)