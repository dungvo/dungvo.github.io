(() => {
  "use strict";
  const root = document.getElementById("careerPath");
  const key = "chunkLabCareerPathV1";
  const units = [
  [
    "Everyday conversation",
    "Talk about your day and recover when you miss a detail.",
    "Tell a new colleague about your morning, then ask them to repeat a detail.",
    [
      [
        "Talk about your routine",
        "I usually start by",
        "I usually start by making coffee.",
        "Do you check email first?",
        "No, I usually start by making coffee. I check email after breakfast.",
        "What does the speaker do first?",
        "Make coffee",
        "Check email",
        "Describe the first two things you do in the morning."
      ],
      [
        "Ask someone to repeat",
        "I didn’t catch",
        "I didn’t catch the last part.",
        "We’re meeting outside the café at half past seven.",
        "I didn’t catch the time. Could you say it again?",
        "What did the listener miss?",
        "The time",
        "The location",
        "Ask someone to repeat a time you missed."
      ],
      [
        "Make small talk",
        "How was your",
        "How was your weekend?",
        "How was your weekend?",
        "Pretty good. We went for a walk on Sunday.",
        "When did they go for a walk?",
        "Sunday",
        "Saturday",
        "Ask about a colleague’s weekend and share one thing you did."
      ]
    ]
  ],
  [
    "Work with colleagues",
    "Clarify requests, give updates, and confirm who does what.",
    "Give a brief stand-up update, clarify a request, and confirm the owner and deadline.",
    [
      [
        "Clarify a request",
        "Just to confirm",
        "Just to confirm, do you mean the submission date or the payment date?",
        "Could you send me last month’s claims?",
        "Just to confirm, which date should I use? Use the submission date, please.",
        "Which date should you use?",
        "Submission date",
        "Payment date",
        "Ask which date and claim statuses should be included."
      ],
      [
        "Give a work update",
        "I’m still working on",
        "I’m still working on the data checks.",
        "Will the report be ready before lunch?",
        "I’m still working on the data checks. I’ll send it this afternoon.",
        "When will they send the report?",
        "This afternoon",
        "Before lunch",
        "Say what you finished, what is pending, and when you’ll update the team."
      ],
      [
        "Confirm the next action",
        "I’ll take care of",
        "I’ll take care of the follow-up.",
        "Can you follow up with the data team?",
        "I’ll take care of the follow-up. I’ll message them before three.",
        "When will the speaker contact the team?",
        "Before three",
        "After three",
        "Confirm who will follow up and when."
      ]
    ]
  ],
  [
    "Explain data work",
    "Describe pipelines and data issues in plain English.",
    "Explain a delayed dashboard to a business colleague and agree on a temporary workaround.",
    [
      [
        "Describe a pipeline",
        "The data comes from",
        "The data comes from two source systems.",
        "Where does the dashboard data come from?",
        "The data comes from two source systems, and we refresh it every morning.",
        "How often is the data refreshed?",
        "Every morning",
        "Every evening",
        "Explain where your data comes from and where it goes."
      ],
      [
        "Explain a delay",
        "It’s taking longer than expected",
        "It’s taking longer than expected because the import is still running.",
        "Why hasn’t the dashboard refreshed?",
        "It’s taking longer than expected. You can use yesterday’s numbers for now.",
        "Which numbers can they use now?",
        "Yesterday’s numbers",
        "Today’s numbers",
        "Explain a delay and offer a workaround."
      ],
      [
        "Hand over an incident",
        "Could you let me know",
        "Could you let me know if the retry fails again?",
        "The retry starts at six. Who should watch it?",
        "I can watch it. Could you let me know if the retry fails again?",
        "Which event needs a notification?",
        "Another retry failure",
        "A successful retry",
        "Hand over a failed job and specify when to notify you."
      ]
    ]
  ],
  [
    "Work with business teams",
    "Clarify definitions, scope, and reporting metrics.",
    "Confirm a claims request covering date, status, and output format.",
    [
      [
        "Confirm reporting scope",
        "Do you want to include",
        "Do you want to include claims that are still open?",
        "Please send me the claims submitted in October.",
        "Do you want to include claims that are still open? Yes, include every status.",
        "Which statuses should be included?",
        "Every status",
        "Closed claims only",
        "Confirm the date field and statuses for a claims extract."
      ],
      [
        "Explain a metric",
        "The main reason is",
        "The main reason is that some customers have more than one policy.",
        "Why are there more policies than customers?",
        "The main reason is that some customers have more than one policy. Use unique customer IDs for the customer count.",
        "What should you count for the customer metric?",
        "Unique customer IDs",
        "Policy IDs",
        "Explain the difference between counting policies and counting customers."
      ],
      [
        "Agree on a deliverable",
        "I’ll send a sample first",
        "I’ll send a sample first so you can check the columns.",
        "Do you need a summary or one row per claim?",
        "One row per claim. I’ll send a sample first so you can check the columns.",
        "What format do they agree on?",
        "One row per claim",
        "One row per status",
        "Confirm the output format and propose a sample for review."
      ]
    ]
  ],
  [
    "Handle technical interviews",
    "Tell a project story and explain design trade-offs.",
    "Explain how you detected updates with unreliable timestamps and defend your approach.",
    [
      [
        "Tell a project story",
        "One example that comes to mind",
        "One example that comes to mind is a pipeline migration.",
        "Tell me about a difficult project.",
        "One example that comes to mind is a pipeline migration. We moved active accounts first.",
        "What did they move first?",
        "Active accounts",
        "Historical accounts",
        "Describe a project, your role, and the result."
      ],
      [
        "Explain a trade-off",
        "The main trade-off was",
        "The main trade-off was speed versus completeness.",
        "Why did you compare only recent records?",
        "The main trade-off was speed versus completeness. We checked older records once a month.",
        "How often did they check older records?",
        "Monthly",
        "Daily",
        "Explain what you gained and what you gave up in a design decision."
      ],
      [
        "Answer a follow-up",
        "We validated it by",
        "We validated it by comparing counts and checking a sample.",
        "How did you know the migration worked?",
        "We validated it by comparing counts and checking a sample against the source.",
        "What did they compare the sample against?",
        "The source system",
        "A dashboard mockup",
        "Explain two checks you used to validate a release."
      ]
    ]
  ],
  [
    "Lead technical discussions",
    "Present options, recommend a decision, and respond to pushback.",
    "Give a two-minute recommendation, explain a trade-off, and respond to a stakeholder objection.",
    [
      [
        "Compare two options",
        "One option would be",
        "One option would be to phase the rollout.",
        "Can we switch every team on Monday?",
        "One option would be to phase the rollout. We could start with a single team.",
        "How many teams would start in the proposed rollout?",
        "One",
        "All teams",
        "Present two options and explain who is affected."
      ],
      [
        "Recommend a decision",
        "I’d recommend",
        "I’d recommend starting with a small pilot.",
        "Which approach do you recommend?",
        "I’d recommend starting with a small pilot. We can expand once the metrics are stable.",
        "When would they expand the pilot?",
        "Once metrics are stable",
        "Immediately",
        "Give a recommendation and state the condition for expanding it."
      ],
      [
        "Respond to pushback",
        "I see your point",
        "I see your point. Could we test the impact first?",
        "A pilot could slow down the release.",
        "I see your point. Could we test the impact first? We can time-box the pilot to one week.",
        "How long would the pilot last?",
        "One week",
        "One month",
        "Acknowledge a concern and suggest a practical next step."
      ]
    ]
  ]
];
  const day = 86400000;
  const intervals = [1, 3, 7, 14, 30];
  const steps = ["Review", "Learn", "Listen", "Speak"];
  const fresh = () => ({ lessons: {}, challenges: {}, cards: {}, active: null });
  let state = fresh();
  let storageError = false;
  try { state = JSON.parse(localStorage.getItem(key)) || state; } catch { storageError = true; }
  const id = (unit, lesson) => unit + ":" + lesson;
  const complete = (unit, lesson) => state.lessons[id(unit, lesson)] === true;
  const unitDone = unit => state.challenges[unit] === true;
  const count = unit => units[unit][3].filter((_, lesson) => complete(unit, lesson)).length;
  const unlocked = unit => unit === 0 || unitDone(unit - 1);
  const due = () => Object.entries(state.cards).filter(([, card]) => card.due <= Date.now()).sort((a, b) => a[1].due - b[1].due);
  const lessonFor = key => { const [unit, lesson] = key.split(":").map(Number); return units[unit][3][lesson]; };
  const esc = text => String(text).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  let mode = "path";
  let selectedUnit = null;
  let chosen = null;
  let reviewRevealed = false;
  let status = "";
  let listeningRevealed = false;

  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); storageError = false; }
    catch { storageError = true; }
  }

  function schedule(key, recalled) {
    const card = state.cards[key];
    const index = recalled ? Math.min(card.index + 1, intervals.length - 1) : 0;
    state.cards[key] = { index, due: Date.now() + intervals[index] * day };
  }

  function button(label, action, extra = "", primary = true) {
    return `<button type="button" class="${primary ? "primary" : "secondary"}" data-career-action="${action}" ${extra}>${label}</button>`;
  }

  function renderPath() {
    const current = units.findIndex((_, unit) => !unitDone(unit));
    return `<h1>Career Path</h1><p>From everyday English to leading technical discussions.</p>
      ${due().length ? button("Review " + due().length + (due().length === 1 ? " phrase" : " phrases"), "review", 'id="careerReview"', false) : ""}
      <ol class="career-track">${units.map(([title, goal], unit) => {
        const done = unitDone(unit);
        const canOpen = unlocked(unit);
        const active = state.active?.unit === unit;
        return `<li class="${unit === current ? "career-current" : ""}">
          <span class="career-marker" aria-hidden="true">${done ? "✓" : unit + 1}</span>
          <div><h2>${esc(title)}</h2><p>${esc(goal)}</p>
          <small>${done ? "Stage complete" : canOpen ? count(unit) + " of 3 lessons complete" : "Complete the previous stage to unlock"}</small>
          ${canOpen ? button(active ? "Continue lesson" : done ? "Revisit stage" : "Open stage", active ? "resume" : "unit", 'data-unit="' + unit + '"', unit === current) : ""}</div></li>`;
      }).join("")}</ol>`;
  }

  function renderUnit() {
    const [title, goal, , lessons] = units[selectedUnit];
    return `<h1>${esc(title)}</h1><p>${esc(goal)}</p><ol class="career-lessons">${lessons.map((lesson, index) =>
      `<li><strong>${esc(lesson[0])}</strong>${button(complete(selectedUnit,index) ? "Practise again" : "Start lesson", "lesson", 'data-lesson="' + index + '"', !complete(selectedUnit,index))}</li>`
    ).join("")}</ol>${count(selectedUnit) === 3 ? button(unitDone(selectedUnit) ? "Repeat speaking challenge" : "Start speaking challenge", "challenge") : "<p>Complete the three lessons to open the speaking challenge.</p>"}`;
  }

  function renderReview(cardId) {
    const [title, phrase, example, , , , , , speaking] = lessonFor(cardId);
    return `<h2>Review · ${esc(title)}</h2><p>${esc(speaking)}</p>${reviewRevealed
      ? `<p><strong>${esc(phrase)}</strong></p><p>${esc(example)}</p><div class="career-actions">${button("I recalled it", "recall")}${button("I needed help", "help", "", false)}</div>`
      : button("Reveal phrase", "reveal-review")}`;
  }

  function renderLesson() {
    const { unit, lesson, step, review } = state.active;
    const [title, phrase, example, first, second, question, correct, wrong, speaking] = units[unit][3][lesson];
    let content;
    if (step === 0) content = review.length ? renderReview(review[0]) : `<h2>No phrases due</h2>${button("Start learning", "next")}`;
    if (step === 1) content = `<h2>${esc(phrase)}</h2><p>${esc(example)}</p><div class="career-actions">${button("Play example", "play-example", "", false)}${button("Continue to Listen", "next")}</div>`;
    if (step === 2) {
      const options = lesson % 2 === 0 ? [correct, wrong] : [wrong, correct];
      content = `<div class="career-actions">${button("▶ Play dialogue", "play-dialogue", "", false)}${button("Play slowly", "play-slow", "", false)}</div>
        <h2>${esc(question)}</h2><div class="career-options">${options.map((option, index) => button(esc(option), "choose", 'data-option="' + index + '" aria-pressed="' + (chosen === index) + '"', false)).join("")}</div>
        <p role="status">${esc(status)}</p>
        ${listeningRevealed ? `<p>${esc(first)}<br>${esc(second)}</p>` : button("Show transcript", "show-transcript", "", false)}
        <div class="career-actions">${button("Check answer", "check", chosen === null ? "disabled" : "")}</div>`;
    }
    if (step === 3) content = `<h2>Say it aloud</h2><p>${esc(speaking)}</p><p>Try it from memory, then choose how it went.</p><div class="career-actions">${button("I said it from memory", "finish")}${button("I practised with help", "finish-help", "", false)}</div>`;
    return `<p class="career-eyebrow">${esc(units[unit][0])}</p><h1>${esc(title)}</h1><ol class="career-steps">${steps.map((label, index) => `<li ${step === index ? 'aria-current="step"' : ""}>${label}</li>`).join("")}</ol>${content}`;
  }

  function render() {
    const reviewId = mode === "review" ? due()[0]?.[0] : null;
    let content;
    if (mode === "path") content = renderPath();
    if (mode === "unit") content = renderUnit();
    if (mode === "lesson") content = renderLesson();
    if (mode === "review") content = reviewId ? renderReview(reviewId) : "<h1>Review complete</h1><p>You’ve finished the phrases due today.</p>";
    if (mode === "challenge") content = `<h1>${esc(units[selectedUnit][0])} · Speaking challenge</h1><p>${esc(units[selectedUnit][2])}</p><p>Speak aloud and check that you covered each part of the prompt.</p>${button("Mark challenge complete", "finish-challenge")}`;
    root.innerHTML = `${mode !== "path" ? button("← Career Path", "back", "", false) : ""}<div class="career-content">${content}</div>${storageError ? '<p role="status">Progress cannot be saved in this browser.</p>' : ""}`;
  }

  function play(lines, rate) {
    if (!("speechSynthesis" in window)) { status = "Audio is unavailable here. You can show the transcript."; render(); return; }
    speechSynthesis.cancel();
    const voices = speechSynthesis.getVoices().filter(voice => /^en[-_]/i.test(voice.lang));
    lines.forEach((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voices.length) utterance.voice = voices[index % voices.length];
      utterance.lang = utterance.voice?.lang || "en-US";
      utterance.rate = rate;
      utterance.onerror = event => { if (!["canceled", "interrupted"].includes(event.error)) { status = "Audio couldn’t play. You can show the transcript."; if (mode === "lesson" && state.active?.step === 2) render(); } };
      speechSynthesis.speak(utterance);
    });
  }

  root.addEventListener("click", event => {
    const control = event.target.closest("[data-career-action]");
    if (!control) return;
    const action = control.dataset.careerAction;
    const active = state.active;
    const lesson = active && units[active.unit][3][active.lesson];
    if (action === "play-example") return play([lesson[2]], .88);
    if (action === "play-dialogue" || action === "play-slow") return play(lesson.slice(3, 5), action === "play-slow" ? .72 : .94);

    if (action === "back") { mode = "path"; window.speechSynthesis?.cancel(); }
    if (action === "unit") { selectedUnit = Number(control.dataset.unit); mode = "unit"; }
    if (action === "resume") { selectedUnit = active.unit; mode = "lesson"; }
    if (action === "review") { mode = "review"; reviewRevealed = false; }
    if (action === "lesson") {
      const lessonIndex = Number(control.dataset.lesson);
      state.active = { unit: selectedUnit, lesson: lessonIndex, step: 0, review: due().slice(0, 3).map(([key]) => key) };
      chosen = null; status = ""; listeningRevealed = false; reviewRevealed = false;
      mode = "lesson";
    }
    if (action === "reveal-review") reviewRevealed = true;
    if (action === "recall" || action === "help") {
      const key = mode === "review" ? due()[0]?.[0] : active.review.shift();
      if (key) schedule(key, action === "recall");
      reviewRevealed = false;
      if (mode === "lesson" && !active.review.length) active.step = 1;
    }
    if (action === "next") active.step++;
    if (action === "choose") { chosen = Number(control.dataset.option); status = ""; }
    if (action === "show-transcript") { listeningRevealed = true; active.assisted = true; }
    if (action === "check") {
      if (chosen === active.lesson % 2) { active.step = 3; window.speechSynthesis?.cancel(); }
      else { status = "Listen again and try another answer."; active.assisted = true; }
    }
    if (action === "finish" || action === "finish-help") {
      const key = id(active.unit, active.lesson);
      state.lessons[key] = true;
      if (!state.cards[key] || active.assisted || action === "finish-help") {
        state.cards[key] = { index: 0, due: Date.now() + day };
      }
      selectedUnit = active.unit;
      state.active = null;
      mode = "unit";
    }
    if (action === "challenge") mode = "challenge";
    if (action === "finish-challenge") { state.challenges[selectedUnit] = true; mode = "path"; }
    save();
    render();
    const focusTarget = action === "choose" ? root.querySelector("[aria-pressed=true]") : root.querySelector("h1, h2");
    if (focusTarget) { if (action !== "choose") focusTarget.tabIndex = -1; focusTarget.focus(); }
  });

  document.addEventListener("chunklab:reset", () => {
    state = fresh();
    mode = "path";
    save();
    render();
  });
  render();
})();
