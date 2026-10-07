import { Suspense } from "react";
import { SingleRepositoryClient } from "./client";

export default function SingleRepositoryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8">Loading repository...</div>}>
      <SingleRepositoryClient params={params} />
    </Suspense>
  );
}
