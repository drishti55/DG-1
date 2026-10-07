"use client";

import { useEffect, useState } from "react";
import { FolderSearch, Search, Filter, Star, Code2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Repository {
  id: string;
  name: string;
  language: string;
  stars: number;
  total_cases: number;
  drift_cases: number;
  last_analyzed: string;
  status: string;
}

export default function RepositoryExplorerPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      {
        id: "tiangolo-fastapi",
        name: "tiangolo/fastapi",
        language: "python",
        stars: 60500,
        total_cases: 1250,
        drift_cases: 45,
        last_analyzed: "2026-10-06T10:00:00Z",
        status: "ANALYZED",
      },
      {
        id: "huggingface-transformers",
        name: "huggingface/transformers",
        language: "python",
        stars: 115000,
        total_cases: 4500,
        drift_cases: 120,
        last_analyzed: "2026-10-05T14:30:00Z",
        status: "ANALYZED",
      },
      {
        id: "langchain-ai-langchain",
        name: "langchain-ai/langchain",
        language: "python",
        stars: 85000,
        total_cases: 3200,
        drift_cases: 85,
        last_analyzed: "2026-10-04T09:15:00Z",
        status: "ANALYZED",
      }
    ];

    setTimeout(() => {
      setRepos(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <FolderSearch className="w-5 h-5 animate-spin" />
          <span>Loading Repositories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repository Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Explore the {repos.length} ingested repositories and their drift statistics.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search repositories..." 
            className="w-full bg-black/40 border border-border rounded-md py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md border border-border hover:bg-secondary/80 transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div key={repo.id} className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col hover:border-primary/50 transition-colors group">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-secondary/50 rounded-md border border-border">
                    <FolderSearch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{repo.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" /> {(repo.stars / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Cases</p>
                  <p className="text-xl font-bold">{repo.total_cases.toLocaleString()}</p>
                </div>
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <p className="text-xs text-destructive/80 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Drift Cases
                  </p>
                  <p className="text-xl font-bold text-destructive">{repo.drift_cases.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-4 bg-secondary/20 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(repo.last_analyzed).toLocaleDateString()}
              </span>
              <Link href={`/repository/${repo.id}`} className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                View Analysis <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
