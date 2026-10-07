import { Suspense } from "react";
import { IntegrationStoreClient } from "./client";

export default function IntegrationStorePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Integration Store...</div>}>
      <IntegrationStoreClient />
    </Suspense>
  );
}
