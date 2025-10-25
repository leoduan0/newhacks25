from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)


@app.route("/scan", methods=["POST"])
def scan():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"success": False, "error": "No image data provided"}), 400

        image_base64 = data["image"]
        print(f"Received image data at {datetime.now()}")

        image_bytes = base64.b64decode(image_base64)

        # add other image processing stuff here

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Receipt uploaded successfully",
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
