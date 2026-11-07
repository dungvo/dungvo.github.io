# Context Flow · Studio Developer feature
Status: Implemented Studio-only, not public, 2026-11-07.

## Product design
- Default entry automatically suggests a **real Release** Story or Quote. No mandatory emotional survey.
- Story uses canonical title, subtitle/opening quote, reading time and existing reader URL. Full text is opened only by explicit click.
- Quote uses the approved Release quote text and source attribution.
- Recommendations vary with local time (14 time slots), day-of-week, prior visit, recently seen content and explicit preference. Same-day returns receive different framing; viewed items are deprioritized.
- “Tôi muốn đổi trải nghiệm” is secondary, not a blocking onboarding step. Explicit choices: calm, story, curiosity, work, relationships, play.
- Feedback is stored only in localStorage; no account, server collection, notifications or personal emotion inference.
- Game is intentionally a clear unavailable state until a real game passes content/rights/review gates. Do not silently invent game content.
- Developer sidebar simulates weekday, time slot and visit status without altering the user's system clock.

## Where
Studio Developer -> Context Flow
`/apps/selflo/studio/developer/context-flow/`

## Technical scope
- Independent HTML/CSS/JS; no changes to public Home or Release.
- Reads `perspective-library/release/vi/manifest.json` and published story/quote JSON.
- Uses existing `perspectives/read/?story=<id>` and Studio Quote route.
- No build step. The feature is intentionally isolated from production homepage.

## Acceptance checklist
- [ ] Desktop and mobile manual visual review on deployed Studio route.
- [ ] Network fetch resolves manifest, Stories and Quote packs.
- [ ] Opening displays content immediately, no forced survey.
- [ ] Story preview does not contain full Story text.
- [ ] Story/Quote link opens existing reader.
- [ ] Different simulated time/day influences suggestion.
- [ ] Second opening and “Khám phá điều khác” do not repeat current item.
- [ ] Like/Not relevant feedback influences subsequent ranking.
- [ ] Game selection never claims an unfinished game is playable.
- [ ] Public Home, existing Story and Quote views unchanged.

## Editorial limitations
Ranking is a transparent heuristic, **not** a scientifically validated mood model. Content metadata is currently sparse; some slot/day combinations may share candidates. No authoring/source/Release files were changed. Personalization is browser-local, not synchronized across devices. Full 98-slot editorial coverage and real game library require subsequent owner review.

## Future review
Test natural returns across days, ask whether first content feels worth opening, audit repeated topics and improve editorial tagging before adding more rules or rewriting the iOS app.
