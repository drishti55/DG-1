import { Suspense } from "react";
import { AuditSettingsClient } from "./client";

export default function AuditSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Audit Logs...</div>}>
      <AuditSettingsClient />
    </Suspense>
  );
}
