# Q10-B006 — Đã review toàn đợt dưới local

**Hoàn tất:** 2026-11-01  
**Phạm vi:** 149 ID theo assignment cố định. Không commit/push/deploy.

## Kết quả

| Disposition | Dòng |
|---|---:|
| Đạt, đã biên tập và vào Authoring local | 48 |
| Không nhận mới, có lý do và chặn đề xuất lại | 96 |
| Owner đã đóng từ 2026-10-25, giữ nguyên | 5 |
| Chưa xử lý | 0 |

**149 = 48 + 96 + 5.** Pha review hoàn tất. Batch có 101 dòng khép kín và 48 chờ Release; không gọi batch đã hoàn tất phát hành.

Năm quyết định owner thuộc hai mảnh Trang Tử và các bản Pháp Cú5/50/81 được giữ nguyên toàn bộ ledger, closure và evidence; không đổi lý do sang duplicate và không cộng completed lại. Trong 96 kết luận mới: 21 duplicate, 30 context_required, 24 source_unverified, 3 weak_or_misleading, 16 not_reader_quote, 1 rights_not_cleared, 1 too_narrow_for_selflo.

## Những điểm review chính

- Loại các bản trùng passage với Pháp Cú/Lão Tử/MN22 đang Release và các cặp gần trùng trong đợt.
- Không biến ghi chú có nhắc Selflo, AI hoặc phương pháp nghiên cứu thành lời của tác giả/truyền thống.
- Đối chiếu nguyên Pali và segment ID cho Trung Bộ; phân biệt nghĩa Pali với lựa chọn dịch hiện tại của Sujato. Không đưa claim chữa bệnh hay hiệu quả tâm lý phổ quát vào quote thực hành tôn giáo.
- Pháp Cú dùng edition Muller và đối chiếu Pali khi cần; Greek/early-modern dùng edition lịch sử phù hợp, không mặc định mọi bản Anh trên web đều public domain.
- Arendt/modern research: không lấy bài tổng quan/metadata/abstract hoặc URL truy cập được làm clearance cho từng bản diễn ý. Không đọc được toàn văn không chứng minh câu không tồn tại. Các verdict chỉ kết luận bản ghi hiện tại chưa phù hợp/đủ căn cứ cho quote production.
- Upanishad giữ hình ảnh của nguyên tác và bối cảnh tôn giáo trong nguồn; bỏ suy diễn thành mô hình nhận thức khoa học. Những hướng chưa truy được edition đầy đủ được ghi rõ, không giả xác minh.
- Source chỉ thay 48 quote đạt của B006; 50 quote đạt B005 giữ nguyên, không sửa story, Knowledge, contract hoặc mã UI.

## Snapshot sau B006

| Chỉ số | Giá trị |
|---|---:|
| Corpus đã chốt | **865/5.471 (15,81%)** = 380 released + 485 không nhận |
| Corpus còn lại | **4.606**, trong đó 98 đã đạt chờ Release |
| Chờ Release | B005:50 + B006:48 = **98** |
| Authoring local | **102**, 1.856 quote / 68 story |
| Release hiện tại | **61**, 385 quote / 22 story |

Không cộng 98 câu chờ phát hành vào completed. Mẫu số 5.471 giữ nguyên; tổng Matrix động 5.476 vẫn có 5 quote bổ sung ngoài baseline.

## Kiểm định

- Publisher Authoring qua schema/semantic/reference/coverage; manifest102.
- **95/95 tests đạt**, không sửa test để bỏ gate.
- Bản sao tạm qua Release gate: thêm đúng 98 ID B005+B006, tổng483 quote; giữ nguyên 385 quote cũ và 22 story descriptor, checksum/byte count tất cả payload đạt.
- Bản ứng viên tạm không được cài vào checkout; Release vẫn61. Con số483 không phải Release đã phát hành.
- Kiểm tra eligibility/Matrix chặn đủ 96 mới +5 cũ; 48 accepted khớp payload Authoring; 50 accepted B005 không đổi.
- Projection có đúng 98 issue accepted_not_in_release có chủ đích, không có issue khác.
- Dấu kiểm text/provenance cập nhật có lý do; giữ nguyên1856 identity canonical.

## Evidence

- `reports/q10-b006-review.json`: review149 dòng, before/after, passage/segment, source/rights, quyết định cũ và validation.
- `reports/q10-b006-ready-local-2026-11-01.json`: đúng48 ID B006 sẵn sàng cho bước Release.
- `reports/q10-b005-b006-ready-local-2026-11-01.json`: input kiểm định tích lũy98 ID, không phải ledger mới.
- `reports/q10-b005-b006-release-candidate-gate-2026-11-01.json`: bằng chứng gate tạm, không phải public proof.

## Các câu đạt để đọc mẫu hoặc nghiệm thu

- **Phỏng theo Liệt Tử** — Đường nhiều ngã có thể làm mất dê; việc học quá nhiều lối cũng có thể làm lạc điều cốt yếu. (`research.liezi.day5.ch08.071`)
- **Phỏng theo Liệt Tử** — Cẩn trọng lời mình nói, vì có người sẽ nói theo; cẩn trọng việc mình làm, vì có người sẽ làm theo. (`research.liezi.day5.ch08.073`)
- **Phỏng theo Kinh Pháp Cú** — Chính mình là người dẫn dắt mình; khi biết tự rèn, ta tìm được một người dẫn đường khó có thay. (`attributed.dhammapada.verse_160.self_lord`)
- **Phỏng theo Kinh Pháp Cú** — Cứ giữ mãi câu “họ đã xúc phạm, đánh bại, lấy mất của tôi”, lòng thù hận khó lắng xuống. (`research.dhammapada.day11.v003`)
- **Phỏng theo Kinh Pháp Cú** — Coi điều không cốt yếu là cốt yếu, bỏ qua điều cốt yếu, ta dễ đi lạc điều đáng tìm. (`research.dhammapada.day11.v011`)
- **Phỏng theo Kinh Pháp Cú** — Bằng sự tỉnh thức và tự chủ, người sáng suốt dựng cho mình một hòn đảo giữa dòng nước. (`research.dhammapada.day11.v025`)
- **Phỏng theo Kinh Pháp Cú** — Một tâm trí được hướng đúng có thể giúp mình điều mà ngay cả cha mẹ, người thân cũng không làm thay được. (`research.dhammapada.day11.v043`)
- **Phỏng theo Kinh Pháp Cú** — Ai cũng sợ bị làm đau, ai cũng sợ mất mạng; đặt mình vào người khác, bớt làm điều gây hại. (`research.dhammapada.day11.v129`)
- **Phỏng theo Kinh Pháp Cú** — Tránh điều gây hại, làm điều lành, giữ tâm mình trong sáng. (`research.dhammapada.day11.v183`)
- **Phỏng theo Kinh Pháp Cú** — Sức khỏe là của quý; biết đủ là sự giàu có; lòng tin là mối gắn bó đáng giữ. (`research.dhammapada.day11.v204`)
- **Phỏng theo Kinh Pháp Cú** — Những gì do điều kiện tạo thành đều thay đổi. (`research.dhammapada.day11.v277`)
- **Phỏng theo Kinh Pháp Cú** — Ham muốn không được nhìn lại có thể mọc như dây leo, kéo ta hết chỗ này sang chỗ khác. (`research.dhammapada.day11.v334`)
- **Phỏng theo Trung Bộ · MN10** — Quan sát thân như thân, với sự tỉnh táo và chú tâm. (`research.mn.day12.mn10_01`)
- **Phỏng theo Trung Bộ · MN10** — Khi tâm có tham, biết là tâm có tham; khi tâm không có tham, biết là tâm không có tham. (`research.mn.day12.mn10_03`)
- **Phỏng theo Trung Bộ · MN118** — Thở vào dài, biết mình thở vào dài; thở ra dài, biết mình thở ra dài. (`research.mn.day12.mn118_01`)
- **Phỏng theo Trung Bộ · MN131** — Quá khứ đã qua, tương lai chưa tới; điều đang hiện diện có thể được nhìn rõ ngay bây giờ. (`research.mn.day12.mn131_01`)
- **Phỏng theo Trung Bộ · MN19** — Khi một ý nghĩ xuất hiện, trước hết có thể nhận ra: ý nghĩ ấy đang có mặt. (`research.mn.day12.mn19_02`)
- **Phỏng theo Trung Bộ · MN19** — Ý nghĩ này dẫn đến điều gì cho mình, cho người khác, cho cả hai? (`research.mn.day12.mn19_03`)
- **Phỏng theo Trung Bộ · MN21** — Lời người khác có thể đúng lúc hoặc sai lúc, thật hoặc không thật, dịu hoặc thô. Mình vẫn có phần lựa chọn trong lời đáp. (`research.mn.day12.mn21_02`)
- **Phỏng theo Trung Bộ · MN22** — Lời dạy bị nắm sai có thể gây hại, như con rắn bị bắt sai cách quay lại cắn người cầm. (`research.mn.day12.mn22_01`)
- **Phỏng theo Trung Bộ · MN27** — Thấy một dấu chân voi lớn chưa đủ để biết chắc đó là con voi mình đang tìm. (`research.mn.day12.mn27_01`)
- **Phỏng theo Trung Bộ · MN39** — Một danh xưng cần được nâng đỡ bằng cách sống tương ứng với nó. (`research.mn.day12.mn39_01`)
- **Phỏng theo Trung Bộ · MN58** — Điều đúng còn cần có ích, và có lúc thích hợp để nói. (`research.mn.day12.mn58_01`)
- **Phỏng theo Trung Bộ · MN61** — Như soi gương để nhìn mặt, có thể nhìn lại hành động trước khi làm, trong khi làm và sau khi làm. (`research.mn.day12.mn61_01`)
- **Phỏng theo Trung Bộ · MN62** — Đất đón cả thứ sạch lẫn thứ bẩn mà không vì thế ghê sợ hay oán giận. (`research.mn.day12.mn62_01`)
- **Phỏng theo Adam Smith** — Một cộng đồng có thể sống tốt hơn khi sự trợ giúp qua lại được nâng đỡ bằng tình yêu, lòng biết ơn, tình bạn và sự trân trọng. (`authoring.b007.adam_smith.019`)
- **Phỏng theo Baruch Spinoza** — Một việc ta làm vì cảm xúc thụ động cũng có thể được làm từ lý trí, không cần cảm xúc ấy thúc ép. (`authoring.b002.benedictus_de_spinoza.030`)
- **Phỏng theo Epicurus** — Không phải niềm vui nào cũng nên chọn, cũng không phải nỗi đau nào cũng nên tránh; còn phải nhìn điều đi cùng và theo sau nó. (`research.reaudit.day17.meno_choice_compare`)
- **Phỏng theo Epicurus** — Trong những điều trí tuệ chuẩn bị cho một đời sống trọn vẹn, tình bạn có một chỗ đặc biệt. (`research.reaudit.day17.pd27_friendship_security`)
- **Phỏng theo Epicurus** — Ham muốn có thứ tự nhiên và cần thiết, có thứ tự nhiên mà không cần thiết, có thứ nảy từ quan niệm rỗng. (`research.reaudit.day17.pd29_desire_types`)
- **Phỏng theo Truyền thống Bhagavad Gita** — Mỗi lần tâm lại đi lang thang, lại đưa nó trở về. (`research.day18.6_26`)
- **Phỏng theo Truyền thống Bhagavad Gita** — Suy xét điều vừa nghe, rồi hành động theo điều mình lựa chọn. (`research.day18.18_63`)
- **Phỏng theo Truyền thống Bhagavad Gita** — Giữ lòng cân bằng khi hành động, bớt bị được mất kéo đi. (`research.day18.2_48`)
- **Phỏng theo Truyền thống Bhagavad Gita** — Cảm nhận nóng lạnh, dễ chịu và khó chịu đến rồi đi. (`research.reaudit.day18.gita2_14_sensations_pass`)
- **Phỏng theo Aristotle** — Sống tốt không chỉ là có một phẩm chất tốt, mà còn là đem phẩm chất ấy vào đời sống. (`research.day16.happiness_activity`)
- **Phỏng theo Aristotle** — Thiện ý một chiều chưa đủ thành tình bạn; hai người còn cần đáp lại và nhận biết thiện ý của nhau. (`research.reaudit.day16.ne8_friendship_mutual`)
- **Phỏng theo Aristotle** — Muốn làm bạn có thể rất nhanh; thành bạn cần thời gian hiểu và tin nhau. (`research.reaudit.day16.ne8_time_trust`)
- **Phỏng theo Aristotle** — Tình bạn sâu cần thời gian gần gũi; nhiều bạn hơn chưa chắc đã là tốt hơn. (`research.reaudit.day16.ne9_friends_not_maximize`)
- **Phỏng theo Aristotle** — Có thể mong điều tốt cho một người mà giữa mình với họ chưa có tình bạn. (`research.reaudit.day16.ne9_goodwill_not_friendship`)
- **Phỏng theo Muṇḍaka Upanishad** — Hai con chim cùng đậu trên một cây: một con ăn quả ngọt, một con nhìn mà không ăn. (`research.day19.mundaka_two_birds`)
- **Phỏng theo Katha Upanishad** — Thân như cỗ xe, giác quan như ngựa, tâm như dây cương, trí như người cầm cương. (`research.reaudit.day19.katha_chariot`)
- **Tuyển tập Wortabet · không nêu người nói** — Ngày nào tôi không học thêm điều gì, ngày ấy như chưa thuộc về đời tôi. (`authoring.b008.classical_arabic_tradition.011`)
- **Ben Zoma · Pirkei Avot** — Ai khôn ngoan? Người biết học từ mọi người. (`research.day38.001`)
- **Ben Zoma · Pirkei Avot** — Ai mạnh? Người biết tự chủ trước cơn giận của mình. (`research.day38.002`)
- **Ben Zoma · Pirkei Avot** — Ai giàu? Người biết vui với phần mình đang có. (`research.day38.003`)
- **Ben Zoma · Pirkei Avot** — Ai đáng được kính trọng? Người biết kính trọng người khác. (`research.day38.004`)
- **Hillel · Pirkei Avot** — Đừng vội phán xét người khác khi chưa đứng vào hoàn cảnh của họ. (`research.day38.005`)
- **Rabbi Tarfon · Pirkei Avot** — Bạn không phải làm xong tất cả công việc, nhưng cũng không vì thế mà bỏ phần việc của mình. (`research.day38.006`)

## Quy ước tiếp tục

Owner yêu cầu mỗi lượt trọn 100–200 quote và chỉ làm local. Theo chỉ đạo tiếp tục sau handoff B005, B006 tiến pha review khi B005 chờ phát hành; không dùng điều đó để vượt gate nghiệm thu/Release hay tự đưa GitHub. Review đã có kết luận khác với Release đã public xác nhận.

## Đúng một bước tiếp theo

Review trọn Q10-B007 (149 dòng) dưới local khi tiếp tục; giữ 98 câu B005+B006 chờ lệnh nghiệm thu/phát hành/GitHub của owner.
