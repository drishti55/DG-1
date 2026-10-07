import { Suspense } from "react";
import { DriftResolutionClient } from "./client";

export default function DriftResolutionPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Drift Resolution...</div>}>
      <DriftResolutionClient />
    </Suspense>
  );
}
