# Q10-B011 — Review toàn đợt local

**Hoàn tất:** 2026-11-01. **Phạm vi:**148 ID assignment cố định. Không commit/push/deploy đợt này.

## Kết quả

| Kết luận | Dòng |
|---|---:|
| Đạt, đã biên tập vào Authoring local | 24 |
| Không nhận, final closure có lý do | 124 |
| Chưa xử lý | 0 |

148=24+124. Tất cả148 record còn mở trước review, không mở lại bất kỳ quyết định đã đóng nào. B011124 dòng khép kín và24 chờ Release; review hoàn tất không đồng nghĩa đã phát hành.

Lý do124 không nhận:62 not_reader_quote,39 context_required,15 source_unverified,3 duplicate,3 too_narrow_for_selflo và2 weak_or_misleading.40 brief tiếng Anh Kierkegaard/Camus có bản Việt làm việc theo từng chủ đề/tác phẩm; không loại vì ngoại ngữ hoặc tự viết slogan để gắn tác giả.

## Điểm biên tập và xác minh

- Sáu trích thơ Việt (Nguyễn Du/Nguyễn Trãi) giữ giọng/người nói và locator. Kiều3226 giữ khả năng quan hệ thành tình bạn, không buộc người từng bị hại tiếp tục quan hệ. Bỏ lời gương trong/trinh tiết như thước đo phẩm giá và lời phó mặc sống chết rời cảnh. Trích riêng câu164 từ cặp163–164, ghi rõ phần lược; không mang phân vai quốc sắc/thiên tài sang thẻ.
- Mười hai ca dao/tục ngữ giữ attribution truyền thống/tuyển tập, không bịa người nói hoặc niên đại phát sinh. Nguồn Huỳnh Tịnh Của được phân biệt với người sáng tác câu dân gian.
- Đối chiếu từ cổ/dị bản: trổng→trồng và truân-chiên→truân chuyên được ghi rõ; giặt là gạo nguyên hạt, không tự suy thành lời khuyên trả nợ; bàn độc/trí dày/mũi-lái cần ngữ cảnh nên không ép thành thẻ. Gia bần trí đoản không được biến thành fact phẩm chất người nghèo.
- Các lời ca về chồng cờ bạc/gánh việc/chăm mẹ không được dùng như chuẩn người vợ phải bớt ăn/ngủ hoặc gánh nợ. Bài thất mùa giữ rõ hạn/mưa/bão và hoàn cảnh, không quy mọi thiếu hụt về cố gắng cá nhân. Tỉ lệ lúa mười được ba là hình ảnh trong bài, không số liệu mọi vụ mùa.
- Bản chép Wikisource giữ permalink oldid, history/credit người đóng góp và CC BY-SA4.0 cho phần trích/biên tập. Phỏng theo và nguyên văn được tách bằng kind/source_detail/label; không lấy chú thích hiện đại làm nguyên tác public domain.
- Thoreau dùng Walden/Visitors, hình ba ghế; Emerson dùng riêng vế tình bạn trong Friendship. Schopenhauer có passage nhưng luận điểm individuality bất biến không được đăng như fact tâm lý hiện đại.
- Ba cảnh Chekhov được đối chiếu đúng bản Constance Garnett: Iona kể với ngựa ở Misery, quả lý gai chua/chưa chín mà chủ vườn khen ngon, người bỏ tiền cược sau15 năm. Chỉ kể sự việc, không hứa lắng nghe chữa khỏi đau buồn hoặc ca ngợi cách ly/khinh đời. Không dùng bản dịch hiện đại hay editor summary.
- Gregor và chuyến tàu dùng Die Verwandlung1915 nguyên Đức, Gutenberg22367; Selflo tự diễn ý, không dùng bản dịch Wyllie/Muir/Việt chưa clearance. Không chẩn đoán nhân vật.
- Các note văn học còn lại giữ như thesis phân tích hoặc thiếu passage phù hợp, không biến tác phẩm thành bằng chứng tâm lý cho mọi người. Gutenberg59196 thực là index Dostoevsky, không phải toàn văn tiểu thuyết. Trang author/search cũng không thay locator/edition.
- Phân loại origin theo provenance:12 folklore,6 book_or_work và6 classical_text; taxonomy v1 không đổi. Tổng24 câu đạt, không có Knowledge dependency cần tự nâng trạng thái.
- Không sửa story, Knowledge, UI, schema/contract;10 chương/10 seed quote nhập từ main và173 quote đạt trước giữ nguyên.

## Snapshot cuối B011

| Chỉ số | Giá trị |
|---|---:|
| Corpus đã chốt | **1.506/5.471 (27,53%)** =380 released +1.126 không nhận |
| Corpus còn lại | **3.965**, gồm197 đạt chờ Release |
| Chờ Release | B005:50 +B006:48 +B007:15 +B008:44 +B009:11 +B010:5 +B011:24 =**197** |
| Canonical source | **94** |
| Authoring local | **111**, 1.866 quote /78 story |
| Release hiện tại | **61**, 385 quote /22 story |

Baseline vẫn5.471; Matrix động5.486 có15 quote bổ sung ngoài baseline.197 câu chưa phát hành không cộng released/completed. Authoring110 là snapshot trung gian;111 có origin tags cuối đã kiểm tra.

## Kiểm định

- Publisher Authoring qua schema/semantic/reference/coverage; mọi payload manifest111 khớp checksum/byte count. Content lock cập nhật có lý do cho24 bản đạt.
- **95/95 tests đạt**, không sửa test/gate.
- Candidate Release62 chỉ dựng tạm: thêm đúng197 ID, tổng582 quote;385 quote cũ và22 story descriptor giữ nguyên, mọi checksum/byte count và gate đạt. Bản tạm đã bỏ, không cài vào checkout.
- Eligibility/Matrix chặn124 closure;24 accepted khớp Authoring,173 accepted trước không đổi. Không có exact text duplicate mới. Các quote canonical khác và toàn bộ story/Knowledge không sửa.
- Projection có đúng197 accepted_not_in_release có chủ đích, không issue khác; Matrix fingerprint khớp input hiện hành.
- Release61 và main GitHub không đổi trong đợt. Authoring111 chỉ local.

## Evidence

- `reports/q10-b011-review.json`:148 dòng, before/after, dịch làm việc, passage, source/rights, previous_decision và validation.
- `reports/q10-b011-ready-local-2026-11-01.json`:24 ID B011.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-ready-local-2026-11-01.json`:197 ID kiểm định tích lũy, không ledger mới.
- `reports/q10-b005-b006-b007-b008-b009-b010-b011-release-candidate-gate-2026-11-01.json`:gate tạm, không public proof.

## Các câu đạt

- **Nguyễn Du · Truyện Kiều** — Duyên đôi lứa cũng là duyên bạn bầy. (`research.day24.kieu_016`)
- **Nguyễn Du · Truyện Kiều** — Trải qua một cuộc bể dâu, / Những điều trông thấy mà đau đớn lòng. (`research.10k.b009.kieu.0003.0004`)
- **Nguyễn Du · Truyện Kiều** — Cỏ non xanh tận chân trời, / Cành lê trắng điểm một vài bông hoa. (`research.10k.b009.kieu.0041.0042`)
- **Nguyễn Du · Truyện Kiều** — Tình trong như đã, mặt ngoài còn e. (`research.10k.b009.kieu.0163.0164`)
- **Nguyễn Du · Truyện Kiều** — Người đâu gặp gỡ làm chi, / Trăm năm biết có duyên gì hay không? (`research.10k.b009.kieu.0181.0182`)
- **Nguyễn Trãi · Thuật hứng I** — Mùi thế đắng cay cùng mặn chát, / Ít nhiều đã vậy một hai phen. (`research.day23.rt_th1_03`)
- **Truyền thống ca dao Việt · Chèo đò** — Đôi ta lên thác, xuống ghềnh, / Em ra đứng mũi để anh chịu sào. (`research.day21.boat_roles`)
- **Truyền thống ca dao Việt · Chèo đò** — Chẳng giậm thì thuyền chẳng đi, / Giậm ra ván nát, thuyền thì long đanh. (`research.day21.boat_tension`)
- **Phỏng theo Truyền thống ca dao Việt · Tình cảnh người nhà quê** — Trời ra, gắng; trời lặn, về, / Ngày ngày, tháng tháng, nghiệp nghề truân chuyên. (`research.day21.labor_repetition`)
- **Truyền thống ca dao Việt · Tình cảnh người nhà quê** — Khi trời hạn hán, khi hay mưa dầm, / Khi trời gió bão ầm ầm, / Đồng điền lúa thóc mười phần được ba. (`research.day21.rural_uncertainty`)
- **Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục M** — Một miếng khi đói bằng một đọi khi no. (`research.day21.care_in_need`)
- **Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A** — Ăn theo thuở, ở theo thì. (`research.day22.eat_follow_time`)
- **Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A** — Trước khi lấy thêm cơm, mình còn có thể nhìn xem nồi còn bao nhiêu. (`research.day22.eat_watch_pot`)
- **Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A** — Nhận ơn rồi, có lúc muốn nói điều mình nghĩ cũng thấy ngại. (`research.day22.favor_conflict`)
- **Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A** — Ăn trái nhớ kẻ trồng cây. (`research.day22.remember_planter`)
- **Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục A** — Ăn có bữa, lo không có bữa. (`research.day22.worry_no_meal`)
- **Phỏng theo Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục M** — Khi không đủ sức, ta còn có thể tìm một cách làm khác. (`research.day22.flex_strength`)
- **Truyền thống tục ngữ Việt · Tuyển Huỳnh Tịnh Của · mục M** — Mình sống hơn đống vàng. (`research.day22.life_over_gold`)
- **Phỏng theo Henry David Thoreau** — Trong nhà tôi có ba chiếc ghế: một cho lúc một mình, hai cho tình bạn, ba cho những cuộc gặp gỡ. (`authoring.b003.henry_david_thoreau.002`)
- **Phỏng theo Ralph Waldo Emerson** — Muốn có tình bạn, phần của mình cũng là làm một người bạn. (`authoring.b003.ralph_waldo_emerson.037`)
- **Phỏng theo Anton Chekhov** — Những quả lý gai còn chua và xanh, ông chủ vườn vẫn ăn và khen ngon: đó là những quả đầu tiên từ khu vườn ông đã mơ bấy lâu. (`research.day43.anton_chekhov.016`)
- **Phỏng theo Anton Chekhov** — Không tìm được ai chịu nghe chuyện con trai mất, người đánh xe Iona cuối cùng kể với con ngựa của mình. (`research.day43.anton_chekhov.014`)
- **Phỏng theo Anton Chekhov** — Trong “Vụ cá cược”, người chờ mười lăm năm nhận tiền lại tự rời chỗ giam trước hạn, để mất chính khoản tiền mình từng ao ước. (`research.day43.anton_chekhov.005`)
- **Phỏng theo Franz Kafka** — Gregor tỉnh dậy trong một hình dạng khác hẳn; điều khiến anh cuống lên vẫn là chuyến tàu đi làm. (`research.day45.franz_kafka.001`)

## Đúng một bước tiếp theo

Review trọn Q10-B012 (148 dòng) dưới local khi tiếp tục;197 câu đạt chờ lệnh nghiệm thu/phát hành/GitHub của owner.
