import { Suspense } from "react";
import { PrReviewerClient } from "./client";

export default function PrReviewerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading PR Reviewer...</div>}>
      <PrReviewerClient />
    </Suspense>
  );
}
