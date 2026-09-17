# Báo cáo kiểm chứng Kiến trúc nội dung phiên bản 0.1

Trạng thái: Hoàn tất đánh giá lát cắt 88 câu  
Ngày: 2026-09-17

## Phạm vi

Lát cắt gồm 88 câu chưa xuất hiện trong mẫu hiệu chỉnh 36 câu. Mỗi câu được đánh giá theo một hoàn cảnh chính, một năng lực chính, một chuyển động suy ngẫm chính, độ sâu suy ngẫm và độ chắc chắn.

Bản ghi chi tiết nằm tại `phase-3a-validation-audit.tsv`. Đây là nhận định nghiên cứu, không phải dữ liệu gốc và không được dùng để tự động thay đổi nội dung.

## Kết quả tổng quát

| Chỉ số | Kết quả |
|---|---:|
| Số câu được đánh giá | 88 |
| Độ chắc chắn cao | 56 |
| Độ chắc chắn trung bình | 27 |
| Độ chắc chắn thấp | 5 |
| Không xác định được hoàn cảnh cụ thể | 5 |
| Không xác định được năng lực chính | 3 |

Phân bố độ sâu:

| Mức | Số câu |
|---|---:|
| 1 — nhắc nhớ | 12 |
| 2 — đổi khung nhìn | 29 |
| 3 — gợi mở | 37 |
| 4 — giữ được giằng co | 10 |

Các con số này chỉ mô tả lát cắt kiểm chứng, không đại diện cho toàn bộ 389 câu.

## Điều kiến trúc phiên bản 0.1 làm tốt

### Phân biệt chủ đề với năng lực

Các câu trong nhóm công việc không đồng loạt hỗ trợ quyền tự chủ. Một số hỗ trợ sức bền, một số làm rõ giá trị, một số chỉ là lời động viên. Việc tách chủ đề khỏi năng lực tiếp tục được xác nhận là cần thiết.

### Phân biệt sức bền với khả năng sống cùng bất định

Các câu về hồi phục, tiếp tục và chịu khó khác rõ với những câu giữ người đọc ở nơi chưa biết kết quả. Hai năng lực này nên tiếp tục tách biệt.

### Phân biệt quyền tự chủ với hành động

Nhiều câu khuyến khích hành động nhưng đã xác định sẵn điều người đọc nên muốn. Chỉ bảy câu trong lát cắt được xếp vào quyền tự chủ, trong khi chuyển động `hành_động` xuất hiện ở bảy câu thuộc nhiều năng lực khác nhau.

### Dùng `chưa_xác_định` thay vì đoán

Năm câu không có hoàn cảnh đủ rõ và ba câu không có năng lực chính đủ chắc chắn. Việc cho phép chưa xác định giúp tránh ép nội dung vào luận điểm chiến lược.

## Điểm cần sửa

### Không phải câu nào cũng gắn với một hoàn cảnh cụ thể

Một số câu là nguyên tắc hoặc hình ảnh suy tưởng vượt khỏi tình thế cụ thể, chẳng hạn câu về hành động chứng minh lời nói hoặc mùi cà phê dẫn tay về chiếc cốc quen. Gắn chúng vào một hoàn cảnh người dùng cụ thể sẽ là suy diễn.

Phiên bản 0.2 cần giá trị `không_gắn_hoàn_cảnh_cụ_thể`, khác với `chưa_xác_định`:

- `không_gắn_hoàn_cảnh_cụ_thể`: đã đọc và chủ động kết luận câu mang tính phổ quát;
- `chưa_xác_định`: chưa đủ bằng chứng hoặc còn bất đồng khi phân loại.

### Thiếu năng lực tự cảm thông

Các câu về vết thương, sai sót và sự hồi phục nhẹ nhàng đôi khi không chỉ giúp hiểu mình hay tăng sức bền. Chúng mời người đọc đối xử với bản thân bớt khắc nghiệt. Ép tất cả vào `hiểu_mình` làm mất ý nghĩa này.

### Thiếu năng lực điều hòa cảm xúc

`nhận_biết_cảm_xúc` mô tả khả năng thấy cảm xúc. Một số câu đi xa hơn: tạo khoảng giữa cảm xúc và hành động, hoặc không để cảm xúc trở thành mệnh lệnh. Đây là năng lực điều hòa, không chỉ nhận biết.

### Hoàn cảnh công việc đang quá rộng

`áp_lực_công_việc` đang chứa cả quá tải, ranh giới công việc, tay nghề, ước mơ nghề nghiệp và quan hệ giữa công việc với ý nghĩa sống. Phiên bản 0.2 cần tách `định_hướng_công_việc` khỏi áp lực hoặc kiệt sức do công việc.

### Hai chuyển động đang bao phủ quá rộng

`nhận_ra` xuất hiện 19 lần và `đổi_khung_nhìn` xuất hiện 17 lần. Đây chưa phải lý do để chia thêm nhãn ngay, nhưng cho thấy người đánh giá phải ghi rõ đối tượng được nhận ra hoặc khung nhìn nào được thay đổi trong ghi chú. Nếu toàn bộ thư viện tiếp tục dồn vào hai nhãn này, phiên bản sau mới nên tách.

### Trục chủ đề chưa được kiểm chứng đầy đủ

Vòng này ưu tiên kiểm tra hoàn cảnh, năng lực và chuyển động. Chủ đề vẫn là danh sách mở và chưa có đủ bằng chứng để chuẩn hóa. Không nên khóa danh sách chủ đề ở phiên bản 0.2.

## Những câu cần xem xét thủ công

Năm câu có độ chắc chắn thấp:

- `attributed.paulo_coelho.the_alchemist.058`;
- `attributed.paulo_coelho.the_alchemist.082`;
- `coffee_guides_the_hand_to_one_cup`;
- `young_tree_tied_with_soft_cloth`;
- `attributed.paulo_coelho.the_alchemist.014`.

Độ chắc chắn thấp không có nghĩa nội dung yếu. Nó chỉ cho biết câu có nhiều cách đọc, thiếu ngữ cảnh hoặc không khớp rõ với kiến trúc hiện tại.

## Kết luận

Kiến trúc phiên bản 0.1 đủ ổn định để tiếp tục, nhưng cần ba thay đổi nhỏ trước khi đánh giá toàn thư viện:

1. thêm hoàn cảnh `không_gắn_hoàn_cảnh_cụ_thể` và `định_hướng_công_việc`;
2. thêm năng lực `tự_cảm_thông` và `điều_hòa_cảm_xúc`;
3. yêu cầu ghi rõ đối tượng khi dùng chuyển động `nhận_ra` hoặc `đổi_khung_nhìn`.

Không có bằng chứng cần nhập các trục lại với nhau hoặc mở rộng taxonomy thành một danh sách lớn hơn.
