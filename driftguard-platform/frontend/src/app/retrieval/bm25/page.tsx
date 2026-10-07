import { Suspense } from "react";
import { Bm25RetrievalClient } from "./client";

export default function Bm25RetrievalPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading BM25 Retrieval...</div>}>
      <Bm25RetrievalClient />
    </Suspense>
  );
}
