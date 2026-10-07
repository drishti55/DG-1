import { Suspense } from "react";
import { UsageQuotasClient } from "./client";

export default function UsageQuotasPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Usage Quotas...</div>}>
      <UsageQuotasClient />
    </Suspense>
  );
}
