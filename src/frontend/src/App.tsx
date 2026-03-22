import { Toaster } from "@/components/ui/sonner";
import BrandDealModal from "./components/BrandDealModal";
import DramaModal from "./components/DramaModal";
import FlashMessage from "./components/FlashMessage";
import MobileNav from "./components/MobileNav";
import Onboarding from "./components/Onboarding";
import ProfileSidebar from "./components/ProfileSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";
import WelcomeTour from "./components/WelcomeTour";
import DMPanel from "./components/panels/DMPanel";
import FeedPanel from "./components/panels/FeedPanel";
import GodModePanel from "./components/panels/GodModePanel";
import LeaderboardPanel from "./components/panels/LeaderboardPanel";
import LivePanel from "./components/panels/LivePanel";
import NewsPanel from "./components/panels/NewsPanel";
import NotificationsPanel from "./components/panels/NotificationsPanel";
import ProfilePanel from "./components/panels/ProfilePanel";
import SettingsPanel from "./components/panels/SettingsPanel";
import ShopPanel from "./components/panels/ShopPanel";
import { GameProvider, useGame } from "./context/GameContext";

function GameLayout() {
  const { screen, panel } = useGame();

  if (screen === "onboarding") return <Onboarding />;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <FlashMessage />
      <WelcomeTour />

      {/* Main content — pt accounts for TopBar height (~96px mobile, ~110px desktop) */}
      <div className="pt-[96px] md:pt-[110px] pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-4 md:px-6">
        <div className="max-w-6xl mx-auto md:flex md:gap-4">
          {/* Left sidebar - desktop only */}
          <aside className="desktop-sidebar flex-col w-64 shrink-0 sticky top-[116px] h-[calc(100vh-120px)] overflow-y-auto">
            <ProfileSidebar />
          </aside>

          {/* Main panel */}
          <main className="flex-1 min-w-0 px-2 md:px-0">
            {panel === "profile" && <ProfilePanel />}
            {panel === "feed" && <FeedPanel />}
            {panel === "news" && <NewsPanel />}
            {panel === "dms" && <DMPanel />}
            {panel === "leaderboard" && <LeaderboardPanel />}
            {panel === "shop" && <ShopPanel />}
            {panel === "live" && <LivePanel />}
            {panel === "notifications" && <NotificationsPanel />}
            {panel === "settings" && <SettingsPanel />}
            {panel === "godmode" && <GodModePanel />}
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
