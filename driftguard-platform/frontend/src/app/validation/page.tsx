import { Suspense } from "react";
import { ValidationClient } from "./client";

export default function ValidationPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Structured Validation Lab...</div>}>
      <ValidationClient />
    </Suspense>
  );
}
