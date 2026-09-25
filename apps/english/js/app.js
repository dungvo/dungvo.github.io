(() => {
  "use strict";

  const KEY = "chunkLabProgressV2";
  const LEGACY_KEY = "chunkLabProgressV1";
  const DAILY_TARGET = 10;
  const SESSION_SIZE = 10;
  const registry = { sessions: [], conversations: [], errors: [] };
  let chunks = [];
  let speakingTopics = [];
  let preferredVoice = null;
  let libraryTopic = "All";
  let progress = loadProgress();
  let session = null;
  let contentSource = "bundled catalog";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const todayKey = () => new Date().toISOString().slice(0, 10);

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

  function defaultProgress() { return { total: 0, correct: 0, items: {}, history: {} }; }
  function loadProgress() {
    try {
      const current = JSON.parse(localStorage.getItem(KEY));
      if (current) return { ...defaultProgress(), ...current, items: current.items || {}, history: current.history || {} };
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
      if (legacy) return { total: legacy.total || 0, correct: legacy.correct || 0, items: legacy.items || {}, history: legacy.today ? { [legacy.today]: { total: legacy.todayCount || 0, correct: 0 } } : {} };
    } catch (_) { /* Start clean if browser storage is malformed. */ }
    return defaultProgress();
  }
  function saveProgress() { localStorage.setItem(KEY, JSON.stringify(progress)); }
  function itemStat(id) { return progress.items[id] || { seen: 0, correct: 0, wrong: 0 }; }
  function record(id, correct) {
    const stat = itemStat(id);
    stat.seen += 1; correct ? stat.correct += 1 : stat.wrong += 1; progress.items[id] = stat;
    progress.total += 1; if (correct) progress.correct += 1;
    const day = progress.history[todayKey()] || { total: 0, correct: 0 };
    day.total += 1; if (correct) day.correct += 1; progress.history[todayKey()] = day;
    saveProgress();
  }
  function weakness(chunk) {
    const stat = itemStat(chunk.id);
    return stat.seen === 0 ? 2 : (stat.wrong * 3 - stat.correct * 0.25) + 1 / (stat.seen + 1);
  }
  function dateOffset(days) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10); }
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
    return entries.filter((item) => item.type === "file" && item.name.endsWith(".js")).sort((a, b) => a.name.localeCompare(b.name)).map((item) => item.download_url);
  }
  async function discoverContent() {
    const config = window.CHUNK_CONTENT_CONFIG || {};
    let files = [], conversationFiles = [];
    if (location.hostname === "dungvo.github.io" && config.github) {
      const { owner, repository, directory } = config.github;
      try {
        files = await githubFiles(owner, repository, directory);
        conversationFiles = await githubFiles(owner, repository, config.github.conversationDirectory);
        contentSource = "auto-discovered from GitHub";
      } catch (error) { registry.errors.push(`Discovery failed: ${error.message}`); }
    }
    if (!files.length) files = config.fallbackFiles || [];
    if (!conversationFiles.length) conversationFiles = config.conversationFallbackFiles || [];
    for (const file of [...files, ...conversationFiles]) {
      try { await loadScript(file); } catch (error) { registry.errors.push(error.message); }
    }
    const seen = new Set();
    chunks = registry.sessions.flatMap((entry) => entry.chunks.map((chunk) => ({ ...chunk, sessionId: entry.session.id, sessionTitle: entry.session.title, topics: entry.session.topics || [] }))).filter((chunk) => {
      if (seen.has(chunk.id)) { registry.errors.push(`Duplicate chunk id ignored: ${chunk.id}`); return false; }
      seen.add(chunk.id); return true;
    });
    speakingTopics = registry.conversations;
    if (!chunks.length) throw new Error("No valid learning content could be loaded.");
  }

  function show(view) {
    $$(".view").forEach((item) => item.classList.remove("active"));
    $(`#${view}View`).classList.add("active"); window.scrollTo(0, 0);
    $$(".site-header nav button").forEach((button) => button.classList.toggle("active", button.dataset.nav === view));
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
  }
  function updateProgressView() {
    const streak = currentStreak(); $("#allTimeReps").textContent = progress.total; $("#allTimeAccuracy").textContent = progress.total ? `${Math.round(progress.correct / progress.total * 100)}%` : "—"; $("#progressStreak").textContent = `${streak} day${streak === 1 ? "" : "s"}`;
    const weak = [...chunks].sort((a, b) => weakness(b) - weakness(a)).slice(0, 8);
    $("#weakList").innerHTML = weak.map((chunk) => { const stat = itemStat(chunk.id); return `<div class="weak-row"><div><strong>${escapeHtml(chunk.chunk)}</strong><span>${escapeHtml(chunk.meaning)}</span></div><span class="weak-score">${stat.wrong ? `${stat.wrong} miss${stat.wrong === 1 ? "" : "es"}` : "Not practiced"}</span></div>`; }).join("");
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
    $("#topicDetail").innerHTML = `<span class="topic-category">${escapeHtml(topic.category)} · ${escapeHtml(topic.level)} · ${topic.minutes} min</span><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.goal)}</p><div class="role-box"><b>Your role</b><span>${escapeHtml(topic.userRole)}</span><b>ChatGPT's role</b><span>${escapeHtml(topic.aiRole)}</span><b>Opening line</b><span>“${escapeHtml(topic.opening)}”</span></div><h3>Discussion questions</h3><ol>${topic.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol><h3>Useful chunks</h3><div class="topic-chunks">${useful.map((chunk) => `<span>${escapeHtml(chunk.chunk)}</span>`).join("")}</div><details><summary>Preview the ChatGPT Live prompt</summary><p>${escapeHtml(topic.prompt)}</p></details><button class="primary copy-prompt" id="copyLivePrompt">Copy ChatGPT Live prompt</button><a class="open-chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener">Open ChatGPT ↗</a><p class="copy-status" id="copyStatus">Paste the prompt into ChatGPT, start Voice, and begin with the opening line.</p>`;
    $("#copyLivePrompt").addEventListener("click", () => copyText(topic.prompt));
    if (innerWidth < 1000) $("#topicDetail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); $("#copyStatus").textContent = "Prompt copied. Open ChatGPT Voice and paste it."; }
    catch (_) { const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); $("#copyStatus").textContent = "Prompt copied. Open ChatGPT Voice and paste it."; }
  }

  function supportsMode(chunk, mode) { return !chunk.practiceModes || chunk.practiceModes.includes(mode); }
  function poolFor(review, mode) {
    const eligible = mode && mode !== "mixed" ? chunks.filter((chunk) => supportsMode(chunk, mode)) : chunks;
    const ranked = [...eligible].sort((a, b) => weakness(b) - weakness(a));
    if (review) { const missed = ranked.filter((chunk) => itemStat(chunk.id).wrong > 0); return missed.length ? missed : ranked; }
    const priority = ranked.slice(0, Math.max(SESSION_SIZE * 2, Math.ceil(chunks.length * 0.75))); return shuffle(priority);
  }
  function start(mode) {
    if (!chunks.length) return;
    const review = mode === "review"; const actualMode = review || mode === "mixed" ? "mixed" : mode;
    const items = shuffle(poolFor(review, actualMode)).slice(0, Math.min(SESSION_SIZE, chunks.length));
    session = { mode: actualMode, sourceMode: mode, items, index: 0, score: 0, streak: 0, bestStreak: 0, answered: false };
    show("practice"); renderQuestion();
  }
  function currentMode() {
    if (session.mode !== "mixed") return session.mode;
    const chunk = session.items[session.index];
    const modes = ["meaning", "situation", "build", "speak"].filter((mode) => supportsMode(chunk, mode));
    return modes[session.index % modes.length];
  }
  function pronunciationHtml(chunk) {
    return `<div class="pronunciation"><div><span>IPA</span><strong>${escapeHtml(chunk.ipa)}</strong></div><div><span>VI GUIDE · STRESS IN CAPS</span><strong>${escapeHtml(chunk.viPronunciation || "Listen and repeat")}</strong></div><div class="audio-actions"><button class="pronounce-button" data-speak="${escapeHtml(chunk.chunk)}" data-rate="0.96" aria-label="Listen at natural speed">▶ Natural</button><button class="slow-button" data-speak="${escapeHtml(chunk.chunk)}" data-rate="0.76" aria-label="Listen slowly">Slow</button></div></div>`;
  }
  function bindPronunciation(root = document) { root.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", () => speak(button.dataset.speak, Number(button.dataset.rate) || 0.96))); }
  function renderQuestion() {
    const chunk = session.items[session.index]; const mode = currentMode();
    $("#sessionProgressBar").style.width = `${session.index / session.items.length * 100}%`; $("#sessionScore").textContent = `${session.score}/${session.index}`;
    if (mode === "meaning") renderChoice(chunk, "WHAT DOES THIS CHUNK MEAN?", chunk.chunk, chunk.meaning, "meaning");
    else if (mode === "situation") renderChoice(chunk, "WHAT WOULD YOU SAY?", chunk.situation, chunk.chunk, "chunk");
    else if (mode === "build") renderBuild(chunk); else renderSpeak(chunk);
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
  function renderSpeak(chunk) {
    $("#practiceCard").innerHTML = `<div class="speak-card"><p class="question-label">SPEAK & PRONOUNCE</p><p class="context">Read the pronunciation, listen, then say the complete chunk aloud.</p><h1 class="speak-quote">${escapeHtml(chunk.chunk)}</h1>${pronunciationHtml(chunk)}<div class="feedback"><strong>Use it like this</strong>${escapeHtml(chunk.example)}</div><div class="self-rate"><button class="secondary" id="againRate">Needs practice</button><button class="primary" id="goodRate">I said it well</button></div></div>`;
    bindPronunciation($("#practiceCard")); $("#againRate").addEventListener("click", () => rateSpeak(false, chunk)); $("#goodRate").addEventListener("click", () => rateSpeak(true, chunk));
  }
  function selectVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    const preferredNames = ["Ava", "Samantha", "Allison", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Daniel"];
    preferredVoice = preferredNames.map((name) => voices.find((voice) => voice.name.includes(name))).find(Boolean) || voices.find((voice) => voice.lang === "en-US") || voices[0] || null;
  }
  function speak(text, rate = 0.96) { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = preferredVoice?.lang || "en-US"; if (preferredVoice) utterance.voice = preferredVoice; utterance.rate = rate; utterance.pitch = 1; utterance.volume = 1; speechSynthesis.speak(utterance); }
  function rateSpeak(correct, chunk) { if (session.answered) return; session.answered = true; record(chunk.id, correct); updateSessionScore(correct); next(); }
  function next() { session.index += 1; session.answered = false; session.index >= session.items.length ? finish() : renderQuestion(); }
  function finish() {
    const accuracy = Math.round(session.score / session.items.length * 100); $("#summaryScore").textContent = `${session.score}/${session.items.length}`; $("#summaryAccuracy").textContent = `${accuracy}%`; $("#summaryStreak").textContent = session.bestStreak;
    $("#summaryLine").textContent = accuracy >= 85 ? "Your recall is getting automatic." : accuracy >= 60 ? "Good progress. Your misses are queued for review." : "A useful session—your weak spots are now prioritized.";
    show("summary"); updateDashboard(); document.title = "Session complete · Chunk Lab";
  }

  function bindEvents() {
    $$('[data-mode]').forEach((button) => button.addEventListener("click", () => start(button.dataset.mode)));
    $$('[data-nav]').forEach((button) => button.addEventListener("click", () => { const view = button.dataset.nav; if (view === "progress") updateProgressView(); if (view === "library") renderLibrary($("#chunkSearch")?.value || ""); if (view === "speaking") renderSpeaking(); show(view); location.hash = view === "home" ? "" : view; document.title = "Chunk Lab — English Practice"; }));
    $("#againButton").addEventListener("click", () => start(session.sourceMode)); $("#chunkSearch").addEventListener("input", (event) => renderLibrary(event.target.value));
    $("#resetButton").addEventListener("click", () => { if (confirm("Reset all scores and personalized review data on this device?")) { progress = defaultProgress(); saveProgress(); updateDashboard(); updateProgressView(); } });
  }

  async function init() {
    bindEvents();
    try {
      selectVoice(); if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = selectVoice;
      await discoverContent();
      $("#contentStatus").textContent = `${chunks.length} learned chunks · ${registry.sessions.length} session${registry.sessions.length === 1 ? "" : "s"}`;
      $("#sourceNote").textContent = `${chunks.length} chunks · ${contentSource}`;
      $$('[data-mode]').forEach((button) => { button.disabled = false; });
      updateDashboard(); updateProgressView(); renderLibrary(); renderSpeaking();
      const requestedView = location.hash.slice(1); if (["speaking", "progress", "library"].includes(requestedView)) show(requestedView);
    } catch (error) {
      $("#contentStatus").textContent = "Content could not be loaded"; $("#sourceNote").textContent = error.message; console.error(error, registry.errors);
    }
  }

  init();
})();
