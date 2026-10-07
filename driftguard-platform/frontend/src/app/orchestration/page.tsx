import { Suspense } from "react";
import { OrchestrationClient } from "./client";

export default function OrchestrationPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Global Orchestration...</div>}>
      <OrchestrationClient />
    </Suspense>
  );
}
