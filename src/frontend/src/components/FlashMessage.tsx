import { useGame } from "../context/GameContext";

export default function FlashMessage() {
  const { flashMessage } = useGame();
  if (!flashMessage) return null;

  return (
    <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-full text-sm font-bold border border-primary/50 text-primary animate-bounce">
      {flashMessage}
    </div>
  );
}
