import { Suspense } from "react";
import { DenseRetrievalClient } from "./client";

export default function DenseRetrievalPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Dense Retrieval...</div>}>
      <DenseRetrievalClient />
    </Suspense>
  );
}
