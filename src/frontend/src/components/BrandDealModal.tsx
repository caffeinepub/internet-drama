import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";

export default function BrandDealModal() {
  const { brandDeal, respondToBrandDeal, dismissBrandDeal } = useGame();
  if (!brandDeal) return null;

  return (
    <Dialog open={true} onOpenChange={dismissBrandDeal}>
      <DialogContent
        className="max-w-sm glass"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">
            💼 Brand Deal Offer!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="text-center">
            <p className="text-4xl mb-2">🤝</p>
            <p className="font-bold">{brandDeal.brand}</p>
            <p className="text-muted-foreground text-sm">
              wants to sponsor your content
            </p>
            {brandDeal.isScam && (
              <p className="text-xs text-orange-400 mt-1">
                ⚠️ This looks sketchy...
              </p>
            )}
          </div>
          <p className="text-center text-2xl font-black text-yellow-400">
            🪙 {brandDeal.offer} coins
          </p>

          <div className="grid gap-2">
            <Button
              onClick={() => respondToBrandDeal("accept")}
              className="w-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.2 150), oklch(0.6 0.18 150))",
              }}
            >
              ✅ Accept Deal
            </Button>
            <Button
              variant="outline"
              onClick={() => respondToBrandDeal("reject")}
              className="w-full"
            >
              ❌ Reject (stay authentic)
            </Button>
            {brandDeal.isScam && (
              <Button
                onClick={() => respondToBrandDeal("scam")}
                className="w-full"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.5 0.25 25), oklch(0.55 0.2 55))",
                }}
              >
                💀 Promote anyway (+{brandDeal.offer * 2} coins, hate spikes)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
