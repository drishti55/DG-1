import { Suspense } from "react";
import { AnomalyDetectionClient } from "./client";

export default function AnomalyDetectionPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Anomaly Detection...</div>}>
      <AnomalyDetectionClient />
    </Suspense>
  );
}
