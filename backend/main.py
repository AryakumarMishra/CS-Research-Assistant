from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import uuid
import os

from .core.load_pdf import load_pdf
from .core.embed_doc import embed_doc
from .core.retrieve_doc import retrieve_doc
from .schema.output_schema import Paper
from .schema.query_schema import QueryInput, ChatInput
from .core.generate_sections import generate_section, load_cached_sections, save_sections_to_file
from .core.retrieve_doc import get_retriever
from .core.get_llm import get_llm


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"]
)


# Test Endpoint
@app.get("/")
def home_page():
    return "Welcome to your AI Research Assistant"


# Main Endpoints
@app.post("/upload_pdf")
async def upload_file(file: UploadFile):
    pdf_id = uuid.uuid4().hex

    text = await file.read()
    file_stream = BytesIO(text)

    md_path = load_pdf(file_stream, pdf_id, file.filename)
    embed_doc(md_path, pdf_id)
       
    return {
        'message': 'File uploaded successfully',
        'path': 'uploaded_data/extracted.md',
        'embeddings':'backend/faiss_index',
        'pdf_id': pdf_id
    }


@app.post("/analyze_sections")
async def analyze_sections(pdf_id: str):
    cached = load_cached_sections(pdf_id)
    if cached:
        return cached

    retriever = get_retriever(pdf_id)
    llm = get_llm()

    results = {}

    for section in ["problem_statement", "motivation", "methodology"]:
        results[section] = generate_section(
            section_name=section,
            retriever=retriever,
            llm=llm
        )

    save_sections_to_file(pdf_id, results)
    return results


@app.post("/chat")
async def chat(request: ChatInput):
    retriever = get_retriever(request.pdf_id)
    docs = retriever.invoke(request.question)[:3]

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
        You are an AI research assistant.

        STRICT RULES (must be followed):
        1. Use ONLY the information contained in the provided context from the uploaded PDF.
        2. Do NOT use prior knowledge, assumptions, or external information.
        3. If the answer cannot be found explicitly in the context, reply exactly:
        "Not found in the provided document."
        4. ALWAYS include the EXACT context excerpt(s) from the PDF that were used to answer the question.
        5. The context must be copied verbatim with no paraphrasing, edits, or omissions.
        6. If no answer is found, do NOT invent or infer information.

        Answer guidelines:
        - 3–5 concise sentences maximum.
        - No background or explanatory information unless it appears in the context.

        Required output format:

        Answer:
        <your answer here>

        Context (verbatim from the document):
        <context excerpt here>

        Context:
        {context}

        Question:
        {request.question}
        """


    llm = get_llm()
    answer = llm.invoke(prompt)

    return {
        "answer": answer,
        "sources": [doc.metadata for doc in docs]
    }
