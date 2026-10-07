import { Suspense } from "react";
import { MultiModalChunkingClient } from "./client";

export default function MultiModalChunkingPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Multi-Modal Chunking...</div>}>
      <MultiModalChunkingClient />
    </Suspense>
  );
}
