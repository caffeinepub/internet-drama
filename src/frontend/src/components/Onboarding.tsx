import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useGame } from "../context/GameContext";

const AVATARS = [
  "😎",
  "🔥",
  "💅",
  "🤩",
  "😤",
  "🎭",
  "👑",
  "🌟",
  "💀",
  "🦋",
  "🐉",
  "🎪",
];

export default function Onboarding() {
  const { startGame } = useGame();
  const [username, setUsername] = useState("@viralcreator");
  const [bio, setBio] = useState("Just starting my content journey 🔥");
  const [avatar, setAvatar] = useState("😎");

  const handleStart = () => {
    if (!username.trim()) return;
    startGame(
      username.startsWith("@") ? username : `@${username}`,
      bio,
      avatar,
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-black gradient-text neon-purple mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Internet Drama
          </h1>
          <p className="text-muted-foreground">
            Your path to internet fame starts here 🔥
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="text-center">
            <p className="text-3xl mb-1">{avatar}</p>
            <p className="text-xs text-muted-foreground">Your avatar</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Choose your avatar
            </p>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    avatar === a
                      ? "bg-primary/30 ring-2 ring-primary scale-110"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="username-input"
              className="text-sm text-muted-foreground"
            >
              Username
            </label>
            <Input
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@yourname"
              className="bg-secondary/50 border-border"
              data-ocid="onboarding.username.input"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="bio-input"
              className="text-sm text-muted-foreground"
            >
              Bio
            </label>
            <Textarea
              id="bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about yourself..."
              className="bg-secondary/50 border-border resize-none"
              rows={3}
              data-ocid="onboarding.bio.textarea"
            />
          </div>

          <Button
            onClick={handleStart}
            className="w-full text-lg py-6 font-bold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.28 310), oklch(0.7 0.25 200))",
            }}
            data-ocid="onboarding.submit_button"
          >
            Start My Journey 🚀
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Progress auto-saved to browser storage
        </p>
      </div>
    </div>
  );
}
