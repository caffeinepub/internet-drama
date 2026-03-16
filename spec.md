# Internet Drama

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full web-based social media simulator game with 15 interconnected systems
- Onboarding screen: player creates username, bio, avatar (emoji picker or preset avatars)
- Top navigation bar: Internet Drama logo, notifications icon, DM icon, profile icon
- Persistent stats bar: followers, fame, fanLove, hate, posts, rivals, level, inventory count
- Social feed with scrolling posts (player + AI-generated rivals)
- Post creator: 4 post types (text, meme, selfie, video) with hashtag attachment
- AI comment system: positive, neutral, troll, fan comments per post; reply/ignore/delete actions
- Random drama event system: triggers every 2-4 posts; player picks response (apologize, ignore, fight back, explanation video)
- Rival influencer system: 5+ AI rivals with names, follower counts, behavior (attack, copy, collab)
- Viral post system: probability-based, outcomes of +followers, +likes, trending hashtag, possible drama trigger
- Trending hashtag system: rotating set of hashtags, boosts viral chance
- Fame level system: 6 levels (Unknown User → Global Icon) unlocking features
- Reputation system: Fame / Fan Love / Hate meters (0-100), high hate triggers cancel events
- Internet news ticker: fake headlines reflecting player actions
- Brand deals system: offers appear at fame threshold; accept/reject/promote scam choices
- DM inbox: messages from fans, haters, influencers, brands; some trigger hidden events
- Fame leaderboard: top influencers, most controversial, most followed; player rank updates live
- Fame shop: verified badge, themes, engagement boosts, fame multipliers (in-game currency)
- Live streaming feature: start stream, fans donate, trolls appear, live drama events
- Auto-save to localStorage on every meaningful action

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Set up React app structure with game state context (localStorage persistence)
2. Build onboarding/profile creation screen
3. Build top navbar + persistent stats strip
4. Implement core game state: followers, fame, fanLove, hate, posts, level, coins, inventory
5. Build post creator component (4 types + hashtag picker)
6. Build social feed with player posts + AI rival posts
7. Implement AI comment generator per post (reply/ignore/delete)
8. Implement drama event system with modal popup + response choices
9. Implement rival influencer AI (5 named rivals, behaviors)
10. Implement viral post probability engine
11. Build trending hashtags panel
12. Build reputation meters panel
13. Build news ticker (scrolling headlines)
14. Build brand deals modal
15. Build DM inbox panel
16. Build leaderboard panel
17. Build fame shop panel
18. Build live stream modal/overlay
19. Wire all systems together with event triggers (every 2-4 posts)
20. Apply fictional social-media visual style, responsive layout
