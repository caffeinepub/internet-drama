import { useGame } from "../../context/GameContext";

export default function NewsPanel() {
  const { state } = useGame();

  return (
    <div className="space-y-3">
      <h2 className="font-black text-xl gradient-text">📡 Internet News</h2>
      {state.newsHeadlines.map((headline, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: headlines are ordered by time, index is stable
        <div key={i} className="glass rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📰</span>
            <div>
              <p className="text-sm font-medium">{headline}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Just now • Trending
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
