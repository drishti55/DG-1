"use client";

import { useState } from "react";
import { Search, Cpu, MessageSquare, Database, Wand2, Terminal, Code2 } from "lucide-react";

interface RagContext {
  chunk_id: string;
  content: string;
}

interface RagData {
  query: string;
  llm_model: string;
  system_prompt: string;
  retrieved_context: RagContext[];
  generation: string;
  citations: string[];
  generation_time_ms: number;
  tokens_used: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export function RagClient() {
  const [query, setQuery] = useState("How is a user account created and stored?");
  const [data, setData] = useState<RagData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [typedText, setTypedText] = useState("");

  const handleGenerate = () => {
    setLoading(true);
    setSearched(false);
    setTypedText("");
    
    // Mock the backend fetch
    const mockData: RagData = {
      "query": query,
      "llm_model": "Llama-3-8B-Instruct",
      "system_prompt": "You are an expert developer. Answer the user's question based ONLY on the provided context. Cite your sources.",
      "retrieved_context": [
        {
          "chunk_id": "chunk-1002",
          "content": "@router.post('/users')\ndef create_user(user_id: str):\n    # implementation\n    session.add(user)\n    session.commit()\n    return user"
        },
        {
          "chunk_id": "chunk-1003",
          "content": "## Users API\nThe users API allows you to create and manage accounts by making a POST request to /users. The database handles commit natively."
        }
      ],
      "generation": "To create and store a user account, you must make a `POST` request to the `/users` API endpoint (chunk-1003). \n\nUnder the hood, this triggers the `create_user()` function which handles the storage. The user object is added to the database session using `session.add(user)` and stored permanently when `session.commit()` is called (chunk-1002).",
      "citations": ["chunk-1002", "chunk-1003"],
      "generation_time_ms": 1245,
      "tokens_used": {
        "prompt": 412,
        "completion": 84,
        "total": 496
      }
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
      setSearched(true);
      
      // Simulate streaming
      let currentText = "";
      const fullText = mockData.generation;
      let i = 0;
      
      const interval = setInterval(() => {
        if (i < fullText.length) {
          currentText += fullText.charAt(i);
          setTypedText(currentText);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 15);
      
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RAG Synthesis</h1>
          <p className="text-muted-foreground mt-2">
            Retrieval-Augmented Generation using Hybrid Search constraints.
          </p>
        </div>
        
        {searched && data && (
           <div className="flex gap-4">
             <div className="px-3 py-1.5 rounded-lg border border-border bg-black/40 flex items-center gap-2 shadow-sm text-xs">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-muted-foreground">{data.llm_model}</span>
             </div>
             <div className="px-3 py-1.5 rounded-lg border border-border bg-black/40 flex items-center gap-2 shadow-sm text-xs">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-muted-foreground">{data.tokens_used.total} tokens</span>
             </div>
           </div>
        )}
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Input & Prompt Construction */}
        <div className="w-[450px] flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 pb-4">
          
          <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
             <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
               <MessageSquare className="w-4 h-4 text-primary" /> Query
             </div>
             <div className="p-4 space-y-4">
               <div>
                 <textarea
                   className="w-full bg-secondary/30 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
               </div>
               
               <button 
                 onClick={handleGenerate}
                 disabled={loading}
                 className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                 {loading ? "Synthesizing Answer..." : "Run RAG Pipeline"}
               </button>
             </div>
          </div>

          {searched && data && (
            <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm animate-in slide-in-from-bottom-4">
               <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
                 <Database className="w-4 h-4 text-purple-400" /> Stuffed Context Window
               </div>
               <div className="p-4 space-y-4">
                 
                 <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">System Prompt</p>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md font-mono text-xs text-blue-300">
                      {data.system_prompt}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Injected Artifacts (k=2)</p>
                    <div className="space-y-2">
                       {data.retrieved_context.map((ctx) => (
                         <div key={ctx.chunk_id} className="p-3 bg-secondary/30 border border-border rounded-md shadow-inner">
                            <div className="text-[10px] font-mono text-primary mb-1">[{ctx.chunk_id}]</div>
                            <pre className="font-mono text-[10px] text-foreground/80 whitespace-pre-wrap">{ctx.content}</pre>
                         </div>
                       ))}
                    </div>
                 </div>

               </div>
            </div>
          )}

        </div>

        {/* Right: LLM Output */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-green-400" /> Augmented Generation
            </div>
            {searched && data && (
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">{data.generation_time_ms}ms</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 bg-background/20 relative">
             {!searched ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">The LLM will generate a highly accurate answer grounded only in the retrieved context.</p>
                </div>
             ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                   <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{data?.llm_model}</p>
                        <p className="text-xs text-muted-foreground">AI Research Assistant</p>
                      </div>
                   </div>

                   <div className="prose prose-invert prose-p:leading-relaxed max-w-none font-sans text-[15px]">
                      {typedText.split('\n\n').map((paragraph, i) => (
                        <p key={i} dangerouslySetInnerHTML={{
                          __html: paragraph
                            .replace(/`(.*?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-primary text-sm font-mono">$1</code>')
                            .replace(/\(chunk-(\d+)\)/g, '<span class="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 rounded text-[10px] font-mono translate-y-[-2px]">chunk-$1</span>')
                        }} />
                      ))}
                   </div>

                   {typedText === data?.generation && (
                     <div className="mt-8 pt-6 border-t border-border animate-in fade-in duration-1000">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Verified Citations</p>
                        <div className="flex gap-2">
                          {data?.citations.map(citation => (
                            <div key={citation} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 border border-border rounded-md text-xs font-mono hover:bg-secondary transition-colors cursor-pointer">
                               <Code2 className="w-3 h-3 text-primary" />
                               {citation}
                            </div>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
