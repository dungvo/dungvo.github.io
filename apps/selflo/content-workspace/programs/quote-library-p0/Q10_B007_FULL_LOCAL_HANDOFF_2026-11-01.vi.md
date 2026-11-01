# Q10-B007 — Review toàn đợt local

**Hoàn tất:** 2026-11-01. **Phạm vi:** đúng149 ID assignment. Chỉ làm local, không commit/push/deploy.

## Kết quả

| Kết luận | Số dòng |
|---|---:|
| Đạt, đã biên tập vào Authoring local | 15 |
| Không nhận, có final program closure mới | 133 |
| Owner đã đóng, giữ nguyên toàn bộ ledger/closure | 1 |
| Chưa xử lý | 0 |

149 =15+133+1. Trong133 closure mới có14 legacy round1_not_pass được xác nhận giữ loại, không mở lại hoặc approve. Owner đã loại pinned_tab_is_not_completed_work được giữ nguyên, không cộng lại. Batch134 dòng khép kín và15 chờ Release; review hoàn tất không đồng nghĩa đã phát hành.

Lý do133 bản không nhận:54 context_required,34 not_reader_quote,26 source_unverified,17 weak_or_misleading,1 duplicate và1 rights_not_cleared. Bản gốc của các câu không nhận được giữ, evidence lưu bản dịch làm việc cho các câu tiếng Anh. Không loại chỉ vì ngoại ngữ.

## Những điểm review chính

-20 dòng Montaigne là brief nghiên cứu theo chủ đề/Book, không phải lời tác giả. Không viết slogan mới rồi gắn Montaigne.
- Ganjoor root là mục lục, không đủ xác minh từng câu Rumi/Hafez hay Saadi. Ba câu Saadi nhận có truyện và passage riêng trong Gulistan, James Ross, anthology1900; không dùng phần introduction hiện đại.
- James dùng đúng Principles of Psychology VolumeI, Gutenberg57628. Gutenberg11984 là tác phẩm khác, không dùng. Hai bản từ Talks to Teachers chưa đạt: một chưa đối chiếu đủ passage; một quy toàn bộ tính cách thành liên tưởng theo lý thuyết lịch sử.
- Nghiên cứu học tập/quyết định/ACT/Rogers/Frankl được phân biệt với quote. Điều kiện thí nghiệm, tương quan, lâm sàng hay checklist AI được giữ ở evidence; không biến thành hứa hẹn phổ quát. Trang trả challenge/không đọc được không chứng minh câu không tồn tại, cũng không được ghi là đã đọc toàn văn.
- Một câu về sắc thái suy nghĩ công việc dùng bài Wendsche/Lohmann-Haislah2017 có CC BY rõ, đầy đủ credit/journal/DOI và chỉ rõ bản Việt được diễn ý/rút gọn; không mặc định mọi bài PMC đều được tái sử dụng.
- Ba quote gốc Selflo đã có selflo_owned được chuyển từ mệnh lệnh/lời hứa bình yên thành quan sát. Giữ story_id ở source/Authoring; không sửa hay promote story draft. Publisher xử lý link khi story chưa nằm trong Release.
- Không sửa Knowledge, UI, schema hay contract.15 quote đạt không có dependency Knowledge cần tự nâng trạng thái.98 câu đã đạt B005+B006 được giữ nguyên.

## Snapshot sau B007

| Chỉ số | Giá trị |
|---|---:|
| Corpus đã chốt | **998/5.471 (18,24%)** =380 released +618 không nhận |
| Corpus còn lại | **4.473**, gồm113 đã đạt chờ Release |
| Chờ Release | B005:50 +B006:48 +B007:15 =**113** |
| Canonical source | **86** |
| Authoring local | **103**, 1.856 quote /68 story |
| Release hiện tại | **61**, 385 quote /22 story |

Mẫu số baseline vẫn5.471. Matrix động5.476 gồm5 quote bổ sung ngoài baseline.113 câu chờ phát hành chưa cộng completed/released.

## Kiểm định

- Publisher Authoring qua schema/semantic/reference/coverage; mọi payload manifest103 khớp checksum/byte count.
- **95/95 tests đạt** sau dựng Authoring và cập nhật content lock có lý do cho đúng15 câu.
- Candidate Release62 chỉ dựng tạm: thêm đúng113 ID, tổng498 quote.385 quote cũ và22 story descriptor giữ nguyên; checksum/byte count và toàn bộ gate đạt. Bản tạm đã bỏ, không cài vào checkout.
- Eligibility và Matrix chặn đủ133 closure mới +1 owner cũ;15 quote đạt khớp nội dung Authoring.98 quote đạt trước không đổi.
- Projection có đúng113 accepted_not_in_release có chủ đích; không có issue khác. Matrix fingerprint khớp input hiện hành khi kiểm tra.
- Source chỉ thay15 quote đạt; mọi quote canonical khác và toàn bộ story giữ nguyên. Release61 không đổi.

## Evidence

- `reports/q10-b007-review.json`:149 dòng, before/after, dịch làm việc, lý do, passage, source/rights và validation.
- `reports/q10-b007-ready-local-2026-11-01.json`:15 ID B007.
- `reports/q10-b005-b006-b007-ready-local-2026-11-01.json`:113 ID dùng kiểm định tích lũy, không phải ledger mới.
- `reports/q10-b005-b006-b007-release-candidate-gate-2026-11-01.json`:bằng chứng gate tạm, không phải public proof.

## Các câu đạt

- **Phỏng theo Simeon ben Eleazar** — Lời khuyên cũng cần một lúc người kia có thể nghe. (`research.day38.011`)
- **Dựa trên Wendsche & Lohmann-Haislah** — Nhớ lại một chuyện vui ở chỗ làm khác với cứ mắc kẹt trong một chuyện khiến mình bực. (`research.day64.006`)
- **Phỏng theo Saadi** — Tuổi tác chưa thay được sự sáng suốt, địa vị chưa thay được năng lực. (`research.day31.saadi.001`)
- **Phỏng theo Saadi** — Vua lấy một quả táo, lính có thể nhổ cả cây: một đặc quyền nhỏ có thể mở đường cho điều lớn hơn. (`research.day31.saadi.003`)
- **Phỏng theo Saadi** — Trong truyện của Saadi, người tù sắp bị giết mới dám nói điều đã giữ trong lòng. (`research.day31.saadi.007`)
- **Phỏng theo John Dewey** — Cách cư xử được học từ những việc lặp lại quanh mình, cả khi không ai đang giảng dạy. (`authoring.b005.john_dewey.008`)
- **Phỏng theo William James** — Chú ý vào một việc cũng là tạm rời chú ý khỏi những việc khác. (`research.day56.001`)
- **Phỏng theo William James** — Việc đã quen thường không còn cần mình để ý từng động tác như lúc mới học. (`research.day56.002`)
- **Phỏng theo William James** — Một ý định tốt còn cần dịp được làm thành việc cụ thể. (`research.day56.003`)
- **Phỏng theo William James** — Một trạng thái đã qua không trở lại hoàn toàn như cũ. (`research.day56.004`)
- **Phỏng theo Michel de Montaigne** — Học để chất đầy kiến thức vào đầu, còn khả năng phán đoán và cách sống thì được học ở đâu? (`authoring.b002.michel_de_montaigne.021`)
- **Phỏng theo Marcus Tullius Cicero** — Lấy tình bạn khỏi đời sống cũng như lấy mặt trời khỏi bầu trời. (`authoring.b001.marcus_tullius_cicero.040`)
- **Selflo** — Ngày làm việc mai có khi đã bắt đầu trong đầu mình từ tối nay. (`do_not_go_to_work_twice`)
- **Selflo** — Một chuyện khó chịu vừa nhận được không nhất thiết phải chuyển sang người kế tiếp. (`do_not_throw_the_stone_into_the_next_persons_lake`)
- **Selflo** — Giữa tiếng ồn, mình dễ quên điều đang muốn nghe. (`peace_does_not_require_a_silent_room`)

## Đúng một bước tiếp theo

Review trọn Q10-B008 (149 dòng) dưới local khi tiếp tục, giữ113 câu chờ lệnh nghiệm thu/phát hành/GitHub của owner.
