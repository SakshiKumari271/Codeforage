from flask import Blueprint, request, jsonify
from app.services.email_service import verify_email_smtp

verify_bp = Blueprint('verify', __name__)

@verify_bp.route('/verify-single', methods=['POST'])
def verify_single():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    return jsonify(verify_email_smtp(email))
