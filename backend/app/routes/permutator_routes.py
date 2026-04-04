from flask import Blueprint, request, jsonify
from app.services.email_service import generate_permutations, verify_email_smtp
import csv
import io
import re

permutator_bp = Blueprint('permutator', __name__)

@permutator_bp.route('/permutator', methods=['POST'])
def permutator():
    data = request.json
    domain = data.get('domain')
    
    if not domain:
        return jsonify({"error": "domain is required"}), 400
        
    finds = data.get('finds')
    
    # Handle bulk request
    if isinstance(finds, list):
        results = []
        for person in finds:
            fn = person.get('first_name')
            ln = person.get('last_name')
            if fn and ln:
                emails = generate_permutations(fn, ln, domain)
                verifications = [verify_email_smtp(e) for e in emails]
                results.append({
                    "first_name": fn,
                    "last_name": ln,
                    "verifications": verifications
                })
        return jsonify({"results": results})
        
    # Handle legacy single request
    fn = data.get('first_name')
    ln = data.get('last_name')
    if fn and ln:
        emails = generate_permutations(fn, ln, domain)
        results = [verify_email_smtp(e) for e in emails]
        return jsonify(results)
        
    return jsonify({"error": "either 'finds' list or 'first_name' and 'last_name' are required"}), 400

@permutator_bp.route('/upload_csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.csv'):
        # Decode and parse CSV
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        
        headers = csv_input.fieldnames
        if not headers:
            return jsonify({"error": "Empty CSV"}), 400
            
        def find_col(possible_names):
            for h in headers:
                clean_h = h.strip().lower().replace(' ', '').replace('_', '')
                for p in possible_names:
                    if p.lower().replace(' ', '').replace('_', '') == clean_h:
                        return h
            return None
            
        fn_col = find_col(['first_name', 'firstname', 'first'])
        ln_col = find_col(['last_name', 'lastname', 'last'])
        company_col = find_col(['company_name', 'companyname', 'company', 'domain'])
        
        if not fn_col or not ln_col or not company_col:
            return jsonify({"error": "CSV must contain First Name, Last Name, and Company Name columns"}), 400
            
        results = []
        for row in csv_input:
            fn = row.get(fn_col, '').strip()
            ln = row.get(ln_col, '').strip()
            domain = row.get(company_col, '').strip()
            
            if fn and ln and domain:
                # Cleanup domain if it contains URL parts
                domain = re.sub(r'^https?://', '', domain)
                domain = re.sub(r'^www\.', '', domain)
                domain = domain.split('/')[0]
                
                emails = generate_permutations(fn, ln, domain)
                verifications = [verify_email_smtp(e) for e in emails]
                results.append({
                    "first_name": fn,
                    "last_name": ln,
                    "domain": domain,
                    "verifications": verifications
                })
        
        return jsonify({"results": results})
    
    return jsonify({"error": "Invalid file type. Please upload a .csv file"}), 400
