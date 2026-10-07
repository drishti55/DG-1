"use client";

import { useState } from "react";
import { Search, BrainCircuit, Target, Code2, Play, Hash } from "lucide-react";

interface RetrievalResult {
  chunk_id: string;
  file: string;
  fact_type: string;
  content: string;
  score: number;
  distance_metric: string;
}

interface DenseRetrievalData {
  query: string;
  embedding_model: string;
  query_vector_preview: any[];
  top_k: number;
  results: RetrievalResult[];
}

export function DenseRetrievalClient() {
  const [query, setQuery] = useState("How is a user account created and stored?");
  const [data, setData] = useState<DenseRetrievalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    // Mock the backend fetch
    const mockData = {
      "query": query,
      "embedding_model": "text-embedding-3-small",
      "query_vector_preview": [-0.0123, 0.0541, 0.0332, -0.0118, 0.0994, 0.0122, -0.0561, "... (1529 more)"],
      "top_k": 3,
      "results": [
        {
          "chunk_id": "chunk-1002",
          "file": "api/users.py",
          "fact_type": "FUNCTION",
          "content": "@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"\n    # implementation\n    session.add(user)\n    session.commit()\n    return user",
          "score": 0.9245,
          "distance_metric": "cosine"
        },
        {
          "chunk_id": "chunk-1003",
          "file": "docs/users.md",
          "fact_type": "MARKDOWN",
          "content": "## Users API\nThe users API allows you to create and manage accounts by making a POST request to /users. The database handles commit natively.",
          "score": 0.8812,
          "distance_metric": "cosine"
        },
        {
          "chunk_id": "chunk-1001",
          "file": "api/users.py",
          "fact_type": "CLASS",
          "content": "class User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username",
          "score": 0.7451,
          "distance_metric": "cosine"
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
        <h1 className="text-3xl font-bold tracking-tight">Dense Retrieval Lab</h1>
        <p className="text-muted-foreground mt-2">
          Evaluate vector-space semantic search and cosine similarity ranking.
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
               
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Top K</label>
                   <select className="w-full bg-secondary/30 border border-border rounded-md p-2 text-sm focus:outline-none">
                     <option>3</option>
                     <option>5</option>
                     <option>10</option>
                   </select>
                 </div>
                 <div className="flex-1">
                   <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Distance</label>
                   <select className="w-full bg-secondary/30 border border-border rounded-md p-2 text-sm focus:outline-none">
                     <option>Cosine</option>
                     <option>L2</option>
                     <option>Dot Product</option>
                   </select>
                 </div>
               </div>
               
               <button 
                 onClick={handleSearch}
                 disabled={loading}
                 className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                 {loading ? "Embedding Query..." : "Execute Retrieval"}
               </button>
             </div>
          </div>

          {searched && data && (
            <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm animate-in slide-in-from-bottom-4">
               <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
                 <BrainCircuit className="w-4 h-4 text-purple-400" /> Query Vectorization
               </div>
               <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-muted-foreground">Embedding Model</span>
                   <span className="font-mono bg-secondary px-2 py-0.5 rounded">{data.embedding_model}</span>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Generated Query Vector (1536d)</p>
                    <div className="grid grid-cols-4 gap-1 p-2 bg-secondary/30 rounded-md border border-border font-mono text-[10px]">
                      {data.query_vector_preview.map((val, idx) => (
                        <div key={idx} className={`p-1 text-center rounded ${typeof val === 'string' ? 'col-span-4 text-muted-foreground' : val > 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                          {typeof val === 'number' ? val.toFixed(4) : val}
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Right: Results */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" /> Retrieval Results
            </div>
            {searched && data && (
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Top {data.top_k} matches</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-background/20 relative">
             {!searched ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Enter a query and execute retrieval to search the semantic vector space.</p>
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
                                <div className="text-lg font-bold text-green-400">
                                   {result.score.toFixed(4)}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                   {result.distance_metric}
                                </div>
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
