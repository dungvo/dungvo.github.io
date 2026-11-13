# Chunk Lab

A static English-practice website for GitHub Pages. It has no backend, package installation, or build step.

## Add a new practice session

1. Copy `content/session-template.js.example`.
2. Save the copy in `content/sessions/` with a sortable name such as `2026-09-25.js`.
3. Fill in the session metadata and chunks. Keep every session ID and chunk ID unique.
4. Commit and push the new file.

That is all. On `dungvo.github.io`, the website uses GitHub's public repository API to discover every `.js` file in `content/sessions/`, then loads them automatically. No application file or HTML script tag needs to be changed.

## Content format

Each session file calls:

```js
window.ChunkContent.register({
  schemaVersion: 1,
  session: {
    id: "2026-09-25",
    title: "Session title",
    dates: ["2026-09-25"],
    topics: ["updates", "investigation"]
  },
  chunks: [/* chunk objects */]
});
```

See `content/session-template.js.example` for every required chunk field.

The initial learned material uses the full schema so it can support every game mode. The ten `daily-*` files use the compact schema (`schemaVersion: 2`) for high-volume meaning, situation, speaking, IPA, and Vietnamese pronunciation practice. In the Vietnamese guide, CAPITAL letters mark the stressed syllable. These guides are approximations for Vietnamese speakers; the IPA and Listen button remain the pronunciation authority.

Current library:

- 22 chunks from the September 22–24 sessions
- 300 common daily chunks across ten topic files
- 16 onboarding and professional-email chunks
- 15 intent-first chunks from the October 13 session
- 4 source-verified publication chunks
- 13 privacy, data-protection, and leave/HR chunks from questions 3–15
- 26 onboarding, present-perfect, grammar, and natural-wish chunks from the October 28 session
- 28 fluency chunks for thinking time, answer structure, rephrasing, transitions, storytelling, polite disagreement, and self-repair
- 424 chunks total

## Add a Think → Express scenario

Production-first practice lives in `content/expressions/`. Each scenario starts with a natural Vietnamese thought and guides the learner through intent selection, idea reshaping, optional progressive chunk hints, an original English response, natural reference answers, and a varied retrieval prompt. The published site discovers expression files automatically. For local and offline preview, also add the file path to `expressionFallbackFiles` in `content/catalog.js`.

This mode complements **Think in English**: the existing mode develops contextual reading and implied-meaning recognition, while **Think → Express** develops active retrieval and sentence construction. Responses and variation completion are stored locally in the existing progress record.

## Quick Recall

Quick Recall draws from the complete chunk library for short, spare-minute practice. It prioritizes chunks with fewer appearances, avoids the 18 most recent chunks when alternatives are available, and asks the learner to identify the appropriate situation before revealing meaning, structure, a natural example, and a usage note.

The learner can keep a chunk in rotation or hide it after mastering it. The dashboard records unique chunks seen, total appearances, hidden chunks, and available chunks. Hidden chunks can be restored individually or together, and Quick Recall history can be reset without affecting the main practice statistics.

## Product history

The **History** view turns the repository's English-site Git history into a learner-friendly release timeline. It records the date, meaningful content or feature added, affected area, exact commit links, related pull requests, and an in-app link to open the result. It is available from the main navigation, the Learn hub, and the footer.

When a meaningful English-site feature or content collection is merged, add or update its release card in `index.html`. Preserve the exact commit or pull-request link so the visible history remains auditable rather than relying on generic commit subjects such as “Update.”

## Daily Focus and Daily Challenge

The primary navigation is organized around **Today**, **Play**, **Learn**, and **Journey**. Today recommends a focused learning plan; Play collects the available game modes; Learn preserves the complete lesson toolkit; and Journey combines learning progress with saved game results.

Daily Challenge generates 15 questions from the current chunk library and gives the learner up to 10 minutes. A session mixes meaning recognition, situation-to-chunk selection, fill-the-gap questions, and an animated visual clue. Every answer reveals the relevant meaning, structure, example, and usage note. Completed scores and durations are stored in the browser and shown in Journey. Layouts adapt from multi-column desktop views to a touch-friendly mobile flow with persistent bottom navigation.

## Add a Think in English situation

Context-first practice lives in `content/contexts/`. Each situation contains a realistic email, chat, conversation, or article-style passage; overall and implied-intent questions; contextual chunk explanations; and a short writing response. The app saves the best comprehension score and draft locally. When a contextual phrase is linked to an existing stable chunk ID, completing the lesson also feeds that chunk into the existing spaced-review system.

The bundled situations cover workplace communication, daily life, and article-style technology/business reading. The published site discovers new context files automatically. For local and offline preview, also add the file path to `contextFallbackFiles` in `content/catalog.js`.

## Add a speaking topic

Guided ChatGPT Voice practice lives in `content/conversations/`. Each topic defines the learner role, ChatGPT role, opening line, discussion questions, recommended chunk IDs, and a copy-ready Live prompt. The published site automatically discovers new conversation files in this folder just as it discovers chunk-session files.

The Speaking Lab contains 28 guided topics across daily life, workplace communication, data engineering, interviews, open discussion, and structured fluency drills.

## Add a reading story

Story practice lives in `content/stories/`. Each story contains reading paragraphs, reusable chunks with short meanings, and multiple-choice questions with answer explanations. Questions can test three skills: understanding the story, understanding chunk meanings, and applying a chunk in a new situation. Results include a separate score for each skill. The Stories view can read the full story at natural or slow speed, or read one paragraph at a time using the browser's English voice.

The published site discovers new story files automatically from `content/stories/`. For local and offline preview, also add the story path to `storyFallbackFiles` in `content/catalog.js`.

## Pronunciation playback

The site chooses the best available English system voice, prefers natural US voices when present, and speaks complete chunks at conversational speed. Every pronunciation card also has a separate Slow button for careful repetition. Voice quality depends on the voices installed in the browser or operating system.

## Local preview

For a reliable local preview, serve the repository with any static file server and open `/apps/english/`. Browsers may restrict JavaScript loaded directly from `file://` URLs.

`content/catalog.js` is the offline/local fallback. Add a session path there only when you need a newly created file to appear in an offline preview. The published GitHub Pages site does not require this catalog update.

## Progress

Scores, daily activity, weak chunks, contextual-practice results, writing drafts, and streaks are stored in the current browser with `localStorage`. Adding content does not erase existing progress because each chunk has a stable ID. Think in English extends the existing `chunkLabProgressV2` record instead of replacing it.

The learning system introduces no more than five new chunks in a session and fills the remaining reps with reinforcement. Chunks move through New, Learning, Reviewing, and Mastered stages using spaced review intervals of 1, 3, 7, 14, and 30 days. Mastery requires both repeated correct answers and at least one successful speaking use.

Topics form a guided path. The next topic unlocks after at least 70% of the previous topic has been introduced. Listening mode hides the written chunk until after comprehension is tested; Speak from Memory asks for active production without choices; Retype Exactly checks precise written retrieval while ignoring capitalization and punctuation.

Speaking Lab results are self-reported because this static website cannot inspect a separate ChatGPT Voice session. After a conversation, learners can mark the target chunks they used from memory, and the app records those speaking uses locally.


## Listening Practice (2026-11-05)

Open `#listening` from Today, Play, or Learn. This focused Vietnamese-language flow contains 100 original sentences. The first 30 live in `content/listening/practice.js`; 70 high-frequency additions live in `content/listening/common-chunks.js`. Ten topics cover clarification, office directions, daily life, data work, meetings, interviews, small talk, requests and responses, phone and chat, and plans and opinions. Each question has one Vietnamese meaning and two curated distractors.

Rounds of up to ten questions hide the English transcript until explicitly requested or after an answer. Normal and slow playback use the installed English browser voice; answer choices unlock when audio starts or the learner explicitly reveals the transcript. Revealing before answering marks the attempt as assisted. Incorrect, assisted, and skipped sentences are prioritized for review; clean correct answers remove a sentence from the current review queue. Replays and slow playback do not count as transcript assistance.

After answering, learners see the transcript, meaning, a chunk note, and a transfer prompt. They can hide the written English to speak from memory and save an original sentence locally. Speech and writing are self-practice, not automatically graded. The optional sentence list is collapsed to avoid spoiling the listening task.

Progress and drafts use a separate `chunkLabListeningV1` localStorage record and do not change existing scores. Its data is scoped to this browser and is not included in the existing main-app progress reset. No microphone permission, backend, or external audio service is required. Add future sentences to the same topic schema with stable unique IDs.

The common-chunk expansion preserves every original topic and sentence ID, so existing attempts, review status, and saved drafts continue to work. Each original topic now has ten sentences; four new topics add ten sentences each. Rounds of up to ten questions still prioritize weak, assisted, and unseen material rather than presenting the files in source order.

Selected chunks also receive a translation-trap note from `content/listening/translation-notes.js`. These notes appear only after the learner answers or explicitly reveals the transcript. Each note identifies the misleading word-by-word reading, gives one compact meaning rule, and contrasts the chunk with a similar sentence. Notes are selective so ordinary sentences keep a short feedback flow. The initial set covers 25 high-risk chunks, including `in` versus `for`, `by` versus `until`, frequency versus duration, softening language, phrasal verbs, and common idioms.

### Three-level listening path (2026-11-07)

Listening Practice now progresses through three distinct skills while keeping the original 100-chunk level and its `chunkLabListeningV1` progress unchanged:

1. **Common Chunks** tests the intent of short, reusable phrases.
2. **Longer Sentences** contains 60 sentences across multiple topics. Each answer reveals the two or three chunks that combine to create the full meaning, plus a selective note where word-by-word translation is misleading.
3. **Real Conversations** contains 26 five-to-six-turn dialogues. The learner hears the complete exchange before answering three questions about the main idea, a concrete detail, and an implied action or next step. The transcript remains hidden until requested or until the questions are complete, and every result ends with reusable chunks from the conversation.

Levels 2 and 3 store attempts separately in `chunkLabListeningAdvancedV1`. Opening a transcript before answering is treated as assisted practice. Playback uses browser speech synthesis, alternates available English voices by speaker in conversations, and never requires microphone access.

## Chunk Adventure: integrated Daily Practice (2026-11-07)

The former random 15-question Daily Challenge is now a personalized four-stage journey:

1. **Warm-up** retrieves four weak, due, or unseen chunks from the main library.
2. **Listen & Connect** presents two longer sentences containing related chunks. Text and choices stay locked until playback starts; transcript help is available but marked as assisted.
3. **Use It** asks the learner to apply the same focus chunks in a situation or sentence gap.
4. **Conversation Boss** uses one complete dialogue and its three comprehension questions to test main idea, detail, and next action.

Explicit bridge maps in `js/app.js` connect library chunk IDs to the longer sentences and conversations in `content/listening/advanced-listening.js`. Selection prioritizes spaced-review items, previous mistakes, unseen content, and then connected material, so the same chunk appears in progressively richer contexts rather than unrelated random questions.

Clean answers earn XP and build a combo; opening a transcript gives reduced XP and keeps the material eligible for review. Daily answers update the existing `chunkLabProgressV2` record, while sentence and conversation results also update `chunkLabListeningAdvancedV1`. Existing progress and previous Daily game history remain compatible. New journey history entries additionally store XP and best combo.

## Fluency content expansion (2026-11-07)

The fluency toolkit adds 28 reusable chunks that help the learner keep speaking when an answer is not ready, structure a response, rephrase an idea, connect a story, disagree politely, or recover after losing the thread. These chunks are deliberately short enough to retrieve as complete units instead of translating word by word.

Listening Levels 2 and 3 now include 24 extra longer sentences and eight extra six-turn conversations. Several items train reduced or connected speech such as **did you**, **could you**, **going to**, and **have to**. The answer feedback still reveals the chunks and meaning only after listening.

Speaking Lab adds eight guided fluency drills: a 60-second answer, a short story, a work update, rephrasing, polite discussion, explaining a technical idea simply, natural small talk, and interview thinking time. Their target chunks are also linked into Chunk Adventure, so the learner can meet the same expression in the library, hear it inside a sentence or conversation, and then use it in speech.

## Listening pronunciation coach (2026-11-09)

After a Listening transcript is opened in Levels 1, 2 or 3, the optional pronunciation coach shows curated US IPA, prominent stress/rhythm groups, an approximate Vietnamese reading guide, and a connected-speech tip when an exact matching sentence has been reviewed. It is deliberately absent before the answer/reveal so the listening comprehension task is not spoiled. No user data or localStorage keys change.

The reference lives in `js/listening-pronunciation.js`, with presentation in `css/listening-pronunciation.css`. Add new phrases to the `entries` map using exact English text and manually reviewed IPA, Vietnamese approximation, stress groups and one linked-speech tip. **Never synthesize IPA or Vietnamese spelling using letter substitutions**, which are unreliable in English; sentences without a reviewed guide simply do not show the optional panel. The browser's English TTS remains the listening model. After playback, learners should practice in this order: slow listening, speaking in rhythm groups, normal-speed shadowing, then speaking from memory.

### Listening rounds and workplace scenarios (2026-11-13)

Levels 1 and 2 serve up to ten distinct questions per round. A topic or review queue with fewer than ten eligible items produces a shorter round. Level 3 keeps three comprehension questions per dialogue. Three new scenarios cover a delayed pipeline, a claims data request, and a technical interview about unreliable timestamps.

## Connected Listening roadmap

- Shipped: Listening links matching expressions to the Chunk Library after feedback. The library opens a specific related Level 2 sentence or Level 3 conversation. The same curated IDs used by Chunk Adventure are preferred alongside exact phrase matches. An explicitly linked sentence opens as a single targeted exercise. Ordinary rounds still offer up to ten questions.
- Next release: Create 12 complete lessons across meeting clarification, data incidents, insurance requests, and technical interviews. For each lesson, link 3–5 existing chunk IDs to a sentence, a dialogue, and a speaking prompt. Review the answer explanations and pronunciation for the key phrases.
- Then: Organize Learn by situation with a next-step action. Link each lesson to its speaking drill and optional story or reading activity. Preserve stable IDs and existing progress. Check the full journey on Safari iOS and Chrome before publishing.
- External audio: Link directly to British Council recordings. For VOA, verify individual item provenance and credit the original. Add a source URL, CEFR estimate, audio duration, rights status, and an original comprehension or speaking task before publishing each sourced lesson.
- Check coverage: Count listening exercises linked to at least one library chunk, lessons with a speaking prompt, and audio with verified attribution. Test navigation from Listening to Library and back before every content release.

## Career Path

The home screen leads through six sequential stages, each with three lessons and a speaking challenge. Every lesson includes spaced review when due, a model phrase, a listening question, and an aloud response. Learners rate their own speaking practice. The path records completed lessons, challenges, in-progress steps and phrase review dates in the current browser, using a separate progress record from existing standalone practice. Reviews recur at 1, 3, 7, 14 and 30 days. A review needing help returns the next day. Audio uses the browser’s English speech synthesis.
