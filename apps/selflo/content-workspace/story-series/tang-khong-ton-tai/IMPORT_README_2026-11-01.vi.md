# Tầng không tồn tại — bộ 10 chương dành cho Selflo Authoring

Nguồn: bản Substack export ZIP được tác giả/người dùng cung cấp ngày 01/11/2026.

## Thành phần
- `canonical_stories/`: 10 file Story V3 JSON, giữ nguyên câu chữ, thứ tự đoạn và các lời trích dẫn từ HTML nguồn.
- `source_archive/`: bài giới thiệu và toàn văn HTML gốc từng chương, dùng để đối chiếu khi review.
- `series-manifest.json`: tên, ngày xuất bản, URL, SHA-256 của HTML gốc và ảnh minh họa từng chương.
- `quality-audit.json`: thống kê block và phần loại bỏ khi chuyển đổi.

## Nguyên tắc bảo toàn
- Dấu `<br>` bên trong đoạn được đổi thành xuống dòng `\n`; strong/italic thành `runs`.
- Các mục điều hướng Substack (`Tiếp theo`, `Quay về`, form đăng ký) không được nhập vào nội dung Story.
- URL ảnh Substack được lưu trong manifest nhưng chưa tạo ảnh local Selflo (cần xử lý artwork riêng).
- `takeaway` và `reflection` trong Story JSON là **PLACEHOLDER rõ nhãn**, KHÔNG phải văn bản nguyên gốc, chỉ dùng trong Authoring trước khi tác giả duyệt.
- Không lấy email list, thông tin subscriber, dữ liệu gửi/mở email hoặc post ngoài series.
- `review.status=needs_owner_review`, `rights.status=unverified`, `status=draft`; không tự Release.

## Trạng thái
Đây là bộ chuẩn bị import canonical Story V3. Chưa khẳng định các file đã qua Publisher Authoring hoặc đã được owner phê duyệt.
