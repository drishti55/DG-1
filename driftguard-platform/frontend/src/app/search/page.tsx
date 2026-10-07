import { Suspense } from "react";
import { SearchClient } from "./client";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Initializing Search Index...</div>}>
      <SearchClient />
    </Suspense>
  );
}
