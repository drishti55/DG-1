import os
import json
from pathlib import Path
from schemas.result import ResultSchema, ResultSource

DATA_DIR = Path(__file__).parent.parent.parent / "data"

class ResultAdapter:
    @staticmethod
    def get_result(experiment_id: str, use_actual_if_available: bool = True) -> ResultSchema:
        actual_path = DATA_DIR / "actual" / f"{experiment_id}.json"
        presentation_path = DATA_DIR / "presentation" / f"{experiment_id}.json"
        
        if use_actual_if_available and actual_path.exists():
            with open(actual_path, "r") as f:
                data = json.load(f)
                data["result_source"] = ResultSource.ACTUAL
                return ResultSchema(**data)
                
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                data = json.load(f)
                data["result_source"] = ResultSource.PRESENTATION
                return ResultSchema(**data)
                
        raise FileNotFoundError(f"No result found for experiment: {experiment_id}")

    @staticmethod
    def list_experiments() -> list[str]:
        experiments = set()
        for p in [DATA_DIR / "actual", DATA_DIR / "presentation"]:
            if p.exists():
                for file in p.glob("*.json"):
                    experiments.add(file.stem)
        return list(experiments)

    @staticmethod
    def get_dataset(use_actual_if_available: bool = True) -> dict:
        # Mock actual logic if we had driftguard-dataset/ folder
        presentation_path = DATA_DIR / "presentation" / "dataset_cases.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"items": []}

    @staticmethod
    def get_repositories() -> list:
        presentation_path = DATA_DIR / "presentation" / "repositories.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return []

    @staticmethod
    def get_repository(repo_id: str) -> dict:
        repos = ResultAdapter.get_repositories()
        for repo in repos:
            if repo["id"] == repo_id:
                return repo
        raise FileNotFoundError(f"Repository {repo_id} not found")

    @staticmethod
    def get_ast(repo_id: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / f"ast_{repo_id}.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"repository": repo_id, "files": []}

    @staticmethod
    def get_graph(repo_id: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / f"graph_{repo_id}.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"repository": repo_id, "nodes": [], "edges": []}

    @staticmethod
    def get_chunks(repo_id: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / f"chunks_{repo_id}.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"repository": repo_id, "chunks": []}

    @staticmethod
    def get_embeddings(repo_id: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / f"embeddings_{repo_id}.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"repository": repo_id, "chunks": []}

    @staticmethod
    def get_dense_retrieval(query: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / "retrieval_dense.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"query": query, "results": []}

    @staticmethod
    def get_bm25_retrieval(query: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / "retrieval_bm25.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"query": query, "results": []}

    @staticmethod
    def get_hybrid_retrieval(query: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / "retrieval_hybrid.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"query": query, "results": []}

    @staticmethod
    def get_rag(query: str) -> dict:
        presentation_path = DATA_DIR / "presentation" / "rag.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {"query": query, "generation": ""}

    @staticmethod
    def get_llm_status() -> dict:
        presentation_path = DATA_DIR / "presentation" / "llm_inference.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_structured_output() -> dict:
        presentation_path = DATA_DIR / "presentation" / "structured_output.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_evidence_verification() -> dict:
        presentation_path = DATA_DIR / "presentation" / "evidence_verification.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_quantitative_evaluation() -> dict:
        presentation_path = DATA_DIR / "presentation" / "eval_quantitative.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_qualitative_evaluation() -> dict:
        presentation_path = DATA_DIR / "presentation" / "eval_qualitative.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_orchestration_status() -> dict:
        presentation_path = DATA_DIR / "presentation" / "orchestration_status.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_actionable_outputs() -> dict:
        presentation_path = DATA_DIR / "presentation" / "actionable_outputs.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_cicd() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_cicd.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_finetuning_status() -> dict:
        presentation_path = DATA_DIR / "presentation" / "finetuning_status.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_rbac() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_rbac.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_audit() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_audit.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_registry_models() -> dict:
        presentation_path = DATA_DIR / "presentation" / "registry_models.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_secrets() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_secrets.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_billing() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_billing.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_webhooks() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_webhooks.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_export() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_export.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_system_logs() -> dict:
        presentation_path = DATA_DIR / "presentation" / "system_logs.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_system_health() -> dict:
        presentation_path = DATA_DIR / "presentation" / "system_health.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_search_results() -> dict:
        presentation_path = DATA_DIR / "presentation" / "search_results.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_testing_ab() -> dict:
        presentation_path = DATA_DIR / "presentation" / "testing_ab.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_resolution() -> dict:
        presentation_path = DATA_DIR / "presentation" / "resolution.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_pr_reviewer() -> dict:
        presentation_path = DATA_DIR / "presentation" / "pr_reviewer.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_chunking_multimodal() -> dict:
        presentation_path = DATA_DIR / "presentation" / "chunking_multimodal.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_prompts() -> dict:
        presentation_path = DATA_DIR / "presentation" / "prompts.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_graph_v2() -> dict:
        presentation_path = DATA_DIR / "presentation" / "graph_v2.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_config() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_config.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_notifications() -> dict:
        presentation_path = DATA_DIR / "presentation" / "notifications.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_collaboration() -> dict:
        presentation_path = DATA_DIR / "presentation" / "collaboration.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_api_keys() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_api_keys.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_settings_quotas() -> dict:
        presentation_path = DATA_DIR / "presentation" / "settings_quotas.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_compliance() -> dict:
        presentation_path = DATA_DIR / "presentation" / "compliance.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_incidents() -> dict:
        presentation_path = DATA_DIR / "presentation" / "incidents.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_cicd_pipeline() -> dict:
        presentation_path = DATA_DIR / "presentation" / "cicd_pipeline.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_metrics_custom() -> dict:
        presentation_path = DATA_DIR / "presentation" / "metrics_custom.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_explainability() -> dict:
        presentation_path = DATA_DIR / "presentation" / "explainability.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_anomalies() -> dict:
        presentation_path = DATA_DIR / "presentation" / "anomalies.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_integrations() -> dict:
        presentation_path = DATA_DIR / "presentation" / "integrations.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_search_global() -> dict:
        presentation_path = DATA_DIR / "presentation" / "search_global.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_tests_e2e() -> dict:
        presentation_path = DATA_DIR / "presentation" / "tests_e2e.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def get_reports_executive() -> dict:
        presentation_path = DATA_DIR / "presentation" / "reports_executive.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {}
