import { Suspense } from "react";
import { AstClient } from "./client";

export default function AstExplorerPage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8">Loading AST Explorer...</div>}>
      <AstClient searchParams={searchParams} />
    </Suspense>
  );
}
