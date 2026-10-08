// Offline/local-preview fallback. GitHub Pages discovers session files automatically.
window.CHUNK_CONTENT_CONFIG = {
  github: {
    owner: "dungvo",
    repository: "dungvo.github.io",
    directory: "apps/english/content/sessions",
    conversationDirectory: "apps/english/content/conversations",
    storyDirectory: "apps/english/content/stories",
    contextDirectory: "apps/english/content/contexts"
  },
  contextFallbackFiles: ["content/contexts/think-in-english.js"],
  storyFallbackFiles: ["content/stories/birthday-dinner.js", "content/stories/selflo-launch.js", "content/stories/first-day.js"],
  conversationFallbackFiles: ["content/conversations/speaking-topics.js"],
  fallbackFiles: [
    "content/sessions/2026-09-22-to-24.js",
    "content/sessions/2026-10-07-onboarding.js",
    "content/sessions/daily-01-routines.js",
    "content/sessions/daily-02-small-talk.js",
    "content/sessions/daily-03-requests.js",
    "content/sessions/daily-04-clarification.js",
    "content/sessions/daily-05-opinions.js",
    "content/sessions/daily-06-planning.js",
    "content/sessions/daily-07-work.js",
    "content/sessions/daily-08-meetings.js",
    "content/sessions/daily-09-problems.js",
    "content/sessions/daily-10-everyday.js"
  ]
};
