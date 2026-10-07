"use client";

import { useEffect, useState, use } from "react";
import { Cpu, Maximize, BrainCircuit, Hash, Box, BarChart3, ScatterChart as ScatterIcon } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

interface EmbeddingChunk {
  chunk_id: string;
  fact_type: string;
  content: string;
  vector_preview: any[];
  pca_2d: { x: number, y: number };
}

interface EmbeddingsData {
  repository: string;
  model: string;
  dimensions: number;
  total_vectors: number;
  chunks: EmbeddingChunk[];
}

export function EmbeddingsClient({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const resolvedParams = use(searchParams);
  const repoId = resolvedParams.repo || "tiangolo-fastapi";
  
  const [data, setData] = useState<EmbeddingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChunk, setSelectedChunk] = useState<EmbeddingChunk | null>(null);

  useEffect(() => {
    const mockData = {
      repository: repoId,
      model: "text-embedding-3-small",
      dimensions: 1536,
      total_vectors: 1250,
      chunks: [
        {
          chunk_id: "chunk-1001",
          fact_type: "CLASS",
          content: "class User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username",
          vector_preview: [0.0124, -0.0451, 0.0892, -0.1021, 0.0335, -0.0014, 0.0568, "... (1529 more)"],
          pca_2d: {x: 12.5, y: -4.2}
        },
        {
          chunk_id: "chunk-1002",
          fact_type: "FUNCTION",
          content: "@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"",
          vector_preview: [-0.0221, 0.0315, 0.0447, -0.0128, 0.0913, 0.0244, -0.0661, "... (1529 more)"],
          pca_2d: {x: 18.1, y: 2.4}
        },
        {
          chunk_id: "chunk-1003",
          fact_type: "MARKDOWN",
          content: "## Users API\nThe users API allows you to create and manage accounts.",
          vector_preview: [0.0521, -0.0115, 0.0247, 0.0128, 0.0113, -0.0844, -0.0161, "... (1529 more)"],
          pca_2d: {x: 14.2, y: 3.1}
        },
        {
          chunk_id: "chunk-1004",
          fact_type: "TEST",
          content: "def test_create_user():\n    response = client.post('/users', json={'username': 'test'})",
          vector_preview: [-0.0621, 0.0815, -0.0147, -0.0328, 0.0513, 0.0144, 0.0761, "... (1529 more)"],
          pca_2d: {x: 17.5, y: 8.4}
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
          <BrainCircuit className="w-5 h-5 animate-spin" />
          <span>Generating Embeddings...</span>
        </div>
      </div>
    );
  }

  const chartData = data?.chunks.map((c) => ({
    ...c.pca_2d,
    id: c.chunk_id,
    type: c.fact_type,
    fill: c.fact_type === "CLASS" ? "#8b5cf6" : 
          c.fact_type === "FUNCTION" ? "#3b82f6" : 
          c.fact_type === "TEST" ? "#10b981" : "#f59e0b"
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Embeddings Space</h1>
          <p className="text-muted-foreground mt-2">
            Vector representations of <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{repoId}</span> chunks
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
             <Cpu className="w-4 h-4 text-primary" />
             <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Model</p>
                <p className="text-sm font-bold font-mono">{data?.model}</p>
             </div>
          </div>
          <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
             <Maximize className="w-4 h-4 text-blue-400" />
             <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dimensions</p>
                <p className="text-sm font-bold font-mono">{data?.dimensions}</p>
             </div>
          </div>
          <div className="px-4 py-2 rounded-lg border border-border bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-sm">
             <Hash className="w-4 h-4 text-green-400" />
             <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vectors</p>
                <p className="text-sm font-bold font-mono">{data?.total_vectors.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: 2D PCA Plot */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
            <div className="flex items-center gap-2">
              <ScatterIcon className="w-4 h-4 text-purple-400" /> PCA Dimensionality Reduction (2D)
            </div>
          </div>
          <div className="flex-1 relative p-4 bg-background/20">
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" dataKey="x" name="PCA-1" stroke="#666" tick={{fill: '#666'}} />
                  <YAxis type="number" dataKey="y" name="PCA-2" stroke="#666" tick={{fill: '#666'}} />
                  <ZAxis type="number" range={[100, 100]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload;
                        return (
                          <div className="bg-black/90 border border-border p-3 rounded-lg shadow-xl">
                             <p className="font-mono text-xs text-primary mb-1">{point.id}</p>
                             <p className="font-mono text-[10px] text-muted-foreground">{point.type}</p>
                             <div className="mt-2 text-xs">
                               <p>X: {point.x.toFixed(2)}</p>
                               <p>Y: {point.y.toFixed(2)}</p>
                             </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Chunks" 
                    data={chartData} 
                    fill="#8884d8" 
                    onClick={(node: any) => {
                      const matched = data?.chunks?.find((c) => c.chunk_id === node.id);
                      if (matched) setSelectedChunk(matched);
                    }}
                    className="cursor-pointer transition-all hover:opacity-80"
                  />
                </ScatterChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Selected Chunk Details & Vectors */}
        <div className="w-[450px] shrink-0 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Vector Inspection
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
             {!selectedChunk ? (
               <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                 <Box className="w-12 h-12 mb-4 opacity-20" />
                 <p className="text-sm">Select a point on the scatter plot or a chunk below to inspect its vector representation.</p>
               </div>
             ) : (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30 mb-2">
                      {selectedChunk.fact_type}
                    </div>
                    <h3 className="font-mono text-lg font-bold">{selectedChunk.chunk_id}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Semantic Text Payload</p>
                    <div className="p-3 bg-secondary/30 rounded-md border border-border font-mono text-xs whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {selectedChunk.content}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vector Space Representation ({data?.dimensions}d)</p>
                    <div className="grid grid-cols-4 gap-1 p-3 bg-secondary/30 rounded-md border border-border font-mono text-[10px]">
                      {selectedChunk.vector_preview.map((val, idx) => (
                        <div key={idx} className={`p-1 text-center rounded ${typeof val === 'string' ? 'col-span-4 text-muted-foreground' : val > 0 ? 'bg-primary/20 text-primary font-bold' : 'bg-destructive/20 text-destructive font-bold'}`}>
                          {typeof val === 'number' ? val.toFixed(4) : val}
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
             )}
          </div>
          
          <div className="h-64 border-t border-border bg-secondary/20 overflow-y-auto p-2 space-y-1">
             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">All Document Vectors</p>
             {data?.chunks.map(chunk => (
               <button 
                 key={chunk.chunk_id}
                 onClick={() => setSelectedChunk(chunk)}
                 className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${selectedChunk?.chunk_id === chunk.chunk_id ? 'bg-primary/20 border border-primary/30' : 'hover:bg-secondary/50 border border-transparent'}`}
               >
                 <span className="font-mono text-xs font-medium">{chunk.chunk_id}</span>
                 <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-muted-foreground">{chunk.fact_type}</span>
               </button>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
