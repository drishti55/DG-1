"use client";

import { useEffect, useState } from "react";
import { BarChart3, Activity, PieChart, Database, Target, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface MetricBreakdown {
  type: string;
  precision: number;
  recall: number;
  f1: number;
}

interface EvalData {
  run_id: string;
  dataset: string;
  total_samples: number;
  metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    mrr: number;
    ndcg: number;
  };
  artifact_breakdown: MetricBreakdown[];
}

export function QuantitativeEvalClient() {
  const [data, setData] = useState<EvalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch
    const mockData: EvalData = {
      "run_id": "eval_run_42_fastapi",
      "dataset": "tiangolo-fastapi",
      "total_samples": 1250,
      "metrics": {
        "precision": 0.885,
        "recall": 0.921,
        "f1_score": 0.902,
        "mrr": 0.854,
        "ndcg": 0.891
      },
      "artifact_breakdown": [
        { "type": "Code", "precision": 0.942, "recall": 0.961, "f1": 0.951 },
        { "type": "Documentation", "precision": 0.864, "recall": 0.912, "f1": 0.887 },
        { "type": "Tests", "precision": 0.821, "recall": 0.853, "f1": 0.836 },
        { "type": "Configuration", "precision": 0.891, "recall": 0.884, "f1": 0.887 }
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
           <Activity className="w-5 h-5 animate-spin" />
           <span>Aggregating Statistical Metrics...</span>
         </div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Precision', A: data?.metrics.precision! * 100 },
    { subject: 'Recall', A: data?.metrics.recall! * 100 },
    { subject: 'F1 Score', A: data?.metrics.f1_score! * 100 },
    { subject: 'MRR', A: data?.metrics.mrr! * 100 },
    { subject: 'NDCG', A: data?.metrics.ndcg! * 100 }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quantitative Evaluation</h1>
          <p className="text-muted-foreground mt-2">
            System-level precision and recall metrics computed across the evaluation dataset.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Database className="w-4 h-4 text-blue-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dataset</p>
                 <p className="text-sm font-bold font-mono">{data?.dataset}</p>
              </div>
           </div>
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Target className="w-4 h-4 text-primary" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Samples Evaluated</p>
                 <p className="text-sm font-bold font-mono">{data?.total_samples.toLocaleString()}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
         <MetricCard title="Precision" value={data?.metrics.precision!} description="Exactness of matches" color="text-primary" />
         <MetricCard title="Recall" value={data?.metrics.recall!} description="Completeness of retrieval" color="text-green-400" />
         <MetricCard title="F1-Score" value={data?.metrics.f1_score!} description="Harmonic mean" color="text-purple-400" />
         <MetricCard title="MRR" value={data?.metrics.mrr!} description="Mean Reciprocal Rank" color="text-orange-400" />
         <MetricCard title="NDCG" value={data?.metrics.ndcg!} description="Normalized DCG" color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
         
         {/* Artifact Breakdown Bar Chart */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-sm font-medium">
                 <BarChart3 className="w-4 h-4 text-primary" /> Metric Breakdown by Artifact Category
               </div>
            </div>
            <div className="flex-1 relative min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data?.artifact_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="type" stroke="#888" tick={{fontSize: 12}} />
                   <YAxis stroke="#888" tick={{fontSize: 12}} domain={[0, 1]} />
                   <RechartsTooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor: '#000', borderColor: '#333'}} />
                   <Legend />
                   <Bar dataKey="precision" name="Precision" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="recall" name="Recall" fill="#10b981" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="f1" name="F1-Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Spider Chart */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2 text-sm font-medium">
                 <PieChart className="w-4 h-4 text-purple-400" /> Global Performance Profile
               </div>
            </div>
            <div className="flex-1 relative min-h-0 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                   <PolarGrid stroke="#444" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name="System Pipeline" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                   <RechartsTooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor: '#000', borderColor: '#333'}} />
                 </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>

    </div>
  );
}

function MetricCard({ title, value, description, color }: { title: string, value: number, description: string, color: string }) {
  return (
    <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md p-5 flex flex-col shadow-sm hover:border-primary/30 transition-colors">
       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
       <div className={`text-4xl font-black mb-1 ${color}`}>
         {(value * 100).toFixed(1)}<span className="text-xl">%</span>
       </div>
       <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}
