# Hướng dẫn đưa một story vào Selflo Release

Tài liệu này là nơi tra cứu duy nhất cho quy trình chuyển một story từ Authoring sang Release. Các ví dụ dùng `story.blue_eraser`; khi làm thật, thay ID và slug bằng story cần phát hành.

## Kết luận ngắn

Không move story và không sửa các file được sinh trong `authoring/` hoặc `release/`.

Nguồn sự thật duy nhất là:

```text
apps/selflo/perspective-library/source/vi/
```

Để một story có thể xuất hiện trong Release, tối thiểu phải:

1. Sửa lifecycle của story trong `source/vi/stories/<story-slug>/story.vi.json`.
2. Tìm quote đang gắn với story qua field `story_id` và kiểm tra lifecycle của quote trong `source/vi/quotes/<theme>/NNN.vi.json`.
3. Cập nhật version của canonical source trong `source/vi/source.json`.
4. Đảm bảo các gate toàn Library đã đạt, rồi chạy publisher Authoring trước và Release sau.
5. Kiểm tra package sinh ra trong `perspective-library/release/vi/`.

Chạy publisher chỉ tạo package local. App ngoài thực tế chỉ nhận được nội dung sau khi package được commit/push/deploy lên GitHub Pages trong một thao tác riêng.

## Cấu trúc thư mục bằng tiếng Việt

```text
apps/selflo/perspective-library/
├── RELEASE_STORY_GUIDE.vi.md       # Tài liệu đang đọc
│
├── source/vi/                      # NGUỒN CANONICAL: chỉ sửa dữ liệu ở đây
│   ├── source.json                 # Mục lục file + version của toàn nguồn
│   ├── stories/                    # Mỗi story nằm trong một folder riêng
│   │   └── <story-slug>/
│   │       └── story.vi.json       # Nội dung và lifecycle của story
│   ├── quotes/                     # Quote chia theo theme và fragment
│   │   └── <theme>/
│   │       └── NNN.vi.json         # Mảng quotes; quote nối story bằng story_id
│   ├── themes/                     # Metadata 9 theme + thứ tự quote fragments
│   ├── reading-intents/            # Nhóm nhu cầu đọc; nối tới story bằng story_ids
│   ├── knowledge/                  # Concepts, theories, frameworks, references
│   ├── provenance/                 # Mapping nguồn và bằng chứng nghiên cứu
│   └── decisions/                  # Quyết định owner, gồm exclusion có chủ đích
│
├── authoring/vi/                   # OUTPUT sinh tự động cho Owner Review/Debug
│   ├── manifest.json               # Trỏ đến revision hiện hành
│   ├── stories/...rN.json          # Bản revision bất biến
│   ├── themes/...rN.json
│   └── audit/rN.json               # Nhật ký mỗi lần publish
│
├── release/vi/                     # OUTPUT sinh tự động cho Release app
│   ├── manifest.json
│   ├── stories/...rN.json
│   ├── themes/...rN.json
│   └── audit/rN.json
│
└── tooling/schema/                 # JSON Schema dùng để validate
```

Quy tắc quan trọng:

- Chỉ `source/vi/` là nguồn để biên tập.
- `authoring/vi/` và `release/vi/` là output revisioned, không sửa tay và không move file vào đó.
- `perspective-library/vi/` ở root là package cũ/legacy; publisher hiện tại không ghi vào đây.
- Review ledger trên website chỉ là ghi nhớ quyết định trong browser. Nó không thay đổi canonical JSON, quyền sử dụng hay trạng thái Release.

## Story và quote được nối với nhau như thế nào?

Story tự khai báo stable ID trong file của nó:

```json
{
  "id": "story.blue_eraser",
  "primary_theme": "change_growth"
}
```

Quote là phía giữ liên kết đến story:

```json
{
  "id": "eraser_shrinks_as_letters_straighten",
  "primary_theme": "change_growth",
  "story_id": "story.blue_eraser"
}
```

Vì vậy, muốn biết quote nào gắn với một story, hãy tìm `story_id` trong toàn bộ canonical quote fragments:

```bash
cd /Users/dungvo/xcode/dungvo.github.io
rg -n '"story_id": "story.blue_eraser"' \
  apps/selflo/perspective-library/source/vi/quotes
```

Kết quả cho biết chính xác file quote cần xem hoặc cập nhật. Ví dụ hiện tại của `story.blue_eraser` nằm trong:

```text
apps/selflo/perspective-library/source/vi/quotes/change_growth/002.vi.json
```

Có thể in nhanh ID, quyền và trạng thái review của quote bằng:

```bash
for file in apps/selflo/perspective-library/source/vi/quotes/*/*.json; do
  jq -r '
    .quotes[]
    | select(.story_id == "story.blue_eraser")
    | [input_filename, .id, .rights.status, .review.status]
    | @tsv
  ' "$file"
done
```

Phân biệt ba loại liên kết:

- `quote.story_id`: quote nào mở story nào. Đây là liên kết cần tìm khi Release một cặp quote/story.
- `reading-intent.story_ids`: story thuộc nhóm nhu cầu đọc nào. Đây là phân loại khám phá, không phải liên kết quote/story.
- `source.json.files`: story/quote fragment nằm ở file nào. Đây là mục lục nguồn, không phải lifecycle approval.

`story_id` được phép là `null`. Một quote không bắt buộc phải có story. Theo định hướng biên tập hiện tại, nếu có liên kết thì nên là một quote ↔ một story riêng, không tái sử dụng một story cho nhiều quote.

## Các bước đưa một story vào Release

### Bước 1 — Xác định story canonical

Mở:

```text
apps/selflo/perspective-library/source/vi/stories/<story-slug>/story.vi.json
```

Ghi lại:

- `id`: stable story ID, ví dụ `story.blue_eraser`.
- `primary_theme`: theme chính, ví dụ `change_growth`.
- `status`, `rights.status`, `review.status`: lifecycle hiện tại.

Không đổi `id`, slug hoặc đường dẫn chỉ để duyệt story. Không move file.

### Bước 2 — Tìm quote gắn với story

Dùng lệnh `rg` ở phần trên để tìm toàn bộ quote có:

```json
"story_id": "<stable-story-id>"
```

Kiểm tra các trường hợp:

- Không tìm thấy quote: story có thể tồn tại độc lập, nhưng sẽ không được mở từ một quote. Chỉ thêm liên kết sau khi có quyết định biên tập rõ ràng.
- Tìm thấy đúng một quote: đây là trạng thái mong muốn cho cặp quote/story.
- Tìm thấy nhiều quote: dừng lại và review mapping; không mặc định cho nhiều quote dùng chung story.

Theo quy ước biên tập, story và quote nên cùng `primary_theme`. Publisher hiện kiểm tra từng theme/story ID có tồn tại nhưng không có gate riêng để chặn một cặp quote/story lệch theme, vì vậy cần kiểm tra điểm này bằng review.

### Bước 3 — Chuyển lifecycle của story sang Release-ready

Trong story canonical, cập nhật ba nhóm field sau sau khi đã review nội dung và quyền thật sự:

```json
{
  "status": "active",
  "rights": {
    "status": "selflo_owned",
    "note": "Owner xác nhận nội dung thuộc quyền phát hành của Selflo."
  },
  "review": {
    "status": "approved",
    "reviewed_by": "owner:dungvo",
    "reviewed_at": "2026-09-06T00:00:00Z"
  }
}
```

Thay timestamp mẫu bằng thời điểm duyệt thật. Có thể lấy UTC hiện tại bằng:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Điều kiện story Release-ready:

- `status` phải là `active`.
- `review.status` phải là `approved`.
- `reviewed_by` phải có giá trị.
- `reviewed_at` phải là UTC timestamp kết thúc bằng `Z` hoặc `+00:00`.
- `rights.status` không được là `unverified`.

Các giá trị rights hợp lệ cho Release là:

- `selflo_owned`
- `public_domain`
- `licensed`
- `permission_granted`

Chỉ chọn trạng thái phản ánh đúng bằng chứng quyền sử dụng. Không đổi `unverified` chỉ để vượt qua validation.

Nếu owner đã trực tiếp biên tập nội dung, có thể đổi:

```json
"editorial": {
  "human_edited": true
}
```

Chỉ đổi field này khi điều đó đúng trong thực tế; `human_edited` không tự nó làm story Release-ready.

### Bước 4 — Chuyển quote liên kết sang Release-ready

Trong fragment tìm được ở Bước 2, locate đúng quote bằng `id`, sau đó kiểm tra:

```json
{
  "story_id": "story.blue_eraser",
  "rights": {
    "status": "selflo_owned",
    "note": null
  },
  "review": {
    "status": "approved",
    "reviewed_by": "owner:dungvo",
    "reviewed_at": "2026-09-06T00:00:00Z"
  }
}
```

Điều kiện quote Release-ready:

- `review.status` là `approved`, có reviewer và UTC timestamp.
- `rights.status` không phải `unverified`.
- `story_id` trỏ đúng stable ID của story nếu muốn quote mở story.

Không thêm field `status` vào từng quote: schema quote không có field này. Publisher Release tự project envelope của theme sang `status = approved`.

Nếu quote Release-ready nhưng story chưa Release-ready, publisher vẫn giữ quote và tự đổi `story_id` thành `null` trong output Release. Vì vậy chỉ approve story mà quên quote, hoặc chỉ approve quote mà quên story, đều không tạo được cặp quote/story hoàn chỉnh trên app.

### Bước 5 — Cập nhật version của canonical source

Trong:

```text
apps/selflo/perspective-library/source/vi/source.json
```

- Tăng `source_revision` lên 1.
- Đổi `content_version` thành nhãn mô tả batch mới.
- Không thay descriptor/path của story hoặc quote fragment nếu file không được move hay tạo mới.
- Không đổi `canonical_quote_count` khi chỉ cập nhật lifecycle.

Ví dụ:

```json
{
  "source_revision": 17,
  "content_version": "release-blue-eraser-17"
}
```

Publisher có thể nhận biết thay đổi qua digest, nhưng tăng source version là quy ước cần giữ để audit và lịch sử biên tập dễ hiểu.

### Bước 6 — Kiểm tra các gate toàn Library

Release publisher là gate của toàn bộ Library, không phải lệnh phát hành riêng một story. Một story hoàn chỉnh vẫn chưa đủ để publisher thành công nếu các thành phần khác còn pending.

Các gate chính:

1. Mọi quote trong canonical source phải Release-valid (`review = approved` và rights đã xác minh), hoặc phải có explicit owner exclusion trong `source/vi/decisions/canonical-decisions.json`.
2. Knowledge Catalog phải có `status = approved`.
3. Mọi concept phải có `status = approved`.
4. Mọi theory và framework phải có `status = approved` và `validation_status = source_checked`.
5. Mọi reference phải có `validation_status = source_checked`.
6. Reading Intent Catalog nếu vẫn là `content_preview` sẽ bị bỏ khỏi Release; nó không chặn Release. Nếu muốn đưa catalog này vào Release, đổi sang `approved` sau khi review thật sự.
7. Mọi ID và reference phải resolve; theme của story phải tồn tại, knowledge IDs của quote/story phải hợp lệ.

Không bulk-approve Knowledge, rights hoặc quote chỉ để làm publisher pass. Các field này đại diện cho review nội dung, kiểm tra nguồn và quyết định quyền thật.

`source/vi/decisions/canonical-decisions.json` chỉ cần sửa khi owner chủ động loại một quote khỏi Release và có lý do rõ ràng. Không dùng exclusion để đánh dấu một story là approved.

### Bước 7 — Publish Authoring để review trước

Từ root repository:

```bash
cd /Users/dungvo/xcode/dungvo.github.io
./scripts/publish-perspective-library --channel authoring
```

Publisher sẽ:

- Validate schema và references.
- Tạo immutable revision mới cho entity đã đổi.
- Cập nhật `authoring/vi/manifest.json`.
- Tạo `authoring/vi/audit/rN.json`.
- Không tự commit hoặc push.

Mở Owner Review/Preview để kiểm tra nội dung, quote và story trước khi tạo Release.

### Bước 8 — Tạo package Release local

Khi toàn bộ Release gate đã đạt:

```bash
./scripts/publish-perspective-library --channel release
```

Output đúng nằm tại:

```text
apps/selflo/perspective-library/release/vi/
```

Publisher phải kết thúc thành công. Nếu fail, đọc lỗi đầu tiên và sửa canonical source; không sửa output để lách gate.

### Bước 9 — Kiểm tra output Release

Xác nhận manifest có story:

```bash
jq -r '
  .files[]
  | select(.id == "story.blue_eraser")
  | [.id, .revision, .path, .sha256]
  | @tsv
' apps/selflo/perspective-library/release/vi/manifest.json
```

Lấy path story từ manifest và kiểm tra lifecycle trong revisioned output. Sau đó tìm quote trong các theme output và xác nhận `story_id` chưa bị project thành `null`:

```bash
for file in apps/selflo/perspective-library/release/vi/themes/*.json; do
  jq -r '
    .quotes[]
    | select(.story_id == "story.blue_eraser")
    | [input_filename, .id, .story_id, .rights.status, .review.status]
    | @tsv
  ' "$file"
done
```

Kiểm tra audit mới nhất để xem:

- `changed_file_ids`
- `reused_file_ids`
- `story_links_projected_to_null`
- `explicit_quote_exclusions`
- manifest digest

Nếu story xuất hiện trong manifest và quote vẫn giữ đúng `story_id`, package local đã sẵn sàng về mặt dữ liệu.

## Package local, GitHub Pages và app là ba mốc khác nhau

### 1. Package Release local

Hoàn thành khi publisher Release chạy thành công và output đã được kiểm tra. Chưa có gì thay đổi trên GitHub hoặc thiết bị người dùng.

### 2. Package Release online

App Release được cấu hình đọc từ:

```text
https://dungvo.github.io/apps/selflo/perspective-library/release/vi
```

Muốn endpoint này thay đổi thì output Release phải được commit/push/deploy lên GitHub Pages ở một thao tác riêng. Publisher không tự làm việc đó.

### 3. App thực sự dùng Library Release

Cấu hình hiện tại nằm trong repository app Selflo:

```text
/Users/dungvo/xcode/Selflo/Selflo/App/PerspectiveContentConfiguration.swift
```

`publicRelease` đã dùng endpoint Release nhưng hiện `usesLibraryFeed = false`. Điều này có nghĩa là chỉ publish dữ liệu chưa đảm bảo production feed hiển thị story. Trước lần cutover thật, cần xác nhận app Release đã bật và sử dụng Perspective Library feed theo kế hoạch sản phẩm. Đây là thay đổi code app riêng, không phải lý do để sửa canonical content hoặc generated output.

## Bảng tra cứu file cần sửa

| Mục đích | File | Khi nào sửa? |
|---|---|---|
| Duyệt và kích hoạt story | `source/vi/stories/<slug>/story.vi.json` | Luôn cần |
| Duyệt quote và giữ liên kết story | `source/vi/quotes/<theme>/NNN.vi.json` | Khi story được mở từ quote |
| Tăng version canonical | `source/vi/source.json` | Mỗi batch canonical |
| Approve nguồn tri thức | `source/vi/knowledge/knowledge.vi.json` | Chỉ sau source review thật |
| Đưa Reading Intent vào Release | `source/vi/reading-intents/reading-intents.vi.json` | Tùy chọn; chỉ sau review |
| Loại quote có chủ đích | `source/vi/decisions/canonical-decisions.json` | Chỉ khi owner quyết định exclude |
| Authoring manifest/revisions/audit | `authoring/vi/**` | Không sửa tay |
| Release manifest/revisions/audit | `release/vi/**` | Không sửa tay |
| Package legacy | `perspective-library/vi/**` | Không dùng làm source |

## Checklist cuối cùng

Trước khi coi một story đã sẵn sàng:

- [ ] Đang sửa đúng file trong `source/vi/`, không phải generated output.
- [ ] Story giữ nguyên stable `id` và path.
- [ ] Story có `status = active`.
- [ ] Story có rights đã xác minh.
- [ ] Story có `review.status = approved`, reviewer và UTC timestamp.
- [ ] Đã tìm quote bằng `story_id` trong canonical quote fragments.
- [ ] Nếu có quote liên kết, quote có rights và review Release-ready.
- [ ] Quote và story có cùng `primary_theme`.
- [ ] `source_revision` và `content_version` đã được cập nhật.
- [ ] Không sửa tay `authoring/`, `release/` hoặc package legacy.
- [ ] Authoring publisher chạy thành công và nội dung đã được preview.
- [ ] Các gate toàn Library đã đạt bằng review thật hoặc explicit owner decision.
- [ ] Release publisher chạy thành công.
- [ ] Release manifest chứa story.
- [ ] Quote trong Release vẫn giữ đúng `story_id`, không bị đổi thành `null`.
- [ ] Đã phân biệt rõ package local với publish GitHub Pages.
- [ ] Trước production cutover, app đã thực sự bật/use Library Release feed.
