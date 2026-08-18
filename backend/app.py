import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

# Load trained model using absolute path
MODEL_PATH = os.path.join(BASE_DIR, "drowsiness_model.keras")
model = tf.keras.models.load_model(MODEL_PATH)

IMG_SIZE = (64, 64)


@app.route("/")
def home():
    """Serve the frontend index.html page."""
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:path>")
def static_proxy(path):
    """Serve static files like style.css, script.js, icons, etc."""
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    return jsonify({"error": "File not found"}), 404


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "message": "Driver Drowsiness Detection API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]

        # Open image
        image = Image.open(io.BytesIO(file.read()))

        # Convert to RGB
        image = image.convert("RGB")

        # Resize to model input dimensions (64, 64)
        image = image.resize(IMG_SIZE)

        # Convert to numpy array (float32, 0 to 255)
        # Note: Model internal Rescaling layer rescales 0..255 to 0..1
        image_array = np.array(image, dtype=np.float32)

        # Add batch dimension -> shape (1, 64, 64, 3)
        image_array = np.expand_dims(image_array, axis=0)

        # Run prediction
        prediction = model.predict(image_array, verbose=0)[0][0]

        # Model output: >0.5 -> SLEEPY, <=0.5 -> AWAKE
        if prediction > 0.5:
            status = "SLEEPY"
            confidence = float(prediction)
        else:
            status = "AWAKE"
            confidence = float(1 - prediction)

        return jsonify({
            "status": status,
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)