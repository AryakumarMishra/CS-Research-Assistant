from pydantic import BaseModel

class QueryInput(BaseModel):
    query: str
    pdf_id: str

class ChatInput(BaseModel):
    question: str
    pdf_id: str