"use client";

import { useState } from "react";
import { Search, Code2, Play, FileJson2, Braces, CheckCircle2, XCircle } from "lucide-react";
import Editor from "@monaco-editor/react";

interface StructuredOutputData {
  query: string;
  schema_definition: any;
  raw_llm_response: string;
  parsed_json: any;
  validation_status: string;
  validation_errors: any[];
}

export function ValidationClient() {
  const [data, setData] = useState<StructuredOutputData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Mock backend fetch
    const mockData: StructuredOutputData = {
      "query": "Extract the drift relationship between api/users.py and docs/users.md.",
      "schema_definition": {
        "type": "object",
        "properties": {
          "source_file": {"type": "string"},
          "target_file": {"type": "string"},
          "relationship_type": {"type": "string", "enum": ["DOCUMENTS", "TESTS", "CONFIGURES"]},
          "is_drifted": {"type": "boolean"},
          "confidence_score": {"type": "number"}
        },
        "required": ["source_file", "target_file", "relationship_type", "is_drifted", "confidence_score"]
      },
      "raw_llm_response": "```json\n{\n  \"source_file\": \"api/users.py\",\n  \"target_file\": \"docs/users.md\",\n  \"relationship_type\": \"DOCUMENTS\",\n  \"is_drifted\": true,\n  \"confidence_score\": 0.94\n}\n```",
      "parsed_json": {
        "source_file": "api/users.py",
        "target_file": "docs/users.md",
        "relationship_type": "DOCUMENTS",
        "is_drifted": true,
        "confidence_score": 0.94
      },
      "validation_status": "PASSED",
      "validation_errors": []
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
      setSearched(true);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Structured Output Validation</h1>
          <p className="text-muted-foreground mt-2">
            Constraining LLM Generation to strict Pydantic JSON Schemas.
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Input & Schema */}
        <div className="w-[450px] flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 pb-4">
          
          <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
             <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
               <Search className="w-4 h-4 text-primary" /> Extraction Task
             </div>
             <div className="p-4 space-y-4">
               <div>
                 <textarea
                   className="w-full bg-secondary/30 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
                   defaultValue="Extract the drift relationship between api/users.py and docs/users.md."
                   disabled
                 />
               </div>
               <button 
                 onClick={handleGenerate}
                 disabled={loading}
                 className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Code2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                 {loading ? "Generating Output..." : "Execute Validation Pipeline"}
               </button>
             </div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm min-h-[300px]">
             <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
               <FileJson2 className="w-4 h-4 text-purple-400" /> Target JSON Schema
             </div>
             <div className="flex-1">
               <Editor
                 height="100%"
                 language="json"
                 theme="vs-dark"
                 value={searched ? JSON.stringify(data?.schema_definition, null, 2) : "{\n  // Schema will be loaded...\n}"}
                 options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
               />
             </div>
          </div>

        </div>

        {/* Right: Output & Validation */}
        <div className="flex-1 flex flex-col gap-6 relative overflow-hidden">
          
          <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" /> Raw LLM Generation
              </div>
            </div>
            <div className="flex-1 relative">
               {!searched ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6 bg-background/20">
                    <Code2 className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Raw text output from the LLM will appear here.</p>
                  </div>
               ) : (
                 <Editor
                   height="100%"
                   language="markdown"
                   theme="vs-dark"
                   value={data?.raw_llm_response}
                   options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                 />
               )}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
              <div className="flex items-center gap-2">
                <Braces className="w-4 h-4 text-green-400" /> Parsed & Validated Object
              </div>
              {searched && data && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${data.validation_status === 'PASSED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}>
                  {data.validation_status === 'PASSED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {data.validation_status}
                </div>
              )}
            </div>
            <div className="flex-1 relative">
               {!searched ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6 bg-background/20">
                    <Braces className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">The validated JSON object will be exposed here for the frontend to consume.</p>
                  </div>
               ) : (
                 <Editor
                   height="100%"
                   language="json"
                   theme="vs-dark"
                   value={JSON.stringify(data?.parsed_json, null, 2)}
                   options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                 />
               )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
