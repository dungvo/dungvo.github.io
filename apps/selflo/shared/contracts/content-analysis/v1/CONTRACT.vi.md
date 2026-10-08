# Content Analysis v1

Content Analysis hiện là companion resource **Authoring-only** dành cho biên tập và fact-check. Nó giúp thử nghiệm dữ liệu Deep Dive có cấu trúc, nhưng chưa phải quyết định rằng production cần một API riêng. Public content vẫn đứng độc lập; thiếu analysis không làm Story/Knowledge lỗi hoặc mất khả năng đọc.

## Ranh giới

- Canonical source: `perspective-library/source/vi/analyses/`.
- Mỗi analysis liên kết bằng `content_id`; không nhúng vào payload Story hiện hành.
- `audience = editorial` không được public tự động. `audience = reader_optional` chỉ mô tả khả năng biên tập; trong v1 chưa có quyền tự đưa resource ra public.
- API authoring sinh tại `api/content-analysis.v1.json`; không sửa tay.
- App hiện tại không cần decode API này. Consumer không hỗ trợ phải bỏ qua toàn bộ resource an toàn.

## Compatibility

Đây là projection thử nghiệm riêng trong Authoring và additive. Nó không đổi `selflo.story-reader.editorial-v3` hay `selflo.content-index.v1`. Một content có thể có 0 hoặc 1 companion analysis trong v1. Breaking change về identity, lifecycle hoặc ý nghĩa các field cần v2.

## Hướng production ưu tiên

Trước khi tạo endpoint production mới, ưu tiên kiểm tra khả năng biểu diễn Deep Dive bằng cấu trúc content và Content Index hiện có:

1. Deep Dive là một content độc lập có stable `content_id` và lifecycle riêng.
2. Quan hệ Main Content → Deep Dive là metadata liên kết additive, không nhúng toàn bộ phân tích vào Story.
3. Consumer cũ bỏ qua quan hệ mới và vẫn đọc bài chính bình thường.
4. Chỉ tạo API riêng khi lifecycle, tải dữ liệu, quyền truy cập hoặc truy vấn thực tế không thể đáp ứng bằng projection hiện có.

Proposal production nằm tại `shared/contracts/proposals/composable-content-v1/PROPOSAL.vi.md`. API `content-analysis.v1.json` không được xem là cam kết production hoặc public endpoint.

## Validation

Schema executable: `content-analysis.schema.json`. Generator phải kiểm tra ID duy nhất, `content_id` tồn tại trong canonical source và mọi `reference_id` tồn tại trong `references` của chính analysis.
