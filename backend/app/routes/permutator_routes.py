from flask import Blueprint, request, jsonify
from app.services.email_service import generate_permutations, verify_email_smtp

permutator_bp = Blueprint('permutator', __name__)

@permutator_bp.route('/permutator', methods=['POST'])
def permutator():
    data = request.json
    fn = data.get('first_name')
    ln = data.get('last_name')
    domain = data.get('domain')
    
    if not fn or not ln or not domain:
        return jsonify({"error": "first_name, last_name, and domain are required"}), 400
        
    emails = generate_permutations(fn, ln, domain)
    results = [verify_email_smtp(e) for e in emails]
    return jsonify(results)
