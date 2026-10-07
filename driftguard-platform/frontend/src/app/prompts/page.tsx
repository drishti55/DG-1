import { Suspense } from "react";
import { PromptEngineeringLabClient } from "./client";

export default function PromptEngineeringLabPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Prompt Engineering Lab...</div>}>
      <PromptEngineeringLabClient />
    </Suspense>
  );
}
