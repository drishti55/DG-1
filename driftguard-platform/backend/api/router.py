from fastapi import APIRouter
from dataset.adapter import ResultAdapter

router = APIRouter(prefix="/api")

@router.get("/overview")
def get_overview():
    return {
        "dataset_cases": 154241,
        "repositories": 488,
        "train": 100825,
        "validation": 29267,
        "test": 24149,
        "available_local_models": 4,
        "ast_stats": {
            "python_files": 1138,
            "functions": 6867,
            "classes": 713,
            "methods": 321,
            "imports": 4668,
            "calls": 17056,
            "parse_failures": 0,
            "ast_facts": 31974
        },
        "graph_stats": {
            "nodes": 16444,
            "edges": 51787,
            "resolved_calls": 2412,
            "unresolved_calls": 14644
        }
    }

@router.get("/experiments")
def list_experiments():
    return {"experiments": ResultAdapter.list_experiments()}

@router.get("/experiments/{id}")
def get_experiment(id: str):
    try:
        result = ResultAdapter.get_result(id)
        return result.model_dump()
    except FileNotFoundError as e:
        return {"error": str(e)}

@router.get("/dataset")
def get_dataset():
    return ResultAdapter.get_dataset()

@router.get("/repositories")
def get_repositories():
    return ResultAdapter.get_repositories()

@router.get("/repository/{id}")
def get_repository(id: str):
    try:
        return ResultAdapter.get_repository(id)
    except FileNotFoundError as e:
        return {"error": str(e)}

@router.get("/repository/{id}/ast")
def get_repository_ast(id: str):
    return ResultAdapter.get_ast(id)

@router.get("/repository/{id}/graph")
def get_repository_graph(id: str):
    return ResultAdapter.get_graph(id)

@router.get("/repository/{id}/chunks")
def get_repository_chunks(id: str):
    return ResultAdapter.get_chunks(id)

@router.get("/repository/{id}/embeddings")
def get_repository_embeddings(id: str):
    return ResultAdapter.get_embeddings(id)

@router.get("/retrieval/dense")
def get_dense_retrieval(query: str = "default"):
    return ResultAdapter.get_dense_retrieval(query)

@router.get("/retrieval/bm25")
def get_bm25_retrieval(query: str = "default"):
    return ResultAdapter.get_bm25_retrieval(query)

@router.get("/retrieval/hybrid")
def get_hybrid_retrieval(query: str = "default"):
    return ResultAdapter.get_hybrid_retrieval(query)

@router.get("/rag")
def get_rag(query: str = "default"):
    return ResultAdapter.get_rag(query)

@router.get("/llm/status")
def get_llm_status():
    return ResultAdapter.get_llm_status()

@router.get("/llm/structured")
def get_structured_output():
    return ResultAdapter.get_structured_output()

@router.get("/verification/evidence")
def get_evidence_verification():
    return ResultAdapter.get_evidence_verification()

@router.get("/evaluation/quantitative")
def get_quantitative_evaluation():
    return ResultAdapter.get_quantitative_evaluation()

@router.get("/evaluation/qualitative")
def get_qualitative_evaluation():
    return ResultAdapter.get_qualitative_evaluation()

@router.get("/orchestration/status")
def get_orchestration_status():
    return ResultAdapter.get_orchestration_status()

@router.get("/actionable/outputs")
def get_actionable_outputs():
    return ResultAdapter.get_actionable_outputs()

@router.get("/settings/cicd")
def get_settings_cicd():
    return ResultAdapter.get_settings_cicd()

@router.get("/finetuning/status")
def get_finetuning_status():
    return ResultAdapter.get_finetuning_status()

@router.get("/settings/rbac")
def get_settings_rbac():
    return ResultAdapter.get_settings_rbac()

@router.get("/settings/audit")
def get_settings_audit():
    return ResultAdapter.get_settings_audit()

@router.get("/registry/models")
def get_registry_models():
    return ResultAdapter.get_registry_models()

@router.get("/settings/secrets")
def get_settings_secrets():
    return ResultAdapter.get_settings_secrets()

@router.get("/settings/billing")
def get_settings_billing():
    return ResultAdapter.get_settings_billing()

@router.get("/settings/webhooks")
def get_settings_webhooks():
    return ResultAdapter.get_settings_webhooks()

@router.get("/settings/export")
def get_settings_export():
    return ResultAdapter.get_settings_export()

@router.get("/system/logs")
def get_system_logs():
    return ResultAdapter.get_system_logs()

@router.get("/system/health")
def get_system_health():
    return ResultAdapter.get_system_health()

@router.get("/search")
def get_search_results(q: str = None, severity: str = None, min_confidence: float = None):
    # In a real system, we'd filter the data here based on query params.
    # For now, we return the mock representation of a filtered response.
    return ResultAdapter.get_search_results()

@router.get("/testing/ab")
def get_testing_ab():
    return ResultAdapter.get_testing_ab()

@router.get("/resolution")
def get_resolution():
    return ResultAdapter.get_resolution()

@router.get("/pr-reviewer")
def get_pr_reviewer():
    return ResultAdapter.get_pr_reviewer()

@router.get("/chunking/multimodal")
def get_chunking_multimodal():
    return ResultAdapter.get_chunking_multimodal()

@router.get("/prompts")
def get_prompts():
    return ResultAdapter.get_prompts()

@router.get("/graph/v2")
def get_graph_v2():
    return ResultAdapter.get_graph_v2()

@router.get("/settings/config")
def get_settings_config():
    return ResultAdapter.get_settings_config()

@router.get("/notifications")
def get_notifications():
    return ResultAdapter.get_notifications()

@router.get("/collaboration")
def get_collaboration():
    return ResultAdapter.get_collaboration()

@router.get("/settings/api-keys")
def get_settings_api_keys():
    return ResultAdapter.get_settings_api_keys()

@router.get("/settings/quotas")
def get_settings_quotas():
    return ResultAdapter.get_settings_quotas()

@router.get("/compliance")
def get_compliance():
    return ResultAdapter.get_compliance()

@router.get("/incidents")
def get_incidents():
    return ResultAdapter.get_incidents()

@router.get("/cicd/pipeline")
def get_cicd_pipeline():
    return ResultAdapter.get_cicd_pipeline()

@router.get("/metrics/custom")
def get_metrics_custom():
    return ResultAdapter.get_metrics_custom()

@router.get("/explainability")
def get_explainability():
    return ResultAdapter.get_explainability()

@router.get("/anomalies")
def get_anomalies():
    return ResultAdapter.get_anomalies()

@router.get("/integrations")
def get_integrations():
    return ResultAdapter.get_integrations()

@router.get("/search/global")
def get_search_global():
    return ResultAdapter.get_search_global()

@router.get("/tests/e2e")
def get_tests_e2e():
    return ResultAdapter.get_tests_e2e()

@router.get("/reports/executive")
def get_reports_executive():
    return ResultAdapter.get_reports_executive()
