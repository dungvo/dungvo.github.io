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

## Trạng thái sau khi chạy Publisher (01/11/2026)
- **Đã chạy thành công** `./scripts/publish-perspective-library --channel authoring` trên GitHub Actions (strict schema + semantic validation) tại https://github.com/dungvo/dungvo.github.io/actions/runs/41275075376.
- Đã tạo Authoring revision **101**: 10 story `story.tang_khong_ton_tai_chuong_01` đến `_10`, còn ở dạng **draft, needs_owner_review, rights unverified**. Release revision **61** không thay đổi.
- Publisher hiện yêu cầu mỗi Story có một owning quote. 10 quote đều được **trích nguyên văn** từ đoạn có sẵn trong chương, giữ tại `quotes/attention/027.vi.json`; không tạo câu mới. Đây là giới hạn pipeline hiện hành, không phải quyết định nhân rộng quote sáng tác cho mọi series.
- Các trường `takeaway` và `reflection` đang là placeholder kỹ thuật, **không phải tác phẩm gốc**, cần owner review trước khi Release.
- Nội dung hiển thị Authoring cần QA giao diện thực tế và bổ sung 10 ảnh nguồn nếu quyết định dùng ảnh. Chưa phát hành Release hoặc series public.
