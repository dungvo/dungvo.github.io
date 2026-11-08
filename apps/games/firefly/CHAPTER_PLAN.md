# Firefly RPG — Chapter & Season Architecture

Status: **Chapter 1 playable prototype**. Future chapters and Season 2 are **planned concepts**, not implemented.

## Vision
A standalone fantasy adventure/tactical RPG that can expand chapter by chapter, then season by season. Every season has a satisfying ending; optional later seasons open new regions, characters and mysteries. **Not literally infinite content**: extensible structure with authored, tested chapters and meaningful outcomes.

## Playable now
- `/apps/games/firefly/`: original exploration prototype (3 regions).
- `/apps/games/firefly/rpg/`: **Chapter 1 — Ngôi Làng Tắt Đèn**, branching story, one turn-based battle, HP, EXP, levels, weapons, potions, inventory, alternate discoveries and chapter completion.
- RPG is a separate early vertical slice; the exploration and RPG systems are **not integrated** yet.
- Save is localStorage key `games.firefly.rpg.v1`; it can be overwritten by replay. No cross-device sync.

## Season 1 — The Fading Light (proposed)
1. **Ngôi Làng Tắt Đèn** — first choice: rescue a child, help a gatekeeper, or investigate the temple. Outcomes: ally/route, sword, or rune; battle or secret passage. **Prototype available.**
2. **Hồ Trăng và Người Giữ Lời Hứa** — paths diverge based on saved flags; ally and reputation matter. **Not implemented.**
3. **Đền Sao** — environmental puzzles, tactical enemies and a major revelation. **Not implemented.**
4. **Cánh Cổng Bình Minh** — branching finale with a complete Season 1 resolution and an optional mystery hook. **Not implemented.**

## Season 2 — Beyond the Gate (optional, unapproved)
New land and conflict; recognize meaningful Season 1 choices without requiring Season 1 to be replayed. Provide a default backstory for new players. No content commitments until Season 1 is validated.

## Architecture target for future chapters
Each chapter should have:
- Stable `season_id`, `chapter_id`, `version`, unlock requirements.
- Narrative nodes with choices, preconditions, effects and destination nodes.
- Tactical encounter definitions, enemies, loot, map and completion conditions.
- Persistent character stats, inventory, party roster, story flags and journal.
- One or more chapter endings, including a complete local resolution.
- Optional secrets/branches that create a real reason to replay.
- Migration/versioning for old saves; no destructive resets when adding chapters.
- Content validation: every branch reachable; no soft locks; items/flags consistent; combat balanced.

## MVP review gates
1. Test Chapter 1 on iPhone: readability, tapping, replaying choices, battle feedback, saving.
2. Improve actual art, animated exploration, tactics, and narrative quality; the current RPG uses a lightweight illustrated scene and simple combat.
3. Separate game engine and chapter data into maintainable modules before adding Chapter 2.
4. Only then author Chapter 2 with flags and outcomes carried forward.
5. End Season 1 with closure; open Season 2 only if gameplay is engaging.

## Inspiration boundary
Inspired by player agency, strategic stakes and discoverability associated with tactical RPGs such as Fire Emblem and TearRing Saga; original characters, narrative, assets, mechanics implementation and maps only.

## 2026-11-08 tactical web gameplay experiment
- New playable standalone battle: `/apps/games/firefly/tactics/` with canvas map, selectable units, movement range, attack range, cover terrain, enemy turn AI, HP, XP, level-ups, item rewards, heal potion, local save and two initial branches (recruit an archer or receive a stronger sword).
- Research inspiration: Fire Emblem grid tactics, TearRing Saga conditional recruitment and route discoveries, Triangle Strategy consequential route choices. Use original world and assets.
- **Not yet a polished integrated RPG:** battle is separate from exploration and dialogue prototypes, visuals use emoji characters and canvas terrain, no authored chapter-to-chapter save integration. Requires actual mobile QA and player feedback.
- Next vertical slice: unify scene exploration, NPC dialogue, combat and narrative consequences; improve bespoke character sprites/animation and art direction; expand meaningful events and encounter variety.
