import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { formatFollowers, randomInt } from "../../lib/gameEngine";

const CHAT_MESSAGES = [
  ["@viewer123", "🔥🔥🔥", "fan"],
  ["@loyal_fan", "QUEEN BEHAVIOR", "fan"],
  ["@superfan99", "I love your streams!", "fan"],
  ["@troll_lol", "this stream is mid", "troll"],
  ["@hater123", "when are you ending lmao", "troll"],
  ["@positive_vibes", "keep it up bestie!", "fan"],
  ["@just_watching", "first time here", "neutral"],
  ["@random_user", "lol", "neutral"],
  ["@drama_watcher", "something might happen here 👀", "neutral"],
  ["@megafan", "💕💕💕 always supporting!", "fan"],
];

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  type: string;
  isDonation?: boolean;
  amount?: number;
}

export default function LivePanel() {
  const { state, endLiveStream } = useGame();
  const [isLive, setIsLive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewersRef = useRef(0);
  const donationsRef = useRef(0);
  const chatLengthRef = useRef(0);

  const baseViewers = Math.max(100, Math.floor(state.followers * 0.05));

  useEffect(() => {
    if (!isLive) return;

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
      const newViewers = viewersRef.current + randomInt(-50, 150);
      viewersRef.current = newViewers;
      setViewers(newViewers);

      const msg = CHAT_MESSAGES[randomInt(0, CHAT_MESSAGES.length - 1)];
      const isDonation = Math.random() < 0.1;
      const amount = isDonation ? randomInt(5, 100) : 0;
      const newMsg: ChatMessage = {
        id: crypto.randomUUID(),
        user: msg[0],
        text: isDonation ? `donated 💰 $${amount}!` : msg[1],
        type: isDonation ? "donation" : msg[2],
        isDonation,
        amount,
      };
      chatLengthRef.current += 1;
      setChat((prev) => [...prev.slice(-20), newMsg]);
      if (isDonation) {
        donationsRef.current += amount;
        setTotalDonations(donationsRef.current);
      }
      // Scroll chat to bottom
      requestAnimationFrame(() => {
        if (chatRef.current)
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
      });
    }, 1500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  const startStream = () => {
    viewersRef.current = baseViewers;
    donationsRef.current = 0;
    chatLengthRef.current = 0;
    setIsLive(true);
    setViewers(baseViewers);
    setDuration(0);
    setTotalDonations(0);
    setChat([]);
  };

  const stopStream = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsLive(false);
    endLiveStream(donationsRef.current, viewersRef.current);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl gradient-text">🎬 Live Stream</h2>
        {isLive && (
          <div className="flex items-center gap-2">
            <span className="live-pulse w-2 h-2 bg-red-500 rounded-full inline-block" />
            <span className="text-red-400 text-xs font-bold">LIVE</span>
            <span className="text-xs text-muted-foreground">
              {formatDuration(duration)}
            </span>
          </div>
        )}
      </div>

      {!isLive ? (
        <div className="glass rounded-xl p-8 text-center space-y-4">
          <p className="text-5xl">🎬</p>
          <div>
            <p className="font-bold">Start a Live Stream</p>
            <p className="text-sm text-muted-foreground">
              Expected viewers: {formatFollowers(baseViewers)}
            </p>
          </div>
          <Button
            onClick={startStream}
            className="px-8"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.6 0.25 25), oklch(0.65 0.2 55))",
            }}
            data-ocid="live.start.button"
          >
            🟥 Go Live!
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-cyan-400">
                {formatFollowers(viewers)}
              </p>
              <p className="text-xs text-muted-foreground">Viewers</p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-yellow-400">
                🪙 {totalDonations}
              </p>
              <p className="text-xs text-muted-foreground">Donations</p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-400">
                {formatDuration(duration)}
              </p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 p-2 border-b border-border/30">
              <span className="live-pulse w-2 h-2 bg-red-500 rounded-full inline-block" />
              <span className="text-xs font-bold">LIVE CHAT</span>
            </div>
            <div ref={chatRef} className="h-64 overflow-y-auto p-2 space-y-1.5">
              {chat.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-xs ${
                    msg.isDonation
                      ? "text-yellow-400 font-bold"
                      : msg.type === "troll"
                        ? "text-orange-400"
                        : msg.type === "fan"
                          ? "text-pink-400"
                          : "text-muted-foreground"
                  }`}
                >
                  <span className="font-medium">{msg.user}</span>: {msg.text}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={stopStream}
            variant="destructive"
            className="w-full"
            data-ocid="live.end.button"
          >
            ⏹️ End Stream
          </Button>
        </div>
      )}
    </div>
  );
}
