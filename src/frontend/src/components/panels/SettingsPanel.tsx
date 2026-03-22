import { useState } from "react";
import { useGame } from "../../context/GameContext";

const AVATAR_OPTIONS = [
  "😎",
  "🤩",
  "😈",
  "👑",
  "🦋",
  "🔥",
  "💀",
  "🤖",
  "👽",
  "🐱",
  "🦊",
  "🐸",
  "🦄",
  "🐉",
  "⚡",
  "🌙",
];

export default function SettingsPanel() {
  const { state, updateProfile, resetGame, toggleGodMode, godModeActive } =
    useGame();

  const [username, setUsername] = useState(state.username);
  const [bio, setBio] = useState(state.bio);
  const [avatar, setAvatar] = useState(state.avatar);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [devClicks, setDevClicks] = useState(0);
  const [showGodToggle, setShowGodToggle] = useState(godModeActive);

  const handleSave = () => {
    if (!username.trim()) return;
    updateProfile(username.trim(), bio.trim(), avatar);
  };

  const handleDevClick = () => {
    const next = devClicks + 1;
    setDevClicks(next);
    if (next >= 3) {
      setShowGodToggle(true);
    }
  };

  const totalPosts = state.posts.filter((p) => p.authorId === "player").length;

  return (
    <div className="space-y-4">
      {/* Edit Profile */}
      <div className="glass rounded-xl p-4">
        <h2 className="font-bold text-lg mb-4">⚙️ Settings</h2>

        <section className="mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
            Edit Profile
          </h3>

          <p className="text-xs text-muted-foreground mb-2">Avatar</p>
          <div className="grid grid-cols-8 gap-1.5 mb-4">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setAvatar(emoji)}
                data-ocid="settings.toggle"
                className={`text-xl p-1.5 rounded-lg transition-all ${
                  avatar === emoji
                    ? "bg-primary/30 ring-2 ring-primary scale-110"
                    : "hover:bg-secondary/50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="settings-username"
                className="text-xs text-muted-foreground block mb-1"
              >
                Username
              </label>
              <input
                id="settings-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-ocid="settings.input"
                maxLength={32}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="settings-bio"
                className="text-xs text-muted-foreground block mb-1"
              >
                Bio
              </label>
              <textarea
                id="settings-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                data-ocid="settings.textarea"
                maxLength={150}
                rows={3}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              data-ocid="settings.save_button"
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </section>

        {/* Game Info */}
        <section className="mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
            Game Info
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Current Day"
              value={`Day ${state.currentDay ?? 1}`}
              emoji="📅"
            />
            <InfoCard
              label="Streak"
              value={`${state.streakDays ?? 0} day${(state.streakDays ?? 0) !== 1 ? "s" : ""}`}
              emoji="🔥"
            />
            <InfoCard
              label="Total Posts"
              value={totalPosts.toString()}
              emoji="📝"
            />
            <InfoCard label="Joined" value={state.joinDate} emoji="🗓️" />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mb-4">
          <h3 className="font-semibold text-sm text-red-400 uppercase tracking-wider mb-3">
            ⚠️ Danger Zone
          </h3>
          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              data-ocid="settings.delete_button"
              className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
            >
              🔄 Reset Game
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-400 font-medium text-center">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetGame}
                  data-ocid="settings.confirm_button"
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  data-ocid="settings.cancel_button"
                  className="flex-1 py-2 rounded-lg border border-border/50 text-sm hover:bg-secondary/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Dev Tools */}
        <div className="border-t border-border/20 pt-3">
          {showGodToggle ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                🔮 God Mode: {godModeActive ? "ON" : "OFF"}
              </span>
              <button
                type="button"
                onClick={toggleGodMode}
                data-ocid="settings.switch"
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  godModeActive ? "bg-orange-500" : "bg-secondary/60"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    godModeActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDevClick}
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              Developer Tools
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  emoji,
}: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-secondary/20 rounded-lg p-3 text-center">
      <p className="text-lg">{emoji}</p>
      <p className="font-bold text-sm">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
