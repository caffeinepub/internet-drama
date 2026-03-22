import { useGame } from "../../context/GameContext";

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  viral: "🔥",
  drama: "⚠️",
  deal: "💼",
  level: "⭐",
  follower: "👥",
  dm: "📩",
};

export default function NotificationsPanel() {
  const { state, markAllNotificationsRead } = useGame();
  const sorted = [...state.notifications].sort(
    (a, b) => b.timestamp - a.timestamp,
  );
  const unreadCount = sorted.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">🔔 Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              data-ocid="notifications.primary_button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border/50 hover:border-border"
            >
              Mark all read
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="notifications.empty_state"
          >
            <p className="text-3xl mb-2">🔕</p>
            <p className="font-medium">No notifications yet.</p>
            <p className="text-sm mt-1">Start posting to get notified!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((notif, idx) => (
              <div
                key={notif.id}
                data-ocid={`notifications.item.${idx + 1}`}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  notif.read
                    ? "bg-secondary/20"
                    : "bg-primary/10 border border-primary/20"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">
                  {TYPE_ICONS[notif.type] ?? "📢"}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      notif.read
                        ? "text-muted-foreground"
                        : "text-foreground font-medium"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {relativeTime(notif.timestamp)}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
