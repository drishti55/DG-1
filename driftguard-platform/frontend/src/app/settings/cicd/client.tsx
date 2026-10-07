"use client";

import { useEffect, useState } from "react";
import { GitBranch, Settings, Zap, Key, Link as LinkIcon, ShieldCheck, ToggleRight, ToggleLeft, RefreshCw, Bot } from "lucide-react";

interface CicdData {
  provider: string;
  app_status: string;
  app_name: string;
  installation_id: string;
  webhook_url: string;
  webhook_secret_set: boolean;
  triggers: {
    on_pull_request: boolean;
    on_push_to_main: boolean;
    on_release: boolean;
  };
  policies: {
    block_pr_on_severe_drift: boolean;
    auto_comment_on_pr: boolean;
    require_human_override: boolean;
  };
  last_sync: string;
}

export function CicdSettingsClient() {
  const [data, setData] = useState<CicdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: CicdData = {
      "provider": "GitHub App",
      "app_status": "CONNECTED",
      "app_name": "DriftGuard Enterprise",
      "installation_id": "inst_8829102",
      "webhook_url": "https://api.driftguard.dev/webhooks/github/receive",
      "webhook_secret_set": true,
      "triggers": {
        "on_pull_request": true,
        "on_push_to_main": false,
        "on_release": true
      },
      "policies": {
        "block_pr_on_severe_drift": true,
        "auto_comment_on_pr": true,
        "require_human_override": false
      },
      "last_sync": "2026-10-07T06:18:00Z"
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
           <Settings className="w-5 h-5 animate-spin" />
           <span>Loading CI/CD Configurations...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CI/CD Integration</h1>
          <p className="text-muted-foreground mt-2">
            Configure how DriftGuard interacts with your version control pipelines.
          </p>
        </div>
        
        <div className="flex gap-4">
           <button className="px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg border border-border transition-colors flex items-center gap-2 text-sm">
             <RefreshCw className="w-4 h-4" /> Sync Now
           </button>
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <GitBranch className="w-4 h-4 fill-current" /> Manage GitHub App
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Connection Status */}
        <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 text-sm font-medium mb-6">
             <LinkIcon className="w-4 h-4 text-primary" /> Active Connection
           </div>
           
           <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border mb-6">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border">
                 <GitBranch className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{data?.app_name}</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {data?.app_status}
                    </span>
                 </div>
                 <div className="text-xs text-muted-foreground font-mono">
                    ID: {data?.installation_id}
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Webhook Endpoint</label>
                <div className="flex items-center gap-2">
                   <input 
                     type="text" 
                     readOnly 
                     value={data?.webhook_url} 
                     className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground focus:outline-none"
                   />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Webhook Secret</label>
                <div className="flex items-center gap-2">
                   <input 
                     type="password" 
                     readOnly 
                     value={data?.webhook_secret_set ? "************************" : ""} 
                     className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground focus:outline-none"
                   />
                   <div className="p-2 bg-secondary rounded-md border border-border">
                      <Key className="w-4 h-4 text-muted-foreground" />
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Triggers & Policies */}
        <div className="flex flex-col gap-6">
           
           {/* Webhook Triggers */}
           <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
             <div className="flex items-center gap-2 text-sm font-medium mb-4">
               <Zap className="w-4 h-4 text-yellow-400" /> Pipeline Triggers
             </div>
             <div className="space-y-4">
                <ToggleRow label="Run on Pull Request (opened/synchronized)" active={data?.triggers.on_pull_request} />
                <ToggleRow label="Run on Push to Main Branch" active={data?.triggers.on_push_to_main} />
                <ToggleRow label="Run on Release Tag Creation" active={data?.triggers.on_release} />
             </div>
           </div>

           {/* Enforcement Policies */}
           <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm flex-1">
             <div className="flex items-center gap-2 text-sm font-medium mb-4">
               <ShieldCheck className="w-4 h-4 text-purple-400" /> Enforcement Policies
             </div>
             <div className="space-y-4">
                <ToggleRow label="Block PR Merges on SEVERE Drift Detection" active={data?.policies.block_pr_on_severe_drift} />
                <ToggleRow label="Auto-Comment generated fixes on PRs" active={data?.policies.auto_comment_on_pr} />
                <ToggleRow label="Require Human Override for Actionable Items" active={data?.policies.require_human_override} />
             </div>
           </div>

        </div>

      </div>

    </div>
  );
}

function ToggleRow({ label, active }: { label: string, active: boolean | undefined }) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/20 border border-border rounded-lg hover:bg-secondary/40 transition-colors">
       <span className="text-sm text-foreground/90">{label}</span>
       {active ? (
         <ToggleRight className="w-6 h-6 text-primary" />
       ) : (
         <ToggleLeft className="w-6 h-6 text-muted-foreground" />
       )}
    </div>
  );
}
