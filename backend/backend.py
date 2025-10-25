from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/scan", methods=["POST"])
def scan():
    image = request.get_json()
    if image:
        print("Received image data")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=12345)

