import pytest
from backend.dataset.adapter import ResultAdapter
from backend.schemas.result import ResultSource

def test_adapter_reads_presentation():
    # EXP-01 is provided as presentation data
    result = ResultAdapter.get_result("EXP-01")
    assert result.experiment_id == "EXP-01"
    assert result.result_source == ResultSource.PRESENTATION

def test_adapter_list_experiments():
    experiments = ResultAdapter.list_experiments()
    assert "EXP-01" in experiments

def test_adapter_not_found():
    with pytest.raises(FileNotFoundError):
        ResultAdapter.get_result("NON_EXISTENT_EXP")
