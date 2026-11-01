# Q10-B013 — Hoàn tất review toàn đợt local

**165/165 ID: 8 đạt chờ Release, 157 không nhận, 0 chưa xử lý.** Tất cả còn mở trước review và nằm ở Research. Tám câu mới được nhập canonical; 157 dòng chỉ đóng ở ledger. Workbook/raw giữ nguyên. Không mở lại quyết định cũ.

## Nguồn và biên tập

- Ba câu Luận Ngữ: hỏi đáp Phàn Trì về nhân; ôn cũ biết mới; lời tự nói không sinh ra đã biết mà yêu điều xưa và siêng tìm hiểu. Ghi rõ phần trích/lược, không tạo lời tác giả từ chủ đề chung.
- Năm câu Đạo Đức Kinh: vàng ngọc đầy nhà; hư/tĩnh; bớt thái quá và xa hoa; nhạc/món ngon khiến khách dừng; ngựa làm ruộng đối chiếu ngựa chiến đẻ con ngoài thành. Đây là tự dịch/diễn ý chính văn cổ, không phải fact khoa học, hiệu quả trị liệu hay sự kiện lịch sử riêng.
- Bản Vương Bật có chú giải xen kẽ: chỉ dùng chính văn cho các câu đạt. Bản chép Wikisource giữ permalink oldid, history/credit và CC BY-SA 4.0 cho phần chuyển thể; không coi toàn bộ bản chép là public domain.
- 157 không nhận gồm: 95 cần ngữ cảnh; 29 chưa xác minh nguồn; 19 ghi chú nghiên cứu/biên tập; 6 trùng; 5 bản dịch chưa đáng tin; 2 quá hẹp; 1 dễ gây hiểu sai. Mỗi dòng có lý do. Có bản Việt làm việc cho 28 dòng nghiên cứu hiện đại, không loại vì tiếng Anh.
- Sáu bản trùng có bản được giữ trong Release: Luận Ngữ I.1 và XV.23; nước ở chương 8; tín ở chương 17/23; cảnh xa hoa ở chương 53; cưỡng làm/nắm giữ ở chương 29/64.
- Chương 65 không tự tương đương “minh dân/ngu dân” và “dân trí/trị quốc” với “thao túng/không thao túng”. Không làm nhẹ nội dung chính trị cổ để khớp quan điểm hiện đại. Các mệnh đề về Đạo, khí, vũ trụ, binh và trị dân cần nguyên cảnh.
- Liệt Tử: witness Cổ Mãng ghi 多眠 (ngủ nhiều), raw ghi 多樂 (vui nhiều). Đoạn chân nhân/mộng-thức khác chữ. Câu tinh thần về gốc và trời tích khí nằm ở Thiên Thụy/chương 1 trong witness đọc được, khác chương theo ID. Không coi mọi khác biệt văn bản là lỗi; ghi rõ phần chưa xác minh hoặc cần ngữ cảnh.
- Truyện người say ngã xe không làm bằng chứng rằng say hoặc ít căng sẽ ít chấn thương. Ngu Công có con cháu và thần dời núi ở kết, không bảo đảm mọi mục tiêu đều đạt nếu cố mãi.
- PMID 27668460 là Ohly 2016; 30130463 là Stevenson 2018, không phải nghiên cứu 2025. PMC2852439/11725323 nói về cảm xúc và ký ức tự truyện, chưa xác minh các claim đo cảm xúc pha trộn. PMC6866367 là nghiên cứu thần kinh của so sánh xã hội, chưa phải nguồn cho mục tiêu nội tại/ngoại tại.
- Định nghĩa ART/so sánh xã hội và định hướng Selflo giữ ở lớp nghiên cứu, không tự duyệt Knowledge. Các note truyền thống châu Phi thiếu nguyên văn, ngôn ngữ, cộng đồng hoặc trang; không phát hành dưới nhãn chung “African proverb”.
- CTP trả thông báo truy cập, không được ghi là đã đọc chính văn. Wiley/AOM và Hrčak không đọc được; DOI 2025 chỉ có redirect shell. Nguồn PMC tải được qua curl được phân biệt với browser challenge. Các lần thử URL trùng được đánh dấu trong receipts, không tính thành nguồn độc lập.

## Snapshot cuối B013

| Chỉ số | Giá trị |
|---|---:|
| Corpus đã chốt | **1.805/5.471 (32,99%)** = 380 released + 1.425 không nhận |
| Còn lại | **3.666**, gồm 211 đạt chưa Release |
| Chờ Release | **211** = 203 trước + 8 B013 |
| Canonical source | **96**, 1.874 quote |
| Authoring local | **113**, 1.874 quote / 78 story |
| Release hiện tại | **61**, 385 quote / 22 story, giữ nguyên |

Baseline 5.471 không đổi. Matrix động 5.486 giữ cùng danh tính; tám dòng Research chuyển sang canonical không làm tăng corpus. Các câu chưa phát hành chưa được cộng vào released/completed.

## Kiểm định

Publisher Authoring qua schema, semantic, reference và coverage; mọi checksum/byte count đúng. **95/95 tests đạt** sau khi Authoring 113 dựng xong. Lượt chạy sớm báo thiếu tám ID trong Authoring 112 đã được chạy lại; không sửa test hoặc bỏ gate.

Candidate Release 62 chỉ dựng tạm: thêm đúng 211 ID thành 596 quote; 385 quote cũ và 22 story descriptor nguyên vẹn. Các gate và checksum đạt. Thư mục tạm đã bỏ, không cài vào checkout, không coi là public proof.

Eligibility/Matrix chặn 157 closure; tám câu đạt khớp Authoring. 203 câu đạt trước và 1.866 quote canonical cũ giữ nguyên. Không có exact-text duplicate mới. Projection chỉ có 211 `accepted_not_in_release` có chủ đích. Workbook, story, Knowledge, UI và contract không đổi. Không commit/push/deploy.

## Evidence

- `reports/q10-b013-review.json`: 165 dòng, raw sheet/row/nguyên văn, before/after, bản Việt làm việc, source/rights/receipts và validation.
- `reports/q10-b013-ready-local-2026-11-01.json`: tám ID đạt.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-b012-b013-ready-local-2026-11-01.json`: 211 ID kiểm định tích lũy.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-b012-b013-release-candidate-gate-2026-11-01.json`: gate candidate tạm.

## Tám câu đạt

- Phàn Trì hỏi thế nào là nhân. Khổng Tử đáp: “Yêu người.” — Phỏng theo Khổng Tử · truyền thống Luận Ngữ · Luận Ngữ (`research.reaudit.day25.an12_22_ren`)
- Ôn lại điều cũ mà nhận ra điều mới. — Phỏng theo Khổng Tử · truyền thống Luận Ngữ · Luận Ngữ (`research.day25.an2_11`)
- Tôi không sinh ra đã biết. Tôi yêu điều xưa và siêng năng tìm hiểu. — Phỏng theo Khổng Tử · truyền thống Luận Ngữ · Luận Ngữ (`research.day25.an7_19`)
- Vàng ngọc đầy nhà, nào ai giữ được mãi. — Phỏng theo Lão Tử · truyền thống Đạo Đức Kinh · Đạo Đức Kinh · bản Vương Bật (`research.laozi.ch09.024`)
- Để lòng trống ra; giữ sự tĩnh lặng thật sâu. — Phỏng theo Lão Tử · truyền thống Đạo Đức Kinh · Đạo Đức Kinh · bản Vương Bật (`research.laozi.ch16.048`)
- Bớt thái quá, bớt xa hoa, bớt phô trương. — Phỏng theo Lão Tử · truyền thống Đạo Đức Kinh · Đạo Đức Kinh · bản Vương Bật (`research.laozi.day2.ch29.036`)
- Tiếng nhạc và món ngon khiến khách qua đường dừng bước. — Phỏng theo Lão Tử · truyền thống Đạo Đức Kinh · Đạo Đức Kinh · bản Vương Bật (`research.laozi.day2.ch35.057`)
- Thời yên bình, ngựa trở về ruộng đồng. Thời loạn lạc, ngựa chiến đẻ con ngoài thành. — Phỏng theo Lão Tử · truyền thống Đạo Đức Kinh · Đạo Đức Kinh · bản Vương Bật (`research.laozi.day2.ch46.099`)

Bước tiếp theo: review trọn Q10-B014 (164 ID) ở local.
