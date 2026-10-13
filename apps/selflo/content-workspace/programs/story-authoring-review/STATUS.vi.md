# PM-STORY-P1 — Review story chỉ có trong Authoring

**Ưu tiên:** P1
**Trạng thái tổng:** Đang thực hiện
**Bắt đầu:** 2026-10-13
**Owner nghiệm thu cuối:** Dũng
**Phạm vi:** 46 story có trong Authoring revision 84 nhưng chưa có trong Release revision 45.

## Mục tiêu

Đọc và kết luận từng story như một sản phẩm nội dung hoàn chỉnh. Mỗi story phải có đúng một quyết định: Release, cần sửa, cần xác minh nguồn/quyền, cần owner review, giữ Authoring hoặc loại.

Không đặt mục tiêu đưa đủ cả 46 story lên Release. Chỉ story đạt nội dung, nguồn/quyền, metadata, hình ảnh, liên kết quote và trải nghiệm đọc mới được phát hành.

## Definition of Done

1. Đủ 46/46 story có review biên tập và disposition rõ.
2. Story được đề xuất Release đã được đọc toàn bài, không chỉ vượt schema.
3. Quyền, nguồn, mức biên tập người thật và artwork được xác nhận.
4. Story–quote mapping hợp lệ; không duyệt story chỉ vì quote liên kết đã Release.
5. Story đạt gate được tạo Release qua canonical pipeline và kiểm tra trên web public.
6. Story chưa đạt vẫn ở Authoring hoặc được loại với lý do rõ.
7. Có report tổng, worklog và checkpoint để tiếp tục mà không review lại từ đầu.

## Phase

| Phase | Nội dung | Trạng thái |
|---|---|---|
| S0 | Đồng bộ baseline Authoring/Release theo `story_id` | Hoàn thành |
| S1 | Audit gate tự động: lifecycle, quyền, review, human edit, ảnh, quote link | Hoàn thành |
| S2 | AI đọc và review nội dung 46 story | Đang thực hiện |
| S3 | Sửa canonical theo kết quả review | Chưa bắt đầu |
| S4 | Owner nghiệm thu hàng cần quyết định | Chưa bắt đầu |
| S5 | Publish story đạt gate và kiểm tra public | Chưa bắt đầu |

## Baseline

- Authoring revision 84: 62 story.
- Release revision 45: 16 story.
- Authoring-only theo stable `story_id`: 46 story.
- Release có nhưng Authoring không có: 0 story.

## Kết quả audit S1

- Release-ready theo gate tự động: 0/46.
- 46/46 chưa có hero image.
- 46/46 chưa được xác nhận `human_edited = true`.
- 45/46 chưa clear quyền.
- 41/46 còn thiếu owner review.
- 18/46 chưa có quote liên kết trong Release.

Audit chỉ kiểm tra điều kiện dữ liệu. Nó không thay thế việc đọc toàn bài và không kết luận story hay/dở.

## Đúng một bước tiếp theo

Review nội dung batch đầu gồm năm story đã từng được đánh dấu `approved` và story `Bức ảnh thiếu một góc` đang có metadata quyền bất thường; ghi disposition nhưng chưa publish.
