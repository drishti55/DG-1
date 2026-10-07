import { Suspense } from "react";
import { TeamCollaborationClient } from "./client";

export default function TeamCollaborationPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Team Collaboration...</div>}>
      <TeamCollaborationClient />
    </Suspense>
  );
}
