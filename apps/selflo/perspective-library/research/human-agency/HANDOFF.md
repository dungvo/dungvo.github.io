# Bàn giao nghiên cứu triết lý và nội dung Selflo

Ngày bàn giao: 2026-09-17  
Trạng thái: Hoàn tất nghiên cứu, kiểm toán và bộ tài liệu C1–C4 cho pilot suy ngẫm; chờ chủ sở hữu rà soát  
Phạm vi: Triết lý sản phẩm, 389 câu chuẩn, 53 câu phát hành hiện hành và 7 truyện phát hành

## 1. Tóm tắt trạng thái

Chu kỳ nghiên cứu đã hoàn tất sáu phần:

1. Xác lập triết lý và cam kết chiến lược.
2. Hiệu chỉnh kiến trúc nội dung.
3. Đánh giá đủ 389 câu chuẩn.
4. Đánh giá đủ 7 truyện phát hành.
5. Rà soát chất lượng, trùng lặp và nội dung chưa phù hợp triết lý.
6. Lập ma trận bao phủ, phân tích khoảng trống và kế hoạch nội dung.

Không còn câu nào chờ phân loại trong bảng kiểm kê.

Số liệu cuối:

- câu chuẩn: 389;
- câu sau khi không tính lặp: 382;
- câu có độ chắc chắn từ trung bình trở lên: 353;
- câu phát hành hiện hành: 53;
- truyện phát hành: 7;
- câu độ chắc chắn thấp: 31, tất cả đều ở `needs_owner_review` và không phát hành;
- cụm trùng hoặc gần trùng: 8;
- câu được tạm giữ lại khỏi phát hành để xem thêm: 3.

## 2. Triết lý đã chốt

Tài liệu nền tảng: `../../../SELFLO_PRODUCT_PHILOSOPHY.vi.md`.

Nguyên tắc trung tâm:

> Selflo không suy nghĩ thay bạn. Selflo giúp bạn giữ quyền tự suy nghĩ, tự hiểu và tự lựa chọn.

Câu kiểm tra ngắn:

> Người dùng phải là chủ thể; Selflo chỉ tạo không gian và đưa một góc nhìn vừa đủ.

Luận đề không dựa trên việc trí tuệ nhân tạo không thể hiểu hoặc phán đoán. Luận đề là một số quá trình có giá trị vì chính con người tham gia vào chúng: nhận ra, diễn đạt, làm rõ giá trị, lựa chọn và chịu trách nhiệm.

Triết lý này là định hướng và giả thuyết cần kiểm chứng, không phải lợi thế cạnh tranh đã được chứng minh.

## 3. Quyết định nội dung đã thực hiện

Ba câu đã chuyển từ phát hành về `needs_owner_review`:

1. `attributed.ma.iv_07.suppress_injury`
2. `attributed.epictetus.ench_17.role`
3. `attributed.ma.vi_19.human_power`

Lý do chi tiết nằm trong `phase-6e-content-hold-decision.md`.

Cách xử lý:

- không xóa;
- không đổi câu chữ;
- không đổi nguồn gốc hoặc quyền sử dụng;
- thay đổi tại nguồn chuẩn;
- dùng `scripts/prepare-perspective.py --channel authoring`;
- tạo lại Authoring và Release bằng quy trình hiện có;
- giữ lịch sử các phiên bản cũ.

Kết quả:

- Authoring revision: 33;
- Release revision: 10;
- Release giảm từ 56 còn 53 câu;
- ba câu vẫn có trong Authoring để tiếp tục xem xét;
- ba câu không còn trong tệp kê khai Release hiện hành.

## 4. Phát hiện nội dung chính

### Nguồn chuẩn đã có nền tảng phù hợp

Trong lớp nội dung đáng tin cậy:

- hiểu mình: 41;
- quyền tự chủ: 34;
- trách nhiệm: 31;
- làm rõ giá trị: 30;
- kết nối: 29;
- sự hiện diện: 28;
- mở rộng góc nhìn: 27.

Không cần viết thêm hàng trăm câu để chuyển hướng Selflo.

### Khoảng trống phát hành

Các vùng có nội dung đáng tin cậy nhưng chưa có câu phát hành:

- tự cảm thông: 14 → 0;
- cạn năng lượng: 27 → 0;
- hồi phục: 12 → 0;
- áp lực công việc: 23 → 0;
- mất mát: 8 → 0.

### Lệch chuyển động suy ngẫm

Release hiện có:

- đổi khung nhìn: 9;
- hành động: 9;
- nhận ra: 5;
- lựa chọn: 1;
- gọi tên: 0.

Thư viện hiện mạnh ở việc đưa một góc nhìn khác nhưng yếu hơn ở việc giúp người dùng tự diễn đạt và tự hình thành lựa chọn.

### Khoảng trống truyện

Bảy truyện hiện chưa có truyện chính về:

- quan hệ và cô đơn;
- tự cảm thông;
- cạn năng lượng, hồi phục hoặc biết đủ;
- bản sắc khi công việc hoặc năng lực cũ mất giá trị;
- gọi tên một trải nghiệm mơ hồ.

## 5. Hướng nội dung đề xuất

### Trước khi viết mới

Chọn ứng viên sẵn có cho:

1. tự cảm thông;
2. cạn năng lượng và hồi phục;
3. áp lực công việc;
4. gọi tên trải nghiệm;
5. lựa chọn.

Mỗi ứng viên phải được kiểm tra nguồn, quyền, khả năng đứng độc lập, mức độ áp đặt, trùng lặp và ngữ cảnh sử dụng.

### Vai trò dự kiến cho truyện 8–10

- Truyện 8: quan hệ thật, cô đơn, lắng nghe, ranh giới hoặc sửa chữa.
- Truyện 9: bản sắc khi công việc thay đổi; giá trị con người không đồng nhất với năng suất.
- Truyện 10: nhịp sống, giới hạn, hồi phục, biết đủ và tự cảm thông.

Đây chỉ là vai trò nội dung, chưa phải quyết định viết hoặc cốt truyện.

### Chưa nên tăng thêm

- lời thúc đẩy hành động chung;
- nội dung hứa ước mơ chắc chắn thành hiện thực;
- thêm ngụ ngôn về may rủi hoặc bất định;
- nội dung chỉ đổi góc nhìn nhưng không tạo chỗ tự diễn đạt hoặc lựa chọn;
- trích thêm từ một nguồn văn học chỉ để tăng số lượng.

## 6. Hàng đợi cần chủ sở hữu rà soát

### Ba câu đang tạm giữ lại

Quyết định một trong các hướng:

- giữ với giới hạn ngữ cảnh;
- chỉ dùng khi đi cùng một nội dung cân bằng;
- đổi vai trò hoặc hoàn cảnh sử dụng;
- không phát hành độc lập và chỉ giữ cho nghiên cứu nguồn.

### Tám cụm trùng hoặc gần trùng

Xem `phase-6b-duplicate-candidates.tsv`. Không xóa tự động. Cần chọn bản đầy đủ hoặc xác nhận hai bản có vai trò biên tập khác nhau.

### Ba mươi mốt câu độ chắc chắn thấp

Xem `phase-6a-low-confidence-review.tsv`. Cả 31 câu đã an toàn ở ngoài Release. Phần lớn là mảnh trích từ *Nhà giả kim* phụ thuộc ngữ cảnh.

## 7. Thứ tự đọc khi rà soát lại

Nếu chỉ có ít thời gian, đọc theo thứ tự:

1. `../../../SELFLO_PRODUCT_PHILOSOPHY.vi.md`
2. `phase-8-final-strategy-and-content-plan.md`
3. `phase-7-coverage-and-gap-report.md`
4. `phase-6-quality-review-summary.md`
5. `phase-5-released-stories-review.md`
6. `phase-6e-content-hold-decision.md`

Nếu cần kiểm tra số liệu chi tiết:

- `phase-4-full-library-audit.tsv`
- `phase-7h-capacity-summary.tsv`
- `phase-7i-situation-summary.tsv`
- `phase-7j-movement-summary.tsv`
- `phase-7k-gap-priorities.tsv`

## 8. Tệp thay đổi ngoài tài liệu nghiên cứu

### Triết lý và mục lục

- `SELFLO_PRODUCT_PHILOSOPHY.vi.md`
- `README.md`

### Nguồn chuẩn

- `perspective-library/source/vi/quotes/emotion/002.vi.json`
- `perspective-library/source/vi/quotes/meaning_values/003.vi.json`
- `perspective-library/source/vi/quotes/work_achievement/002.vi.json`
- `perspective-library/source/vi/source.json`

### Dẫn xuất Authoring

- manifest và updates revision 33;
- audit `r33.json`;
- ba gói chủ đề mới cho emotion, meaning-values và work-achievement.

### Dẫn xuất Release

- manifest và updates revision 10;
- audit `r10.json`;
- ba gói chủ đề mới cho emotion, meaning-values và work-achievement.

Không chỉnh tay các tệp Release; chúng được tạo qua quy trình chuẩn.

## 9. Kiểm tra đã chạy

- `python3 scripts/test_prepare_perspective.py`: 9/9 đạt.
- Quy trình Authoring/Release đã chạy thành công khi tạm giữ ba câu.
- Xác minh ba câu có `review.status = needs_owner_review` trong nguồn chuẩn.
- Xác minh ba câu có trong Authoring và không có trong Release.
- Xác minh Release hiện có 53 câu.
- Xác minh đủ 389 câu trong bảng kiểm kê và không còn trạng thái chờ đánh giá.
- Xác minh tổng Release trong các ma trận năng lực, hoàn cảnh và chuyển động đều bằng 53.
- `git diff --check`: đạt.

## 10. Trạng thái kho mã

Các thay đổi chưa được tạo commit hoặc đẩy lên kho từ xa.

`../selflo.zip` là tệp không được theo dõi đã có sẵn ngoài phạm vi công việc; không chỉnh sửa hoặc đưa vào thay đổi.

Toàn bộ thư mục `perspective-library/research/human-agency/` hiện là tài liệu nghiên cứu mới. Khi chuẩn bị commit, cần xem lại phạm vi tệp để bảo đảm chỉ đưa vào những tài liệu và dẫn xuất có chủ ý.

## 11. Việc chưa làm

- Chưa chọn thêm câu nào để phát hành.
- Chưa sửa hoặc hợp nhất câu trùng.
- Chưa quyết định cuối cho ba câu đang tạm giữ.
- Chưa thay đổi lược đồ sản phẩm theo kiến trúc nội dung.
- Chưa xây tính năng Hành trình theo triết lý mới.
- Chưa viết truyện thứ 8, 9 hoặc 10.
- Chưa tiến hành nghiên cứu người dùng về giá trị của sự tự tham gia.
- Chưa commit, push hoặc triển khai website.

## 12. Cách bắt đầu phiên làm việc tiếp theo

1. Đọc sáu tài liệu theo thứ tự ở mục 7.
2. Rà lại triết lý và phản biện các giả thuyết H1–H5.
3. Xác nhận hoặc điều chỉnh năm vùng ưu tiên.
4. Quyết định chu kỳ tiếp theo là:
   - cân bằng Release bằng nội dung sẵn có;
   - giải quyết hàng đợi biên tập;
   - nghiên cứu người dùng;
   - hay thiết kế truyện thứ 8.
5. Chỉ sau khi chốt mục tiêu mới lập kế hoạch thực thi.

Không nên bắt đầu bằng việc viết thêm nội dung hoặc thêm trường vào lược đồ.

## 13. Pilot suy ngẫm C0–C4 — 2026-09-17

- Khóa baseline local: Authoring 33 có 389 quote active; Release 10 có 53 quote active. Ba câu tạm giữ có trong Authoring và không có trong active Release.
- Xác minh toàn bộ byte count/SHA-256 theo manifest, manifest SHA theo audit, test prepare 9/9, test updates 1/1 và Ruby syntax. `git diff --check` đạt cho canonical source/generated artifacts; toàn bộ research mới còn cảnh báo dấu cách cuối dòng Markdown có chủ ý từ các tài liệu trước pilot.
- Public endpoint vẫn ở Release 9; Release 10 chỉ là baseline ứng viên local, chưa được tuyên bố đã triển khai.
- Tạo shortlist 13 ứng viên nghiên cứu phủ tự cảm thông, cạn năng lượng, hồi phục, áp lực công việc, gọi tên và lựa chọn. Tất cả vẫn giữ trạng thái canonical hiện tại; không tự nâng lên Release-ready.
- Tạo tám lời mời viết dạng bản thảo, ma trận ghép có rationale/rủi ro và gói review owner. “Không đưa Góc nhìn” được giữ như một kết quả hợp lệ.
- Không sửa canonical quote, Authoring/Release artifact, schema, publisher hoặc app; không tạo JSON runtime.
- Owner đã chốt pilot đầu gồm năm lời mời, tám Góc nhìn và ánh xạ tối giản. Mặc định kết thúc sau lời người dùng; chỉ đưa Góc nhìn khi họ chủ động muốn xem thêm. Không chọn nội dung bằng nguyên văn người dùng.
- Không đổi canonical `review.status`, không publish Release và không tạo JSON runtime từ quyết định này.
- Bước tiếp theo duy nhất: rà soát biên tập lần cuối năm lời mời trong ngữ cảnh liền mạch trước khi cân nhắc giai đoạn tích hợp riêng.

## 14. Ưu tiên nội dung — danh sách rút gọn cân bằng Release công khai 2026-09-17

- Owner chốt ưu tiên hoàn thiện content trước khi mở rộng app; app tiếp tục chỉ là tham chiếu đọc.
- Sàng lọc nguồn chuẩn theo khoảng trống triết lý, độ chắc chắn cao, quyền rõ, chưa Release, không thuộc cụm trùng và không nằm trong ba câu tạm giữ.
- Từ 61 ứng viên qua điều kiện ban đầu, tạo danh sách rút gọn 20 câu: 17 câu ưu tiên duyệt và 3 câu dự phòng.
- Nếu toàn bộ 17 câu ưu tiên được duyệt, Release có thể tăng từ 53 lên 70 câu; đây là hệ quả, không phải chỉ tiêu.
- Chưa đổi `review.status`, chưa sửa nguyên văn, chưa tạo lại Authoring/Release và chưa publish.
- Bước tiếp theo duy nhất: chủ sở hữu duyệt từng câu trong `phase-10b-public-release-review-package.md` trước khi có thay đổi nguồn chuẩn riêng.

## 15. Editorial Compass và Release 11 — 2026-09-17

- Thêm La bàn biên tập tám câu hỏi, ánh xạ sáu vai trò biên tập với kiến trúc nghiên cứu hiện có và tiêu chuẩn truyện năm phần. Không tạo taxonomy hoặc lược đồ runtime mới.
- Ghi ba gia đình nội dung nghiên cứu: nhanh hơn nhưng không nhẹ hơn; nhiều câu trả lời nhưng khó nghe mình hơn; biết đáp án khác với tự hình thành hiểu biết.
- Owner duyệt phân tầng A–D cho shortlist 20 câu. `roof_releases_the_storm_slowly` được giữ ở Authoring vì trùng vai trò với câu mưa/mặt đất ngắn và mở hơn.
- Ba quote `energy_has_a_budget`, `hands_keep_the_hammers_echo`, `house_turns_off_one_window_at_a_time` đạt về câu chữ nhưng chưa Release vì story liên kết là bản thảo AI-assisted, `human_edited = false` và quyền chưa xác minh. Không tách liên kết để vượt gate.
- Kiểm tra bốn nhóm knowledge dependency bằng paper khai báo; sửa DOI Self-Compassion sang `10.1080/15298860309032`; lưu bằng chứng tại `RELEASE_R11_SOURCE_REVIEW.vi.md`.
- Duyệt và phát hành local tám quote độc lập. Authoring tăng lên revision 34; Release tăng lên revision 11 với 61 quote active.
- Không sửa app. Release 11 đã được commit tại `f5403c2`, push lên `main` và GitHub Pages triển khai thành công.
- Đã xác minh public manifest ở revision 11, `content_version = release-selected-quotes-28`; toàn bộ 27/27 descriptor khớp SHA-256 và byte count, đồng thời đủ đúng tám quote được duyệt.
- Bước tiếp theo: quan sát chất lượng/phân bố của 61 quote đang Release; chỉ quay lại ba quote có story liên kết sau khi story qua human edit và quyền được xác minh.

## 16. Quote Coverage Audit — Cluster 2 — 2026-09-17

- Khóa baseline ở public Release 11 với 61 quote active; không dùng lại baseline 53.
- Đọc đủ 54/54 quote `self_understanding` và sàng lọc thêm 101 quote thuộc `emotion`, `relationships`, `rest_wellbeing` để tìm cạnh tranh xuyên theme.
- Không sửa canonical, review status, Authoring/Release artifact, publisher, schema hoặc app; không viết quote/story mới.
- Candidate Release duy nhất: `first_needle_needs_light_not_blame`; chưa đổi trạng thái vì cần owner approval riêng.
- Edit candidates: `damp_paper_is_not_the_pens_fault`, `old_pattern_not_identity`, `self_judgment_loop_digest`, `scratched_table_stays_in_the_home`.
- Hai gap thật chưa có winner: hai cảm xúc trái chiều cùng tồn tại; không chắc mình muốn gì.
- Các câu về thước đo ngoài và cảm xúc so với lựa chọn được chuyển sang Cluster 3/Comparison để cạnh tranh đúng editorial job.
- Bước tiếp theo: audit Cluster 3 — Uncertainty / Choice / Agency theo cùng phương pháp, không đặt quota.
