import { buildPrompt, generateSeeds } from "./seed-engine.mjs";

const $ = (id) => document.getElementById(id);
const state = { catalog: null, mode: "context_to_pair", result: null };

function option(value, label) {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = label;
  return element;
}

function fillSelect(id, items, autoLabel = "Tự chọn đa dạng") {
  const select = $(id);
  select.replaceChildren(option("auto", autoLabel), ...items.map((item) => option(item.id, item.label_vi)));
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-card").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });
  $("quoteFields").hidden = !["quote_to_story", "source_quote_to_story"].includes(mode);
  $("storyFields").hidden = mode !== "story_to_quote";
  if (mode === "source_quote_to_story") $("quoteFamily").value = "quote_family.verified_attributed_quote";
}

function renderModes() {
  const grid = $("modeGrid");
  grid.replaceChildren(...state.catalog.generation_modes.map((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mode-card";
    button.dataset.mode = mode.id;
    button.setAttribute("role", "radio");
    button.innerHTML = `<strong>${mode.label_vi}</strong><small>${mode.description_vi}</small>`;
    button.addEventListener("click", () => setMode(mode.id));
    return button;
  }));
  setMode(state.mode);
}

function requestFromForm() {
  const request = {
    mode: state.mode,
    context: $("context").value.trim(),
    quote_family: $("quoteFamily").value,
    observation_subfamily: $("observationSubfamily").value,
    theme: $("theme").value,
    anchor: $("anchor").value,
    situation: $("situation").value,
    style: $("style").value,
    seed_count: Number($("seedCount").value),
    write_count: Number($("writeCount").value),
    random_seed: Number($("randomSeed").value),
  };
  if (["quote_to_story", "source_quote_to_story"].includes(state.mode)) {
    request.quote = {
      id: $("quoteId").value.trim(),
      text: $("quoteText").value.trim(),
      author: $("quoteAuthor").value.trim(),
      work: $("quoteWork").value.trim(),
      source_url: $("quoteSourceUrl").value.trim(),
    };
  }
  if (state.mode === "story_to_quote") request.story = { id: $("storyId").value.trim(), summary: $("storySummary").value.trim() };
  return request;
}

function renderResult(result) {
  $("resultEmpty").hidden = true;
  $("resultContent").hidden = false;
  $("resultTitle").textContent = `${result.candidates.length} seed khác nhau`;
  $("findings").hidden = result.findings.length === 0;
  $("findings").textContent = result.findings.length ? `Chưa đủ gate: ${result.findings.join(" · ")}` : "";
  $("seedList").replaceChildren(...result.candidates.map((seed) => {
    const card = document.createElement("article");
    card.className = `seed-card${seed.selected_for_drafting ? " selected" : ""}`;
    card.innerHTML = `<header><h3>Seed ${seed.rank}${seed.selected_for_drafting ? " · viết full" : ""}</h3><span>${seed.fingerprint}</span></header>
      <p><strong>${seed.lens.label_vi}</strong> qua ${seed.protagonist.label_vi.toLowerCase()} ở ${seed.setting.label_vi.toLowerCase()}.</p>
      <div class="seed-tags"><span>${seed.style.label_vi}</span><span>${seed.shape.label_vi}</span><span>${seed.symbol_vi}</span><span>${seed.ending.label_vi}</span></div>
      <button class="seed-select" type="button">${seed.selected_for_drafting ? "Đang chọn ✓" : "Chọn seed này"}</button>`;
    card.querySelector(".seed-select").addEventListener("click", () => selectCandidate(seed.rank));
    return card;
  }));
  $("promptOutput").value = buildPrompt(result, state.catalog);
}

function selectCandidate(rank) {
  const limit = state.result.request.write_count;
  const selected = state.result.candidates.filter((item) => item.selected_for_drafting);
  const target = state.result.candidates.find((item) => item.rank === rank);
  if (target.selected_for_drafting && selected.length > 1) {
    target.selected_for_drafting = false;
  } else if (!target.selected_for_drafting) {
    if (selected.length >= limit) selected[0].selected_for_drafting = false;
    target.selected_for_drafting = true;
  }
  renderResult(state.result);
}

function submit() {
  $("errorMessage").hidden = true;
  try {
    state.result = generateSeeds(requestFromForm(), state.catalog);
    renderResult(state.result);
  } catch (error) {
    $("errorMessage").textContent = error.message;
    $("errorMessage").hidden = false;
  }
}

async function copyPrompt() {
  await navigator.clipboard.writeText($("promptOutput").value);
  const button = $("copyPrompt");
  button.textContent = "Đã copy ✓";
  window.setTimeout(() => { button.textContent = "Copy prompt"; }, 1800);
}

function downloadRequest() {
  const blob = new Blob([JSON.stringify(state.result.request, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "selflo-story-seed-request.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function start() {
  const response = await fetch("catalog.v1.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Không tải được catalog (${response.status}).`);
  state.catalog = await response.json();
  renderModes();
  fillSelect("quoteFamily", state.catalog.quote_families, "Tự chọn theo đầu vào");
  fillSelect("observationSubfamily", state.catalog.observation_subfamilies, "Tự chọn theo hoàn cảnh");
  fillSelect("theme", state.catalog.themes);
  fillSelect("anchor", state.catalog.anchors);
  fillSelect("situation", state.catalog.situations, "Tự suy từ hoàn cảnh");
  fillSelect("style", state.catalog.styles);
  $("quoteFamily").value = "quote_family.selflo_observational_metaphor";
  $("seedForm").addEventListener("submit", (event) => { event.preventDefault(); submit(); });
  $("copyPrompt").addEventListener("click", copyPrompt);
  $("downloadRequest").addEventListener("click", downloadRequest);
  $("regenerate").addEventListener("click", () => { $("randomSeed").value = Number($("randomSeed").value) + 1; submit(); });
}

start().catch((error) => {
  $("errorMessage").textContent = error.message;
  $("errorMessage").hidden = false;
});
