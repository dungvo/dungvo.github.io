# Q10-B004 — Review 165 câu và khép mốc rà Release

Trạng thái: đã kiểm định cục bộ, chờ kiểm chứng public để đóng đợt và mốc.

- **165 câu có kết luận: 87 giữ lại, 78 không đạt**; viết lại **62 văn bản**.
- Không đạt: 25 mờ/dễ hiểu sai, 24 thiếu ngữ cảnh, 21 trùng ý/nguồn, 8 quá chuyên biệt.
- Sửa các bản ghi sai vị trí: “Trong khi trì hoãn, đời trôi” thuộc thư Seneca 1.3 (ID ep032 giữ nguyên); “Học trong khi dạy” thuộc thư 7.8, không thư 6. Chuỗi Latin không khớp được ghi rõ trong report, không coi research metadata là nguyên văn đã xác minh.
- Loại bản dịch Seneca đổi sức mạnh của cơn giận thành sức lực người đọc; loại câu phủ nhận tổn thương, bảo đảm đổi suy nghĩ sẽ hết khổ, hoặc mọi người đều có cùng khả năng.
- Giữ câu thơ/ca dao/ tục ngữ đủ nghĩa độc lập; phân biệt tác giả khuyết danh với người sưu tầm/dẫn (Phan Khôi, Huình Tịnh Paulus Của). Câu cổ cần quá nhiều ngữ cảnh không bị ép thành lời khuyên hiện đại.
- Việt hóa Sổ tay, Suy tưởng, Thư đạo đức gửi Lucilius và nhãn nguồn; tên người giữ dạng quen dùng theo glossary. Không nâng trạng thái quyền, không dùng bản dịch Việt hiện đại bên ngoài.
- Nguồn đối chiếu: Epictetus bản George Long và Marcus Aurelius bản George W. Chrystal (Project Gutenberg); Seneca nguyên văn Latin (The Latin Library/Wikisource); văn học Việt (Wikisource); Thoreau/Emerson bản Project Gutenberg. Ghi cả hash snapshot, passage, locator và bản trước–sau.
- Authoring 91: 1.851 quote / 63 story. Release 52: **376 quote / 17 story**; gỡ đúng 78 ID, không thêm ID mới.
- **94/94 tests đạt**; publisher/schema/semantic/coverage và checksum/byte_count hợp lệ. Đúng 165 canonical quote thay đổi; mọi quote ngoài đợt và story source/descriptor giữ nguyên.
- Đối soát mốc Q10.1: **662 baseline câu = 376 giữ + 286 không đạt**. Tất cả 376 câu còn trong Release đều có review/hash/attribution khớp; rà bổ sung các trường người đọc thấy, không còn thân quote/nhãn tác phẩm Anh, Hoa, Hy Lạp chưa chuẩn hóa. Tên riêng người được giữ; provenance/URL/ID nội bộ ngoài kiểm tra ngôn ngữ hiển thị.
- Decision authority vẫn là canonical-ai-review; bằng chứng mốc `reports/q10-1-release-phase-audit.json`, từng câu `reports/q10-b004-review.json`.

Bước tiếp theo: cập nhật package lên main, xác nhận public Release 52 rồi đóng B004/Q10.1. Chưa bắt đầu B005/story.
