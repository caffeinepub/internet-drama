import { Bell, Mail, Zap } from "lucide-react";
import { useGame } from "../context/GameContext";
import { formatFollowers } from "../lib/gameEngine";

export default function TopBar() {
  const { state, setPanel, panel } = useGame();
  const unreadDMs = state.dmInbox.filter((d) => !d.read).length;
  const unreadNotifs = state.notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="bg-primary/10 border-b border-border/30 overflow-hidden h-6 flex items-center">
        <span className="text-xs text-primary font-bold mr-3 shrink-0 px-2">
          📡 LIVE
        </span>
        <div className="overflow-hidden flex-1">
          <span className="ticker-content text-xs text-muted-foreground">
            {state.newsHeadlines.join("   •   ")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 md:px-6 h-14">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h1
            className="text-lg md:text-xl font-black gradient-text"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Internet Drama
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {(
            ["feed", "news", "dms", "leaderboard", "shop", "live"] as const
          ).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPanel(p)}
              data-ocid={`nav.${p}.link`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                panel === p
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {p === "dms"
                ? "DMs"
                : `${p.charAt(0).toUpperCase()}${p.slice(1)}`}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setPanel("feed")}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </button>
          <button
            type="button"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setPanel("dms")}
            data-ocid="nav.dms.link"
          >
            <Mail className="w-5 h-5" />
            {unreadDMs > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {unreadDMs > 9 ? "9+" : unreadDMs}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-lg cursor-pointer">
            {state.avatar}
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 px-3 md:px-6 py-1.5 flex items-center gap-3 md:gap-5 overflow-x-auto text-xs">
        <StatChip
          label="Followers"
          value={formatFollowers(state.followers)}
          color="text-cyan-400"
        />
        <StatChip
          label="Fame"
          value={`${Math.round(state.fame)}%`}
          color="text-purple-400"
        />
        <StatChip
          label="Fan Love"
          value={`${Math.round(state.fanLove)}%`}
          color="text-pink-400"
        />
        <StatChip
          label="Hate"
          value={`${Math.round(state.hate)}%`}
          color="text-orange-400"
        />
        <StatChip
          label="Posts"
          value={state.posts
            .filter((p) => p.authorId === "player")
            .length.toString()}
          color="text-foreground"
        />
        <StatChip
          label="Rivals"
          value={state.rivals.length.toString()}
          color="text-red-400"
        />
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-muted-foreground">Lvl</span>
          <span className="font-bold gradient-text">#{state.level}</span>
          {state.verifiedBadge && <span className="text-blue-400">✓</span>}
        </div>
        <StatChip
          label="Coins"
          value={`🪙 ${state.coins}`}
          color="text-yellow-400"
        />
      </div>
    </header>
  );
}

function StatChip({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
