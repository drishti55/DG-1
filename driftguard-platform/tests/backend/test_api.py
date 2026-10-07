import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "DriftGuard"}

def test_get_overview():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "dataset_cases" in data
    assert data["dataset_cases"] == 154241

def test_get_experiments():
    response = client.get("/api/experiments")
    assert response.status_code == 200
    data = response.json()
    assert "experiments" in data
    assert "EXP-01" in data["experiments"]

def test_get_single_experiment():
    response = client.get("/api/experiments/EXP-01")
    assert response.status_code == 200
    data = response.json()
    assert data["experiment_id"] == "EXP-01"
    assert data["metrics"]["accuracy"] == 0.84
