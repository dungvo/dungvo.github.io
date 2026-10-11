# ADR-0003 — Tạm ngừng authoring block `sequence`

- **Trạng thái:** Accepted
- **Ngày chốt:** 2026-10-11
- **Phạm vi:** Content mới và canonical story hiện hành
- **Loại thay đổi:** Content-compatible; không xóa decoder hoặc wire contract

## Bối cảnh

`sequence` đang được app trình bày thành nhiều cột ngang. Khi một block có nhiều item hoặc câu dài, mỗi cột trở nên quá hẹp trên điện thoại và làm nội dung khó đọc. Các trường hợp đang dùng trong canonical cũng chủ yếu là những item cùng cấp, phù hợp với `list` hơn là một progression bắt buộc.

## Quyết định

- Không author `sequence` cho content mới trong giai đoạn hiện tại.
- Chuyển mọi `sequence` đang có trong canonical story sang `list/plain`, giữ nguyên câu chữ và thứ tự.
- Giữ schema, decoder và support matrix để app/web tiếp tục đọc package lịch sử.
- Không sửa app trong quyết định này.
- Chỉ mở lại authoring sau khi có presentation mobile mới được owner review.

## Hệ quả

Publisher vẫn hiểu `sequence` để tương thích ngược, nhưng catalog authoring đánh dấu component là tạm ngừng. Content mới dùng `list`, `paragraph` hoặc `statement` theo đúng vai trò nội dung.
