"use client";

import { useEffect, useState } from "react";
import { List, Download, Search, AlertOctagon, CheckCircle2, Filter, Activity, Clock } from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: string;
  ip_address: string;
}

interface AuditData {
  total_events_7d: number;
  failed_authentications: number;
  events: AuditEvent[];
}

export function AuditSettingsClient() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: AuditData = {
      "total_events_7d": 1428,
      "failed_authentications": 12,
      "events": [
        {
          "id": "evt_99814",
          "timestamp": "2026-10-07T06:21:45Z",
          "user": "Admin (System)",
          "action": "UPDATE_RBAC_POLICY",
          "resource": "role_ml_engineer",
          "status": "SUCCESS",
          "ip_address": "10.0.0.1"
        },
        {
          "id": "evt_99812",
          "timestamp": "2026-10-07T06:15:22Z",
          "user": "Alice (ML Engineer)",
          "action": "TRIGGER_FINETUNING",
          "resource": "driftguard-fastapi-lora-v1",
          "status": "SUCCESS",
          "ip_address": "192.168.1.42"
        },
        {
          "id": "evt_99813",
          "timestamp": "2026-10-07T06:17:05Z",
          "user": "System (GitHub Webhook)",
          "action": "CREATE_PULL_REQUEST",
          "resource": "docs/users.md",
          "status": "SUCCESS",
          "ip_address": "140.82.112.4"
        },
        {
          "id": "evt_99811",
          "timestamp": "2026-10-07T06:12:10Z",
          "user": "Bob (Code Reviewer)",
          "action": "OVERRIDE_DRIFT_SEVERITY",
          "resource": "api/users.py",
          "status": "DENIED",
          "ip_address": "10.0.0.105"
        },
        {
          "id": "evt_99810",
          "timestamp": "2026-10-07T06:05:00Z",
          "user": "System (Orchestrator)",
          "action": "RUN_EVALUATION_PIPELINE",
          "resource": "dataset:tiangolo-fastapi",
          "status": "SUCCESS",
          "ip_address": "127.0.0.1"
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
           <List className="w-5 h-5 animate-spin" />
           <span>Fetching Telemetry & Audit Logs...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Audit Logs</h1>
          <p className="text-muted-foreground mt-2">
            Immutable tracking of all system modifications, queries, and authorization events.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center gap-3 shadow-sm">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold">Failed Auth (7d)</p>
                 <p className="text-sm font-bold font-mono text-red-400">{data?.failed_authentications}</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Download className="w-4 h-4" /> Export CSV
           </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm overflow-hidden flex-1">
         <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-4 w-full max-w-2xl">
               <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by User, Action, Resource, or IP..." 
                    className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
               </div>
               <button className="px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors">
                  <Filter className="w-4 h-4" /> Filter
               </button>
            </div>
            
            <div className="text-sm text-muted-foreground font-mono">
               Total Events (7d): {data?.total_events_7d.toLocaleString()}
            </div>
         </div>
         
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border bg-background/50">
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event ID</th>
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actor</th>
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource / Target</th>
                     <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {data?.events.map((event) => (
                    <tr key={event.id} className="hover:bg-secondary/20 transition-colors group">
                       <td className="p-4 text-sm font-mono text-muted-foreground">
                         <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3" />
                           {new Date(event.timestamp).toLocaleString(undefined, {
                             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                           })}
                         </div>
                       </td>
                       <td className="p-4 text-xs font-mono text-muted-foreground/70">{event.id}</td>
                       <td className="p-4 text-sm font-medium">
                         <div>
                            <span className="text-foreground">{event.user}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">{event.ip_address}</span>
                         </div>
                       </td>
                       <td className="p-4">
                         <span className="px-2 py-1 bg-secondary text-foreground text-xs font-mono rounded border border-border">
                           {event.action}
                         </span>
                       </td>
                       <td className="p-4 text-sm font-mono text-muted-foreground truncate max-w-[200px]" title={event.resource}>
                         {event.resource}
                       </td>
                       <td className="p-4 text-right">
                         {event.status === "SUCCESS" ? (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                             <CheckCircle2 className="w-3 h-3" /> SUCCESS
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                             <AlertOctagon className="w-3 h-3" /> DENIED
                           </span>
                         )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
