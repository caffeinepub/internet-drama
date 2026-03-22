import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  applyDramaResponse,
  clamp,
  createDM,
  createInitialState,
  createNotification,
  createPost,
  generateHeadline,
  generateRivalPost,
  getLevel,
  loadGame,
  pickDramaEvent,
  refreshHashtags,
  saveGame,
} from "../lib/gameEngine";
import type { BrandDeal, DramaEvent, GameState, Post } from "../types/game";
import { BRANDS } from "../types/game";

type Screen = "onboarding" | "game";
export type Panel =
  | "profile"
  | "feed"
  | "news"
  | "dms"
  | "leaderboard"
  | "shop"
  | "live"
  | "notifications"
  | "settings"
  | "godmode";

interface GameContextValue {
  screen: Screen;
  panel: Panel;
  state: GameState;
  dramaEvent: DramaEvent | null;
  brandDeal: BrandDeal | null;
  startGame: (username: string, bio: string, avatar: string) => void;
  setPanel: (p: Panel) => void;
  submitPost: (
    type: Post["type"],
    content: string,
    title: string,
    hashtags: string[],
  ) => void;
  respondToDrama: (
    response: "apologize" | "ignore" | "fightback" | "explain",
  ) => void;
  dismissDrama: () => void;
  respondToBrandDeal: (response: "accept" | "reject" | "scam") => void;
  dismissBrandDeal: () => void;
  deleteComment: (postId: string, commentId: string) => void;
  replyToComment: (postId: string, commentId: string, reply: string) => void;
  readDM: (dmId: string) => void;
  resetGame: () => void;
  startLiveStream: () => void;
  endLiveStream: (donations: number, viewers: number) => void;
  buyShopItem: (itemId: string) => void;
  flashMessage: string;
  dramaOutcome: string;
  // God Mode
  godModeActive: boolean;
  toggleGodMode: () => void;
  godAddFollowers: (amount: number) => void;
  godSetStats: (fame: number, fanLove: number, hate: number) => void;
  godTriggerViral: () => void;
  godTriggerDrama: () => void;
  godUnlockAll: () => void;
  // Profile
  updateProfile: (username: string, bio: string, avatar: string) => void;
  // Notifications
  markAllNotificationsRead: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

type Action =
  | { type: "SET_STATE"; payload: Partial<GameState> }
  | { type: "RESET" }
  | { type: "INIT"; payload: GameState };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "INIT":
      return action.payload;
    case "RESET":
      return state;
    default:
      return state;
  }
}

const DEFAULT_STATE = createInitialState("@viralcreator", "", "😎");

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = React.useState<Screen>("onboarding");
  const [panel, setPanel] = React.useState<Panel>("feed");
  const [dramaEvent, setDramaEvent] = React.useState<DramaEvent | null>(null);
  const [brandDeal, setBrandDeal] = React.useState<BrandDeal | null>(null);
  const [flashMessage, setFlashMessage] = React.useState("");
  const [dramaOutcome, setDramaOutcome] = React.useState("");
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const migrated: GameState = {
        ...saved,
        currentDay: saved.currentDay ?? 1,
        streakDays: saved.streakDays ?? 0,
        lastPostDate: saved.lastPostDate ?? "",
        godModeActive: saved.godModeActive ?? false,
      };
      dispatch({ type: "INIT", payload: migrated });
      setScreen("game");
    }
  }, []);

  const update = useCallback((partial: Partial<GameState>) => {
    dispatch({ type: "SET_STATE", payload: partial });
  }, []);

  useEffect(() => {
    if (screen === "game") saveGame(state);
  }, [state, screen]);

  const flash = useCallback((msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(""), 3000);
  }, []);

  const startGame = useCallback(
    (username: string, bio: string, avatar: string) => {
      const s = createInitialState(username, bio, avatar);
      dispatch({ type: "INIT", payload: s });
      setScreen("game");
    },
    [],
  );

  const resetGame = useCallback(() => {
    localStorage.removeItem("internet_drama_save");
    setScreen("onboarding");
    dispatch({ type: "INIT", payload: DEFAULT_STATE });
  }, []);

  const submitPost = useCallback(
    (
      type: Post["type"],
      content: string,
      title: string,
      hashtags: string[],
    ) => {
      const { post, followerDelta, coinsDelta, isViral } = createPost(
        type,
        content,
        title,
        hashtags,
        state,
      );

      const newFollowers = Math.max(0, state.followers + followerDelta);
      const newLevel = getLevel(newFollowers);
      const leveledUp = newLevel > state.level;
      const newFame = clamp(
        state.fame + Math.ceil(followerDelta / 50) * state.fameMultiplier,
        0,
        100,
      );
      const newFanLove = clamp(state.fanLove + (isViral ? 5 : 1), 0, 100);
      const newHate = clamp(state.hate + (isViral ? -1 : 0), 0, 100);
      const postsSince = state.postsSinceLastEvent + 1;
      const notifications = [...state.notifications];
      const dmInbox = [...state.dmInbox];
      const newsHeadlines = [...state.newsHeadlines];

      const today = new Date().toDateString();
      let currentDay = state.currentDay;
      let streakDays = state.streakDays;
      let newCoins = state.coins + coinsDelta;

      if (state.lastPostDate !== today) {
        currentDay = state.currentDay + 1;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        if (state.lastPostDate === yesterdayStr) {
          streakDays = state.streakDays + 1;
        } else {
          streakDays = 1;
        }
        const streakBonus = streakDays * 10;
        newCoins += streakBonus;
        if (streakDays > 1) {
          flash(`🔥 Day ${streakDays} Streak! +${streakBonus} bonus coins!`);
        }
        notifications.unshift(
          createNotification(
            `Day ${currentDay} started! Streak: ${streakDays} day${streakDays !== 1 ? "s" : ""}`,
            "follower",
          ),
        );
      }

      if (isViral) {
        flash("🔥 YOUR POST IS GOING VIRAL!");
        notifications.unshift(
          createNotification(
            `Your ${type} post went viral! +${followerDelta} followers`,
            "viral",
          ),
        );
        newsHeadlines.unshift(
          generateHeadline(
            { ...state, followers: newFollowers, level: newLevel },
            "viral",
          ),
        );
      }

      if (leveledUp) {
        notifications.unshift(
          createNotification(
            `Level Up! You are now a ${newLevel === 2 ? "Small Creator" : "higher level"}!`,
            "level",
          ),
        );
        newsHeadlines.unshift(
          generateHeadline(
            { ...state, followers: newFollowers, level: newLevel },
            "levelup",
          ),
        );
      }

      const posts = [post, ...state.posts];
      if (state.posts.length % 3 === 0)
        posts.splice(1, 0, generateRivalPost(state));

      if (Math.random() < 0.15) {
        dmInbox.unshift(
          createDM("fan", "omg I just saw your post and I AM OBSESSED 😍"),
        );
      }

      const newHashtags =
        posts.filter((p) => p.authorId === "player").length % 5 === 0
          ? refreshHashtags()
          : state.trendingHashtags;

      const newState: Partial<GameState> = {
        followers: newFollowers,
        level: newLevel,
        fame: newFame,
        fanLove: newFanLove,
        hate: newHate,
        coins: newCoins,
        totalLikes: state.totalLikes + post.likes,
        posts,
        notifications,
        dmInbox,
        newsHeadlines: newsHeadlines.slice(0, 20),
        trendingHashtags: newHashtags,
        postsSinceLastEvent: postsSince,
        hypeTrain: false,
        currentDay,
        streakDays,
        lastPostDate: today,
      };

      update(newState);

      if (newFame >= 30 && !brandDeal && Math.random() < 0.3) {
        const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
        setTimeout(
          () =>
            setBrandDeal({
              id: crypto.randomUUID(),
              brand: brand.name,
              offer: brand.payout,
              isScam: brand.isScam,
            }),
          1500,
        );
      }

      const triggerThreshold = 2 + Math.floor(Math.random() * 3);
      if (postsSince >= triggerThreshold) {
        const drama = pickDramaEvent({ ...state, ...newState } as GameState);
        update({ postsSinceLastEvent: 0 });
        setTimeout(() => setDramaEvent(drama), 2000);
      }

      if (newHate >= 95) {
        setTimeout(() => {
          setDramaEvent({
            id: crypto.randomUUID(),
            type: "cancel_attempt",
            title: "🚨 YOU ARE BEING CANCELED!",
            description: `#Cancel${state.username} is the #1 trending topic. Your reputation is in freefall.`,
          });
        }, 500);
      }
    },
    [state, update, flash, brandDeal],
  );

  const respondToDrama = useCallback(
    (response: "apologize" | "ignore" | "fightback" | "explain") => {
      const result = applyDramaResponse(state, response);
      const { outcome, ...stateUpdates } = result;
      const headlines = [...state.newsHeadlines];
      headlines.unshift(generateHeadline(state, "drama"));
      const isCancelEvent = dramaEvent?.type === "cancel_attempt";
      update({
        ...stateUpdates,
        newsHeadlines: headlines.slice(0, 20),
        cancelCount: state.cancelCount + (isCancelEvent ? 1 : 0),
      } as Partial<GameState>);
      setDramaOutcome(outcome ?? "");
      setTimeout(() => {
        setDramaEvent(null);
        setDramaOutcome("");
      }, 3000);
    },
    [state, update, dramaEvent],
  );

  const dismissDrama = useCallback(() => setDramaEvent(null), []);

  const respondToBrandDeal = useCallback(
    (response: "accept" | "reject" | "scam") => {
      if (!brandDeal) return;
      if (response === "accept") {
        update({
          coins: state.coins + brandDeal.offer,
          fame: clamp(state.fame + 5, 0, 100),
        });
        flash(`💰 Deal accepted! +${brandDeal.offer} coins!`);
      } else if (response === "reject") {
        update({ fanLove: clamp(state.fanLove + 3, 0, 100) });
        flash("🤝 Stayed authentic. Fan Love increased!");
      } else {
        update({
          coins: state.coins + brandDeal.offer * 2,
          hate: clamp(state.hate + 20, 0, 100),
        });
        flash("💀 Promoted the scam. Coins gained but hate SPIKED!");
      }
      setBrandDeal(null);
    },
    [state, update, flash, brandDeal],
  );

  const dismissBrandDeal = useCallback(() => setBrandDeal(null), []);

  const deleteComment = useCallback(
    (postId: string, commentId: string) => {
      const posts = state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, deleted: true } : c,
              ),
            }
          : p,
      );
      update({ posts, hate: clamp(state.hate - 0.5, 0, 100) });
    },
    [state, update],
  );

  const replyToComment = useCallback(
    (postId: string, commentId: string, reply: string) => {
      const posts = state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, reply } : c,
              ),
            }
          : p,
      );
      const comment = state.posts
        .find((p) => p.id === postId)
        ?.comments.find((c) => c.id === commentId);
      const isTroll = comment?.type === "troll";
      update({
        posts,
        fanLove: clamp(state.fanLove + (isTroll ? -1 : 1), 0, 100),
        hate: clamp(state.hate + (isTroll ? -1 : 0), 0, 100),
      });
    },
    [state, update],
  );

  const readDM = useCallback(
    (dmId: string) => {
      update({
        dmInbox: state.dmInbox.map((d) =>
          d.id === dmId ? { ...d, read: true } : d,
        ),
      });
    },
    [state, update],
  );

  const startLiveStream = useCallback(() => setPanel("live"), []);

  const endLiveStream = useCallback(
    (donations: number, viewers: number) => {
      const followersGained = Math.floor(viewers * 0.05);
      update({
        followers: state.followers + followersGained,
        coins: state.coins + donations,
        fame: clamp(state.fame + 5, 0, 100),
      });
      flash(
        `🎬 Stream ended! +${followersGained} followers, +${donations} coins!`,
      );
      setPanel("feed");
    },
    [state, update, flash],
  );

  const buyShopItem = useCallback(
    (itemId: string) => {
      const shopItems: Record<
        string,
        { cost: number; name: string; effect: Partial<GameState> }
      > = {
        verified: {
          cost: 500,
          name: "Verified Badge",
          effect: { verifiedBadge: true },
        },
        boost: {
          cost: 300,
          name: "Engagement Boost x2",
          effect: { engagementBoost: 2 },
        },
        multiplier: {
          cost: 800,
          name: "Fame Multiplier x1.5",
          effect: { fameMultiplier: 1.5 },
        },
        hype: { cost: 400, name: "Hype Train", effect: { hypeTrain: true } },
        bots: {
          cost: 150,
          name: "Bot Followers +1000",
          effect: {
            followers: state.followers + 1000,
            hate: clamp(state.hate + 10, 0, 100),
          },
        },
        pr: {
          cost: 1000,
          name: "PR Agency",
          effect: { hate: clamp(state.hate - 20, 0, 100) },
        },
      };
      const item = shopItems[itemId];
      if (!item || state.coins < item.cost) {
        flash("Not enough coins!");
        return;
      }
      update({ coins: state.coins - item.cost, ...item.effect });
      flash(`✅ Purchased ${item.name}!`);
    },
    [state, update, flash],
  );

  const toggleGodMode = useCallback(() => {
    const next = !state.godModeActive;
    update({ godModeActive: next });
    flash(next ? "🔮 God Mode ACTIVATED!" : "God Mode deactivated");
  }, [state, update, flash]);

  const godAddFollowers = useCallback(
    (amount: number) => {
      const newFollowers = state.followers + amount;
      const newLevel = getLevel(newFollowers);
      update({ followers: newFollowers, level: newLevel });
      flash(`👥 +${amount.toLocaleString()} followers added!`);
    },
    [state, update, flash],
  );

  const godSetStats = useCallback(
    (fame: number, fanLove: number, hate: number) => {
      update({
        fame: clamp(fame, 0, 100),
        fanLove: clamp(fanLove, 0, 100),
        hate: clamp(hate, 0, 100),
      });
      flash("⚙️ Stats updated!");
    },
    [update, flash],
  );

  const godTriggerViral = useCallback(() => {
    update({ hypeTrain: true });
    flash("🔥 Viral triggered! Next post will go viral!");
  }, [update, flash]);

  const godTriggerDrama = useCallback(() => {
    const drama = pickDramaEvent(state);
    setDramaEvent(drama);
    flash("🎭 Drama event triggered!");
  }, [state, flash]);

  const godUnlockAll = useCallback(() => {
    update({
      verifiedBadge: true,
      coins: state.coins + 9999,
      engagementBoost: 3,
      fameMultiplier: 2,
    });
    flash("🔓 All features unlocked! +9999 coins, max boosts!");
  }, [state, update, flash]);

  const updateProfile = useCallback(
    (username: string, bio: string, avatar: string) => {
      update({ username, bio, avatar });
      flash("✅ Profile updated!");
    },
    [update, flash],
  );

  const markAllNotificationsRead = useCallback(() => {
    update({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    });
  }, [state, update]);

  return (
    <GameContext.Provider
      value={{
        screen,
        panel,
        state,
        dramaEvent,
        brandDeal,
        startGame,
        setPanel,
        submitPost,
        respondToDrama,
        dismissDrama,
        respondToBrandDeal,
        dismissBrandDeal,
        deleteComment,
        replyToComment,
        readDM,
        resetGame,
        startLiveStream,
        endLiveStream,
        buyShopItem,
        flashMessage,
        dramaOutcome,
        godModeActive: state.godModeActive,
        toggleGodMode,
        godAddFollowers,
        godSetStats,
        godTriggerViral,
        godTriggerDrama,
        godUnlockAll,
        updateProfile,
        markAllNotificationsRead,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
