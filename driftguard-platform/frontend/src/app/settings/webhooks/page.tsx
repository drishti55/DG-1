import { Suspense } from "react";
import { WebhooksSettingsClient } from "./client";

export default function WebhooksSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Event Subscriptions...</div>}>
      <WebhooksSettingsClient />
    </Suspense>
  );
}
