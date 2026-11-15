# Light Quest — Engine-first Master Plan v1.0
Updated: 2026-11-15. Architecture approved; Eclipse vertical slice NOT implemented.

## Permanent working principles
Use proven engines/frameworks, editor tools, plugins and clearly licensed art/animation packs BEFORE custom-building physics, movement controllers, animation, tilemaps, combat utilities, dialogue systems or UI. Write custom code only for distinctive Light Quest systems and integration. A beautiful screenshot is not a substitute for compelling gameplay. Do not churn out levels without testing replay value and novelty. Record source, license, author, date and attribution needs for every asset.

## Architecture decision
- **Classic Ô sáng** remains a separate browser puzzle at `apps/games/light-quest/`. 45 levels released; PR #74 proposes 46–55, not released until tested/merged. Phaser is recommended for a future visual overhaul, preserving current solver and save.
- **Eclipse** is the new 2D Action-RPG + Metroidvania + environmental light puzzle built with **Godot 4.x + GDScript** under `apps/games/light-quest/eclipse/`.
- **Waterfall and Star Tower** remain separate existing prototypes. Check pending PR #72 independently; do not merge architecture efforts prematurely.
- Choose engines by gameplay: Godot for action-RPG; Phaser for quick browser games; RPG Maker for turn-based JRPG where appropriate. Do not force one engine for all games.

## User's desired experience
Inspired by the feel of Pokémon (exploration, NPC, progression), Mega Man X (movement/skills), Castlevania (castle, combat, revisit), with **original** characters/art/story. Two playable character archetypes: **An** (sword, dodge, parry/reflect light); **Kha** (ranged magic, temporary light, puzzle activation). New skills unlock previously blocked areas. Strong enemy variety, secrets, branching routes, satisfying controls, readable animations, emotional story.

## Core loop
Explore -> identify obstacle/clue -> fight, talk or solve an environmental light puzzle -> gain ability/item/info -> unlock new path -> revisit old areas to discover secrets.
Puzzles MUST affect world objects such as doors, bridges, lights and enemy shields. Never reduce RPG, combat and puzzle to three disconnected minigames.

## Technical outline
Godot scenes/resources and TileMapLayer for rooms, CharacterBody2D + state machine for movement, Camera2D, AnimationPlayer/AnimationTree, hitbox/hurtbox combat and enemy state machines, signal-based GameState, PuzzleManager (grid + beam reflection), Dialogue/QuestManager, item/ability Resources, SaveManager with versioned format in user://, keyboard/gamepad/touch InputMap.
Use Compatibility renderer and GDScript for web export; validate mobile Safari on a physical iPhone 13 mini. Pinned Godot version/export templates and GitHub Actions release. Do not assume WebGL2/Safari performance. Existing Classic JS solver stays untouched, and puzzle logic is independently ported to GDScript against shared test vectors. Preserve `light-quest.v1` save.

## Vertical slice: Moon Tower (15–25 min design target)
7 interconnected rooms: (1) Village/NPC & quest; (2) Dark forest/platforming & enemy; (3) Crypt/combat & secret; (4) Light tower/grid & mirror puzzle; (5) Shadow gate; (6) Observatory/checkpoint/hidden route; (7) Moon Guardian boss.
Initially player selects An or Kha; the other is an NPC. Include 3 distinct enemies, jump/dodge/attack, readable hit feedback, a 5x5 light-grid puzzle + reflected beam opening a real world gate, NPC clues, at least 1 shortcut and 1 hidden revisit. Boss teaches three phases with shielding broken via light; unlock **Moon Dash** after victory so the player can revisit a previously blocked region.

## Implementation milestones
F0. Select licensed asset pack, establish consistent art scale/palette, Godot version, benchmarks.
F1. Godot project/scene architecture/player animation/camera/mobile controls.
F2. Seven connected rooms, NPC dialogue, checkpoint, gates, environmental secrets.
F3. Combat feedback, 3 enemy behaviors, boss patterns and abilities.
F4. Grid/light beam puzzle, mirror logic, door/boss interaction and solver tests.
F5. Quests, items, unlocks, save/load, sound/VFX/UI polish.
F6. Desktop/mobile web export, iPhone Safari QA, regression, GitHub Pages release.
**Quality gates:** actual responsive play, puzzles solvable, valid hints, persistent saves, zero Classic regressions, correct licenses, animation consistency, measured mobile performance. No claims of implementation before verification.

## Proposed source structure
```
apps/games/light-quest/eclipse/
  project.godot
  scenes/{world,player,enemies,bosses,puzzles,ui}/
  scripts/{systems,combat,progression,save}/
  resources/{characters,items,abilities,levels}/
  assets/{sprites,tilesets,vfx,audio}/
  tests/
  docs/
```

## Free asset shortlist — license verified on publisher pages
- **Orius** by JIK-A-4: 7 character animations, enemy animations, 7 NPCs; marked CC0; https://jik-a-4.itch.io/orius (download via itch.io; RAR archive).
- **Kenney New Platformer Pack**: 440 files, CC0; https://kenney.nl/assets/new-platformer-pack
- **Kenney Pixel Platformer**: 200 sprites, 18×18, CC0; https://kenney.nl/assets/pixel-platformer
- **Kenney Pixel Platformer on itch.io**: https://kenney-assets.itch.io/pixel-platformer
- CC0 discovery: https://itch.io/game-assets/free/tag-cc0/tag-pixel-art/tag-sprites ; verify individual asset licenses.

Prototype with licensed assets, but do not mix mismatched pixel scales/styles into final art. Maintain an asset manifest with filenames/hashes, author/source/license, usage, and attribution status.

## Handoff rule for future AI sessions
Read THIS document and the latest source state first. Continue from existing code, honor engine-first rule and vertical-slice scope, update this doc with decisions/QA/PRs. Concepts are not playable features. Check PR #72/#74 before touching respective tracks.
