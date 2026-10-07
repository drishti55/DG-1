import os
import json

PHASES = [
    {"name": "testing_ab", "route": "testing/ab", "title": "Model A/B Testing"},
    {"name": "resolution", "route": "resolution", "title": "Drift Resolution"},
    {"name": "pr_reviewer", "route": "pr-reviewer", "title": "PR Reviewer"},
    {"name": "chunking_multimodal", "route": "chunking/multimodal", "title": "Multi-Modal Chunking"},
    {"name": "prompts", "route": "prompts", "title": "Prompt Engineering Lab"},
    {"name": "graph_v2", "route": "graph/v2", "title": "Knowledge Graph V2"},
    {"name": "settings_config", "route": "settings/config", "title": "Config Management"},
    {"name": "notifications", "route": "notifications", "title": "Notification Center"},
    {"name": "collaboration", "route": "collaboration", "title": "Team Collaboration"},
    {"name": "settings_api_keys", "route": "settings/api-keys", "title": "API Keys"},
    {"name": "settings_quotas", "route": "settings/quotas", "title": "Usage Quotas"},
    {"name": "compliance", "route": "compliance", "title": "Compliance & GDPR"},
    {"name": "incidents", "route": "incidents", "title": "Incident Response"},
    {"name": "cicd_pipeline", "route": "cicd/pipeline", "title": "Pipeline Visualizer"},
    {"name": "metrics_custom", "route": "metrics/custom", "title": "Custom Metrics"},
    {"name": "explainability", "route": "explainability", "title": "Model Explainability"},
    {"name": "anomalies", "route": "anomalies", "title": "Anomaly Detection"},
    {"name": "integrations", "route": "integrations", "title": "Integration Store"},
    {"name": "search_global", "route": "search/global", "title": "Global Search"},
    {"name": "tests_e2e", "route": "tests/e2e", "title": "E2E Test Runner"},
    {"name": "reports_executive", "route": "reports/executive", "title": "Executive Report"}
]

FRONTEND_DIR = "/Users/drishti/Library/Mobile Documents/com~apple~CloudDocs/Projects/DG-1/driftguard-platform/frontend"
BACKEND_DIR = "/Users/drishti/Library/Mobile Documents/com~apple~CloudDocs/Projects/DG-1/driftguard-platform/backend"
DATA_DIR = "/Users/drishti/Library/Mobile Documents/com~apple~CloudDocs/Projects/DG-1/driftguard-platform/data/presentation"

adapter_additions = []
router_additions = []

for phase in PHASES:
    name = phase["name"]
    route = phase["route"]
    title = phase["title"]

    # 1. Mock Data
    mock_data = {"status": "Mock data for " + title, "items": [{"id": 1, "value": "Test 1"}, {"id": 2, "value": "Test 2"}]}
    with open(f"{DATA_DIR}/{name}.json", "w") as f:
        json.dump(mock_data, f, indent=2)

    # 2. Adapter & Router additions
    adapter_additions.append(f"""
    @staticmethod
    def get_{name}() -> dict:
        presentation_path = DATA_DIR / "presentation" / "{name}.json"
        if presentation_path.exists():
            with open(presentation_path, "r") as f:
                return json.load(f)
        return {{}}
""")
    router_additions.append(f"""
@router.get("/{route}")
def get_{name}():
    return ResultAdapter.get_{name}()
""")

    # 3. Frontend Pages
    os.makedirs(f"{FRONTEND_DIR}/src/app/{route}", exist_ok=True)
    
    comp_name = "".join(c for c in title.title() if c.isalnum())
    
    page_tsx = f"""import {{ Suspense }} from "react";
import {{ {comp_name}Client }} from "./client";

export default function {comp_name}Page() {{
  return (
    <Suspense fallback={{<div className="p-8">Loading {title}...</div>}}>
      <{comp_name}Client />
    </Suspense>
  );
}}
"""
    with open(f"{FRONTEND_DIR}/src/app/{route}/page.tsx", "w") as f:
        f.write(page_tsx)
        
    client_tsx = f""""use client";

import {{ useEffect, useState }} from "react";
import {{ Activity, Layers }} from "lucide-react";

export function {comp_name}Client() {{
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {{
    setTimeout(() => {{
      setData({{ loaded: true }});
    }}, 500);
  }}, []);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-muted-foreground">Module activated and awaiting data streams.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-muted-foreground h-64 shadow-sm border-dashed">
            <Activity className="w-8 h-8 mb-4 text-primary opacity-50" />
            <p>Awaiting primary telemetry for {title}...</p>
         </div>
         <div className="p-8 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-muted-foreground h-64 shadow-sm border-dashed">
            <Layers className="w-8 h-8 mb-4 text-blue-400 opacity-50" />
            <p>System endpoints provisioned.</p>
         </div>
      </div>
    </div>
  );
}}
"""
    with open(f"{FRONTEND_DIR}/src/app/{route}/client.tsx", "w") as f:
        f.write(client_tsx)

# Append to adapter.py
with open(f"{BACKEND_DIR}/dataset/adapter.py", "a") as f:
    f.write("".join(adapter_additions))

# Append to router.py
with open(f"{BACKEND_DIR}/api/router.py", "a") as f:
    f.write("".join(router_additions))

print("Scaffold complete.")
