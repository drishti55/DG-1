"use client";

import { useEffect, useState } from "react";
import { KeyRound, Lock, Unlock, ShieldCheck, AlertCircle, Plus, Eye, EyeOff, TerminalSquare, AlertTriangle, RefreshCw } from "lucide-react";

interface Secret {
  id: string;
  name: string;
  provider: string;
  masked_value: string | null;
  status: string;
  last_used: string | null;
}

interface SecretsData {
  vault_status: string;
  encryption_level: string;
  secrets: Secret[];
}

export function SecretsSettingsClient() {
  const [data, setData] = useState<SecretsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Mock backend fetch
    const mockData: SecretsData = {
      "vault_status": "SECURE",
      "encryption_level": "AES-256-GCM",
      "secrets": [
        {
          "id": "openai_api_key",
          "name": "OpenAI API Key",
          "provider": "OpenAI",
          "masked_value": "sk-proj-**********************4F98",
          "status": "VALID",
          "last_used": "2026-10-07T06:20:10Z"
        },
        {
          "id": "anthropic_api_key",
          "name": "Anthropic API Key",
          "provider": "Anthropic",
          "masked_value": null,
          "status": "NOT_SET",
          "last_used": null
        },
        {
          "id": "github_pat",
          "name": "GitHub Access Token",
          "provider": "GitHub",
          "masked_value": "ghp_**********************A9B2",
          "status": "VALID",
          "last_used": "2026-10-07T06:17:05Z"
        },
        {
          "id": "linear_api_key",
          "name": "Linear API Key",
          "provider": "Linear",
          "masked_value": "lin_api_**********************11Z0",
          "status": "EXPIRED",
          "last_used": "2026-09-01T12:00:00Z"
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const toggleReveal = (id: string) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
         <div className="flex items-center gap-2 text-primary animate-pulse">
           <Lock className="w-5 h-5 animate-spin" />
           <span>Decrypting Secure Vault...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Secrets & API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Securely manage credentials for third-party cloud models and integrations.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Vault Status</p>
                 <p className="text-sm font-bold font-mono text-green-400">{data?.vault_status} ({data?.encryption_level})</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Plus className="w-4 h-4" /> Add Secret
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
         {data?.secrets.map(secret => (
           <div key={secret.id} className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm relative overflow-hidden transition-all hover:border-primary/30">
              
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-purple-400" /> {secret.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">Provider: {secret.provider}</p>
                 </div>
                 
                 <div>
                   {secret.status === "VALID" && (
                     <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <ShieldCheck className="w-3 h-3" /> ACTIVE
                     </span>
                   )}
                   {secret.status === "NOT_SET" && (
                     <span className="px-3 py-1 bg-secondary text-muted-foreground border border-border rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <AlertCircle className="w-3 h-3" /> NOT SET
                     </span>
                   )}
                   {secret.status === "EXPIRED" && (
                     <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <AlertTriangle className="w-3 h-3" /> EXPIRED
                     </span>
                   )}
                 </div>
              </div>

              <div className="mb-6 flex-1">
                 <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">Encrypted Value</label>
                 <div className="flex items-center gap-2">
                    <input 
                      type={revealed[secret.id] ? "text" : "password"} 
                      readOnly 
                      value={secret.masked_value || ""} 
                      placeholder={secret.status === "NOT_SET" ? "Not configured..." : ""}
                      className={`flex-1 bg-background border rounded-md px-3 py-2 text-sm font-mono focus:outline-none ${secret.status === 'EXPIRED' ? 'border-red-500/50 text-red-400' : 'border-border text-foreground'}`}
                    />
                    <button 
                      onClick={() => toggleReveal(secret.id)}
                      disabled={!secret.masked_value}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-md border border-border transition-colors disabled:opacity-50"
                    >
                       {revealed[secret.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <TerminalSquare className="w-4 h-4" />
                    ID: {secret.id}
                 </div>
                 
                 {secret.last_used && (
                   <div className="text-right text-xs text-muted-foreground">
                      Last used: {new Date(secret.last_used).toLocaleDateString()}
                   </div>
                 )}
                 {!secret.last_used && secret.status === "NOT_SET" && (
                   <button className="text-xs text-primary font-bold hover:underline">
                      Configure Now
                   </button>
                 )}
                 {secret.status === "EXPIRED" && (
                   <button className="text-xs text-red-400 flex items-center gap-1 font-bold hover:underline">
                      <RefreshCw className="w-3 h-3" /> Rotate Key
                   </button>
                 )}
              </div>
           </div>
         ))}
      </div>

    </div>
  );
}
