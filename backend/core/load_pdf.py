import pymupdf
import pymupdf4llm
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploaded_data")

def load_pdf(pdf, pdf_id, filename):
    doc = pymupdf.open("pdf", pdf)
    md_text = pymupdf4llm.to_markdown(doc)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    md_path = os.path.join(
        UPLOAD_DIR,
        f"{pdf_id}_{filename}.md"
    )

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_text) # type: ignore
    
    return md_path
