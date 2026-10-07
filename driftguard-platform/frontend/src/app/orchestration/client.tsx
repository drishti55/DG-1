"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Code2, SplitSquareHorizontal, Network, Search, Wand2, ShieldCheck, FileJson2, Play, CheckCircle2, CircleDashed, Cpu, Server } from "lucide-react";

interface PipelineStage {
  id: number;
  name: string;
  status: string;
  duration_ms: number;
  icon: string;
}

interface OrchestrationData {
  system_status: string;
  active_dataset: string;
  pipeline_stages: PipelineStage[];
  last_run: string;
  memory_usage_gb: number;
}

export function OrchestrationClient() {
  const [data, setData] = useState<OrchestrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: OrchestrationData = {
      "system_status": "ONLINE",
      "active_dataset": "tiangolo-fastapi",
      "pipeline_stages": [
        { "id": 1, "name": "Source Ingestion", "status": "COMPLETED", "duration_ms": 1240, "icon": "Database" },
        { "id": 2, "name": "AST Extraction", "status": "COMPLETED", "duration_ms": 4510, "icon": "Code2" },
        { "id": 3, "name": "Semantic Chunking", "status": "COMPLETED", "duration_ms": 850, "icon": "SplitSquareHorizontal" },
        { "id": 4, "name": "Vector Embeddings", "status": "COMPLETED", "duration_ms": 12400, "icon": "Activity" },
        { "id": 5, "name": "Graph Construction", "status": "COMPLETED", "duration_ms": 3200, "icon": "Network" },
        { "id": 6, "name": "Hybrid Retrieval", "status": "IDLE", "duration_ms": 0, "icon": "Search" },
        { "id": 7, "name": "RAG Synthesis", "status": "IDLE", "duration_ms": 0, "icon": "Wand2" },
        { "id": 8, "name": "Evidence Verification", "status": "IDLE", "duration_ms": 0, "icon": "ShieldCheck" },
        { "id": 9, "name": "Structured Validation", "status": "IDLE", "duration_ms": 0, "icon": "FileJson2" }
      ],
      "last_run": "2026-10-07T06:15:00Z",
      "memory_usage_gb": 4.2
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Database": return <Database className={className} />;
      case "Code2": return <Code2 className={className} />;
      case "SplitSquareHorizontal": return <SplitSquareHorizontal className={className} />;
      case "Activity": return <Activity className={className} />;
      case "Network": return <Network className={className} />;
      case "Search": return <Search className={className} />;
      case "Wand2": return <Wand2 className={className} />;
      case "ShieldCheck": return <ShieldCheck className={className} />;
      case "FileJson2": return <FileJson2 className={className} />;
      default: return <Activity className={className} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
         <div className="flex items-center gap-2 text-primary animate-pulse">
           <Server className="w-5 h-5 animate-spin" />
           <span>Connecting to Orchestrator Node...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">End-to-End Orchestration</h1>
          <p className="text-muted-foreground mt-2">
            Master control node for the unified DriftGuard data pipeline.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cluster Status</p>
                 <p className="text-sm font-bold font-mono text-green-400">{data?.system_status}</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Play className="w-4 h-4 fill-current" /> Initialize Pipeline Run
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
           <div className="p-3 bg-secondary rounded-lg border border-border">
             <Database className="w-5 h-5 text-primary" />
           </div>
           <div>
             <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active Dataset</p>
             <p className="text-lg font-black font-mono">{data?.active_dataset}</p>
           </div>
        </div>
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
           <div className="p-3 bg-secondary rounded-lg border border-border">
             <Cpu className="w-5 h-5 text-purple-400" />
           </div>
           <div>
             <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pipeline Memory</p>
             <p className="text-lg font-black font-mono">{data?.memory_usage_gb} GB</p>
           </div>
        </div>
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex items-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
           <div className="p-3 bg-secondary rounded-lg border border-border">
             <Activity className="w-5 h-5 text-blue-400" />
           </div>
           <div>
             <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Runtime (Phase 1-5)</p>
             <p className="text-lg font-black font-mono">
                {((data?.pipeline_stages.reduce((acc, s) => acc + s.duration_ms, 0) || 0) / 1000).toFixed(2)}s
             </p>
           </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
         <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
           <h2 className="text-lg font-bold flex items-center gap-2">
             <Network className="w-5 h-5 text-primary" /> Execution Topology
           </h2>
         </div>
         
         <div className="relative overflow-x-auto pb-4">
            {/* Connecting Line */}
            <div className="absolute top-[4.5rem] left-8 right-8 h-1 bg-secondary -translate-y-1/2 z-0 hidden md:block"></div>
            
            <div className="flex md:grid md:grid-cols-9 gap-4 relative z-10 min-w-max md:min-w-0 px-4 md:px-0">
               {data?.pipeline_stages.map((stage, index) => (
                 <div key={stage.id} className="flex flex-col items-center group w-24 md:w-auto">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 h-8 text-center flex items-end justify-center group-hover:text-primary transition-colors">
                      {stage.name}
                    </div>
                    
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg shrink-0 ${
                      stage.status === 'COMPLETED' 
                        ? 'bg-secondary border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                        : 'bg-background border-border text-muted-foreground'
                    }`}>
                       {getIcon(stage.icon, "w-6 h-6")}
                    </div>
                    
                    <div className="mt-4 flex flex-col items-center">
                       {stage.status === 'COMPLETED' ? (
                         <>
                           <CheckCircle2 className="w-4 h-4 text-green-400 mb-1" />
                           <span className="font-mono text-[10px] text-muted-foreground">{stage.duration_ms}ms</span>
                         </>
                       ) : (
                         <>
                           <CircleDashed className="w-4 h-4 text-muted-foreground opacity-50 mb-1" />
                           <span className="font-mono text-[10px] text-muted-foreground opacity-0">0ms</span>
                         </>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}
