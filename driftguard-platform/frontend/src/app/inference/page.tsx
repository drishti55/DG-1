import { Suspense } from "react";
import { InferenceClient } from "./client";

export default function InferencePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Local Inference Panel...</div>}>
      <InferenceClient />
    </Suspense>
  );
}
