import { Suspense } from "react";
import { IncidentResponseClient } from "./client";

export default function IncidentResponsePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Incident Response...</div>}>
      <IncidentResponseClient />
    </Suspense>
  );
}
