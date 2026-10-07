import { Suspense } from "react";
import { GraphClient } from "./client";

export default function GraphExplorerPage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8">Loading Graph Explorer...</div>}>
      <GraphClient searchParams={searchParams} />
    </Suspense>
  );
}
