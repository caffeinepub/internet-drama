import { Button } from "@/components/ui/button";
import { useGame } from "../context/GameContext";
import { formatFollowers, getLevelName } from "../lib/gameEngine";

export default function ProfileSidebar() {
  const { state, resetGame, setPanel } = useGame();
  const levelName = getLevelName(state.level);

  const levelColors = [
    "",
    "text-muted-foreground",
    "text-green-400",
    "text-cyan-400",
    "text-primary",
    "text-yellow-400",
    "text-orange-400",
  ];

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="glass rounded-xl p-4">
        <div className="text-center mb-3">
          <div className="text-5xl mb-2">{state.avatar}</div>
          <div className="flex items-center justify-center gap-1">
            <p className="font-bold">{state.username}</p>
            {state.verifiedBadge && (
              <span className="text-blue-400 font-bold">✓</span>
            )}
          </div>
          <p className={`text-xs font-medium ${levelColors[state.level]}`}>
            {levelName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{state.bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-sm mb-3">
          <div>
            <p className="font-bold text-cyan-400">
              {formatFollowers(state.followers)}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-bold">{formatFollowers(state.following)}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-3">
          Joined {state.joinDate}
        </p>

        {/* Reputation Meters */}
        <div className="space-y-2">
          <MeterRow
            label="Fame"
            value={state.fame}
            colorClass="meter-fame"
            emoji="⭐"
          />
          <MeterRow
            label="Fan Love"
            value={state.fanLove}
            colorClass="meter-love"
            emoji="❤️"
          />
          <MeterRow
            label="Hate"
            value={state.hate}
            colorClass="meter-hate"
            emoji="🔥"
          />
        </div>

        {state.hate >= 80 && (
          <p className="text-xs text-red-400 text-center mt-2 font-bold">
            ⚠️ Cancel Risk High!
          </p>
        )}

        {/* Edit Profile Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => setPanel("settings")}
          data-ocid="profile.edit_button"
        >
          ✏️ Edit Profile
        </Button>
      </div>

      {/* Rivals */}
      <div className="glass rounded-xl p-3">
        <p className="font-bold text-sm mb-2">
          ⚔️ Rivals ({state.rivals.length})
        </p>
        <div className="space-y-2">
          {state.rivals.map((rival) => (
            <div
              key={rival.id}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{rival.avatar}</span>
                <div>
                  <p className="font-medium">{rival.username}</p>
                  <p className="text-muted-foreground">
                    {formatFollowers(rival.followers)} followers
                  </p>
                </div>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
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

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs text-muted-foreground"
        onClick={resetGame}
        data-ocid="profile.delete_button"
      >
        🔄 New Game
      </Button>
    </div>
  );
}

function MeterRow({
  label,
  value,
  colorClass,
  emoji,
}: { label: string; value: number; colorClass: string; emoji: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          {emoji} {label}
        </span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
