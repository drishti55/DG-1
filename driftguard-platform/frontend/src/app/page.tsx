import { Activity, Database, Server, GitMerge } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          DriftGuard detects semantic inconsistencies between related artifacts inside software repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Dataset Cases", value: "154,241", icon: Database },
          { title: "Repositories", value: "488", icon: GitMerge },
          { title: "Test Cases", value: "24,149", icon: Activity },
          { title: "Local Models", value: "4", icon: Server },
        ].map((stat) => (
          <div key={stat.title} className="p-6 rounded-xl border border-border bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-black/40 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-4">Research Question</h3>
          <p className="text-muted-foreground leading-relaxed">
            "How effectively can LLM-based reasoning, with and without retrieval-augmented generation (RAG), detect cross-artifact inconsistencies in software repositories, and how do model choice and retrieval configuration affect detection accuracy, evidence quality, and computational cost?"
          </p>
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-black/40 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-4">Latest Research Findings</h3>
          <ul className="space-y-3 text-muted-foreground list-disc list-inside">
            <li>BM25 (Recall@10 = 10.4%) outperformed dense (1.6%) and hybrid (3.2%) retrieval in the benchmark.</li>
            <li>Hybrid did not automatically outperform BM25.</li>
            <li>Structured-output success reached 100% across 116 evaluations (Phase 6C-R).</li>
            <li>Exact evidence extraction remains a critical bottleneck.</li>
            <li>Structural retrieval experiment rejected due to identified leakage.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
