import { Suspense } from "react";
import { RegistryClient } from "./client";

export default function RegistryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Model Registry...</div>}>
      <RegistryClient />
    </Suspense>
  );
}
