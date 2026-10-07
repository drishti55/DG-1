import { Suspense } from "react";
import { E2ETestRunnerClient } from "./client";

export default function E2ETestRunnerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading E2E Test Runner...</div>}>
      <E2ETestRunnerClient />
    </Suspense>
  );
}
