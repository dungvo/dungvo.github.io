# Light Quest Tactical Light — implementation workstream

Status: **M0 implementation started**. This is not yet the production UI or a complete playable vertical slice.

## Non-negotiable constraints
- Separate the optics simulator from Phaser rendering.
- Ray segments must be derived from simulation, never hand-drawn to fake a solution.
- Single-sided mirrors have a front normal; back hits block.
- Mirror rotation uses 22.5° increments (eight orientations per 180°); 45° presets are valid beginner levels.
- The grid has eight discrete ray directions; this is a gameplay approximation of 2D ray optics, not unrestricted continuous-angle raycasting.
- A splitter divides power; no free energy. Color behavior is a game rule, not a claim about real spectral physics.
- Turn order: validate action → spend energy → update optics → resolve interactions → enemy action → evaluate fail/win.
- No random enemy attacks that make a level unsolvable; telegraph enemy intentions.
- Hidden pattern rewards are validated from segment geometry, not screenshots.

## Current files
- core/tactical-optics.js — eight-direction deterministic beam simulator with single/double-sided mirrors, filters, splitters, rocks and receivers.
- core/tactical-turns.js — first deterministic action/energy/patrol state machine.
- tests/tactical-optics.test.mjs — initial regression tests; run with Node.js `node --test tests/tactical-optics.test.mjs` from adventure folder.

## Next milestones
1. M0: complete mirror normal conventions, collisions, ray splitting, energy accounting, loop termination, color mixing rules, and property-based test coverage.
2. M1: sprite atlas / layered 2D environment / mirror front and back visually explicit; responsive mobile HUD; asset budgets.
3. M2: three linked rooms: discovery + hidden rock, multi-source light puzzle, turn-based mirror-breaking enemy.
4. M3: inventory, repair fragments, alternate objectives, shape-based hidden rewards, fog-of-war maze and skills.
5. M4: 20-minute real iPhone Safari profiling, performance and UX checks.
6. M5: deploy verified vertical slice to GitHub Pages, preserve existing legacy game.

## Acceptance
No production release until physics test suite passes, each puzzle is solvable and restartable, and visuals match the agreed mockups.
