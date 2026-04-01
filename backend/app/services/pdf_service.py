from pypdf import PdfReader

def extract_text_from_pdf(file_stream):
    try:
        reader = PdfReader(file_stream)
        return "\n".join([p.extract_text() for p in reader.pages if p.extract_text()])
    except Exception:
        return ""
