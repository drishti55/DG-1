import { Suspense } from "react";
import { NotificationCenterClient } from "./client";

export default function NotificationCenterPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Notification Center...</div>}>
      <NotificationCenterClient />
    </Suspense>
  );
}
