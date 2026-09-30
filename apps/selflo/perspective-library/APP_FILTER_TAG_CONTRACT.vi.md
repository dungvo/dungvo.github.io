# Contract tag lọc nội dung giữa Selflo app và content repo

**Trạng thái:** Accepted v1  
**Cập nhật:** 2026-09-30  
**Phạm vi:** Authoring source, publisher và Release Library của Góc nhìn. Public filter v1 áp dụng trên quote; story chỉ tham gia qua liên kết `story_id`.

Tài liệu này là checklist phía content để Library tương thích với app đã hỗ trợ bộ lọc generic. Việc thêm tài liệu **không tự thay đổi Release**; publisher và dữ liệu chỉ được cập nhật ở một batch riêng sau khi app đã phát hành.

## 1. Data contract đã chốt

Quote có một field generic duy nhất:

```json
"tags": [
  "intent:calm",
  "support:soothe",
  "topic:attention_presence",
  "origin:selflo"
]
```

- Grammar: `<dimension_id>:<value_id>`.
- `dimension_id` và `value_id` phải khớp `^[a-z][a-z0-9_]*$`.
- Không tạo field cứng như `intent_ids`, `topic_ids`, `support_modes` hoặc app-facing `origin_type`.
- `tags` không thay thế provenance, rights, review, knowledge metadata hoặc `primary_theme` hiện có.
- Quote là đơn vị duy nhất app dùng để tính số kết quả và lọc trong contract v1.
- Story không phát `tags` trong contract v1. `story_id` trên quote chỉ liên kết tới nội dung đọc sâu.
- Khi bật **Ưu tiên câu chuyện**, app hard-filter và chỉ giữ quote có `story_id` resolve được thành story có thể mở trong active Library session. Không fallback sang quote không có story khi kết quả bằng 0.

Library phải publish đúng một file kind `content_tag_catalog` trong manifest. Catalog là source of truth versioned cho dimension/value, nhãn tiếng Việt, thứ tự và cách chọn:

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

Catalog lưu `value.id` dạng local ID như `calm`; app ghép `dimension.id + ":" + value.id` thành tag đầy đủ `intent:calm`. Quote luôn lưu tag đầy đủ. `release_min_count` là publisher metadata; app có thể decode hoặc bỏ qua field này nhưng publisher Release phải thực thi.

App v1 chỉ hỗ trợ:

- `selection`: `single` hoặc `multiple`;
- `matching`: `required_any`;
- OR giữa các value được chọn trong cùng dimension;
- AND giữa các dimension đang được chọn.

Không publish matching mode mới trước khi app contract được nâng version.

## 2. Taxonomy v1 app đang chờ

### `intent` — Chọn nhanh, multiple

- `intent:calm`
- `intent:reduce_anxiety`
- `intent:understand_self`
- `intent:overcome_adversity`
- `intent:personal_growth`
- `intent:relationships`
- `intent:work_direction`
- `intent:meaning`

### `support` — Chi tiết, multiple

- `support:soothe`
- `support:clarify`
- `support:motivate`
- `support:small_action`
- `support:new_perspective`

### `topic` — Chi tiết, multiple

- `topic:attention_presence`
- `topic:emotions`
- `topic:self_understanding`
- `topic:change_growth`
- `topic:adversity_recovery`
- `topic:relationships`
- `topic:work_choices`
- `topic:meaning_values`
- `topic:rest_wellbeing`
- `topic:learning_habits`

### `origin` — Chi tiết, single

- `origin:selflo`
- `origin:book_or_work`
- `origin:research`
- `origin:classical_text`
- `origin:folklore`

Nhãn và thứ tự hiển thị phải nằm trong catalog. ID đã phát hành là stable; đổi nhãn không được đổi ID nếu semantics không đổi.

## 3. Release gate bắt buộc

Authoring được phép có `tags` thiếu hoặc chưa chắc chắn để tiếp tục biên tập. Release phải fail closed nếu một trong các điều kiện sau không đạt:

1. Manifest có đúng một `content_tag_catalog` hợp lệ.
2. Mọi quote Release có ít nhất số tag được yêu cầu trong mỗi dimension có `release_min_count > 0`.
3. Mọi tag trên quote tồn tại trong catalog; không có tag trùng hoặc sai grammar.
4. Cardinality tuân theo catalog; dimension `single` không có hơn một value trên một quote.
5. `origin:*` nhất quán với provenance đã kiểm tra, không suy từ text hoặc tên tác giả.
6. Quote có `story_id` phải resolve được thành story Release có thể mở trong cùng immutable Library session.
7. Rights/review/translation/source và các gate Release hiện tại vẫn đạt.
8. Tag đã human review. AI được đề xuất gần đúng trong migration đầu, nhưng không tự approve Release.

Publisher cần xuất coverage report trước khi activate Release:

- số quote theo từng tag;
- số quote có story theo từng tag;
- item thiếu hoặc có tag không hợp lệ;
- overlap giữa value trong cùng dimension;
- các lựa chọn có coverage bằng 0 hoặc quá thấp.

Mọi count lấy quote làm đơn vị. Khi bật **Ưu tiên câu chuyện**, count được tính lại sau điều kiện `has_openable_story`; report phải cho thấy coverage ở cả hai trạng thái bật/tắt. Story không có tag coverage riêng.

App vẫn đọc được package legacy chưa có catalog. Publisher có thể tạo Authoring không catalog để phục vụ migration, nhưng mọi Release mới bắt buộc có đúng một `content_tag_catalog` và fail-closed theo toàn bộ gate ở trên. Vì vậy content không thể vô tình phát hành một Release mới làm bộ lọc trở về trạng thái không metadata.

Release không được publish catalog trước rồi để quote chưa có tags: app sẽ hiển thị lựa chọn nhưng kết quả lọc bằng 0.

## 4. Hành vi tương thích của app

- Library cũ không có metadata vẫn load và hiển thị nội dung khi user không chọn filter.
- Khi user chọn một tag mà không quote nào có, count là `0`; app không suy diễn từ theme/keyword và không dùng pool cũ.
- Vì vậy batch content đầu tiên phải backfill toàn bộ quote đang Release trước khi bật catalog trong Release manifest.
- Thêm dimension/value thuộc contract v1 về sau chỉ cần cập nhật catalog và tags; không cần thêm field data-contract hoặc sửa app.

## 5. Trình tự triển khai phía content

1. Đồng bộ JSON Schema: optional `tags` cho Authoring quote, schema cho `content_tag_catalog`, và manifest kind tương ứng. Không thêm `tags` vào canonical story schema v1.
2. Thêm canonical catalog v1 vào source index nhưng chỉ publish Authoring.
3. Backfill tags gần đúng cho **toàn bộ quote đang Release**; ưu tiên coverage chạy được, ghi rõ item cần phân tích lại.
4. Chạy schema/semantic validation và coverage report; owner rà soát các lỗi rõ ràng và origin. Story linkage được kiểm tra bằng `story_id`, không bằng tag alignment.
5. Nâng publisher Release gate theo mục 3 và thêm test fail-closed.
6. Publish Authoring để kiểm tra trên Preview/Filter Lab.
7. Chỉ sau khi app tương thích đã release và toàn bộ gate pass mới publish Release Library mới.

Không sửa trực tiếp payload trong `release/`; mọi thay đổi phải đi từ canonical source và publisher hiện có. Không commit/push/deploy tự động trong migration này.

## 6. Definition of done cho batch Release đầu tiên

- Schema và publisher tests pass.
- 100% quote Release có tags hợp lệ theo required dimensions.
- Story không cần filter tags; 100% `story_id` không-null phải resolve được thành story có thể mở.
- Catalog được khai báo trong manifest với checksum/byte count như các immutable file khác.
- Coverage report không có lựa chọn public bằng 0, trừ khi owner chấp nhận rõ bằng release note.
- Preview xác nhận count thay đổi theo OR-trong-dimension/AND-giữa-dimension và giảm đúng khi bật hard filter **Ưu tiên câu chuyện**.
- Release revision mới chỉ được tạo sau owner approval.
