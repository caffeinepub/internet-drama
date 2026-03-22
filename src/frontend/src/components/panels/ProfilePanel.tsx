import { Button } from "@/components/ui/button";
import { useGame } from "../../context/GameContext";
import { formatFollowers, getLevelName } from "../../lib/gameEngine";

const levelColors = [
  "",
  "text-muted-foreground",
  "text-green-400",
  "text-cyan-400",
  "text-primary",
  "text-yellow-400",
  "text-orange-400",
];

function MeterBar({
  label,
  value,
  colorClass,
  emoji,
}: {
  label: string;
  value: number;
  colorClass: string;
  emoji: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground flex items-center gap-1">
          <span>{emoji}</span> {label}
        </span>
        <span className="font-bold">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <p className={`font-black text-lg ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

export default function ProfilePanel() {
  const { state, resetGame, setPanel } = useGame();
  const levelName = getLevelName(state.level);
  const totalPosts = state.posts.filter((p) => p.authorId === "player").length;
  const viralPosts = state.posts.filter(
    (p) => p.isViral && p.authorId === "player",
  ).length;

  return (
    <div className="space-y-4 pb-4" data-ocid="profile.panel">
      {/* Hero Profile Card */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/40 flex items-center justify-center text-5xl">
              {state.avatar}
            </div>
            {state.verifiedBadge && (
              <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-black border-2 border-background">
                ✓
              </span>
            )}
          </div>

          {/* Name & Level */}
          <h2
            className="text-2xl font-black"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {state.username}
          </h2>
          <span
            className={`text-sm font-bold mt-0.5 ${levelColors[state.level] ?? "text-muted-foreground"}`}
          >
            {levelName} • Level {state.level}
          </span>

          {/* Bio */}
          {state.bio && (
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              {state.bio}
            </p>
          )}

          {/* Join date */}
          <p className="text-xs text-muted-foreground/60 mt-1">
            📅 Joined {state.joinDate}
          </p>
        </div>

        {/* Followers / Following */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-secondary/40 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-cyan-400">
              {formatFollowers(state.followers)}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="bg-secondary/40 rounded-xl p-3 text-center">
            <p className="text-2xl font-black">
              {formatFollowers(state.following)}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Cancel Risk Warning */}
        {state.hate >= 80 && (
          <div className="mt-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-sm text-red-400 font-bold">
              ⚠️ Cancel Risk High!
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">
              Manage your hate level before it's too late.
            </p>
          </div>
        )}
      </div>

      {/* Reputation Meters */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
          📊 Reputation
        </h3>
        <MeterBar
          label="Fame"
          value={state.fame}
          colorClass="meter-fame"
          emoji="⭐"
        />
        <MeterBar
          label="Fan Love"
          value={state.fanLove}
          colorClass="meter-love"
          emoji="❤️"
        />
        <MeterBar
          label="Hate"
          value={state.hate}
          colorClass="meter-hate"
          emoji="🔥"
        />
      </div>

      {/* Quick Stats Grid */}
      <div>
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">
          📈 Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Total Posts"
            value={totalPosts.toString()}
            color="text-foreground"
          />
          <StatCard
            label="Viral Posts"
            value={viralPosts.toString()}
            color="text-yellow-400"
          />
          <StatCard
            label="Cancel Count"
            value={state.cancelCount.toString()}
            color="text-red-400"
          />
          <StatCard
            label="Coins"
            value={`🪙 ${state.coins}`}
            color="text-yellow-400"
          />
        </div>
      </div>

      {/* Streak & Day */}
      <div className="glass rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-green-400">
              {state.currentDay ?? 1}
            </p>
            <p className="text-xs text-muted-foreground">Day</p>
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-400">
              🔥 {state.streakDays ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>
      </div>

      {/* Rivals */}
      {state.rivals.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-3">
            ⚔️ Rivals ({state.rivals.length})
          </h3>
          <div className="space-y-3">
            {state.rivals.map((rival) => (
              <div key={rival.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{rival.avatar}</span>
                  <div>
                    <p className="font-semibold text-sm">{rival.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFollowers(rival.followers)} followers
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    rival.hostility >= 70
                      ? "bg-red-400/20 text-red-400"
                      : rival.hostility >= 40
                        ? "bg-orange-400/20 text-orange-400"
                        : "bg-green-400/20 text-green-400"
                  }`}
                >
                  {rival.hostility >= 70
                    ? "💪 Enemy"
                    : rival.hostility >= 40
                      ? "👀 Rival"
                      : "🤝 Neutral"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full py-5 text-sm font-bold"
          onClick={() => setPanel("settings")}
          data-ocid="profile.edit_button"
        >
          ✏️ Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full py-5 text-sm font-bold text-muted-foreground"
          onClick={resetGame}
          data-ocid="profile.delete_button"
        >
          🔄 New Game
        </Button>
      </div>
    </div>
  );
}
