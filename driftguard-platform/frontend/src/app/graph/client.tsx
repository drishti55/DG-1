"use client";

import { useEffect, useState, use, useCallback } from "react";
import { Network, Search, Link2, ShieldCheck, XCircle, FileCode2, ArrowRight } from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Edge,
  Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeTypesConfig: Record<string, string> = {
  "Code": "border-blue-500/50 bg-blue-500/10 text-blue-400",
  "Documentation": "border-purple-500/50 bg-purple-500/10 text-purple-400",
  "Tests": "border-green-500/50 bg-green-500/10 text-green-400",
  "Configuration": "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  "Dependencies": "border-orange-500/50 bg-orange-500/10 text-orange-400"
};

function CustomNode({ data }: { data: { label: string, type: string } }) {
  const style = nodeTypesConfig[data.type] || "border-border bg-secondary/50 text-foreground";
  return (
    <div className={`px-4 py-2 rounded-md border shadow-sm flex items-center gap-2 ${style}`}>
      <FileCode2 className="w-4 h-4 opacity-70" />
      <span className="font-mono text-xs font-medium">{data.label}</span>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  evidence: string;
  verification: string;
}

export function GraphClient({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const resolvedParams = use(searchParams);
  const repoId = resolvedParams.repo || "tiangolo-fastapi";
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedEdgeData, setSelectedEdgeData] = useState<GraphEdge | null>(null);

  useEffect(() => {
    const mockGraph = {
      repository: repoId,
      nodes: [
        { id: "n1", label: "api/users.py", type: "Code", x: 400, y: 100 },
        { id: "n2", label: "create_user()", type: "Code", x: 400, y: 300 },
        { id: "n3", label: "docs/users.md", type: "Documentation", x: 100, y: 300 },
        { id: "n4", label: "tests/test_users.py", type: "Tests", x: 700, y: 300 },
        { id: "n5", label: "requirements.txt", type: "Dependencies", x: 100, y: 500 },
        { id: "n6", label: "core/config.py", type: "Configuration", x: 400, y: 500 }
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2", label: "CONTAINS", evidence: "api/users.py:L25", verification: "VERIFIED" },
        { id: "e2", source: "n3", target: "n2", label: "DOCUMENTS_API", evidence: "docs/users.md states GET /users", verification: "DRIFT FOUND" },
        { id: "e3", source: "n4", target: "n2", label: "TESTS", evidence: "test_create_user() invokes API", verification: "VERIFIED" },
        { id: "e4", source: "n5", target: "n6", label: "CONFIGURES", evidence: "requirements.txt specifies pydantic==1.10.8 vs Pydantic V2", verification: "DRIFT FOUND" }
      ]
    };

    setTimeout(() => {
      const rfNodes = mockGraph.nodes.map(n => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: n.label, type: n.type },
        type: 'custom'
      }));
      
      const rfEdges = mockGraph.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        data: { ...e },
        style: { stroke: e.verification === 'DRIFT FOUND' ? '#ef4444' : '#10b981', strokeWidth: 2 },
        animated: e.verification === 'DRIFT FOUND'
      }));

      setNodes(rfNodes);
      setEdges(rfEdges);
      setLoading(false);
    }, 600);
  }, [repoId, setNodes, setEdges]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeData(edge.data as unknown as GraphEdge);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <Network className="w-5 h-5 animate-spin" />
          <span>Loading Relationship Graph...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relationship Graph</h1>
          <p className="text-muted-foreground mt-2">
            Cross-artifact semantic relationships for <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{repoId}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 relative">
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background/20"
          >
            <Background color="#27272a" gap={16} />
            <Controls className="bg-secondary/80 border-border fill-foreground" />
          </ReactFlow>
        </div>

        {selectedEdgeData && (
          <div className="w-80 shrink-0 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col absolute right-0 top-0 bottom-0 shadow-2xl animate-in slide-in-from-right-8 duration-300 z-10 m-4">
            <div className="p-4 border-b border-border bg-secondary/50 font-semibold text-sm flex justify-between items-center">
              <span>Edge Analysis</span>
              <button onClick={() => setSelectedEdgeData(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/50 text-muted-foreground border border-border mb-3">
                  RELATIONSHIP: {selectedEdgeData.label}
                </div>
                
                <div className="flex items-center justify-between gap-2 p-3 bg-secondary/20 rounded-md border border-border">
                   <div className="font-mono text-xs truncate max-w-[100px]" title={nodes.find(n => n.id === selectedEdgeData.source)?.data?.label as string}>
                     {nodes.find(n => n.id === selectedEdgeData.source)?.data?.label as string}
                   </div>
                   <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                   <div className="font-mono text-xs truncate max-w-[100px]" title={nodes.find(n => n.id === selectedEdgeData.target)?.data?.label as string}>
                     {nodes.find(n => n.id === selectedEdgeData.target)?.data?.label as string}
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verification Status</p>
                {selectedEdgeData.verification === "DRIFT FOUND" ? (
                  <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-md font-medium text-sm">
                    <XCircle className="w-4 h-4" /> DRIFT FOUND
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-primary bg-primary/10 border border-primary/20 p-2.5 rounded-md font-medium text-sm">
                    <ShieldCheck className="w-4 h-4" /> VERIFIED
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evidence Extraction</p>
                <div className="p-3 bg-secondary/30 rounded-md border border-border text-sm text-foreground/80 font-mono">
                  {selectedEdgeData.evidence}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
