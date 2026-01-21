import os
import pdfplumber
try:
    import fitz  # PyMuPDF
except ModuleNotFoundError:
    fitz = None
from docx import Document


def extract_text_from_pdf(path: str) -> str:
    text = ""

    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
    except Exception:
        if not fitz:
            raise
        doc = fitz.open(path)
        for page in doc:
            text += page.get_text() + "\n"

    return text.strip()


def extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs).strip()


def extract_resume_text(file_path: str) -> str:
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if extension == ".docx":
        return extract_text_from_docx(file_path)

    raise ValueError("Unsupported file format")
