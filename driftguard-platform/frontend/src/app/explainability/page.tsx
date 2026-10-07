import { Suspense } from "react";
import { ModelExplainabilityClient } from "./client";

export default function ModelExplainabilityPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Model Explainability...</div>}>
      <ModelExplainabilityClient />
    </Suspense>
  );
}
