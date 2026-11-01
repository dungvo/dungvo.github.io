# Tầng không tồn tại — Tiếp nhận nguồn và kiểm kê 10 chương

## Trạng thái ngày 2026-11-01

- **Nguồn đã xác định:** Owner cung cấp 11 URL chính xác: một bài mở đầu và 10 bài mang tên chương 1–10.
- **Toàn văn:** Chưa lấy được. 11 URL mở trực tiếp đều trả lỗi `Cache miss`/không truy cập; thử bỏ tham số `?r=1ornuw`, RSS/feed, archive API, tìm kiếm theo site và đường proxy đọc công khai vẫn không cho nội dung. Kết quả HTTP từ runtime cục bộ gặp lỗi phân giải tên miền.
- **Không nhập nội dung giả:** Chưa thể chuyển nguyên văn thành Story V3, chưa có bài trong generated Authoring hay Release, chưa đặt `owner_approved` hoặc rights verified.
- **Bằng chứng danh sách chương:** Danh sách URL owner gửi, lưu nguyên văn trong [SOURCE_LINKS_2026-11-01.vi.json](SOURCE_LINKS_2026-11-01.vi.json). Đây là xác nhận *liên kết tồn tại theo lời owner*, chưa phải xác nhận server trả bài hoặc thân bài có đầy đủ.
- **Mười placeholder cũ** trong [series catalog](../catalog.vi.json) đã được gắn tên suy ra từ slug để dễ nhận diện; giữ `status=awaiting_content`, `story_id=null` và `series.status=planning`. Hai slug chương 5 và 8 có dấu hiệu mất phụ âm khi bỏ dấu; tên chính thức vẫn **chưa xác nhận**. Tên các chương khác cũng chỉ suy ra từ URL cho đến khi xem được metadata trong bài.
- Bài giới thiệu không tự tính thành một trong mười chương.

## Bảo toàn toàn văn khi có nguồn

1. Nhận một **Substack posts export ZIP** hoặc bản HTML/Markdown đầy đủ, có title/date/author/URL. Không cần copy 10 chương riêng.
2. **Không đưa email subscriber, billing dữ liệu riêng tư vào repo.** Chỉ giữ các bài post và metadata công khai liên quan.
3. Chọn tác giả được owner cấp quyền, đối chiếu từng URL với bài import. Giữ nguyên câu chữ, thứ tự chương, các tiêu đề và ghi công; không tự tóm tắt, biến tấu hoặc thêm đoạn triết lý.
4. Đọc [Story Reader V3 Contract](../../../shared/contracts/story-reader/v3/CONTRACT.vi.md) và [lifecycle](../../../docs/content-lifecycle.md). Tạo canonical source cho từng chương sau khi có full text; validate schema, chạy Publisher `--channel authoring`, test Reader và owner review. Chỉ khi có yêu cầu và gates đầy đủ mới Release.
5. Tách metadata về thể loại/chủ đề khỏi nội dung gốc; không tự suy ý truyện từ nhan đề.

## Phương án cung cấp nguồn một lần

Theo Substack, publication có thể export posts trong Publisher Dashboard → Settings → Exports → Create new export. Owner có thể gửi một ZIP hoặc thư mục HTML/CSV bài viết thay vì sao chép từng chương. Hướng dẫn: https://support.substack.com/hc/en-us/articles/360037466012-How-do-I-export-my-posts

## Lịch sử

- 2026-10-21: Chỉ có link bài giới thiệu, không tải được nguồn; danh sách 10 là placeholder.
- 2026-11-01: Owner cung cấp đủ URL 10 chương; đã lập source URL registry và catalog hiển thị, nhưng việc lấy toàn văn vẫn bị chặn.

