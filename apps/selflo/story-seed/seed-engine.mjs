const MODES = new Set(["quote_to_story", "story_to_quote", "context_to_pair", "source_quote_to_story"]);

export function indexById(items) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateRequest(request, catalog) {
  const mode = request.mode || "context_to_pair";
  if (!MODES.has(mode)) throw new Error(`Mode không hợp lệ: ${mode}`);
  const max = catalog.diversity_policy.maximum_seed_count;
  const seedCount = Number(request.seed_count ?? catalog.diversity_policy.default_seed_count);
  const writeCount = Number(request.write_count ?? catalog.diversity_policy.default_write_count);
  if (!Number.isInteger(seedCount) || seedCount < 1 || seedCount > max) throw new Error(`Số seed phải từ 1 đến ${max}.`);
  if (!Number.isInteger(writeCount) || writeCount < 1 || writeCount > seedCount) throw new Error("Số bản viết full phải từ 1 đến số seed.");
  const quote = request.quote || {};
  const story = request.story || {};
  if (mode === "quote_to_story" && !text(quote.id) && !text(quote.text)) throw new Error("Quote → Story cần Quote ID hoặc nội dung quote.");
  if (mode === "story_to_quote" && !text(story.id) && !text(story.summary)) throw new Error("Story → Quote cần Story ID hoặc tóm tắt.");
  if (mode === "context_to_pair" && !text(request.context)) throw new Error("Hoàn cảnh → Cặp mới cần một hoàn cảnh cụ thể.");
  if (mode === "source_quote_to_story" && !text(quote.text)) throw new Error("Danh ngôn/sách → Story cần nguyên văn quote.");

  const findings = [];
  const families = indexById(catalog.quote_families);
  const family = families[request.quote_family || quote.family || ""];
  if (mode === "source_quote_to_story" || family?.requires_provenance) {
    const missing = ["author", "work", "source_url"].filter((field) => !text(quote[field]));
    if (missing.length) findings.push(`needs_source:${missing.join(",")}`);
    if (!text(quote.rights_status)) findings.push("needs_rights_review");
  }
  return findings;
}

function rngFrom(seed) {
  let state = (Number(seed) || 42) >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function pick(items, rng) { return items[Math.floor(rng() * items.length)]; }

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cycle(items, count, rng) {
  const result = [];
  while (result.length < count) result.push(...shuffle(items, rng));
  return result.slice(0, count);
}

function weighted(items, count, rng) {
  const pool = items.flatMap((item) => Array(Math.max(1, Number(item.auto_weight || 1))).fill(item));
  return shuffle(Array.from({ length: count }, () => pick(pool, rng)), rng);
}

function fingerprint(candidate) {
  const source = [candidate.lens.id, candidate.shape.id, candidate.protagonist.id, candidate.setting.id, candidate.guide.id, candidate.ending.id].join("|");
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function generateSeeds(request, catalog) {
  const findings = validateRequest(request, catalog);
  const seedCount = Number(request.seed_count ?? catalog.diversity_policy.default_seed_count);
  const writeCount = Number(request.write_count ?? catalog.diversity_policy.default_write_count);
  const randomSeed = Number(request.random_seed ?? 42);
  const rng = rngFrom(randomSeed);
  const themes = indexById(catalog.themes);
  const situations = indexById(catalog.situations);
  let situation = situations[request.situation];
  let theme = request.theme && request.theme !== "auto" ? themes[request.theme] : null;
  if (!theme && situation?.theme_ids?.length) theme = themes[pick(situation.theme_ids, rng)];
  if (!theme) theme = pick(catalog.themes, rng);
  if (!situation) {
    const matches = catalog.situations.filter((item) => item.theme_ids.includes(theme.id));
    situation = pick(matches.length ? matches : catalog.situations, rng);
  }

  const anchors = indexById(catalog.anchors);
  const compatibleAnchors = catalog.anchors.filter((item) => item.theme_ids.includes(theme.id));
  const anchorChoices = request.anchor && request.anchor !== "auto" ? [anchors[request.anchor]] : (compatibleAnchors.length ? compatibleAnchors : catalog.anchors);
  const styles = indexById(catalog.styles);
  const styleSchedule = request.style && request.style !== "auto"
    ? Array(seedCount).fill(styles[request.style])
    : weighted(catalog.styles, seedCount, rng);
  const lenses = cycle(catalog.narrative_lenses, seedCount, rng);
  const protagonists = cycle(catalog.protagonists, seedCount, rng);
  const endings = cycle(catalog.ending_mechanisms, seedCount, rng);
  const anchorSchedule = cycle(anchorChoices, seedCount, rng);
  const settings = shuffle(catalog.settings, rng).sort((a, b) => Number(["work", "nature"].includes(a.domain)) - Number(["work", "nature"].includes(b.domain)));
  const settingSchedule = cycle(settings, seedCount, rng);
  const guides = weighted(catalog.guide_roles, seedCount, rng);
  const noGuide = indexById(catalog.guide_roles)["guide.none"];
  const minimumNoGuide = Math.min(seedCount, Math.max(1, Math.round(seedCount * .7)));
  for (let index = 0; index < minimumNoGuide; index += 1) guides[index] = noGuide;

  const candidates = Array.from({ length: seedCount }, (_, index) => {
    const style = styleSchedule[index];
    const shapes = catalog.story_shapes.filter((shape) => shape.allowed_styles.includes(style.id));
    const setting = settingSchedule[index];
    const symbols = setting.symbol_candidates_vi || ["một chi tiết đời thường"];
    const candidate = {
      rank: index + 1,
      selected_for_drafting: index < writeCount,
      theme,
      anchor: anchorSchedule[index],
      situation,
      style,
      lens: lenses[index],
      shape: shapes[index % shapes.length],
      protagonist: protagonists[index],
      setting,
      guide: guides[index],
      ending: endings[index],
      symbol_vi: symbols[index % symbols.length],
      motifs_to_avoid_vi: catalog.motif_cooldown,
    };
    return { ...candidate, fingerprint: fingerprint(candidate) };
  });

  return {
    schema_version: "selflo.story-seed-result.v1",
    catalog_revision: catalog.catalog_revision,
    request: { ...request, seed_count: seedCount, write_count: writeCount, random_seed: randomSeed },
    editorial_contract: { pairing: "one_quote_one_unique_story", shared_story_reuse: false, runtime_story_id_remains_nullable_during_migration: true },
    findings,
    candidates,
  };
}

export function buildPrompt(result, catalog) {
  const request = result.request;
  const quote = request.quote || {};
  const story = request.story || {};
  const target = [
    `- Chế độ: \`${request.mode}\``,
    `- Hoàn cảnh: ${request.context || "(không cung cấp)"}`,
    `- Nhóm quan sát đời thường: \`${request.observation_subfamily || "auto"}\``,
    ...(Object.keys(quote).length ? [`- Quote ID: ${quote.id || "(tạo mới)"}`, `- Quote: ${quote.text || "(AI tạo mới)"}`, `- Tác giả/nguồn: ${quote.author || "(chưa có)"} / ${quote.work || "(chưa có)"}`] : []),
    ...(Object.keys(story).length ? [`- Story ID: ${story.id || "(tạo mới)"}`, `- Tóm tắt story: ${story.summary || "(AI tạo mới)"}`] : []),
  ].join("\n");
  const seeds = result.candidates.map((item) => `### Seed ${item.rank} — ${item.selected_for_drafting ? "VIẾT FULL" : "CHỈ SO SÁNH"}
- Theme / anchor: ${item.theme.label_vi} / ${item.anchor.label_vi}
- Lens / shape: ${item.lens.label_vi} / ${item.shape.label_vi}
- Nhân vật / bối cảnh: ${item.protagonist.label_vi} / ${item.setting.label_vi}
- Vật neo: ${item.symbol_vi}
- Người dẫn: ${item.guide.label_vi}
- Kết: ${item.ending.label_vi}
- Phong cách: ${item.style.label_vi}
- Fingerprint: \`${item.fingerprint}\``).join("\n\n");
  const selected = result.candidates.filter((item) => item.selected_for_drafting).map((item) => item.rank).join(", ");
  return `Bạn là biên tập viên Story Studio của Selflo. Hãy tạo nội dung tiếng Việt theo brief dưới đây.

## Mục tiêu và đầu vào
${target}
- Quote family: \`${request.quote_family || "quote_family.selflo_observational_metaphor"}\`
- Findings cần xử lý trước release: ${result.findings.join(", ") || "không có"}

## Pairing contract bắt buộc
- Một quote chỉ có một story riêng; không dùng chung story giữa nhiều quote.
- Nếu quote chưa có story: tạo story mới riêng cho quote đó.
- Nếu story chưa có quote: tạo một quote mới riêng, cô đọng đúng insight của story.
- Cluster chỉ dùng để phát hiện trùng và quản lý backlog, không cho phép tái sử dụng story.
- Không tự đánh dấu approved, verified hoặc release-ready. Không commit, push hay publish.

## Seed candidates
${seeds}

Chỉ viết bản hoàn chỉnh cho seed: ${selected}. Những seed còn lại chỉ dùng để kiểm tra độ khác biệt.

## Yêu cầu viết
- Giữ một cơ chế tâm lý hoặc triết lý chính; không nhồi nhiều bài học.
- Để lựa chọn, hậu quả và chi tiết đời thường làm insight lộ ra; tránh nhân vật giảng đạo.
- Không bắt chước câu chữ, nhân vật hay cốt truyện của một tác giả/tác phẩm cụ thể.
- Tông Selflo: giản dị, giàu hình ảnh, ấm nhưng không hô khẩu hiệu và không hứa vũ trụ sẽ thưởng.
- Tránh motif đang cooldown: ${catalog.motif_cooldown.join(", ")}.
- Quote quan sát dựa vào cơ thể/y khoa/khoa học phải có fact gate.
- Danh ngôn/sách phải giữ provenance riêng; story là sáng tác nguyên bản, không mượn plot của nguồn.

## Output bắt buộc — sẵn sàng đưa vào canonical Authoring sau review
Trả về đúng thứ tự dưới đây. JSON phải parse được, không có comment và không thêm prose vào trong code fence.

1. \`seed_review\`: giải thích ngắn vì sao seed được chọn khác corpus hiện có.
2. Một code fence \`json\` có heading filename:
   \`apps/selflo/perspective-library/source/vi/stories/<story-slug>/story.vi.json\`
   - Dùng đầy đủ shape \`perspective_story\` schema 1.0: \`schema_version, entity, id, revision, status, language, title_vi, subtitle_vi, hero_image, primary_theme, metadata, sections, takeaway, authorship, editorial, rights, review\`.
   - Mỗi section và block có stable ID; 3–6 section; block chỉ dùng loại schema cho phép.
   - Giữ \`status=draft\`, \`review.status=needs_owner_review\`, \`rights.status=unverified\`, \`editorial.human_edited=false\`; không tự nâng lifecycle.
3. Một code fence \`json\` có heading filename:
   \`apps/selflo/perspective-library/source/vi/quotes/<primary-theme>/<next-batch>.vi.json\`
   - Dùng shape \`selflo.perspective.quote-fragment.v1\` với \`entity=perspective_quote_fragment\`, \`fragment_id\`, \`primary_theme\` và mảng \`quotes\`.
   - Quote phải đầy đủ field theo Perspective Theme schema 1.0, gắn đúng \`story_id\` vừa tạo và giữ lifecycle Authoring fail-closed.
4. \`pairing_ledger\`: đúng một quote ID ↔ đúng một story ID.
5. \`diversity_fingerprint\`: lens, shape, protagonist, setting, guide, ending, motif.
6. \`review_flags\`: nguồn, rights, fact, trùng nội dung và các điểm owner phải duyệt.

Không sửa \`source.json\`, không chạy publisher, không commit/push. Maintainer sẽ validate, thêm fragment vào index và publish Authoring Preview sau khi owner review.`;
}
