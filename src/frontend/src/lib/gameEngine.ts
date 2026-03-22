import type {
  Comment,
  DM,
  DramaEvent,
  GameNotification,
  GameState,
  Post,
} from "../types/game";
import {
  AI_INFLUENCERS,
  DRAMA_EVENTS,
  HASHTAG_POOL,
  LEVEL_THRESHOLDS,
} from "../types/game";

const SAVE_KEY = "internet_drama_save";

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function createInitialState(
  username: string,
  bio: string,
  avatar: string,
): GameState {
  const hashtags = shuffleArray([...HASHTAG_POOL]).slice(0, 8);
  return {
    username,
    bio,
    avatar,
    followers: 0,
    following: 42,
    joinDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    fame: 0,
    fanLove: 50,
    hate: 0,
    level: 1,
    coins: 100,
    posts: [],
    rivals: AI_INFLUENCERS.map((r) => ({ ...r })),
    dmInbox: [
      createDM(
        "fan",
        "Hey, just found your page! Looking forward to seeing your content 👀",
      ),
      createDM(
        "brand",
        "Hi! We at StartupBrand would love to work with you when you grow a bit more 📩",
      ),
    ],
    notifications: [],
    inventory: [],
    newsHeadlines: [
      "Internet drama is at an all-time high today",
      "New creators are rising — who will make it?",
      "The drama never stops on social media",
    ],
    trendingHashtags: hashtags,
    postsSinceLastEvent: 0,
    verifiedBadge: false,
    engagementBoost: 1,
    fameMultiplier: 1,
    hypeTrain: false,
    totalLikes: 0,
    cancelCount: 0,
    currentDay: 1,
    streakDays: 0,
    lastPostDate: "",
    godModeActive: false,
  };
}

export function getLevel(followers: number): number {
  let level = 1;
  for (const t of LEVEL_THRESHOLDS) {
    if (followers >= t.min) level = t.level;
  }
  return level;
}

export function getLevelName(level: number): string {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.name ?? "Unknown";
}

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateComments(
  postType: string,
  isViral: boolean,
): Comment[] {
  const count = isViral ? randomInt(5, 10) : randomInt(3, 7);
  const comments: Comment[] = [];
  const fanNames = [
    "@superfan99",
    "@loyal_viewer",
    "@daily_watcher",
    "@megafan2024",
    "@urfave_person",
  ];
  const neutralNames = [
    "@just_browsing",
    "@random_user",
    "@passing_by",
    "@idk_lol",
  ];
  const trollNames = [
    "@troll_king",
    "@hater_account",
    "@negative_nelly",
    "@drama_starter",
  ];

  const pool: { type: Comment["type"]; texts: string[] }[] = [
    {
      type: "fan",
      texts: [
        "omg I love you!! 😍",
        "you are literally everything 💕",
        "QUEEN BEHAVIOR 👑",
        "I stan forever 🔥",
        "obsessed with your content",
        "you never miss bestie 💅",
      ],
    },
    {
      type: "positive",
      texts: [
        "great content!",
        "this is actually really good",
        "keep it up!",
        "solid post ngl",
        "earned a follow 👍",
        "way better than expected",
      ],
    },
    {
      type: "neutral",
      texts: [
        "ok",
        "interesting i guess",
        "hmm",
        "not bad not great",
        "seen better tbh",
        "whatever",
      ],
    },
    {
      type: "troll",
      texts: [
        "this is trash lmaooo",
        "nobody asked for this 💀",
        "ratio 📉",
        "imagine posting this unironically",
        "cringe",
        "L + ratio + fell off",
      ],
    },
  ];

  const weights = isViral ? [40, 30, 15, 15] : [25, 25, 25, 25];
  if (postType === "meme") {
    weights[1] += 10;
    weights[3] -= 10;
  }

  for (let i = 0; i < count; i++) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    let chosen = pool[0];
    for (let j = 0; j < pool.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        chosen = pool[j];
        break;
      }
    }
    const names =
      chosen.type === "fan"
        ? fanNames
        : chosen.type === "troll"
          ? trollNames
          : neutralNames;
    comments.push({
      id: crypto.randomUUID(),
      type: chosen.type,
      text: chosen.texts[randomInt(0, chosen.texts.length - 1)],
      author: names[randomInt(0, names.length - 1)],
    });
  }
  return comments;
}

export function createPost(
  type: Post["type"],
  content: string,
  title: string,
  hashtags: string[],
  state: GameState,
): { post: Post; followerDelta: number; coinsDelta: number; isViral: boolean } {
  const baseGain = randomInt(5, 50);
  const levelBonus = state.level * 10;
  const hashtagBonus = hashtags.length * 15;
  const viralChance =
    0.15 +
    hashtags.length * 0.05 +
    (state.fame / 100) * 0.1 +
    (state.hypeTrain ? 0.99 : 0);
  const isViral = Math.random() < viralChance;

  let followerDelta = Math.round(
    (baseGain + levelBonus + hashtagBonus) *
      state.engagementBoost *
      state.fameMultiplier,
  );
  if (isViral) followerDelta += randomInt(200, 2000);

  const likes = Math.round(followerDelta * randomInt(3, 8) * (isViral ? 5 : 1));
  const shares = Math.round(likes * 0.15);
  const coins = Math.round(likes / 100);
  const comments = generateComments(type, isViral);

  const typeEmoji = { text: "📝", meme: "😂", selfie: "🤳", video: "🎬" }[type];

  const post: Post = {
    id: crypto.randomUUID(),
    type,
    content,
    title: title || undefined,
    hashtags,
    likes,
    shares,
    comments,
    followersGained: followerDelta,
    isViral,
    timestamp: Date.now(),
    authorId: "player",
    authorName: state.username,
    authorAvatar: `${typeEmoji} ${state.avatar}`,
  };

  return { post, followerDelta, coinsDelta: coins, isViral };
}

export function generateRivalPost(state: GameState): Post {
  const rival = state.rivals[randomInt(0, state.rivals.length - 1)];
  const types: Post["type"][] = ["text", "meme", "selfie", "video"];
  const contents = [
    "Just vibing with my followers 🔥",
    "The grind never stops 💪",
    "POV: you are winning at life",
    "Not going to name names but... you know who you are 👀",
    "My haters keep me motivated tbh",
    "New content dropping soon 👀",
  ];
  return {
    id: crypto.randomUUID(),
    type: types[randomInt(0, 3)],
    content: contents[randomInt(0, contents.length - 1)],
    hashtags: shuffleArray(HASHTAG_POOL).slice(0, randomInt(1, 3)),
    likes: randomInt(500, 50000),
    shares: randomInt(50, 5000),
    comments: generateComments("text", false).slice(0, 3),
    followersGained: 0,
    isViral: Math.random() < 0.1,
    timestamp: Date.now() - randomInt(1000, 3600000),
    authorId: rival.id,
    authorName: rival.username,
    authorAvatar: rival.avatar,
  };
}

export function pickDramaEvent(state: GameState): DramaEvent {
  const event = DRAMA_EVENTS[randomInt(0, DRAMA_EVENTS.length - 1)];
  const rival = state.rivals[randomInt(0, state.rivals.length - 1)];
  return {
    id: crypto.randomUUID(),
    type: event.type,
    title: event.title,
    description: event.description
      .replace("{rival}", rival.username)
      .replace("{username}", state.username),
    rivalName: rival.username,
  };
}

export function applyDramaResponse(
  state: GameState,
  response: "apologize" | "ignore" | "fightback" | "explain",
): Partial<GameState> & { outcome: string } {
  let fame = state.fame;
  let fanLove = state.fanLove;
  let hate = state.hate;
  let followers = state.followers;
  let outcome = "";

  if (response === "apologize") {
    fanLove = clamp(fanLove + 10, 0, 100);
    hate = clamp(hate - 5, 0, 100);
    followers = Math.max(0, followers - randomInt(50, 200));
    outcome =
      "Your apology was well received. FanLove up, but some followers left.";
  } else if (response === "ignore") {
    hate = clamp(hate + 5, 0, 100);
    if (Math.random() < 0.2) hate = clamp(hate + 10, 0, 100);
    outcome =
      "You ignored it. Hate crept up. Some people respect the silence...";
  } else if (response === "fightback") {
    hate = clamp(hate + 15, 0, 100);
    fame = clamp(fame + 5, 0, 100);
    const delta =
      Math.random() < 0.5 ? randomInt(100, 500) : -randomInt(50, 300);
    followers = Math.max(0, followers + delta);
    outcome =
      delta > 0
        ? "You fought back and the crowd is hyped! Followers surged but hate spiked."
        : "Backfired. People think you are messy. Followers dropped.";
  } else {
    fame = clamp(fame + 8, 0, 100);
    fanLove = clamp(fanLove + 5, 0, 100);
    hate = clamp(hate - 3, 0, 100);
    outcome = "Your explanation video calmed things down. Fame up, hate down.";
  }

  return { fame, fanLove, hate, followers, outcome };
}

export function createDM(
  fromType: DM["fromType"],
  message: string,
  from?: string,
  avatar?: string,
): DM {
  const defaults: Record<DM["fromType"], { from: string; avatar: string }> = {
    fan: { from: `@fan_${randomInt(1000, 9999)}`, avatar: "💕" },
    hater: { from: `@hater_${randomInt(1000, 9999)}`, avatar: "💀" },
    rival: { from: "@rival", avatar: "😈" },
    brand: { from: "BrandHQ", avatar: "💼" },
  };
  return {
    id: crypto.randomUUID(),
    from: from ?? defaults[fromType].from,
    fromType,
    avatar: avatar ?? defaults[fromType].avatar,
    message,
    read: false,
    timestamp: Date.now(),
  };
}

export function createNotification(
  message: string,
  type: GameNotification["type"],
): GameNotification {
  return {
    id: crypto.randomUUID(),
    message,
    type,
    timestamp: Date.now(),
    read: false,
  };
}

export function generateHeadline(state: GameState, trigger: string): string {
  const templates: Record<string, string[]> = {
    viral: [
      `${state.username} breaks the internet with latest post 🔥`,
      `${state.username}'s post is being shared everywhere`,
      `Nobody can stop talking about ${state.username}`,
    ],
    drama: [
      `Fans divided as ${state.username} faces latest controversy`,
      `Internet erupts over ${state.username}'s actions`,
      `Is ${state.username} canceled? Drama unfolds...`,
    ],
    levelup: [
      `${state.username} officially a ${getLevelName(state.level)} now 📈`,
      `Rising star ${state.username} hits new milestone`,
    ],
    cancel: [
      `#Cancel${state.username} trends as drama unfolds`,
      `${state.username} faces wave of backlash`,
    ],
    generic: [
      "Internet drama is at an all-time high today",
      "Who will be canceled next?",
      "New beef brewing on social media",
      "Fans are not happy with recent events",
    ],
  };
  const pool = templates[trigger] ?? templates.generic;
  return pool[randomInt(0, pool.length - 1)];
}

export function refreshHashtags(): string[] {
  return shuffleArray([...HASHTAG_POOL]).slice(0, 8);
}

export function getLeaderboard(state: GameState): {
  rank: number;
  username: string;
  avatar: string;
  followers: number;
  fame: number;
  hate: number;
}[] {
  const aiPlayers = [
    {
      username: "@InfluencerKing",
      avatar: "👑",
      followers: 1200000,
      fame: 85,
      hate: 20,
    },
    {
      username: "@DramaQueen99",
      avatar: "👸",
      followers: 450000,
      fame: 70,
      hate: 55,
    },
    {
      username: "@CloutChaser_X",
      avatar: "💰",
      followers: 230000,
      fame: 60,
      hate: 40,
    },
    {
      username: "@CancelCulture",
      avatar: "🚨",
      followers: 670000,
      fame: 65,
      hate: 75,
    },
    {
      username: "@FakeFriendly",
      avatar: "😇",
      followers: 120000,
      fame: 45,
      hate: 30,
    },
    {
      username: "@ViralVenom",
      avatar: "🐍",
      followers: 890000,
      fame: 80,
      hate: 60,
    },
    {
      username: "@MemeGod2024",
      avatar: "😂",
      followers: 2100000,
      fame: 90,
      hate: 10,
    },
    {
      username: "@TruthBomber",
      avatar: "💣",
      followers: 340000,
      fame: 55,
      hate: 65,
    },
    {
      username: "@SilentHustle",
      avatar: "🤫",
      followers: 78000,
      fame: 40,
      hate: 5,
    },
    {
      username: "@ChaosMaker",
      avatar: "🔥",
      followers: 560000,
      fame: 75,
      hate: 80,
    },
  ];

  const all = [
    ...aiPlayers,
    {
      username: state.username,
      avatar: state.avatar,
      followers: state.followers,
      fame: state.fame,
      hate: state.hate,
    },
  ].sort((a, b) => b.followers - a.followers);

  return all.map((p, i) => ({ ...p, rank: i + 1 }));
}
