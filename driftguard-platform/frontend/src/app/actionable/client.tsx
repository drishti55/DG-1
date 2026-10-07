"use client";

import { useEffect, useState } from "react";
import { GitPullRequest, ClipboardList, CheckCircle2, ChevronRight, Hash, Code2, ShieldAlert, Send } from "lucide-react";
import Editor from "@monaco-editor/react";

interface Artifact {
  id: string;
  type: string;
  target_file?: string;
  title: string;
  diff?: string;
  description?: string;
  platform?: string;
  status: string;
}

interface ActionableData {
  issue_id: string;
  title: string;
  drift_type: string;
  severity: string;
  generated_artifacts: Artifact[];
}

export function ActionableClient() {
  const [data, setData] = useState<ActionableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: ActionableData = {
      "issue_id": "DRIFT-104",
      "title": "Update Pydantic dict() references to model_dump() in docs",
      "drift_type": "CODE_DOCS_MISMATCH",
      "severity": "HIGH",
      "generated_artifacts": [
        {
          "id": "artifact-1",
          "type": "PULL_REQUEST",
          "target_file": "docs/users.md",
          "title": "docs: update pydantic v2 methods",
          "diff": "@@ -45,7 +45,7 @@\n To serialize the user object for JSON responses:\n \n ```python\n-user_data = user.dict()\n+user_data = user.model_dump()\n ```\n \n This will return a dictionary.",
          "status": "READY_FOR_REVIEW"
        },
        {
          "id": "artifact-2",
          "type": "TICKET",
          "platform": "Linear",
          "title": "Audit all docs for Pydantic V2 deprecations",
          "description": "The AI DriftGuard system detected drift in `docs/users.md` where `dict()` is used instead of `model_dump()`. We need to audit the rest of the documentation for similar V1 to V2 migration misses.",
          "status": "DRAFT"
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
           <ShieldAlert className="w-5 h-5 animate-spin" />
           <span>Generating Actionable Artifacts...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actionable Output Generation</h1>
          <p className="text-muted-foreground mt-2">
            Auto-generating structural fixes (PRs, Tickets) to remediate detected drift.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-destructive bg-destructive/10 flex items-center gap-3 shadow-sm">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-destructive font-bold">Severity</p>
                 <p className="text-sm font-bold font-mono text-destructive">{data?.severity}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Issue Context */}
      <div className="mb-6 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm p-6">
         <div className="flex items-center gap-4 mb-2">
            <span className="px-2 py-1 rounded bg-secondary text-foreground text-xs font-mono font-bold border border-border">
              {data?.issue_id}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
              {data?.drift_type.replace(/_/g, ' ')}
            </span>
         </div>
         <h2 className="text-xl font-bold text-foreground/90">{data?.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
         
         {/* Generated Artifacts Column 1: PR */}
         {data?.generated_artifacts.filter(a => a.type === "PULL_REQUEST").map(artifact => (
           <div key={artifact.id} className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/80"></div>
              
              <div className="p-5 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded border border-blue-500/30">
                    <GitPullRequest className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Generated Patch</span>
                    <span className="font-bold text-sm">Automated Pull Request</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded font-mono border border-border">{artifact.target_file}</span>
                </div>
              </div>
              
              <div className="p-5 border-b border-border bg-background/50">
                <p className="text-sm font-semibold mb-2">Title: <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{artifact.title}</span></p>
              </div>

              <div className="flex-1 relative">
                <Editor
                   height="100%"
                   language="diff"
                   theme="vs-dark"
                   value={artifact.diff}
                   options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                 />
              </div>

              <div className="p-4 border-t border-border bg-secondary/30 flex justify-end">
                 <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                   <Send className="w-4 h-4" /> Ship to GitHub
                 </button>
              </div>
           </div>
         ))}

         {/* Generated Artifacts Column 2: Ticket */}
         {data?.generated_artifacts.filter(a => a.type === "TICKET").map(artifact => (
           <div key={artifact.id} className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/80"></div>
              
              <div className="p-5 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded border border-purple-500/30">
                    <ClipboardList className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Issue Tracking</span>
                    <span className="font-bold text-sm">Generated {artifact.platform} Ticket</span>
                  </div>
                </div>
                <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                  {artifact.status}
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-4">
                 <div>
                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Ticket Title</p>
                   <p className="text-lg font-bold text-foreground/90">{artifact.title}</p>
                 </div>
                 <div>
                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Description / Context</p>
                   <div className="p-4 bg-secondary/30 rounded-md border border-border text-[14px] leading-relaxed text-foreground/80 font-sans">
                     {artifact.description?.split('`').map((text, i) => 
                       i % 2 === 1 ? <code key={i} className="bg-secondary text-purple-400 px-1.5 py-0.5 rounded text-sm font-mono border border-border">{text}</code> : text
                     )}
                   </div>
                 </div>
              </div>

              <div className="p-4 border-t border-border bg-secondary/30 flex justify-end">
                 <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                   <Send className="w-4 h-4" /> Create in {artifact.platform}
                 </button>
              </div>
           </div>
         ))}

      </div>

    </div>
  );
}
