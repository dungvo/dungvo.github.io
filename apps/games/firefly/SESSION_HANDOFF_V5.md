# Đom Đóm / Firefly — V5 Session Handoff (2026-11-08)

**Status:** BASELINE LOCKED for next session. No new gameplay features or art work should be assumed complete after V5. Project is **separate from Selflo**.

## Links and canonical paths
- Playable campaign: https://dungvo.github.io/apps/games/firefly/campaign/
- Game root: https://dungvo.github.io/apps/games/firefly/
- Visual concept: https://dungvo.github.io/apps/games/firefly/visual/
- Prior Chapter 1: https://dungvo.github.io/apps/games/firefly/chapter1/
- Campaign source: `apps/games/firefly/campaign/index.html`
- Production backlog: `apps/games/firefly/PRODUCTION_BACKLOG.md`
- Charter: `apps/games/firefly/PRODUCTION_CHARTER.md`
- V5 merged via PR #50: https://github.com/dungvo/dungvo.github.io/pull/50

## What is actually implemented
- Browser-playable, procedurally generated 1,000-floor tactical campaign (NOT 1,000 handcrafted chapters).
- 10 biomes of 100 floors; bosses every 10 floors; chapter transition text at each 100-floor milestone.
- Turn-based grid movement, melee/ranged attacks, magic, potions, enemies, cover, obstacles, route-based ally Lâm or stronger sword.
- Persistent HP, level, EXP, attack, inventory, potions, route and localStorage resume; 1,000th-floor completion dialogue.
- V3–V5 procedural vector visual passes: biome-specific decorations and lighting, fantasy HUD, particle/shockwave effects, boss identities/auras, keyboard controls.
- Code syntax checked; **not** browser/device QA verified or full 1,000-floor balanced.

## User-approved north star — six 10/10 quality gates
1. Opening UI and art immediately impressive.
2. Exploration and interactions compelling.
3. Deep tactical combat.
4. Memorable story and characters.
5. High-quality animation, audio, and responsive controls.
6. Replayability and secrets.
All six are **targets**, NOT achieved ratings.

## Non-negotiable collaboration instructions
- The user is the final player/reviewer, not a QA tester of each incremental change.
- Do not ask for review after every small implementation. Internally implement → inspect/test → iterate. Invite review only when there is a substantial, genuinely polished, working vertical slice.
- Do not claim a final 10/10 product based on CSS/Canvas polish or syntax checks.
- Prefer concrete code and integrated game improvements over standalone static concepts.
- User wants a cohesive original fantasy adventure / tactical RPG with hand-painted 2D / 2.5D depth, inspired by the production quality of classic JRPG/tactical RPGs, not copies of copyrighted art.
- Preserve progress and route decisions; maintain backward compatibility with existing `firefly.thousand.v1` localStorage.
- Do not conflate this standalone Firefly game with Selflo mini-games.

## Next session recommended priority
1. **Real visual foundation**: original production-quality backgrounds, consistent character sprite sheets, battle VFX, animation states and coherent art direction. Integrate into actual playable game, not only a mockup.
2. **QA first**: real desktop/mobile browser testing, inspect saved game and battle actions, identify progression blockers and performance problems; balance boss fights across sample floor bands.
3. **Vertical slice**: one complete visually striking exploration → dialogue → tactical battle → loot → next-scene sequence with distinct character and environmental art.
4. **Scale content**: unique chapter bosses, enemy mechanics, side quests, story branches, secrets and replay systems before claiming 1,000 distinct levels.
5. **Sound & accessibility**: original music/SFX, controls, reduced motion, readable mobile HUD.
6. Only then expand production systematically across the 10 biomes.

## Current known limitations
- Procedural vector art does not meet the user's desired commercial RPG visual quality.
- Encounter templates repeat; story, animation, audio, exploration and secrets are not finished.
- No verified full-run gameplay test, mobile QA, or polished visual signoff.
- GitHub Pages deploy may take time after merge.

## Suggested new-session request
“Tiếp tục Đom Đóm từ `apps/games/firefly/SESSION_HANDOFF_V5.md`. Không hỏi tôi review từng bản nhỏ. Hãy tự kiểm tra, nâng cấp artwork và gameplay trực tiếp, ưu tiên một vertical slice đẹp thực sự, giữ tương thích save và chỉ báo khi có bản đủ chất lượng.”
