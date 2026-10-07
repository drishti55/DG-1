"use client";

import { useEffect, useState } from "react";
import { Database, Filter, Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Case {
  case_id: string;
  repository: string;
  language: string;
  artifact_1: string;
  artifact_2: string;
  drift_present: boolean;
  drift_type: string;
  severity: string;
  evidence: string;
  expected_fix: string;
  validation_result: string;
  dataset_split: string;
}

interface DatasetData {
  total: number;
  train: number;
  validation: number;
  test: number;
  repositories: number;
  items: Case[];
}

export default function DatasetPage() {
  const [data, setData] = useState<DatasetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: DatasetData = {
      total: 154241,
      train: 100825,
      validation: 29267,
      test: 24149,
      repositories: 488,
      items: [
        {
          case_id: "case-1092",
          repository: "tiangolo/fastapi",
          language: "python",
          artifact_1: "api/users.py:L14-20",
          artifact_2: "docs/users.md:L5-8",
          drift_present: true,
          drift_type: "API_MISMATCH",
          severity: "HIGH",
          evidence: "Code implements POST /users with parameter 'user_id', but documentation states GET /users with 'id'.",
          expected_fix: "Update documentation to reflect the POST method and 'user_id' parameter.",
          validation_result: "DRIFT FOUND",
          dataset_split: "test"
        },
        {
          case_id: "case-4431",
          repository: "tiangolo/fastapi",
          language: "python",
          artifact_1: "requirements.txt",
          artifact_2: "core/config.py:L45-50",
          drift_present: true,
          drift_type: "DEPENDENCY_MISMATCH",
          severity: "CRITICAL",
          evidence: "requirements.txt specifies pydantic==1.10.8, but core/config.py uses Pydantic V2 API.",
          expected_fix: "Upgrade pydantic to ^2.0.0 in requirements.txt.",
          validation_result: "DRIFT FOUND",
          dataset_split: "validation"
        },
        {
          case_id: "case-9912",
          repository: "tiangolo/fastapi",
          language: "python",
          artifact_1: "core/security.py:L20-30",
          artifact_2: "tests/test_security.py:L10-15",
          drift_present: false,
          drift_type: "NONE",
          severity: "NONE",
          evidence: "Test correctly invokes 'verify_password' with the required arguments.",
          expected_fix: "None",
          validation_result: "NO DRIFT FOUND",
          dataset_split: "train"
        }
      ]
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <Database className="w-5 h-5 animate-spin" />
          <span>Loading Dataset...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dataset Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Explore the 154,241 cross-artifact drift cases across {data?.repositories} repositories.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: data?.total, color: "text-foreground" },
          { label: "Train Split", value: data?.train, color: "text-blue-400" },
          { label: "Validation Split", value: data?.validation, color: "text-yellow-400" },
          { label: "Test Split", value: data?.test, color: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-black/40 backdrop-blur-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value?.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search cases, repositories, or evidence..." 
            className="w-full bg-black/40 border border-border rounded-md py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md border border-border hover:bg-secondary/80 transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="rounded-xl border border-border bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-secondary/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Case ID / Repo</th>
                <th className="px-6 py-4 font-medium">Artifacts</th>
                <th className="px-6 py-4 font-medium">Drift Type</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items.map((item) => (
                <tr key={item.case_id} className="hover:bg-secondary/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 align-top">
                    <div className="font-mono text-primary text-xs">{item.case_id}</div>
                    <div className="font-medium mt-1">{item.repository}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.language}</div>
                  </td>
                  <td className="px-6 py-4 align-top max-w-[250px]">
                    <div className="space-y-1 font-mono text-xs text-muted-foreground break-all">
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">1</span>
                        <span>{item.artifact_1}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">2</span>
                        <span>{item.artifact_2}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                      {item.drift_type}
                    </span>
                    {item.severity !== "NONE" && (
                      <div className="mt-2 text-xs text-destructive flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        {item.severity}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-1.5 font-medium">
                      {item.validation_result === "DRIFT FOUND" ? (
                        <span className="text-destructive flex items-center gap-1.5"><XCircle className="w-4 h-4" /> DRIFT FOUND</span>
                      ) : (
                        <span className="text-primary flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> NO DRIFT</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-xs font-medium">
                    <span className={`px-2 py-1 rounded-md border ${
                      item.dataset_split === 'test' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      item.dataset_split === 'validation' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {item.dataset_split.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
