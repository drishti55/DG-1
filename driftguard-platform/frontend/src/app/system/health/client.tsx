"use client";

import { useEffect, useState } from "react";
import { Activity, Server, Cpu, HardDrive, Database, Network, Clock, CheckCircle2, AlertOctagon, HeartPulse, RefreshCw } from "lucide-react";

interface ServiceHealth {
  id: string;
  name: string;
  type: string;
  status: string;
  latency_ms: number;
  uptime: string;
}

interface HealthData {
  overall_status: string;
  uptime: string;
  active_incidents: number;
  metrics: {
    cpu_usage_percent: number;
    ram_usage_gb: number;
    ram_total_gb: number;
    db_connections: number;
    db_max_connections: number;
  };
  services: ServiceHealth[];
}

export function SystemHealthClient() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: HealthData = {
      "overall_status": "HEALTHY",
      "uptime": "99.99%",
      "active_incidents": 0,
      "metrics": {
        "cpu_usage_percent": 34,
        "ram_usage_gb": 12.4,
        "ram_total_gb": 32.0,
        "db_connections": 142,
        "db_max_connections": 500
      },
      "services": [
        {"id": "svc_web", "name": "Frontend Application", "status": "UP", "latency_ms": 45, "uptime": "30d 14h", "type": "Node.js"},
        {"id": "svc_api", "name": "FastAPI Orchestrator", "status": "UP", "latency_ms": 112, "uptime": "30d 14h", "type": "Python"},
        {"id": "svc_db", "name": "PostgreSQL Primary DB", "status": "UP", "latency_ms": 12, "uptime": "142d 9h", "type": "Database"},
        {"id": "svc_vec", "name": "FAISS Vector Cluster", "status": "UP", "latency_ms": 85, "uptime": "30d 14h", "type": "MemoryDB"},
        {"id": "svc_llm", "name": "Local LLM GPU Node", "status": "DEGRADED", "latency_ms": 1450, "uptime": "2d 4h", "type": "Compute"}
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
           <HeartPulse className="w-5 h-5 animate-spin" />
           <span>Probing Microservices...</span>
         </div>
      </div>
    );
  }

  const ramPercentage = data ? Math.round((data.metrics.ram_usage_gb / data.metrics.ram_total_gb) * 100) : 0;
  const dbPercentage = data ? Math.round((data.metrics.db_connections / data.metrics.db_max_connections) * 100) : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground mt-2">
            Real-time observability into cluster utilization, uptime, and microservice latencies.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Clock className="w-4 h-4 text-green-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Global Uptime</p>
                 <p className="text-sm font-bold font-mono text-foreground">{data?.uptime}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Cluster Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="rounded-xl border border-border bg-black/40 p-5 flex flex-col shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
               <Cpu className="w-4 h-4 text-blue-400" /> CPU Utilization
            </div>
            <div className="flex items-end gap-2 mb-2">
               <span className="text-3xl font-bold font-mono">{data?.metrics.cpu_usage_percent}%</span>
               <span className="text-xs text-muted-foreground mb-1">Average Load</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-auto">
               <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${data?.metrics.cpu_usage_percent}%` }}></div>
            </div>
         </div>

         <div className="rounded-xl border border-border bg-black/40 p-5 flex flex-col shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
               <HardDrive className="w-4 h-4 text-purple-400" /> Memory (RAM)
            </div>
            <div className="flex items-end gap-2 mb-2">
               <span className="text-3xl font-bold font-mono">{data?.metrics.ram_usage_gb.toFixed(1)}</span>
               <span className="text-xs text-muted-foreground mb-1">GB / {data?.metrics.ram_total_gb.toFixed(1)} GB</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-auto">
               <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${ramPercentage}%` }}></div>
            </div>
         </div>

         <div className="rounded-xl border border-border bg-black/40 p-5 flex flex-col shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
               <Database className="w-4 h-4 text-orange-400" /> DB Connection Pool
            </div>
            <div className="flex items-end gap-2 mb-2">
               <span className="text-3xl font-bold font-mono">{data?.metrics.db_connections}</span>
               <span className="text-xs text-muted-foreground mb-1">Active / {data?.metrics.db_max_connections} Max</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-auto">
               <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${dbPercentage}%` }}></div>
            </div>
         </div>
      </div>

      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm flex-1">
         <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
               <Network className="w-4 h-4 text-primary" /> Microservices Status
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
               <RefreshCw className="w-3 h-3" /> Refresh
            </button>
         </div>
         
         <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 gap-3">
               {data?.services.map(svc => (
                 <div key={svc.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${svc.status === 'UP' ? 'bg-secondary/10 border-border hover:bg-secondary/30' : 'bg-red-500/5 border-red-500/30'}`}>
                    
                    <div className="flex items-center gap-4 min-w-[300px]">
                       <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                          <Server className="w-5 h-5 text-muted-foreground" />
                       </div>
                       <div>
                          <p className="font-bold text-sm">{svc.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{svc.type} • ID: {svc.id}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                       <div className="text-right w-24">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Latency</p>
                          <p className={`text-sm font-bold font-mono ${svc.latency_ms > 1000 ? 'text-red-400' : 'text-foreground'}`}>{svc.latency_ms}ms</p>
                       </div>
                       
                       <div className="text-right w-24 hidden md:block">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Uptime</p>
                          <p className="text-sm font-mono text-muted-foreground">{svc.uptime}</p>
                       </div>
                       
                       <div className="w-28 flex justify-end">
                          {svc.status === 'UP' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                              <CheckCircle2 className="w-3 h-3" /> UP
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 animate-pulse">
                              <AlertOctagon className="w-3 h-3" /> DEGRADED
                            </span>
                          )}
                       </div>
                    </div>
                    
                 </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}
