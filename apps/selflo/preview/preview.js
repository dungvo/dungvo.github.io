(() => {
  "use strict";

  const LIBRARY_BASE = new URL("../perspective-library/authoring/vi/", window.location.href);
  const MATRIX_URL = new URL("../quote-research/diversity-matrix.json", window.location.href);
  const REVIEW_KEY = "selflo.content-preview.reviews.v1";
  const READER_KEY = "selflo.content-preview.reader.v1";

  const defaultReaderPreferences = { font: "serif", size: 18, theme: "paper", bookmarked: {} };
  const savedReaderPreferences = readJSON(READER_KEY, defaultReaderPreferences);

  const state = {
    manifest: null,
    quotes: [],
    stories: new Map(),
    matrix: null,
    themeNames: new Map(),
    descriptors: new Map(),
    selectedQuoteID: null,
    selectedStandaloneStoryID: null,
    view: "canvas",
    reviews: readJSON(REVIEW_KEY, {}),
    pageMode: (() => {
      const view = new URLSearchParams(window.location.search).get("view");
      if (view === "matrix") return "matrix";
      if (view === "detail" || view === "content") return "content";
      return "bulk";
    })(),
    matrixBrowser: { query: "", group: "all", status: "all" },
    contentBrowser: {
      query: "",
      type: "all",
      review: "all",
      page: 1,
      pageSize: 8
    },
    bulkBrowser: {
      query: "",
      theme: "all",
      review: "all",
      page: 1,
      pageSize: 12
    },
    reader: {
      ...defaultReaderPreferences,
      ...savedReaderPreferences,
      bookmarked: savedReaderPreferences.bookmarked || {}
    }
  };

  const el = Object.fromEntries([
    "statusDot", "loadStatus", "reloadButton", "importButton", "importFile", "exportButton", "reviewProgress", "bulkModeButton", "contentModeButton", "matrixModeButton",
    "bulkReview", "bulkRows", "bulkSearch", "bulkThemeFilter", "bulkReviewFilter", "bulkPageSize", "bulkPreviousPage", "bulkNextPage", "bulkPaginationInfo", "bulkVisibleCount", "bulkSyncState",
    "contentWorkspace", "matrixDashboard", "quoteCount", "libraryRevision",
    "contentVersion", "storyCoverage", "contentList", "contentSearch", "contentTypeFilter",
    "contentReviewFilter", "previousPageButton", "nextPageButton", "paginationInfo",
    "filterResultCount", "selectedTheme", "selectedReadingTime",
    "canvasScreen", "readerScreen", "quoteCard", "quoteKind", "quoteSource", "quoteTitle",
    "quoteText", "quoteSubtitle", "quoteTags", "openReaderButton", "closeReaderButton",
    "readerContextTitle", "bookmarkButton", "readerSettingsButton", "readerSettings", "fontChoices",
    "fontSize", "themeChoices", "readerScroll", "readerProgressBar", "storyStyle", "storyTitle",
    "storySubtitle", "storyReadingTime", "storySectionCount", "storyHero", "storySections",
    "takeawayTitle", "takeawayText", "sectionIndicator", "factQuoteID", "factStoryID",
    "factLifecycle", "factRights", "decisionChoices", "reviewNote", "openQuoteJSON",
    "openStoryJSON", "contentItemTemplate", "toast", "matrixNote", "matrixRevision",
    "matrixQuoteCount", "matrixAuthorCount", "matrixAuthorDetail", "matrixWorkCount",
    "matrixWorkDetail", "matrixStoryCount", "matrixStoryDetail", "matrixVerifiedCount",
    "matrixGapCount", "matrixSearch", "matrixGroupFilters", "matrixStatusFilter",
    "matrixResultTitle", "matrixResultCount", "matrixRows"
  ].map(id => [id, document.getElementById(id)]));

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindEvents();
    applyReaderPreferences();
    setPageMode(state.pageMode, false);
    await loadLibrary();
  }

  function bindEvents() {
    el.reloadButton.addEventListener("click", loadLibrary);
    el.importButton.addEventListener("click", () => el.importFile.click());
    el.importFile.addEventListener("change", importReviews);
    el.exportButton.addEventListener("click", exportReviews);
    el.bulkModeButton.addEventListener("click", () => setPageMode("bulk"));
    el.contentModeButton.addEventListener("click", () => setPageMode("content"));
    el.matrixModeButton.addEventListener("click", () => setPageMode("matrix"));
    el.bulkSearch.addEventListener("input", updateBulkFilters);
    el.bulkThemeFilter.addEventListener("change", updateBulkFilters);
    el.bulkReviewFilter.addEventListener("change", updateBulkFilters);
    el.bulkPageSize.addEventListener("change", updateBulkFilters);
    el.bulkPreviousPage.addEventListener("click", () => changeBulkPage(-1));
    el.bulkNextPage.addEventListener("click", () => changeBulkPage(1));
    el.bulkRows.addEventListener("change", handleBulkChange);
    el.bulkRows.addEventListener("click", handleBulkClick);
    el.openReaderButton.addEventListener("click", () => setView("reader"));
    el.closeReaderButton.addEventListener("click", () => setView("canvas"));
    el.readerSettingsButton.addEventListener("click", () => {
      el.readerSettings.hidden = !el.readerSettings.hidden;
    });
    el.bookmarkButton.addEventListener("click", toggleBookmark);
    el.readerScroll.addEventListener("scroll", updateReaderProgress, { passive: true });

    el.contentSearch.addEventListener("input", updateContentFilters);
    el.contentTypeFilter.addEventListener("change", updateContentFilters);
    el.contentReviewFilter.addEventListener("change", updateContentFilters);
    el.previousPageButton.addEventListener("click", () => changeContentPage(-1));
    el.nextPageButton.addEventListener("click", () => changeContentPage(1));
    el.matrixSearch.addEventListener("input", updateMatrixFilters);
    el.matrixStatusFilter.addEventListener("change", updateMatrixFilters);
    el.matrixGroupFilters.addEventListener("click", event => {
      const button = event.target.closest("button[data-matrix-group]");
      if (!button) return;
      state.matrixBrowser.group = button.dataset.matrixGroup;
      el.matrixGroupFilters.querySelectorAll("button").forEach(item => {
        item.classList.toggle("active", item === button);
      });
      renderMatrixRows();
    });

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
      const reviewKey = activeReviewKey();
      if (!button || !reviewKey) return;
      const review = reviewFor(reviewKey);
      const nextDecision = pairDecision(review, selectedQuote(), selectedStory()) === button.dataset.decision
        ? null
        : button.dataset.decision;
      review.quote_decision = selectedQuote() ? nextDecision : null;
      review.story_decision = selectedStory() ? nextDecision : null;
      review.updated_at = new Date().toISOString();
      persistReviews();
      renderReviewPanel();
      renderContentList();
      renderBulkRows();
      renderReviewProgress();
    });

    el.reviewNote.addEventListener("input", () => {
      const reviewKey = activeReviewKey();
      if (!reviewKey) return;
      const review = reviewFor(reviewKey);
      review.note = el.reviewNote.value;
      review.updated_at = new Date().toISOString();
      persistReviews();
      renderReviewProgress();
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

      const [quotePacks, stories, matrix] = await Promise.all([
        Promise.all(quoteFiles.map(async descriptor => ({
          descriptor,
          payload: await fetchJSON(new URL(descriptor.path, LIBRARY_BASE))
        }))),
        Promise.all(storyFiles.map(async descriptor => ({
          descriptor,
          payload: await fetchJSON(new URL(descriptor.path, LIBRARY_BASE))
        }))),
        fetchJSON(MATRIX_URL).catch(error => {
          console.warn("Diversity matrix unavailable", error);
          return null;
        })
      ]);

      state.manifest = manifest;
      state.descriptors = descriptors;
      state.stories = new Map(stories.map(item => [item.payload.id, { ...item.payload, __path: item.descriptor.path }]));
      state.matrix = matrix;
      state.themeNames = new Map(quotePacks.map(item => [item.payload.primary_theme, item.payload.display_name_vi]));
      state.quotes = quotePacks.flatMap(item => item.payload.quotes.map(quote => ({
        ...quote,
        __themeName: item.payload.display_name_vi,
        __packPath: item.descriptor.path
      })));

      const selectedQuoteExists = state.quotes.some(quote => quote.id === state.selectedQuoteID);
      const selectedStandaloneStoryExists = state.stories.has(state.selectedStandaloneStoryID);
      if (!selectedQuoteExists && !selectedStandaloneStoryExists) {
        const firstStory = [...state.stories.values()].sort(compareStories)[0] ?? null;
        const linkedQuote = firstStory ? quoteForStory(firstStory.id) : null;
        state.selectedQuoteID = linkedQuote?.id ?? null;
        state.selectedStandaloneStoryID = linkedQuote ? null : firstStory?.id ?? null;
      }

      renderLibrarySummary();
      renderBulkThemeOptions();
      renderBulkRows();
      renderContentList();
      renderSelection();
      renderMatrix();
      renderReviewProgress();
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

  function setPageMode(mode, updateURL = true) {
    state.pageMode = mode;
    const matrixMode = mode === "matrix";
    const contentMode = mode === "content";
    const bulkMode = mode === "bulk";
    el.bulkReview.hidden = !bulkMode;
    el.contentWorkspace.hidden = !contentMode;
    el.matrixDashboard.hidden = !matrixMode;
    el.exportButton.hidden = matrixMode;
    el.bulkModeButton.classList.toggle("active", bulkMode);
    el.contentModeButton.classList.toggle("active", contentMode);
    el.matrixModeButton.classList.toggle("active", matrixMode);
    el.bulkModeButton.setAttribute("aria-selected", String(bulkMode));
    el.contentModeButton.setAttribute("aria-selected", String(contentMode));
    el.matrixModeButton.setAttribute("aria-selected", String(matrixMode));
    document.querySelectorAll(".global-nav a").forEach(link => link.classList.remove("active"));
    const activeGlobalLink = document.querySelector(matrixMode ? '.global-nav a[href="?view=matrix"]' : '.global-nav a[href="./"]');
    activeGlobalLink?.classList.add("active");
    if (updateURL) {
      const url = new URL(window.location.href);
      if (matrixMode) url.searchParams.set("view", "matrix");
      else if (contentMode) url.searchParams.set("view", "detail");
      else url.searchParams.delete("view");
      window.history.replaceState({}, "", url);
    }
    if (matrixMode) renderMatrix();
    if (bulkMode) renderBulkRows();
  }

  function renderMatrix() {
    const rows = state.matrix?.rows || [];
    const externalQuotes = state.quotes.filter(quote => {
      const authorID = quote.authorship?.author_id;
      return authorID && authorID !== "selflo" && quote.authorship?.author_name;
    });
    const authors = [...new Set(externalQuotes.map(quote => quote.authorship.author_name))];
    const works = [...new Set(externalQuotes.map(quote => quote.authorship?.work).filter(Boolean))];
    const linkedStories = state.quotes.filter(quote => quote.story_id && state.stories.has(quote.story_id)).length;
    const verifiedQuotes = state.quotes.filter(quote => quote.kind === "verified_quote").length;
    const gapStatuses = new Set(["thin", "missing", "unknown", "imbalanced"]);

    el.matrixNote.textContent = state.matrix?.note_vi || "Matrix editorial chưa tải được; số Library bên dưới vẫn là dữ liệu live.";
    el.matrixRevision.textContent = state.manifest
      ? `r${state.manifest.library_revision} · ${state.manifest.content_version}`
      : "—";
    el.matrixQuoteCount.textContent = String(state.quotes.length);
    el.matrixAuthorCount.textContent = String(authors.length);
    el.matrixAuthorDetail.textContent = authors.length ? authors.join(", ") : "chưa có tác giả bên ngoài";
    el.matrixWorkCount.textContent = String(works.length);
    el.matrixWorkDetail.textContent = works.length ? works.join(", ") : "chưa có tác phẩm bên ngoài";
    el.matrixStoryCount.textContent = String(linkedStories);
    el.matrixStoryDetail.textContent = `${state.quotes.length - linkedStories} quote chưa có story`;
    el.matrixVerifiedCount.textContent = String(verifiedQuotes);
    el.matrixGapCount.textContent = String(rows.filter(row => gapStatuses.has(row.status)).length);
    renderMatrixRows();
  }

  function updateMatrixFilters() {
    state.matrixBrowser.query = el.matrixSearch.value;
    state.matrixBrowser.status = el.matrixStatusFilter.value;
    renderMatrixRows();
  }

  function renderMatrixRows() {
    el.matrixRows.replaceChildren();
    const matrixRows = state.matrix?.rows || [];
    const filtered = matrixRows.filter(matchesMatrixFilters);
    const groupLabels = { source: "Nguồn", form: "Dạng quote", anchor: "Lý thuyết / tư tưởng", context: "Bối cảnh" };
    const statusLabels = {
      strong: "Mạnh", partial: "Đang có", thin: "Còn mỏng", missing: "Đang thiếu",
      unknown: "Chưa đo", imbalanced: "Đang lệch"
    };

    const groupTitle = state.matrixBrowser.group === "all"
      ? "Tất cả chiều phân loại"
      : groupLabels[state.matrixBrowser.group];
    el.matrixResultTitle.textContent = groupTitle;
    el.matrixResultCount.textContent = `${filtered.length} / ${matrixRows.length} mục`;

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "matrix-empty";
      empty.textContent = "Không có mục nào phù hợp với bộ lọc này.";
      el.matrixRows.append(empty);
      return;
    }

    filtered.forEach(row => {
      const article = document.createElement("article");
      article.className = "matrix-row";
      article.dataset.status = row.status;

      const identity = document.createElement("div");
      identity.className = "matrix-identity";
      const group = document.createElement("span");
      group.textContent = groupLabels[row.group] || row.group;
      const name = document.createElement("strong");
      name.textContent = row.name_vi;
      identity.append(group, name);

      const coverage = document.createElement("div");
      coverage.className = "matrix-coverage";
      const badge = document.createElement("span");
      badge.textContent = statusLabels[row.status] || row.status;
      const count = document.createElement("strong");
      count.textContent = row.count === null ? "—" : String(row.count);
      coverage.append(badge, count);

      const evidence = document.createElement("p");
      evidence.className = "matrix-evidence";
      evidence.textContent = row.evidence_vi;

      const gap = document.createElement("p");
      gap.className = "matrix-gap";
      gap.textContent = row.gap_vi;

      article.append(identity, coverage, evidence, gap);
      el.matrixRows.append(article);
    });
  }

  function matchesMatrixFilters(row) {
    const { query, group, status } = state.matrixBrowser;
    if (group !== "all" && row.group !== group) return false;
    const presentStatuses = new Set(["strong", "partial"]);
    const gapStatuses = new Set(["thin", "missing", "unknown", "imbalanced"]);
    if (status === "present" && !presentStatuses.has(row.status)) return false;
    if (status === "gaps" && !gapStatuses.has(row.status)) return false;
    if (status === "missing" && row.status !== "missing") return false;
    if (status === "unknown" && row.status !== "unknown") return false;
    if (!query.trim()) return true;
    return normalizeSearch([row.name_vi, row.evidence_vi, row.gap_vi].join(" "))
      .includes(normalizeSearch(query));
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

  function renderBulkThemeOptions() {
    const selected = state.bulkBrowser.theme;
    const options = [...state.themeNames.entries()]
      .sort((left, right) => left[1].localeCompare(right[1], "vi"))
      .map(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        return option;
      });
    el.bulkThemeFilter.replaceChildren(new Option("Tất cả theme", "all"), ...options);
    el.bulkThemeFilter.value = [...el.bulkThemeFilter.options].some(option => option.value === selected) ? selected : "all";
  }

  function updateBulkFilters() {
    state.bulkBrowser.query = el.bulkSearch.value;
    state.bulkBrowser.theme = el.bulkThemeFilter.value;
    state.bulkBrowser.review = el.bulkReviewFilter.value;
    state.bulkBrowser.pageSize = Number(el.bulkPageSize.value) || 12;
    state.bulkBrowser.page = 1;
    renderBulkRows();
  }

  function changeBulkPage(offset) {
    state.bulkBrowser.page += offset;
    renderBulkRows();
    el.bulkReview.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderBulkRows() {
    if (!state.manifest) return;
    const allRows = contentRows();
    const rows = allRows.filter(matchesBulkFilters);
    const totalPages = Math.max(1, Math.ceil(rows.length / state.bulkBrowser.pageSize));
    state.bulkBrowser.page = Math.min(Math.max(1, state.bulkBrowser.page), totalPages);
    const startIndex = (state.bulkBrowser.page - 1) * state.bulkBrowser.pageSize;
    const pageRows = rows.slice(startIndex, startIndex + state.bulkBrowser.pageSize);

    el.bulkRows.replaceChildren();
    el.bulkVisibleCount.textContent = `${rows.length} / ${allRows.length} cặp`;
    el.bulkPaginationInfo.textContent = `Trang ${state.bulkBrowser.page} / ${totalPages} · ${pageRows.length} mục đang hiện`;
    el.bulkPreviousPage.disabled = state.bulkBrowser.page <= 1;
    el.bulkNextPage.disabled = state.bulkBrowser.page >= totalPages;

    if (!pageRows.length) {
      const empty = document.createElement("div");
      empty.className = "bulk-empty";
      empty.textContent = "Không có quote hoặc story phù hợp với bộ lọc này.";
      el.bulkRows.append(empty);
      return;
    }

    pageRows.forEach((row, index) => el.bulkRows.append(renderBulkRow(row, startIndex + index + 1)));
  }

  function matchesBulkFilters(row) {
    const { quote, story } = row;
    const theme = quote?.primary_theme || story?.primary_theme;
    if (state.bulkBrowser.theme !== "all" && theme !== state.bulkBrowser.theme) return false;

    const key = quote?.id || `story:${story.id}`;
    const status = pairDecision(reviewFor(key), quote, story);
    if (state.bulkBrowser.review !== "all" && status !== state.bulkBrowser.review) return false;

    if (!state.bulkBrowser.query.trim()) return true;
    const searchable = [
      quote?.id, quote?.title_vi, quote?.text_vi, quote?.authorship?.author_name,
      story?.id, story?.title_vi, story?.subtitle_vi, storyPlainText(story),
      quote?.__themeName || state.themeNames.get(theme) || theme
    ].filter(Boolean).join(" ");
    return normalizeSearch(searchable).includes(normalizeSearch(state.bulkBrowser.query));
  }

  function renderBulkRow({ quote, story }, number) {
    const key = quote?.id || `story:${story.id}`;
    const review = reviewFor(key);
    const quoteDecision = quote ? review.quote_decision : null;
    const storyDecision = story ? review.story_decision : null;
    const status = pairDecision(review, quote, story);
    const themeName = quote?.__themeName || state.themeNames.get(story?.primary_theme) || story?.primary_theme || "Chưa phân loại";

    const article = document.createElement("article");
    article.className = "bulk-row";
    article.dataset.reviewKey = key;
    article.dataset.state = status;

    const header = document.createElement("header");
    header.className = "bulk-row-header";
    const identity = document.createElement("div");
    identity.className = "bulk-row-identity";
    const index = document.createElement("span");
    index.className = "bulk-row-index";
    index.textContent = String(number).padStart(3, "0");
    const identityCopy = document.createElement("div");
    const theme = document.createElement("strong");
    theme.textContent = themeName;
    const ids = document.createElement("small");
    ids.textContent = [quote?.id, story?.id].filter(Boolean).join(" ↔ ");
    identityCopy.append(theme, ids);
    identity.append(index, identityCopy);
    const stateBadge = document.createElement("span");
    stateBadge.className = "bulk-state-badge";
    stateBadge.textContent = decisionLabel(status);
    header.append(identity, stateBadge);

    const content = document.createElement("div");
    content.className = "bulk-content-grid";
    content.append(renderBulkQuote(quote, quoteDecision), renderBulkStory(story, storyDecision));

    const controls = document.createElement("footer");
    controls.className = "bulk-row-controls";
    controls.append(
      decisionField("Quote", "quote", quoteDecision, !quote),
      decisionField("Story", "story", storyDecision, !story)
    );

    const pairActions = document.createElement("div");
    pairActions.className = "bulk-pair-actions";
    [
      ["approved", "✓ Duyệt cả hai"],
      ["needs_edit", "↺ Cần cập nhật"],
      ["pending", "○ Chưa preview"]
    ].forEach(([decision, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.bulkAction = decision;
      button.textContent = label;
      if (status === decision) button.classList.add("active");
      pairActions.append(button);
    });
    controls.append(pairActions);

    const noteWrap = document.createElement("label");
    noteWrap.className = "bulk-note-field";
    const noteLabel = document.createElement("span");
    noteLabel.textContent = "Ghi chú";
    const note = document.createElement("input");
    note.type = "text";
    note.dataset.bulkNote = "true";
    note.value = review.note || "";
    note.placeholder = "Điểm cần sửa hoặc lý do duyệt…";
    noteWrap.append(noteLabel, note);
    controls.append(noteWrap);

    const detailButton = document.createElement("button");
    detailButton.className = "bulk-detail-button";
    detailButton.type = "button";
    detailButton.dataset.openDetail = "true";
    detailButton.textContent = "Mở bản xem trong app →";
    controls.append(detailButton);

    article.append(header, content, controls);
    return article;
  }

  function renderBulkQuote(quote, decision) {
    const section = document.createElement("section");
    section.className = "bulk-quote-column";
    section.dataset.state = decision || "pending";
    const heading = document.createElement("div");
    heading.className = "bulk-column-heading";
    const label = document.createElement("span");
    label.textContent = "Quote";
    const badge = document.createElement("small");
    badge.textContent = decisionLabel(decision || "pending");
    heading.append(label, badge);
    section.append(heading);

    if (!quote) {
      const empty = document.createElement("p");
      empty.className = "bulk-missing";
      empty.textContent = "Story này chưa được gắn quote.";
      section.append(empty);
      return section;
    }

    if (quote.title_vi) {
      const title = document.createElement("h2");
      title.textContent = quote.title_vi;
      section.append(title);
    }
    const blockquote = document.createElement("blockquote");
    blockquote.textContent = quote.text_vi;
    section.append(blockquote);
    if (quote.subtitle_vi) {
      const subtitle = document.createElement("p");
      subtitle.className = "bulk-quote-subtitle";
      subtitle.textContent = quote.subtitle_vi;
      section.append(subtitle);
    }
    const source = document.createElement("p");
    source.className = "bulk-source";
    source.textContent = quote.authorship?.source_label || quote.authorship?.author_name || "Selflo";
    section.append(source);
    return section;
  }

  function renderBulkStory(story, decision) {
    const section = document.createElement("section");
    section.className = "bulk-story-column";
    section.dataset.state = decision || "pending";
    const heading = document.createElement("div");
    heading.className = "bulk-column-heading";
    const label = document.createElement("span");
    label.textContent = "Story";
    const badge = document.createElement("small");
    badge.textContent = decisionLabel(decision || "pending");
    heading.append(label, badge);
    section.append(heading);

    if (!story) {
      const empty = document.createElement("p");
      empty.className = "bulk-missing";
      empty.textContent = "Quote này chưa có story tương ứng.";
      section.append(empty);
      return section;
    }

    const title = document.createElement("h2");
    title.textContent = story.title_vi;
    const meta = document.createElement("p");
    meta.className = "bulk-story-meta";
    meta.textContent = `${storyWordCount(story)} từ · ${readingMinutes(story)} phút đọc · ${story.sections.length} phần`;
    section.append(title, meta);

    const body = document.createElement("div");
    body.className = "bulk-story-body";
    if (story.subtitle_vi) {
      const subtitle = document.createElement("p");
      subtitle.className = "bulk-story-subtitle";
      subtitle.textContent = story.subtitle_vi;
      body.append(subtitle);
    }
    story.sections.forEach(storySection => {
      if (storySection.title_vi) {
        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = storySection.title_vi;
        body.append(sectionTitle);
      }
      storySection.blocks.forEach(block => {
        if (block.type === "divider") return;
        const paragraph = document.createElement(block.type === "pull_quote" ? "blockquote" : "p");
        paragraph.textContent = block.text_vi || "";
        body.append(paragraph);
      });
    });
    if (story.takeaway?.text_vi) {
      const takeaway = document.createElement("p");
      takeaway.className = "bulk-takeaway";
      takeaway.textContent = `Mang theo · ${story.takeaway.text_vi}`;
      body.append(takeaway);
    }
    section.append(body);
    return section;
  }

  function decisionField(labelText, target, value, disabled) {
    const label = document.createElement("label");
    label.className = "bulk-decision-field";
    const span = document.createElement("span");
    span.textContent = labelText;
    const select = document.createElement("select");
    select.dataset.reviewTarget = target;
    select.disabled = disabled;
    [
      ["pending", "Chưa preview"],
      ["approved", "Đã duyệt"],
      ["needs_edit", "Cần cập nhật"],
      ["rejected", "Từ chối"]
    ].forEach(([optionValue, optionLabel]) => select.add(new Option(optionLabel, optionValue)));
    select.value = value || "pending";
    label.append(span, select);
    return label;
  }

  function handleBulkChange(event) {
    const row = event.target.closest(".bulk-row");
    if (!row) return;
    const review = reviewFor(row.dataset.reviewKey);
    if (event.target.matches("select[data-review-target]")) {
      const field = `${event.target.dataset.reviewTarget}_decision`;
      review[field] = event.target.value === "pending" ? null : event.target.value;
    } else if (event.target.matches("input[data-bulk-note]")) {
      review.note = event.target.value;
    } else {
      return;
    }
    review.updated_at = new Date().toISOString();
    persistReviews();
    renderBulkRows();
    renderContentList();
    renderReviewPanel();
    renderReviewProgress();
  }

  function handleBulkClick(event) {
    const row = event.target.closest(".bulk-row");
    if (!row) return;
    const contentRow = contentRows().find(item => (item.quote?.id || `story:${item.story.id}`) === row.dataset.reviewKey);
    if (!contentRow) return;

    const action = event.target.closest("button[data-bulk-action]")?.dataset.bulkAction;
    if (action) {
      const review = reviewFor(row.dataset.reviewKey);
      const decision = action === "pending" ? null : action;
      review.quote_decision = contentRow.quote ? decision : null;
      review.story_decision = contentRow.story ? decision : null;
      review.updated_at = new Date().toISOString();
      persistReviews();
      renderBulkRows();
      renderContentList();
      renderReviewPanel();
      renderReviewProgress();
      return;
    }

    if (event.target.closest("button[data-open-detail]")) {
      if (contentRow.quote) selectQuote(contentRow.quote.id);
      else selectStandaloneStory(contentRow.story.id);
      setPageMode("content");
    }
  }

  function renderContentList() {
    el.contentList.replaceChildren();
    const allRows = contentRows();
    const rows = allRows.filter(matchesContentFilters);
    const totalPages = Math.max(1, Math.ceil(rows.length / state.contentBrowser.pageSize));
    state.contentBrowser.page = Math.min(Math.max(1, state.contentBrowser.page), totalPages);
    const startIndex = (state.contentBrowser.page - 1) * state.contentBrowser.pageSize;
    const pageRows = rows.slice(startIndex, startIndex + state.contentBrowser.pageSize);

    el.quoteCount.textContent = String(rows.length);
    el.paginationInfo.textContent = `Trang ${state.contentBrowser.page} / ${totalPages}`;
    el.filterResultCount.textContent = rows.length
      ? `${startIndex + 1}–${startIndex + pageRows.length} / ${rows.length} · tổng ${allRows.length}`
      : `0 kết quả · tổng ${allRows.length}`;
    el.previousPageButton.disabled = state.contentBrowser.page <= 1;
    el.nextPageButton.disabled = state.contentBrowser.page >= totalPages;

    if (!pageRows.length) {
      const message = document.createElement("div");
      message.className = "error-message";
      message.textContent = "Không có nội dung phù hợp với bộ lọc này.";
      el.contentList.append(message);
      return;
    }

    pageRows.forEach((row, index) => {
      const { quote, story } = row;
      const reviewKey = quote?.id || `story:${story.id}`;
      const isActive = quote
        ? quote.id === state.selectedQuoteID
        : story.id === state.selectedStandaloneStoryID;
      const node = el.contentItemTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.review = pairDecision(reviewFor(reviewKey), quote, story);
      node.classList.toggle("active", isActive);
      node.querySelector(".content-index").textContent = String(startIndex + index + 1).padStart(2, "0");
      node.querySelector("strong").textContent = story?.title_vi || quote.text_vi;
      if (story) {
        const themeName = quote?.__themeName || state.themeNames.get(story.primary_theme) || story.primary_theme;
        node.querySelector("small").textContent = `${themeName} · ${readingMinutes(story)} phút · ${quote ? "Có quote" : "Chưa gắn quote"}`;
      } else {
        node.querySelector("small").textContent = `${quote.__themeName} · Chưa có story`;
      }
      node.addEventListener("click", () => {
        if (quote) selectQuote(quote.id);
        else selectStandaloneStory(story.id);
      });
      el.contentList.append(node);
    });
  }

  function contentRows() {
    const stories = [...state.stories.values()].sort(compareStories);
    const quotesWithoutStory = state.quotes.filter(quote => !quote.story_id || !state.stories.has(quote.story_id));
    return [
      ...stories.map(story => ({ story, quote: quoteForStory(story.id) })),
      ...quotesWithoutStory.map(quote => ({ story: null, quote }))
    ];
  }

  function matchesContentFilters(row) {
    const { quote, story } = row;
    const { query, type, review } = state.contentBrowser;
    if (type === "stories" && !story) return false;
    if (type === "linked_stories" && (!story || !quote)) return false;
    if (type === "unlinked_stories" && (!story || quote)) return false;
    if (type === "quotes_without_story" && (story || !quote)) return false;

    const reviewKey = quote?.id || `story:${story.id}`;
    const decision = pairDecision(reviewFor(reviewKey), quote, story);
    if (review === "approved" && decision !== "approved") return false;
    if (review === "not_approved" && decision === "approved") return false;
    if (["needs_edit", "rejected"].includes(review) && decision !== review) return false;

    if (!query) return true;
    const normalizedQuery = normalizeSearch(query);
    const themeName = quote?.__themeName || state.themeNames.get(story?.primary_theme) || story?.primary_theme;
    const searchable = [
      quote?.id, quote?.text_vi, quote?.title_vi, quote?.primary_theme,
      quote?.authorship?.author_name, quote?.authorship?.work, quote?.authorship?.source_label,
      story?.id, story?.title_vi, story?.subtitle_vi, story?.primary_theme, themeName
    ].filter(Boolean).join(" ");
    return normalizeSearch(searchable).includes(normalizedQuery);
  }

  function normalizeSearch(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").trim();
  }

  function updateContentFilters() {
    state.contentBrowser.query = el.contentSearch.value;
    state.contentBrowser.type = el.contentTypeFilter.value;
    state.contentBrowser.review = el.contentReviewFilter.value;
    state.contentBrowser.page = 1;
    renderContentList();
  }

  function changeContentPage(offset) {
    state.contentBrowser.page += offset;
    renderContentList();
    el.contentList.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function selectQuote(quoteID) {
    state.selectedQuoteID = quoteID;
    state.selectedStandaloneStoryID = null;
    el.readerSettings.hidden = true;
    el.readerScroll.scrollTop = 0;
    renderContentList();
    renderSelection();
  }

  function selectStandaloneStory(storyID) {
    state.selectedQuoteID = null;
    state.selectedStandaloneStoryID = storyID;
    el.readerSettings.hidden = true;
    el.readerScroll.scrollTop = 0;
    renderContentList();
    renderSelection();
    setView("reader");
  }

  function renderSelection() {
    const quote = selectedQuote();
    const story = selectedStory();
    if (!quote && !story) return;
    renderQuote(quote, story);
    renderStory(story);
    renderReviewPanel();
    el.selectedTheme.textContent = quote?.__themeName || state.themeNames.get(story.primary_theme) || story.primary_theme;
    el.selectedReadingTime.textContent = story ? `${readingMinutes(story)} phút đọc` : "Chưa có story";
    updateBookmark();
    requestAnimationFrame(updateReaderProgress);
  }

  function renderQuote(quote, story) {
    if (!quote) {
      el.quoteCard.dataset.style = "cool_observe";
      el.quoteKind.textContent = "Bản thảo story";
      el.quoteSource.textContent = "Chưa gắn quote";
      toggleText(el.quoteTitle, story.title_vi);
      el.quoteText.textContent = story.subtitle_vi || "Mở Reader để duyệt câu chuyện này.";
      toggleText(el.quoteSubtitle, null);
      el.quoteTags.replaceChildren();
      el.openReaderButton.hidden = false;
      return;
    }
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
    if (!quote && !story) return;
    const reviewKey = activeReviewKey();
    const review = reviewFor(reviewKey);

    el.factQuoteID.textContent = quote?.id || "Chưa gắn quote";
    el.factStoryID.textContent = story?.id || "Không có";
    el.factLifecycle.textContent = `${quote ? `Quote ${quote.review.status} · ` : ""}Story ${story?.status || "—"} · Review ${story?.review?.status || "—"}`;
    el.factRights.textContent = `${quote ? `${quote.rights.status} · ` : ""}${story?.rights?.status || "—"}`;
    el.reviewNote.value = review.note || "";
    const currentDecision = pairDecision(review, quote, story);
    el.decisionChoices.querySelectorAll("button[data-decision]").forEach(button => {
      button.classList.toggle("active", button.dataset.decision === currentDecision);
    });
    el.openQuoteJSON.href = quote ? new URL(quote.__packPath, LIBRARY_BASE).href : "#";
    el.openQuoteJSON.hidden = !quote;
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
    const contentKey = activeReviewKey();
    if (!contentKey) return;
    state.reader.bookmarked ||= {};
    state.reader.bookmarked[contentKey] = !state.reader.bookmarked[contentKey];
    saveReaderPreferences();
    updateBookmark();
    showToast(state.reader.bookmarked[contentKey] ? "Đã lưu nội dung trong preview" : "Đã bỏ lưu nội dung");
  }

  function updateBookmark() {
    const active = Boolean(state.reader.bookmarked?.[activeReviewKey()]);
    el.bookmarkButton.textContent = active ? "♥" : "♡";
    el.bookmarkButton.setAttribute("aria-pressed", String(active));
  }

  function exportReviews() {
    const quoteDecisions = state.quotes.map(quote => ({
      key: quote.id,
      entity: quote.story_id ? "quote_story_pair" : "quote",
      quote_id: quote.id,
      story_id: quote.story_id,
      quote_decision: reviewFor(quote.id).quote_decision || "pending",
      story_decision: quote.story_id ? reviewFor(quote.id).story_decision || "pending" : null,
      decision: pairDecision(reviewFor(quote.id), quote, quote.story_id ? state.stories.get(quote.story_id) : null),
      note: reviewFor(quote.id).note || "",
      updated_at: reviewFor(quote.id).updated_at || null
    }));
    const linkedStoryIDs = new Set(state.quotes.map(quote => quote.story_id).filter(Boolean));
    const standaloneStoryDecisions = [...state.stories.values()]
      .filter(story => !linkedStoryIDs.has(story.id))
      .map(story => {
        const key = `story:${story.id}`;
        return {
          key,
          entity: "story",
          quote_id: null,
          story_id: story.id,
          quote_decision: null,
          story_decision: reviewFor(key).story_decision || "pending",
          decision: pairDecision(reviewFor(key), null, story),
          note: reviewFor(key).note || "",
          updated_at: reviewFor(key).updated_at || null
        };
      });
    const decisions = [...quoteDecisions, ...standaloneStoryDecisions];
    const payload = {
      schema_version: "2.0",
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

  async function importReviews(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.decisions)) throw new Error("missing decisions");
      const imported = {};
      payload.decisions.forEach(item => {
        const key = item.key || item.quote_id || (item.story_id ? `story:${item.story_id}` : null);
        if (!key) return;
        const legacyDecision = ["approved", "needs_edit", "rejected"].includes(item.decision) ? item.decision : null;
        imported[key] = {
          quote_decision: ["approved", "needs_edit", "rejected"].includes(item.quote_decision) ? item.quote_decision : (item.quote_id ? legacyDecision : null),
          story_decision: ["approved", "needs_edit", "rejected"].includes(item.story_decision) ? item.story_decision : (item.story_id ? legacyDecision : null),
          note: typeof item.note === "string" ? item.note : "",
          updated_at: item.updated_at || new Date().toISOString()
        };
      });
      state.reviews = { ...state.reviews, ...imported };
      persistReviews();
      renderBulkRows();
      renderContentList();
      renderReviewPanel();
      renderReviewProgress();
      showToast(`Đã nhập ${Object.keys(imported).length} quyết định`);
    } catch {
      showToast("Ledger không đúng định dạng Selflo");
    }
  }

  function renderReviewProgress() {
    let reviewed = 0;
    state.quotes.forEach(quote => {
      if (reviewFor(quote.id).quote_decision) reviewed += 1;
    });
    state.stories.forEach(story => {
      const quote = quoteForStory(story.id);
      const key = quote?.id || `story:${story.id}`;
      if (reviewFor(key).story_decision) reviewed += 1;
    });
    const total = state.quotes.length + state.stories.size;
    el.reviewProgress.textContent = `${reviewed}/${total} phần đã review`;
  }

  function reviewFor(reviewKey) {
    state.reviews[reviewKey] ||= { quote_decision: null, story_decision: null, note: "", updated_at: null };
    const review = state.reviews[reviewKey];
    if (!("quote_decision" in review) || !("story_decision" in review)) {
      const legacyDecision = ["approved", "needs_edit", "rejected"].includes(review.decision) ? review.decision : null;
      review.quote_decision ??= legacyDecision;
      review.story_decision ??= legacyDecision;
    }
    return review;
  }

  function pairDecision(review, quote, story) {
    const decisions = [
      quote ? review.quote_decision : null,
      story ? review.story_decision : null
    ].filter(Boolean);
    const entityCount = Number(Boolean(quote)) + Number(Boolean(story));
    if (!decisions.length) return "pending";
    if (decisions.includes("needs_edit")) return "needs_edit";
    if (decisions.includes("rejected")) return "rejected";
    if (decisions.length < entityCount) return "partial";
    return decisions.every(decision => decision === "approved") ? "approved" : "partial";
  }

  function decisionLabel(decision) {
    return ({
      pending: "Chưa preview",
      partial: "Đã duyệt một phần",
      approved: "Đã duyệt",
      needs_edit: "Cần cập nhật",
      rejected: "Từ chối"
    })[decision] || "Chưa preview";
  }

  function lifecycleDecision(quote, story) {
    const status = quote?.review?.status || story?.review?.status;
    return ["approved", "needs_edit", "rejected"].includes(status) ? status : "pending";
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
    if (state.selectedStandaloneStoryID) {
      return state.stories.get(state.selectedStandaloneStoryID) || null;
    }
    const quote = selectedQuote();
    return quote?.story_id ? state.stories.get(quote.story_id) || null : null;
  }

  function quoteForStory(storyID) {
    return state.quotes.find(quote => quote.story_id === storyID) || null;
  }

  function activeReviewKey() {
    if (state.selectedQuoteID) return state.selectedQuoteID;
    if (state.selectedStandaloneStoryID) return `story:${state.selectedStandaloneStoryID}`;
    return null;
  }

  function compareStories(left, right) {
    return left.title_vi.localeCompare(right.title_vi, "vi");
  }

  function readingMinutes(story) {
    return story ? Math.max(1, Math.ceil(storyWordCount(story) / 220)) : 0;
  }

  function storyWordCount(story) {
    if (!story) return 0;
    return storyPlainText(story).split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
  }

  function storyPlainText(story) {
    if (!story) return "";
    const texts = (story.sections || []).flatMap(section => (section.blocks || [])
      .filter(block => block.type !== "divider")
      .map(block => block.text_vi || ""));
    texts.push(story.takeaway?.text_vi || "");
    return texts.join(" ").trim();
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
