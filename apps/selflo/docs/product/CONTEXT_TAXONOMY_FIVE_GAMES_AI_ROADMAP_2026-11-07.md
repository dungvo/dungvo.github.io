# Selflo · Context taxonomy, five games and AI integration
Date: 2026-11-07 | Status: Studio experiment and roadmap

## Context dimensions
The 14 time windows are **simulation inputs**, not 14 required editorial genres. Group into 5 broad rhythms: early, active/work, short break, evening, night. Weekday types: Monday/start, Tue–Fri/regular, Sat–Sun/weekend. Yearly dates are ordinary unless in a curated special-occasion calendar. Local user timezone takes precedence; don't assume emotions or work schedule from time.

## Editorial taxonomy expansion
Existing thematic axes: adversity, attention, growth, emotions, meaning, relationships, rest, self-understanding, work. Add *experience genres* independently: humor/satire, mysteries, nature, science, history, family/children, real-world kindness, exploration/adventure, cognitive puzzle, everyday slice-of-life, social observation, survival, philosophical dilemma, playful experiments. These tags are proposed, **not** claims of content coverage.
Prioritize curated reusable content over writing all pieces. Every candidate requires URL, author, title, copyright/license evidence, translation rights, attribution, status. No automatic redistribution of internet stories merely because downloadable. Source material in intake/authoring; owner approval before Release. This change does **not** download new works.

## Five playable Studio games
1. Pattern Hunter: 15 levels; easy 1–5, medium 6–10, hard 11–15.
2. Hidden Truth: 6 logical deduction cases; easy 1–2, medium 3–4, hard 5–6.
3. Choice Lab: 5 situations; easy 1–2, medium 3–4, hard 5 (non-binary outcomes).
4. Perspective Shift: 9 cases; easy 1–3, medium 4–6, hard 7–9.
5. Mystery Room: 9 short puzzle rooms; easy 1–3, medium 4–6, hard 7–9.
The tiers select a starting section. Difficulty is editorially graded, **not adaptive** yet; this is not a spatial escape-room engine.

## AI integration design proposal (NOT implemented)
AI-assisted selection from **approved content IDs**, not free-form publishing. Pipeline:
1. Consent and data minimization: context summary, user-selected interests, recent viewed IDs; no raw private reflection unless user explicitly opts in.
2. Server-side API, never expose model keys in GitHub Pages/browser.
3. Retrieve eligible, rights-cleared content; deterministic filters for language, sensitive themes, recency, locked content, duration.
4. Model reranks eligible IDs and optionally explains why in concise Vietnamese; strictly validated structured response with allowed IDs only.
5. Cache, timeout, rate-limit and budget; deterministic local rules fallback on failures.
6. Record only consented relevance feedback; allow deletion/export; separate analytics from intimate reflection.
7. Evaluate against local baseline: voluntary return, click-to-read, dismiss/skip, diversity, perceived relevance, latency, cost, privacy concerns.
8. Optional user-controlled reflective conversation in later phase, with guardrails against medical diagnosis and dependency.

## Acceptance
- Default Flow presents a real Release item without a mandatory questionnaire.
- Simulated weekdays group as intended; special dates require an editorial calendar, not a 365-day matrix.
- All five game tabs open and offer three selectable difficulty tiers.
- Every question has valid options, hint, and post-answer explanation; mobile keyboard/touch accessible.
- No release story altered, no production Home changes.
- Source sourcing and AI are planned separately; neither is misrepresented as deployed.
