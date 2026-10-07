import { Suspense } from "react";
import { ExecutiveReportClient } from "./client";

export default function ExecutiveReportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Executive Report...</div>}>
      <ExecutiveReportClient />
    </Suspense>
  );
}
