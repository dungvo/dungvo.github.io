# Seed chủ đề và snapshot backlog Selflo

**Ngày snapshot:** 2026-10-15
**Ý nghĩa:** danh sách phát triển nội dung, không phải lịch đăng và không phải cam kết Release.

## 1. Snapshot số lượng thật trong repo

| Lớp dữ liệu | Số lượng | Nguồn đếm | Cách hiểu |
|---|---:|---|---|
| Dòng quote hợp nhất | 5.470 | `studio/review-matrix/data.json` | Có raw/provenance/trùng; không phải 5.470 content production |
| Quote canonical Authoring | 1.850 | Review Matrix, Authoring revision 84 | Quote trong canonical/Authoring |
| Quote Release | 656 | Review Matrix, Release revision 45 | Quote đã phát hành |
| Quote Authoring chờ Release | 1.194 | Review Matrix | Chưa đồng nghĩa đủ gate hoặc đã được owner duyệt |
| Story tổng trong matrix | 62 | Review Matrix | 16 Release + 46 Authoring-only |
| Story Release | 16 | Review Matrix | Đã phát hành |
| Story Authoring-only | 46 | Review Matrix | Cần quyết định sửa/chờ/loại/release theo từng bài |
| Knowledge/Insight được inventory xác nhận Release | 2 | `KNOWLEDGE_CONTENT_INVENTORY.vi.md` | “Vì sao hỏi AI…?” và “Nếu tôi sai nhưng ChatGPT đồng ý…?” |
| Story/Góc nhìn khác được inventory xác nhận Release | 3 | Inventory | “Lần cuối…”, “Cùng một ly nước…”, “Cùng một sự việc…” |
| Companion analysis canonical | 2 | `source/vi/analyses/index.json` | Lớp nội bộ/Studio, không tự xem là public content độc lập |

Trạng thái CLI riêng hiện có 1.438 item đều là `imported`; số này chưa thống nhất với Review Matrix và không dùng thay cho các số Authoring/Release ở trên.

## 2. Backlog seed mới từ cuộc thảo luận

| Cụm | Seed nội dung | Dạng dự kiến | Số content hiện có cho seed này | Trạng thái | Bước tiếp theo |
|---|---|---|---:|---|---|
| Thái Cực | Thái Cực là quy luật hay mô hình quan sát? | Knowledge | 0 | Có đối thoại nền | Chọn làm câu hỏi trung tâm và nghiên cứu nguồn |
| Thái Cực | “Vật cực tất phản” đúng trong điều kiện nào? | Knowledge/case | 0 | Seed | Định nghĩa claim và tìm phản ví dụ |
| Thái Cực | Cân bằng không phải 50/50 | Story ngắn + giải thích | 0 | Seed | Viết outline đời thường, không claim phổ quát |
| Thái Cực | Điều gì thực sự thay đổi: sự việc hay cách ta nhìn? | Story/Insight | 0 | Seed, gần content hai góc nhìn hiện có | Kiểm tra trùng với 2 story Release trước khi viết |
| Thái Cực | Có cần cái xấu để nhận ra cái tốt? | Vấn–đáp/Knowledge | 0 | Có lập luận nền | Research nhận thức tương phản; chống lãng mạn hóa đau khổ |
| Đạo Đức Kinh | Tri túc có phải ngừng cố gắng? | Knowledge/Story | 0 | Seed | Xác minh văn bản và các diễn giải |
| Đạo Đức Kinh | Mềm/yếu có luôn thắng cứng/mạnh? | Knowledge/case | 0 | Seed | Chọn chương, locator và giới hạn |
| Đạo Đức Kinh | Vô vi có phải không làm gì? | Knowledge | 0 | Seed | Research lịch sử khái niệm |
| Triết học tương đồng | Biến đổi: Thái Cực và Heraclitus giống/khác gì? | So sánh | 0 | Seed | Chọn nguồn chuyên môn cho cả hai truyền thống |
| Triết học tương đồng | Thái Cực, Khắc kỷ và Aristotle giúp ra quyết định khác nhau ra sao? | So sánh tình huống | 0 | Seed | Dùng một case chung, tránh đồng nhất |
| Triết học tương đồng | Ubuntu/Ayni: con người trong quan hệ và tương hỗ | Story/Knowledge | 0 | Seed | Tìm nguồn từ chính truyền thống/cộng đồng liên quan |
| Khoa học đời thường | Vì sao nước không chỉ “bay hơi ở 100°C”? | Knowledge ngắn | 0 | Seed | Viết theo điều kiện nhiệt độ/áp suất |
| Khoa học đời thường | Mô hình hữu ích dù không đúng trong mọi điều kiện | Knowledge | 0 | Seed | Chọn ví dụ khoa học dễ kiểm chứng |
| Khoa học đời thường | Điều chưa giải thích được có đáng tin không? | Decision guide | 0 | Seed | Xây ma trận rủi ro/bằng chứng |
| Tư duy phản biện | Khả năng bị bác bỏ qua ví dụ đời thường | Knowledge ngắn | 0 | Có giải thích nền | Xác minh Popper và giới hạn tiêu chí |
| Tư duy phản biện | Ba câu hỏi quan sát có làm ta tê liệt quyết định? | Insight | 0 | Seed | Thêm khung quyết định theo rủi ro |
| Học cùng AI | Làm sao kiểm tra ít mà vẫn tin cậy cao? | Guide/Knowledge | 0 | Có quy trình nền | Test quy trình 3–5 claim trên một bài thật |
| Phương pháp vấn–đáp | Vấn–đáp giúp ta học như thế nào? | Knowledge/interactive | 0 | Seed ưu tiên | Research retrieval, self-explanation, feedback |
| Suy nghĩ và trí thông minh | Nghĩ nhiều có làm thông minh hơn không? | Knowledge | 0 | Seed | Tách rumination, deliberate thinking và practice |
| Truyện vui | Một hiểu lầm nhỏ làm lộ hai cách nhìn | Truyện ngắn hài | 0 | Seed | Viết không kèm bài giảng cuối truyện |
| Truyện vui | Người luôn tìm “mặt còn lại” đến mức không gọi được món | Truyện hài/reflective | 0 | Seed | Giữ nhân văn, tránh chế giễu lo âu |
| Trẻ lớp 1–2 | Cục tẩy xanh và lỗi sai | Truyện ngắn | Chưa kết luận; có story `blue-eraser` cần kiểm tra nội dung | Seed có nguy cơ trùng | Đọc story hiện có trước khi viết |
| Trẻ lớp 1–3 | Hai bạn tranh chỗ dưới bóng cây | Truyện vui | 0 | Seed | Một xung đột, hành động cụ thể, câu ngắn |
| Trẻ lớp 3–5 | Đổi vai trong một ngày | Truyện vui/nhân văn | 0 | Seed | Test từ vựng và đọc hiểu |

## 3. Backlog cũ vẫn còn hiệu lực

| Cụm | Số content public đã xác nhận | Backlog đáng chú ý | Trạng thái |
|---|---:|---|---|
| Học/hiểu/suy luận | 2 Knowledge/Insight Release có liên quan AI | theo lời giải chưa chắc tự giải; biết hay đoán; kết quả che quá trình; công cụ và cơ hội học | Ý tưởng/research queue |
| Hai góc nhìn/giá trị hiện tại | 3 story/góc nhìn Release | tránh tạo bài mới trùng thông điệp | Có content; cần dedupe seed mới |
| So sánh xã hội/ghen tị | 0 Release được inventory xác nhận | 1 assessment + 2 draft cạnh tranh | Parked, chờ owner chọn direction |
| Kỳ vọng | 0 | câu hỏi “kỳ vọng nhiều…”; “kỳ vọng khác thỏa thuận” | Ý tưởng |
| Thiên lệch tiêu cực | 0 | vì sao chú ý điều tiêu cực hơn tích cực | Ý tưởng |
| Mê cung kiến thức | 0 public | prototype “đọc thấy hợp lý…” và topic Thái Cực | Thử nghiệm, không mở rộng hàng loạt |
| Quote corpus | 656 quote Release | 1.194 quote Authoring chờ Release; nhiều raw/normalization/source gates | Chương trình riêng, không trộn với seed Knowledge |
| Story corpus | 16 story Release | 46 Authoring-only | Review theo batch nhỏ |

## 4. Nguyên tắc chọn bài tiếp theo

1. Không lấy “mỗi ngày một content” làm lý do bỏ source/gate.
2. Trước khi viết, tìm nội dung gần nghĩa trong inventory, story source và Release để tránh trùng.
3. Ưu tiên seed tạo năng lực mới cho hệ thống: nhãn claim, evidence-against, bài cho trẻ, hoặc nội dung hài.
4. Mỗi lần chỉ mở một research package và một câu hỏi trung tâm.
5. Trạng thái `0` nghĩa là chưa thấy content hoàn chỉnh đúng seed trong snapshot này; không có nghĩa repo không có quote hoặc đoạn liên quan.
