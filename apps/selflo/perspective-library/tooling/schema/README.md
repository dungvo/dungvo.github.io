# Perspective Library v1 machine contract

**Trạng thái:** Accepted — Owner Schema Gate pass; được dùng bởi Phase 1–10

Năm schema trong folder này là biểu diễn machine-readable của [Library Contract](../../../features/perspective-content-system/LIBRARY_CONTRACT.md):

| File | Payload |
|---|---|
| `perspective-library-manifest.schema.json` | manifest và file descriptors |
| `perspective-theme.schema.json` | quote pack, canonical quote và selection metadata |
| `perspective-knowledge.schema.json` | concept, theory, framework và reference |
| `perspective-reading-intent.schema.json` | bộ chọn nhanh đời thường và membership story many-to-many |
| `perspective-story.schema.json` | story, section, block và optional hero image |

Fixture cần review:

- `../fixtures/LibraryV1/authoring-release-ineligible/`: đúng schema và Authoring mode, cố ý không đủ lifecycle để release; story không có ảnh.
- `../../../../SelfloTests/PerspectiveContent/Fixtures/LibraryV1/valid/`: đúng schema và Release mode; story có JPEG hero thật.

Gate chỉ cần xác nhận schema/fixture không thêm hoặc đổi semantics so với contract đã Accepted. Nó không duyệt nội dung production, không bật Library trong app và không cho phép bắt đầu Phase 11 content cutover.

Validation đã dùng JSON Schema draft 2020-12 với `ajv-formats`; runtime còn kiểm tra lại exact keys, scalar, references, lifecycle, byte count và SHA-256.

Schema không tự thêm semantic ngoài contract: `reference.year` nhận mọi integer hoặc `null`; nested language code chỉ bắt buộc là string khác rỗng; timestamp phải là ISO-8601 UTC; path cho phép UTF-8 an toàn, còn giới hạn 240/100 UTF-8 bytes được runtime enforce vì JSON Schema `maxLength` đếm code point.

Value/reference arrays không có `uniqueItems` và được phép lặp nếu contract không nói khác. Uniqueness chỉ được validator áp cho identity collections: file ID/path, content entity ID, quote-pack `primary_theme` và section/block ID.
