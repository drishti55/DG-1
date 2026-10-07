import { Suspense } from "react";
import { FinetuningClient } from "./client";

export default function FinetuningPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Finetuning Dashboard...</div>}>
      <FinetuningClient />
    </Suspense>
  );
}
