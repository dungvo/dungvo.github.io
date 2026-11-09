# Light Quest · World Mode and Secret Garden

Open the repository root with `python3 -m http.server 8080`, then visit
`/apps/games/light-quest/world/` or `/apps/games/light-quest/world/garden/`.
No build step is needed. The original 30-level game remains at the parent path.

## V7 audit

PR #58 was merged at `1def598`. World Mode had 18 maps and Secret Garden had
three. Both pages implemented separate traces and rebuilt every piece on each
move. The World hint only tested repeated taps on one object, its movement
preview did not share the complete shadow rules, and its duplicate trace pass
did not contribute to the simulation. Several World maps reused earlier routes.
The Garden hint always highlighted the same cell. The Garden saved completion
and one reward, but did not restore an active board. Its single reward key also
meant another choice overwrote the preceding reward.

## Campaign and rendering

- `levels.js` defines maps and starting prism colors. The 18 World maps and the
  three existing Garden puzzles retain their original routes and level IDs.
  The fourth Garden map chains a bridge, two mirrors and two colored receivers.
- `optics.js` implements immutable turns, ray tracing and shortest-path hints.
  A ray starts eastward at `S`. `/\` are mirrors, `F` is a prism, `K` is a
  manually armed switch, `=` is a bridge, `M` is a movable shadow and `#` is a
  wall. `T` accepts any beam and `RBY` accept red, blue and yellow respectively.
  An armed switch powers bridges only when reached by the beam. A level finishes
  when the beam charges every receiver on its route.
- `expedition.js` shares UI and progression across both routes. Only shadows
  move between tile elements. Other pieces retain their nodes and animate
  between states. Puzzle and exploration backgrounds are generated for this
  game and shipped as responsive WebP variants. The portal artwork is requested
  when the player enters the doors scene. CSS respects reduced-motion settings.
- World reads and writes the existing `light-quest.world.v1` progress and records.
  Garden imports the old completion and choice keys. A V7 finisher can play
  the fourth stage directly, and their original reward appears in the journal.
  V8 tracks each reward independently and persists active attempts as replayable
  actions so undo also works after reload.

Run `node --test apps/games/light-quest/world/optics.test.mjs`
from the repository root. The test checks all routes, hints, the finale's
multi-crystal requirement and immutable undo snapshots. When adding levels,
also play the map on a phone-sized viewport and check touch targets, contrast,
guidance and environmental feedback.

## Beyond the Gates

Secret Garden now has nine stages. The first four preserve their stage IDs and
routes. Finishing the fourth unlocks a hub with two independent branches. The
Star Fragment unlocks the observatory (5–6) and the Seed unlocks Rootbrook (7–8).
Clearing both paths unlocks the combined dawn puzzle (9) and the story ending.

- `P` is a rotatable splitter. The incoming ray continues straight and a second
  ray reflects using the same orientation rules as a mirror.
- A blue ray hitting `A` activates a seed relay, opening every `G` root gate in
  that simulation. The engine traces closed gates first and retraces with open
  gates once it finds a powered relay. Beam state is deduplicated to stop cycles.
  A bridge still needs an armed switch along that ray's route.
- Garden V9 reads V8 progress and attempts on first launch and keeps the
  inventory key. It saves attempts by stage so either branch can be left and
  resumed without losing moves or undo. The hub and finale are available through
  the normal adventure after their prerequisites are met.
- New areas load responsive WebP backgrounds on entry. The default garden image
  remains the starting artwork.
