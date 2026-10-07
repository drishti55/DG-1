import { Suspense } from "react";
import { ComplianceGdprClient } from "./client";

export default function ComplianceGdprPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Compliance & GDPR...</div>}>
      <ComplianceGdprClient />
    </Suspense>
  );
}
