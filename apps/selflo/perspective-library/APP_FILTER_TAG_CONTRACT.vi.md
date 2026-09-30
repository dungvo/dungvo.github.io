# Shared contract: tag lọc nội dung giữa Selflo app và content

**Contract ID:** `selflo.content-tags.v1`

**Trạng thái:** Active

**Owner:** Selflo app + Selflo content

**Cập nhật:** 2026-09-30

**Release đầu tiên:** Perspective Library Release 34

Đây là **nguồn chuẩn duy nhất** cho format tag lọc nội dung giữa app và content. Không duy trì một bản taxonomy/semantics thứ hai trong app repo. App repo chỉ giữ consumer conformance note trỏ về tài liệu này.

## 1. Các nguồn chuẩn đi cùng contract

- Contract con người đọc: file này.
- Runtime taxonomy: `source/vi/content-tags/content-tags.vi.json`.
- Quote schema: `tooling/schema/perspective-theme.schema.json`.
- Catalog schema: `tooling/schema/perspective-content-tag-catalog.schema.json`.
- Manifest schema: `tooling/schema/perspective-library-manifest.schema.json`.
- Release gate: `scripts/publish-perspective-library`.
- Coverage/review report: `tooling/content-tag-backfill-r33.json` và audit của từng Release.
- Public package app đọc: `release/vi/manifest.json` cùng các immutable descriptor của manifest.

Nếu tài liệu app, fallback catalog hoặc UI copy khác các nguồn trên, contract và catalog trong content repo thắng. App không được tự suy taxonomy từ theme, keyword hoặc provenance.

## 2. Phạm vi v1

- Public filter áp dụng trên **quote**.
- Story không phát filter tags trong v1.
- Quote liên kết nội dung đọc sâu bằng `story_id`.
- **Ưu tiên câu chuyện** là hard filter: chỉ giữ quote có `story_id` resolve được thành story mở được trong cùng active Library session; count bằng 0 không fallback.
- Tags không thay thế `primary_theme`, knowledge metadata, authorship/provenance, rights hoặc review.

## 3. Wire format

Quote dùng một field generic:

```json
"tags": [
  "intent:calm",
  "support:soothe",
  "topic:attention_presence",
  "origin:selflo"
]
```

- Grammar: `<dimension_id>:<value_id>`.
- Mỗi phần khớp `^[a-z][a-z0-9_]*$`.
- Quote lưu full tag; catalog lưu `dimension.id` và local `value.id`.
- Không thêm field song song như `intent_ids`, `topic_ids`, `support_modes` hoặc `origin_type`.
- Unknown tag, tag trùng hoặc sai cardinality làm Release fail closed.

Mỗi immutable Library Release phải có đúng một descriptor kind `content_tag_catalog`. Catalog shape:

```json
{
  "schema_version": "selflo.content-tags.v1",
  "content_version": "content-tags-vi-1",
  "entity": "content_tag_catalog",
  "language": "vi",
  "dimensions": [
    {
      "id": "intent",
      "title_vi": "Điều bạn đang quan tâm",
      "selection": "multiple",
      "matching": "required_any",
      "display_order": 10,
      "release_min_count": 1,
      "values": [
        {
          "id": "calm",
          "title_vi": "Bình tâm",
          "icon_key": null,
          "display_order": 10
        }
      ]
    }
  ]
}
```

`release_min_count` là publisher metadata; app được phép bỏ qua khi decode.

## 4. Matching semantics v1

App v1 hỗ trợ duy nhất:

- `selection`: `single` hoặc `multiple`;
- `matching`: `required_any`;
- OR giữa các value đang chọn trong cùng dimension;
- AND giữa các dimension đang có lựa chọn;
- count lấy quote làm đơn vị và tính sau hard filter story nếu toggle bật;
- tag có coverage 0 trả đúng 0, không fallback.

Ranking chỉ chạy sau filter và không được đưa quote đã bị loại trở lại pool.

## 5. Taxonomy v1

Runtime catalog là nguồn chuẩn cho nhãn và thứ tự. Stable IDs đã phát hành:

- `intent`: `calm`, `reduce_anxiety`, `understand_self`, `overcome_adversity`, `personal_growth`, `relationships`, `work_direction`, `meaning`.
- `support`: `soothe`, `clarify`, `motivate`, `small_action`, `new_perspective`.
- `topic`: `attention_presence`, `emotions`, `self_understanding`, `change_growth`, `adversity_recovery`, `relationships`, `work_choices`, `meaning_values`, `rest_wellbeing`, `learning_habits`.
- `origin`: `selflo`, `book_or_work`, `research`, `classical_text`, `folklore`.

`origin` là single và phải dựa trên provenance đã kiểm tra, không suy từ text. Ba dimension còn lại là multiple nhưng chỉ gắn giá trị được nội dung thật hỗ trợ.

## 6. Release contract

Authoring được phép thiếu catalog hoặc thiếu tags để biên tập. Mọi Release mới phải fail closed nếu:

1. không có đúng một catalog hợp lệ;
2. quote thiếu số tag mà `release_min_count` yêu cầu;
3. tag sai grammar, trùng hoặc không tồn tại trong catalog;
4. dimension `single` có nhiều hơn một value;
5. `origin:*` không nhất quán với provenance;
6. `story_id` không resolve được thành story mở được;
7. rights/review/source gate hiện tại không đạt.

Publisher phải xuất coverage theo tag cho cả pool bình thường và pool `has_openable_story`, cùng missing/overlap/zero coverage. App vẫn đọc được package legacy không catalog, nhưng publisher không được tạo Release mới kiểu legacy.

## 7. Khi nào content thay đổi mà không cần sửa app

Không cần app release mới khi thay đổi vẫn nằm trong v1:

- thêm quote với tags hợp lệ;
- sửa tags của quote;
- đổi `title_vi`, `icon_key` hoặc `display_order`;
- thêm value hoặc dimension dùng `single|multiple` + `required_any`;
- tăng Release revision với cùng wire format và semantics.

Mọi quote mới muốn vào Release phải đủ tags và vượt publisher gate. ID đã phát hành không được tái sử dụng với nghĩa khác; muốn đổi nghĩa phải tạo ID mới.

## 8. Khi nào bắt buộc phối hợp và sửa app trước

Phải nâng contract/app trước khi content Release dùng:

- `schema_version` mới;
- grammar hoặc nơi lưu tag mới;
- `selection` ngoài `single|multiple`;
- `matching` ngoài `required_any`, như scoring, boost hoặc required-all;
- filter trực tiếp trên story;
- thay hard filter story thành ranking/fallback;
- thay semantics OR-trong-dimension/AND-giữa-dimension;
- field catalog bắt buộc mà decoder/validator app hiện chưa hỗ trợ.

Trình tự bắt buộc: cập nhật proposal trong file này → app implement/decode/test và release tương thích → content schema/publisher → Authoring verification → Release content. Không publish content đòi capability app chưa có.

## 9. Quy trình đối chiếu thay đổi

Mỗi thay đổi phải trả lời bốn câu hỏi trong PR/commit:

1. `Contract ID/schema_version` có đổi không?
2. App cũ có decode và giữ đúng semantics không?
3. Publisher có fail closed cho trạng thái không tương thích không?
4. Coverage và hard-filter story có còn phản ánh dữ liệu thật không?

Nếu chỉ content-compatible, cập nhật catalog/source, chạy publisher tests và coverage rồi phát hành Release. Nếu app-impacting, cập nhật phần 8 và compatibility table dưới đây trước khi viết dữ liệu production.

## 10. Compatibility table

| Contract | App support | Content Release | Trạng thái |
|---|---|---|---|
| `selflo.content-tags.v1` | Generic catalog; single/multiple; required_any; OR/AND; hard story filter | Release 34+ | Active |
| Legacy không catalog | App hiển thị quote khi không chọn tag | Release ≤33 | Read-only compatibility |

## 11. Change log

- **2026-09-30 — v1 active:** quote-only tags, four dimensions, generic catalog, required-any matching, hard story filter; Release 34 là production package đầu tiên. Publisher bắt buộc catalog và required tag coverage cho mọi Release mới.
