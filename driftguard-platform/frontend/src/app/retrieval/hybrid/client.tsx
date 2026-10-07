"use client";

import { useState } from "react";
import { Search, SplitSquareHorizontal, Target, Code2, Play, Hash, ArrowRight } from "lucide-react";

interface RetrievalResult {
  chunk_id: string;
  file: string;
  fact_type: string;
  content: string;
  final_score: number;
  dense_score: number;
  bm25_normalized: number;
}

interface HybridRetrievalData {
  query: string;
  strategy: string;
  alpha_dense: number;
  top_k: number;
  results: RetrievalResult[];
}

export function HybridRetrievalClient() {
  const [query, setQuery] = useState("How is a user account created and stored?");
  const [alpha, setAlpha] = useState(0.7);
  const [data, setData] = useState<HybridRetrievalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    // Mock the backend fetch
    const mockData: HybridRetrievalData = {
      "query": query,
      "strategy": "Convex Combination",
      "alpha_dense": alpha,
      "top_k": 3,
      "results": [
        {
          "chunk_id": "chunk-1002",
          "file": "api/users.py",
          "fact_type": "FUNCTION",
          "content": "@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"\n    # implementation\n    session.add(user)\n    session.commit()\n    return user",
          "final_score": 0.8919,
          "dense_score": 0.9245,
          "bm25_normalized": 0.8170
        },
        {
          "chunk_id": "chunk-1003",
          "file": "docs/users.md",
          "fact_type": "MARKDOWN",
          "content": "## Users API\nThe users API allows you to create and manage accounts by making a POST request to /users. The database handles commit natively.",
          "final_score": 0.8541,
          "dense_score": 0.8812,
          "bm25_normalized": 0.7910
        },
        {
          "chunk_id": "chunk-1001",
          "file": "api/users.py",
          "fact_type": "CLASS",
          "content": "class User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username",
          "final_score": 0.6931,
          "dense_score": 0.7451,
          "bm25_normalized": 0.5720
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
      setSearched(true);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Hybrid Retrieval Lab</h1>
        <p className="text-muted-foreground mt-2">
          Evaluate combined Dense (Semantic) and BM25 (Sparse) retrieval using Convex Combination weighting.
        </p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Query & Pipeline */}
        <div className="w-[450px] flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 pb-4">
          
          <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
             <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
               <Search className="w-4 h-4 text-primary" /> Query Input
             </div>
             <div className="p-4 space-y-4">
               <div>
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Natural Language Query</label>
                 <textarea
                   className="w-full bg-secondary/30 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
               </div>
               
               <div>
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
                   <span>Dense vs Sparse (Alpha)</span>
                   <span className="text-primary font-mono">{alpha.toFixed(2)}</span>
                 </label>
                 <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                   <span>Sparse</span>
                   <input
                     type="range"
                     min="0"
                     max="1"
                     step="0.05"
                     value={alpha}
                     onChange={(e) => setAlpha(parseFloat(e.target.value))}
                     className="flex-1 accent-primary"
                   />
                   <span>Dense</span>
                 </div>
               </div>

               <div className="flex gap-4 pt-2">
                 <div className="flex-1">
                   <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Top K</label>
                   <select className="w-full bg-secondary/30 border border-border rounded-md p-2 text-sm focus:outline-none">
                     <option>3</option>
                     <option>5</option>
                     <option>10</option>
                   </select>
                 </div>
                 <div className="flex-1">
                   <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Fusion Strategy</label>
                   <select className="w-full bg-secondary/30 border border-border rounded-md p-2 text-sm focus:outline-none">
                     <option>Convex Comb.</option>
                     <option>RRF</option>
                   </select>
                 </div>
               </div>
               
               <button 
                 onClick={handleSearch}
                 disabled={loading}
                 className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <SplitSquareHorizontal className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                 {loading ? "Fusing Modalities..." : "Execute Hybrid Search"}
               </button>
             </div>
          </div>

          {searched && data && (
            <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm animate-in slide-in-from-bottom-4">
               <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
                 <SplitSquareHorizontal className="w-4 h-4 text-purple-400" /> Fusion Mathematics
               </div>
               <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-muted-foreground">Combination Strategy</span>
                   <span className="font-mono bg-secondary px-2 py-0.5 rounded">{data.strategy}</span>
                 </div>
                 <div className="p-4 bg-secondary/20 rounded-md border border-border font-mono text-xs flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                    <p className="text-muted-foreground font-medium">Score = (α * Dense) + ((1 - α) * BM25_Norm)</p>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <p className="text-primary font-bold">Score = ({data.alpha_dense} * Dense) + ({(1 - data.alpha_dense).toFixed(2)} * Sparse)</p>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Right: Results */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" /> Hybrid Results
            </div>
            {searched && data && (
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Top {data.top_k} matches</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-background/20 relative">
             {!searched ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <SplitSquareHorizontal className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Enter a query to see Dense and Sparse rankings merged via Alpha weighting.</p>
                </div>
             ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                   {data?.results.map((result, index) => (
                      <div key={result.chunk_id} className="rounded-xl border border-border bg-secondary/10 overflow-hidden hover:border-primary/50 transition-colors shadow-sm relative group">
                        
                        <div className="absolute top-0 right-0 p-3 flex flex-col items-end">
                           <div className="text-2xl font-black text-foreground/20 group-hover:text-primary/20 transition-colors">
                             #{index + 1}
                           </div>
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary/80 rounded-md border border-border">
                                   <Code2 className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                   <div className="font-mono text-sm font-bold flex items-center gap-2">
                                     {result.file}
                                     <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-sans tracking-wide">
                                       {result.fact_type}
                                     </span>
                                   </div>
                                   <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Hash className="w-3 h-3" /> {result.chunk_id}
                                   </div>
                                </div>
                             </div>
                             <div className="flex flex-col items-end">
                                <div className="text-xl font-bold text-green-400">
                                   {result.final_score.toFixed(4)}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                   Combined Score
                                </div>
                             </div>
                           </div>
                           
                           {/* Breakdown of Scores */}
                           <div className="flex gap-2 mt-2">
                             <div className="flex-1 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-center">
                               <p className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">Dense Score</p>
                               <p className="font-mono text-sm font-semibold">{result.dense_score.toFixed(4)}</p>
                             </div>
                             <div className="flex items-center text-muted-foreground text-xs font-mono">+</div>
                             <div className="flex-1 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-center">
                               <p className="text-[10px] uppercase tracking-wider text-orange-400 mb-1">BM25 (Norm)</p>
                               <p className="font-mono text-sm font-semibold">{result.bm25_normalized.toFixed(4)}</p>
                             </div>
                             <div className="flex items-center text-muted-foreground text-xs font-mono">=</div>
                             <div className="flex-1 p-2 bg-green-500/10 border border-green-500/20 rounded text-center">
                               <p className="text-[10px] uppercase tracking-wider text-green-400 mb-1">Final Score</p>
                               <p className="font-mono text-sm font-semibold text-green-400">{result.final_score.toFixed(4)}</p>
                             </div>
                           </div>

                           <div className="mt-2 p-3 bg-secondary/30 rounded-md border border-border font-mono text-xs whitespace-pre-wrap text-foreground/90 leading-relaxed shadow-inner">
                              {result.content}
                           </div>
                        </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
