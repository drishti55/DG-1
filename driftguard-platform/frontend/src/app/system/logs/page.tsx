import { Suspense } from "react";
import { SystemLogsClient } from "./client";

export default function SystemLogsPage() {
  return (
    <Suspense fallback={<div className="p-8">Establishing Log Stream...</div>}>
      <SystemLogsClient />
    </Suspense>
  );
}
