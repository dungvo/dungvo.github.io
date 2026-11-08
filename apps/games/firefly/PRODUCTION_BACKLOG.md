# Đom Đóm — Production Backlog (Web-first)

**Approved quality bar:** all six dimensions target **10/10**. These are aspirational acceptance goals, not claims of current quality. User is final milestone reviewer. Game director / visual designer / narrative designer / gameplay engineer / QA are production responsibilities, not actual hired personnel.

## Priority system
P0 = blocks visual foundation; P1 = essential for Chapter 1; P2 = polish/expansion. Each ticket needs implementation, QA and user-visible acceptance criteria.

| ID | Priority | Workstream | Deliverable | Acceptance criteria | Status |
|---|---|---|---|---|---|
| VF-01 | P0 | Art direction | Visual identity: luminous storybook 2D with 2.5D depth, moonlit teal, gold light, distinctive silhouettes | Cohesive mood, readable focal hierarchy, no borrowed IP | Draft |
| VF-02 | P0 | Scene art | Layered forest-village scene with depth, lanterns, moon, trees, ruins, ambient particles | Strong composition at mobile and desktop; no emoji as scene art | Prototype implemented |
| VF-03 | P0 | Interaction | Tap/click hotspots with scene-anchored tooltips, contextual actions and dialogue | Three meaningful interactions, discoverable without manual | Prototype implemented |
| VF-04 | P0 | Motion | Ambient lights, fireflies, subtle depth, reduced-motion support | Animation feels alive without hiding gameplay | Prototype implemented |
| VF-05 | P0 | UI | Title, quest strip, inventory, dialog and responsive touch controls | Legible at 375px; buttons >=44px; keyboard support | Prototype implemented |
| VF-06 | P0 | Original character | Model sheet: hero, Lâm, gatekeeper, shadow enemy; poses, expressions | Same proportions, palette, identifiable at game scale | Not started |
| VF-07 | P0 | Art pipeline | Sprite atlas, scene asset manifests, export sizes, naming and licensing | No runtime dependency on external image sites; reproducible asset build | Not started |
| VF-08 | P0 | Browser QA | Mobile Safari + desktop Chrome visual snapshots, performance and input | No blocked taps, clipped dialogue, or console errors | Not tested |
| VF-09 | P0 | Art review | Compare in-browser scene against approved art direction | User reviews interactive browser milestone, not just static concept | Pending |
| EX-01 | P1 | Exploration | Unified tile/collision map, NPC schedules, camera and pathfinding | 10 minutes of interesting exploration, no soft locks | Planned |
| EX-02 | P1 | World | Three distinct locations and 8–12 contextual interactions | Hidden rewards and at least 2 discovery paths | Planned |
| CO-01 | P1 | Combat | Tactical positioning, ranges, terrain, skills, enemy telegraphs | Multiple viable strategies, transparent rules | Planned |
| CO-02 | P1 | Combat visuals | Hit animations, readable VFX, sound and impact | Actions feel responsive, feedback matches damage | Planned |
| ST-01 | P1 | Narrative | Original Chapter 1 dialogue, 2 route arcs and NPC motivations | Branches materially change events and rewards | Planned |
| ST-02 | P1 | Character | Recruitment, bonds, unique abilities and consequences | Distinct team composition on replay | Planned |
| SY-01 | P1 | Persistence | Versioned save slots, chapter flags and migrations | Resume, replay and upgrades never corrupt progress | Planned |
| QA-01 | P1 | QA | Route graph, battle balance, accessibility and performance | No progression blockers, verified browser/device matrix | Planned |
| RP-01 | P1 | Replay | Secret areas, route-exclusive items, optional encounters | Second playthrough reveals new playable content | Planned |
| AU-01 | P1 | Audio | Original/cleared ambience, SFX, mute and volume | Audio supports atmosphere; defaults respect user choice | Planned |
| CH-02 | P2 | Expansion | Modular Chapter 2 after Chapter 1 sign-off | Previous decisions persist and affect story | Deferred |

## Quality gates (all 10/10 targets)
1. **Visual:** opening frame looks like an authored fantasy game, coherent sprites/environment/UI, smooth motion, attractive mobile.
2. **Exploration:** curiosity-driven discovery, useful contextual interactions, not merely dialogue buttons.
3. **Combat:** meaningful tactical tradeoffs, readable enemy intentions, diverse viable builds.
4. **Story:** emotionally credible characters, mystery, route consequences and a satisfying chapter arc.
5. **Feel/audio:** fluid controls, satisfying feedback, licensed/original sound, accessibility.
6. **Replay:** new secrets, encounters, character bonds and alternate outcomes.

**Release gate:** no dimension can be self-declared 10/10. Internal QA and final user review must assess an actual playable build. The overall game is not approved merely because tickets are implemented.

## Visual Foundation deliverable V1
Interactive web scene: `/apps/games/firefly/visual/`. Original SVG/CSS scene composition and in-scene interactions. **This is a visual/interaction study, not the finished chapter and not a 10/10 production art pass.** Existing playable chapter remains at `/apps/games/firefly/chapter1/`.

## Next iteration after V1
1. Commission/create original consistent character sheets and frame-by-frame animations.
2. Replace prototype vector scenery with layered high-detail production artwork while retaining hotspots.
3. Integrate this scene system into Chapter 1 exploration and tactical battle without separate demos.
4. QA iPhone Safari and desktop Chrome before the final review gate.
