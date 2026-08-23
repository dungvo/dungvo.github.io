(() => {
  "use strict";

  const LIBRARY_BASE = new URL("../perspective-library/vi/", window.location.href);
  const REVIEW_KEY = "selflo.content-preview.reviews.v1";
  const READER_KEY = "selflo.content-preview.reader.v1";

  const defaultReaderPreferences = { font: "serif", size: 18, theme: "paper", bookmarked: {} };
  const savedReaderPreferences = readJSON(READER_KEY, defaultReaderPreferences);

  const state = {
    manifest: null,
    quotes: [],
    stories: new Map(),
    descriptors: new Map(),
    selectedQuoteID: null,
    view: "canvas",
    reviews: readJSON(REVIEW_KEY, {}),
    reader: {
      ...defaultReaderPreferences,
      ...savedReaderPreferences,
      bookmarked: savedReaderPreferences.bookmarked || {}
    }
  };

  const el = Object.fromEntries([
    "statusDot", "loadStatus", "reloadButton", "exportButton", "quoteCount", "libraryRevision",
    "contentVersion", "storyCoverage", "contentList", "selectedTheme", "selectedReadingTime",
    "canvasScreen", "readerScreen", "quoteCard", "quoteKind", "quoteSource", "quoteTitle",
    "quoteText", "quoteSubtitle", "quoteTags", "openReaderButton", "closeReaderButton",
    "readerContextTitle", "bookmarkButton", "readerSettingsButton", "readerSettings", "fontChoices",
    "fontSize", "themeChoices", "readerScroll", "readerProgressBar", "storyStyle", "storyTitle",
    "storySubtitle", "storyReadingTime", "storySectionCount", "storyHero", "storySections",
    "takeawayTitle", "takeawayText", "sectionIndicator", "factQuoteID", "factStoryID",
    "factLifecycle", "factRights", "decisionChoices", "reviewNote", "openQuoteJSON",
    "openStoryJSON", "contentItemTemplate", "toast"
  ].map(id => [id, document.getElementById(id)]));

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindEvents();
    applyReaderPreferences();
    await loadLibrary();
  }

  function bindEvents() {
    el.reloadButton.addEventListener("click", loadLibrary);
    el.exportButton.addEventListener("click", exportReviews);
    el.openReaderButton.addEventListener("click", () => setView("reader"));
    el.closeReaderButton.addEventListener("click", () => setView("canvas"));
    el.readerSettingsButton.addEventListener("click", () => {
      el.readerSettings.hidden = !el.readerSettings.hidden;
    });
    el.bookmarkButton.addEventListener("click", toggleBookmark);
    el.readerScroll.addEventListener("scroll", updateReaderProgress, { passive: true });

    document.querySelectorAll("[data-view]").forEach(button => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });

    el.fontChoices.addEventListener("click", event => {
      const button = event.target.closest("button[data-font]");
      if (!button) return;
      state.reader.font = button.dataset.font;
      saveReaderPreferences();
      applyReaderPreferences();
    });

    el.fontSize.addEventListener("input", () => {
      state.reader.size = Number(el.fontSize.value);
      saveReaderPreferences();
      applyReaderPreferences();
    });

    el.themeChoices.addEventListener("click", event => {
      const button = event.target.closest("button[data-theme]");
      if (!button) return;
      state.reader.theme = button.dataset.theme;
      saveReaderPreferences();
      applyReaderPreferences();
    });

    el.decisionChoices.addEventListener("click", event => {
      const button = event.target.closest("button[data-decision]");
      if (!button || !state.selectedQuoteID) return;
      const review = reviewFor(state.selectedQuoteID);
      review.decision = review.decision === button.dataset.decision ? null : button.dataset.decision;
      review.updated_at = new Date().toISOString();
      persistReviews();
      renderReviewPanel();
      renderContentList();
    });

    el.reviewNote.addEventListener("input", () => {
      if (!state.selectedQuoteID) return;
      const review = reviewFor(state.selectedQuoteID);
      review.note = el.reviewNote.value;
      review.updated_at = new Date().toISOString();
      persistReviews();
    });

    document.addEventListener("click", event => {
      if (el.readerSettings.hidden) return;
      if (!el.readerSettings.contains(event.target) && !el.readerSettingsButton.contains(event.target)) {
        el.readerSettings.hidden = true;
      }
    });
  }

  async function loadLibrary() {
    setLoadState("loading", "Đang tải Library…");
    el.contentList.replaceChildren();
    try {
      const manifestURL = new URL("manifest.json", LIBRARY_BASE);
      const manifest = await fetchJSON(manifestURL);
      const descriptors = new Map(manifest.files.map(file => [file.id, file]));
      const quoteFiles = manifest.files.filter(file => file.kind === "quote_pack");
      const storyFiles = manifest.files.filter(file => file.kind === "story");

      const [quotePacks, stories] = await Promise.all([
        Promise.all(quoteFiles.map(async descriptor => ({
          descriptor,
          payload: await fetchJSON(new URL(descriptor.path, LIBRARY_BASE))
        }))),
        Promise.all(storyFiles.map(async descriptor => ({
          descriptor,
          payload: await fetchJSON(new URL(descriptor.path, LIBRARY_BASE))
        })))
      ]);

      state.manifest = manifest;
      state.descriptors = descriptors;
      state.stories = new Map(stories.map(item => [item.payload.id, { ...item.payload, __path: item.descriptor.path }]));
      state.quotes = quotePacks.flatMap(item => item.payload.quotes.map(quote => ({
        ...quote,
        __themeName: item.payload.display_name_vi,
        __packPath: item.descriptor.path
      })));

      if (!state.quotes.some(quote => quote.id === state.selectedQuoteID)) {
        state.selectedQuoteID = state.quotes[0]?.id ?? null;
      }

      renderLibrarySummary();
      renderContentList();
      renderSelection();
      setLoadState("ready", `${state.quotes.length} quote · ${state.stories.size} story · Authoring draft`);
    } catch (error) {
      console.error(error);
      setLoadState("error", "Không tải được Library");
      const message = document.createElement("div");
      message.className = "error-message";
      message.textContent = "Preview không đọc được manifest hoặc payload. Hãy kiểm tra đường dẫn và chạy qua HTTP server thay vì mở file trực tiếp.";
      el.contentList.append(message);
    }
  }

  async function fetchJSON(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
  }

  function renderLibrarySummary() {
    const storyLinks = state.quotes.filter(quote => quote.story_id && state.stories.has(quote.story_id)).length;
    el.quoteCount.textContent = String(state.quotes.length);
    el.libraryRevision.textContent = `r${state.manifest.library_revision}`;
    el.contentVersion.textContent = state.manifest.content_version;
    el.storyCoverage.textContent = state.quotes.length ? `${storyLinks}/${state.quotes.length}` : "0/0";
  }

  function renderContentList() {
    el.contentList.replaceChildren();
    state.quotes.forEach((quote, index) => {
      const story = state.stories.get(quote.story_id);
      const node = el.contentItemTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.quoteID = quote.id;
      node.dataset.review = reviewFor(quote.id).decision || "pending";
      node.classList.toggle("active", quote.id === state.selectedQuoteID);
      node.querySelector(".content-index").textContent = String(index + 1).padStart(2, "0");
      node.querySelector("strong").textContent = story?.title_vi || quote.text_vi;
      node.querySelector("small").textContent = `${quote.__themeName} · ${readingMinutes(story)} phút`;
      node.addEventListener("click", () => selectQuote(quote.id));
      el.contentList.append(node);
    });
  }

  function selectQuote(quoteID) {
    state.selectedQuoteID = quoteID;
    el.readerSettings.hidden = true;
    el.readerScroll.scrollTop = 0;
    renderContentList();
    renderSelection();
  }

  function renderSelection() {
    const quote = selectedQuote();
    if (!quote) return;
    const story = selectedStory();
    renderQuote(quote, story);
    renderStory(story);
    renderReviewPanel();
    el.selectedTheme.textContent = quote.__themeName;
    el.selectedReadingTime.textContent = story ? `${readingMinutes(story)} phút đọc` : "Chưa có story";
    updateBookmark();
    requestAnimationFrame(updateReaderProgress);
  }

  function renderQuote(quote, story) {
    el.quoteCard.dataset.style = quote.display?.style || "cool_observe";
    el.quoteKind.textContent = reflectionLabel(quote.selection?.reflection_kind);
    el.quoteSource.textContent = quote.authorship?.source_label || "Selflo";
    toggleText(el.quoteTitle, quote.title_vi);
    el.quoteText.textContent = quote.text_vi;
    toggleText(el.quoteSubtitle, quote.subtitle_vi);
    el.quoteTags.replaceChildren(...(quote.selection?.presentation_tags || []).slice(0, 3).map(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }));
    el.openReaderButton.hidden = !story;
  }

  function renderStory(story) {
    if (!story) {
      el.storyTitle.textContent = "Story chưa sẵn sàng";
      el.storySections.replaceChildren();
      return;
    }

    el.readerContextTitle.textContent = story.title_vi;
    el.storyStyle.textContent = storyStyleLabel(story.metadata?.story_style);
    el.storyTitle.textContent = story.title_vi;
    el.storySubtitle.textContent = story.subtitle_vi || "";
    el.storyReadingTime.textContent = `${readingMinutes(story)} phút đọc`;
    el.storySectionCount.textContent = `${story.sections.length} phần`;
    el.takeawayTitle.textContent = story.takeaway.title_vi;
    el.takeawayText.textContent = story.takeaway.text_vi;
    el.storyHero.replaceChildren();

    if (story.hero_image?.file_id) {
      const descriptor = state.descriptors.get(story.hero_image.file_id);
      if (descriptor) {
        const figure = document.createElement("figure");
        figure.className = "story-hero";
        const image = document.createElement("img");
        image.src = new URL(descriptor.path, LIBRARY_BASE).href;
        image.alt = story.hero_image.alt_text_vi;
        figure.append(image);
        if (story.hero_image.caption_vi) {
          const caption = document.createElement("figcaption");
          caption.textContent = story.hero_image.caption_vi;
          figure.append(caption);
        }
        el.storyHero.append(figure);
      }
    }

    const sectionNodes = story.sections.map((section, sectionIndex) => {
      const sectionElement = document.createElement("section");
      sectionElement.className = "story-section";
      sectionElement.dataset.sectionIndex = String(sectionIndex);
      if (section.title_vi) {
        const heading = document.createElement("h3");
        heading.textContent = section.title_vi;
        sectionElement.append(heading);
      }
      section.blocks.forEach(block => sectionElement.append(renderBlock(block)));
      return sectionElement;
    });
    el.storySections.replaceChildren(...sectionNodes);
    el.sectionIndicator.hidden = story.sections.length <= 1;
    el.sectionIndicator.textContent = `1 / ${story.sections.length}`;
  }

  function renderBlock(block) {
    if (block.type === "divider") {
      const divider = document.createElement("div");
      divider.className = "story-divider";
      divider.setAttribute("aria-hidden", "true");
      return divider;
    }
    if (block.type === "heading") {
      const heading = document.createElement("h3");
      heading.textContent = block.text_vi;
      return heading;
    }
    if (block.type === "pull_quote") {
      const quote = document.createElement("blockquote");
      quote.className = "pull-quote";
      quote.textContent = block.text_vi;
      if (block.attribution_vi) {
        const cite = document.createElement("cite");
        cite.textContent = block.attribution_vi;
        quote.append(cite);
      }
      return quote;
    }
    const paragraph = document.createElement("p");
    paragraph.textContent = block.text_vi;
    return paragraph;
  }

  function renderReviewPanel() {
    const quote = selectedQuote();
    const story = selectedStory();
    if (!quote) return;
    const review = reviewFor(quote.id);

    el.factQuoteID.textContent = quote.id;
    el.factStoryID.textContent = story?.id || "Không có";
    el.factLifecycle.textContent = `Quote ${quote.review.status} · Story ${story?.status || "—"}`;
    el.factRights.textContent = `${quote.rights.status} · ${story?.rights?.status || "—"}`;
    el.reviewNote.value = review.note || "";
    el.decisionChoices.querySelectorAll("button[data-decision]").forEach(button => {
      button.classList.toggle("active", button.dataset.decision === review.decision);
    });
    el.openQuoteJSON.href = new URL(quote.__packPath, LIBRARY_BASE).href;
    el.openStoryJSON.href = story ? new URL(story.__path, LIBRARY_BASE).href : "#";
    el.openStoryJSON.hidden = !story;
  }

  function setView(view) {
    state.view = view;
    const isReader = view === "reader";
    el.canvasScreen.hidden = isReader;
    el.readerScreen.hidden = !isReader;
    document.querySelectorAll("[data-view]").forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (isReader) {
      el.readerScroll.scrollTop = 0;
      requestAnimationFrame(updateReaderProgress);
    }
  }

  function updateReaderProgress() {
    const max = el.readerScroll.scrollHeight - el.readerScroll.clientHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, el.readerScroll.scrollTop / max)) : 1;
    el.readerProgressBar.style.width = `${progress * 100}%`;

    const sections = [...el.storySections.querySelectorAll(".story-section")];
    if (!sections.length) return;
    const threshold = el.readerScroll.getBoundingClientRect().top + el.readerScroll.clientHeight * .35;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= threshold) current = index;
    });
    el.sectionIndicator.textContent = `${current + 1} / ${sections.length}`;
  }

  function applyReaderPreferences() {
    const article = document.querySelector(".story-article");
    article.dataset.font = state.reader.font;
    article.style.fontSize = `${state.reader.size}px`;
    el.readerScreen.dataset.theme = state.reader.theme;
    el.fontSize.value = String(state.reader.size);
    el.fontChoices.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.font === state.reader.font));
    el.themeChoices.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.theme === state.reader.theme));
  }

  function toggleBookmark() {
    const quote = selectedQuote();
    if (!quote) return;
    state.reader.bookmarked ||= {};
    state.reader.bookmarked[quote.id] = !state.reader.bookmarked[quote.id];
    saveReaderPreferences();
    updateBookmark();
    showToast(state.reader.bookmarked[quote.id] ? "Đã lưu quote trong preview" : "Đã bỏ lưu quote");
  }

  function updateBookmark() {
    const active = Boolean(state.reader.bookmarked?.[state.selectedQuoteID]);
    el.bookmarkButton.textContent = active ? "♥" : "♡";
    el.bookmarkButton.setAttribute("aria-pressed", String(active));
  }

  function exportReviews() {
    const decisions = state.quotes.map(quote => ({
      quote_id: quote.id,
      story_id: quote.story_id,
      decision: reviewFor(quote.id).decision || "pending",
      note: reviewFor(quote.id).note || "",
      updated_at: reviewFor(quote.id).updated_at || null
    }));
    const payload = {
      schema_version: "1.0",
      library_id: state.manifest?.library_id || null,
      library_revision: state.manifest?.library_revision || null,
      exported_at: new Date().toISOString(),
      decisions
    };
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `selflo-content-review-r${payload.library_revision || "draft"}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Đã xuất file review JSON");
  }

  function reviewFor(quoteID) {
    state.reviews[quoteID] ||= { decision: null, note: "", updated_at: null };
    return state.reviews[quoteID];
  }

  function persistReviews() {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(state.reviews));
  }

  function saveReaderPreferences() {
    localStorage.setItem(READER_KEY, JSON.stringify(state.reader));
  }

  function selectedQuote() {
    return state.quotes.find(quote => quote.id === state.selectedQuoteID) || null;
  }

  function selectedStory() {
    const quote = selectedQuote();
    return quote?.story_id ? state.stories.get(quote.story_id) || null : null;
  }

  function readingMinutes(story) {
    if (!story) return 0;
    const texts = story.sections.flatMap(section => section.blocks
      .filter(block => block.type !== "divider")
      .map(block => block.text_vi || ""));
    texts.push(story.takeaway?.text_vi || "");
    const count = texts.join(" ").split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
    return Math.max(1, Math.ceil(count / 220));
  }

  function reflectionLabel(kind) {
    return ({ quote: "Trích dẫn", observation: "Quan sát", selflo_reflection: "Selflo" })[kind] || "Góc nhìn";
  }

  function storyStyleLabel(style) {
    return ({ parable: "Ngụ ngôn", contemporary: "Đời thường", reflective_journey: "Hành trình chiêm nghiệm" })[style] || "Câu chuyện";
  }

  function toggleText(node, value) {
    node.hidden = !value;
    node.textContent = value || "";
  }

  function setLoadState(status, message) {
    el.statusDot.className = `status-dot ${status === "loading" ? "" : status}`;
    el.loadStatus.textContent = message;
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => el.toast.classList.remove("visible"), 2200);
  }

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" ? value : fallback;
    } catch {
      return fallback;
    }
  }
})();
