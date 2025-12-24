from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum
from uuid import UUID
from datetime import datetime


# BASIC VARIABLE SCHEMA
class ConfidenceLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class PaperType(str, Enum):
    research = "research"
    survey = "survey"
    review = "review"
    unknown = "unknown"

class Domain(str, Enum):
    computer_science = "computer_science"

class EmbeddingModel(str, Enum):
    embedding_model = "all-MiniLM-L6-v2"

class LLM(str, Enum):
    llm = "llama3:8b"

class VectorStore(str, Enum):
    vector_store = "faiss"

class ChatConfig(BaseModel):
    enable: bool = True


# SUB-SCHEMAS
class ContentSummary(BaseModel):
    content: str
    confidence: ConfidenceLevel
    sources: List[str]

class System(BaseModel):
    llm: LLM
    embedding_model: EmbeddingModel
    vector_store: VectorStore
    created_at: datetime


class PaperBreakdown(BaseModel):
    problem_statement: ContentSummary
    motivation: ContentSummary
    
class TechnicalCore(BaseModel):
    methodology: ContentSummary
    algorithms_system_design: ContentSummary
    key_contributions: ContentSummary

class CriticalView(BaseModel):
    strengths: ContentSummary
    limitations: ContentSummary
    when_not_to_use: ContentSummary

class Metadata(BaseModel):
    title: str
    authors: List[str]
    year: Optional[str]
    domain: Domain
    paper_type: PaperType


# MAIN SCHEMA
class Paper(BaseModel):
    paper_id: UUID
    metadata: Metadata
    paper_breakdown: PaperBreakdown
    technical_core: TechnicalCore
    critical_view: CriticalView
    chat: ChatConfig
    system: System
