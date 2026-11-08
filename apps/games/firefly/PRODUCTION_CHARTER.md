# FIREFLY — Web Game Production Charter

**Product decision:** Web-first, desktop and mobile browser; no native app until the game is genuinely fun and validated. User acts as final reviewer at playable milestone gates, not as the daily designer or developer. This charter defines the internal team's responsibilities and acceptance criteria, not a claim that a staffed human studio exists.

## Studio roles and ownership
- Game director: owns cohesive vision, scope and final quality.
- Narrative designer: original characters, chapters, branches, foreshadowing, alternate discoveries and consequences.
- Systems designer: tactical rules, progression, enemies, balance, replay value.
- Art/UI director: distinct visual identity, character sprites, scenery, animations, accessibility and responsive layouts.
- Frontend game engineer: browser canvas, input, performance, state persistence, content pipeline.
- QA/playtest: functional coverage, route reachability, mobile usability, exploits, pacing, regressions.

## Design benchmark (inspiration, not imitation)
- Fire Emblem / TearRing Saga: spatial tactics, character bonds, conditional recruitment, meaningful tradeoffs.
- Chrono Trigger: memorable world, discovery, pacing and narrative momentum.
- Triangle Strategy: decisions with consequences.
- No copying protected artwork, characters, maps, music or scripts.

## North-star experience
Within 30 seconds the player controls a memorable hero in a living, beautifully lit world. Within 3 minutes they discover something by interacting, not by reading a menu. Within 8–12 minutes they face a consequential choice and a tactically interesting battle. On replay, they find a different ally, route, scene, or reward.

## One cohesive chapter — target flow
1. **Arrival:** cinematic opening under 20 seconds; immediately move hero around an explorable forest village.
2. **Discovery:** tap nearby objects and NPCs; dialogue appears anchored in scene; environmental puzzles yield clues/items.
3. **First fork:** rescue Lâm (recruit archer; discover tunnel) OR aid gatekeeper (receive sword; unlock watchtower). Choosing one changes available content.
4. **Battle:** move on a grid with movement costs, terrain cover, ranges, clear turn feedback, enemy telegraphs and skill effects.
5. **Payoff:** unique aftermath scene per route, XP/loot, village visibly changes, cliffhanger with a complete chapter resolution.
6. **Replay:** chapter replay with separate run record and discoverable secrets, without overwriting the main campaign save.

## Visual bar
- Bespoke consistent illustrated characters; avoid emoji as final sprites.
- Parallax/ambient motion, glowing fireflies, expressive hit and item feedback, weather/time transitions.
- Legible mobile-first HUD, large touch targets, no tiny text on phones, contextual on-scene tooltips.
- Clean readable map silhouettes, intuitive reachable-tile highlights, animations not obscuring tactical clarity.
- Original music/SFX or properly licensed assets only; provide mute and reduced-motion option.

## Architecture before content expansion
- Separate engine (movement, combat, input, save) from data (chapter, dialogue, NPC, map, item, encounter).
- Versioned save slots with schema migration; durable flags and recruited allies across chapters.
- Route graph validation and content lint; ensure every required event is reachable and no soft locks.
- Chapters and Seasons are modular; each Season has closure. Season 2 is optional, not an infinite-content promise.

## Milestone gates
**M0 Prototype:** 3 separate web experiments (exploration, branching dialogue, tactics). Exists.
**M1 Tactical polish:** original drawn hero/enemy silhouettes, animated ambience, clearer combat UI. First iteration implemented at `/apps/games/firefly/tactics/`. Still a prototype.
**M2 Integrated vertical slice:** one playable map, NPC interactions, one branch, one complete tactical encounter, consequences, save, victory. NOT DONE.
**M3 Art & feel:** unique polished sprites, animations, visual effects, sound and responsive mobile controls; test on actual devices. NOT DONE.
**M4 Chapter 1 review candidate:** at least 2 genuinely distinct routes, 15–25 minutes engaging play, replay discovery, balance and QA. NOT DONE.
**M5 Chapter 2:** only after final user approval of Chapter 1. NOT DONE.

## Release checklist
- Functional: new game, resume, replay, combat victory/defeat, item use, branch flags, accessibility, no console errors.
- Balance: meaningful tactics, no unavoidable defeat, no infinite farming exploit.
- Content: branching outcomes change gameplay, no fake choice.
- Quality: attractive from first screen; good contrast; no broken layouts on iPhone 13 mini viewport and desktop.
- Performance: stable mobile frame rate, reasonable load time, no continuous animation when hidden/reduced motion.
- Review: provide a single stable link and a concise list of changes; do not ask the user to choose every design detail.

## Current honest status
Tactical experiment now has procedurally drawn original character sprites and animated lighting, but **not** professional production-quality character art and **not** a cohesive chapter. The previous prototypes remain separate. This charter is the team's execution plan and acceptance bar.

## Tactical review pass
- [Code review, fixes, and outstanding QA](PLAYTEST_REVIEW.md). Enemy pathfinding, secret relic, HUD/feedback and action rules improved. Live browser QA still pending.

## Integrated Chapter 1 iteration (2026-11-08)
- New playable single-page flow: `/apps/games/firefly/chapter1/`. Explore forest, visit house or watchtower, open secret chest, choose Lâm archer or stronger sword, approach gate, fight enemies on same map, earn XP/items, reach route-specific ending. Browser save via `firefly.integrated.chapter1.v1`.
- First integration milestone only. Art is procedural Canvas; story, battle and exploration share one session, but narrative depth, bespoke polished art, combat animations, real browser QA and save migration remain open. Do not treat this as approved final Chapter 1.

## Chapter 1 game-feel pass
- Fixed a blocking map error: Lâm's house at (2,2) had been placed on an impassable tree tile, preventing one major narrative route. Tile is now walkable.
- Added tap-to-walk BFS pathfinding for exploration, with movement halted at events/dialogue, and labels for points of interest inside the world.
- Added animated damage numbers, clearer buttons, contextual instructions and UI polish.
- Source inspection and GitHub implementation only; **not** validated by actual browser/device playtesting. Gameplay still requires deeper encounter balance, animation, story and art.

## Approved quality targets & visual prototype
- All six quality dimensions are targeted at 10/10, subject to user review, not claimed as achieved.
- [Production backlog](PRODUCTION_BACKLOG.md) tracks P0/P1/P2 scope and release gates.
- [Visual Foundation V1](visual/) is an original interactive SVG/CSS storybook forest scene with four hotspots, route choice, a secret, mobile layout and reduced-motion control. This is an art-direction study, not the final game or production-grade illustrated assets.
