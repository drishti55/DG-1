import { ReactNode, Suspense } from "react";
import { Sidebar } from "./Sidebar";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="w-64 hidden md:block" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 flex flex-col min-h-screen bg-background/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0 h-96" />
        <div className="relative z-10 flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
