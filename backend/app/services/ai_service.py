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
            "Write a cold email. Resume: {resume}. Context: {context}. Return Subject and Body."
        )
        chain = prompt | llm | StrOutputParser()
        return chain.invoke({"resume": resume_text[:4000], "context": context})
    except Exception as e:
        raise e
