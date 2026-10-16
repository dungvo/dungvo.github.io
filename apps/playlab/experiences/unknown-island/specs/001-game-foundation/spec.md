# Feature Specification: Game foundation documentation

**Status**: Accepted for documentation only  
**Related decisions**: DEC-001–DEC-005  
**Implementation authorized**: No

## Outcome

Human và AI có một source of truth dễ đọc để tiếp tục thảo luận Unknown Island mà không đánh mất kịch bản, không trộn proposal với decision và không nhảy thẳng vào code.

## In scope

- Vision, core loop, narrative/world outline, mechanics/skill combinations/progression.
- Learning objectives grades 1–5, replayability and initial static offline-first constraints.
- Decision log, backlog, open questions, handoff.
- Shared agent policy for Codex/OpenAI and Claude/Anthropic; Spec Kit-style templates.

## Out of scope

Game code, assets, package setup, engine installation, Firebase/login, cloud sync, analytics, CI/CD, deployment, commit and push.

## User stories and acceptance scenarios

### US1 — Resume design discussion

Given a new human or AI collaborator, when they follow the README reading order, then they can state the product promise, current phase, accepted decisions, proposals and most important open question without scanning unrelated apps.

### US2 — Preserve scenario

Given the prior conversation, when design docs are reviewed, then the beach, forest, cave, river, tower, alternate solutions/endings and final map reveal are all represented and labeled as a framework rather than implemented canon.

### US3 — Prevent premature implementation

Given an agent is asked for a new idea, when it reads project instructions, then it records/discusses the idea and does not create code, dependencies or deployment unless explicitly authorized after spec/plan gates.

### US4 — Support future feature work

Given an accepted feature idea, when a spec is created, then the template asks for learning evidence, child safety/privacy, accessibility, retry behavior and test/playtest criteria in addition to functional requirements.

## Success criteria

- Every requested knowledge area has a discoverable canonical document.
- Every product-significant statement is clearly accepted, proposed or open.
- Codex and Claude instructions route to the same source of truth.
- The folder contains no runnable game or deployment artifact.

## Open questions

Tracked centrally in `docs/project/open-questions.md`.

