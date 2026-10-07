"use client";

import { useEffect, useState } from "react";
import { Sparkles, UserCheck, Star, ThumbsUp, BrainCircuit, Activity, ChevronRight, Hash, Code2 } from "lucide-react";

interface EvalData {
  evaluation_id: string;
  artifacts: {
    source: string;
    target: string;
  };
  ai_generation: string;
  human_ground_truth: string;
  grades: {
    accuracy: number;
    clarity: number;
    hallucination: number;
  };
  reviewer_notes: string;
}

export function QualitativeEvalClient() {
  const [data, setData] = useState<EvalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: EvalData = {
      "evaluation_id": "eval-qual-773",
      "artifacts": {
        "source": "api/users.py",
        "target": "docs/users.md"
      },
      "ai_generation": "The API implementation currently uses Pydantic V2 models for schema validation, however, the documentation still references the deprecated V1 `dict()` method instead of the new `model_dump()` method. This constitutes a medium-severity documentation drift.",
      "human_ground_truth": "Drift detected. The documentation shows `user.dict()` which is deprecated in Pydantic V2 used in the source code. Should be updated to `user.model_dump()`.",
      "grades": {
        "accuracy": 5,
        "clarity": 4,
        "hallucination": 0
      },
      "reviewer_notes": "The AI successfully identified the specific Pydantic version mismatch between the codebase and the markdown docs. Slightly verbose, but mathematically accurate with zero hallucinations."
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
           <span>Loading human-in-the-loop comparison...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Qualitative Evaluation</h1>
          <p className="text-muted-foreground mt-2">
            Side-by-side comparison of AI-generated drift analysis vs Expert Ground Truth.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
              <Hash className="w-4 h-4 text-blue-400" />
              <div>
                 <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Evaluation ID</p>
                 <p className="text-sm font-bold font-mono">{data?.evaluation_id}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="mb-6 px-6 py-4 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm flex items-center gap-4">
         <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Pair:</span>
         <div className="flex items-center gap-3 font-mono text-sm bg-secondary/50 px-3 py-1.5 rounded-md border border-border">
           <Code2 className="w-4 h-4 text-primary" />
           {data?.artifacts.source}
         </div>
         <ChevronRight className="w-4 h-4 text-muted-foreground" />
         <div className="flex items-center gap-3 font-mono text-sm bg-secondary/50 px-3 py-1.5 rounded-md border border-border">
           <Code2 className="w-4 h-4 text-orange-400" />
           {data?.artifacts.target}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
         
         {/* AI Card */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 group-hover:bg-primary transition-colors"></div>
            <div className="p-5 border-b border-border bg-secondary/30 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <span className="font-bold">AI Generated Analysis</span>
            </div>
            <div className="p-6 flex-1 text-foreground/90 leading-relaxed text-[15px]">
               {data?.ai_generation.split('`').map((text, i) => 
                 i % 2 === 1 ? <code key={i} className="bg-secondary text-primary px-1.5 py-0.5 rounded text-sm font-mono">{text}</code> : text
               )}
            </div>
         </div>

         {/* Human Card */}
         <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500/80 group-hover:bg-green-500 transition-colors"></div>
            <div className="p-5 border-b border-border bg-secondary/30 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-400" />
              <span className="font-bold">Human Ground Truth</span>
            </div>
            <div className="p-6 flex-1 text-foreground/90 leading-relaxed text-[15px]">
               {data?.human_ground_truth.split('`').map((text, i) => 
                 i % 2 === 1 ? <code key={i} className="bg-secondary text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">{text}</code> : text
               )}
            </div>
         </div>

      </div>

      {/* Grading Section */}
      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col shadow-sm">
         <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
           <Star className="w-4 h-4 text-yellow-400" /> Human Evaluator Grading
         </div>
         
         <div className="p-6 flex gap-8">
            
            <div className="flex flex-col gap-6 w-1/3 border-r border-border pr-8">
               
               <div>
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Accuracy</span>
                   <span className="text-lg font-black text-foreground">{data?.grades.accuracy}<span className="text-sm text-muted-foreground font-normal">/5</span></span>
                 </div>
                 <div className="flex gap-1 h-2">
                    {[1,2,3,4,5].map(v => <div key={v} className={`flex-1 rounded-full ${v <= (data?.grades.accuracy || 0) ? 'bg-primary' : 'bg-secondary'}`}></div>)}
                 </div>
               </div>

               <div>
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Clarity</span>
                   <span className="text-lg font-black text-foreground">{data?.grades.clarity}<span className="text-sm text-muted-foreground font-normal">/5</span></span>
                 </div>
                 <div className="flex gap-1 h-2">
                    {[1,2,3,4,5].map(v => <div key={v} className={`flex-1 rounded-full ${v <= (data?.grades.clarity || 0) ? 'bg-blue-400' : 'bg-secondary'}`}></div>)}
                 </div>
               </div>

               <div>
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hallucination</span>
                   <span className="text-lg font-black text-green-400">{data?.grades.hallucination}<span className="text-sm text-muted-foreground font-normal"> issues</span></span>
                 </div>
                 <div className="flex gap-1 h-2">
                    <div className="flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                 </div>
               </div>

            </div>

            <div className="flex-1 flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-3">
                 <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                 <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Reviewer Notes</span>
               </div>
               <p className="text-[15px] italic text-foreground/80 leading-relaxed border-l-2 border-primary/50 pl-4 bg-secondary/10 p-4 rounded-r-lg">
                 "{data?.reviewer_notes}"
               </p>
            </div>

         </div>
      </div>

    </div>
  );
}
