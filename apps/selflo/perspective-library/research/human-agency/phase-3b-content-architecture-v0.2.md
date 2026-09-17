# Kiến trúc nội dung Selflo phiên bản 0.2

Trạng thái: Sẵn sàng cho đánh giá toàn bộ thư viện  
Ngày: 2026-09-17  
Nền tảng: Phiên bản 0.1, mẫu hiệu chỉnh 36 câu và lát cắt kiểm chứng 88 câu

## Phạm vi thay đổi

Phiên bản 0.2 giữ nguyên cấu trúc năm trục của phiên bản 0.1. Các định nghĩa không được nêu lại ở đây tiếp tục có hiệu lực theo `phase-2-content-architecture-v0.1.md`.

## Thay đổi ở trục hoàn cảnh con người

Thêm hai giá trị:

| Nhãn | Định nghĩa | Dùng khi | Không dùng khi |
|---|---|---|---|
| `không_gắn_hoàn_cảnh_cụ_thể` | nội dung là nguyên tắc hoặc hình ảnh suy tưởng không phụ thuộc rõ vào một tình thế | đã đọc đầy đủ và chủ động kết luận không có hoàn cảnh chính | còn thiếu ngữ cảnh hoặc người đánh giá chưa chắc chắn; khi đó dùng `chưa_xác_định` |
| `định_hướng_công_việc` | cân nhắc nghề nghiệp, tay nghề, ước mơ, mục đích hoặc hướng phát triển trong công việc | trọng tâm là mình muốn xây điều gì hoặc trở thành người thế nào qua công việc | trọng tâm là quá tải, ranh giới hoặc không thể nghỉ khỏi công việc; khi đó dùng `áp_lực_công_việc` |

## Thay đổi ở trục năng lực được hỗ trợ

Thêm hai giá trị:

| Nhãn | Định nghĩa | Dấu hiệu đưa vào | Ví dụ phản chứng |
|---|---|---|---|
| `tự_cảm_thông` | nhìn sai sót, giới hạn hoặc tổn thương của bản thân mà không biến chúng thành phán quyết về giá trị con người | nội dung làm mềm sự tự kết án hoặc cho phép hồi phục theo nhịp phù hợp | phủ nhận trách nhiệm hoặc dùng cảm thông để tránh đối diện hậu quả |
| `điều_hòa_cảm_xúc` | tạo khoảng giữa cảm xúc với phản ứng và lựa chọn cách đáp lại | cảm xúc được thừa nhận nhưng không tự động quyết định hành động | yêu cầu loại bỏ, đàn áp hoặc phủ nhận cảm xúc ngay lập tức |

## Làm rõ chuyển động suy ngẫm

Khi dùng `nhận_ra`, bản đánh giá phải ghi điều gì được nhận ra, chẳng hạn giới hạn năng lượng, dư âm cảm xúc hoặc đời sống gần bên.

Khi dùng `đổi_khung_nhìn`, bản đánh giá phải ghi rõ:

- cách nhìn ban đầu;
- cách nhìn được gợi mở;
- nội dung có giữ lại quyền diễn giải cho người đọc hay chỉ thay một kết luận cứng bằng kết luận khác.

Chưa chia hai nhãn này thành các nhãn nhỏ hơn. Quyết định chỉ được xem lại sau khi có số liệu từ toàn bộ thư viện.

## Danh sách trục sau điều chỉnh

### Hoàn cảnh con người

- `quá_tải`;
- `xao_lãng`;
- `do_dự`;
- `bất_định`;
- `thất_bại`;
- `mất_mát`;
- `thay_đổi`;
- `khủng_hoảng_bản_sắc`;
- `mâu_thuẫn_quan_hệ`;
- `cô_đơn`;
- `so_sánh`;
- `cạn_năng_lượng`;
- `áp_lực_công_việc`;
- `định_hướng_công_việc`;
- `tìm_ý_nghĩa`;
- `tổn_thương_cảm_xúc`;
- `hồi_phục`;
- `không_gắn_hoàn_cảnh_cụ_thể`;
- `chưa_xác_định`.

### Năng lực được hỗ trợ

- `sự_hiện_diện`;
- `hiểu_mình`;
- `nhận_biết_cảm_xúc`;
- `điều_hòa_cảm_xúc`;
- `tự_cảm_thông`;
- `mở_rộng_góc_nhìn`;
- `phán_đoán_độc_lập`;
- `chịu_đựng_bất_định`;
- `làm_rõ_giá_trị`;
- `quyền_tự_chủ`;
- `sức_bền`;
- `biết_đủ`;
- `kết_nối`;
- `trách_nhiệm`;
- `chưa_xác_định`.

### Chuyển động suy ngẫm

Giữ nguyên 13 giá trị của phiên bản 0.1 và giá trị `chưa_xác_định`.

### Chủ đề và dòng tri thức

Không thay đổi. Chủ đề tiếp tục là danh sách mở. Dòng tri thức tiếp tục được xác định từ hồ sơ nguồn gốc, không từ giọng văn.

## Quy tắc chuyển tiếp

- Không cập nhật nội dung gốc hoặc lược đồ sản phẩm từ phiên bản 0.2.
- Đánh giá toàn bộ thư viện tiếp tục nằm ở tầng nghiên cứu riêng.
- Các câu trong hai mẫu trước phải được quy đổi sang phiên bản 0.2 khi tạo ma trận bao phủ cuối cùng.
- Mọi câu có độ chắc chắn thấp hoặc `chưa_xác_định` phải được đưa vào hàng đợi chủ sở hữu xem xét.
- Sau đánh giá toàn thư viện, chỉ những trục chứng minh được giá trị tìm nội dung mới được đề xuất đưa vào dữ liệu dùng khi sản phẩm vận hành.

## Tiêu chí chất lượng bổ sung: giữ lại sự tham gia của người đọc

Theo triết lý sản phẩm Selflo, mỗi nội dung trong bước rà soát chất lượng phải được hỏi thêm:

> Nội dung này tạo không gian để người đọc tự tham gia diễn giải và lựa chọn, hay đưa sẵn một kết luận rồi yêu cầu họ tiếp nhận?

Tiêu chí này thuộc tầng nghiên cứu, không phải nhãn dùng khi sản phẩm vận hành. Việc đánh giá cần phân biệt:

- `mở`: gợi một cách nhìn nhưng giữ lại phần diễn giải hoặc lựa chọn quan trọng;
- `có_định_hướng`: đưa ra một lập trường rõ nhưng vẫn cho phép người đọc cân nhắc bối cảnh;
- `đóng`: xác định sẵn điều người đọc phải tin, muốn hoặc làm;
- `chưa_xác_định`: không đủ ngữ cảnh để đánh giá.

Nội dung `đóng` không tự động bị loại. Một chỉ dẫn ngắn vẫn có thể hữu ích trong hoàn cảnh phù hợp. Tuy nhiên, nó không được tính là bằng chứng mạnh cho quyền tự chủ hoặc phán đoán độc lập, và không nên chiếm ưu thế trong một hành trình có mục tiêu giúp người dùng tự suy nghĩ.
