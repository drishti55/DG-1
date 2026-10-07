import { Suspense } from "react";
import { SystemHealthClient } from "./client";

export default function SystemHealthPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading System Metrics...</div>}>
      <SystemHealthClient />
    </Suspense>
  );
}
