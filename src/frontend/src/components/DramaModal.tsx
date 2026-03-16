import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";

const RESPONSES = [
  {
    id: "apologize" as const,
    emoji: "🙏",
    label: "Apologize Publicly",
    desc: "FanLove ↑, Hate ↓, some followers leave",
  },
  {
    id: "ignore" as const,
    emoji: "🙄",
    label: "Ignore It",
    desc: "Hate creeps up, 20% chance escalates",
  },
  {
    id: "fightback" as const,
    emoji: "🥊",
    label: "Fight Back",
    desc: "Risky! Fame ↑, Hate ↑↑, followers ?",
  },
  {
    id: "explain" as const,
    emoji: "🎬",
    label: "Post Explanation",
    desc: "Fame ↑, FanLove ↑, Hate ↓",
  },
];

export default function DramaModal() {
  const { dramaEvent, respondToDrama, dismissDrama, dramaOutcome } = useGame();

  if (!dramaEvent) return null;

  return (
    <Dialog
      open={true}
      onOpenChange={() => (dramaOutcome ? null : dismissDrama())}
    >
      <DialogContent
        className="drama-glow border-2 max-w-md"
        data-ocid="drama.event.modal"
        style={{
          background: "oklch(0.12 0.03 25 / 0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black drama-shake text-center gradient-text-fire">
            {dramaEvent.title}
          </DialogTitle>
        </DialogHeader>

        {dramaOutcome ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-3xl">✨</p>
            <p className="text-foreground">{dramaOutcome}</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-center text-sm py-2">
              {dramaEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {RESPONSES.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => respondToDrama(r.id)}
                  data-ocid={`drama.${r.id}.button`}
                  className="glass rounded-lg p-3 text-left space-y-1 hover:border-primary/50 hover:bg-primary/10 transition-all group"
                >
                  <p className="text-xl">{r.emoji}</p>
                  <p className="font-bold text-xs group-hover:text-primary transition-colors">
                    {r.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={dismissDrama}
              className="w-full text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
            >
              Close (no action)
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
