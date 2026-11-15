# Light Quest Tactical Light — implementation workstream

Status — **a six-room playable chapter**. See [room architecture and QA](AWAKENING_ARCHITECTURE.md).

## Non-negotiable constraints
- Separate the optics simulator from Phaser rendering.
- Ray segments must be derived from simulation, never hand-drawn to fake a solution.
- Single-sided mirrors have a front normal; back hits block.
- Mirror rotation uses 22.5° increments (eight orientations per 180°); 45° presets are valid beginner levels.
- Rays travel continuously between geometric intersections along eight discrete headings.
- A splitter divides power; no free energy. Color behavior is a game rule, not a claim about real spectral physics.
- Turn order: validate action → spend energy → update optics → resolve interactions → enemy action → evaluate fail/win.
- No random enemy attacks that make a level unsolvable; telegraph enemy intentions.
- Hidden pattern rewards are validated from segment geometry, not screenshots.

## Current files
- core/tactical-optics.js — eight-heading geometric ray casting with single- and double-sided mirrors, filters, splitters, transmission loss, amplifiers and receivers.
- core/garden-room.js — playable turn engine, patrol and telegraphed mirror damage, inventory, reveal skill and two gate routes.
- assets/awakening/ and playable-v2/ — modular illustrated 2D stage and responsive HUD.
- tests/ — 34 regression tests, including the legacy tactical contract. Run `npm test` in the adventure folder.

## Milestones
1. M0 — 64 vector reflection combinations, nearest hit, back face, tangent, 2-source overlap, branch energy, amplification and bounded cycles tested.
2. M1 — five illustrated environments, a shared texture atlas, both character sprites, devices, in-scene hints and responsive controls are in place.
3. M2 — six linked rooms cover discovery, multi-source optics, diagonal reflection, pressure plates, alternative routes through the prism hall, and a timed encounter with the wolf, and a two-way relic retrieval puzzle across light bridges.
4. M3 — the chapter has browser-local unlocks, a room selector, inventory, repair, secondary objectives, shape rewards and reveal. Maze exploration remains future work.
5. M4 — desktop and touch emulation passed. A 20-minute physical iPhone Safari profile is pending.
6. M5: deploy verified vertical slice to GitHub Pages, preserve existing legacy game.

## Acceptance
No production release until physics test suite passes, each puzzle is solvable and restartable, and visuals match the agreed mockups.
