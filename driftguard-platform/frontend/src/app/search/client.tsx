"use client";

import { useEffect, useState } from "react";
import { Search, Filter, AlertTriangle, AlertCircle, FileCode, CheckSquare, SearchX, X, SlidersHorizontal, AlertOctagon } from "lucide-react";

interface SearchResult {
  id: string;
  file_path: string;
  severity: string;
  confidence: number;
  description: string;
  timestamp: string;
}

interface SearchData {
  total_results: number;
  query: string;
  filters_applied: {
    severity: string[];
    min_confidence: number;
  };
  results: SearchResult[];
}

export function SearchClient() {
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("authentication");

  useEffect(() => {
    // Mock backend fetch
    const mockData: SearchData = {
      "total_results": 142,
      "query": "authentication",
      "filters_applied": {
        "severity": ["HIGH", "CRITICAL"],
        "min_confidence": 0.85
      },
      "results": [
        {
          "id": "drift_auth_01",
          "file_path": "backend/auth/jwt_handler.py",
          "severity": "CRITICAL",
          "confidence": 0.98,
          "description": "JWT validation logic diverged from OpenAPI spec security definitions. Algorithm hardcoded to HS256 instead of RS256.",
          "timestamp": "2026-10-07T06:12:00Z"
        },
        {
          "id": "drift_auth_02",
          "file_path": "frontend/src/lib/auth-client.ts",
          "severity": "HIGH",
          "confidence": 0.89,
          "description": "Client-side session refresh token is being stored in localStorage instead of httpOnly cookies as specified in RFC-442.",
          "timestamp": "2026-10-07T05:45:00Z"
        },
        {
          "id": "drift_auth_03",
          "file_path": "infrastructure/k8s/secrets.yaml",
          "severity": "HIGH",
          "confidence": 0.92,
          "description": "Kubernetes manifest specifies plaintext environment variables for database passwords, violating security architecture baseline.",
          "timestamp": "2026-10-06T14:22:10Z"
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // simulate reload
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-y-auto pr-2">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Semantic Search & Explorer</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
           <div className="relative flex-1 group">
              <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              <input 
                 type="text" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 className="w-full bg-black/40 backdrop-blur-md border border-border rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                 placeholder="Search for drift patterns, specific files, or architectural violations..."
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                 <button type="button" className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                    <SlidersHorizontal className="w-5 h-5" />
                 </button>
                 <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                    Search
                 </button>
              </div>
           </div>
        </form>

        {data && (
           <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Filters applied:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border">
                 Severity: {data.filters_applied.severity.join(', ')}
                 <button className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border">
                 Min Confidence: {data.filters_applied.min_confidence * 100}%
                 <button className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
              </span>
           </div>
        )}
      </div>

      <div className="flex-1">
         {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
              <Search className="w-8 h-8 animate-pulse text-primary" />
              <p>Querying vector space...</p>
           </div>
         ) : data ? (
           <>
              <p className="text-sm text-muted-foreground mb-4">Found {data.total_results} results across all tracked repositories.</p>
              
              <div className="flex flex-col gap-4">
                 {data.results.map((result) => (
                   <div key={result.id} className="p-5 rounded-xl border border-border bg-black/40 backdrop-blur-md shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
                      
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                            {result.severity === 'CRITICAL' ? (
                               <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                  <AlertOctagon className="w-4 h-4 text-red-500" />
                               </div>
                            ) : (
                               <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                               </div>
                            )}
                            <div>
                               <p className="font-mono text-sm text-blue-400 group-hover:underline flex items-center gap-2">
                                  <FileCode className="w-4 h-4" /> {result.file_path}
                               </p>
                            </div>
                         </div>
                         
                         <div className="flex flex-col items-end gap-2">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                               result.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                            }`}>
                               {result.severity}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                               {(result.confidence * 100).toFixed(1)}% Confidence
                            </span>
                         </div>
                      </div>

                      <p className="text-foreground/90 text-sm leading-relaxed mb-4 pl-11">
                         {result.description}
                      </p>

                      <div className="pl-11 flex items-center gap-4 text-xs text-muted-foreground">
                         <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> ID: {result.id}</span>
                         <span>•</span>
                         <span>Detected: {new Date(result.timestamp).toLocaleString()}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </>
         ) : (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
              <SearchX className="w-8 h-8" />
              <p>No results found.</p>
           </div>
         )}
      </div>

    </div>
  );
}
