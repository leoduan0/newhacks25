# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

class totalCount:
    def __init__(self):
        self.newest_id = 0

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native requests

count = totalCount()

# Sample endpoint
@app.route('/home', methods=['GET'])
def home():
    # Retrieve database information
    return jsonify({'message': 'Hello from Flask!'})

# POST endpoint example
@app.route('/api/upload', methods=['POST'])
def upload():
    image = request.json['image']
    count.newest_id += 1
    with open(f'{os.path.dirname(os.path.realpath(__file__))}/images/{count.newest_id}.txt', 'w') as file:
        file.write(image)
    return "True"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    upload()