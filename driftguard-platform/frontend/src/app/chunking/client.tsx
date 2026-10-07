"use client";

import { useEffect, useState, use } from "react";
import { Scissors, FileCode2, Layers, AlignLeft, Hash, Boxes } from "lucide-react";
import Editor from "@monaco-editor/react";

interface AstUnit {
  id: string;
  type: string;
  name: string;
  lines: string;
}

interface Chunk {
  chunk_id: string;
  file: string;
  lines: string;
  artifact_type: string;
  fact_type: string;
  content: string;
  char_count: number;
  metadata: Record<string, any>;
  hash: string;
}

interface ChunkData {
  repository: string;
  file_path: string;
  source_code: string;
  ast_units: AstUnit[];
  chunks: Chunk[];
}

export function ChunkingClient({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const resolvedParams = use(searchParams);
  const repoId = resolvedParams.repo || "tiangolo-fastapi";
  
  const [data, setData] = useState<ChunkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      repository: repoId,
      file_path: "api/users.py",
      source_code: "from fastapi import FastAPI\nfrom core.security import verify_password\n\nclass User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username\n\n    def get_full_name(self) -> str:\n        return self.username\n\n@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"\n    # implementation\n    session.add(user)\n    session.commit()\n    return user\n",
      ast_units: [
        { id: "unit-1", type: "CLASS", name: "User", lines: "L4-L10" },
        { id: "unit-2", type: "FUNCTION", name: "create_user", lines: "L12-L18" }
      ],
      chunks: [
        {
          chunk_id: "chunk-1001",
          file: "api/users.py",
          lines: "4-10",
          artifact_type: "Code",
          fact_type: "CLASS",
          content: "class User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username\n\n    def get_full_name(self) -> str:\n        return self.username",
          char_count: 194,
          metadata: { repo: "tiangolo/fastapi", has_docstring: true },
          hash: "8f2a7b9e3d1c6f4a2b8e5d9c0f1a3b6e"
        },
        {
          chunk_id: "chunk-1002",
          file: "api/users.py",
          lines: "12-18",
          artifact_type: "Code",
          fact_type: "FUNCTION",
          content: "@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"\n    # implementation\n    session.add(user)\n    session.commit()\n    return user",
          char_count: 165,
          metadata: { repo: "tiangolo/fastapi", has_decorators: true },
          hash: "4c9b2a1e8f3d6c5b4a9e2d1f0c8b3a7e"
        }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 600);
  }, [repoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <Scissors className="w-5 h-5 animate-spin" />
          <span>Semantic Chunking in Progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Semantic Chunking Lab</h1>
        <p className="text-muted-foreground mt-2">
          Visualizing AST-guided document segmentation for <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{repoId}</span>
        </p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Source File */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
            <FileCode2 className="w-4 h-4" /> Original Source
          </div>
          <div className="p-2 border-b border-border bg-secondary/20 font-mono text-xs text-muted-foreground">
            {data?.file_path}
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={data?.source_code}
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
            />
          </div>
        </div>

        {/* Middle: AST Extraction map */}
        <div className="w-72 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
            <Layers className="w-4 h-4 text-purple-400" /> Semantic Boundaries
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-xs text-muted-foreground mb-4">The AST parser identified the following distinct semantic units in this file.</p>
            {data?.ast_units.map(unit => (
              <div key={unit.id} className="p-3 rounded-lg border border-border bg-secondary/30 relative shadow-sm">
                <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-md"></div>
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-bold tracking-wider text-purple-400 uppercase">{unit.type}</span>
                   <span className="text-[10px] font-mono text-muted-foreground bg-black/50 px-1.5 rounded">{unit.lines}</span>
                </div>
                <div className="font-mono text-sm text-foreground">{unit.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chunk View */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-primary" /> Generated Chunks
            </div>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{data?.chunks.length} chunks</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {data?.chunks.map(chunk => (
              <div key={chunk.chunk_id} className="rounded-xl border border-border bg-secondary/10 overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                 <div className="p-3 bg-secondary/40 border-b border-border flex justify-between items-center text-xs">
                   <div className="flex items-center gap-3">
                     <span className="font-mono text-primary font-bold">{chunk.chunk_id}</span>
                     <span className="text-muted-foreground font-mono">{chunk.file}:{chunk.lines}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded border border-border bg-black/50">{chunk.fact_type}</span>
                   </div>
                 </div>
                 <div className="p-4">
                    <pre className="font-mono text-xs text-foreground/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {chunk.content}
                    </pre>
                 </div>
                 <div className="p-3 border-t border-border bg-secondary/20 text-[10px] flex justify-between items-center text-muted-foreground font-mono">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {chunk.char_count} chars</span>
                      <span>{JSON.stringify(chunk.metadata)}</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary/70" title="Embedding Hash">
                      <Hash className="w-3 h-3" /> {chunk.hash.substring(0,10)}
                    </span>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
