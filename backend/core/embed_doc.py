from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
import os

from .chunk_doc import create_chunks

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def embed_doc(md_path, pdf_id):
    if not os.path.exists(md_path):
        raise FileNotFoundError(f"Markdown file not found at {md_path}")
    
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()

    vectorstore = FAISS.from_documents(
        documents=create_chunks(text, pdf_id),
        embedding=embeddings,
        docstore=InMemoryDocstore()
    )
    vectorstore.save_local(f"backend/faiss_index/{pdf_id}")