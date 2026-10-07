"use client";

import { useEffect, useState } from "react";
import { Activity, Brain, Server, Target, Zap, Clock, TrendingDown, Layers, PlayCircle, HardDrive } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface FinetuningData {
  base_model: string;
  adapter_name: string;
  status: string;
  progress: {
    epoch: number;
    total_epochs: number;
    step: number;
    total_steps: number;
    current_loss: number;
    estimated_time_remaining: string;
    percentage: number;
  };
  hyperparameters: {
    lora_r: number;
    lora_alpha: number;
    learning_rate: string;
    batch_size: number;
    optimizer: string;
  };
  dataset: {
    name: string;
    samples: number;
    split: string;
  };
}

export function FinetuningClient() {
  const [data, setData] = useState<FinetuningData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock loss curve data
  const lossData = [
    { step: 0, loss: 2.14 },
    { step: 100, loss: 1.85 },
    { step: 200, loss: 1.42 },
    { step: 300, loss: 0.98 },
    { step: 400, loss: 0.61 },
    { step: 450, loss: 0.432 },
  ];

  useEffect(() => {
    // Mock backend fetch
    const mockData: FinetuningData = {
      "base_model": "llama-3-8b-instruct",
      "adapter_name": "driftguard-fastapi-lora-v1",
      "status": "TRAINING",
      "progress": {
        "epoch": 2,
        "total_epochs": 5,
        "step": 450,
        "total_steps": 1125,
        "current_loss": 0.432,
        "estimated_time_remaining": "45m 12s",
        "percentage": 40
      },
      "hyperparameters": {
        "lora_r": 16,
        "lora_alpha": 32,
        "learning_rate": "2e-4",
        "batch_size": 4,
        "optimizer": "adamw_8bit"
      },
      "dataset": {
        "name": "fastapi_drift_pairs_synthetic.jsonl",
        "samples": 4500,
        "split": "80/20"
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
           <Brain className="w-5 h-5 animate-spin" />
           <span>Connecting to Training Cluster...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Fine-Tuning</h1>
          <p className="text-muted-foreground mt-2">
            Train LoRA adapters to teach the LLM custom architectural patterns and drift behaviors.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-primary/50 bg-primary/10 flex items-center gap-3 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Job Status</p>
                 <p className="text-sm font-bold font-mono text-primary">{data?.status}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Training Status Bar */}
      <div className="mb-6 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm p-6 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary rounded-lg border border-border">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Base Model</p>
                <p className="font-bold font-mono">{data?.base_model}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary rounded-lg border border-border">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Target Adapter</p>
                <p className="font-bold font-mono">{data?.adapter_name}</p>
              </div>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Time Remaining</p>
               <div className="flex items-center gap-2 font-mono font-bold text-orange-400">
                 <Clock className="w-4 h-4" /> {data?.progress.estimated_time_remaining}
               </div>
            </div>
            <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 font-medium rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2 text-sm shadow-sm">
               Abort Job
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
         
         {/* Live Loss Curve */}
         <div className="md:col-span-2 rounded-xl border border-border bg-black/40 backdrop-blur-md p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-sm font-medium">
                 <TrendingDown className="w-5 h-5 text-green-400" /> Live Training Loss (Cross-Entropy)
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-xs text-muted-foreground font-mono">Current:</span>
                 <span className="text-sm font-bold text-green-400 font-mono">{data?.progress.current_loss}</span>
               </div>
            </div>
            <div className="flex-1 relative min-h-0 w-full ml-[-20px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={lossData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="step" stroke="#888" tick={{fontSize: 12}} />
                   <YAxis stroke="#888" tick={{fontSize: 12}} domain={[0, 2.5]} />
                   <RechartsTooltip 
                     contentStyle={{backgroundColor: '#000', borderColor: '#333'}}
                     labelStyle={{color: '#888'}}
                     itemStyle={{color: '#10b981'}}
                   />
                   <Line type="monotone" dataKey="loss" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Hyperparameters & Stats */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2 text-sm font-medium">
               <Zap className="w-4 h-4 text-yellow-400" /> Training Configuration
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
               
               {/* Progress Bar */}
               <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Overall Progress</span>
                    <span className="text-sm font-bold font-mono text-primary">{data?.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                     <div className="bg-primary h-2 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${data?.progress.percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                    <span>Epoch {data?.progress.epoch}/{data?.progress.total_epochs}</span>
                    <span>Step {data?.progress.step}/{data?.progress.total_steps}</span>
                  </div>
               </div>

               <div className="h-px bg-border w-full"></div>

               {/* Hyperparameters Grid */}
               <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Hyperparameters (PEFT)</h3>
                  <div className="grid grid-cols-2 gap-3">
                     <ParamBox label="LoRA R" value={data?.hyperparameters.lora_r!} />
                     <ParamBox label="LoRA Alpha" value={data?.hyperparameters.lora_alpha!} />
                     <ParamBox label="Learning Rate" value={data?.hyperparameters.learning_rate!} />
                     <ParamBox label="Batch Size" value={data?.hyperparameters.batch_size!} />
                  </div>
                  <div className="mt-3">
                     <ParamBox label="Optimizer" value={data?.hyperparameters.optimizer!} fullWidth />
                  </div>
               </div>

               <div className="h-px bg-border w-full"></div>

               {/* Dataset Info */}
               <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Training Corpus</h3>
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 border border-border rounded-lg">
                     <HardDrive className="w-5 h-5 text-blue-400" />
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">{data?.dataset.name}</p>
                        <p className="text-xs text-muted-foreground">{data?.dataset.samples.toLocaleString()} pairs • {data?.dataset.split} split</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>

      </div>

    </div>
  );
}

function ParamBox({ label, value, fullWidth = false }: { label: string, value: string | number, fullWidth?: boolean }) {
  return (
    <div className={`p-3 bg-secondary/20 border border-border rounded-lg ${fullWidth ? 'w-full' : ''}`}>
       <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
       <p className="font-mono text-sm">{value}</p>
    </div>
  );
}
