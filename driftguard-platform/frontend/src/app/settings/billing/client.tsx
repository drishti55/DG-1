"use client";

import { useEffect, useState } from "react";
import { DollarSign, Wallet, ArrowDownCircle, Banknote, CreditCard, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ProviderUsage {
  provider: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
}

interface DailySpend {
  date: string;
  cost: number;
}

interface BillingData {
  current_period: string;
  total_spend_usd: number;
  budget_limit_usd: number;
  savings_from_local_compute_usd: number;
  usage_by_provider: ProviderUsage[];
  daily_spend: DailySpend[];
}

export function BillingSettingsClient() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: BillingData = {
      "current_period": "Oct 1 - Oct 31, 2026",
      "total_spend_usd": 412.50,
      "budget_limit_usd": 1000.00,
      "savings_from_local_compute_usd": 850.20,
      "usage_by_provider": [
        {
          "provider": "OpenAI (GPT-4o)",
          "input_tokens": 12500000,
          "output_tokens": 2400000,
          "cost_usd": 382.50
        },
        {
          "provider": "Anthropic (Claude 3.5)",
          "input_tokens": 800000,
          "output_tokens": 150000,
          "cost_usd": 30.00
        },
        {
          "provider": "Local (Llama 3 / Mistral)",
          "input_tokens": 45000000,
          "output_tokens": 12000000,
          "cost_usd": 0.00
        }
      ],
      "daily_spend": [
        {"date": "Oct 01", "cost": 12.50},
        {"date": "Oct 02", "cost": 15.20},
        {"date": "Oct 03", "cost": 14.80},
        {"date": "Oct 04", "cost": 45.00},
        {"date": "Oct 05", "cost": 82.50},
        {"date": "Oct 06", "cost": 105.20},
        {"date": "Oct 07", "cost": 137.30}
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
           <DollarSign className="w-5 h-5 animate-spin" />
           <span>Loading Token Telemetry...</span>
         </div>
      </div>
    );
  }

  const percentUsed = data ? Math.round((data.total_spend_usd / data.budget_limit_usd) * 100) : 0;
  const overBudgetWarning = percentUsed > 80;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Telemetry & Billing</h1>
          <p className="text-muted-foreground mt-2">
            Monitor API token utilization, local compute savings, and budget thresholds.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Banknote className="w-4 h-4 text-green-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Period</p>
                 <p className="text-sm font-bold font-mono text-foreground">{data?.current_period}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <div className="rounded-xl border border-border bg-black/40 p-6 flex flex-col shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total API Spend</h3>
               <Wallet className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold font-mono">${data?.total_spend_usd.toFixed(2)}</p>
            
            <div className="mt-auto pt-4">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Budget Limit</span>
                 <span className={`text-xs font-bold font-mono ${overBudgetWarning ? 'text-red-400' : 'text-primary'}`}>{percentUsed}%</span>
               </div>
               <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${overBudgetWarning ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(percentUsed, 100)}%` }}></div>
               </div>
               <p className="text-xs text-muted-foreground mt-2 font-mono">${data?.total_spend_usd.toFixed(2)} / ${data?.budget_limit_usd.toFixed(2)}</p>
            </div>
         </div>

         <div className="rounded-xl border border-border bg-black/40 p-6 flex flex-col shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Local Compute Savings</h3>
               <ArrowDownCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-green-400">${data?.savings_from_local_compute_usd.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">Saved by routing tasks to local hardware (e.g. Llama 3) instead of cloud APIs.</p>
         </div>

         <div className="rounded-xl border border-border bg-black/40 p-6 flex flex-col shadow-sm relative overflow-hidden border-primary/30">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="relative">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Payment Method</h3>
                  <CreditCard className="w-5 h-5 text-primary" />
               </div>
               <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center text-black font-bold italic text-sm">VISA</div>
                  <div>
                    <p className="font-mono text-sm">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/28</p>
                  </div>
               </div>
               <button className="w-full mt-6 py-2 bg-secondary text-foreground text-sm font-medium rounded border border-border hover:bg-secondary/80 transition-colors">
                  Update Billing Method
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
         
         {/* Daily Spend Area Chart */}
         <div className="md:col-span-2 rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-sm font-medium">
                 <TrendingUp className="w-5 h-5 text-primary" /> Daily Cloud API Spend (USD)
               </div>
            </div>
            <div className="flex-1 relative min-h-0 w-full ml-[-20px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.daily_spend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                   <defs>
                     <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="date" stroke="#888" tick={{fontSize: 12}} />
                   <YAxis stroke="#888" tick={{fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                   <RechartsTooltip 
                     contentStyle={{backgroundColor: '#000', borderColor: '#333'}}
                     labelStyle={{color: '#888'}}
                     itemStyle={{color: '#8b5cf6'}}
                     formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cost']}
                   />
                   <Area type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Usage By Provider */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2 text-sm font-medium">
               <Activity className="w-4 h-4 text-orange-400" /> Token Usage by Model
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
               {data?.usage_by_provider.map((prov, i) => (
                 <div key={i} className="p-4 rounded-lg border border-border bg-secondary/20">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="font-bold text-sm">{prov.provider}</h4>
                       {prov.cost_usd === 0 ? (
                         <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">FREE</span>
                       ) : (
                         <span className="font-mono font-bold text-sm text-red-400">${prov.cost_usd.toFixed(2)}</span>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-mono">
                       <div className="flex-1 text-muted-foreground">
                         <span className="block text-[10px] uppercase tracking-wider mb-0.5">Input Tokens</span>
                         {(prov.input_tokens / 1000000).toFixed(1)}M
                       </div>
                       <div className="w-px h-6 bg-border"></div>
                       <div className="flex-1 text-muted-foreground">
                         <span className="block text-[10px] uppercase tracking-wider mb-0.5">Output Tokens</span>
                         {(prov.output_tokens / 1000000).toFixed(1)}M
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
