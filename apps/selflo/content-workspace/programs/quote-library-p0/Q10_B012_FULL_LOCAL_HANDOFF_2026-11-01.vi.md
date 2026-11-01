# Q10-B012 — Hoàn tất review toàn đợt local

148/148 ID: **6 đạt chờ Release,141 không nhận mới,1 giữ quyết định owner**. Không còn dòng chưa xử lý. Review mới147 dòng; không mở lại dòng owner đã đóng. Dòng owner chỉ được nối closure chương trình, toàn bộ quyết định cũ và quote giữ nguyên; đây không phải AI thay owner review.

## Nguồn và biên tập

- Bốn câu tục ngữ Việt đối chiếu đúng mục A/M của tuyển Huỳnh Tịnh Của; phân biệt tác giả sưu tập với truyền thống dân gian. Giữ bản chép, permalink oldid, history/credit và CC BY-SA4.0 cho phần trích/biên tập. Một câu nguyên văn, ba tự diễn ý ghi rõ; không dùng lời giải như một cơ chế tâm lý đã chứng minh.
- Hai cảnh Tolstoy từ How Much Land Does a Man Need? và Master and Man, Gutenberg6157/986, đúng bản Louise/Aylmer Maude. Giữ Pahom chạy dù sợ gục và Vasili nghe tiếng thở Nikita, không biến truyện thành quy luật mọi người hay chỉ dẫn cứu hộ.
-40 brief Rilke/Woolf có bản Việt làm việc theo chủ đề/tác phẩm, là hướng nghiên cứu chứ không quote. Không tự viết câu mới rồi gán tác giả.
- Dostoevsky59196 là index; Hesse2499 là Siddhartha nguyên Đức, không Demian. Các lời bình khác cần passage/edition/ngữ cảnh. OpenLibrary/Wellcome metadata không xác minh nhận định của Weil hay tổng hợp tục ngữ.
- Các entry từ điển Nhật và bản dịch Dōgen hiện đại không tự được coi public domain; giữ phạm vi tu tập, không nâng quyền từ URL. Ba PDF fetch lỗi được ghi là chưa đọc. Không suy quyền toàn cầu từ Gutenberg public domain tại Mỹ cho Du Bois/Hesse.
- Hai lời bình trùng không thêm thẻ: vòng danh lợi đã có trong Release, một miếng khi đói đã giữ B011. Sáu câu mới không có exact-text duplicate.

## Snapshot

- Corpus cố định **1.648/5.471 đã chốt (30,12%)** =380 released +1.268 không nhận. Còn **3.823**, gồm203 đạt chưa Release. Mức tăng142 closure gồm141 review mới và1 nối closure quyết định owner cũ.
- **203 chờ Release**:197 trước +6 B012. Chưa cộng vào released/completed.
- Source95; Authoring112:1.866 quote/78 story. Matrix động5.486 gồm15 bổ sung ngoài baseline.
- Release61: **385 quote/22 story**, giữ nguyên.

## Kiểm định

95/95 tests đạt. Publisher Authoring qua gate, mọi payload đúng checksum/bytes. Eligibility/Matrix chặn142 closure;203 pending là issue có chủ đích duy nhất.197 accepted trước và các quote canonical khác, story/Knowledge/UI/schema/contract giữ nguyên.

Candidate Release62 dựng trong thư mục tạm, thêm đúng203 ID thành588 quote;385 quote cũ và22 story descriptors nguyên vẹn; schema/semantic/reference/coverage và checksum qua. Thư mục tạm đã bỏ, không cài vào checkout, không thay live Release, không phải public proof. Không commit/push/deploy.

## Evidence

- `reports/q10-b012-review.json`:148 record, before/after, previous_decision, lý do, bản Việt làm việc, passage và receipts/source hash.
- `reports/q10-b012-ready-local-2026-11-01.json`:6 ID đạt.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-b012-ready-local-2026-11-01.json`:203 ID kiểm định tích lũy.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-b012-release-candidate-gate-2026-11-01.json`:gate candidate tạm.

## Sáu câu đạt

- Pahom sợ mình gục xuống, nhưng vẫn chạy tiếp: anh sợ người ta gọi mình là kẻ ngốc nếu dừng lại. — Phỏng theo Leo Tolstoy (`research.day41.leo_tolstoy.016`)
- Giữa bão tuyết, Vasili phủ áo và thân mình lên Nikita. Lúc ấy, ông chỉ còn nghe tiếng thở của người làm công. — Phỏng theo Leo Tolstoy (`research.day41.leo_tolstoy.017`)
- Ăn vỏ dưa, thấy vỏ dừa mà sợ. — Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A (`research.reaudit.day22.an_vo_dua_so_vo_dua`)
- Đi thong thả mà bền bỉ — một cách đi đường của mình. — Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A (`research.reaudit.day22.anbo`)
- Có lúc, nói rõ việc mình không thể nhận ngay từ đầu giúp tránh một lời hứa khó giữ. — Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục M (`research.reaudit.day22.matlongtruoc`)
- Có lúc, ghé thăm nhau còn quý hơn gửi quà. — Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục M (`research.reaudit.day22.motmat_hon_muoi_goi`)

Bước tiếp theo: review trọn Q10-B013 (165 ID) ở local.
