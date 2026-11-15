# Light Quest Eclipse — Moon Tower vertical slice

Engine: **Godot 4.3+**, GDScript, Compatibility renderer, no custom binary dependencies. This branch contains a **code-first mechanical prototype**, not a polished pixel-art release.

## Run
1. Install Godot 4.3+ from https://godotengine.org/download/
2. Open `project.godot` as an existing project.
3. Press **F6/F5** to launch `scenes/main.tscn` / project.
4. Choose An or Kha. **A/D / arrows** move, **Space** jump, **J** attack, **K** dash, **E** interact, **R** respawn. On-screen mobile buttons are included.

## Goals
Visit seven horizontally connected rooms, speak to Kha in the village, battle enemies, activate the 5x5 light-grid puzzle at the tower (room 4), pass the gate, save at the observatory and defeat the Moon Guardian by first breaking his shield at the light pedestal (E). Boss victory unlocks Moon Dash.

## Status / limitations
- Implemented in-source: programmatic terrain, player movement, enemy chase, attack/dodge, puzzle, quest hints, shield boss, save, touch controls.
- NOT implemented: imported sprites, animation frames, real tilesets, background music, fully animated combat, genuine 7-room scene transitions, item inventory.
- QA NOT completed: this runner has no Godot binary. Validate Godot parser/runtime, mobile UX and save before merge.
- Do not deploy as a finished game yet. Existing `light-quest.v1` Classic save is untouched. Eclipse uses `user://eclipse_save_v1.json`.

## Next
- Import one stylistically consistent, legally verified sprite pack (source/license/author/attribution manifest).
- Replace placeholder drawing with AnimatedSprite2D, TileMapLayer and SpriteFrames.
- Run Godot headless `--path . --headless --quit`, fix errors, smoke-test and web export.
- For web: single-threaded export, GDScript, Compatibility; test Safari/iPhone 13 mini in person.
