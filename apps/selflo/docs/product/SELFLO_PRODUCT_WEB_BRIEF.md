# SELFLO — PRODUCT VISION & WEB IMPLEMENTATION BRIEF
Version: 0.1 | Date: 2026-11-07 | Status: Planning handoff; not approval to implement or publish

## Executive decision
Selflo is a context-aware discovery experience combining Quotes, Stories, optional mini-games, reflection, voluntary real-world Actions and personal Journey. The initial focus is content quality and daily-use validation through the existing website. Do **not** redesign the iOS app now; do not alter the production home page without approval.

**Product loop:** Open → relevant and surprising discovery → react/choose → optional action → reflect and revisit → more relevant future experience.

**Promise:** Khám phá một điều đáng nhớ. Mang điều ý nghĩa vào cuộc sống.

## Why
A swipe-only quote feed does not necessarily motivate people to open Selflo. Unrelated gamification can undermine the product identity. Make the experience surprising but contextual and voluntary—not optimized for endless engagement.

## Directionally agreed principles
- Content First → Web First → real-world daily validation → App Later.
- One focused contextual opening experience; menu/library always accessible.
- Use time, calendar, explicit need, preferences, recent sessions, continuation and content history. Time alone is NOT an emotion detector.
- Same-day return should not automatically repeat greeting/Quote; returning after a short interruption should continue unfinished content.
- Explicit Like/Dislike/Skip/Save/Not relevant now; adapt by item, topic, style, format, intensity and time slot, with exploration so recommendations do not collapse.
- Games are optional **first-class** entertainment experiences; do not force a Quote→Game bridge.
- Only genuinely actionable content offers Action; opt-in, schedule, mark done, record an optional personal note/photo, reflect later. Avoid guilt, streak pressure or XP.
- Respect locked Stories; never silently rewrite or publish unlicensed externally sourced content.
- The 14 time ranges and holiday examples are design hypotheses, not scientifically established cutoffs. Allow customization for shift work, timezone and user preferences.

## Content & interaction taxonomy
| Type | Core experience | Intended use |
|---|---|---|
| Quote | Small meaningful insight, optionally visual | Inspiration / pause |
| Story | Linear or selectively interactive narrative | Emotion / curiosity / perspective |
| Pattern Hunter | Find rules and sequences | Short playful break |
| Perspective Shift | Interpret an illusion or multiple viewpoints | Reframe / surprise |
| Mystery Room | Find clues, solve an atmospheric situation | Immersive exploration |
| Choice Lab | Explore decisions and consequences | Agency / perspectives |
| Hidden Truth | Detective-style clues and deduction | Short mystery |
| Check-in | User optionally declares current need | Routing without mind-reading |
| Actions / Journey | Voluntary action and progress/reflection | Real-world follow through |

Game Lab candidates for first prototypes: Pattern Hunter, Hidden Truth, Choice Lab. Consider Daily Mystery; do not commit to a live content schedule until tested. Defer XP, energy, keys, level maps and collectibles.

## Time slots — tentative
| Local time | Candidate experience |
|---|---|
| 04:00–05:59 | Quiet reading / gentle intention |
| 06:00–07:29 | Positive Quote or true kindness Story |
| 07:30–08:59 | Short intention, perspective, or check-in |
| 09:00–10:29 | Short curiosity, Hidden Truth |
| 10:30–11:29 | Transition / optional check-in |
| 11:30–12:59 | Lunch break Story or short game |
| 13:00–14:29 | Optional reset, relax vs focus |
| 14:30–15:59 | Perspective Shift / brief puzzle |
| 16:00–17:29 | Transition out of work, light reflection |
| 17:30–19:29 | Relationships, kindness, everyday Story |
| 19:30–20:59 | Deeper Story, Choice Lab, Mystery Room |
| 21:00–22:29 | Reflect or gentle Story |
| 22:30–23:59 | Quiet reading, no stimulation pressure |
| 00:00–03:59 | Quiet Mode; respect sleep, no loop pressure |

Calendar: Vietnamese fixed holidays, lunar holidays computed per year, birthdays/anniversaries if shared, weekdays/weekends. 20/11 Vietnamese Teachers' Day should offer context-relevant messages for teachers, students, parents and others. **Do not presume gender, relationship or occupation.** User-acknowledged needs outweigh inferred calendar/timing defaults.

## Adaptive session flow
1. If an unfinished Story/game/session exists and return is brief, offer Resume.
2. Respect explicit new need (“Tôi đang lo lắng”, “Tôi muốn thư giãn”, “Tôi muốn giải trí”, “Tôi muốn đọc”).
3. Consider same-day openings, previous content and cooldowns. Do not repeat greetings or show the same Quote unnecessarily.
4. Rank candidate experiences by time + calendar + user preference + diversity + novelty + intensity.
5. User feedback can immediately reduce repetition without reclassifying permanent tastes from one dislike.
6. Offer “Something different” and manual library access, always.
7. Store only necessary history; personal/emotional information is sensitive, user-controlled and erasable.

## Proposed metadata
```json
{
  "id": "stable-content-id",
  "type": "quote",
  "themes": ["kindness"],
  "experience_intent": ["inspiration"],
  "tone": "gentle",
  "emotional_intensity": "low",
  "reading_duration_seconds": 30,
  "suitable_time_slots": ["morning"],
  "special_occasions": [],
  "interaction_type": "read",
  "actionable": true,
  "suggested_actions": [{"title":"Gửi lời cảm ơn", "suggested_trigger":"after_dinner"}],
  "source": {"attribution":"", "license_status":"review_required"},
  "quality_status": "draft"
}
```
Start with minimal tags. Content Registry should track source, license, approval and locked status. Approved stories remain verbatim unless explicitly reopened.

## Action & Journey model
A voluntary action should be small and specific: what to do, when/trigger, what counts as done. The journey can show Planned / Done / Not now / No longer relevant, optional reminder, personal evidence/notes and a retrospective. No social proof requirement. Do not send notifications unless user opts in; do not assume that skipping reflects failure.

## Website-first implementation sequence
**P0 — Audit** existing Selflo content registry, lifecycle, website and Develop tabs. Produce an inventory and compatibility assessment. No modifications to production.
**P1 — Content metadata pilot** curate 30–50 varied approved/legally reusable items, mapping context/tone/formats/actions. Review metadata accuracy and source rights.
**P2 — Context Flow Lab** isolated Develop experience, mock local time/holiday/profile/session and decision reason, plus ability to read actual content. Existing Home remains stable.
**P3 — Feedback & session adaptation** local prototype with Likes/Dislikes, skip, revisit, resume, same-day context variation. Test not repeating content.
**P4 — Game Lab** Pattern Hunter, Hidden Truth, Choice Lab independent playable prototypes with manual entry and optional Flow routing.
**P5 — Actions & Journey** opt-in action selection, completion, notes and reminders; privacy/data deletion guardrails.
**P6 — 30-day web pilot** founder use and optionally additional consenting testers; evaluate natural returns, relevance, novelty, content completion, actions voluntarily performed, negative feedback and friction.
**P7 — iOS design decision** only after website hypotheses demonstrate value; no premature App rewrite.

Each phase needs review/acceptance before proceeding; no automatic merge, publication or redesign. Deploy only after explicit sign-off.

## Acceptance questions
- Does the user willingly reopen Selflo without prompting?
- Is the first experience relevant without pretending to infer their feelings?
- Does opening twice within the same day feel fresh and maintain continuity?
- Are at least two substantially different experiences available in each tested context?
- Do dislikes influence future suggestions without overfitting?
- Are games entertaining on their own yet still fit Selflo's identity?
- Are Actions voluntary, traceable and appropriately reminded?
- Is source attribution/license status verified?
- Can editors and testers understand why content was suggested?
- Does the website/Story catalog remain stable?

## Scientific grounding and research backlog
Implementation intentions can help bridge intention and behavior; do not present this as a guarantee. Daily rhythms and chronotype matter but fixed time cutoffs are unvalidated. Positive psychology/mindfulness findings do not automatically generalize to Selflo's specific UX. Require verified source references and empirical testing before making scientific claims or designing affect-based personalization.

## Agent handoff instructions
1. Read this document and the adjacent Decision Log.
2. Inspect live repository state, especially existing docs, content lifecycles, site and Develop/Studio implementation.
3. Report gaps and proposed phases with file-level impact, demo URLs, privacy/rights risks and acceptance tests.
4. Implement only a separately approved phase on a feature branch; never change published Stories or production Home without explicit instruction.
5. Record each decision/approval and demo outcome in a dated log.
