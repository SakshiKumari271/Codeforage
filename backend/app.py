from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import utils
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "CodeForage API is running!"

@app.route('/api/verify-single', methods=['POST'])
def verify_single():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    return jsonify(utils.verify_email_smtp(email))

if __name__ == '__main__':
    app.run(debug=True, port=5000)