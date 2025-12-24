from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")



def get_retriever(pdf_id):
    vectorstore = FAISS.load_local(
        f"backend/faiss_index/{pdf_id}",
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vectorstore.as_retriever(
        search_type='similarity',
        search_kwargs={"k":5}
    )


def retrieve_doc(query, pdf_id):
    retriever = get_retriever(pdf_id)
    docs = retriever.invoke(query)
    return [doc.page_content for doc in docs]