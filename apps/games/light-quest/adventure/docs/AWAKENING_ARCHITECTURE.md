# Light Quest — Khu Vườn Thức Tỉnh

## Run the chapter and its tests

Serve the repository as static files, for example with `python3 -m http.server 8000` from the repository root, then open `/apps/games/light-quest/adventure/playable-v2/`. Run `npm test` in the adventure directory. The original adventure and tactical demo retain their own entry points.

## Simulation and rendering

| Layer | File | Contract |
| --- | --- | --- |
| Chapter content | `core/awakening-levels.js` | Six room layouts, objectives, visual themes and contextual hints. |
| Room turns | `core/garden-room.js` | `applyGardenAction` validates the action, resolves patrol and optical damage, and returns a fresh snapshot and events. |
| Optics | `core/tactical-optics.js` | Cast normalized rays, resolve the closest valid positive intersection, reflect at the mirror segment, and return geometry, power, contacts and receiver hits. |
| Stage | `playable-v2/play.js` | Phaser Canvas reuses terrain and sprite atlas frames. Map core coordinates into the board once. Render every beam directly from its returned endpoints. |
| Controls | `playable-v2/index.html`, `playable-v2/play.css` | Native controls, keyboard focus and live status, anchored hot spots, portrait and landscape sizing, and reduced-motion support. |
| Art | `assets/awakening/` | Separate environment painting, character cutouts, and a WebP texture atlas with named Phaser frames. |
| Design reference | `mockups/awakening-reference.webp` | Sourced from the first-level fantasy mockup “Nhiệm Vụ Ánh Sáng Đầu Tiên”. Reference only. |

The beam travels in eight headings. Rotating a mirror by 22.5° shifts the reflected direction by 45°. A single-sided mirror reflects only when the incident direction has a negative dot product with its outward face normal. A ray parallel to a mirror travels past the idealized plane. Rocks and walls have round colliders. Filters, splitters, lenses and receivers interact at their pivots. Colors represent gameplay bands. The board is a spatial arrangement of fixtures and the ray remains continuous between them.

Power decays exponentially with distance. Passive components divide, attenuate or absorb it. A powered amplifier contributes a fixed external supply per crossing, subject to a gain and output cap. A minimum power and ray interaction budget bound the work. Cycle tracking is local to each ray branch, so independent sources can share a path and still report distinct hits.

A turn spends energy, resolves ray damage against the current wolf position and sealed rock, advances the wolf and applies a telegraphed mirror break when applicable. The final state is traced again after the impact changes the board. Gate and pattern awards are latched and undoable. Phaser renders this final snapshot. Reward logic only matches adjacent geometric checkpoints traced by the gold source. Optical power and the player's action energy are separate quantities.

## Campaign progression

Each gate unlocks the next room. A local browser save records completed rooms and the last selected room. Reopening the final room retains the chapter-completion marker. The player can return to any unlocked room. Starting a room again or refreshing the page resets its board, inventory and turn count. Local progression continues in memory when storage is unavailable.

In rooms with two receivers the gate opens only after both receive the correct color and strength in the same optical snapshot. Each has a visible charge indicator. Inventory and patrol objectives apply only to rooms that feature those mechanics.

| Room | Main puzzle |
| --- | --- |
| Ánh Sáng Đầu Tiên | Two ways to guide gold light to the crystal, with optional discoveries and patrol interaction. |
| Điện Lăng Kính | Move a counterweight onto a plate or reach the relay, then stand on the other plate to light both crystals. |
| Hành Lang Hai Màu | Route separate gold and red beams through their filters, then amplify the red beam. |
| Mật Đạo Chéo | Trace a three-mirror path that uses both diagonal headings. |
| Cổng Của Sói Bóng Đêm | Time a one-use bell to pass while the wolf pauses, or use red light and repair its damage. |
| Vực Ánh Sáng | Cross the illuminated upper bridge, collect the heavy relic, reroute the beam to one of two return bridges, and carry the relic back to the start-side dais. |

The traversal rules live in `core/room-traversal.js`. An adjacent move costs one energy and can push a counterweight one cell. The player and counterweights hold pressure plates only while occupying them. A relay latches its shutter open. Closed shutters and counterweights block rays in the same optics pass as mirrors. Ringing the bell consumes one of its three turns as part of the move, leaving two more actions before the patrol resumes.

Vực Ánh Sáng derives bridge accessibility from the live ray segments in `core/room-traversal.js`. The upper bridge cannot carry the relic. An eastern relay changes the fixed mirror setting and lights one of the two return bridges. The lower route includes a collectible seal in exchange for a longer walk. Entering the exit cell with the relic ends the room. The `?man=6` practice entry opens this room directly and keeps campaign progression separate. A cleared pre-expansion chapter unlocks the sixth room when reloaded.

## First-room solution fixtures

- Turn both main mirrors to 45° to send the gold beam right, down, then right. This opens the gate and earns the pattern seal.
- Turn the north mirror to 0° to feed the right-hand splitter. Its downward branch passes through a powered amplifier and opens the same gate.
- Turn on the red emitter to break the sealed rock. Pick up the repair shard, then apply it to the broken east mirror. Keeping the red source on during this sequence also defeats the wolf.
- Cast Soi Sáng at the lantern and collect the revealed flower. Undo rolls back all of these state changes. Restart returns the room to its original state.

## Performance and compatibility

The renderer uses a fixed 856 × 744 Canvas. Art is WebP, and the production entry loads the original concept only on explicit navigation to the reference file. Phaser caps animated frames at 30 fps and sleeps after effects settle and while the tab is hidden. The layout scrolls vertically when the usable height is limited. The active room resets on reload while the room selection and unlocks persist.

Verified in headless Chromium at 1440 × 900 and through touch at 375 × 812, 812 × 375 and 320 × 568. Both gate paths, every optional objective, repair, undo, reset and character switching were exercised. The bound Canvas emitted zero draws during a 2.5-second idle window. Device temperature and battery behavior on physical iPhone Safari remain unmeasured.

The original illustration places decorative elements and mirror angles for a composed scene. The production board uses added optical components and the renderer uses the angles required by the simulator. The chapter contains six playable rooms with illustrated environments, room-specific palettes and a shared sprite atlas. Selecting a fixture shows its clue over the board. The hint control positions the current room hint over its first mirror.
