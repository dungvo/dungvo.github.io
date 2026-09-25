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
- 322 chunks total

## Add a speaking topic

Guided ChatGPT Voice practice lives in `content/conversations/`. Each topic defines the learner role, ChatGPT role, opening line, discussion questions, recommended chunk IDs, and a copy-ready Live prompt. The published site automatically discovers new conversation files in this folder just as it discovers chunk-session files.

The initial Speaking Lab contains 20 guided topics across daily life, workplace communication, data engineering, interviews, and open discussion.

## Pronunciation playback

The site chooses the best available English system voice, prefers natural US voices when present, and speaks complete chunks at conversational speed. Every pronunciation card also has a separate Slow button for careful repetition. Voice quality depends on the voices installed in the browser or operating system.

## Local preview

For a reliable local preview, serve the repository with any static file server and open `/apps/english/`. Browsers may restrict JavaScript loaded directly from `file://` URLs.

`content/catalog.js` is the offline/local fallback. Add a session path there only when you need a newly created file to appear in an offline preview. The published GitHub Pages site does not require this catalog update.

## Progress

Scores, daily activity, weak chunks, and streaks are stored in the current browser with `localStorage`. Adding content does not erase existing progress because each chunk has a stable ID.

The learning system introduces no more than five new chunks in a session and fills the remaining reps with reinforcement. Chunks move through New, Learning, Reviewing, and Mastered stages using spaced review intervals of 1, 3, 7, 14, and 30 days. Mastery requires both repeated correct answers and at least one successful speaking use.

Topics form a guided path. The next topic unlocks after at least 70% of the previous topic has been introduced. Listening mode hides the written chunk until after comprehension is tested; Speak from Memory asks for active production without choices.

Speaking Lab results are self-reported because this static website cannot inspect a separate ChatGPT Voice session. After a conversation, learners can mark the target chunks they used from memory, and the app records those speaking uses locally.
