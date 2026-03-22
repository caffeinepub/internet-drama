import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const STEPS = [
  {
    id: "posts",
    emoji: "📱",
    title: "Create Posts",
    description:
      "Go to Feed and create your first post. Choose text, meme, selfie or video to grow your audience!",
  },
  {
    id: "drama",
    emoji: "🎭",
    title: "Face Drama",
    description:
      "Drama events will pop up after a few posts. Your choices — apologize, ignore, fight back, or explain — affect your reputation!",
  },
  {
    id: "fame",
    emoji: "⭐",
    title: "Build Fame",
    description:
      "Gain followers, manage your hate level, and climb from Unknown User all the way to Global Icon!",
  },
];

export default function WelcomeTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem("internet_drama_tour_done");
  });

  const dismiss = () => {
    localStorage.setItem("internet_drama_tour_done", "true");
    setVisible(false);
  };

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="tour.modal"
        >
          {/* Backdrop - accessible dismiss button */}
          <button
            type="button"
            aria-label="Close tour"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default"
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-sm glass rounded-3xl p-7 shadow-2xl border border-primary/30"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Step indicators */}
            <div className="flex justify-center gap-1.5 mb-6">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-6 bg-primary"
                      : i < step
                        ? "w-3 bg-primary/50"
                        : "w-3 bg-secondary"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-8"
              >
                <div className="text-6xl mb-4">{currentStep.emoji}</div>
                <h2
                  className="text-2xl font-black gradient-text mb-2"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {currentStep.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  className="flex-1 py-5"
                  onClick={() => setStep((s) => s - 1)}
                  data-ocid="tour.cancel_button"
                >
                  ← Back
                </Button>
              )}
              {isLast ? (
                <Button
                  className="flex-1 py-5 font-bold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.28 310), oklch(0.7 0.25 200))",
                  }}
                  onClick={dismiss}
                  data-ocid="tour.confirm_button"
                >
                  Let&apos;s Go! 🚀
                </Button>
              ) : (
                <Button
                  className="flex-1 py-5 font-bold"
                  onClick={() => setStep((s) => s + 1)}
                  data-ocid="tour.primary_button"
                >
                  Next →
                </Button>
              )}
            </div>

            {/* Skip */}
            <button
              type="button"
              className="block w-full text-center text-xs text-muted-foreground/50 mt-4 hover:text-muted-foreground transition-colors"
              onClick={dismiss}
              data-ocid="tour.close_button"
            >
              Skip tour
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
