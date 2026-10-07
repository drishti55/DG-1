"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { FolderSearch, ArrowLeft, GitMerge, Network, FileCode2, Scissors, ShieldCheck } from "lucide-react";

interface RepositoryMetrics {
  python_files: number;
  functions: number;
  classes: number;
  ast_facts: number;
  graph_edges: number;
}

interface Repository {
  id: string;
  name: string;
  language: string;
  stars: number;
  total_cases: number;
  drift_cases: number;
  last_analyzed: string;
  status: string;
  metrics: RepositoryMetrics;
}

export function SingleRepositoryClient({ params }: { params: Promise<{ id: string }> }) {
  const { id: repoId } = use(params);
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      "tiangolo-fastapi": {
        id: "tiangolo-fastapi",
        name: "tiangolo/fastapi",
        language: "python",
        stars: 60500,
        total_cases: 1250,
        drift_cases: 45,
        last_analyzed: "2026-10-06T10:00:00Z",
        status: "ANALYZED",
        metrics: {
          python_files: 1138,
          functions: 6867,
          classes: 713,
          ast_facts: 31974,
          graph_edges: 51787
        }
      }
    };

    setTimeout(() => {
      // @ts-ignore
      setRepo(mockData[repoId] || mockData["tiangolo-fastapi"]);
      setLoading(false);
    }, 500);
  }, [repoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <FolderSearch className="w-5 h-5 animate-spin" />
          <span>Loading Repository Data...</span>
        </div>
      </div>
    );
  }

  if (!repo) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Link href="/repository" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Repositories
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/50 rounded-xl border border-border">
            <FolderSearch className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{repo.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
              <span className="px-2 py-0.5 rounded-md bg-secondary border border-border">{repo.language}</span>
              <span>Last analyzed: {new Date(repo.last_analyzed).toLocaleString()}</span>
              <span className="text-primary flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> {repo.status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Python Files", value: repo.metrics.python_files, icon: FileCode2 },
          { label: "Functions", value: repo.metrics.functions, icon: Scissors },
          { label: "Classes", value: repo.metrics.classes, icon: GitMerge },
          { label: "AST Facts", value: repo.metrics.ast_facts, icon: Network },
          { label: "Graph Edges", value: repo.metrics.graph_edges, icon: Network },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <stat.icon className="w-4 h-4" />
              <p className="text-xs font-medium">{stat.label}</p>
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={`/ast?repo=${repo.id}`} className="group p-6 rounded-xl border border-border bg-black/40 hover:bg-secondary/40 hover:border-primary/50 transition-all">
          <div className="p-3 bg-primary/10 w-fit rounded-lg border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
            <GitMerge className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">AST Explorer</h3>
          <p className="text-sm text-muted-foreground">View abstract syntax trees and structural facts.</p>
        </Link>
        
        <Link href={`/graph?repo=${repo.id}`} className="group p-6 rounded-xl border border-border bg-black/40 hover:bg-secondary/40 hover:border-primary/50 transition-all">
          <div className="p-3 bg-primary/10 w-fit rounded-lg border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Relationship Graph</h3>
          <p className="text-sm text-muted-foreground">Explore cross-artifact dependency mappings.</p>
        </Link>
        
        <Link href={`/dataset?repo=${repo.id}`} className="group p-6 rounded-xl border border-border bg-black/40 hover:bg-secondary/40 hover:border-primary/50 transition-all">
          <div className="p-3 bg-destructive/10 w-fit rounded-lg border border-destructive/20 mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-destructive transition-colors">View Drift Cases</h3>
          <p className="text-sm text-muted-foreground">Examine the {repo.drift_cases} identified semantic inconsistencies.</p>
        </Link>
      </div>
    </div>
  );
}
