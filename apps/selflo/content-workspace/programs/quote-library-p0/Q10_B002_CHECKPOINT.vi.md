# Q10-B002 — Review 166 dòng quote

Trạng thái: **ĐÃ ĐÓNG** sau kiểm chứng public Release 50.

- Đọc và đối chiếu đủ 166 câu: **75 giữ lại, 91 không đạt**.
- Không đạt: 55 thiếu ngữ cảnh, 17 trùng, 9 mờ/sai lệch nghĩa, 10 quá chuyên biệt cho bộ quote Selflo.
- Biên tập lại 50 văn bản; Việt hóa tên người/tác phẩm và nhãn hiển thị. Kinh Pháp Cú là tác phẩm, thuộc truyền thống Phật giáo; F. Max Müller được giữ là người dịch trong hồ sơ.
- Nguồn: Đạo Đức Kinh bản Vương Bật; Trang Tử các chương 1–7, 20 (nguyên văn cổ trên Wikisource); Kinh Pháp Cú bản Müller, Project Gutenberg 2017. Không lấy bản dịch Việt hiện đại và không nâng trạng thái quyền.
- Mỗi dòng có nguyên văn nguồn/locator/hash, trước–sau, lý do và bản giữ nếu trùng trong `reports/q10-b002-review.json`. Quyết định chính vẫn ở `canonical-ai-review.json`.
- Authoring 89: 1.851 quote / 63 story. Release 50: **507 quote / 17 story**; gỡ đúng 91 ID, không thêm ID mới.
- Toàn bộ quote ngoài 166 ID và mọi story canonical/descriptor giữ nguyên. Ba quote liên kết story được giữ; chưa review nội dung story.
- 94/94 tests đạt; publisher/schema/semantic/coverage và đối soát checksum/byte_count đạt.
- Nhận định “người dẫn nước” ở kệ 80 là cách diễn giải cho dễ đọc; bản Müller ghi “Well-makers”, được giữ nguyên trong passage/provenance, không báo là lỗi dịch của edition.
- Đã đếm 75 accepted sau khi public manifest và các pack khớp.

## Xác nhận public và tiến độ

- Commit nội dung `f2fd929` đã lên main. Public manifest Release 50 và đủ 9 quote pack khớp SHA-256/byte_count: 507 quote.
- 75 câu giữ lại khớp text/attribution, 91 câu không đạt đều vắng mặt. Đợt Q10-B002 đóng đủ 166/166.
- Corpus **342/5.471 dòng đã chốt**, gồm 332 qua B001+B002 và 10 owner-closed mang sang. Projection: 177 released + 165 not_accepted + 5.129 remaining = 5.471.
- 330 quote public khác vẫn chờ lượt audit; không tự coi đang public là đã review xong.
- Bước tiếp theo duy nhất: **Q10-B003 (165 dòng)**. Chưa chuyển sang story.
