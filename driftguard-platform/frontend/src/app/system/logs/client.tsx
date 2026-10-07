"use client";

import { useEffect, useState, useRef } from "react";
import { TerminalSquare, Activity, Pause, Play, Download, Search, Settings2, Trash2 } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

interface LogsData {
  status: string;
  logs: LogEntry[];
}

export function SystemLogsClient() {
  const [data, setData] = useState<LogsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock backend fetch
    const mockData: LogsData = {
      "status": "STREAMING",
      "logs": [
        {"id": 1, "timestamp": "2026-10-07T06:30:10.123Z", "level": "INFO", "service": "uvicorn", "message": "Application startup complete. Listening on http://0.0.0.0:8000"},
        {"id": 2, "timestamp": "2026-10-07T06:30:12.450Z", "level": "DEBUG", "service": "vector_store", "message": "Initialized FAISS index with 5,240 vectors (L2 distance)."},
        {"id": 3, "timestamp": "2026-10-07T06:30:15.002Z", "level": "INFO", "service": "rag_pipeline", "message": "Received query: [Drift Check] Validate FastAPI router definitions against docs."},
        {"id": 4, "timestamp": "2026-10-07T06:30:15.250Z", "level": "DEBUG", "service": "retriever", "message": "BM25 score: 0.82 | Dense score: 0.91 -> Hybrid score: 0.88"},
        {"id": 5, "timestamp": "2026-10-07T06:30:16.880Z", "level": "WARNING", "service": "llm_adapter", "message": "Latency spike detected in Llama-3 inference (850ms). GPU temp: 82C."},
        {"id": 6, "timestamp": "2026-10-07T06:30:17.100Z", "level": "INFO", "service": "orchestrator", "message": "Evaluation completed. Drift Severity: MODERATE. Generating Actionable PR..."},
        {"id": 7, "timestamp": "2026-10-07T06:30:18.110Z", "level": "ERROR", "service": "github_webhook", "message": "Connection timeout when pushing actionable PR (Event ID: wh_002). Retrying in 5s..."},
        {"id": 8, "timestamp": "2026-10-07T06:30:23.110Z", "level": "INFO", "service": "github_webhook", "message": "Retry successful. PR #442 generated."}
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data, isPaused]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
         <div className="flex items-center gap-2 text-primary animate-pulse">
           <TerminalSquare className="w-5 h-5 animate-spin" />
           <span>Connecting to stdout stream...</span>
         </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'INFO': return 'text-blue-400';
      case 'WARNING': return 'text-yellow-400';
      case 'ERROR': return 'text-red-400 font-bold bg-red-500/10 px-1 rounded';
      case 'DEBUG': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground mt-2">
            Real-time streaming console for FastAPI and background worker telemetry.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 flex items-center gap-3 shadow-sm">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-primary">Connection</p>
                 <p className="text-sm font-bold font-mono text-primary">{data?.status}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-border bg-[#0a0a0a] shadow-sm flex flex-col overflow-hidden">
         {/* Terminal Toolbar */}
         <div className="px-4 py-2 border-b border-border bg-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
               <TerminalSquare className="w-4 h-4" /> root@driftguard-core:~
            </div>
            
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="grep..." 
                    className="w-48 bg-background border border-border rounded text-xs pl-8 pr-3 py-1 focus:outline-none focus:border-primary transition-colors font-mono"
                  />
               </div>
               <div className="w-px h-4 bg-border mx-2"></div>
               <button 
                 onClick={() => setIsPaused(!isPaused)} 
                 className={`p-1.5 rounded transition-colors ${isPaused ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                 title={isPaused ? "Resume stream" : "Pause stream"}
               >
                 {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
               </button>
               <button className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded transition-colors" title="Settings">
                 <Settings2 className="w-3.5 h-3.5" />
               </button>
               <button className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-red-400 rounded transition-colors" title="Clear console">
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
               <button className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded transition-colors" title="Export logs">
                 <Download className="w-3.5 h-3.5" />
               </button>
            </div>
         </div>
         
         {/* Terminal Output */}
         <div 
           ref={scrollRef}
           className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed tracking-tight"
         >
            {data?.logs.map((log) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded group transition-colors">
                 <span className="text-muted-foreground shrink-0 select-none">
                   {log.timestamp.split('T')[1].replace('Z', '')}
                 </span>
                 <span className={`w-16 shrink-0 font-bold ${getLevelColor(log.level)}`}>
                   [{log.level}]
                 </span>
                 <span className="text-purple-400/80 shrink-0 w-32 truncate" title={log.service}>
                   {log.service}
                 </span>
                 <span className={`${log.level === 'ERROR' ? 'text-red-400 font-medium' : 'text-foreground/90'} break-all`}>
                   {log.message}
                 </span>
              </div>
            ))}
            {!isPaused && (
              <div className="px-2 py-1 flex items-center gap-2 text-muted-foreground">
                 <span className="animate-pulse">_</span>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}
