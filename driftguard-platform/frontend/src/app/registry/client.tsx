"use client";

import { useEffect, useState } from "react";
import { Box, Cpu, Download, Cloud, Activity, CheckCircle2, CircleDashed, Tag, SlidersHorizontal } from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  quantization: string;
  context_window: number;
  vram_required_gb: number;
  status: string;
  avg_latency_ms: number;
  tags: string[];
}

interface RegistryData {
  active_model: string;
  total_vram_allocated_gb: number;
  models: ModelInfo[];
}

export function RegistryClient() {
  const [data, setData] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: RegistryData = {
      "active_model": "llama-3-8b-instruct-q4_k_m",
      "total_vram_allocated_gb": 6.2,
      "models": [
        {
          "id": "llama-3-8b-instruct-q4_k_m",
          "name": "Llama 3 (8B) Instruct",
          "provider": "Local (Ollama / GGML)",
          "quantization": "Q4_K_M",
          "context_window": 8192,
          "vram_required_gb": 6.2,
          "status": "ACTIVE",
          "avg_latency_ms": 124,
          "tags": ["Primary", "Instruction Tuned"]
        },
        {
          "id": "mistral-7b-v0.2-awq",
          "name": "Mistral v0.2 (7B)",
          "provider": "Local (vLLM Engine)",
          "quantization": "AWQ 4-bit",
          "context_window": 32768,
          "vram_required_gb": 5.1,
          "status": "STANDBY",
          "avg_latency_ms": 95,
          "tags": ["High Context", "Fast Inference"]
        },
        {
          "id": "gpt-4o-2024-05-13",
          "name": "GPT-4o",
          "provider": "Cloud (OpenAI API)",
          "quantization": "FP16 (Native)",
          "context_window": 128000,
          "vram_required_gb": 0.0,
          "status": "API_READY",
          "avg_latency_ms": 450,
          "tags": ["Cloud", "Fallback", "State-of-the-Art"]
        },
        {
          "id": "claude-3-5-sonnet",
          "name": "Claude 3.5 Sonnet",
          "provider": "Cloud (Anthropic)",
          "quantization": "FP16 (Native)",
          "context_window": 200000,
          "vram_required_gb": 0.0,
          "status": "API_READY",
          "avg_latency_ms": 380,
          "tags": ["Cloud", "Coding Expert"]
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
         <div className="flex items-center gap-2 text-primary animate-pulse">
           <Box className="w-5 h-5 animate-spin" />
           <span>Loading Foundation Models...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Registry</h1>
          <p className="text-muted-foreground mt-2">
            Manage local weights and cloud foundation models for inference and evaluation.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center gap-3 shadow-sm">
              <Cpu className="w-4 h-4 text-purple-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Total VRAM Allocated</p>
                 <p className="text-sm font-bold font-mono text-purple-400">{data?.total_vram_allocated_gb} GB</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Download className="w-4 h-4" /> Pull New Model
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {data?.models.map(model => (
           <div key={model.id} className={`rounded-xl border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm relative overflow-hidden transition-all hover:border-primary/50 ${model.status === 'ACTIVE' ? 'border-primary shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'border-border'}`}>
              
              {model.status === 'ACTIVE' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              )}

              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                      {model.name}
                      {model.provider.includes("Cloud") ? (
                        <Cloud className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Cpu className="w-4 h-4 text-orange-400" />
                      )}
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">{model.id}</p>
                 </div>
                 
                 <div>
                   {model.status === "ACTIVE" && (
                     <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> ACTIVE
                     </span>
                   )}
                   {model.status === "STANDBY" && (
                     <span className="px-3 py-1 bg-secondary text-foreground border border-border rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <CircleDashed className="w-3 h-3" /> STANDBY
                     </span>
                   )}
                   {model.status === "API_READY" && (
                     <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <Cloud className="w-3 h-3" /> API READY
                     </span>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Provider Engine</p>
                    <p className="text-sm font-semibold">{model.provider}</p>
                 </div>
                 <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Quantization</p>
                    <p className="text-sm font-semibold font-mono">{model.quantization}</p>
                 </div>
                 <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Context Window</p>
                    <p className="text-sm font-semibold font-mono">{model.context_window.toLocaleString()} tkns</p>
                 </div>
                 <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Est. VRAM</p>
                    <p className="text-sm font-semibold font-mono text-purple-400">{model.vram_required_gb.toFixed(1)} GB</p>
                 </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                 <div className="flex gap-2">
                    {model.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold bg-secondary px-2 py-1 rounded text-muted-foreground border border-border">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Avg Latency</p>
                       <p className="text-sm font-bold font-mono text-green-400">{model.avg_latency_ms}ms</p>
                    </div>
                    {model.status !== 'ACTIVE' && (
                      <button className="p-2 bg-secondary hover:bg-primary/20 hover:text-primary rounded-lg border border-border transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    )}
                 </div>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
}
