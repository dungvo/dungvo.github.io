# Q10-B008 — Review toàn đợt local

**Hoàn tất:** 2026-11-01. **Phạm vi:** đúng149 ID assignment; không commit/push/deploy.

## Kết quả

| Kết luận | Dòng |
|---|---:|
| Đạt, đã biên tập vào Authoring local | 44 |
| Không nhận, có final program closure mới | 103 |
| Owner đã đóng, giữ nguyên ledger/closure | 2 |
| Chưa xử lý | 0 |

149 =44+103+2. Trong103 closure mới có6 legacy round1_not_pass được xác nhận giữ loại, không mở lại. Hai owner-closed (too_many_tabs_slow_the_important_one và research.seneca.day9.tranq5) giữ nguyên toàn bộ quyết định và evidence, không cộng completed lại. B008105 dòng khép kín và44 chờ Release; review hoàn tất không đồng nghĩa đã phát hành.

Lý do103 bản không nhận:37 context_required,23 duplicate,18 source_unverified,12 not_reader_quote,8 rights_not_cleared và5 weak_or_misleading. Bản gốc các câu không nhận được giữ; các câu tiếng Anh có bản Việt làm việc để đánh giá, không loại vì ngoại ngữ.

## Điểm biên tập và xác minh

- Epictetus dùng phần dịch George Long trong Gutenberg10661. Với LI dùng bản Higginson1865 trong Gutenberg45109: Long đánh đoạn tương ứng làL. Không lấy introduction/bibliography hiện đại của edition1955 làm public-domain content.
- Sửa locator của câu quả sung: DiscoursesI.15, khôngIII.24. Bản ghi IV về điều đi trước/đi sau thực thuộc EnchiridionXXIX; giữ đúng một bản .29.024. BảnXIV về cuộc thi thuộcXIX và được loại trùng với .19.017.
- Các bản cùng passage EnchiridionI/V/VIII/X, MeditationsIII.4/IV.17/V.20/VI.6/VI.11/VI.21/VII.8 đang Release được chặn trùng; không phát thêm một diễn ý của cùng đoạn.
- Marcus dùng đúng George W.Chrystal1902, người dịch1880–1944. Không gán bản55317 cho George Long. Giữ lời tự nhắc và quan sát có giới hạn; không giữ tuyên bố chỉ judgment gây đau, ngoại cảnh không thể hại hoặc con người nên nén grief.
- Chín bản cổ văn đối chiếu mục điển nguồn qua web Bộ Giáo dục. Curl chỉ tải HTML shell của từ điển nên evidence đánh dấu riêng; primary excerpt đã đọc qua web có URL/locator/đoạn trích riêng. Chỉ tự dịch cổ văn public domain, không lấy diễn giải/chú thích hiện đại làm public domain. Ngôn ngữ nguồn làzh.
- Bản Lincoln gắn rõ diễn văn Peoria1854 và lập trường chống slavery; Franklin giữ lời tự thuật về sửa lỗi. Russell có passage nhưng mất1970, không suy quyền toàn cầu từ nhãn public domain USA của Gutenberg.
- Bảy quote seed truyện vẫn unverified/provenance cần owner xác nhận, không tự nâng selflo_owned. Story và Knowledge không được sửa/promote. Framework stoicism của3 quote đã source_checked/approved, được dùng nguyên trạng trong phạm vi triết học, không coi là trị liệu.
- Ghi chú AI/kinh tế/affect-labeling/choice-overload được đánh giá đúng vai trò nghiên cứu: mẫu, tác vụ, mốc dữ liệu, điều kiện, suy luận và instruction sản phẩm không tự thành quote. Không đọc được nguồn không chứng minh câu không tồn tại, cũng không được ghi là đã đọc toàn văn.

## Snapshot cuối B008

| Chỉ số | Giá trị |
|---|---:|
| Corpus đã chốt | **1.101/5.471 (20,12%)** =380 released +721 không nhận |
| Corpus còn lại | **4.370**, gồm157 đã đạt chờ Release |
| Chờ Release | B005:50 +B006:48 +B007:15 +B008:44 =**157** |
| Canonical source | **89** |
| Authoring local | **106**, 1.856 quote /68 story |
| Release hiện tại | **61**, 385 quote /22 story |

Mẫu số baseline vẫn5.471; Matrix động5.476 có5 quote bổ sung ngoài baseline.157 câu chờ phát hành chưa cộng completed/released.

## Kiểm định

- Publisher Authoring qua schema/semantic/reference/coverage; mọi payload manifest106 khớp checksum/byte count. Content lock cập nhật có lý do cho44 câu biên tập và ngôn ngữ nguồn.
- **95/95 tests đạt**, không sửa test để qua gate.
- Release candidate62 chỉ dựng tạm: thêm đúng157 ID, tổng542 quote.385 quote cũ và22 story descriptor giữ nguyên; mọi checksum/byte count và gate đạt. Thư mục tạm đã bỏ, không cài candidate vào checkout.
- Eligibility/Matrix chặn đủ103 closure mới +2 owner cũ.44 accepted khớp nội dung Authoring;113 accepted trước giữ nguyên. Tất cả quote canonical ngoài44 bản đạt và các story giữ nguyên.
- Projection có đúng157 accepted_not_in_release có chủ đích, không có issue khác; Matrix fingerprint khớp input hiện hành.
- Source cuối89 có metadata ngôn ngữzh đúng cho9 câu; Authoring104/105 là snapshot trung gian;106 giữ metadata ngôn ngữ và nhãn chương/đoạn cụ thể cho2 quote đã có. Release61 không đổi.

## Evidence

- `reports/q10-b008-review.json`:149 dòng, before/after, bản Việt làm việc, passage, source/rights, quyết định cũ và validation.
- `reports/q10-b008-ready-local-2026-11-01.json`:44 ID B008.
- `reports/q10-b005-b006-b007-b008-ready-local-2026-11-01.json`:157 ID kiểm định tích lũy; không phải ledger mới.
- `reports/q10-b005-b006-b007-b008-release-candidate-gate-2026-11-01.json`:bằng chứng gate tạm, không phải public proof.

## Các câu đạt

- **Epictetus · Encheiridion · IV** — Trước khi bắt đầu, hình dung cả những điều thường xảy ra trong việc ấy. (`attributed.epictetus.ench_04.prepare`)
- **Phỏng theo Epictetus** — Ta có thể xem xét cả điều đang nghĩ lẫn cách mình đi đến nhận định ấy. (`research.epictetus.day7.discourses.1_1.033`)
- **Phỏng theo Epictetus** — Việc học triết bắt đầu từ nhận ra có những điều thiết yếu mình còn chưa hiểu đủ. (`research.epictetus.day7.discourses.2_11.040`)
- **Phỏng theo Epictetus** — Một thói quen có thể được thay dần bằng việc tập làm một điều khác ở chỗ nó từng xuất hiện. (`research.epictetus.day7.discourses.2_18.041`)
- **Phỏng theo Epictetus** — Ta không biết xúc xắc sẽ rơi thế nào; phần việc của ta là xử lý lượt đã gieo cho cẩn thận. (`research.epictetus.day7.discourses.2_5.039`)
- **Phỏng theo Epictetus** — Ngay cả quả sung cũng cần ra hoa, kết trái rồi chín; việc rèn tâm trí càng cần thời gian. (`research.epictetus.day7.discourses.3_24.044`)
- **Phỏng theo Epictetus** — Việc tiến bộ có lúc đòi mình chịu được vẻ ngoài chưa biết. (`research.epictetus.day7.enchiridion.13.013`)
- **Phỏng theo Epictetus** — Có những cuộc đua mà phần thắng vốn không chỉ nằm trong tay mình. (`research.epictetus.day7.enchiridion.19.017`)
- **Phỏng theo Epictetus** — Chọn học triết cũng có thể là chấp nhận bị cười lúc mới bắt đầu. (`research.epictetus.day7.enchiridion.22.020`)
- **Phỏng theo Epictetus** — Một người bạn có thể không đem lại tiền bạc hay địa vị, mà vẫn đem lại sự tin cậy. (`research.epictetus.day7.enchiridion.24.021`)
- **Phỏng theo Epictetus** — Trước khi tiếc một điều chưa có, thử nhìn phần mình sẽ phải bỏ ra để đổi lấy nó. (`research.epictetus.day7.enchiridion.25.022`)
- **Phỏng theo Epictetus** — Một lời chê của người qua đường cũng có thể chiếm cả tâm trí mình. (`research.epictetus.day7.enchiridion.28.023`)
- **Phỏng theo Epictetus** — Trước khi chọn một việc, nhìn cả điều nó đòi hỏi và điều có thể theo sau. (`research.epictetus.day7.enchiridion.29.024`)
- **Phỏng theo Epictetus** — Trước một điều hấp dẫn, mình vẫn có thể chừa một khoảng rồi mới chọn. (`research.epictetus.day7.enchiridion.34.026`)
- **Phỏng theo Epictetus** — Nhận một vai quá sức có thể khiến mình bỏ lỡ cả phần việc vốn có thể làm tốt. (`research.epictetus.day7.enchiridion.37.028`)
- **Phỏng theo Epictetus** — Mình còn chờ đến bao giờ mới sống theo điều đã nhận là đáng làm? (`research.epictetus.day7.enchiridion.51.032`)
- **Phỏng theo Epictetus** — Có một con ngựa đẹp khác với chính mình có một phẩm chất đáng quý. (`research.epictetus.day7.enchiridion.6.010`)
- **Marcus Aurelius · Suy tưởng · Quyển IV, đoạn 31** — Một nghề khiêm nhường vẫn có thể đem lại niềm vui cho người đã học nó. (`attributed.ma.iv_31.love_your_art`)
- **Phỏng theo Marcus Aurelius** — Mình đang dùng tâm trí mình vào việc gì? (`attributed.ma.v_11.use_of_soul`)
- **Phỏng theo Marcus Aurelius** — Từ Rusticus, Marcus học nhận ra những điều trong tính cách mình cần sửa. (`research.marcus.day8.book01.1_7.001`)
- **Phỏng theo Marcus Aurelius** — Đọc kỹ hơn một chút, thay vì vội hài lòng với điều mới chỉ biết lướt qua. (`research.marcus.day8.book01.1_7.002`)
- **Phỏng theo Marcus Aurelius** — Nói mãi về người tử tế chưa thay được việc sống tử tế. (`research.marcus.day8.book10.10_16.038`)
- **Phỏng theo Marcus Aurelius** — Nhớ mình cũng từng sai có thể làm lời phán xét bớt nặng. (`research.marcus.day8.book11.11_18.043`)
- **Phỏng theo Marcus Aurelius** — Một cành bị cắt khỏi cây; một người đã xa cách người khác vẫn có thể tìm đường nối lại. (`research.marcus.day8.book11.11_8.041`)
- **Phỏng theo Marcus Aurelius** — Trong phần hiện tại đang có, mình vẫn có thể hướng việc làm về sự công bằng. (`research.marcus.day8.book12.12_1.044`)
- **Phỏng theo Marcus Aurelius** — Điều biết là không đúng thì đừng làm; điều biết là không thật thì đừng nói. (`research.marcus.day8.book12.12_17.047`)
- **Phỏng theo Marcus Aurelius** — Ta cần nhau để cùng làm việc, như hai bàn tay cần phối hợp. (`research.marcus.day8.book02.2_1.005`)
- **Phỏng theo Marcus Aurelius** — Việc đang ở trước mặt cũng đáng được làm với sự chăm chút. (`research.marcus.day8.book02.2_5.007`)
- **Phỏng theo Marcus Aurelius** — Ngoài nơi chốn để nghỉ, ta còn có những lúc lùi lại với chính mình. (`research.marcus.day8.book04.4_3.013`)
- **Phỏng theo Marcus Aurelius** — Một lần chưa làm được như điều mình tin không nhất thiết là lý do bỏ hẳn việc ấy. (`research.marcus.day8.book05.5_9.019`)
- **Phỏng theo Marcus Aurelius** — Chưa được nhìn nhận là người khôn ngoan vẫn không ngăn mình sống theo điều đã hiểu. (`research.marcus.day8.book08.8_1.029`)
- **Phỏng theo Marcus Aurelius** — Việc mình sắp làm sẽ để lại điều gì? (`research.marcus.day8.book08.8_2.030`)
- **Phỏng theo Marcus Aurelius** — Có lúc ta đang gánh cả những khó khăn chưa tới, thay vì một việc đang ở trước mặt. (`research.marcus.day8.book08.8_36.031`)
- **Phỏng theo Abraham Lincoln** — Lincoln nhìn việc phản đối chế độ nô lệ như một biểu hiện của lòng yêu công lý. (`authoring.b010.abraham_lincoln.016`)
- **Phỏng theo Benjamin Franklin** — Khi tôi mải đề phòng một lỗi, một lỗi khác lại làm tôi bất ngờ. (`authoring.b010.benjamin_franklin.022`)
- **Phỏng theo Lã Thị Xuân Thu** — Thuyền đã đi, kiếm vẫn ở lại dưới nước; dấu khắc trên thuyền không còn chỉ đúng chỗ kiếm rơi. (`research.day27.ke_zhou_qiu_jian`)
- **Phỏng theo Truyền thống Đại Bát Niết-bàn** — Chạm vào tai voi, người ấy nói voi giống cái nia; chạm vào đuôi, người khác lại nói voi giống sợi dây. (`research.day27.mang_ren_mo_xiang`)
- **Phỏng theo Chiến Quốc Sách** — Một người báo ngoài chợ có hổ, vua chưa tin; ba người cùng nói, ông bắt đầu tin. (`research.day27.san_ren_cheng_hu`)
- **Phỏng theo Chiến Quốc Sách** — Người vẽ xong con rắn sớm nhất lại mất phần rượu vì còn mải vẽ thêm chân cho nó. (`research.day27.hua_she_tian_zu`)
- **Phỏng theo Lục Giả** — Triệu Cao gọi con hươu là ngựa; trước cùng một con vật, có quan nói ngựa, có quan nói hươu. (`research.day27.zhi_lu_wei_ma`)
- **Phỏng theo Trang Tử** — Người học cách đi ở Hàm Đan chưa học được bước mới, đã quên cả bước cũ và phải bò về. (`research.day27.han_dan_xue_bu`)
- **Phỏng theo Khổng Tử** — Được chỉ một góc, người học còn có phần tự tìm ra ba góc kia. (`research.day27.ju_yi_fan_san`)
- **Phỏng theo Phó Huyền** — Ở gần màu son dễ nhuốm đỏ, ở gần mực dễ nhuốm đen. (`research.day27.jin_zhu_jin_mo`)
- **Phỏng theo Âu Dương Tu** — Ông bán dầu rót qua lỗ đồng tiền mà không làm ướt nó, rồi nói: chỉ là tay đã quen. (`research.day27.shu_neng_sheng_qiao`)

## Đúng một bước tiếp theo

Review trọn Q10-B009 (149 dòng) dưới local khi tiếp tục, giữ157 câu chờ lệnh nghiệm thu/phát hành/GitHub của owner.
