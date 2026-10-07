import { Suspense } from "react";
import { ExportSettingsClient } from "./client";

export default function ExportSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Data Export...</div>}>
      <ExportSettingsClient />
    </Suspense>
  );
}
