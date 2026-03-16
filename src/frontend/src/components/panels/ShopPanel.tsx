import { Button } from "@/components/ui/button";
import { useGame } from "../../context/GameContext";

const SHOP_ITEMS = [
  {
    id: "verified",
    emoji: "✓",
    name: "Verified Badge",
    desc: "Get that blue tick",
    cost: 500,
    effect: "Profile badge",
  },
  {
    id: "boost",
    emoji: "🚀",
    name: "Engagement Boost x2",
    desc: "Double engagement for 10 posts",
    cost: 300,
    effect: "Engagement x2",
  },
  {
    id: "multiplier",
    emoji: "⭐",
    name: "Fame Multiplier x1.5",
    desc: "Grow fame 50% faster",
    cost: 800,
    effect: "Fame x1.5",
  },
  {
    id: "hype",
    emoji: "🔥",
    name: "Hype Train",
    desc: "Next post guaranteed viral",
    cost: 400,
    effect: "Next post viral",
  },
  {
    id: "bots",
    emoji: "🤖",
    name: "Bot Followers +1K",
    desc: "Instant followers (risky!)",
    cost: 150,
    effect: "+1000 followers, +hate",
  },
  {
    id: "pr",
    emoji: "👔",
    name: "PR Agency",
    desc: "Reduce hate by 20 points",
    cost: 1000,
    effect: "Hate -20",
  },
];

export default function ShopPanel() {
  const { state, buyShopItem } = useGame();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl gradient-text">🛒 Fame Shop</h2>
        <span className="text-yellow-400 font-bold">
          🪙 {state.coins} coins
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SHOP_ITEMS.map((item, i) => {
          const canAfford = state.coins >= item.cost;
          const owned = item.id === "verified" && state.verifiedBadge;
          return (
            <div
              key={item.id}
              data-ocid={`shop.item.${i + 1}`}
              className={`glass rounded-xl p-4 space-y-2 transition-all ${
                !canAfford ? "opacity-50" : "hover:border-primary/50"
              } ${owned ? "ring-1 ring-green-400" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-yellow-400 font-bold text-sm">
                  🪙 {item.cost}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <p className="text-xs text-primary mt-0.5">{item.effect}</p>
              </div>
              {owned ? (
                <p className="text-xs text-green-400 font-medium">✓ Owned</p>
              ) : (
                <Button
                  size="sm"
                  className="w-full text-xs"
                  disabled={!canAfford}
                  onClick={() => buyShopItem(item.id)}
                  style={
                    canAfford
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.65 0.28 310), oklch(0.7 0.25 200))",
                        }
                      : {}
                  }
                >
                  {canAfford ? "Buy Now" : "Not enough coins"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
