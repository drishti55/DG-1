"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  FolderSearch,
  GitMerge,
  Network,
  Scissors,
  Layers,
  Search,
  BrainCircuit,
  ShieldCheck,
  Microscope,
  FlaskConical,
  BarChart4,
  SplitSquareHorizontal,
  Workflow,
  AlertTriangle,
  Database,
  HelpCircle,
  BookOpen,
  RefreshCcw,
  AlertOctagon,
  GraduationCap,
  Presentation
} from "lucide-react";

const navigation = [
  { name: "Platform Overview", href: "/", icon: LayoutDashboard },
  
  // Pipeline & Core
  { name: "Global Search", href: "/search", icon: Search },
  { name: "Repository Scanner", href: "/repository", icon: FolderSearch },
  { name: "AST Explorer", href: "/ast", icon: GitMerge },
  { name: "Vector Embeddings", href: "/embeddings", icon: Layers },
  
  // Labs & RAG
  { name: "Chunking Lab", href: "/chunking", icon: Scissors },
  { name: "Retrieval: BM25", href: "/retrieval/bm25", icon: Search },
  { name: "Retrieval: Dense", href: "/retrieval/dense", icon: Search },
  { name: "RAG Pipeline", href: "/rag", icon: BrainCircuit },
  
  // ML Ops
  { name: "Model Registry", href: "/registry", icon: Database },
  { name: "Fine-tuning Jobs", href: "/finetuning", icon: FlaskConical },
  { name: "Eval: Quantitative", href: "/evaluation/quantitative", icon: BarChart4 },
  { name: "Eval: Qualitative", href: "/evaluation/qualitative", icon: Microscope },
  
  // Security & Operations
  { name: "Drift Validation", href: "/validation", icon: ShieldCheck },
  { name: "System Logs", href: "/system/logs", icon: AlertOctagon },
  { name: "System Health", href: "/system/health", icon: Activity },
  
  // Configuration
  { name: "RBAC Policies", href: "/settings/rbac", icon: ShieldCheck },
  { name: "Audit Trail", href: "/settings/audit", icon: ShieldCheck },
  { name: "Secrets Vault", href: "/settings/secrets", icon: ShieldCheck },
  { name: "Telemetry & FinOps", href: "/settings/billing", icon: BarChart4 },
  { name: "Event Webhooks", href: "/settings/webhooks", icon: Network },
  { name: "Data Portability", href: "/settings/export", icon: Database }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-border bg-black/50 h-screen sticky top-0 overflow-y-auto hidden md:flex backdrop-blur-xl">
      <div className="p-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center border border-primary/50">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold tracking-widest text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          DRIFTGUARD
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 pb-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
