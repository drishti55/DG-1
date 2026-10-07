"use client";

import { useEffect, useState, use } from "react";
import { GitMerge, FileCode2, ArrowRight, Network, Box, Link2 } from "lucide-react";
import Editor from "@monaco-editor/react";

interface AstFact {
  id: string;
  type: string;
  name: string;
  line: number;
  docstring?: string;
  return_annotation?: string;
  calls?: string[];
  callers?: string[];
  callees?: string[];
  documentation_links?: string[];
  test_links?: string[];
  config_links?: string[];
}

interface FileAst {
  file_path: string;
  ast_facts: AstFact[];
  source_code: string;
}

interface AstData {
  repository: string;
  files: FileAst[];
}

export function AstClient({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const resolvedParams = use(searchParams);
  const repoId = resolvedParams.repo || "tiangolo-fastapi";
  
  const [data, setData] = useState<AstData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState<FileAst | null>(null);
  const [selectedFact, setSelectedFact] = useState<AstFact | null>(null);

  useEffect(() => {
    // Mock the specific repository AST fetch
    const mockAst = {
      repository: repoId,
      files: [
        {
          file_path: "api/users.py",
          ast_facts: [
            {
              id: "fact-1",
              type: "IMPORT",
              name: "FastAPI",
              line: 1
            },
            {
              id: "fact-2",
              type: "CLASS",
              name: "User",
              line: 10,
              docstring: "User model representing an account."
            },
            {
              id: "fact-3",
              type: "FUNCTION",
              name: "create_user",
              line: 25,
              docstring: "Create a new user.",
              return_annotation: "User",
              calls: ["session.add", "session.commit"],
              callers: ["test_create_user"],
              callees: ["hash_password", "db.add"],
              documentation_links: ["docs/users.md:L5-8"],
              test_links: ["tests/test_users.py:L10-25"],
              config_links: []
            }
          ],
          source_code: "from fastapi import FastAPI\n\n# ... (other imports) ...\n\nclass User:\n    \"\"\"User model representing an account.\"\"\"\n    def __init__(self, username: str):\n        self.username = username\n\n    def get_full_name(self) -> str:\n        return self.username\n\n@router.post('/users')\ndef create_user(user_id: str):\n    \"\"\"Create a new user.\"\"\"\n    # implementation\n    session.add(user)\n    session.commit()\n    return user\n"
        },
        {
          file_path: "core/security.py",
          ast_facts: [
            {
              id: "fact-4",
              type: "FUNCTION",
              name: "verify_password",
              line: 20,
              docstring: "Verify a plain password against a hashed one.",
              return_annotation: "bool",
              calls: ["pwd_context.verify"],
              callers: ["login_for_access_token"],
              callees: ["pwd_context.verify"],
              documentation_links: ["docs/security.md:L15-20"],
              test_links: ["tests/test_security.py:L10-15"],
              config_links: ["core/config.py:L45-50"]
            }
          ],
          source_code: "import pwd_context\n\ndef get_password_hash(password: str) -> str:\n    return pwd_context.hash(password)\n\ndef verify_password(plain_password: str, hashed_password: str) -> bool:\n    \"\"\"Verify a plain password against a hashed one.\"\"\"\n    return pwd_context.verify(plain_password, hashed_password)\n"
        }
      ]
    };

    setTimeout(() => {
      setData(mockAst);
      setSelectedFile(mockAst.files[0]);
      setLoading(false);
    }, 600);
  }, [repoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <GitMerge className="w-5 h-5 animate-spin" />
          <span>Loading AST Facts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AST Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Exploring structural facts and relationships for <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{repoId}</span>
        </p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left: File Tree */}
        <div className="w-64 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/50 font-semibold text-sm">
            Discovered Files
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data?.files.map(file => (
              <button
                key={file.file_path}
                onClick={() => { setSelectedFile(file); setSelectedFact(null); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${selectedFile?.file_path === file.file_path ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-secondary/50 text-muted-foreground'}`}
              >
                <FileCode2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{file.file_path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Code & AST Facts List */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
             <div className="p-3 border-b border-border bg-secondary/50 font-semibold text-sm flex items-center justify-between">
                <span>{selectedFile?.file_path}</span>
                <span className="text-xs text-muted-foreground">{selectedFile?.ast_facts.length} facts</span>
             </div>
             <div className="flex-1 overflow-hidden relative">
               {selectedFile && (
                  <Editor
                    height="100%"
                    language="python"
                    theme="vs-dark"
                    value={selectedFile.source_code}
                    options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                  />
               )}
             </div>
          </div>
          
          <div className="h-48 rounded-xl border border-border bg-black/40 backdrop-blur-md flex flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-border bg-secondary/50 font-semibold text-sm">
                Facts extracted from file
             </div>
             <div className="flex-1 overflow-y-auto p-2 flex flex-wrap gap-2 content-start">
               {selectedFile?.ast_facts.map(fact => (
                  <button
                    key={fact.id}
                    onClick={() => setSelectedFact(fact)}
                    className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 transition-all ${selectedFact?.id === fact.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/30 border-border hover:border-primary/50 text-foreground'}`}
                  >
                    <Box className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="font-mono text-xs">{fact.type}</span>
                    <span className="font-medium">{fact.name}</span>
                  </button>
               ))}
             </div>
          </div>
        </div>

        {/* Right: AST Node Details */}
        <div className="w-80 rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/50 font-semibold text-sm">
            Node Details
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedFact ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30 mb-3">
                    {selectedFact.type}
                  </div>
                  <h2 className="text-xl font-bold font-mono text-foreground break-all">{selectedFact.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Found on Line {selectedFact.line}</p>
                </div>
                
                {selectedFact.docstring && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Docstring</p>
                    <div className="p-3 bg-secondary/30 rounded-md border border-border text-sm italic text-foreground/80 leading-relaxed">
                      "{selectedFact.docstring}"
                    </div>
                  </div>
                )}
                
                {selectedFact.return_annotation && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Return Type</p>
                    <code className="inline-block px-2 py-1 bg-secondary rounded text-sm font-mono text-blue-400 border border-border">
                      {selectedFact.return_annotation}
                    </code>
                  </div>
                )}

                {selectedFact.calls && selectedFact.calls.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Calls (Outgoing)</p>
                    <div className="flex flex-col gap-1.5">
                      {selectedFact.calls.map(c => (
                        <div key={c} className="text-sm font-mono text-muted-foreground flex items-center gap-2 bg-secondary/20 px-2 py-1.5 rounded-md border border-border/50">
                          <ArrowRight className="w-3 h-3 text-primary/70" /> {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedFact.documentation_links && selectedFact.documentation_links.length > 0) && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cross-Artifact Relationships</p>
                    <div className="flex flex-col gap-2">
                      {selectedFact.documentation_links.map(link => (
                        <div key={link} className="flex items-start gap-2 p-2.5 rounded-md bg-secondary/30 border border-border">
                          <Link2 className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                          <div>
                             <p className="text-xs text-blue-400 font-medium mb-0.5">Documents</p>
                             <div className="text-xs font-mono break-all">{link}</div>
                          </div>
                        </div>
                      ))}
                      {selectedFact.test_links?.map(link => (
                        <div key={link} className="flex items-start gap-2 p-2.5 rounded-md bg-secondary/30 border border-border">
                          <Link2 className="w-4 h-4 shrink-0 text-green-400 mt-0.5" />
                          <div>
                             <p className="text-xs text-green-400 font-medium mb-0.5">Tests</p>
                             <div className="text-xs font-mono break-all">{link}</div>
                          </div>
                        </div>
                      ))}
                      {selectedFact.config_links?.map(link => (
                        <div key={link} className="flex items-start gap-2 p-2.5 rounded-md bg-secondary/30 border border-border">
                          <Link2 className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
                          <div>
                             <p className="text-xs text-yellow-400 font-medium mb-0.5">Configures</p>
                             <div className="text-xs font-mono break-all">{link}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <Network className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select an AST fact from the bottom panel to view its full relationships and properties.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
