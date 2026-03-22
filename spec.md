# Internet Drama – Mobile Responsive Overhaul

## Current State
- App uses `px-3 md:px-6` and `max-w-6xl` centering, which on mobile creates empty side margins and a narrow scrollable column in the center.
- No dedicated Profile panel for mobile — profile info only appears in the desktop left sidebar (hidden on mobile).
- TopBar stat ticker bar is cramped on mobile with too many items squished together.
- MobileNav has no Profile option; players cannot access their profile stats on mobile.
- No first-time tutorial or welcome guide after onboarding.

## Requested Changes (Diff)

### Add
- **ProfilePanel** (`src/frontend/src/components/panels/ProfilePanel.tsx`): Full-screen mobile-friendly profile view showing avatar, username, bio, level, followers, following, Fame/FanLove/Hate meters, rivals list, edit profile shortcut, and new game button. Mirrors desktop ProfileSidebar content but styled for mobile full-width.
- **"profile" Panel type** added to GameContext Panel union and MobileNav.
- **First-time tutorial overlay** (`src/frontend/src/components/WelcomeTour.tsx`): Shown once after first login, 3-step card walkthrough (Post content → Face drama → Grow fame) with a dismiss button. Stored in localStorage so it only shows once.
- **Profile avatar button in TopBar** navigates to profile panel on mobile.

### Modify
- **App.tsx**: Remove horizontal padding on mobile (`px-0 md:px-6`), make main content area fill full width on mobile. Ensure no empty side gutters.
- **TopBar**: On mobile, collapse the stat ticker to show only the 3 most important stats (Followers, Fame, Hate) with horizontal scroll. Desktop keeps all stats.
- **MobileNav**: Add Profile tab (👤 Profile) as the first item. Reorganize so most-used items come first: Profile, Feed, Notifications, DMs, Shop, More (Live/Leaderboard/Settings). Or show all 8 cleanly with larger touch targets and label below icon.
- **index.css**: Ensure `body` has `overflow-x: hidden` and mobile full-bleed layout. Clean up any fixed widths causing side gaps.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `"profile"` to the Panel type in GameContext.tsx.
2. Create ProfilePanel.tsx as a full-width mobile-friendly profile view.
3. Create WelcomeTour.tsx with 3-step first-time tutorial, localStorage gate.
4. Update App.tsx: zero horizontal padding on mobile, full-width main area, render ProfilePanel and WelcomeTour.
5. Update TopBar: compact mobile stat row (3 stats, scrollable); avatar tap goes to profile panel.
6. Update MobileNav: add Profile tab, improve touch target sizes.
7. Update index.css: add `overflow-x: hidden` on body/html, ensure full-bleed mobile layout.
