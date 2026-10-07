import { Suspense } from "react";
import { BillingSettingsClient } from "./client";

export default function BillingSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Billing Telemetry...</div>}>
      <BillingSettingsClient />
    </Suspense>
  );
}
