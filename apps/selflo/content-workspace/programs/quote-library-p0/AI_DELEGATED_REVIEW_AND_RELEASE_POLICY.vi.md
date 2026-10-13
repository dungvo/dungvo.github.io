# P0 Quote — Chính sách AI review được owner ủy quyền

**Trạng thái:** Đã chốt
**Ngày:** 2026-10-12
**Owner ủy quyền:** Dũng
**Reviewer vận hành:** `ai:codex`

## Quyết định

Owner không cần đọc và duyệt từng quote trong 5.470 dòng. AI được ủy quyền:

- review độ chính xác, chất lượng tiếng Việt và mức phù hợp với Selflo;
- phân loại kết quả cuối cho từng dòng;
- approve về mặt biên tập và chuẩn bị Release cho quote đạt đủ gate;
- giữ ở Authoring những câu có nguồn tốt nhưng chưa phù hợp Selflo hoặc cần biên tập;
- giữ ngoài Release những dòng trùng, yếu, không truy nguồn được hoặc có rủi ro quyền.

Khi ghi reviewer, dùng danh tính thật `ai:codex`; không ghi giả `owner:dungvo`. Owner nghiệm thu kết quả chương trình và có quyền đổi quyết định sau.

## Ưu tiên xử lý

Nhóm được ghi `translated_quote` hoặc `direct_quote`, có primary source và locator rõ được review trước. Đây là ưu tiên vận hành, không phải đường tắt qua quyền/bản dịch.

Một câu chỉ được AI approve để Release khi đạt đồng thời:

1. **Nguồn:** tác giả, tác phẩm, passage/locator và witness/edition truy được.
2. **Quyền:** tác phẩm gốc, edition/transcription và bản dịch dùng để tạo bản Việt đều có cơ sở phù hợp.
3. **Độ chính xác:** bản Việt không thêm claim, không làm sai sắc thái trọng yếu và không bị gắn sai tác giả.
4. **Selflo fit:** câu đứng độc lập, dễ hiểu, không chẩn đoán, không áp đặt/coaching, không slogan rỗng và có giá trị nhìn lại.
5. **Dữ liệu:** identity, theme/tag, metadata và dependency hợp lệ; không phải bản trùng bị loại.
6. **Gate:** schema, semantic, coverage và publisher Release đều pass.

## Kết quả review cho phép

| Kết quả | Nơi ở |
|---|---|
| `release_ready_ai_approved` | Đưa qua Release gate; reviewer `ai:codex` |
| `authoring_selflo_fit_review` | Authoring; nguồn có thể tốt nhưng câu chưa đúng Selflo |
| `authoring_needs_edit` | Authoring; có hướng sửa cụ thể |
| `needs_source_or_translation_check` | Không Release cho đến khi đối chiếu xong |
| `blocked_rights` | Không Release khi chưa có permission/cơ sở quyền |
| `duplicate` | Giữ provenance, không Release bản thua |
| `research_only` | Giữ ở lớp nghiên cứu, không đưa vào Authoring queue của owner |
| `reject` | Đóng có lý do |

## Những việc không được bypass

- Không xem “có URL” là đủ quyền sử dụng.
- Không suy public domain chỉ vì tác giả đã sống từ lâu.
- Không dùng bản dịch hiện đại của người khác để tạo bản Việt mà chưa kiểm tra quyền.
- Không nâng `unverified` để publisher pass.
- Không bulk-approve knowledge dependency chưa được source-review.
- Không sửa tay output Authoring hoặc Release.

## Cách owner nghiệm thu cuối

Owner không phải đọc lại toàn bộ 5.470 câu. Owner nghiệm thu bằng:

- báo cáo đối soát tổng các disposition = 5.470;
- sample theo nguồn/chủ đề/risk;
- danh sách câu Release mới và danh sách ngoại lệ;
- kết quả gate và preview Studio/public;
- quyền yêu cầu đưa một câu về Authoring hoặc loại sau nghiệm thu.
