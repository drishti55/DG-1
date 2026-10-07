import { Suspense } from "react";
import { QualitativeEvalClient } from "./client";

export default function QualitativeEvalPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Qualitative Lab...</div>}>
      <QualitativeEvalClient />
    </Suspense>
  );
}
