from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

class ResultSource(str, Enum):
    ACTUAL = "ACTUAL"
    PRESENTATION = "PRESENTATION"

class MetricValues(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1: float

class ConfusionMatrix(BaseModel):
    true_positive: int
    false_positive: int
    true_negative: int
    false_negative: int

class ResultSchema(BaseModel):
    experiment_id: str
    run_id: str
    research_question: str
    hypothesis: str
    dataset: str
    dataset_split: str
    case_count: int
    model: str
    model_version: str
    retrieval_method: str
    embedding_model: str
    chunking_strategy: str
    top_k: int
    prompt_version: str
    temperature: float
    metrics: MetricValues
    confusion_matrix: ConfusionMatrix
    latency: Dict[str, float]
    evidence_metrics: Dict[str, float]
    failure_metrics: Dict[str, float]
    interpretation: str
    conclusion: str
    timestamp: datetime
    result_source: ResultSource
