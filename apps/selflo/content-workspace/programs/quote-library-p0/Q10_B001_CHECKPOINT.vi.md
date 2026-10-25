# Q10-B001 — Review 166 dòng quote

Trạng thái: đã review từng dòng và kiểm định cục bộ; chờ bản public để đóng batch.

- 166 dòng đã đối chiếu: 102 giữ lại, 64 không đạt.
- Không đạt: 20 trùng nguồn/ý, 43 thiếu ngữ cảnh độc lập, 1 dễ gây hiểu sai.
- 51 văn bản được biên tập lại; chuẩn hóa tên/nguồn và nhãn hiển thị của nhóm giữ lại.
- Sửa người nói: “Mỗi ngày tự xét lại mình…” là Tăng Tử; câu khuyên can dày làm bạn xa là Tử Du, đều được ghi trong Luận Ngữ.
- Sửa locator có khác biệt edition: đoạn nghĩ mà không học là Legge XV.30, trong khi ID cũ an15_31 được giữ ổn định; “tin hết sách” thuộc Tận Tâm hạ 3, không phải Tận Tâm thượng.
- Authoring 88: 1.851 quote / 63 story. Release 49 dự kiến public: 598 quote / 17 story.
- Đúng 64 ID bị gỡ, không thêm ID Release; toàn bộ quote ngoài 166 ID và mọi story descriptor giữ nguyên.
- 94/94 tests đạt; full publisher/schema/semantic/coverage gates đạt; mọi checksum/byte_count khớp.
- Kết quả quyết định vẫn ở canonical-ai-review.json; report này là bằng chứng/đối soát, không phải ledger cạnh tranh.
- 10 quyết định owner đã loại được mang sang chương trình với bằng chứng cũ, không mở lại review.

## Nguồn đối chiếu

- Luận Ngữ, nguyên văn: https://zh.wikisource.org/wiki/論語/全覽
- Luận Ngữ, bản James Legge: https://www.gutenberg.org/cache/epub/3330/pg3330-images.html
- Đạo Đức Kinh, bản Vương Bật: https://zh.wikisource.org/wiki/道德經_(王弼本)
- Đạo Đức Kinh, bản James Legge: https://www.gutenberg.org/cache/epub/216/pg216-images.html
- Mạnh Tử: các thiên Công Tôn Sửu thượng, Cáo Tử thượng, Ly Lâu thượng, Tận Tâm thượng/hạ trên Wikisource. Ctext trả 403; đã dùng witness nguyên văn thay thế, không coi 403 là không có nguồn.

Bản Việt giữ/phỏng theo từ văn bản cổ đã có cơ sở quyền trong hồ sơ; không nâng quyền chưa xác minh và không dùng bản dịch Việt hiện đại của bên khác. Giữ source URL, locator, edition/translator cũ cùng bản trước/sau để đối chiếu.

## Toàn bộ kết luận của đợt


Bước tiếp theo: cập nhật package lên main, kiểm tra manifest và 9 quote pack public rồi mới đánh closed và mở Q10-B002.
