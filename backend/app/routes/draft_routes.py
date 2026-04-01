import io
from flask import Blueprint, request, jsonify
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import generate_email_draft

draft_bp = Blueprint('draft', __name__)

@draft_bp.route('/draft-email', methods=['POST'])
def draft_email():
    if 'resume' not in request.files:
        return jsonify({"error": "Resume PDF required"}), 400
    
    resume_file = request.files['resume']
    company_context = request.form.get('context', '')
    provider = request.form.get('provider', 'OpenAI') 
    api_key = request.form.get('api_key')
    model = request.form.get('model')

    file_bytes = io.BytesIO(resume_file.read())
    resume_text = extract_text_from_pdf(file_bytes)
    
    try:
        email_draft = generate_email_draft(
            resume_text=resume_text,
            context=company_context,
            provider=provider,
            api_key=api_key,
            model=model
        )
        return jsonify({"draft": email_draft})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
