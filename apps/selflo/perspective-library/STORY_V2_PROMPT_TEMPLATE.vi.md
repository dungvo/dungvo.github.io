# Prompt template — tạo hoặc chỉnh Story V2

Sao chép prompt dưới đây cho các lần authoring tiếp theo. Luôn đính kèm `STORY_LAYOUT_V2_CONTRACT.vi.md` và `STORY_AUTHORING_V2.vi.md` làm nguồn chuẩn. Đọc thêm các record còn hiệu lực trong `editorial-decisions/`, bắt đầu từ `ADR-0001-content-moc-va-artwork-ke-chuyen.vi.md`, để giữ đúng giọng Selflo và hiểu lý do của các nguyên tắc mới. Với story đã tồn tại, đọc thêm `STORY_EDITORIAL_REVIEW_WORKFLOW.vi.md` và hoàn tất editorial diagnosis trước khi sửa canonical.

```text
Bạn đang biên tập một Selflo Story theo Story Layout V2.

Mục tiêu:
- Tạo một bản kể tiếng Việt tự nhiên, có nhịp đọc đẹp và trung thành với sự kiện, nhân vật, nguồn và ý nghĩa gốc.
- Output phải hợp lệ với schema 1.1 và reader_format editorial_v2.

Ràng buộc nội dung:
- [Liệt kê phần đã owner duyệt và không được đổi câu chữ/thứ tự.]
- [Liệt kê phần được phép diễn đạt lại.]
- Không thêm sự kiện, nhân vật, lời dạy hoặc kết luận không có căn cứ.
- Không sao chép bản dịch tiếng Việt hiện đại có bản quyền.
- Ưu tiên sự việc và chi tiết cụ thể; không cố làm câu văn nghe triết lý hoặc sâu.
- Viết tiếng Việt mộc, rõ, trực tiếp; rà các công thức AI lặp lại và chỉ giữ khi thực sự cần.
- Tách knowledge/analysis khỏi public prose; chỉ mang sang lượng giải thích cần thiết.
- Ưu tiên perception twist hơn plot twist; không bắt buộc kết bằng lời khuyên.

Ràng buộc layout:
- Paragraph là 1–4 câu cùng beat; không tách mỗi câu thành một block.
- Mọi paragraph có style narrative, dialogue_lead hoặc transition.
- Pull quote chỉ dành cho câu bản lề thật sự; không dùng featured_quote_ids.
- Dùng part_heading chỉ cho phần lớn trong cùng một mạch scroll.
- Takeaway không lặp đoạn kết; có 1–2 reflection prompt và optional closing.
- Không dùng preview_path trong canonical.

Deliverable:
1. Canonical JSON hợp schema.
2. Tóm tắt editorial decisions.
3. Thống kê section/block/pull quote.
4. Xác nhận phần prose bị khóa không thay đổi.
5. Validation report và Web Reference screenshots.
```
