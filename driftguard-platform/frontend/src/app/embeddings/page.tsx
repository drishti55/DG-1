import { Suspense } from "react";
import { EmbeddingsClient } from "./client";

export default function EmbeddingsLabPage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  return (
    <Suspense fallback={<div className="p-8">Loading Embeddings Lab...</div>}>
      <EmbeddingsClient searchParams={searchParams} />
    </Suspense>
  );
}
