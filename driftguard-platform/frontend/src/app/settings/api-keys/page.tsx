import { Suspense } from "react";
import { ApiKeysClient } from "./client";

export default function ApiKeysPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading API Keys...</div>}>
      <ApiKeysClient />
    </Suspense>
  );
}
