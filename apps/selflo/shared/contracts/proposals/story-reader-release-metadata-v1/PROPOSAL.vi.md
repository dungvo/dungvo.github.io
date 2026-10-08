# Story Reader Release Metadata v1

**Trạng thái:** Owner approved, implementing
**Ngày:** 2026-10-08
**Contract đích:** `selflo.story-reader.editorial-v3`

## Quyết định

1. Release materialize `metadata.reading_time_minutes` từ visible content; reader không tự tính.
2. Hero resolve theo thứ tự explicit hero, theme artwork, rồi no-hero. Explicit reference hỏng fail closed.
3. Content có thể khai báo `metadata.related_content_ids` tối đa ba ID. Reader giữ đúng ID/thứ tự, không tự đề xuất.
4. Thiếu/null/rỗng hiển thị “Chưa có bài viết liên quan.”. ID sai, trùng, self-reference hoặc chưa active trong cùng Release fail closed và diagnostic phải nêu owner ID, JSON path, expected, received và cách sửa.

## Compatibility

Hai field metadata là additive trong schema V3 `1.2`; Authoring source cũ vẫn hợp lệ. Publisher bắt buộc materialize reading time và chuẩn hóa related IDs trước Release validation. App/Web mới consume payload; content không được dựa vào semantics này trước synchronized verification.
