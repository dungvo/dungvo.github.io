(() => {
  "use strict";

  const KEY = "chunkLabProgressV2";
  const LEGACY_KEY = "chunkLabProgressV1";
  const DAILY_TARGET = 10;
  const SESSION_SIZE = 10;
  const registry = { sessions: [], conversations: [], stories: [], contexts: [], expressions: [], errors: [] };
  let chunks = [];
  let speakingTopics = [];
  let stories = [];
  let contexts = [];
  let expressions = [];
  let evidenceItems = [];
  let evidenceCategory = "All";
  let expressionCategory = "All";
  let activeExpressionId = null;
  let preferredVoice = null;
  let libraryTopic = "All";
  let progress = loadProgress();
  let session = null;
  let quickCurrentId = null;
  let dailySession = null;
  let dailyTimerId = null;
  let contentSource = "bundled catalog";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const localDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const todayKey = () => localDateKey(new Date());

  window.ChunkContent = {
    register(payload) {
      try {
        payload = normalizeSession(payload);
        validateSession(payload);
        if (!registry.sessions.some((item) => item.session.id === payload.session.id)) registry.sessions.push(payload);
      } catch (error) {
        registry.errors.push(error.message);
      }
    },
    registerConversations(payload) {
      if (payload?.schemaVersion !== 1 || !Array.isArray(payload.topics)) { registry.errors.push("A conversation file has an unsupported format."); return; }
      payload.topics.forEach((topic) => {
        if (topic.id && topic.title && topic.prompt && !registry.conversations.some((item) => item.id === topic.id)) registry.conversations.push(topic);
      });
    },
    registerStories(payload) {
      if (payload?.schemaVersion !== 1 || !Array.isArray(payload.stories)) { registry.errors.push("A story file has an unsupported format."); return; }
      payload.stories.forEach((story) => {
        if (story.id && story.title && Array.isArray(story.paragraphs) && Array.isArray(story.questions) && !registry.stories.some((item) => item.id === story.id)) registry.stories.push(story);
      });
    },
    registerContexts(payload) {
      if (payload?.schemaVersion !== 1 || !Array.isArray(payload.contexts)) { registry.errors.push("A context file has an unsupported format."); return; }
      payload.contexts.forEach((context) => {
        const valid = context.id && context.title && Array.isArray(context.passage) && Array.isArray(context.chunks) && Array.isArray(context.questions);
        if (valid && !registry.contexts.some((item) => item.id === context.id)) registry.contexts.push(context);
      });
    },
    registerExpressions(payload) {
      if (payload?.schemaVersion !== 1 || !Array.isArray(payload.scenarios)) { registry.errors.push("An expression file has an unsupported format."); return; }
      payload.scenarios.forEach((scenario) => {
        const valid = scenario.id && scenario.title && scenario.thought && Array.isArray(scenario.intentOptions) && Number.isInteger(scenario.intentAnswer) && scenario.reshape && Array.isArray(scenario.hintGroups) && Array.isArray(scenario.answers) && scenario.variation;
        if (valid && !registry.expressions.some((item) => item.id === scenario.id)) registry.expressions.push(scenario);
      });
    }
  };

  function normalizeSession(payload) {
    if (payload?.schemaVersion !== 2 || !Array.isArray(payload.items)) return payload;
    return {
      schemaVersion: 1,
      session: payload.session,
      chunks: payload.items.map(([id, chunk, ipa, viPronunciation, meaning, situation]) => ({
        id, chunk, ipa, viPronunciation, meaning, situation, example: chunk,
        note: meaning, practiceModes: ["meaning", "situation", "speak"]
      }))
    };
  }

  function validateSession(payload) {
    if (!payload || payload.schemaVersion !== 1) throw new Error("A content file has an unsupported schema version.");
    if (!payload.session?.id || !Array.isArray(payload.chunks)) throw new Error("A content file is missing session metadata or chunks.");
    const required = ["id", "chunk", "ipa", "meaning", "situation", "example", "note"];
    payload.chunks.forEach((chunk) => {
      required.forEach((field) => { if (!chunk[field] && field !== "alternatives") throw new Error(`${payload.session.id}: ${chunk.id || "chunk"} is missing ${field}.`); });
      if ((chunk.practiceModes || []).includes("build") && (!chunk.gap || !chunk.answer || !Array.isArray(chunk.alternatives))) throw new Error(`${payload.session.id}: ${chunk.id} has incomplete build practice.`);
    });
  }

  function defaultProgress() { return { total: 0, correct: 0, items: {}, history: {}, conversations: {}, contexts: {}, expressions: {}, dailyGames: [], quickRecall: { total: 0, seen: {}, hidden: [], recent: [] } }; }
  function loadProgress() {
    try {
      const current = JSON.parse(localStorage.getItem(KEY));
      if (current) return { ...defaultProgress(), ...current, items: current.items || {}, history: current.history || {}, conversations: current.conversations || {}, contexts: current.contexts || {}, expressions: current.expressions || {}, dailyGames: current.dailyGames || [], quickRecall: { ...defaultProgress().quickRecall, ...(current.quickRecall || {}) } };
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
      if (legacy) return { ...defaultProgress(), total: legacy.total || 0, correct: legacy.correct || 0, items: legacy.items || {}, history: legacy.today ? { [legacy.today]: { total: legacy.todayCount || 0, correct: 0 } } : {} };
    } catch (_) { /* Start clean if browser storage is malformed. */ }
    return defaultProgress();
  }
  function saveProgress() { localStorage.setItem(KEY, JSON.stringify(progress)); }
  function itemStat(id) { return { seen: 0, correct: 0, wrong: 0, box: 0, due: null, spoken: 0, ...progress.items[id] }; }
  function record(id, correct, skill = "recognition") {
    const stat = itemStat(id);
    stat.seen += 1; correct ? stat.correct += 1 : stat.wrong += 1; progress.items[id] = stat;
    if (skill === "speaking" && correct) stat.spoken += 1;
    const intervals = [0, 1, 3, 7, 14, 30]; stat.box = correct ? Math.min(5, (stat.box || 0) + 1) : 0;
    stat.due = dateOffset(correct ? intervals[stat.box] : 0); stat.lastSeen = todayKey();
    progress.total += 1; if (correct) progress.correct += 1;
    const day = progress.history[todayKey()] || { total: 0, correct: 0 };
    day.total += 1; if (correct) day.correct += 1; progress.history[todayKey()] = day;
    saveProgress();
  }
  function weakness(chunk) {
    const stat = itemStat(chunk.id);
    return stat.seen === 0 ? 2 : (stat.wrong * 3 - stat.correct * 0.25) + 1 / (stat.seen + 1);
  }
  function learningStage(chunk) {
    const stat = itemStat(chunk.id); const accuracy = stat.seen ? stat.correct / stat.seen : 0;
    if (!stat.seen) return "New";
    if (stat.box >= 4 && accuracy >= 0.8 && stat.spoken > 0) return "Mastered";
    if (stat.box >= 2) return "Reviewing";
    return "Learning";
  }
  function isDue(chunk) { const stat = itemStat(chunk.id); return stat.seen > 0 && learningStage(chunk) !== "Mastered" && (!stat.due || stat.due <= todayKey()); }
  function dateOffset(days) { const date = new Date(); date.setDate(date.getDate() + days); return localDateKey(date); }
  function recentStats(days = 7) {
    let total = 0, correct = 0;
    for (let offset = 0; offset > -days; offset -= 1) { const day = progress.history[dateOffset(offset)]; if (day) { total += day.total; correct += day.correct; } }
    return { total, correct };
  }
  function currentStreak() {
    let streak = 0;
    for (let offset = 0; offset > -365; offset -= 1) { const day = progress.history[dateOffset(offset)]; if (day?.total) streak += 1; else if (offset === 0) continue; else break; }
    return streak;
  }

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script"); script.src = source; script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${source}`)); document.head.appendChild(script);
    });
  }
  async function githubFiles(owner, repository, directory) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/contents/${directory}`, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status} for ${directory}`);
    const entries = await response.json();
    return entries.filter((item) => item.type === "file" && item.name.endsWith(".js")).sort((a, b) => a.name.localeCompare(b.name)).map((item) => `${location.origin}/${item.path}`);
  }
  async function discoverContent() {
    const config = window.CHUNK_CONTENT_CONFIG || {};
    let files = [], conversationFiles = [], storyFiles = [], contextFiles = [], expressionFiles = [];
    if (location.hostname === "dungvo.github.io" && config.github) {
      const { owner, repository, directory } = config.github;
      try {
        files = await githubFiles(owner, repository, directory);
        conversationFiles = await githubFiles(owner, repository, config.github.conversationDirectory);
        storyFiles = await githubFiles(owner, repository, config.github.storyDirectory);
        contextFiles = await githubFiles(owner, repository, config.github.contextDirectory);
        expressionFiles = await githubFiles(owner, repository, config.github.expressionDirectory || "apps/english/content/expressions");
        contentSource = "auto-discovered from GitHub";
      } catch (error) { registry.errors.push(`Discovery failed: ${error.message}`); }
    }
    if (!files.length) files = config.fallbackFiles || [];
    if (!conversationFiles.length) conversationFiles = config.conversationFallbackFiles || [];
    if (!storyFiles.length) storyFiles = config.storyFallbackFiles || [];
    if (!contextFiles.length) contextFiles = config.contextFallbackFiles || [];
    if (!expressionFiles.length) expressionFiles = config.expressionFallbackFiles || [];
    for (const file of [...files, ...conversationFiles, ...storyFiles, ...contextFiles, ...expressionFiles]) {
      try { await loadScript(file); } catch (error) { registry.errors.push(error.message); }
    }
    if (!registry.sessions.length && files !== config.fallbackFiles) {
      for (const file of config.fallbackFiles || []) { try { await loadScript(file); } catch (error) { registry.errors.push(error.message); } }
    }
    if (!registry.conversations.length && conversationFiles !== config.conversationFallbackFiles) {
      for (const file of config.conversationFallbackFiles || []) { try { await loadScript(file); } catch (error) { registry.errors.push(error.message); } }
    }
    const seen = new Set();
    chunks = registry.sessions.flatMap((entry) => entry.chunks.map((chunk) => ({ ...chunk, sessionId: entry.session.id, sessionTitle: entry.session.title, topics: entry.session.topics || [] }))).filter((chunk) => {
      if (seen.has(chunk.id)) { registry.errors.push(`Duplicate chunk id ignored: ${chunk.id}`); return false; }
      seen.add(chunk.id); return true;
    });
    speakingTopics = registry.conversations;
    stories = registry.stories;
    contexts = registry.contexts;
    expressions = registry.expressions;
    evidenceItems = Array.isArray(window.RealUsageEvidence) ? window.RealUsageEvidence : [];
    if (!chunks.length) throw new Error("No valid learning content could be loaded.");
  }

  function show(view) {
    $$(".view").forEach((item) => item.classList.remove("active"));
    $(`#${view}View`).classList.add("active"); window.scrollTo(0, 0);
    const learnViews = new Set(["learn", "express", "lab", "think", "stories", "speaking", "library", "evidence"]);
    const activeNav = learnViews.has(view) ? "learn" : ["quick", "dailyGame"].includes(view) ? "play" : view;
    $$(".site-header nav button").forEach((button) => button.classList.toggle("active", button.dataset.nav === activeNav));
  }
  function updateDashboard() {
    const today = progress.history[todayKey()] || { total: 0, correct: 0 };
    const percent = Math.min(100, Math.round(today.total / DAILY_TARGET * 100));
    $("#todayCount").textContent = today.total; $("#todayProgressBar").style.width = `${percent}%`;
    $("#todayDate").textContent = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
    $("#todayMessage").textContent = today.total >= DAILY_TARGET ? "Daily goal complete. Nice work." : today.total ? "Keep going—you’re building automatic recall." : "A few focused reps will build automatic recall.";
    const streak = currentStreak(); $("#headerStreak").textContent = `${streak} day${streak === 1 ? "" : "s"} streak`;
    const week = recentStats(); $("#weekReps").textContent = `${week.total} reps`; $("#weekAccuracy").textContent = week.total ? `${Math.round(week.correct / week.total * 100)}%` : "—";
    const weak = [...chunks].filter((chunk) => itemStat(chunk.id).wrong > 0).sort((a, b) => weakness(b) - weakness(a));
    $("#reviewTitle").textContent = weak.length ? `${weak.length} chunk${weak.length === 1 ? "" : "s"} to strengthen` : "Start practicing";
    $("#reviewCopy").textContent = weak.length ? `${weak[0].chunk}${weak[1] ? ` vs. ${weak[1].chunk}` : ""}` : "Your difficult chunks will appear here more often.";
    $("#bestTopic").textContent = weak[0]?.topics?.[0] || (progress.total ? "Building recall" : "New learner");
    const todayGames = progress.dailyGames.filter((game) => game.date === todayKey()); const best = todayGames.sort((a, b) => b.percent - a.percent)[0]; $("#dailyBestScore").textContent = best ? `${best.score}/${best.total}` : "—";
    renderLearningPath();
  }
  function renderLearningPath() {
    const ordered = [...registry.sessions].sort((a, b) => { const aDaily = a.session.id.startsWith("daily-") ? 0 : 1; const bDaily = b.session.id.startsWith("daily-") ? 0 : 1; return aDaily - bDaily || a.session.id.localeCompare(b.session.id); });
    let previousIntroduced = 1;
    $("#pathGrid").innerHTML = ordered.map((entry, index) => {
      const topicChunks = chunks.filter((chunk) => chunk.sessionId === entry.session.id); const stages = { New: 0, Learning: 0, Reviewing: 0, Mastered: 0 };
      topicChunks.forEach((chunk) => stages[learningStage(chunk)] += 1); const introduced = topicChunks.length - stages.New; const progressPercent = topicChunks.length ? Math.round(introduced / topicChunks.length * 100) : 0;
      const unlocked = entry.session.alwaysAvailable || index === 0 || previousIntroduced >= 0.7; previousIntroduced = topicChunks.length ? introduced / topicChunks.length : 0;
      return `<article class="path-card ${unlocked ? "" : "locked"}"><div><span class="path-number">${String(index + 1).padStart(2, "0")}</span><span class="stage-badge">${stages.Mastered === topicChunks.length ? "Mastered" : introduced ? "In progress" : unlocked ? "Ready" : "Locked"}</span></div><h3>${escapeHtml(entry.session.title)}</h3><p>${stages.New} new · ${stages.Learning} learning · ${stages.Reviewing} reviewing · ${stages.Mastered} mastered</p><div class="path-progress"><span style="width:${progressPercent}%"></span></div><button data-path-topic="${escapeHtml(entry.session.id)}" ${unlocked ? "" : "disabled"}>${unlocked ? introduced ? "Continue topic →" : "Start topic →" : "Complete 70% of the previous topic"}</button></article>`;
    }).join("");
    $$('[data-path-topic]').forEach((button) => button.addEventListener("click", () => start("mixed", button.dataset.pathTopic)));
  }
  function updateProgressView() {
    const streak = currentStreak(); $("#allTimeReps").textContent = progress.total; $("#allTimeAccuracy").textContent = progress.total ? `${Math.round(progress.correct / progress.total * 100)}%` : "—"; $("#progressStreak").textContent = `${streak} day${streak === 1 ? "" : "s"}`;
    $("#masteredCount").textContent = chunks.filter((chunk) => learningStage(chunk) === "Mastered").length; $("#dueCount").textContent = chunks.filter(isDue).length;
    const weak = [...chunks].sort((a, b) => weakness(b) - weakness(a)).slice(0, 8);
    $("#weakList").innerHTML = weak.map((chunk) => { const stat = itemStat(chunk.id); return `<div class="weak-row"><div><strong>${escapeHtml(chunk.chunk)}</strong><span>${escapeHtml(chunk.meaning)}</span></div><span class="weak-score">${stat.wrong ? `${stat.wrong} miss${stat.wrong === 1 ? "" : "es"}` : "Not practiced"}</span></div>`; }).join("");
    $("#dailyGameHistory").innerHTML = progress.dailyGames.length ? progress.dailyGames.slice(0, 8).map((game) => `<div class="game-history-row"><span>${escapeHtml(game.date)}</span><strong>${game.score}/${game.total} · ${game.percent}%</strong><small>${Math.ceil(game.seconds / 60)} min</small></div>`).join("") : "<p>No completed games yet.</p>";
  }
  function renderLibrary(query = "", topic = libraryTopic) {
    libraryTopic = topic;
    const term = query.trim().toLowerCase();
    const categories = [...new Set(chunks.map((chunk) => chunk.sessionTitle))].sort();
    const filtered = chunks.filter((chunk) => (topic === "All" || chunk.sessionTitle === topic) && [chunk.chunk, chunk.meaning, chunk.situation, chunk.example, ...(chunk.topics || [])].join(" ").toLowerCase().includes(term));
    $("#libraryTotal").textContent = chunks.length; $("#libraryTopics").textContent = categories.length; $("#librarySessions").textContent = registry.sessions.length;
    $("#categoryGrid").innerHTML = ["All", ...categories].map((category) => { const count = category === "All" ? chunks.length : chunks.filter((chunk) => chunk.sessionTitle === category).length; return `<button class="category-card ${category === topic ? "active" : ""}" data-library-topic="${escapeHtml(category)}"><strong>${escapeHtml(category)}</strong><span>${count} chunks</span></button>`; }).join("");
    $$('[data-library-topic]').forEach((button) => button.addEventListener("click", () => renderLibrary($("#chunkSearch").value, button.dataset.libraryTopic)));
    $("#libraryCount").textContent = `${filtered.length} chunk${filtered.length === 1 ? "" : "s"}`; $("#sessionCount").textContent = `${registry.sessions.length} content session${registry.sessions.length === 1 ? "" : "s"}`;
    $("#chunkList").innerHTML = filtered.map((chunk) => `<article class="chunk-item"><h3>${escapeHtml(chunk.chunk)}</h3><span class="ipa">${escapeHtml(chunk.ipa)}</span><span class="vi-pronunciation">${escapeHtml(chunk.viPronunciation || "Listen and repeat")}</span><p>${escapeHtml(chunk.meaning)}</p><p class="situation-copy"><b>Use it:</b> ${escapeHtml(chunk.situation)}</p><button class="listen-link" data-speak="${escapeHtml(chunk.chunk)}">▶ Listen</button><span class="source-tag">${escapeHtml(chunk.sessionTitle)}</span></article>`).join("") || `<p class="context">No chunks match “${escapeHtml(query)}”.</p>`;
    bindPronunciation($("#chunkList"));
  }

  function renderStories(selectedId = stories[0]?.id) {
    $("#storyCount").textContent = stories.length;
    $("#storyList").innerHTML = stories.map((story) => `<button class="story-card ${story.id === selectedId ? "active" : ""}" data-story-id="${escapeHtml(story.id)}"><span>${escapeHtml(story.level)} · ${story.minutes} min</span><strong>${escapeHtml(story.title)}</strong><small>${escapeHtml(story.summary)}</small></button>`).join("") || '<p class="context">No stories are available yet.</p>';
    $$('[data-story-id]').forEach((button) => button.addEventListener("click", () => renderStories(button.dataset.storyId)));
    const story = stories.find((item) => item.id === selectedId); if (!story) return;
    const completeText = story.paragraphs.join(" ");
    $("#storyReader").innerHTML = `<div class="story-kicker"><span>${escapeHtml(story.category)} · ${escapeHtml(story.level)}</span><span>${story.paragraphs.length} paragraphs · ${story.questions.length} questions</span></div><h2>${escapeHtml(story.title)}</h2><p class="story-deck">${escapeHtml(story.summary)}</p><div class="story-audio"><button class="primary" data-story-speak="${escapeHtml(completeText)}" data-rate="0.92">▶ Listen to full story</button><button class="secondary" data-story-speak="${escapeHtml(completeText)}" data-rate="0.76">Slow reading</button><button class="text-button" id="stopStoryAudio">■ Stop</button></div><div class="story-copy">${story.paragraphs.map((paragraph, index) => `<section><button class="paragraph-audio" data-story-speak="${escapeHtml(paragraph)}" data-rate="0.92" aria-label="Listen to paragraph ${index + 1}">▶</button><div><span class="paragraph-number">${String(index + 1).padStart(2, "0")}</span><p>${highlightStoryChunks(paragraph, story.chunks)}</p></div></section>`).join("")}</div><aside class="story-chunks"><p class="eyebrow">CHUNKS IN THIS STORY</p><div>${story.chunks.map((item) => `<span title="${escapeHtml(item.meaning)}">${escapeHtml(item.text)}</span>`).join("")}</div><small>Highlighted phrases are reusable chunks. Hover over a chunk here to see its meaning.</small></aside><div class="story-quiz"><p class="eyebrow">STORY · MEANING · APPLICATION</p><h3>Do you understand and know how to use it?</h3><p>Questions test the story, chunk meanings, and how to apply each chunk in a new situation.</p><div id="storyQuestions">${story.questions.map((question, qIndex) => `<fieldset data-story-question="${qIndex}"><div class="question-type">${escapeHtml(question.type || "Story")}</div><legend><span>${qIndex + 1}</span>${escapeHtml(question.prompt)}</legend>${question.options.map((option, oIndex) => `<label><input type="radio" name="story-q-${qIndex}" value="${oIndex}"><span>${escapeHtml(option)}</span></label>`).join("")}<div class="quiz-explanation" hidden></div></fieldset>`).join("")}</div><button class="primary story-submit" id="checkStoryQuiz">Check my answers</button><div id="storyQuizResult" class="story-quiz-result" aria-live="polite"></div></div>`;
    $$('[data-story-speak]').forEach((button) => button.addEventListener("click", () => speak(button.dataset.storySpeak, Number(button.dataset.rate))));
    $("#stopStoryAudio").addEventListener("click", () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); });
    $("#checkStoryQuiz").addEventListener("click", () => gradeStoryQuiz(story));
  }

  function highlightStoryChunks(text, chunkList) {
    let safe = escapeHtml(text);
    [...chunkList].sort((a, b) => b.text.length - a.text.length).forEach((chunk) => {
      const escaped = escapeHtml(chunk.text); safe = safe.replaceAll(escaped, `<mark title="${escapeHtml(chunk.meaning)}">${escaped}</mark>`);
    });
    return safe;
  }

  function gradeStoryQuiz(story) {
    let score = 0; const skills = {};
    story.questions.forEach((question, index) => {
      const fieldset = $(`[data-story-question="${index}"]`); const selected = fieldset.querySelector("input:checked"); const labels = [...fieldset.querySelectorAll("label")];
      labels.forEach((label, optionIndex) => { label.classList.remove("correct", "wrong"); if (optionIndex === question.answer) label.classList.add("correct"); });
      const skill = question.type || "Story"; skills[skill] ||= { score: 0, total: 0 }; skills[skill].total += 1;
      if (selected && Number(selected.value) === question.answer) { score += 1; skills[skill].score += 1; } else if (selected) selected.closest("label").classList.add("wrong");
      const explanation = fieldset.querySelector(".quiz-explanation"); explanation.hidden = false; explanation.textContent = question.explanation;
    });
    const percent = Math.round(score / story.questions.length * 100); const breakdown = Object.entries(skills).map(([skill, stat]) => `<span><b>${escapeHtml(skill)}:</b> ${stat.score}/${stat.total}</span>`).join(""); const result = $("#storyQuizResult"); result.className = `story-quiz-result ${percent >= 70 ? "good" : "needs-work"}`; result.innerHTML = `<strong>${score}/${story.questions.length} correct · ${percent}%</strong><div class="quiz-breakdown">${breakdown}</div><span>${percent === 100 ? "Excellent—you understood the story and can apply its chunks." : percent >= 70 ? "Good understanding. Review the explanations for the questions you missed." : "Read or listen once more, then try the questions again."}</span>`; result.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function contextProgress(id) { return { attempts: 0, best: 0, completed: false, responseWritten: false, ...progress.contexts[id] }; }
  function renderContexts(filter = "All", selectedId = null) {
    const categories = [...new Set(contexts.map((context) => context.category))];
    const visible = contexts.filter((context) => filter === "All" || context.category === filter);
    const selected = visible.some((context) => context.id === selectedId) ? selectedId : visible[0]?.id;
    $("#contextCount").textContent = contexts.length;
    $("#contextFilters").innerHTML = ["All", ...categories].map((category) => `<button class="filter-chip ${category === filter ? "active" : ""}" data-context-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
    $("#contextList").innerHTML = visible.map((context) => { const saved = contextProgress(context.id); return `<button class="context-card ${context.id === selected ? "active" : ""}" data-context-id="${escapeHtml(context.id)}"><span>${escapeHtml(context.format)} · ${context.minutes} min</span><strong>${escapeHtml(context.title)}</strong><small>${escapeHtml(context.summary)}</small><b>${saved.completed ? `Best ${saved.best}% · completed` : "Not completed"}</b></button>`; }).join("");
    $$('[data-context-filter]').forEach((button) => button.addEventListener("click", () => renderContexts(button.dataset.contextFilter)));
    $$('[data-context-id]').forEach((button) => button.addEventListener("click", () => { renderContexts(filter, button.dataset.contextId); }));
    const context = contexts.find((item) => item.id === selected); if (context) renderContextReader(context);
  }
  function renderContextReader(context) {
    const completeText = context.passage.map((item) => `${item.speaker}. ${item.text}`).join(" "); const saved = contextProgress(context.id);
    $("#contextReader").innerHTML = `<div class="context-kicker"><span>${escapeHtml(context.category)} · ${escapeHtml(context.format)} · ${escapeHtml(context.level)}</span><span>${saved.completed ? `Best score ${saved.best}%` : "Read for intent first"}</span></div><h2>${escapeHtml(context.title)}</h2><p class="story-deck">${escapeHtml(context.summary)}</p><div class="context-instruction"><b>Think first:</b> Who is communicating, why now, and what response do they expect?</div><button class="secondary context-listen" data-story-speak="${escapeHtml(completeText)}" data-rate="0.92">▶ Listen without translating</button><div class="context-passage">${context.passage.map((item) => `<section><span>${escapeHtml(item.speaker)}</span><p>${highlightStoryChunks(item.text, context.chunks)}</p></section>`).join("")}</div><div class="context-quiz"><p class="eyebrow">STEP 1 · UNDERSTAND THE INTENT</p><h3>What is really happening here?</h3>${context.questions.map((question, index) => `<fieldset data-context-question="${index}"><div class="question-type">${escapeHtml(question.type)}</div><legend><span>${index + 1}</span>${escapeHtml(question.prompt)}</legend>${question.options.map((option, optionIndex) => `<label><input type="radio" name="context-${escapeHtml(context.id)}-${index}" value="${optionIndex}"><span>${escapeHtml(option)}</span></label>`).join("")}<div class="quiz-explanation" hidden></div></fieldset>`).join("")}<button class="primary story-submit" id="checkContextQuiz">Check my understanding</button><div id="contextQuizResult" class="story-quiz-result" aria-live="polite"></div></div><section class="chunk-unpack" id="chunkUnpack" hidden><p class="eyebrow">STEP 2 · UNPACK THE CHUNKS</p><h3>Notice what each phrase is doing.</h3>${context.chunks.map((item) => `<article><strong>${escapeHtml(item.text)}</strong><p>${escapeHtml(item.meaning)}</p><span><b>Speaker’s intent:</b> ${escapeHtml(item.intent)}</span>${item.chunkId && chunks.some((chunk) => chunk.id === item.chunkId) ? '<em>Already connected to your chunk library</em>' : ""}</article>`).join("")}</section><section class="context-response" id="contextResponse" hidden><p class="eyebrow">STEP 3 · RESPOND IN ENGLISH</p><h3>${escapeHtml(context.responsePrompt)}</h3><div class="response-hints"><b>Useful openings</b>${context.responseHints.map((hint) => `<button type="button" data-response-hint="${escapeHtml(hint)}">${escapeHtml(hint)}</button>`).join("")}</div><textarea id="contextWriting" rows="6" placeholder="Write your response here. Focus on meaning first; edit the grammar afterward."></textarea><div class="response-actions"><button class="secondary" id="revealModelResponse">Compare with a natural response</button><button class="primary" id="saveContextResponse">Save my response</button></div><div id="modelResponse" class="model-response" hidden><b>One natural response</b><p>${escapeHtml(context.modelResponse)}</p><small>Do not copy it word for word. Compare its intent, structure, and chunks with yours.</small></div><p id="contextSaveStatus" class="context-save-status">${saved.responseWritten ? "You have already saved a response for this situation." : "Your writing stays only in this browser."}</p></section>`;
    $$('[data-story-speak]').forEach((button) => button.addEventListener("click", () => speak(button.dataset.storySpeak, Number(button.dataset.rate))));
    $("#checkContextQuiz").addEventListener("click", () => gradeContextQuiz(context));
  }
  function gradeContextQuiz(context) {
    let score = 0;
    context.questions.forEach((question, index) => { const fieldset = $(`[data-context-question="${index}"]`); const selected = fieldset.querySelector("input:checked"); const labels = [...fieldset.querySelectorAll("label")]; labels.forEach((label, optionIndex) => { label.classList.remove("correct", "wrong"); if (optionIndex === question.answer) label.classList.add("correct"); }); if (selected && Number(selected.value) === question.answer) score += 1; else if (selected) selected.closest("label").classList.add("wrong"); const explanation = fieldset.querySelector(".quiz-explanation"); explanation.hidden = false; explanation.textContent = question.explanation; });
    const percent = Math.round(score / context.questions.length * 100); const previous = contextProgress(context.id); progress.contexts[context.id] = { ...previous, attempts: previous.attempts + 1, best: Math.max(previous.best, percent), completed: true, last: todayKey() }; saveProgress();
    if (!previous.completed) context.chunks.filter((item) => item.chunkId).slice(0, 3).forEach((item) => { const chunk = chunks.find((candidate) => candidate.id === item.chunkId); if (chunk) record(chunk.id, percent >= 70); });
    const result = $("#contextQuizResult"); result.className = `story-quiz-result ${percent >= 70 ? "good" : "needs-work"}`; result.innerHTML = `<strong>${score}/${context.questions.length} correct · ${percent}%</strong><span>${percent >= 70 ? "Good. Now inspect how the chunks carry the intent, then write your response." : "Read once more, especially the implied meaning. The explanations will guide you."}</span>`;
    $("#chunkUnpack").hidden = false; $("#contextResponse").hidden = false;
    $$('[data-response-hint]').forEach((button) => button.addEventListener("click", () => { const area = $("#contextWriting"); area.value = `${area.value}${area.value ? " " : ""}${button.dataset.responseHint}`; area.focus(); }));
    $("#revealModelResponse").addEventListener("click", () => { $("#modelResponse").hidden = false; });
    $("#saveContextResponse").addEventListener("click", () => saveContextResponse(context));
    updateDashboard();
  }
  function saveContextResponse(context) {
    const value = $("#contextWriting").value.trim(); if (!value) { $("#contextSaveStatus").textContent = "Write at least one sentence before saving."; return; }
    const saved = contextProgress(context.id); progress.contexts[context.id] = { ...saved, responseWritten: true, response: value, responseDate: todayKey() };
    context.chunks.filter((item) => item.chunkId && value.toLowerCase().includes(item.text.toLowerCase())).forEach((item) => { const stat = itemStat(item.chunkId); stat.spoken += 1; progress.items[item.chunkId] = stat; });
    saveProgress(); $("#contextSaveStatus").textContent = "Saved on this device. Nice—meaning first, then language.";
  }

  function quickRecallState() {
    progress.quickRecall ||= { total: 0, seen: {}, hidden: [], recent: [] };
    progress.quickRecall.seen ||= {}; progress.quickRecall.hidden ||= []; progress.quickRecall.recent ||= [];
    return progress.quickRecall;
  }
  function chooseQuickChunk() {
    const state = quickRecallState(); const hidden = new Set(state.hidden); const recent = new Set(state.recent.slice(-18));
    const available = chunks.filter((chunk) => !hidden.has(chunk.id)); if (!available.length) return null;
    let candidates = available.filter((chunk) => !recent.has(chunk.id)); if (!candidates.length) candidates = available;
    const minimum = Math.min(...candidates.map((chunk) => state.seen[chunk.id] || 0));
    const leastSeen = candidates.filter((chunk) => (state.seen[chunk.id] || 0) <= minimum + 1);
    return leastSeen[Math.floor(Math.random() * leastSeen.length)];
  }
  function quickStructure(chunk) {
    if (/\+/.test(chunk.chunk)) return chunk.chunk;
    if (chunk.gap) return chunk.gap.replace("___", `[${chunk.answer || "word"}]`);
    return chunk.chunk;
  }
  function renderQuickRecall() {
    const chunk = chooseQuickChunk(); const state = quickRecallState(); quickCurrentId = chunk?.id || null;
    if (!chunk) {
      $("#quickPracticeCard").innerHTML = `<div class="quick-empty"><span class="spark-icon">✦</span><h2>You have hidden every chunk.</h2><p>Bring hidden chunks back into the rotation to continue.</p><button class="primary" id="quickRestoreAll">Show hidden chunks again</button></div>`;
      $("#quickRestoreAll").addEventListener("click", restoreAllQuickChunks); renderQuickDashboard(); return;
    }
    state.total += 1; state.seen[chunk.id] = (state.seen[chunk.id] || 0) + 1; state.recent = [...state.recent, chunk.id].slice(-18); saveProgress();
    const situations = shuffle([chunk.situation, ...chunks.filter((item) => item.id !== chunk.id).map((item) => item.situation)]).filter((value, index, values) => value && values.indexOf(value) === index).slice(0, 4);
    if (!situations.includes(chunk.situation)) situations[0] = chunk.situation;
    $("#quickPracticeCard").innerHTML = `<div class="quick-card-top"><span>APPEARANCE ${state.seen[chunk.id]}</span><button class="listen-link" data-speak="${escapeHtml(chunk.chunk)}">▶ Listen</button></div><p class="eyebrow">WHEN WOULD YOU USE THIS?</p><h2>${escapeHtml(chunk.chunk)}</h2><div class="quick-options">${shuffle(situations).map((situation, index) => `<button data-quick-answer="${escapeHtml(situation)}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(situation)}</button>`).join("")}</div><div id="quickExplanation"></div>`;
    bindPronunciation($("#quickPracticeCard"));
    $$('[data-quick-answer]').forEach((button) => button.addEventListener("click", () => answerQuickRecall(chunk, button)));
    renderQuickDashboard();
  }
  function answerQuickRecall(chunk, selectedButton) {
    const correct = selectedButton.dataset.quickAnswer === chunk.situation;
    $$('[data-quick-answer]').forEach((button) => { button.disabled = true; button.classList.toggle("correct", button.dataset.quickAnswer === chunk.situation); });
    if (!correct) selectedButton.classList.add("wrong");
    $("#quickExplanation").innerHTML = `<section class="quick-explanation"><div class="learning-highlight"><span class="spark-icon">✦</span><div><b>${correct ? "Exactly—this is the right situation." : "Notice the speaker's intention."}</b><p>${escapeHtml(chunk.meaning)}</p></div></div><dl><div><dt>When to use it</dt><dd>${escapeHtml(chunk.situation)}</dd></div><div><dt>Structure</dt><dd><code>${escapeHtml(quickStructure(chunk))}</code></dd></div><div><dt>Natural example</dt><dd>${escapeHtml(chunk.example)}</dd></div><div><dt>Remember</dt><dd>${escapeHtml(chunk.note)}</dd></div></dl><div class="quick-choice-actions"><button class="secondary" id="quickRepeat">Keep in rotation</button><button class="secondary no-repeat" id="quickHide">I know it—don't show again</button><button class="primary" id="quickNext">Next random chunk →</button></div></section>`;
    $("#quickRepeat").addEventListener("click", () => { setQuickHidden(chunk.id, false); renderQuickRecall(); });
    $("#quickHide").addEventListener("click", () => { setQuickHidden(chunk.id, true); renderQuickRecall(); });
    $("#quickNext").addEventListener("click", renderQuickRecall);
  }
  function setQuickHidden(id, hidden) {
    const state = quickRecallState(); state.hidden = hidden ? [...new Set([...state.hidden, id])] : state.hidden.filter((item) => item !== id); saveProgress(); renderQuickDashboard();
  }
  function restoreAllQuickChunks() { const state = quickRecallState(); state.hidden = []; saveProgress(); renderQuickRecall(); }
  function resetQuickRecall() {
    if (!confirm("Reset all Quick Recall appearances, recent history, and hidden chunks?")) return;
    progress.quickRecall = { total: 0, seen: {}, hidden: [], recent: [] }; saveProgress(); renderQuickRecall();
  }
  function renderQuickDashboard() {
    const state = quickRecallState(); const hidden = new Set(state.hidden);
    $("#quickUnique").textContent = Object.keys(state.seen).length; $("#quickTotal").textContent = state.total; $("#quickHidden").textContent = state.hidden.length; $("#quickAvailable").textContent = Math.max(0, chunks.length - state.hidden.length);
    $("#restoreHiddenChunks").disabled = !state.hidden.length;
    $("#hiddenChunkList").innerHTML = state.hidden.length ? `<p>Hidden from rotation</p>${state.hidden.map((id) => { const chunk = chunks.find((item) => item.id === id); return chunk ? `<button data-restore-chunk="${escapeHtml(id)}"><span>${escapeHtml(chunk.chunk)}</span><b>Restore</b></button>` : ""; }).join("")}` : '<p>No chunks are hidden.</p>';
    $$('[data-restore-chunk]').forEach((button) => button.addEventListener("click", () => setQuickHidden(button.dataset.restoreChunk, false)));
  }

  function expressionProgress(id) { return { attempts: 0, completed: false, variationCompleted: false, ...progress.expressions[id] }; }
  function renderExpressions(filter = expressionCategory, selectedId = activeExpressionId) {
    expressionCategory = filter;
    const categories = [...new Set(expressions.map((scenario) => scenario.category))];
    const visible = expressions.filter((scenario) => filter === "All" || scenario.category === filter);
    const selected = visible.some((scenario) => scenario.id === selectedId) ? selectedId : visible[0]?.id;
    activeExpressionId = selected || null;
    $("#expressionCount").textContent = expressions.length;
    $("#expressionFilters").innerHTML = ["All", ...categories].map((category) => `<button class="filter-chip ${category === filter ? "active" : ""}" data-expression-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
    $("#expressionList").innerHTML = visible.map((scenario) => { const saved = expressionProgress(scenario.id); return `<button class="expression-card ${scenario.id === selected ? "active" : ""}" data-expression-id="${escapeHtml(scenario.id)}"><span>${escapeHtml(scenario.category)} · ${escapeHtml(scenario.level)}</span><strong>${escapeHtml(scenario.title)}</strong><small>${saved.completed ? "Completed · practice the variation" : "Start with the intention"}</small></button>`; }).join("") || '<p class="context">No scenarios in this category yet.</p>';
    $$('[data-expression-filter]').forEach((button) => button.addEventListener("click", () => renderExpressions(button.dataset.expressionFilter)));
    $$('[data-expression-id]').forEach((button) => button.addEventListener("click", () => renderExpressions(filter, button.dataset.expressionId)));
    const scenario = expressions.find((item) => item.id === selected); if (scenario) renderExpressionReader(scenario);
  }
  function renderExpressionReader(scenario) {
    const saved = expressionProgress(scenario.id);
    $("#expressionReader").innerHTML = `<div class="expression-kicker"><span>${escapeHtml(scenario.category)} · ${escapeHtml(scenario.level)}</span><span>${saved.completed ? "Practiced" : "Meaning before wording"}</span></div><p class="eyebrow">1 · NATURAL VIETNAMESE THOUGHT</p><h2>${escapeHtml(scenario.title)}</h2><blockquote class="vietnamese-thought" lang="vi">${escapeHtml(scenario.thought)}</blockquote><section class="expression-step" id="intentStep"><p class="eyebrow">2 · IDENTIFY THE INTENT</p><h3>What are you really trying to do?</h3><div class="intent-options">${scenario.intentOptions.map((option, index) => `<button data-intent-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option)}</button>`).join("")}</div><div id="intentFeedback" class="expression-feedback" hidden></div></section><section class="expression-step locked-step" id="reshapeStep"><p class="eyebrow">3 · RESHAPE THE IDEA</p><h3>Make the thought easier to express.</h3><p>Write two or three short ideas in Vietnamese or simple English. Preserve the meaning; do not translate every word.</p><textarea id="reshapeWriting" rows="4" placeholder="Break the thought into smaller intentions..."></textarea><button class="secondary" id="compareReshape">Compare with a reshaped idea</button><div id="reshapeReference" class="reference-box" hidden><b>One useful reshape</b><p lang="vi">${escapeHtml(scenario.reshape)}</p></div></section><section class="expression-step locked-step" id="constructStep"><p class="eyebrow">4 · FIND CHUNKS & EXPRESS</p><h3>Build your English response.</h3><div class="progressive-hints">${scenario.hintGroups.map((group, index) => `<div><button class="hint-toggle" data-hint-group="${index}">Reveal ${escapeHtml(group.label)} hint</button><div class="hint-content" data-hint-content="${index}" hidden>${group.chunks.map((chunk) => `<button type="button" data-expression-hint="${escapeHtml(chunk)}">${escapeHtml(chunk)}</button>`).join("")}</div></div>`).join("")}</div><textarea id="expressionWriting" rows="6" placeholder="Write naturally. Focus on your intention first..."></textarea><div class="response-actions"><button class="secondary" id="revealExpressionAnswers">View natural answers</button><button class="primary" id="saveExpression">Save my response</button></div><div id="expressionAnswers" class="reference-box" hidden><b>Natural reference answers</b>${scenario.answers.map((answer) => `<p>${escapeHtml(answer)}</p>`).join("")}<small>${escapeHtml(scenario.explanation)}</small></div><p id="expressionSaveStatus" class="context-save-status">${saved.completed ? "You practiced this scenario before. Try a different answer today." : "Your response stays only in this browser."}</p></section><section class="expression-step locked-step" id="variationStep"><p class="eyebrow">5 · VARIED PRACTICE</p><h3>Reuse the intention in a new situation.</h3><blockquote class="variation-thought" lang="vi">${escapeHtml(scenario.variation)}</blockquote><textarea id="variationWriting" rows="5" placeholder="Reuse the chunks, but adapt them to this new situation..."></textarea><button class="primary" id="saveVariation">Complete varied practice</button><p id="variationStatus" class="context-save-status">${saved.variationCompleted ? "Variation completed before—try saying it a new way." : "Retrieval in a new context helps the chunks become flexible."}</p></section>`;
    $$('[data-intent-option]').forEach((button) => button.addEventListener("click", () => checkExpressionIntent(scenario, button)));
  }
  function unlockExpressionStep(selector) { const step = $(selector); step.classList.remove("locked-step"); step.scrollIntoView({ behavior: "smooth", block: "center" }); }
  function checkExpressionIntent(scenario, button) {
    const selected = Number(button.dataset.intentOption); const correct = selected === scenario.intentAnswer;
    $$('[data-intent-option]').forEach((option, index) => { option.disabled = true; option.classList.toggle("correct", index === scenario.intentAnswer); option.classList.toggle("wrong", index === selected && !correct); });
    const feedback = $("#intentFeedback"); feedback.hidden = false; feedback.className = `expression-feedback ${correct ? "good" : "needs-work"}`; feedback.innerHTML = `<strong>${correct ? "Yes—that's the intention." : "Not quite. Look past the surface details."}</strong><span>${escapeHtml(scenario.intentExplanation)}</span>`;
    unlockExpressionStep("#reshapeStep");
    $("#compareReshape").addEventListener("click", () => { $("#reshapeReference").hidden = false; unlockExpressionStep("#constructStep"); bindExpressionConstruction(scenario); }, { once: true });
  }
  function bindExpressionConstruction(scenario) {
    $$('[data-hint-group]').forEach((button) => button.addEventListener("click", () => { const content = $(`[data-hint-content="${button.dataset.hintGroup}"]`); content.hidden = !content.hidden; button.textContent = content.hidden ? button.textContent.replace("Hide", "Reveal") : button.textContent.replace("Reveal", "Hide"); }));
    $$('[data-expression-hint]').forEach((button) => button.addEventListener("click", () => { const area = $("#expressionWriting"); area.value = `${area.value}${area.value ? " " : ""}${button.dataset.expressionHint}`; area.focus(); }));
    $("#revealExpressionAnswers").addEventListener("click", () => { $("#expressionAnswers").hidden = false; unlockExpressionStep("#variationStep"); bindExpressionVariation(scenario); }, { once: true });
    $("#saveExpression").addEventListener("click", () => saveExpressionResponse(scenario));
  }
  function saveExpressionResponse(scenario) {
    const response = $("#expressionWriting").value.trim(); if (!response) { $("#expressionSaveStatus").textContent = "Write at least one sentence before saving."; return; }
    const saved = expressionProgress(scenario.id); progress.expressions[scenario.id] = { ...saved, attempts: saved.attempts + 1, completed: true, response, last: todayKey() }; saveProgress();
    $("#expressionSaveStatus").textContent = "Saved. Now compare the intention and structure—not just the exact words."; $("#expressionAnswers").hidden = false; unlockExpressionStep("#variationStep"); bindExpressionVariation(scenario);
  }
  function bindExpressionVariation(scenario) {
    const button = $("#saveVariation"); if (button.dataset.bound) return; button.dataset.bound = "true";
    button.addEventListener("click", () => { const response = $("#variationWriting").value.trim(); if (!response) { $("#variationStatus").textContent = "Write a response for the new situation first."; return; } const saved = expressionProgress(scenario.id); progress.expressions[scenario.id] = { ...saved, variationCompleted: true, variationResponse: response, variationDate: todayKey() }; saveProgress(); $("#variationStatus").textContent = "Completed. You reused the intention in a different context—that is flexible recall."; });
  }

  function renderSpeaking(filter = "All") {
    const categories = [...new Set(speakingTopics.map((topic) => topic.category))];
    $("#speakingTopicCount").textContent = speakingTopics.length;
    $("#topicFilters").innerHTML = ["All", ...categories].map((category) => `<button class="filter-chip ${category === filter ? "active" : ""}" data-speaking-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
    const visible = speakingTopics.filter((topic) => filter === "All" || topic.category === filter);
    $("#topicGrid").innerHTML = visible.map((topic) => `<button class="topic-card" data-topic-id="${escapeHtml(topic.id)}"><span class="topic-category">${escapeHtml(topic.category)}</span><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.goal)}</p><span>${escapeHtml(topic.level)} · ${topic.minutes} min →</span></button>`).join("");
    $$('[data-speaking-filter]').forEach((button) => button.addEventListener("click", () => renderSpeaking(button.dataset.speakingFilter)));
    $$('[data-topic-id]').forEach((button) => button.addEventListener("click", () => showSpeakingTopic(button.dataset.topicId)));
    if (visible[0]) showSpeakingTopic(visible[0].id);
  }
  function showSpeakingTopic(id) {
    const topic = speakingTopics.find((item) => item.id === id); if (!topic) return;
    const useful = topic.chunkIds.map((chunkId) => chunks.find((chunk) => chunk.id === chunkId)).filter(Boolean);
    const practice = progress.conversations[topic.id] || { runs: 0, used: [] };
    $("#topicDetail").innerHTML = `<span class="topic-category">${escapeHtml(topic.category)} · ${escapeHtml(topic.level)} · ${topic.minutes} min</span><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.goal)}</p><div class="conversation-history">Practiced ${practice.runs} time${practice.runs === 1 ? "" : "s"}</div><div class="role-box"><b>Your role</b><span>${escapeHtml(topic.userRole)}</span><b>ChatGPT's role</b><span>${escapeHtml(topic.aiRole)}</span><b>Opening line</b><span>“${escapeHtml(topic.opening)}”</span></div><h3>Discussion questions</h3><ol>${topic.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol><h3>Useful chunks</h3><div class="topic-chunks">${useful.map((chunk) => `<span>${escapeHtml(chunk.chunk)}</span>`).join("")}</div><details><summary>Preview the ChatGPT Live prompt</summary><p>${escapeHtml(topic.prompt)}</p></details><button class="primary copy-prompt" id="copyLivePrompt">Copy ChatGPT Live prompt</button><a class="open-chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener">Open ChatGPT ↗</a><p class="copy-status" id="copyStatus">Paste the prompt into ChatGPT, start Voice, and begin with the opening line.</p><div class="conversation-review"><h3>After the conversation</h3><p>Mark the chunks you actually used without reading.</p>${useful.map((chunk) => `<label><input type="checkbox" value="${escapeHtml(chunk.id)}"> <span>${escapeHtml(chunk.chunk)}</span></label>`).join("")}<button class="secondary" id="saveConversation">Save practice result</button><p id="conversationSaved"></p></div>`;
    $("#copyLivePrompt").addEventListener("click", () => copyText(topic.prompt));
    $("#saveConversation").addEventListener("click", () => saveConversationPractice(topic));
    if (innerWidth < 1000) $("#topicDetail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function saveConversationPractice(topic) {
    const used = [...$("#topicDetail").querySelectorAll('.conversation-review input:checked')].map((input) => input.value);
    const previous = progress.conversations[topic.id] || { runs: 0, used: [] }; progress.conversations[topic.id] = { runs: previous.runs + 1, last: todayKey(), used: [...new Set([...previous.used, ...used])] };
    used.forEach((id) => { const stat = itemStat(id); stat.spoken += 1; stat.lastSeen = todayKey(); progress.items[id] = stat; }); saveProgress();
    $("#conversationSaved").textContent = `Saved: ${used.length} target chunk${used.length === 1 ? "" : "s"} used from memory.`; updateDashboard(); updateProgressView();
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); $("#copyStatus").textContent = "Prompt copied. Open ChatGPT Voice and paste it."; }
    catch (_) { const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); $("#copyStatus").textContent = "Prompt copied. Open ChatGPT Voice and paste it."; }
  }

  function supportsMode(chunk, mode) { return ["listen", "recall"].includes(mode) || !chunk.practiceModes || chunk.practiceModes.includes(mode); }
  function poolFor(review, mode, topicId) {
    const eligible = chunks.filter((chunk) => (!topicId || chunk.sessionId === topicId) && (!mode || mode === "mixed" || supportsMode(chunk, mode)));
    const ranked = [...eligible].sort((a, b) => weakness(b) - weakness(a));
    if (review) { const due = ranked.filter((chunk) => isDue(chunk) || itemStat(chunk.id).wrong > 0); return due.length ? due : ranked; }
    const due = ranked.filter(isDue); const learning = ranked.filter((chunk) => itemStat(chunk.id).seen > 0 && !isDue(chunk) && learningStage(chunk) !== "Mastered");
    const fresh = shuffle(ranked.filter((chunk) => learningStage(chunk) === "New")).slice(0, 5); const mastered = shuffle(ranked.filter((chunk) => learningStage(chunk) === "Mastered"));
    return [...due, ...learning, ...fresh, ...mastered].filter((chunk, index, values) => values.findIndex((item) => item.id === chunk.id) === index);
  }
  function start(mode, topicId = null) {
    if (!chunks.length) return;
    const review = mode === "review"; const actualMode = review || mode === "mixed" ? "mixed" : mode;
    const pool = poolFor(review, actualMode, topicId); const items = pool.slice(0, Math.min(SESSION_SIZE, pool.length));
    if (items.length && items.length < SESSION_SIZE) { const reinforcement = shuffle(items); let index = 0; while (items.length < SESSION_SIZE) { items.push(reinforcement[index % reinforcement.length]); index += 1; } }
    session = { mode: actualMode, sourceMode: mode, topicId, items, index: 0, score: 0, streak: 0, bestStreak: 0, answered: false };
    show("practice"); renderQuestion();
  }
  function currentMode() {
    if (session.mode !== "mixed") return session.mode;
    const chunk = session.items[session.index];
    const modes = ["listen", "meaning", "situation", "recall", "speak", "build"].filter((mode) => supportsMode(chunk, mode) || ["listen", "recall"].includes(mode));
    return modes[session.index % modes.length];
  }
  function pronunciationHtml(chunk) {
    return `<div class="pronunciation"><div><span>IPA</span><strong>${escapeHtml(chunk.ipa)}</strong></div><div><span>VI GUIDE · STRESS IN CAPS</span><strong>${escapeHtml(chunk.viPronunciation || "Listen and repeat")}</strong></div><div class="audio-actions"><button class="pronounce-button" data-speak="${escapeHtml(chunk.chunk)}" data-rate="0.96" aria-label="Listen at natural speed">▶ Natural</button><button class="slow-button" data-speak="${escapeHtml(chunk.chunk)}" data-rate="0.76" aria-label="Listen slowly">Slow</button></div><div class="rhythm-guide"><span>NATURAL RHYTHM · STRESS THE BOLD WORDS</span><p>${rhythmHtml(chunk.chunk)}</p></div></div>`;
  }
  function rhythmHtml(text) {
    const unstressed = new Set(["a","an","the","to","for","of","and","or","but","is","are","am","was","were","be","been","it","this","that","i","you","we","they","my","your","our","in","on","at","with","as"]);
    return String(text).split(/(\s+)/).map((part) => { const word = part.toLowerCase().replace(/[^a-z']/g, ""); const safe = escapeHtml(part); return word && !unstressed.has(word) && word.length > 2 ? `<b>${safe}</b>` : safe; }).join("");
  }
  function bindPronunciation(root = document) { root.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", () => speak(button.dataset.speak, Number(button.dataset.rate) || 0.96))); }

  function renderEvidence() {
    const categories = ["All", ...new Set(evidenceItems.map((item) => item.category))];
    $("#evidenceCount").textContent = evidenceItems.length;
    $("#evidenceFilters").innerHTML = categories.map((category) => `<button class="filter-chip ${category === evidenceCategory ? "active" : ""}" data-evidence-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
    const visible = evidenceItems.filter((item) => evidenceCategory === "All" || item.category === evidenceCategory);
    $("#evidenceGrid").innerHTML = visible.map((item) => {
      const linked = item.chunkId && chunks.some((chunk) => chunk.id === item.chunkId);
      return `<article class="evidence-card"><div class="evidence-card-top"><span>${escapeHtml(item.category)} · ${escapeHtml(item.level)}</span><b>${linked ? "IN YOUR CHUNK LIBRARY" : "VERIFIED SOURCE"}</b></div><h2>${escapeHtml(item.chunk)}</h2><blockquote>${escapeHtml(item.excerpt)}</blockquote><div class="source-line"><span>${escapeHtml(item.source.publisher)} · ${escapeHtml(item.source.date)}</span><a href="${escapeHtml(item.source.url)}" target="_blank" rel="noopener">Open original source ↗</a></div><dl><div><dt>Article situation</dt><dd>${escapeHtml(item.context)}</dd></div><div><dt>What the chunk does</dt><dd>${escapeHtml(item.function)}</dd></div><div><dt>Structure</dt><dd><code>${escapeHtml(item.pattern)}</code></dd></div><div><dt>Transfer to your work</dt><dd>${escapeHtml(item.transfer)}</dd></div></dl><small class="source-title">From “${escapeHtml(item.source.title)}”</small></article>`;
    }).join("");
    $$('[data-evidence-category]').forEach((button) => button.addEventListener("click", () => { evidenceCategory = button.dataset.evidenceCategory; renderEvidence(); }));
  }
  function renderQuestion() {
    const chunk = session.items[session.index]; const mode = currentMode();
    $("#sessionProgressBar").style.width = `${session.index / session.items.length * 100}%`; $("#sessionScore").textContent = `${session.score}/${session.index}`;
    if (mode === "meaning") renderChoice(chunk, "WHAT DOES THIS CHUNK MEAN?", chunk.chunk, chunk.meaning, "meaning");
    else if (mode === "situation") renderChoice(chunk, "WHAT WOULD YOU SAY?", chunk.situation, chunk.chunk, "chunk");
    else if (mode === "build") renderBuild(chunk); else if (mode === "listen") renderListen(chunk); else if (mode === "recall") renderRecall(chunk); else renderSpeak(chunk);
    document.title = `${session.index + 1}/${session.items.length} · Chunk Lab`;
  }
  function distractors(chunk, field) {
    const preferred = (chunk.confusedWith || []).map((id) => chunks.find((item) => item.id === id)).filter(Boolean).map((item) => item[field]);
    const others = chunks.filter((item) => item.id !== chunk.id).map((item) => item[field]);
    return shuffle([...preferred, ...others].filter((value, index, values) => value && values.indexOf(value) === index)).slice(0, 3);
  }
  function renderChoice(chunk, label, prompt, answer, field) {
    const options = shuffle([answer, ...distractors(chunk, field)]);
    $("#practiceCard").innerHTML = `<p class="question-label">${label}</p><h1 class="prompt">${escapeHtml(prompt)}</h1>${field === "meaning" ? pronunciationHtml(chunk) + '<p class="context">Choose the closest meaning.</p>' : ""}<div class="options">${options.map((option, index) => `<button class="option" data-answer="${escapeHtml(option)}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div><div id="feedbackSlot"></div>`;
    bindPronunciation($("#practiceCard"));
    $$(".option").forEach((button) => button.addEventListener("click", () => answerChoice(button, button.dataset.answer === answer, chunk, answer)));
  }
  function answerChoice(button, correct, chunk, answer) {
    if (session.answered) return; session.answered = true; record(chunk.id, correct); updateSessionScore(correct);
    $$(".option").forEach((item) => { item.disabled = true; if (item.dataset.answer === answer) item.classList.add("correct"); }); if (!correct) button.classList.add("wrong"); renderFeedback(correct, chunk);
  }
  function renderFeedback(correct, chunk) {
    $("#feedbackSlot").innerHTML = `${pronunciationHtml(chunk)}<div class="feedback ${correct ? "good" : "bad"}"><strong>${correct ? "Exactly." : "Not quite—save this distinction."}</strong>${escapeHtml(chunk.note)}</div><button class="primary next-button" id="nextButton">${session.index === session.items.length - 1 ? "See results" : "Next chunk →"}</button>`;
    bindPronunciation($("#feedbackSlot"));
    $("#nextButton").addEventListener("click", next);
  }
  function updateSessionScore(correct) { if (correct) { session.score += 1; session.streak += 1; session.bestStreak = Math.max(session.bestStreak, session.streak); } else session.streak = 0; $("#sessionScore").textContent = `${session.score}/${session.index + 1}`; }
  function renderBuild(chunk) {
    const words = shuffle([chunk.answer, ...chunk.alternatives.slice(0, 3)]);
    $("#practiceCard").innerHTML = `<p class="question-label">BUILD THE SENTENCE</p><h1 class="prompt">Choose the missing word</h1><p class="context">${escapeHtml(chunk.situation)}</p><div class="gap-sentence">${escapeHtml(chunk.gap).replace("___", '<span class="blank" id="blank">___</span>')}</div><div class="word-bank">${words.map((word) => `<button class="word-chip">${escapeHtml(word)}</button>`).join("")}</div><div id="feedbackSlot"></div>`;
    $$(".word-chip").forEach((button) => button.addEventListener("click", () => { if (session.answered) return; $("#blank").textContent = button.textContent; session.answered = true; const correct = button.textContent === chunk.answer; record(chunk.id, correct); updateSessionScore(correct); $$(".word-chip").forEach((item) => item.disabled = true); renderFeedback(correct, chunk); }));
  }
  function renderListen(chunk) {
    const options = shuffle([chunk.meaning, ...distractors(chunk, "meaning")]);
    $("#practiceCard").innerHTML = `<p class="question-label">LISTEN & UNDERSTAND</p><h1 class="prompt">Listen before you read.</h1><p class="context">Play the complete chunk at natural speed, then choose its meaning.</p><button class="listen-hero" id="playListening">▶ Play audio</button><div class="options listening-options">${options.map((option, index) => `<button class="option" data-answer="${escapeHtml(option)}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div><div id="feedbackSlot"></div>`;
    $("#playListening").addEventListener("click", () => speak(chunk.chunk, 0.96));
    $$(".option").forEach((button) => button.addEventListener("click", () => answerChoice(button, button.dataset.answer === chunk.meaning, chunk, chunk.meaning)));
  }
  function renderRecall(chunk) {
    $("#practiceCard").innerHTML = `<p class="question-label">SPEAK FROM MEMORY</p><h1 class="prompt">What would you say?</h1><p class="context recall-situation">${escapeHtml(chunk.situation)}</p><div class="recall-instruction">Say one natural sentence aloud. Do not translate every word.</div><button class="primary reveal-answer" id="revealRecall">Reveal the natural chunk</button><div id="recallAnswer"></div>`;
    $("#revealRecall").addEventListener("click", () => {
      $("#revealRecall").remove(); $("#recallAnswer").innerHTML = `<div class="recall-answer"><p class="eyebrow">NATURAL ANSWER</p><h2>${escapeHtml(chunk.chunk)}</h2>${pronunciationHtml(chunk)}<div class="self-rate"><button class="secondary" id="recallAgain">I need another try</button><button class="primary" id="recallGood">I said it naturally</button></div></div>`;
      bindPronunciation($("#recallAnswer")); $("#recallAgain").addEventListener("click", () => rateSpeak(false, chunk)); $("#recallGood").addEventListener("click", () => rateSpeak(true, chunk));
    });
  }
  function renderSpeak(chunk) {
    $("#practiceCard").innerHTML = `<div class="speak-card"><p class="question-label">SPEAK & PRONOUNCE</p><p class="context">Read the pronunciation, listen, then say the complete chunk aloud.</p><h1 class="speak-quote">${escapeHtml(chunk.chunk)}</h1>${pronunciationHtml(chunk)}<div class="feedback"><strong>Use it like this</strong>${escapeHtml(chunk.example)}</div><div class="self-rate"><button class="secondary" id="againRate">Needs practice</button><button class="primary" id="goodRate">I said it well</button></div></div>`;
    bindPronunciation($("#practiceCard")); $("#againRate").addEventListener("click", () => rateSpeak(false, chunk)); $("#goodRate").addEventListener("click", () => rateSpeak(true, chunk));
  }

  function dailyDistractors(chunk, field, count = 3) {
    return shuffle(chunks.filter((item) => item.id !== chunk.id).map((item) => item[field]).filter((value, index, values) => value && values.indexOf(value) === index)).slice(0, count);
  }
  function buildDailyQuestions() {
    const selected = shuffle(chunks).slice(0, 14);
    const questions = selected.map((chunk, index) => {
      if (index % 3 === 0) return { type: "Meaning match", prompt: chunk.chunk, instruction: "What does this chunk mean?", answer: chunk.meaning, options: shuffle([chunk.meaning, ...dailyDistractors(chunk, "meaning")]), explanation: chunk.note, structure: chunk.chunk, example: chunk.example, chunkId: chunk.id };
      if (index % 3 === 1) return { type: "Best chunk", prompt: chunk.situation, instruction: "What would sound natural here?", answer: chunk.chunk, options: shuffle([chunk.chunk, ...dailyDistractors(chunk, "chunk")]), explanation: chunk.note, structure: chunk.chunk, example: chunk.example, chunkId: chunk.id };
      if (chunk.gap && chunk.answer && Array.isArray(chunk.alternatives)) return { type: "Fill the gap", prompt: chunk.gap, instruction: "Choose the missing word or chunk.", answer: chunk.answer, options: shuffle([chunk.answer, ...chunk.alternatives.slice(0, 3)]), explanation: chunk.note, structure: chunk.chunk, example: chunk.example, chunkId: chunk.id };
      return { type: "Meaning match", prompt: chunk.chunk, instruction: "Choose the closest meaning.", answer: chunk.meaning, options: shuffle([chunk.meaning, ...dailyDistractors(chunk, "meaning")]), explanation: chunk.note, structure: chunk.chunk, example: chunk.example, chunkId: chunk.id };
    });
    questions.splice(3, 0, { type: "Image clue", prompt: "Which sentence best describes the scene?", instruction: "Use the visual details and choose the most accurate sentence.", answer: "The train has been delayed because of the weather.", options: ["The train arrived ahead of schedule.", "The train has been delayed because of the weather.", "The passengers decided to cancel the trip.", "The station is closed for the day."], explanation: "The rain, station clock, and waiting train suggest a weather-related delay. Has been delayed describes a recent event that affects the situation now.", structure: "subject + has/have been + past participle + reason", example: "The train has been delayed because of the weather.", image: true });
    return questions.slice(0, 15);
  }
  function startDailyChallenge() {
    if (dailyTimerId) clearInterval(dailyTimerId);
    dailySession = { questions: buildDailyQuestions(), index: 0, score: 0, answered: false, secondsLeft: 600, startedAt: Date.now() };
    show("dailyGame"); renderDailyQuestion();
    dailyTimerId = setInterval(() => { if (!dailySession) return; dailySession.secondsLeft -= 1; renderDailyTimer(); if (dailySession.secondsLeft <= 0) finishDailyChallenge(); }, 1000);
  }
  function renderDailyTimer() { const seconds = Math.max(0, dailySession?.secondsLeft || 0); $("#dailyGameTimer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
  function dailyImageHtml() { return `<div class="daily-image-scene" role="img" aria-label="A train waiting at a station during heavy rain"><span class="scene-cloud">☁</span><i class="rain-line r1"></i><i class="rain-line r2"></i><i class="rain-line r3"></i><div class="scene-sign">STATION</div><div class="scene-train">🚆</div><time>08:45</time></div>`; }
  function renderDailyQuestion() {
    const question = dailySession.questions[dailySession.index]; dailySession.answered = false;
    $("#dailyQuestionLabel").textContent = `QUESTION ${dailySession.index + 1} OF ${dailySession.questions.length}`; $("#dailyGameProgressBar").style.width = `${dailySession.index / dailySession.questions.length * 100}%`; renderDailyTimer();
    $("#dailyGameCard").innerHTML = `<span class="challenge-label">${escapeHtml(question.type.toUpperCase())}</span>${question.image ? dailyImageHtml() : ""}<p class="daily-game-instruction">${escapeHtml(question.instruction)}</p><h2>${escapeHtml(question.prompt).replace("___", '<span class="daily-gap">___</span>')}</h2><div class="daily-answer-grid">${question.options.map((option, index) => `<button data-daily-answer="${escapeHtml(option)}"><b>${String.fromCharCode(65 + index)}</b><span>${escapeHtml(option)}</span></button>`).join("")}</div><div id="dailyAnswerFeedback"></div>`;
    $$('[data-daily-answer]').forEach((button) => button.addEventListener("click", () => answerDailyQuestion(question, button)));
  }
  function answerDailyQuestion(question, button) {
    if (dailySession.answered) return; dailySession.answered = true; const correct = button.dataset.dailyAnswer === question.answer; if (correct) dailySession.score += 1;
    if (question.chunkId) record(question.chunkId, correct);
    $$('[data-daily-answer]').forEach((option) => { option.disabled = true; option.classList.toggle("correct", option.dataset.dailyAnswer === question.answer); }); if (!correct) button.classList.add("wrong");
    $("#dailyAnswerFeedback").innerHTML = `<section class="daily-answer-explanation"><div><span class="spark-icon">✦</span><div><strong>${correct ? "Exactly." : "Not quite—notice the intention and structure."}</strong><p>${escapeHtml(question.explanation)}</p></div></div><dl><div><dt>Structure</dt><dd><code>${escapeHtml(question.structure)}</code></dd></div><div><dt>Natural example</dt><dd>${escapeHtml(question.example)}</dd></div></dl><button class="primary" id="nextDailyQuestion">${dailySession.index === dailySession.questions.length - 1 ? "See my result" : "Next question →"}</button></section>`;
    $("#nextDailyQuestion").addEventListener("click", () => { dailySession.index += 1; dailySession.index >= dailySession.questions.length ? finishDailyChallenge() : renderDailyQuestion(); });
  }
  function finishDailyChallenge() {
    if (!dailySession) return; if (dailyTimerId) clearInterval(dailyTimerId); dailyTimerId = null;
    const total = dailySession.questions.length; const percent = Math.round(dailySession.score / total * 100); const seconds = Math.max(1, Math.round((Date.now() - dailySession.startedAt) / 1000));
    progress.dailyGames.unshift({ date: todayKey(), score: dailySession.score, total, percent, seconds }); progress.dailyGames = progress.dailyGames.slice(0, 30); saveProgress();
    $("#dailyGameProgressBar").style.width = "100%"; $("#dailyQuestionLabel").textContent = "CHALLENGE COMPLETE";
    $("#dailyGameCard").innerHTML = `<div class="daily-result"><div class="summary-burst">${percent >= 70 ? "✓" : "↗"}</div><p class="eyebrow">YOUR DAILY RESULT</p><h2>${dailySession.score}/${total} correct</h2><strong>${percent}% accuracy · ${Math.ceil(seconds / 60)} min</strong><p>${percent >= 85 ? "Excellent recall. Your chunks are becoming automatic." : percent >= 65 ? "Good progress. Missed chunks are now prioritized for review." : "Useful practice. Review the explanations, then try again tomorrow."}</p><div><button class="secondary" data-nav="progress">View my journey</button><button class="primary" id="playDailyAgain">Play again</button></div></div>`;
    $("#playDailyAgain").addEventListener("click", startDailyChallenge); $("#dailyGameCard [data-nav=progress]").addEventListener("click", () => { updateProgressView(); show("progress"); location.hash = "progress"; }); updateDashboard(); updateProgressView();
  }
  function selectVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    const preferredNames = ["Ava", "Samantha", "Allison", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Daniel"];
    preferredVoice = preferredNames.map((name) => voices.find((voice) => voice.name.includes(name))).find(Boolean) || voices.find((voice) => voice.lang === "en-US") || voices[0] || null;
  }
  function speak(text, rate = 0.96) { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = preferredVoice?.lang || "en-US"; if (preferredVoice) utterance.voice = preferredVoice; utterance.rate = rate; utterance.pitch = 1; utterance.volume = 1; speechSynthesis.speak(utterance); }
  function rateSpeak(correct, chunk) { if (session.answered) return; session.answered = true; record(chunk.id, correct, "speaking"); updateSessionScore(correct); next(); }
  function next() { session.index += 1; session.answered = false; session.index >= session.items.length ? finish() : renderQuestion(); }
  function finish() {
    const accuracy = Math.round(session.score / session.items.length * 100); $("#summaryScore").textContent = `${session.score}/${session.items.length}`; $("#summaryAccuracy").textContent = `${accuracy}%`; $("#summaryStreak").textContent = session.bestStreak;
    $("#summaryLine").textContent = accuracy >= 85 ? "Your recall is getting automatic." : accuracy >= 60 ? "Good progress. Your misses are queued for review." : "A useful session—your weak spots are now prioritized.";
    show("summary"); updateDashboard(); document.title = "Session complete · Chunk Lab";
  }

  function bindEvents() {
    $$('[data-mode]').forEach((button) => button.addEventListener("click", () => start(button.dataset.mode)));
    $$('[data-game="daily"]').forEach((button) => button.addEventListener("click", startDailyChallenge));
    $$('[data-nav]').forEach((button) => button.addEventListener("click", () => { const view = button.dataset.nav; if (dailyTimerId) { clearInterval(dailyTimerId); dailyTimerId = null; } if (view === "progress") updateProgressView(); if (view === "library") renderLibrary($("#chunkSearch")?.value || ""); if (view === "speaking") renderSpeaking(); if (view === "stories") renderStories(); if (view === "think") renderContexts(); if (view === "express") renderExpressions(); if (view === "evidence") renderEvidence(); if (view === "quick") renderQuickRecall(); show(view); location.hash = view === "home" ? "" : view; document.title = "Chunk Lab — English Practice"; }));
    $("#againButton").addEventListener("click", () => start(session.sourceMode, session.topicId)); $("#chunkSearch").addEventListener("input", (event) => renderLibrary(event.target.value));
    $("#resetButton").addEventListener("click", () => { if (confirm("Reset all scores and personalized review data on this device?")) { progress = defaultProgress(); saveProgress(); updateDashboard(); updateProgressView(); } });
    $("#restoreHiddenChunks").addEventListener("click", restoreAllQuickChunks); $("#resetQuickRecall").addEventListener("click", resetQuickRecall);
  }

  async function init() {
    bindEvents();
    try {
      selectVoice(); if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = selectVoice;
      await discoverContent();
      $("#contentStatus").textContent = `${chunks.length} learned chunks · ${registry.sessions.length} session${registry.sessions.length === 1 ? "" : "s"}`;
      $("#sourceNote").textContent = `${chunks.length} chunks · ${contentSource}`;
      $("#playChunkCount").textContent = chunks.length;
      $$('[data-mode], [data-game]').forEach((button) => { button.disabled = false; });
      updateDashboard(); updateProgressView(); renderLibrary(); renderSpeaking(); renderStories(); renderContexts(); renderExpressions(); renderEvidence();
      const requestedView = location.hash.slice(1); if (["play", "quick", "learn", "lab", "think", "express", "stories", "speaking", "progress", "library", "evidence"].includes(requestedView)) { if (requestedView === "quick") renderQuickRecall(); show(requestedView); }
    } catch (error) {
      $("#contentStatus").textContent = "Content could not be loaded"; $("#sourceNote").textContent = error.message; console.error(error, registry.errors);
    }
  }

  init();
})();
