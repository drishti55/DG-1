import { Suspense } from "react";
import { QuantitativeEvalClient } from "./client";

export default function QuantitativeEvalPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Quantitative Metrics...</div>}>
      <QuantitativeEvalClient />
    </Suspense>
  );
}
