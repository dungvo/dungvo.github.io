(() => {
  "use strict";

  const lessons = window.SentenceLabLessons || [];
  const list = document.querySelector("#sentenceLessonList");
  const workspace = document.querySelector("#sentenceWorkspace");
  if (!list || !workspace || !lessons.length) return;

  const KEY = "sentenceLabProgressV1";
  let progress = loadProgress();
  let activeLesson = lessons[0];
  let stage = 0;
  let answerTokens = [];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const normalize = (value) => String(value || "").toLowerCase().replace(/[“”"'.:;!?()[\]]/g, "").replace(/\s+/g, " ").trim();

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; }
  }
  function saveProgress() { localStorage.setItem(KEY, JSON.stringify(progress)); }
  function lessonProgress(id) { return { completed: false, bestStage: 0, ...progress[id] }; }
  function markStage() {
    const saved = lessonProgress(activeLesson.id);
    saved.bestStage = Math.max(saved.bestStage, stage + 1);
    if (stage === 6) saved.completed = true;
    progress[activeLesson.id] = saved; saveProgress(); renderLessonList();
  }

  function sceneSvg(type) {
    if (type === "health") return `<svg viewBox="0 0 260 150" role="img" aria-label="Health guidance connecting care, movement, food and mental well-being"><circle cx="130" cy="75" r="36"/><path d="M130 53v44M108 75h44M45 35h34v28H45zM181 35h34v28h-34zM45 91h34v28H45zM181 91h34v28h-34zM79 49l25 14M181 49l-25 14M79 105l25-16M181 105l-25-16"/><path d="M55 49h14M198 42c-11 8-11 17 0 25 11-8 11-17 0-25M53 105c8-15 17-15 25 0M191 105h14m-7-7v14"/></svg>`;
    if (type === "devices") return `<svg viewBox="0 0 260 150" role="img" aria-label="A conversation synchronizes across a phone, laptop and watch"><rect x="25" y="35" width="45" height="78" rx="8"/><rect x="99" y="33" width="93" height="63" rx="6"/><path d="M88 112h115l-11-16H99z"/><rect x="215" y="51" width="28" height="45" rx="10"/><path d="M70 58c17-17 28-20 43-19M192 58c12-3 16 0 23 7M112 75c-18 17-28 20-42 18M215 82c-12 4-16 1-23-6"/><path d="M105 35l8 4-5 8M79 88l-9 5 7 8M208 60l7 5-6 7M199 80l-7-4 5-8"/></svg>`;
    return `<svg viewBox="0 0 260 150" role="img" aria-label="A leader sends a message that acknowledges impact, explains context and gives direction"><rect x="35" y="30" width="190" height="92" rx="10"/><path d="M35 43l95 54 95-54M76 26v-9h108v9M79 64h49M79 80h35M146 64h36M146 80h24"/></svg>`;
  }

  function renderLessonList() {
    list.innerHTML = lessons.map((lesson, index) => {
      const saved = lessonProgress(lesson.id);
      return `<button class="sentence-lesson-card ${lesson.id === activeLesson.id ? "active" : ""}" data-sentence-lesson="${escapeHtml(lesson.id)}"><span>${escapeHtml(lesson.kind)}</span><strong>${escapeHtml(lesson.title)}</strong><small>${escapeHtml(lesson.source.publisher)} · ${escapeHtml(lesson.source.date)}</small><b>${saved.completed ? "Completed" : saved.bestStage ? `Step ${saved.bestStage}/7` : `${lesson.minutes} min`} · Lesson ${index + 1}</b></button>`;
    }).join("");
    list.querySelectorAll("[data-sentence-lesson]").forEach((button) => button.addEventListener("click", () => {
      activeLesson = lessons.find((lesson) => lesson.id === button.dataset.sentenceLesson); stage = 0; answerTokens = []; renderLessonList(); renderWorkspace();
    }));
  }

  function progressHeader() {
    const names = ["Read the source", "Segment every word", "Name every unit", "Map the clauses", "Extract chunks", "Understand the article", "Listen · speak · write"];
    return `<div class="lab-progress-head"><button class="lab-back" type="button" id="labBack">← Lessons</button><div><span>STEP ${stage + 1} OF 7</span><strong>${names[stage]}</strong></div><b>${Math.round((stage + 1) / 7 * 100)}%</b></div><div class="lab-progress"><span style="width:${(stage + 1) / 7 * 100}%"></span></div>`;
  }

  function sourceHeader() {
    const lesson = activeLesson;
    return `<div class="lab-source"><div><span>${escapeHtml(lesson.kind)} · ${escapeHtml(lesson.level)} · ${lesson.minutes} min</span><h2>${escapeHtml(lesson.title)}</h2><p>${escapeHtml(lesson.source.note)}</p></div>${sceneSvg(lesson.visual)}</div><a class="lab-source-link" href="${escapeHtml(lesson.source.url)}" target="_blank" rel="noopener">Read the original: ${escapeHtml(lesson.source.originalTitle)} ↗</a>`;
  }

  function readingStage() {
    const lesson = activeLesson;
    return `${sourceHeader()}<section class="lab-passage"><div class="lab-reading-actions"><button class="secondary" id="listenArticle">▶ Listen to the learning passage</button><span>English first. Open vocabulary only when it blocks the event.</span></div>${lesson.paragraphs.map((paragraph, index) => `<article><span>P${index + 1}</span><p>${escapeHtml(paragraph)}</p></article>`).join("")}</section><section class="lab-stage-note"><strong>Your task</strong><p>Read once for the event. Who or what is acting? What changes? Do not analyze every word yet.</p></section>`;
  }

  function segmentationStage() {
    const focus = activeLesson.focus;
    const words = focus.sentence.match(/[\w’'-]+|[^\s\w]/g) || [];
    return `${sourceHeader()}<p class="lab-step-label">FOCUS SENTENCE</p><div class="lab-focus-sentence">${escapeHtml(focus.sentence)}</div><p class="lab-instruction">Account for every word. Click tokens in order and insert a boundary where one smallest useful unit ends.</p><div class="lab-word-bank">${words.map((word, index) => `<button type="button" data-token="${index}">${escapeHtml(word)}</button>`).join("")}</div><div class="lab-builder-tools"><span>Insert boundary</span><button type="button" data-boundary=" | ">|</button><button type="button" data-boundary=", ">comma</button><button type="button" data-boundary="\n">new line</button><button type="button" id="labUndo">Undo</button><button type="button" id="labClear">Clear</button></div><textarea id="labAnswer" rows="5" placeholder="Click the words or type your own answer. | comma and new line are accepted."></textarea>`;
  }

  function classificationStage() {
    const choices = ["Noun phrase", "Pronoun phrase", "Finite verb phrase", "Non-finite verb phrase", "Preposition phrase", "Linking word", "Linking question word", "Adjective phrase"];
    return `${sourceHeader()}<p class="lab-step-label">YOUR SEGMENTS ARE NOW THE EVIDENCE</p><div class="lab-classification">${activeLesson.focus.segments.map((segment, index) => `<div class="lab-class-row"><div><strong>${escapeHtml(segment.text)}</strong><span>${escapeHtml(segment.role)}</span></div><select data-segment-type="${index}" aria-label="Classify ${escapeHtml(segment.text)}"><option value="">Choose a type…</option>${choices.map((choice) => `<option>${choice}</option>`).join("")}</select><button type="button" class="lab-vocab-button" data-vocab="${index}">Meaning?</button></div>`).join("")}</div><div id="labVocab" class="lab-vocab" hidden></div>`;
  }

  function clauseStage() {
    return `${sourceHeader()}<p class="lab-step-label">WRITE THE HIERARCHY</p><div class="lab-focus-sentence">${escapeHtml(activeLesson.focus.sentence)}</div><div class="lab-form-grid"><label>Main clause<textarea id="mainClause" rows="3" placeholder="Write the structural main clause"></textarea></label><label>Dependent or embedded unit<textarea id="dependentClause" rows="3" placeholder="Write the dependent unit"></textarea></label><label>Linking word<input id="clauseLinker" placeholder="Which word opens or connects it?"></label><label>Relationship<input id="clauseRelation" placeholder="content, time, cause, result…"></label></div>`;
  }

  function chunkStage() {
    const focus = activeLesson.focus;
    return `${sourceHeader()}<p class="lab-step-label">FROM STRUCTURE TO REUSABLE LANGUAGE</p><div class="lab-focus-sentence">${escapeHtml(focus.sentence)}</div><p class="lab-instruction">Write at least two reusable chunks. Keep stable words together and show an open slot with “+ …” when appropriate.</p><textarea id="labAnswer" rows="5" placeholder="One chunk per line"></textarea><div class="lab-substitution"><strong>Substitution test</strong><p>Would the same pattern survive when the person, object, time or situation changes?</p></div>`;
  }

  function comprehensionStage() {
    const lesson = activeLesson;
    const questions = [...lesson.paragraphQuestions, lesson.articleQuestion];
    return `${sourceHeader()}<section class="lab-passage compact">${lesson.paragraphs.map((paragraph, index) => `<article><span>P${index + 1}</span><p>${escapeHtml(paragraph)}</p></article>`).join("")}</section><div class="lab-questions">${questions.map((question, qi) => `<fieldset data-lab-question="${qi}"><legend>${qi < lesson.paragraphQuestions.length ? `Paragraph ${Math.min(qi + 1, lesson.paragraphs.length)}` : "Whole article"}: ${escapeHtml(question.prompt)}</legend>${question.options.map((option, oi) => `<label><input type="radio" name="lab-q-${qi}" value="${oi}"><span>${escapeHtml(option)}</span></label>`).join("")}<p class="lab-question-feedback" hidden></p></fieldset>`).join("")}</div>`;
  }

  function transferStage() {
    const lesson = activeLesson;
    return `${sourceHeader()}<div class="lab-transfer-grid"><section><p class="lab-step-label">LISTEN</p><h3>Hear the structure you analyzed</h3><p>Listen without reading once. Then listen again and pause at the boundaries you found.</p><button class="secondary" id="listenFocus">▶ Play focus sentence</button></section><section><p class="lab-step-label">SPEAK</p><h3>Reconstruct the message</h3><p>${escapeHtml(lesson.speaking)}</p><button class="secondary" id="showSpeakingPlan">Show required ideas</button><div id="speakingPlan" hidden>Actor → main event → evidence/detail → limitation or next step</div></section><section class="wide"><p class="lab-step-label">WRITE</p><h3>Produce meaning without copying</h3><p>${escapeHtml(lesson.writing)}</p><textarea id="labWriting" rows="6" placeholder="Write your response here…">${escapeHtml(lessonProgress(lesson.id).writing || "")}</textarea><button class="primary" id="saveLabWriting">Save on this device</button><span id="writingStatus"></span></section></div><details class="lab-tutor" open><summary>Tutor analysis</summary><div><section><strong>English</strong><p>${escapeHtml(lesson.tutor.en)}</p></section><section><strong>Tiếng Việt</strong><p>${escapeHtml(lesson.tutor.vi)}</p></section></div></details>`;
  }

  function stageBody() {
    return [readingStage, segmentationStage, classificationStage, clauseStage, chunkStage, comprehensionStage, transferStage][stage]();
  }

  function renderWorkspace() {
    workspace.innerHTML = `${progressHeader()}<div class="lab-stage-body">${stageBody()}</div><div class="lab-check-row"><button class="secondary" id="previousLabStep" ${stage === 0 ? "disabled" : ""}>← Previous step</button><button class="primary" id="checkLabStep">${stage === 0 ? "I understand the event" : stage === 6 ? "Complete lesson" : "Check my answer"}</button><button class="secondary" id="labHint">Show one clue</button><button class="secondary" id="nextLabStep" disabled>Next step →</button><button class="lab-force" id="forceLabStep">Skip this step</button></div><div id="labFeedback" class="lab-feedback" aria-live="polite"><strong>Try first.</strong><span>The next step unlocks only after a correct answer. Skip remains available.</span></div><div id="labComparison" class="lab-comparison" hidden></div>`;
    bindStageEvents();
  }

  function speak(text, rate = 0.9) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.rate = rate; speechSynthesis.speak(utterance);
  }

  function parseSegments(value) {
    const raw = String(value || "");
    const separator = raw.includes("|") || raw.includes("\n") ? /\s*(?:\||\n)\s*/ : /\s*,\s*/;
    return raw.split(separator).map(normalize).filter(Boolean);
  }

  function showResult(correct, learner, prepared, explanation = "") {
    const feedback = workspace.querySelector("#labFeedback");
    feedback.className = `lab-feedback ${correct ? "correct" : "incorrect"}`;
    feedback.innerHTML = correct ? `<strong>Correct.</strong><span>${escapeHtml(explanation || "Your analysis matches the prepared structure.")}</span>` : `<strong>Not correct yet.</strong><span>Compare the two analyses, revise your answer, and check again—or use Skip this step.</span>`;
    const comparison = workspace.querySelector("#labComparison");
    comparison.hidden = false;
    comparison.innerHTML = `<section><strong>Your answer</strong><pre>${escapeHtml(learner || "(empty)")}</pre></section><section><strong>Prepared analysis</strong><pre>${escapeHtml(prepared)}</pre></section>`;
    workspace.querySelector("#nextLabStep").disabled = !correct;
    if (correct) markStage();
  }

  function checkStage() {
    const focus = activeLesson.focus;
    if (stage === 0) { showResult(true, "I can identify the event before parsing.", focus.meaning, "Good. Now prove the picture by analyzing the sentence."); return; }
    if (stage === 1) {
      const learner = workspace.querySelector("#labAnswer").value;
      const actual = parseSegments(learner); const expected = focus.segments.map((segment) => normalize(segment.text));
      const correct = actual.length === expected.length && actual.every((segment, index) => segment === expected[index]);
      showResult(correct, learner, focus.segments.map((segment) => `[${segment.text}]`).join(" "), "Every word is accounted for and every boundary matches."); return;
    }
    if (stage === 2) {
      const selects = [...workspace.querySelectorAll("[data-segment-type]")];
      const learner = selects.map((select, index) => `${focus.segments[index].text} = ${select.value || "?"}`).join("\n");
      const correct = selects.every((select, index) => select.value === focus.segments[index].type);
      showResult(correct, learner, focus.segments.map((segment) => `${segment.text} = ${segment.type} (${segment.role})`).join("\n")); return;
    }
    if (stage === 3) {
      const learnerMain = workspace.querySelector("#mainClause").value, learnerDependent = workspace.querySelector("#dependentClause").value, learnerLinker = workspace.querySelector("#clauseLinker").value, learnerRelation = workspace.querySelector("#clauseRelation").value;
      const correct = normalize(learnerMain).includes(normalize(focus.mainClause)) && normalize(learnerDependent).includes(normalize(focus.dependentClause)) && normalize(learnerLinker).includes(normalize(focus.linker)) && focus.relation.split(/[ :]/).some((word) => word.length > 4 && normalize(learnerRelation).includes(normalize(word)));
      showResult(correct, `MAIN: ${learnerMain}\nDEPENDENT: ${learnerDependent}\nLINKER: ${learnerLinker}\nRELATION: ${learnerRelation}`, `MAIN: ${focus.mainClause}\nDEPENDENT: ${focus.dependentClause}\nLINKER: ${focus.linker}\nRELATION: ${focus.relation}`); return;
    }
    if (stage === 4) {
      const learner = workspace.querySelector("#labAnswer").value; const value = normalize(learner);
      const matched = focus.chunks.filter((chunk) => value.includes(normalize(chunk).replace(/\s*\+\s*(something|limit|planned event|clause|\.{3})?/g, "").trim()));
      showResult(matched.length >= 2, learner, focus.chunks.join("\n"), matched.length >= 2 ? "You found at least two reusable patterns." : "Find at least two stable patterns, not only adjacent words."); return;
    }
    if (stage === 5) {
      const questions = [...activeLesson.paragraphQuestions, activeLesson.articleQuestion]; let correctCount = 0;
      questions.forEach((question, index) => {
        const fieldset = workspace.querySelector(`[data-lab-question="${index}"]`); const selected = fieldset.querySelector("input:checked"); const result = fieldset.querySelector(".lab-question-feedback");
        const correct = Number(selected?.value) === question.answer; if (correct) correctCount += 1;
        result.hidden = false; result.textContent = `${correct ? "Correct. " : "Not yet. "}${question.explanation}`;
        fieldset.classList.toggle("correct", correct); fieldset.classList.toggle("incorrect", !correct);
      });
      showResult(correctCount === questions.length, `${correctCount}/${questions.length} correct`, questions.map((q) => q.options[q.answer]).join("\n"), "You preserved the meaning of each paragraph and the whole article."); return;
    }
    markStage(); showResult(true, "Listening, speaking and writing practice complete", activeLesson.focus.meaning, "Lesson complete. Return later and try the same structure without the prepared analysis.");
  }

  function bindStageEvents() {
    workspace.querySelector("#labBack").addEventListener("click", () => list.scrollIntoView({ behavior: "smooth", block: "start" }));
    workspace.querySelector("#previousLabStep").addEventListener("click", () => { if (stage > 0) { stage -= 1; answerTokens = []; renderWorkspace(); workspace.scrollIntoView({ behavior: "smooth", block: "start" }); } });
    workspace.querySelector("#checkLabStep").addEventListener("click", checkStage);
    workspace.querySelector("#nextLabStep").addEventListener("click", () => { if (stage < 6) { stage += 1; answerTokens = []; renderWorkspace(); workspace.scrollIntoView({ behavior: "smooth", block: "start" }); } });
    workspace.querySelector("#forceLabStep").addEventListener("click", () => { if (stage < 6) { stage += 1; answerTokens = []; renderWorkspace(); workspace.scrollIntoView({ behavior: "smooth", block: "start" }); } });
    workspace.querySelector("#labHint").addEventListener("click", () => {
      const hints = ["Name the actor and the change before looking at details.", "Use determiners, finite verbs and linkers as anchors—but account for every remaining word.", "A unit’s type and its role are different: a noun phrase can be a subject or object.", `The prepared linker is “${activeLesson.focus.linker}”. Test whether each clause can stand alone.`, "Change the people, objects or situation. Keep the words that preserve the same function.", "Track what each paragraph adds: event, evidence, explanation, qualification or next step.", "Say the meaning without copying the source sentence."];
      const feedback = workspace.querySelector("#labFeedback"); feedback.className = "lab-feedback"; feedback.innerHTML = `<strong>One clue</strong><span>${escapeHtml(hints[stage])}</span>`;
    });
    workspace.querySelector("#listenArticle")?.addEventListener("click", () => speak(activeLesson.paragraphs.join(" "), 0.88));
    workspace.querySelector("#listenFocus")?.addEventListener("click", () => speak(activeLesson.focus.sentence, 0.88));
    workspace.querySelector("#showSpeakingPlan")?.addEventListener("click", () => { workspace.querySelector("#speakingPlan").hidden = false; });
    workspace.querySelector("#saveLabWriting")?.addEventListener("click", () => { const saved = lessonProgress(activeLesson.id); saved.writing = workspace.querySelector("#labWriting").value; progress[activeLesson.id] = saved; saveProgress(); workspace.querySelector("#writingStatus").textContent = "Saved on this device."; });
    workspace.querySelectorAll("[data-vocab]").forEach((button) => button.addEventListener("click", () => {
      const segment = activeLesson.focus.segments[Number(button.dataset.vocab)]; const box = workspace.querySelector("#labVocab"); box.hidden = false; box.innerHTML = `<strong>${escapeHtml(segment.text)}</strong><p>${escapeHtml(segment.clue)}</p><button class="text-button" type="button" id="showVietnamese">Show Vietnamese</button><p id="vietnameseMeaning" hidden>${escapeHtml(segment.vi)}</p>`; box.querySelector("#showVietnamese").addEventListener("click", () => { box.querySelector("#vietnameseMeaning").hidden = false; });
    }));
    if (stage === 1) {
      const answer = workspace.querySelector("#labAnswer");
      workspace.querySelectorAll("[data-token]").forEach((button) => button.addEventListener("click", () => { if (button.disabled) return; const token = button.textContent; answer.value += `${answer.value && !/[\s|,]$/.test(answer.value) ? " " : ""}${token}`; button.disabled = true; answerTokens.push({ token, button }); }));
      workspace.querySelectorAll("[data-boundary]").forEach((button) => button.addEventListener("click", () => { answer.value += button.dataset.boundary; answerTokens.push({ token: button.dataset.boundary }); }));
      workspace.querySelector("#labUndo")?.addEventListener("click", () => { const last = answerTokens.pop(); if (!last) return; answer.value = answer.value.slice(0, -last.token.length); if (last.button) last.button.disabled = false; });
      workspace.querySelector("#labClear")?.addEventListener("click", () => { answer.value = ""; answerTokens = []; workspace.querySelectorAll("[data-token]").forEach((button) => { button.disabled = false; }); });
    }
  }

  renderLessonList(); renderWorkspace();
})();
