# Light Quest Eclipse — Mockup Fidelity Production Plan (locked 2026-11-15)

## Approved reference
The user's approved illustrated "Light Quest Eclipse" mockup: rich fantasy 2D side-scroller with moonlit castle, waterfalls, glowing ruins, lush plants, original An (sword) and Kha (light mage), shadow wolves, golems, floating casters, bats, a gigantic guardian, light puzzles, collectible equipment and landscape touch controls. The mockup is **concept art, not sprites/gameplay output**, and must not be claimed as implemented.

## Non-negotiable release gates
1. **Visual fidelity**: manually compare actual 960x540 gameplay screenshot beside approved mockup at equivalent scale. Every visible foreground block, platform, arch, door, crystal and interaction object must have cohesive art, rather than flat debug boxes. Correct depth hierarchy: parallax sky/castle, middle terrain, foreground foliage, readable combat silhouettes.
2. **Characters**: An and Kha have different original designs, not a shared Moss Knight placeholder. For each: idle, run, jump/fall, dash, attack, hit, death with authentic animation frames, attack timings and facing direction. Sprites keep consistent feet-on-ground alignment and no frame jumps.
3. **Enemies**: 4 readable enemy archetypes (wolf melee rush, golem heavy tell, floating mage projectile, bat dive) with proper telegraphs, hurt/death animations, enemy-vs-world collision. Guardian boss has phases and light-shield counterplay.
4. **Hit geometry**: separate physics body, player/enemy hurtboxes, directional attack hitboxes, projectile collision and interaction areas. Test reach, left/right direction, elevations, corners, invulnerability and obstruction. No damage solely from center-distance checks. No hitting through walls without an explicit rule.
5. **Player feel**: hold left joystick + jump + attack concurrently on Safari landscape. Test short/long jumps, buffered jump, coyote window, dash, landing, fall-through prevention, input-release and scene transitions. Stable sample target 60 FPS on iPhone 13 mini during encounters; collect frame timings before claiming met.
6. **UX**: mobile landscape action buttons don't occlude important world elements; readable text in Vietnamese; puzzle pause and dialogue not intercepting or leaking touch input; HUD outside action area.
7. **Release process**: CI passing is necessary, NOT sufficient. Require gameplay video/stills from running build, device Safari check, annotated difference report, sprite license manifest, and explicit mockup-fidelity review. Do not auto-publish every code commit.

## Delivery slices & dependency
| Phase | Deliverable | Quality gate |
|---|---|---|
| S0 (current) | Disable automatic public preview updates; repository clean CI; mockup spec | Existing game left alone |
| S1 | Artist-led level asset sheet: stones, moss, doors, arches, waterfall, crystal, foliage, light device, parallax | Comparison screenshot + consistent pixel/art scale |
| S2 | An + Kha character sheets and Godot AnimatedSprite2D states, contact shadow, foot alignment | All states manually previewed and silhouette judged |
| S3 | 4 enemies, projectile/attack physics, boss phases and FX | Left/right hit and missed-hit tests, no wall clipping |
| S4 | Light-grid/mirror/beam affects world, 3 interconnected polished rooms, NPC + collectible | Puzzle solvable, interacting with scene, not separate mini-game |
| S5 | Landscape UI + sound + effects + performance | iPhone Safari hands-on recorded and reviewed |
| S6 | Release candidate screenshots + comparison, regression, sign-off, then web preview publication | Reviewer can play without setup |

## Implementation notes
- Engine remains Godot 4.4.1; use Godot scenes, TileMapLayer/TileSet, AnimationPlayer/AnimatedSprite2D, CharacterBody2D and Area2D, signals and resources. Avoid hand-rolling what the engine provides.
- Reuse CC0 packs as prototype, not to claim mockup fidelity. Keep artist provenance and licensing.
- Classic Ô sáng puzzle (45 released/55 proposed) and original save untouched; preview code on PR #76 remains separate.
- Current art in `game.gd` is **procedural masonry placeholder**; code introduced a shared `hit_geometry.gd` for basic directional hitboxes. This is foundation work, not final graphics or collision quality.
- Prefer scene-by-scene replacement of `game.gd` monolith: Player.tscn, EnemyBase.tscn, WorldRoom.tscn, LightPuzzle.tscn, HUD.tscn, Boss.tscn. Preserve mechanical regression tests.

## Current status
This document and foundational code have been committed on `feature/light-quest-eclipse-playable-slice`. No claim that the release matches mockup. The previous public prototype may still exist at /apps/games/light-quest/eclipse/. CI auto-publish is deliberately disabled pending human visual/device review.

## Handoff
Next AI must inspect this plan and current PR code; implement the earliest unmet gate, validate with Godot, capture actual frames, and only share the production preview when visual + controls + collision pass. Do not infer completion from mockup alone.

## Visual QA observations (2026-11-15, real rendered frames)
A reproducible Godot screenshot job now runs under `xvfb-run` and uploads `eclipse-actual-gameplay-screen`. The first screenshot showed a tiny airborne-looking character, flat dark-rectangle skyline, plain terrain and overlaid controls. A subsequent screenshot after art-scale/ground-alignment work shows the character grounded and larger with styled buttons and masonry; **still far below the approved mockup**. Scene contains no painted waterfall/castle background, distinctive original An/Kha character designs, animated 4-enemy roster, ornate tile assets or polished boss encounter.
Do not mark visual gate passed. Require side-by-side screenshots at 960×540, per-room visual review and iPhone Safari live test. An original painted waterfall/castle concept was generated in ChatGPT but is NOT in the GitHub project; it must be optimized, versioned and imported as a real licensed image resource before describing it as playable art.
GitHub Actions workflow run #43686845035 produced the latter frame and confirmed all Godot tests; visual approval remains pending.

## Implementation review · 2026-11-15
The current draft supersedes the procedural foundation described above. It contains imported original scenery and sprite atlases, Godot physics-based combat, a world-space mirror puzzle, a recoverable checkpoint and a boss encounter with shield counterplay. The [QA handoff](VISUAL_QA_HANDOFF.md) records the rendered comparison, regression checks and outstanding release gates. Keep Pages publication disabled while those gates are open.
