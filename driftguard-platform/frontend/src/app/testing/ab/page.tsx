import { Suspense } from "react";
import { ModelABTestingClient } from "./client";

export default function ModelABTestingPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Model A/B Testing...</div>}>
      <ModelABTestingClient />
    </Suspense>
  );
}
