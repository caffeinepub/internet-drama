import { useGame } from "../context/GameContext";
import type { Panel } from "../context/GameContext";

const NAV_ITEMS: { id: Panel; emoji: string; label: string }[] = [
  { id: "profile", emoji: "👤", label: "Profile" },
  { id: "feed", emoji: "🏠", label: "Feed" },
  { id: "notifications", emoji: "🔔", label: "Alerts" },
  { id: "dms", emoji: "📩", label: "DMs" },
  { id: "shop", emoji: "🛒", label: "Shop" },
  { id: "settings", emoji: "⚙️", label: "More" },
];

export default function MobileNav() {
  const { panel, setPanel, state } = useGame();
  const unreadDMs = state.dmInbox.filter((d) => !d.read).length;
  const unreadNotifs = state.notifications.filter((n) => !n.read).length;

  const items: { id: Panel; emoji: string; label: string }[] = [
    ...NAV_ITEMS,
    ...(state.godModeActive
      ? [{ id: "godmode" as Panel, emoji: "🔮", label: "God" }]
      : []),
  ];

  return (
    <nav
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around w-full">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setPanel(item.id)}
            data-ocid={`nav.${item.id}.link`}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[56px] relative transition-all ${
              panel === item.id
                ? "text-primary"
                : "text-muted-foreground active:text-foreground"
            }`}
          >
            {panel === item.id && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
            )}
            <span className="text-xl leading-none">{item.emoji}</span>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {item.id === "dms" && unreadDMs > 0 && (
              <span className="absolute top-1 right-[20%] w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadDMs > 9 ? "9+" : unreadDMs}
              </span>
            )}
            {item.id === "notifications" && unreadNotifs > 0 && (
              <span className="absolute top-1 right-[20%] w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
