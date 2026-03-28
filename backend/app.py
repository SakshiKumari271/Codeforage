from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import utils
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
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

@app.route('/api/permutator', methods=['POST'])
def permutator():
    data = request.json
    fn = data.get('first_name')
    ln = data.get('last_name')
    domain = data.get('domain')
    
    if not fn or not ln or not domain:
        return jsonify({"error": "first_name, last_name, and domain are required"}), 400
        
    emails = utils.generate_permutations(fn, ln, domain)
    results = [utils.verify_email_smtp(e) for e in emails]
    return jsonify(results)

@app.route('/api/draft-email', methods=['POST'])
def draft_email():
    if 'resume' not in request.files:
        return jsonify({"error": "Resume PDF required"}), 400
    
    resume_file = request.files['resume']
    company_context = request.form.get('context', '')
    provider = request.form.get('provider', 'OpenAI') 
    api_key = request.form.get('api_key') or os.getenv(f"{provider.upper()}_API_KEY")
    model = request.form.get('model')

    if not model:
        model = 'gpt-4o' if provider.lower() == 'openai' else 'llama-3.3-70b-versatile'

    if not api_key:
        return jsonify({"error": "API Key missing"}), 400

    file_bytes = io.BytesIO(resume_file.read())
    resume_text = utils.extract_text_from_pdf(file_bytes)
    
    try:
        if provider.lower() == "openai":
            llm = ChatOpenAI(model=model, openai_api_key=api_key)
        else:
            llm = ChatGroq(model=model, groq_api_key=api_key)

        prompt = PromptTemplate.from_template(
            "Write a cold email. Resume: {resume}. Context: {context}. Return Subject and Body."
        )
        chain = prompt | llm | StrOutputParser()
        email_draft = chain.invoke({"resume": resume_text[:4000], "context": company_context})
        return jsonify({"draft": email_draft})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)