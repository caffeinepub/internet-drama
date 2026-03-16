import { useGame } from "../context/GameContext";

export default function RightSidebar() {
  const { state } = useGame();

  return (
    <div className="space-y-4">
      {/* Trending Hashtags */}
      <div className="glass rounded-xl p-3">
        <p className="font-bold text-sm mb-2">📈 Trending Now</p>
        <div className="space-y-1.5">
          {state.trendingHashtags.slice(0, 6).map((tag, i) => (
            <div
              key={tag}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">#{i + 1}</span>
              <span className="text-primary font-medium">{tag}</span>
              <span className="text-muted-foreground">
                {Math.floor(Math.random() * 50 + 10)}K posts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass rounded-xl p-3">
        <p className="font-bold text-sm mb-2">📊 Your Stats</p>
        <div className="space-y-1.5 text-xs">
          <StatRow
            label="Total Likes"
            value={state.totalLikes.toLocaleString()}
          />
          <StatRow
            label="Total Posts"
            value={state.posts
              .filter((p) => p.authorId === "player")
              .length.toString()}
          />
          <StatRow
            label="Viral Posts"
            value={state.posts
              .filter((p) => p.isViral && p.authorId === "player")
              .length.toString()}
          />
          <StatRow label="Cancel Count" value={state.cancelCount.toString()} />
          <StatRow label="Coins" value={`🪙 ${state.coins}`} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
