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

## Automated build / preview (2026-11-15)
- **Godot validation**, mechanics smoke test, **CC0 asset packaging**, and **HTML5 web export** passed in GitHub Actions run https://github.com/dungvo/dungvo.github.io/actions/runs/43671309727 .
- Download **eclipse-web-preview** under that run's Artifacts section (GitHub sign-in may be required). ZIP contains HTML/WASM/PCK; extract all into one folder and serve via a local HTTP server, e.g. `python3 -m http.server 8000` from extracted directory, then visit http://localhost:8000/index.html .
- Asset artifact **eclipse-kenney-cc0-prototype** preserves one selected sprite, original license and provenance. Regenerate with `python3 tools/install_cc0_assets.py`; the build does this before export.
- The exported build is **not deployed** at dungvo.github.io yet; the existing Light Quest remains unchanged.
- Automated testing does NOT prove mobile touch usability or final animation quality. This remains an early **mechanical** slice, not the full polished RPG.
- Next quality milestone: real sprite animation states (idle/run/jump/attack/hurt), tilemaps per biome, enemy variety, boss telegraphs, save migration and mobile Safari playtest.
