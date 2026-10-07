"use client";

import { useEffect, useState } from "react";
import { Cpu, Server, Activity, Database, Zap, Lock, Settings, RefreshCw, Power, Play } from "lucide-react";

interface LlmModel {
  name: string;
  size: string;
  arch: string;
}

interface LlmStatus {
  provider: string;
  endpoint: string;
  gpu_memory: {
    total: string;
    used: string;
    utilization: number;
  };
  active_model: {
    name: string;
    parameters: string;
    quantization: string;
    context_window: number;
    temperature: number;
  } | null;
  available_models: LlmModel[];
}

export function InferenceClient() {
  const [status, setStatus] = useState<LlmStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = () => {
    setRefreshing(true);
    // Mock the backend fetch
    const mockData: LlmStatus = {
      "provider": "Ollama / Llama.cpp",
      "endpoint": "http://localhost:11434",
      "gpu_memory": {
        "total": "16.0 GB",
        "used": "6.2 GB",
        "utilization": 38
      },
      "active_model": {
        "name": "llama-3-8b-instruct-q4_K_M",
        "parameters": "8.0B",
        "quantization": "4-bit (GGUF)",
        "context_window": 8192,
        "temperature": 0.1
      },
      "available_models": [
        {
          "name": "llama-3-8b-instruct-q4_K_M",
          "size": "4.7 GB",
          "arch": "llama"
        },
        {
          "name": "mistral-7b-instruct-v0.2-q4_0",
          "size": "4.1 GB",
          "arch": "mistral"
        },
        {
          "name": "phi-3-mini-4k-instruct-q4",
          "size": "2.3 GB",
          "arch": "phi3"
        },
        {
          "name": "gemma-2-9b-it-q5_K_M",
          "size": "6.6 GB",
          "arch": "gemma2"
        }
      ]
    };

    setTimeout(() => {
      setStatus(mockData);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
         <div className="flex items-center gap-2 text-primary animate-pulse">
           <Cpu className="w-5 h-5 animate-spin" />
           <span>Connecting to Inference Engine...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Inference Server</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Connected to <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{status?.provider}</span>
          </p>
        </div>
        
        <button 
          onClick={fetchStatus}
          disabled={refreshing}
          className="px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg border border-border transition-colors flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* GPU Memory Card */}
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 text-sm font-medium text-purple-400 mb-4">
             <Activity className="w-4 h-4" /> VRAM Allocation (M2 Max)
           </div>
           
           <div className="flex justify-between items-end mb-2">
             <div className="text-3xl font-black">{status?.gpu_memory.used}</div>
             <div className="text-muted-foreground text-sm font-mono mb-1">/ {status?.gpu_memory.total}</div>
           </div>

           <div className="w-full h-3 bg-secondary/50 rounded-full overflow-hidden border border-border mt-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-primary transition-all duration-1000"
                style={{ width: `${status?.gpu_memory.utilization}%` }}
              ></div>
           </div>
           
           <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <span>System / OS</span>
              <span>Model Weights & KV Cache</span>
           </div>
        </div>

        {/* Endpoint Card */}
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm justify-between">
           <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-4">
             <Server className="w-4 h-4" /> Endpoint Status
           </div>
           <div>
             <div className="font-mono text-lg font-bold truncate bg-secondary/30 p-2 rounded border border-border text-foreground/80 mb-3">
               {status?.endpoint}/v1
             </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                 <Zap className="w-3.5 h-3.5 text-yellow-400" /> API Active
               </div>
               <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                 <Lock className="w-3.5 h-3.5 text-green-400" /> Localhost Only
               </div>
             </div>
           </div>
        </div>

        {/* Active Model Config */}
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm relative overflow-hidden">
           <div className="absolute -right-4 -top-4 opacity-5">
             <Cpu className="w-32 h-32" />
           </div>
           <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4 relative z-10">
             <Settings className="w-4 h-4" /> Inference Configuration
           </div>
           
           {status?.active_model ? (
              <div className="space-y-3 relative z-10">
                 <div className="flex justify-between items-center text-xs border-b border-border pb-2">
                   <span className="text-muted-foreground uppercase tracking-wider font-semibold">Quantization</span>
                   <span className="font-mono text-primary bg-primary/10 px-1.5 rounded">{status.active_model.quantization}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs border-b border-border pb-2">
                   <span className="text-muted-foreground uppercase tracking-wider font-semibold">Context Window</span>
                   <span className="font-mono">{status.active_model.context_window} tokens</span>
                 </div>
                 <div className="flex justify-between items-center text-xs pb-1">
                   <span className="text-muted-foreground uppercase tracking-wider font-semibold">Temperature</span>
                   <span className="font-mono">{status.active_model.temperature}</span>
                 </div>
              </div>
           ) : (
             <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic">
               No model currently loaded in memory.
             </div>
           )}
        </div>

      </div>

      {/* Models List */}
      <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-400" /> Model Registry
          </div>
          <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
            {status?.available_models.length} Cached Weights
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-background/20">
           <div className="space-y-3">
             {status?.available_models.map((model) => {
               const isActive = status.active_model?.name === model.name;
               
               return (
                 <div 
                   key={model.name} 
                   className={`flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${isActive ? 'bg-primary/5 border-primary/40' : 'bg-secondary/10 border-border hover:border-border/80'}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isActive ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-secondary/50 border-border text-muted-foreground'}`}>
                       <Cpu className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="font-mono font-bold flex items-center gap-2">
                         {model.name}
                         {isActive && (
                           <span className="text-[9px] uppercase tracking-wider bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                             In Memory
                           </span>
                         )}
                       </div>
                       <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 font-mono">
                         <span>{model.size}</span>
                         <span className="text-muted-foreground/30">•</span>
                         <span className="uppercase tracking-wider">{model.arch}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                     <button 
                       className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20' : 'bg-secondary hover:bg-secondary/80 text-foreground'}`}
                     >
                       {isActive ? (
                         <><Power className="w-3.5 h-3.5" /> Unload</>
                       ) : (
                         <><Play className="w-3.5 h-3.5" /> Load into VRAM</>
                       )}
                     </button>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

    </div>
  );
}
