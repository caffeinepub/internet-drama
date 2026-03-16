export interface Post {
  id: string;
  type: "text" | "meme" | "selfie" | "video";
  content: string;
  title?: string;
  hashtags: string[];
  likes: number;
  shares: number;
  comments: Comment[];
  followersGained: number;
  isViral: boolean;
  timestamp: number;
  authorId: "player" | string; // rival id
  authorName: string;
  authorAvatar: string;
}

export interface Comment {
  id: string;
  type: "fan" | "positive" | "neutral" | "troll";
  text: string;
  author: string;
  reply?: string;
  deleted?: boolean;
}

export interface Rival {
  id: string;
  username: string;
  avatar: string;
  followers: number;
  personality: "aggressive" | "copycat" | "canceler" | "backstabber" | "venom";
  hostility: number; // 0-100
  isEnemy: boolean;
}

export interface DM {
  id: string;
  from: string;
  fromType: "fan" | "hater" | "rival" | "brand";
  avatar: string;
  message: string;
  read: boolean;
  timestamp: number;
  actionTaken?: boolean;
}

export interface GameNotification {
  id: string;
  message: string;
  type: "viral" | "drama" | "deal" | "level" | "follower" | "dm";
  timestamp: number;
  read: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: "badge" | "theme" | "boost" | "multiplier" | "hype" | "bots" | "pr";
  active: boolean;
  remainingUses?: number;
}

export interface DramaEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  rivalName?: string;
}

export interface BrandDeal {
  id: string;
  brand: string;
  offer: number;
  isScam: boolean;
}

export interface GameState {
  username: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  joinDate: string;
  fame: number;
  fanLove: number;
  hate: number;
  level: number;
  coins: number;
  posts: Post[];
  rivals: Rival[];
  dmInbox: DM[];
  notifications: GameNotification[];
  inventory: InventoryItem[];
  newsHeadlines: string[];
  trendingHashtags: string[];
  postsSinceLastEvent: number;
  verifiedBadge: boolean;
  engagementBoost: number;
  fameMultiplier: number;
  hypeTrain: boolean;
  totalLikes: number;
  cancelCount: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, name: "Unknown User", min: 0 },
  { level: 2, name: "Small Creator", min: 500 },
  { level: 3, name: "Influencer", min: 5000 },
  { level: 4, name: "Viral Star", min: 50000 },
  { level: 5, name: "Internet Celebrity", min: 500000 },
  { level: 6, name: "Global Icon", min: 5000000 },
];

export const HASHTAG_POOL = [
  "#CancelSeason",
  "#DramaAlert",
  "#CreatorWar",
  "#ExposeTrend",
  "#ViralMoment",
  "#InternetBeef",
  "#CancelCulture",
  "#DramaUnfolding",
  "#FameGame",
  "#CloutChase",
  "#CallOut",
  "#Receipts",
  "#Trending",
  "#MustSee",
  "#BreakingDrama",
  "#ExposedSZN",
];

export const DRAMA_EVENTS: Omit<DramaEvent, "id" | "rivalName">[] = [
  {
    type: "old_post",
    title: "Old Post Exposed! 😱",
    description:
      "A screenshot of your old cringe post just went viral. Everyone is talking about it.",
  },
  {
    type: "rival_attack",
    title: "Rival Attack! ⚔️",
    description:
      "{rival} just called you out publicly. They posted a whole expose thread about you.",
  },
  {
    type: "fake_rumor",
    title: "Fake Rumor Spreading 🔥",
    description:
      "Someone is spreading fake rumors about you. It's going viral fast.",
  },
  {
    type: "screenshot_leak",
    title: "Screenshot Leaked 📸",
    description:
      "A private DM was leaked to the internet. Your followers are shook.",
  },
  {
    type: "fan_war",
    title: "Fan War Erupts 💥",
    description:
      "Your fans are fighting each other in the comments. It's chaos.",
  },
  {
    type: "cancel_attempt",
    title: "Cancel Attempt! 🚨",
    description:
      "You are trending for the wrong reasons... #Cancel{username} is gaining traction.",
  },
  {
    type: "brand_controversy",
    title: "Brand Controversy 💼",
    description:
      "A brand deal you took is now controversial. People think you sold out.",
  },
  {
    type: "viral_meltdown",
    title: "Viral Meltdown 🌪️",
    description:
      "Your recent post caused a public meltdown. The internet cannot decide if you are right or wrong.",
  },
];

export const BRANDS = [
  { name: "GlowUp Cosmetics", payout: 800, isScam: false },
  { name: "TechGadgetPro", payout: 1200, isScam: false },
  { name: "FastFashionFit", payout: 600, isScam: false },
  { name: "SnackAttack", payout: 500, isScam: false },
  { name: "EnergyDrinkX", payout: 1500, isScam: false },
  { name: "CryptoMoonShot", payout: 3000, isScam: true },
  { name: "QuickRichScheme", payout: 2500, isScam: true },
];

export const AI_INFLUENCERS = [
  {
    id: "rival_1",
    username: "@DramaQueen99",
    avatar: "👸",
    followers: 45000,
    personality: "aggressive" as const,
    hostility: 80,
    isEnemy: false,
  },
  {
    id: "rival_2",
    username: "@CloutChaser_X",
    avatar: "💰",
    followers: 23000,
    personality: "copycat" as const,
    hostility: 50,
    isEnemy: false,
  },
  {
    id: "rival_3",
    username: "@CancelCulture",
    avatar: "🚨",
    followers: 67000,
    personality: "canceler" as const,
    hostility: 70,
    isEnemy: false,
  },
  {
    id: "rival_4",
    username: "@FakeFriendly",
    avatar: "😇",
    followers: 12000,
    personality: "backstabber" as const,
    hostility: 40,
    isEnemy: false,
  },
  {
    id: "rival_5",
    username: "@ViralVenom",
    avatar: "🐍",
    followers: 89000,
    personality: "venom" as const,
    hostility: 60,
    isEnemy: false,
  },
];
