import { Suspense } from "react";
import { RagClient } from "./client";

export default function RagPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading RAG Playground...</div>}>
      <RagClient />
    </Suspense>
  );
}
