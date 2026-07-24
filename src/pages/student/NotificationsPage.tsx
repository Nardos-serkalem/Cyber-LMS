import { useNotifications } from "../../lib/queries/useNotifications";
import { Badge } from "../../components/ui/Badge";
import type { BadgeStatus } from "../../components/ui/Badge";

const CURRENT_USER_ID = "user-1";

function badgeForNotification(message: string): BadgeStatus {
  return message.toLowerCase().includes("overdue") ? "overdue" : "pending";
}

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications(CURRENT_USER_ID);

  if (isLoading) {
    return <div className="text-sm text-surface-muted">Loading notifications…</div>;
  }

  return (
    <div className="divide-y divide-surface-divider rounded-xl border border-navy-200 bg-surface-card">
      {notifications?.map((notification) => (
        <div key={notification.id} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-navy-900">{notification.message}</span>
          <Badge status={badgeForNotification(notification.message)} />
        </div>
      ))}
      {notifications?.length === 0 && (
        <div className="px-4 py-3 text-sm text-surface-muted">You're all caught up.</div>
      )}
    </div>
  );
}