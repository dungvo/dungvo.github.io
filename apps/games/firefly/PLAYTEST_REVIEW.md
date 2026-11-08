# Firefly tactical web — design review and polish pass

Date: 2026-11-08. Scope: static source/code review and implementation, **not** live device/browser playtesting.

## Review findings (before this pass)
- The enemy moved at most one tile and chose greedy Manhattan steps, so it could become stuck around trees; the declared movement statistic had no effect.
- The tactical map had little exploration payoff: no hidden pickups or tactical optional objectives.
- HUD was visually flat and did not clearly communicate selected mode, cover, or HP.
- The potion action could be used after the selected unit had already acted, breaking the one-action-per-turn rule.
- Enemy turn could be triggered with a modal open.
- No integrated adventure chapter, bespoke production sprites, scene exploration or cross-chapter save. These are **still open**.

## Changes in this pass
1. BFS enemy routefinding around walls and units, using enemy movement allowance.
2. Hidden forest relic on the southern path: moving onto the tile awards an item and heals the discoverer. Provides a replay/exploration incentive.
3. Cover terrain now reduces 2 damage, making positioning more meaningful.
4. Clearer action hints, HP meter, action colors, tap targets, focus styles and legend.
5. Magic-hit visual feedback, improved selected-button states, modal/turn guard, potion action guard.
6. No changes to the separate narrative or exploration prototypes.

## Risks and next QA
- Must play in actual mobile Safari and desktop Chrome; source inspection alone does not validate appearance, frame rate, or touch precision.
- Ensure all victory and defeat branches are winnable and saves are backward compatible.
- Review enemy target priorities and whether the relic is sufficiently discoverable without trivializing it.
- Consider a stronger first 60 seconds: exploration NPC and visual transition into battle, instead of starting with a route-choice modal.
- Replace remaining emoji in menus and create dedicated art/animation, environmental sound and polished hit effects.
- Consolidate three separate experiments into a single chapter before publishing Chapter 2.

## Quality verdict
This is an improved **tactical prototype**, not yet a polished, cohesive commercial-quality game. User is the final reviewer of the integrated milestone; no need to solicit detailed micro-decisions.
