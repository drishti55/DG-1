import { Suspense } from "react";
import { ChunkingClient } from "./client";

export default function ChunkingLabPage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8">Loading Chunking Lab...</div>}>
      <ChunkingClient searchParams={searchParams} />
    </Suspense>
  );
}
