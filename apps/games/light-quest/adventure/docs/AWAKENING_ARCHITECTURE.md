# Light Quest — Khu Vườn Thức Tỉnh

## Run the room and its tests

Serve the repository as static files, for example with `python3 -m http.server 8000` from the repository root, then open `/apps/games/light-quest/adventure/playable-v2/`. Run `npm test` in the adventure directory. The original adventure and tactical demo retain their own entry points.

## Simulation and rendering

| Layer | File | Contract |
| --- | --- | --- |
| Room definition and turns | `core/garden-room.js` | Positions, sources, device parameters, objectives and patrol. `applyGardenAction` validates the action and returns a fresh snapshot and an event list. |
| Optics | `core/tactical-optics.js` | Cast normalized rays, resolve the closest valid positive intersection, reflect at the mirror segment, and return geometry, power, contacts and receiver hits. |
| Stage | `playable-v2/play.js` | Phaser Canvas reuses terrain and sprite atlas frames. Map core coordinates into the board once. Render every beam directly from its returned endpoints. |
| Controls | `playable-v2/index.html`, `playable-v2/play.css` | Native controls, keyboard focus and live status, anchored hot spots, portrait and landscape sizing, and reduced-motion support. |
| Art | `assets/awakening/` | Separate environment painting, character cutouts, and a WebP texture atlas with named Phaser frames. |
| Design reference | `mockups/awakening-reference.webp` | Sourced from the first-level fantasy mockup “Nhiệm Vụ Ánh Sáng Đầu Tiên”. Reference only. |

The beam travels in eight headings. Rotating a mirror by 22.5° shifts the reflected direction by 45°. A single-sided mirror reflects only when the incident direction has a negative dot product with its outward face normal. A ray parallel to a mirror travels past the idealized plane. Rocks and walls have round colliders. Filters, splitters, lenses and receivers interact at their pivots. Colors represent gameplay bands. The board is a spatial arrangement of fixtures and the ray remains continuous between them.

Power decays exponentially with distance. Passive components divide, attenuate or absorb it. A powered amplifier contributes a fixed external supply per crossing, subject to a gain and output cap. A minimum power and ray interaction budget bound the work. Cycle tracking is local to each ray branch, so independent sources can share a path and still report distinct hits.

A turn spends energy, resolves ray damage against the current wolf position and sealed rock, advances the wolf and applies a telegraphed mirror break when applicable. The final state is traced again after the impact changes the board. Gate and pattern awards are latched and undoable. Phaser renders this final snapshot. Reward logic only matches adjacent geometric checkpoints traced by the gold source. Optical power and the player's action energy are separate quantities.

## Room solution fixtures

- Turn both main mirrors to 45° to send the gold beam right, down, then right. This opens the gate and earns the pattern seal.
- Turn the north mirror to 0° to feed the right-hand splitter. Its downward branch passes through a powered amplifier and opens the same gate.
- Turn on the red emitter to break the sealed rock. Pick up the repair shard, then apply it to the broken east mirror. Keeping the red source on during this sequence also defeats the wolf.
- Cast Soi Sáng at the lantern and collect the revealed flower. Undo rolls back all of these state changes. Restart returns the room to its original state.

## Performance and compatibility

The renderer uses a fixed 856 × 744 Canvas. Art is WebP, and the production entry loads the original concept only on explicit navigation to the reference file. Phaser caps animated frames at 30 fps and sleeps after effects settle and while the tab is hidden. The layout scrolls vertically when the usable height is limited. The current room is session-local. Each browser reload starts a new run.

Verified in headless Chromium at 1440 × 900 and through touch at 375 × 812, 812 × 375 and 320 × 568. Both gate paths, every optional objective, repair, undo, reset and character switching were exercised. The bound Canvas emitted zero draws during a 2.5-second idle window. Device temperature and battery behavior on physical iPhone Safari remain unmeasured.

The original illustration places decorative elements and mirror angles for a composed scene. The production board uses added optical components and the renderer uses the angles required by the simulator. The scope is one playable room.
