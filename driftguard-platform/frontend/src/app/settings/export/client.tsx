"use client";

import { useEffect, useState } from "react";
import { Download, Database, HardDrive, Archive, FileJson, Copy, CheckCircle2, Loader2, CloudUpload } from "lucide-react";

interface ExportArtifact {
  id: string;
  name: string;
  format: string;
  size_mb: number;
  description: string;
  status: string;
}

interface ExportData {
  total_export_size_mb: number;
  last_full_backup: string;
  export_artifacts: ExportArtifact[];
}

export function ExportSettingsClient() {
  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: ExportData = {
      "total_export_size_mb": 142.5,
      "last_full_backup": "2026-10-06T12:00:00Z",
      "export_artifacts": [
        {
          "id": "exp_datasets_raw",
          "name": "Raw Chunked Datasets",
          "format": "JSONL",
          "size_mb": 45.2,
          "description": "Raw code and documentation chunks extracted from source control.",
          "status": "READY"
        },
        {
          "id": "exp_embeddings",
          "name": "Vector Embeddings",
          "format": "Parquet",
          "size_mb": 85.0,
          "description": "Dense and Sparse vector embeddings generated from AST chunks.",
          "status": "READY"
        },
        {
          "id": "exp_eval_reports",
          "name": "Evaluation & Drift Reports",
          "format": "JSON",
          "size_mb": 12.3,
          "description": "Historical precision/recall metrics and qualitative AI vs Human drift analyses.",
          "status": "GENERATING"
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
           <Database className="w-5 h-5 animate-spin" />
           <span>Loading Storage Volumes...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Portability</h1>
          <p className="text-muted-foreground mt-2">
            Export raw datasets, high-dimensional vector embeddings, and evaluation reports.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Volume Size</p>
                 <p className="text-sm font-bold font-mono text-foreground">{data?.total_export_size_mb} MB</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Archive className="w-4 h-4" /> Download Full Archive
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         {data?.export_artifacts.map(artifact => (
           <div key={artifact.id} className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm relative overflow-hidden transition-all hover:border-primary/30">
              
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                    {artifact.format === 'JSONL' || artifact.format === 'JSON' ? <FileJson className="w-5 h-5 text-blue-400" /> : <Database className="w-5 h-5 text-green-400" />}
                 </div>
                 
                 <div>
                   {artifact.status === "READY" ? (
                     <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> READY
                     </span>
                   ) : (
                     <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <Loader2 className="w-3 h-3 animate-spin" /> GENERATING
                     </span>
                   )}
                 </div>
              </div>

              <div>
                 <h2 className="text-lg font-bold mb-1">{artifact.name}</h2>
                 <p className="text-xs text-muted-foreground h-10 line-clamp-2">{artifact.description}</p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
                 <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Format</p>
                    <p className="text-sm font-mono font-bold">{artifact.format}</p>
                 </div>
                 <div className="w-px h-6 bg-border"></div>
                 <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Size</p>
                    <p className="text-sm font-mono font-bold">{artifact.size_mb.toFixed(1)} MB</p>
                 </div>
              </div>

              <div className="mt-6 flex gap-2">
                 <button 
                   className="flex-1 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg border border-border hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                   disabled={artifact.status !== 'READY'}
                 >
                    <Download className="w-4 h-4" /> Export
                 </button>
                 <button 
                   className="p-2 bg-secondary text-foreground rounded-lg border border-border hover:bg-secondary/80 transition-colors disabled:opacity-50"
                   disabled={artifact.status !== 'READY'}
                 >
                    <CloudUpload className="w-4 h-4" />
                 </button>
              </div>
              
           </div>
         ))}
      </div>

      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
         <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Remote Sync (S3 / GCS)</h3>
         <p className="text-sm text-foreground/80 mb-4">
           Automatically push data artifacts to a remote bucket for long-term cold storage or offline analysis.
         </p>
         <div className="flex gap-4">
            <input type="text" placeholder="s3://driftguard-backups/..." className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-colors" />
            <button className="px-6 py-2 bg-secondary text-foreground font-medium rounded-md border border-border hover:bg-secondary/80 transition-colors">
               Connect Bucket
            </button>
         </div>
         <p className="text-xs text-muted-foreground mt-4 font-mono">
           Last full backup synced: {new Date(data?.last_full_backup || '').toLocaleString()}
         </p>
      </div>

    </div>
  );
}
