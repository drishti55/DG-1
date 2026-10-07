import pytest
from backend.schemas.result import ResultSchema, ResultSource, MetricValues, ConfusionMatrix
from datetime import datetime

def test_result_schema_valid():
    data = {
        "experiment_id": "EXP-TEST",
        "run_id": "run-test",
        "research_question": "RQ1",
        "hypothesis": "H1",
        "dataset": "test_ds",
        "dataset_split": "train",
        "case_count": 100,
        "model": "model-1",
        "model_version": "v1",
        "retrieval_method": "Dense",
        "embedding_model": "emb-1",
        "chunking_strategy": "AST",
        "top_k": 5,
        "prompt_version": "v2",
        "temperature": 0.5,
        "metrics": {
            "accuracy": 0.9,
            "precision": 0.8,
            "recall": 0.85,
            "f1": 0.82
        },
        "confusion_matrix": {
            "true_positive": 80,
            "false_positive": 10,
            "true_negative": 5,
            "false_negative": 5
        },
        "latency": {"average": 10.0},
        "evidence_metrics": {"validity": 0.9},
        "failure_metrics": {"hallucination": 0.05},
        "interpretation": "Good",
        "conclusion": "Done",
        "timestamp": "2026-10-07T00:00:00Z",
        "result_source": "ACTUAL"
    }
    
    result = ResultSchema(**data)
    assert result.experiment_id == "EXP-TEST"
    assert result.metrics.accuracy == 0.9
    assert result.result_source == ResultSource.ACTUAL
