import { Suspense } from "react";
import { GlobalSearchClient } from "./client";

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Global Search...</div>}>
      <GlobalSearchClient />
    </Suspense>
  );
}
