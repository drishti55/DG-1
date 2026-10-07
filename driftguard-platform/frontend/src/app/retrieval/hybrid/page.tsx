import { Suspense } from "react";
import { HybridRetrievalClient } from "./client";

export default function HybridRetrievalPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Hybrid Retrieval...</div>}>
      <HybridRetrievalClient />
    </Suspense>
  );
}
