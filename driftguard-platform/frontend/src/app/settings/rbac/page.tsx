import { Suspense } from "react";
import { RbacSettingsClient } from "./client";

export default function RbacSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading RBAC Settings...</div>}>
      <RbacSettingsClient />
    </Suspense>
  );
}
