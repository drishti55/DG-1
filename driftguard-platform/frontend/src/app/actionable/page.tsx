import { Suspense } from "react";
import { ActionableClient } from "./client";

export default function ActionablePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Actionable Outputs...</div>}>
      <ActionableClient />
    </Suspense>
  );
}
