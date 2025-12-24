from langchain_text_splitters import MarkdownTextSplitter

def create_chunks(text, source_name):
    splitter = MarkdownTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        keep_separator=True
    )

    docs = splitter.create_documents([text])
    
    for doc in docs:
        doc.metadata = {
            "source": source_name
        }
    
    return docs