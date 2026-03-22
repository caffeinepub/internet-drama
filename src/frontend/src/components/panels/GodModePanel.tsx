import { useState } from "react";
import { useGame } from "../../context/GameContext";

export default function GodModePanel() {
  const {
    state,
    godModeActive,
    godAddFollowers,
    godSetStats,
    godTriggerViral,
    godTriggerDrama,
    godUnlockAll,
    resetGame,
  } = useGame();

  const [fame, setFame] = useState(Math.round(state.fame));
  const [fanLove, setFanLove] = useState(Math.round(state.fanLove));
  const [hate, setHate] = useState(Math.round(state.hate));
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!godModeActive) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-bold text-lg mb-1">God Mode is OFF</p>
        <p className="text-sm text-muted-foreground">
          Enable it in Settings → Developer Tools
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="rounded-xl p-4 border border-orange-500/30"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.05 30 / 0.8), oklch(0.15 0.04 15 / 0.8))",
        }}
        data-ocid="godmode.panel"
      >
        <div className="flex items-center justify-between mb-1">
          <h2
            className="font-black text-xl"
            style={{
              background: "linear-gradient(90deg, #f97316, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔮 GOD MODE
          </h2>
          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full animate-pulse">
            ACTIVE
          </span>
        </div>
        <p className="text-xs text-orange-400/70">
          Developer tools — for testing only
        </p>
      </div>

      {/* Add Followers */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-sm text-orange-400 uppercase tracking-wider mb-3">
          👥 Add Followers
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => godAddFollowers(1000)}
            data-ocid="godmode.primary_button"
            className="py-2 px-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold hover:bg-orange-500/20 transition-colors"
          >
            +1K
          </button>
          <button
            type="button"
            onClick={() => godAddFollowers(10000)}
            data-ocid="godmode.secondary_button"
            className="py-2 px-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold hover:bg-orange-500/20 transition-colors"
          >
            +10K
          </button>
          <button
            type="button"
            onClick={() => godAddFollowers(100000)}
            data-ocid="godmode.button"
            className="py-2 px-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold hover:bg-orange-500/20 transition-colors"
          >
            +100K
          </button>
        </div>
      </div>

      {/* Set Stats */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-sm text-orange-400 uppercase tracking-wider mb-3">
          ⚙️ Set Stats
        </h3>
        <div className="space-y-4">
          <SliderRow
            label="Fame"
            value={fame}
            onChange={setFame}
            color="text-purple-400"
          />
          <SliderRow
            label="Fan Love"
            value={fanLove}
            onChange={setFanLove}
            color="text-pink-400"
          />
          <SliderRow
            label="Hate"
            value={hate}
            onChange={setHate}
            color="text-red-400"
          />
        </div>
        <button
          type="button"
          onClick={() => godSetStats(fame, fanLove, hate)}
          data-ocid="godmode.submit_button"
          className="mt-3 w-full py-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-bold hover:bg-orange-500/30 transition-colors"
        >
          Apply Stats
        </button>
      </div>

      {/* Trigger Events */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-sm text-orange-400 uppercase tracking-wider mb-3">
          🎲 Trigger Events
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={godTriggerViral}
            data-ocid="godmode.toggle"
            className="py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/20 transition-colors"
          >
            🔥 Viral Post
          </button>
          <button
            type="button"
            onClick={godTriggerDrama}
            data-ocid="godmode.edit_button"
            className="py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors"
          >
            🎭 Drama Event
          </button>
        </div>
      </div>

      {/* Unlock All */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-sm text-orange-400 uppercase tracking-wider mb-3">
          🔓 Unlock Everything
        </h3>
        <button
          type="button"
          onClick={godUnlockAll}
          data-ocid="godmode.open_modal_button"
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors"
          style={{
            background: "linear-gradient(90deg, #f97316, #ef4444)",
            color: "white",
          }}
        >
          🔓 Unlock All Features
        </button>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Verified badge + 9999 coins + max boosts
        </p>
      </div>

      {/* Reset */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-sm text-red-400 uppercase tracking-wider mb-3">
          💥 Reset
        </h3>
        {!resetConfirm ? (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            data-ocid="godmode.delete_button"
            className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors"
          >
            🔄 Reset Game
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-400 text-center font-medium">
              Really reset everything?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetGame}
                data-ocid="godmode.confirm_button"
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Yes, Nuke It
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                data-ocid="godmode.cancel_button"
                className="flex-1 py-2 rounded-lg border border-border/50 text-sm hover:bg-secondary/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  );
}
