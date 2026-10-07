import { Suspense } from "react";
import { ConfigManagementClient } from "./client";

export default function ConfigManagementPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Config Management...</div>}>
      <ConfigManagementClient />
    </Suspense>
  );
}
