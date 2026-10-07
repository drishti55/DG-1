import { Suspense } from "react";
import { CicdSettingsClient } from "./client";

export default function CicdSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading CI/CD Settings...</div>}>
      <CicdSettingsClient />
    </Suspense>
  );
}
