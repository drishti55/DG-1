import { Suspense } from "react";
import { SecretsSettingsClient } from "./client";

export default function SecretsSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Secure Vault...</div>}>
      <SecretsSettingsClient />
    </Suspense>
  );
}
