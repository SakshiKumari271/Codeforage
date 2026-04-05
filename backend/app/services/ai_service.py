import os
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

def generate_email_draft(resume_text, context, provider='OpenAI', api_key=None, model=None):
    if not api_key:
        api_key = os.getenv(f"{provider.upper()}_API_KEY")

    if not model:
        model = 'gpt-4o' if provider.lower() == 'openai' else 'llama-3.3-70b-versatile'

    if not api_key:
        raise ValueError("API Key missing")

    try:
        if provider.lower() == "openai":
            llm = ChatOpenAI(model=model, openai_api_key=api_key)
        else:
            llm = ChatGroq(model=model, groq_api_key=api_key)

        prompt = PromptTemplate.from_template(
            "Write a professional cold email. "
            "Resume: {resume}. "
            "Context: {context}. "
            "IMPORTANT: Return ONLY a valid JSON object with 'subject' and 'body' keys. "
            "Do NOT include markdown links (use plain URLs). "
            "Do NOT include labels like 'Subject:' or 'Body:' in the text. "
            "LENGTH: Make it a moderate length (approx. 3 concise paragraphs). "
            "STRUCTURE: Follow this exact spacing: "
            "Salutation\n\n"
            "Paragraphs separated by \n\n"
            "Closing statement (e.g. 'Thank you...')\n\n"
            "Sign-off (e.g. 'Best regards,')\n"
            "Name\n\n"
            "CRITICAL: The sign-off 'Best regards,' and your name MUST be on separate lines (use \\n between them)."
        )
        chain = prompt | llm | StrOutputParser()
        result = chain.invoke({"resume": resume_text[:4000], "context": context})
        
        # Clean potential markdown JSON fencing
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0].strip()
        elif "```" in result:
            result = result.split("```")[1].split("```")[0].strip()
            
        return result.strip()
    except Exception as e:
        raise e
