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
- 338 chunks total

## Add a Think in English situation

Context-first practice lives in `content/contexts/`. Each situation contains a realistic email, chat, conversation, or article-style passage; overall and implied-intent questions; contextual chunk explanations; and a short writing response. The app saves the best comprehension score and draft locally. When a contextual phrase is linked to an existing stable chunk ID, completing the lesson also feeds that chunk into the existing spaced-review system.

The bundled situations cover workplace communication, daily life, and article-style technology/business reading. The published site discovers new context files automatically. For local and offline preview, also add the file path to `contextFallbackFiles` in `content/catalog.js`.

## Add a speaking topic

Guided ChatGPT Voice practice lives in `content/conversations/`. Each topic defines the learner role, ChatGPT role, opening line, discussion questions, recommended chunk IDs, and a copy-ready Live prompt. The published site automatically discovers new conversation files in this folder just as it discovers chunk-session files.

The initial Speaking Lab contains 20 guided topics across daily life, workplace communication, data engineering, interviews, and open discussion.

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

Topics form a guided path. The next topic unlocks after at least 70% of the previous topic has been introduced. Listening mode hides the written chunk until after comprehension is tested; Speak from Memory asks for active production without choices.

Speaking Lab results are self-reported because this static website cannot inspect a separate ChatGPT Voice session. After a conversation, learners can mark the target chunks they used from memory, and the app records those speaking uses locally.
