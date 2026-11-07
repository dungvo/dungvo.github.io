# Selflo · Content coverage and Game Lab
Date: 2026-11-07. Scope: Studio feature; no automatic publication of external works.

## Verified current Release inventory
Manifest `perspective-library/release/vi/manifest.json` currently contains 22 Story descriptors and 9 Quote packs. The packs contain multiple quotes; the number of distinct approved quote entries needs a separate full-catalog count. The existing Context Flow uses a heuristic and is not an editorially approved schedule for all time slots.

## Context combinatorics
- 14 slots × 7 weekdays = 98 recurring weekly slot/day contexts.
- 14 slots × 365 dates = 5,110 annual date-slot contexts (5,124 in a leap year).
- Return visit, preferences, completion, locale, holiday and explicitly requested experience multiply contexts. Do **not** produce a unique story for each cell.
- Route to a reusable catalog with `content_id`, rights, teaser, themes, duration, intensity, format, time suitability, date/occasion applicability, and recency controls.

## Content gap analysis
The 9 current quote-pack themes are: adversity/resilience, attention, change/growth, emotion, meaning/values, relationships, rest/wellbeing, self-understanding and work/achievement. They are primarily reflective. Enrich the **experience taxonomy**, not necessarily the quote taxonomy: humor, everyday life, science curiosity, history, nature, discovery, puzzles, mysteries, social observation, children/family, uplifting verified true stories and play.

## Sourcing rights gate
- Public domain, explicit compatible open license or direct permission: candidate for full-text ingestion **after** checking the original source, author, translation and license scope.
- CC BY: attribution and license notice required; check modification and commercial use terms.
- CC BY-SA: share-alike obligations may apply; legal review for derivatives.
- CC BY-NC: commercial monetization incompatible without separate permission.
- CC BY-ND: no distributed adaptations.
- Internet blog/news/books without reuse permission: do **not** download/re-publish full text merely with a link or attribution. Use a short original synopsis, link to the original, or obtain permission.
- Classic public-domain work may have modern translations with independent rights. Verify edition/translation separately.
- Record `source_url`, `author`, `work_title`, `license`, `rights_evidence_url`, `review_status`, `language`, `translation_rights`, `ingested_at`.

## Proposed editorial rollout
1. Inventory full approved Release count, deduplicate and audit story teasers; mark unavailable games and incomplete source metadata.
2. Curate 30–50 legally reusable *candidates* spanning the above gaps. Keep them in intake/authoring, not Release. Verify rights individually.
3. Owner review a 7-day × 14-slot **experience matrix** (reusing content without repetition per user), including workday, weekend, holiday, first return and late-night behavior.
4. Only then promote approved candidates through existing source→Authoring→Release gates.
5. Track voluntary returns, diversity, not-relevant feedback, time-to-first-action, game completion and voluntary game replays.

## Playable Studio Game Lab
`studio/developer/game-lab/`
- Pattern Hunter: 15 generated number-sequence levels, five escalating tiers (arithmetic, increasing difference, geometric, square differences, alternating subsequences). Deterministic replay.
- Hidden Truth: 6 hand-authored deduction puzzles with explanation and optional hint.
- Choice Lab: 5 branching choices with differentiated outcomes; no binary moral score.
- Progress stored locally; no leaderboard or external collection.
- Current progression is linear, not yet dynamic difficulty. A later iteration can adjust based on wrong attempts and hints.

## QA before promoting beyond Studio
Manual checks: every level solvable, no duplicate options, mobile layout, feedback after wrong answers, reset behavior, screen reader labels, correct routing from Context Flow, and rights metadata for external content. Studio-only publication is not equivalent to owner editorial acceptance.
