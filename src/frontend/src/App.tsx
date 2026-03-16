import { Toaster } from "@/components/ui/sonner";
import BrandDealModal from "./components/BrandDealModal";
import DramaModal from "./components/DramaModal";
import FlashMessage from "./components/FlashMessage";
import MobileNav from "./components/MobileNav";
import Onboarding from "./components/Onboarding";
import ProfileSidebar from "./components/ProfileSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";
import DMPanel from "./components/panels/DMPanel";
import FeedPanel from "./components/panels/FeedPanel";
import LeaderboardPanel from "./components/panels/LeaderboardPanel";
import LivePanel from "./components/panels/LivePanel";
import NewsPanel from "./components/panels/NewsPanel";
import ShopPanel from "./components/panels/ShopPanel";
import { GameProvider, useGame } from "./context/GameContext";

function GameLayout() {
  const { screen, panel } = useGame();

  if (screen === "onboarding") return <Onboarding />;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <FlashMessage />

      {/* Main content - offset for fixed top bar (~110px) + mobile nav (60px) */}
      <div className="pt-[110px] pb-20 md:pb-4 px-3 md:px-6">
        <div className="max-w-6xl mx-auto flex gap-4">
          {/* Left sidebar - desktop only */}
          <aside className="desktop-sidebar flex-col w-64 shrink-0 sticky top-[116px] h-[calc(100vh-120px)] overflow-y-auto">
            <ProfileSidebar />
          </aside>

          {/* Main panel */}
          <main className="flex-1 min-w-0">
            {panel === "feed" && <FeedPanel />}
            {panel === "news" && <NewsPanel />}
            {panel === "dms" && <DMPanel />}
            {panel === "leaderboard" && <LeaderboardPanel />}
            {panel === "shop" && <ShopPanel />}
            {panel === "live" && <LivePanel />}
          </main>

          {/* Right sidebar - desktop only */}
          <aside className="desktop-sidebar flex-col w-56 shrink-0 sticky top-[116px] h-[calc(100vh-120px)] overflow-y-auto">
            <RightSidebar />
          </aside>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Modals */}
      <DramaModal />
      <BrandDealModal />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}
