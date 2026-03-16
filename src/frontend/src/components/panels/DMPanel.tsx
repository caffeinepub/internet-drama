import { useGame } from "../../context/GameContext";

const TYPE_COLORS: Record<string, string> = {
  fan: "text-pink-400",
  hater: "text-red-400",
  rival: "text-orange-400",
  brand: "text-yellow-400",
};

export default function DMPanel() {
  const { state, readDM } = useGame();

  return (
    <div className="space-y-3">
      <h2 className="font-black text-xl gradient-text">📩 DM Inbox</h2>
      {state.dmInbox.length === 0 ? (
        <div
          className="glass rounded-xl p-8 text-center text-muted-foreground"
          data-ocid="dm.inbox.list"
        >
          No messages yet.
        </div>
      ) : (
        <div className="space-y-2" data-ocid="dm.inbox.list">
          {state.dmInbox.map((dm) => (
            <button
              type="button"
              key={dm.id}
              onClick={() => readDM(dm.id)}
              className={`w-full text-left glass rounded-xl p-3 hover:bg-secondary/30 transition-colors ${
                !dm.read ? "ring-1 ring-primary/30" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{dm.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${TYPE_COLORS[dm.fromType]}`}
                    >
                      {dm.from}
                    </span>
                    {!dm.read && (
                      <span className="w-2 h-2 bg-primary rounded-full inline-block" />
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 truncate">
                    {dm.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(dm.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
