import { useGame } from "../context/GameContext";

const NAV_ITEMS = [
  { id: "feed", emoji: "🏠", label: "Feed" },
  { id: "news", emoji: "📡", label: "News" },
  { id: "dms", emoji: "📩", label: "DMs" },
  { id: "leaderboard", emoji: "🏆", label: "Board" },
  { id: "shop", emoji: "🛒", label: "Shop" },
  { id: "live", emoji: "🎬", label: "Live" },
] as const;

export default function MobileNav() {
  const { panel, setPanel, state } = useGame();
  const unreadDMs = state.dmInbox.filter((d) => !d.read).length;

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-1 py-2">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setPanel(item.id)}
            data-ocid={`nav.${item.id}.link`}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all relative ${
              panel === item.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-xs">{item.label}</span>
            {item.id === "dms" && unreadDMs > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {unreadDMs}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
