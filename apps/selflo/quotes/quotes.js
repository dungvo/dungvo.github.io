(() => {
  "use strict";

  const LIBRARY_BASE = new URL("../perspective-library/authoring/vi/", window.location.href);
  const PAGE_SIZE = 24;
  const params = new URLSearchParams(window.location.search);
  const state = {
    manifest: null,
    quotes: [],
    themeNames: new Map(),
    filters: {
      query: params.get("q") || "",
      source: params.get("source") || "all",
      author: params.get("author") || "all",
      work: params.get("work") || "all",
      theme: params.get("theme") || "all",
      sort: params.get("sort") || "source"
    },
    page: Math.max(1, Number(params.get("page")) || 1)
  };

  const el = Object.fromEntries([
    "libraryState", "totalQuoteMetric", "authorMetric", "workMetric", "quoteSearch",
    "sourceFilter", "authorFilter", "workFilter", "themeFilter", "sortFilter", "resetFilters",
    "resultTitle", "resultCount", "quoteGrid", "previousPage", "nextPage", "paginationInfo"
  ].map(id => [id, document.getElementById(id)]));

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindEvents();
    await loadLibrary();
  }

  function bindEvents() {
    el.quoteSearch.addEventListener("input", updateFilters);
    [el.sourceFilter, el.authorFilter, el.workFilter, el.themeFilter, el.sortFilter]
      .forEach(select => select.addEventListener("change", updateFilters));
    el.resetFilters.addEventListener("click", resetFilters);
    el.previousPage.addEventListener("click", () => changePage(-1));
    el.nextPage.addEventListener("click", () => changePage(1));
  }

  async function loadLibrary() {
    try {
      const manifest = await fetchJSON(new URL("manifest.json", LIBRARY_BASE));
      const quoteFiles = manifest.files.filter(file => file.kind === "quote_pack");
      const packs = await Promise.all(quoteFiles.map(async descriptor => ({
        descriptor,
        payload: await fetchJSON(new URL(descriptor.path, LIBRARY_BASE))
      })));

      state.manifest = manifest;
      state.themeNames = new Map(packs.map(item => [item.payload.primary_theme, item.payload.display_name_vi]));
      state.quotes = packs.flatMap(item => item.payload.quotes.map(quote => ({
        ...quote,
        __themeName: item.payload.display_name_vi,
        __packPath: item.descriptor.path
      })));

      hydrateControls();
      renderMetrics();
      renderQuotes();
      el.libraryState.textContent = `Authoring r${manifest.library_revision}`;
    } catch (error) {
      console.error(error);
      el.libraryState.textContent = "Không tải được Library";
      el.quoteGrid.innerHTML = '<div class="quote-empty">Không thể đọc Authoring Library. Vui lòng thử tải lại trang.</div>';
    }
  }

  function hydrateControls() {
    el.quoteSearch.value = state.filters.query;
    el.sourceFilter.value = validOption(el.sourceFilter, state.filters.source) ? state.filters.source : "all";
    el.sortFilter.value = validOption(el.sortFilter, state.filters.sort) ? state.filters.sort : "source";

    const authors = uniqueSorted(state.quotes
      .filter(isExternalQuote)
      .map(quote => quote.authorship.author_name)
      .filter(Boolean));
    setOptions(el.authorFilter, "Tất cả tác giả", authors);

    const works = uniqueSorted(state.quotes.map(quote => quote.authorship?.work).filter(Boolean));
    setOptions(el.workFilter, "Tất cả sách / tác phẩm", works);

    const themes = [...state.themeNames.entries()]
      .sort((left, right) => left[1].localeCompare(right[1], "vi"));
    el.themeFilter.replaceChildren(new Option("Tất cả theme", "all"), ...themes.map(([value, label]) => new Option(label, value)));

    el.authorFilter.value = validOption(el.authorFilter, state.filters.author) ? state.filters.author : "all";
    el.workFilter.value = validOption(el.workFilter, state.filters.work) ? state.filters.work : "all";
    el.themeFilter.value = validOption(el.themeFilter, state.filters.theme) ? state.filters.theme : "all";
    readControlsIntoState();
    updateContextualOptions();
  }

  function setOptions(select, allLabel, values) {
    select.replaceChildren(new Option(allLabel, "all"), ...values.map(value => new Option(displayWork(value), value)));
  }

  function updateContextualOptions() {
    const externalContext = ["all", "author", "book"].includes(state.filters.source);
    const selectedAuthor = externalContext ? state.filters.author : "all";
    const selectedWork = externalContext ? state.filters.work : "all";

    const authors = uniqueSorted(state.quotes.filter(isExternalQuote).map(quote => quote.authorship.author_name).filter(Boolean));
    setOptions(el.authorFilter, "Tất cả tác giả", authors);
    el.authorFilter.value = validOption(el.authorFilter, selectedAuthor) ? selectedAuthor : "all";

    const workQuotes = state.quotes.filter(quote => selectedAuthor === "all" || quote.authorship?.author_name === selectedAuthor);
    const works = uniqueSorted(workQuotes.map(quote => quote.authorship?.work).filter(Boolean));
    setOptions(el.workFilter, "Tất cả sách / tác phẩm", works);
    el.workFilter.value = validOption(el.workFilter, selectedWork) ? selectedWork : "all";

    el.authorFilter.disabled = !externalContext;
    el.workFilter.disabled = !externalContext;
  }

  function updateFilters() {
    readControlsIntoState();
    updateContextualOptions();
    readControlsIntoState();
    state.page = 1;
    renderQuotes();
  }

  function readControlsIntoState() {
    state.filters = {
      query: el.quoteSearch.value.trim(),
      source: el.sourceFilter.value,
      author: el.authorFilter.value,
      work: el.workFilter.value,
      theme: el.themeFilter.value,
      sort: el.sortFilter.value
    };
  }

  function resetFilters() {
    state.filters = { query: "", source: "all", author: "all", work: "all", theme: "all", sort: "source" };
    state.page = 1;
    hydrateControls();
    renderQuotes();
  }

  function renderMetrics() {
    const externalQuotes = state.quotes.filter(isExternalQuote);
    el.totalQuoteMetric.textContent = String(state.quotes.length);
    el.authorMetric.textContent = String(new Set(externalQuotes.map(quote => quote.authorship.author_name)).size);
    el.workMetric.textContent = String(new Set(externalQuotes.map(quote => quote.authorship.work).filter(Boolean)).size);
  }

  function renderQuotes() {
    const filtered = sortQuotes(state.quotes.filter(matchesFilters));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(Math.max(1, state.page), totalPages);
    const startIndex = (state.page - 1) * PAGE_SIZE;
    const pageQuotes = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    el.quoteGrid.replaceChildren();
    el.resultTitle.textContent = resultTitle();
    el.resultCount.textContent = `${filtered.length} / ${state.quotes.length} quote`;
    el.paginationInfo.textContent = `Trang ${state.page} / ${totalPages} · ${startIndex + 1}–${startIndex + pageQuotes.length}`;
    el.previousPage.disabled = state.page <= 1;
    el.nextPage.disabled = state.page >= totalPages;

    if (!pageQuotes.length) {
      const empty = document.createElement("div");
      empty.className = "quote-empty";
      empty.textContent = "Không có quote phù hợp với bộ lọc này.";
      el.quoteGrid.append(empty);
    } else {
      pageQuotes.forEach((quote, index) => el.quoteGrid.append(renderQuoteCard(quote, startIndex + index + 1)));
    }
    updateURL();
  }

  function renderQuoteCard(quote, number) {
    const link = document.createElement("a");
    link.className = "quote-list-card";
    link.href = `../preview/?view=detail&quote=${encodeURIComponent(quote.id)}`;
    link.dataset.origin = quoteOrigin(quote);

    const header = document.createElement("header");
    const index = document.createElement("span");
    index.className = "quote-list-index";
    index.textContent = String(number).padStart(3, "0");
    const theme = document.createElement("span");
    theme.className = "quote-theme";
    theme.textContent = quote.__themeName;
    const origin = document.createElement("span");
    origin.className = "quote-origin";
    origin.textContent = originLabel(quote);
    header.append(index, theme, origin);

    const body = document.createElement("div");
    body.className = "quote-list-body";
    if (quote.title_vi) {
      const title = document.createElement("h2");
      title.textContent = quote.title_vi;
      body.append(title);
    }
    const text = document.createElement("blockquote");
    text.textContent = quote.text_vi;
    body.append(text);
    if (quote.subtitle_vi) {
      const subtitle = document.createElement("p");
      subtitle.className = "quote-list-subtitle";
      subtitle.textContent = quote.subtitle_vi;
      body.append(subtitle);
    }

    const source = document.createElement("footer");
    const author = document.createElement("strong");
    author.textContent = quote.authorship?.author_name || quote.authorship?.source_label || "Selflo";
    const work = document.createElement("span");
    work.textContent = quote.authorship?.work ? displayWork(quote.authorship.work) : quote.authorship?.source_label || "Nội dung gốc Selflo";
    const detail = document.createElement("small");
    detail.textContent = quote.authorship?.source_detail || quote.id;
    const open = document.createElement("span");
    open.className = "quote-open-detail";
    open.textContent = "Xem chi tiết →";
    source.append(author, work, detail, open);

    link.append(header, body, source);
    return link;
  }

  function matchesFilters(quote) {
    const { query, source, author, work, theme } = state.filters;
    if (source !== "all" && quoteOrigin(quote) !== source && !(source === "author" && isExternalQuote(quote)) && !(source === "book" && quote.authorship?.work)) return false;
    if (author !== "all" && quote.authorship?.author_name !== author) return false;
    if (work !== "all" && quote.authorship?.work !== work) return false;
    if (theme !== "all" && quote.primary_theme !== theme) return false;
    if (!query) return true;
    return normalizeSearch([
      quote.id, quote.title_vi, quote.text_vi, quote.subtitle_vi, quote.__themeName,
      quote.authorship?.author_name, quote.authorship?.work, quote.authorship?.source_label,
      quote.authorship?.source_detail
    ].filter(Boolean).join(" ")).includes(normalizeSearch(query));
  }

  function sortQuotes(quotes) {
    return [...quotes].sort((left, right) => {
      if (state.filters.sort === "shortest") return left.text_vi.length - right.text_vi.length;
      if (state.filters.sort === "longest") return right.text_vi.length - left.text_vi.length;
      if (state.filters.sort === "theme") return left.__themeName.localeCompare(right.__themeName, "vi") || left.text_vi.localeCompare(right.text_vi, "vi");
      return sourceSortKey(left).localeCompare(sourceSortKey(right), "vi") || left.text_vi.localeCompare(right.text_vi, "vi");
    });
  }

  function resultTitle() {
    if (state.filters.work !== "all") return displayWork(state.filters.work);
    if (state.filters.author !== "all") return `Quote của ${state.filters.author}`;
    return ({ selflo: "Quote nguyên bản Selflo", author: "Quote theo tác giả", book: "Quote từ sách / tác phẩm", studio: "Bản thảo Selflo / Story Studio" })[state.filters.source] || "Tất cả quote";
  }

  function quoteOrigin(quote) {
    if (isExternalQuote(quote)) return quote.authorship?.work ? "book" : "author";
    const detail = `${quote.authorship?.source_label || ""} ${quote.authorship?.source_detail || ""}`;
    if (/Bản thảo Selflo|Story Studio|AI hỗ trợ/i.test(detail)) return "studio";
    return "selflo";
  }

  function originLabel(quote) {
    const origin = quoteOrigin(quote);
    if (origin === "book") return "Sách / tác phẩm";
    if (origin === "author") return "Tác giả";
    if (origin === "studio") return "Bản thảo / Studio";
    return "Selflo original";
  }

  function isExternalQuote(quote) {
    const authorID = quote.authorship?.author_id;
    return Boolean(authorID && authorID !== "selflo");
  }

  function sourceSortKey(quote) {
    return [quoteOrigin(quote), quote.authorship?.author_name, quote.authorship?.work, quote.__themeName].filter(Boolean).join(" ");
  }

  function displayWork(work) {
    const labels = {
      "The Meditations of the Emperor Marcus Aurelius Antoninus": "Suy tưởng · Meditations",
      "A Selection from the Discourses of Epictetus with the Encheiridion": "Encheiridion",
      "Moral Letters to Lucilius": "Thư gửi Lucilius",
      "The Tao Teh King, or the Tao and its Characteristics": "Đạo Đức Kinh",
      "The Analects of Confucius (from the Chinese Classics)": "Luận Ngữ",
      "Dhammapada, a Collection of Verses": "Dhammapada"
    };
    return labels[work] || work;
  }

  function uniqueSorted(values) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right, "vi"));
  }

  function validOption(select, value) {
    return [...select.options].some(option => option.value === value);
  }

  function normalizeSearch(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").trim();
  }

  function changePage(offset) {
    state.page += offset;
    renderQuotes();
    document.querySelector(".quote-results-heading").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateURL() {
    const url = new URL(window.location.href);
    const values = { q: state.filters.query, source: state.filters.source, author: state.filters.author, work: state.filters.work, theme: state.filters.theme, sort: state.filters.sort, page: state.page };
    Object.entries(values).forEach(([key, value]) => {
      const defaults = { q: "", source: "all", author: "all", work: "all", theme: "all", sort: "source", page: 1 };
      if (value === defaults[key]) url.searchParams.delete(key);
      else url.searchParams.set(key, String(value));
    });
    window.history.replaceState({}, "", url);
  }

  async function fetchJSON(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
  }
})();
