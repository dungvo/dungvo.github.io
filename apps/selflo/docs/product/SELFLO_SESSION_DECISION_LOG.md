# SELFLO — SESSION DISCUSSION & DECISION LOG
Session closeout: 2026-11-07 | Purpose: preserve the rationale and distinguish decisions from proposals

## The path of discussion
1. **Problem of quote-only feeds**: Swipeable Quotes can look good but do not by themselves give people a reason to return every day. A beautiful website may support discovery, but meaningful use is the real criterion.
2. **Interactive experience and games**: Considered short puzzles, choice-based stories and gamification. Rejected an indiscriminate “add XP/game to every Quote” approach. Later explicitly **restored games as an official optional pillar** for moments users want entertainment.
3. **Contextual opening screen**: Time-of-day (14 initial windows), weekdays/weekends, Vietnamese holidays, self-declared needs and content history can suggest a fresh first experience. The user should not know exactly what awaits, but randomness must be relevant, not arbitrary.
4. **Holiday context**: 20/11 is a key example. Differing roles (teacher, parent, student, general reader) can yield different offerings. Roles and relationship matter more than gender assumptions.
5. **Return visits**: If opened once in the morning, reopening a little later must not present the same routine morning message. However, unfinished reading should be resumable. On a stressful commute the user may want a completely different interaction; offer them a choice instead of guessing an emotion.
6. **Feedback & learning**: Like/Dislike on content, theme, style, format, time context. A dislike for one Quote should not eliminate the entire Quote format. “Not relevant right now” differs from “dislike.”
7. **Actions after inspiration**: Quotes/Stories may offer relevant small real-life actions; user chooses what to track, when to be reminded, and whether/how to log completion or an optional personal note. It is not a to-do app; completion is not a condition for reading.
8. **Journey**: Review personal experiences, actions and reflections, without guilt or compulsive streaks.
9. **Content First, Web First**: The user explicitly decided to focus on content and web rather than iOS. Their test: do they personally want to enter Selflo every day? Build isolated labs instead of changing production.
10. **Game plan reaffirmed**: Pattern Hunter, Perspective Shift, Mystery Room, Choice Lab and Hidden Truth retained. First experiments may use Pattern Hunter, Hidden Truth and Choice Lab.

## Directionally agreed decisions
- Selflo's identity: discovery, entertainment, emotion, voluntary real-world actions, and retrospective Journey.
- Context Flow should be adaptive to time/calendar/explicit needs/recent history, not rigidly scripted.
- The menu/library must remain usable independently of Flow.
- Use feedback; distinguish immediate session relevance from stable preference.
- Preserve approved, locked stories; external content must have rights clearance.
- Games are optional meaningful experiences, not a mandatory stage or standalone replacement for Selflo.
- No immediate iOS rewrite or production-home redesign. Initial work belongs in Content and Web Develop / Labs.
- Web-first learning and staged approval before scaling to iOS.

## Hypotheses, NOT locked specifications
- Exactly 14 time slots; particular minute boundaries and sample greeting text.
- Specific game prototype sequence, scoring, exact routing algorithm, UI cards or names.
- 30–50 pilot content items and a 30-day evaluation period.
- Daily Mystery schedule and context-aware surprise cadence.
- User preference weights, probabilities and dashboard rating thresholds.
- Specific technical stack, user identifier scheme, storage model and notifications approach.
All require repository audit, user testing, scientific/ethical review where applicable, and explicit phase approval.

## Deferred or rejected for now
- Energy, XP, level maps, keys, virtual items, streak obligations and pressure to log in.
- Push notification by default or reminders not explicitly requested.
- Mandatory mood check-ins, mood diagnosis inferred from time, assumed gender roles.
- Rewriting locked approved stories; copy-pasting copyrighted internet stories without permission.
- Big-bang website or app redesign before validating the concept.

## Key product principle
> Each opening should give a reason to discover something *worthwhile* while respecting the person's current choice, privacy and time; Selflo should remember prior context without pretending to know their feelings.

## Handoff checkpoint
- Documentation branch only; design, production site and content remain untouched.
- Next session: audit repository and design a practical staged plan (scope, prototype, test cases, acceptance criteria, merge gate) *before any implementation*.
- Store project decision log and future approvals in repository to make AI continuation dependable.
