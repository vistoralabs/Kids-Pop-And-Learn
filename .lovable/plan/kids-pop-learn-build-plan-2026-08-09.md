# Kids Pop & Learn — Build Plan

A mobile-first, offline-capable children's learning game with 8 playable categories, level progression, stars, achievements, a parent area, and sound. Built as a web app that can be wrapped for Android later.

## One important note up front

This project runs as a web app. AdMob is a native Android SDK, so real ads only work once the app is wrapped with Capacitor. The plan builds a complete **AdService abstraction** with a safe no-op/test implementation and clear documentation, so AdMob IDs can be plugged in during the Android wrap without touching game code. No production ad IDs, no ads shown to children mid-gameplay.

## Visual direction

- Bright, rounded, cartoon-like: soft sky-and-candy palette, thick rounded corners, chunky drop shadows, playful rounded display font for headings.
- A consistent mascot (a friendly smiling star character) appears on the home screen, gives feedback in games, and celebrates level completion.
- Generated illustrations for the mascot, home background, and category card art. In-game objects use large emoji glyphs plus drawn shapes/colors so nothing is copyrighted and everything renders instantly on low-end phones.
- Minimal text, huge touch targets (min 64px), portrait-first, safe-area padding, no horizontal scroll.

## Screens

```text
Home ──► Category level map ──► Game round ──► Result ──► Next level / Home
Home ──► My Stars | Achievements | Parents (hold-to-enter gate)
```

- **Home**: logo, "Play • Learn • Smile", star counter, mascot, 8 large category cards (Colors, ABC, Numbers, Animals, Shapes, Fruits, Vehicles, Matching), bottom row: My Stars, Achievements, Parents. Staggered entrance animation.
- **Level map**: 5 levels per category, locked levels show a padlock, completed levels show earned stars.
- **Game**: instruction banner with a speak button, 4–6 large tappable objects, star/score counter, home + back control.
  - Correct: confetti burst, star pop, cheerful tone, praise word, auto-advance.
  - Wrong: gentle shake, soft low tone, hint highlight, retry — never a fail state.
- **Result**: celebration animation, stars earned, "Play again" / "Next level" / "Home".
- **Matching**: flip-card memory rounds at 4/6/8/12/16 cards.
- **My Stars / Achievements**: total stars, per-category progress bars, badge grid with locked/unlocked states (First Star, Color Master, ABC Explorer, Number Hero, Animal Expert, Shape Master, Super Learner).
- **Parents** (behind a 3-second hold gate): sound toggle, music toggle, progress summary, reset progress with confirm, Privacy, About, Contact, and a "Remove ads / Premium" placeholder area — all parent-side only.
- **Privacy Policy** and **About** pages: no data collection, no accounts, offline-first.

## Gameplay & content

Data-driven question banks so new content needs no engine change:

- Colors 30+, ABC 26+, Numbers 30+ (count objects, find number, more/fewer), Animals 30+, Shapes 25+, Fruits 20+, Vehicles 20+, Matching 10+ rounds.
- One engine consumes a level config: object count, distractor difficulty, question types, round length. Questions are shuffled from the pool with no-immediate-repeat logic.
- Level 1→5 per category ramps object count and then similarity of distractors. Completing a level unlocks the next.

## Systems

- **Progress store**: stars, per-level completion, achievements, settings persisted to local storage; hydration-safe so nothing breaks on reload.
- **Sound service**: single centralized service generating tones/chimes via the Web Audio API (no copyrighted files), plus a gentle looping background music bed. Respects mute toggles; the game plays fine fully silent. Speech uses the browser's speech synthesis for letters/words when available.
- **Achievements**: evaluated after each round, unlock animation overlay.
- **Daily reward**: one bonus-star gift per calendar day, no randomness, no gambling.
- **AdService**: interface with `showInterstitial` / `showRewarded` / `isPremium`; default implementation is disabled-by-default and only ever considered between sessions, never during a round.
- **Error handling**: friendly "Oops! Let's try again 😊" fallback with a retry button instead of any technical error text.

## Technical notes

- One route per screen under `src/routes` with its own head metadata; `/` becomes the home screen.
- Layers: `src/game/engine` (round logic), `src/game/content` (question banks + level configs), `src/services` (sound, storage, ads, achievements), `src/components/kids` (shared UI: BigButton, ObjectTile, StarBurst, Mascot, Confetti).
- Animations use CSS transforms and lightweight keyframes only — no heavy animation library, no continuous background loops.
- Design tokens (colors, radii, shadows, fonts) defined once in `src/styles.css` and used everywhere.

## Verification before finishing

Drive the running app in a headless browser to walk home → each category → level → correct and wrong answers → result → next level, check star/achievement persistence across reload, the parent hold gate, sound toggles, and small-phone/tablet widths; fix console errors and overflow.

## Wrap-up summary you'll get

What was built, how to test each game, where to put AdMob test IDs and swap in production IDs, how to build the Android APK/AAB via a Capacitor wrap, and the remaining Play Store checklist items.
