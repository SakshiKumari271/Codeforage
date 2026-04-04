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
        try:
            # Decode using utf-8-sig to automatically handle BOM if present
            # We use stream.read().decode('utf-8-sig') for small files
            # For larger files, we could read chunks, but for now this is more robust
            content = file.stream.read().decode("utf-8-sig")
            stream = io.StringIO(content, newline=None)
            csv_input = csv.DictReader(stream)
            
            headers = csv_input.fieldnames
            if not headers:
                return jsonify({"error": "Empty CSV"}), 400
                
            def find_col(possible_names):
                for h in headers:
                    # Clean header from whitespace, case, and special chars
                    clean_h = re.sub(r'[^a-zA-Z0-0]', '', h.lower())
                    for p in possible_names:
                        clean_p = re.sub(r'[^a-zA-Z0-0]', '', p.lower())
                        if clean_p == clean_h:
                            return h
                return None
                
            fn_col = find_col(['first_name', 'firstname', 'first', 'fname'])
            ln_col = find_col(['last_name', 'lastname', 'last', 'lname'])
            company_col = find_col(['company_name', 'companyname', 'company', 'domain', 'website', 'url'])
            
            if not fn_col or not ln_col or not company_col:
                # Provide better feedback on missing columns
                missing = []
                if not fn_col: missing.append("First Name")
                if not ln_col: missing.append("Last Name")
                if not company_col: missing.append("Company/Domain")
                return jsonify({"error": f"CSV must contain {', '.join(missing)} columns"}), 400
                
            results = []
            for row in csv_input:
                try:
                    fn = row.get(fn_col, '').strip() if fn_col else ''
                    ln = row.get(ln_col, '').strip() if ln_col else ''
                    domain = row.get(company_col, '').strip() if company_col else ''
                    
                    if fn and ln and domain:
                        # Cleanup domain if it contains URL parts
                        domain = re.sub(r'^https?://', '', domain)
                        domain = re.sub(r'^www\.', '', domain)
                        domain = domain.split('/')[0].split('?')[0] # remove paths and query params
                        
                        emails = generate_permutations(fn, ln, domain)
                        verifications = [verify_email_smtp(e) for e in emails]
                        results.append({
                            "first_name": fn,
                            "last_name": ln,
                            "domain": domain,
                            "verifications": verifications
                        })
                except Exception as row_err:
                    # Skip problematic row but continue
                    print(f"Skipping row error: {row_err}")
                    continue
            
            return jsonify({"results": results})
        except Exception as e:
            return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500
    
    return jsonify({"error": "Invalid file type. Please upload a .csv file"}), 400
