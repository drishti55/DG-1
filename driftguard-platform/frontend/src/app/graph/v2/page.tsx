import { Suspense } from "react";
import { KnowledgeGraphV2Client } from "./client";

export default function KnowledgeGraphV2Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading Knowledge Graph V2...</div>}>
      <KnowledgeGraphV2Client />
    </Suspense>
  );
}
