"use client";

import { useEffect, useState } from "react";
import { Webhook, Activity, Plus, CheckCircle2, AlertOctagon, Link2, BellRing, Settings2, Trash2 } from "lucide-react";

interface WebhookData {
  id: string;
  name: string;
  url: string;
  status: string;
  subscribed_events: string[];
  last_delivery: string;
  created_at: string;
}

interface WebhooksResponse {
  active_webhooks: number;
  events_delivered_24h: number;
  webhooks: WebhookData[];
}

export function WebhooksSettingsClient() {
  const [data, setData] = useState<WebhooksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: WebhooksResponse = {
      "active_webhooks": 3,
      "events_delivered_24h": 142,
      "webhooks": [
        {
          "id": "wh_001",
          "name": "Slack Alerting (#sec-eng)",
          "url": "https://api.example.com/slack-webhook-mock",
          "status": "HEALTHY",
          "subscribed_events": ["drift.detected.severe", "pipeline.failed"],
          "last_delivery": "2026-10-07T06:12:00Z",
          "created_at": "2026-01-15T09:00:00Z"
        },
        {
          "id": "wh_002",
          "name": "Jira Issue Sync",
          "url": "https://jira.enterprise.local/rest/webhooks/1.0",
          "status": "HEALTHY",
          "subscribed_events": ["pr.generated", "drift.detected.moderate"],
          "last_delivery": "2026-10-07T05:45:00Z",
          "created_at": "2026-03-22T11:30:00Z"
        },
        {
          "id": "wh_003",
          "name": "PagerDuty Escalation",
          "url": "https://events.pagerduty.com/v2/enqueue",
          "status": "FAILING",
          "subscribed_events": ["system.offline", "model.finetune.failed"],
          "last_delivery": "2026-10-06T14:22:10Z",
          "created_at": "2026-08-01T14:00:00Z"
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
           <Webhook className="w-5 h-5 animate-spin" />
           <span>Loading Webhooks...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks & Events</h1>
          <p className="text-muted-foreground mt-2">
            Configure outbound HTTP webhooks to integrate DriftGuard with Slack, Jira, and CI tools.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Activity className="w-4 h-4 text-blue-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deliveries (24h)</p>
                 <p className="text-sm font-bold font-mono text-foreground">{data?.events_delivered_24h}</p>
              </div>
           </div>
           
           <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-sm">
             <Plus className="w-4 h-4" /> Add Webhook
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
         {data?.webhooks.map(wh => (
           <div key={wh.id} className={`rounded-xl border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm relative overflow-hidden transition-all hover:border-primary/30 ${wh.status === 'FAILING' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border'}`}>
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                      <Webhook className="w-5 h-5 text-purple-400" /> {wh.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded max-w-xl truncate">
                       <Link2 className="w-3 h-3" /> {wh.url}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   {wh.status === "HEALTHY" ? (
                     <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> HEALTHY
                     </span>
                   ) : (
                     <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                       <AlertOctagon className="w-3 h-3" /> FAILING
                     </span>
                   )}
                   
                   <div className="flex items-center gap-1 border-l border-border pl-3 ml-1">
                     <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Settings2 className="w-4 h-4" /></button>
                     <button className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                 </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                 <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Subscribed Events</p>
                    <div className="flex flex-wrap gap-2">
                       {wh.subscribed_events.map(ev => (
                         <span key={ev} className="px-2 py-1 bg-secondary text-foreground text-[10px] font-mono rounded border border-border flex items-center gap-1">
                           <BellRing className="w-3 h-3 text-primary" /> {ev}
                         </span>
                       ))}
                    </div>
                 </div>
                 
                 <div className="text-right border-l border-border pl-6 min-w-[200px]">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Last Delivery</p>
                    <p className="text-sm font-mono font-bold">
                      {new Date(wh.last_delivery).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    {wh.status === 'FAILING' && (
                      <p className="text-[10px] text-red-400 mt-1 cursor-pointer hover:underline">View error logs</p>
                    )}
                 </div>
              </div>
              
           </div>
         ))}
      </div>

    </div>
  );
}
