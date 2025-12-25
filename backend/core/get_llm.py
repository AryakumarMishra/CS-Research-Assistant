from langchain_ollama import OllamaLLM

def get_llm():
    return OllamaLLM(
        model='mistral',
        temperature=0.2,
        num_predict=300,
        num_ctx=2048
    )