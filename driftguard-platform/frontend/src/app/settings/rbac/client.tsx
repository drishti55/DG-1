"use client";

import { useEffect, useState } from "react";
import { Shield, Users, Key, ChevronRight, CheckCircle2, Lock, Unlock, Plus } from "lucide-react";

interface Role {
  id: string;
  name: string;
  user_count: number;
  permissions: string[];
}

interface RbacData {
  active_users: number;
  roles: Role[];
  permission_dictionary: Record<string, string>;
}

export function RbacSettingsClient() {
  const [data, setData] = useState<RbacData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("role_ml_engineer");

  useEffect(() => {
    // Mock backend fetch
    const mockData: RbacData = {
      "active_users": 142,
      "roles": [
        {
          "id": "role_admin",
          "name": "Super Admin",
          "user_count": 3,
          "permissions": ["all"]
        },
        {
          "id": "role_ml_engineer",
          "name": "AI/ML Engineer",
          "user_count": 12,
          "permissions": [
            "trigger_finetuning",
            "modify_embeddings",
            "access_raw_datasets",
            "view_dashboards"
          ]
        },
        {
          "id": "role_code_reviewer",
          "name": "Code Reviewer",
          "user_count": 127,
          "permissions": [
            "view_dashboards",
            "approve_actionable_prs",
            "override_drift_severity"
          ]
        }
      ],
      "permission_dictionary": {
        "view_dashboards": "Can view read-only telemetry and evaluation dashboards",
        "trigger_finetuning": "Can initiate, abort, and modify LoRA PEFT training jobs",
        "modify_embeddings": "Can alter the vectorization schema and embedding models",
        "access_raw_datasets": "Can download and view raw code/docs extraction JSONL files",
        "approve_actionable_prs": "Can ship auto-generated PRs directly to GitHub via the Actionable UI",
        "override_drift_severity": "Can manually adjust the severity of a detected drift event"
      }
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
           <Shield className="w-5 h-5 animate-spin" />
           <span>Loading Access Policies...</span>
         </div>
      </div>
    );
  }

  const activeRole = data?.roles.find(r => r.id === selectedRole);
  const isAdmin = activeRole?.id === "role_admin";

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage granular access control policies for your DriftGuard workspace.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Members</p>
                 <p className="text-sm font-bold font-mono">{data?.active_users}</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Plus className="w-4 h-4" /> Create Custom Role
           </button>
        </div>
      </div>

      <div className="flex gap-6 h-[500px]">
         
         {/* Roles Sidebar */}
         <div className="w-1/3 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm flex flex-col">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2 text-sm font-medium">
               <Shield className="w-4 h-4 text-primary" /> Workspace Roles
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
               {data?.roles.map(role => (
                 <button 
                   key={role.id}
                   onClick={() => setSelectedRole(role.id)}
                   className={`p-4 rounded-lg border text-left transition-all ${
                     selectedRole === role.id 
                       ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                       : 'bg-secondary/20 border-transparent hover:bg-secondary/40'
                   }`}
                 >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${selectedRole === role.id ? 'text-primary' : 'text-foreground'}`}>{role.name}</span>
                      {selectedRole === role.id && <ChevronRight className="w-4 h-4 text-primary" />}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{role.user_count} Users Assigned</span>
                 </button>
               ))}
            </div>
         </div>

         {/* Permissions Editor */}
         <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Key className="w-5 h-5 text-purple-400" />
                 <div>
                   <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Editing Policy</span>
                   <span className="font-bold">{activeRole?.name}</span>
                 </div>
               </div>
               
               {isAdmin && (
                 <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                   <Lock className="w-3 h-3" /> System Role (Immutable)
                 </span>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
               
               {isAdmin ? (
                 <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Unrestricted Access</h3>
                    <p className="text-sm text-muted-foreground">
                      The Super Admin role is hardcoded with wildcard permissions (`*`). It cannot be edited, restricted, or deleted.
                    </p>
                 </div>
               ) : (
                 <div className="flex flex-col gap-3">
                    {Object.entries(data?.permission_dictionary || {}).map(([key, desc]) => {
                       const hasPermission = activeRole?.permissions.includes(key);
                       
                       return (
                         <div key={key} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                           hasPermission ? 'bg-primary/5 border-primary/30' : 'bg-secondary/10 border-border hover:bg-secondary/30'
                         }`}>
                            <div className="flex-1 pr-6">
                               <p className="font-mono text-sm font-semibold mb-1 text-foreground/90">{key}</p>
                               <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                            
                            <button 
                              className={`w-12 h-6 rounded-full relative transition-colors ${
                                hasPermission ? 'bg-primary' : 'bg-secondary border border-border'
                              }`}
                            >
                               <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                 hasPermission ? 'translate-x-6' : 'translate-x-0 bg-muted-foreground'
                               }`}></span>
                            </button>
                         </div>
                       );
                    })}
                 </div>
               )}

            </div>
         </div>

      </div>

    </div>
  );
}
