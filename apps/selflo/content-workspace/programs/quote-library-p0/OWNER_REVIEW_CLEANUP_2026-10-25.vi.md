# Hoàn tất R1–R6 — 25/10/2026

Owner đã yêu cầu áp dụng các quyết định R1–R6 trong hội thoại. Thay đổi content-compatible, không đổi contract hoặc app.

- R1: Việt hóa 87 nhãn nguồn trong quote Release, giữ nguyên authorship/provenance gốc.
- R2: loại 4 quote thiếu ngữ cảnh.
- R3: sửa hai quote gốc Selflo:
  - “Gió đổi chiều nhiều lần trong ngày. Cây đứng vững nhờ bộ rễ bám sâu vào đất.”
  - “Có những việc cần thời gian. Kiểm tra liên tục không có nghĩa là mình đang giúp chúng tiến triển.”
- R4: loại 3 bản Pháp Cú mới trùng nguồn/kệ 5, 50, 81, giữ 3 bản cũ.
- R5: loại cả 3 mục đã nêu, gồm 2 quote trình duyệt và quote giải thích euthymia.
- 10 quote bị loại giữ canonical/Authoring ở trạng thái rejected, thêm release_quote_exclusions, ghi round1_not_pass cùng lý do vào review ledger và gỡ khỏi shortlist. Không tự đề xuất lại trừ khi owner mở lại.
- R6: sửa đường dẫn test Web Reference từ story/app.mjs sang studio/reader/app.mjs; bổ sung 5 story vào danh sách baseline Release; đồng bộ prose hash và shape bài “Nếu được sống một đời người”. Đã xác minh prose hiện tại giống nguyên văn prose tại commit 540a31e; không sửa truyện để làm test đạt.
- Test tags cũ giả định mọi canonical quote có tags đều đang Release. Sửa theo contract: quote Release phải có tags hợp lệ, quote bị loại có thể giữ tags ở Authoring và luôn phải vắng khỏi Release.
- Thêm hai regression tests kiểm tra nhãn nguồn và việc 10 quote bị loại không quay lại Release/shortlist.

## Kết quả xác minh

- Authoring 87: 1.851 quote / 63 story.
- Release 48: 662 quote / 17 story.
- Publisher chạy đủ schema/semantic/coverage gates, không dùng --skip-schema. Dùng đúng ajv-cli 5.0.0 và ajv-formats 3.0.1 đã cài sẵn, tránh tải lại qua mạng.
- 55/55 tests Python đạt.
- Mọi file hai manifest khớp SHA-256 và byte_count.
- Story descriptors hai kênh giữ nguyên so với baseline.
- Review Matrix đã rebuild: 10 quote bị loại đều held_not_passed; manifest revisions 87/48.
- source.json canonical_quote_count được đồng bộ về 1.851, đúng số canonical quote thực tế (trước đây ghi 1.833).
- Không sửa nội dung Authoring ngoài các ID trực tiếp liên quan R1–R5; không chuẩn hóa toàn bộ tiếng Anh Authoring.

Chi tiết trước/sau và danh sách ID: reports/owner-review-cleanup-2026-10-25.json.

Trạng thái: đã chuẩn bị bản sửa và package locally; chưa commit/push/deploy. Quyết định owner trong hội thoại này cho phép gỡ/sửa content, không yêu cầu đẩy GitHub.

Một bước tiếp theo: review diff rồi commit/push khi owner yêu cầu để app tải được Release 48.
