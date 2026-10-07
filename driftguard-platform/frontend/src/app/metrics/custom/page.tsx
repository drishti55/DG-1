import { Suspense } from "react";
import { CustomMetricsClient } from "./client";

export default function CustomMetricsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Custom Metrics...</div>}>
      <CustomMetricsClient />
    </Suspense>
  );
}
