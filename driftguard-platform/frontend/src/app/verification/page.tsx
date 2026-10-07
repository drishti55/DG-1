import { Suspense } from "react";
import { VerificationClient } from "./client";

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Evidence Verification Lab...</div>}>
      <VerificationClient />
    </Suspense>
  );
}
