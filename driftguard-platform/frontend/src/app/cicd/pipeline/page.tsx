import { Suspense } from "react";
import { PipelineVisualizerClient } from "./client";

export default function PipelineVisualizerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Pipeline Visualizer...</div>}>
      <PipelineVisualizerClient />
    </Suspense>
  );
}
