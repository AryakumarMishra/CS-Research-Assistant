from langchain_core.prompts import PromptTemplate
import os
import json

from .get_llm import get_llm
from .retrieve_doc import get_retriever



SECTIONS_DIR = "backend/sections"

SECTION_CONFIG = {
    "problem_statement": {
        "query": "This paper addresses the problem of",
        "prompt": """
You are an AI research assistant.

You must answer ONLY using the provided context.
If the problem statement is not explicitly stated, say "Not clearly stated in the paper".

Context:
{context}

Task:
Extract the main research problem addressed by the paper.
"""
    },
    "motivation": {
        "query": "The motivation for this research is",
        "prompt": """
You are an AI research assistant.

Context:
{context}

Task:
Explain the motivation of the paper.
"""
    },
    "methodology": {
        "query": "The proposed method consists of",
        "prompt": """
You are an AI research assistant.

Context:
{context}

Task:
Explain the methodology proposed in the paper.
"""
    }
}




def load_cached_sections(pdf_id):
    path = f"{SECTIONS_DIR}/{pdf_id}.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None



def save_sections_to_file(pdf_id: str, sections: dict):
    os.makedirs(SECTIONS_DIR, exist_ok=True)
    file_path = os.path.join(SECTIONS_DIR, f"{pdf_id}.json")

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(sections, f, indent=2, ensure_ascii=False)




def generate_section(section_name: str, retriever, llm):
    config = SECTION_CONFIG[section_name]

    docs = retriever.invoke(config["query"])

    MAX_CONTEXT_CHARS = 3000
    context = "\n\n".join(doc.page_content for doc in docs)
    context = context[:MAX_CONTEXT_CHARS]

    prompt = PromptTemplate(
        input_variables=["context"],
        template=config["prompt"]
    )

    response = llm.invoke(prompt.format(context=context))

    return {
        "content": response,
        "source_chunks": [doc.metadata.get("chunk_id") for doc in docs]
    }