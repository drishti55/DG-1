"use client";

import { useState } from "react";
import { FileSearch, CheckCircle2, Search, Code2, Play, Hash, ShieldCheck } from "lucide-react";

interface Fact {
  fact_id: string;
  source_file: string;
  fact_type: string;
  content: string;
  lines: string;
}

interface VerificationData {
  claim: string;
  extracted_facts: Fact[];
  verification_logic: string;
  verification_status: string;
  confidence_score: number;
}

export function VerificationClient() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    // Mock backend fetch
    const mockData: VerificationData = {
      "claim": "The api/users.py file implements a User class and a create_user function.",
      "extracted_facts": [
        {
          "fact_id": "fact-1001",
          "source_file": "api/users.py",
          "fact_type": "CLASS",
          "content": "class User:\n    \"\"\"User model representing an account.\"\"\"",
          "lines": "L4-L10"
        },
        {
          "fact_id": "fact-1002",
          "source_file": "api/users.py",
          "fact_type": "FUNCTION",
          "content": "@router.post('/users')\ndef create_user(user_id: str):",
          "lines": "L12-L18"
        }
      ],
      "verification_logic": "The LLM claim asserts the presence of a 'User' class and a 'create_user' function in 'api/users.py'. Fact-1001 extracted by the AST parser confirms the exact 'User' class definition. Fact-1002 confirms the 'create_user' function definition. The LLM claim is strictly supported by deterministic AST evidence.",
      "verification_status": "VERIFIED",
      "confidence_score": 0.99
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Evidence Verification Lab</h1>
        <p className="text-muted-foreground mt-2">
          Cross-referencing LLM-generated claims against deterministic AST facts.
        </p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left: Claim & Execution */}
        <div className="w-[450px] flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 pb-4">
          
          <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm">
             <div className="p-4 border-b border-border bg-secondary/50 flex items-center gap-2 text-sm font-medium">
               <FileSearch className="w-4 h-4 text-primary" /> Target Claim
             </div>
             <div className="p-4 space-y-4">
               <div>
                 <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">LLM Generated Statement</label>
                 <textarea
                   className="w-full bg-secondary/30 border border-border rounded-md p-3 text-sm focus:outline-none min-h-[80px] resize-none text-foreground/80"
                   defaultValue="The api/users.py file implements a User class and a create_user function."
                   disabled
                 />
               </div>
               
               <button 
                 onClick={handleVerify}
                 disabled={loading}
                 className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Search className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 fill-current" />}
                 {loading ? "Searching AST Database..." : "Verify Claim with AST"}
               </button>
             </div>
          </div>

          {verified && data && (
            <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shadow-sm animate-in slide-in-from-bottom-4">
               <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium">
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-green-400" /> Verification Result
                 </div>
                 <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold tracking-wider">
                   {data.verification_status}
                 </div>
               </div>
               <div className="p-4 space-y-4">
                 
                 <div>
                   <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Confidence Score</p>
                   <div className="flex items-end gap-2">
                     <span className="text-3xl font-black text-green-400">{data.confidence_score.toFixed(2)}</span>
                     <span className="text-muted-foreground font-mono text-sm mb-1">/ 1.00</span>
                   </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Evaluation Logic</p>
                    <div className="p-3 bg-secondary/30 rounded-md border border-border text-xs leading-relaxed text-foreground/90 shadow-inner">
                      {data.verification_logic}
                    </div>
                 </div>

               </div>
            </div>
          )}

        </div>

        {/* Right: Extracted Facts */}
        <div className="flex-1 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between text-sm font-medium z-10 relative">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" /> Ground Truth (AST)
            </div>
            {verified && data && (
              <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">{data.extracted_facts.length} Facts Matched</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-background/20 relative">
             {!verified ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Initiate verification to map the LLM's claim against deterministic source code nodes.</p>
                </div>
             ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                   {data?.extracted_facts.map((fact) => (
                      <div key={fact.fact_id} className="rounded-xl border border-border bg-secondary/10 overflow-hidden shadow-sm relative hover:border-purple-500/50 transition-colors">
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500"></div>
                        <div className="p-4 pl-5">
                           <div className="flex justify-between items-start mb-3">
                             <div>
                               <div className="font-mono text-sm font-bold flex items-center gap-2">
                                 {fact.source_file}
                                 <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-sans tracking-wide uppercase">
                                   {fact.fact_type}
                                 </span>
                               </div>
                               <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Hash className="w-3 h-3" /> {fact.fact_id}
                               </div>
                             </div>
                             <div className="px-2 py-1 rounded bg-black/50 border border-border text-muted-foreground font-mono text-xs">
                               Lines {fact.lines}
                             </div>
                           </div>

                           <div className="p-3 bg-secondary/30 rounded-md border border-border font-mono text-xs whitespace-pre-wrap text-foreground/90 shadow-inner">
                              {fact.content}
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
