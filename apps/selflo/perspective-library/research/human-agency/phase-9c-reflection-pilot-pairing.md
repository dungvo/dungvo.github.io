# Giai đoạn 9C — Ma trận ghép lời mời và Góc nhìn

Ngày lập: 2026-09-17  
Trạng thái: Đề xuất biên tập, chờ chủ sở hữu rà soát  
Phạm vi: Mapping nghiên cứu; không phải recommendation engine

## 1. Quy tắc ghép

- Chỉ dựa trên lời mời hoặc lựa chọn rõ ràng của người dùng; không đọc hay phân loại nguyên văn người dùng.
- Một lời mời có thể không dẫn tới Góc nhìn nào.
- Góc nhìn không được đóng vai trò chấm bài, kết luận hoặc sửa lời người dùng.
- Không ghép bằng từ khóa đơn thuần.
- Nếu cặp chỉ an toàn trong một bối cảnh hẹp, ưu tiên loại khỏi pilot thay vì thêm suy luận người dùng.
- Mỗi cặp cần được duyệt độc lập với việc prompt và quote đã được duyệt riêng.

## 2. Ma trận đề xuất

| Lời mời dự thảo | Ứng viên Góc nhìn | Lý do ghép | Rủi ro của cặp | Đề xuất ban đầu |
|---|---|---|---|---|
| `draft.naming.what_is_present` | `light_gives_the_room_a_shape` | Cả hai giữ trọng tâm ở việc thấy rõ, không yêu cầu hành động | Quote có thể bị đọc như xác nhận Selflo đã biết “thứ ở trong phòng” là gì | rà thêm |
| `draft.naming.what_is_present` | `name_the_weather_inside` | Hỗ trợ gọi tên mà vẫn để người dùng tự chọn tên | Quote lặp lại chức năng prompt và có thể trở nên thừa | rà thêm |
| `draft.naming.what_is_hard_to_name` | không đưa Góc nhìn | Khoảng chưa rõ có thể cần được để yên | Việc thêm quote dễ lấp mất khoảng mơ hồ vừa được tạo | ưu tiên giữ im lặng |
| `draft.naming.what_is_hard_to_name` | `light_gives_the_room_a_shape` | Có thể bình thường hóa việc thấy dần thay vì hiểu ngay | Ẩn dụ ánh sáng có thể ngầm hứa rằng mọi thứ sẽ sớm rõ | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.energy.what_is_taking_energy` | `towel_reveals_what_it_carried` | Thừa nhận tích lũy mà không yêu cầu khắc phục ngay | Có thể cường điệu tải của người dùng | rà thêm |
| `draft.energy.what_is_taking_energy` | `damp_paper_is_not_the_pens_fault` | Mở khả năng nhìn giới hạn trong điều kiện hiện tại | Có thể giải thích thay rằng vấn đề nằm ở hoàn cảnh | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.energy.what_is_taking_energy` | `tide_does_not_apologize` | Bình thường hóa nhịp năng lượng thay đổi | Có thể phủ qua nguyên nhân hệ thống hoặc y khoa cần chú ý | rà thêm |
| `draft.energy.what_can_remain_unfinished` | `enough_for_today` | Cùng giữ khả năng dừng như một lựa chọn | Cặp này dễ biến thành lời khuyên dừng lại | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.energy.what_can_remain_unfinished` | không đưa Góc nhìn | Bản thân câu trả lời đã là một lựa chọn của người dùng | Quote bổ sung có thể làm suy yếu quyền tự quyết vừa được thực hành | ưu tiên giữ im lặng |
| `draft.work.fact_and_interpretation` | `empty_desk_with_glowing_screen` | Đưa một hình ảnh quan sát, không kết luận nguyên nhân | Chỉ đại diện một kiểu lao động và có thể thu hẹp trải nghiệm | rà thêm |
| `draft.work.fact_and_interpretation` | `not_every_stone_is_yours_to_carry_home` | Gợi phân biệt trách nhiệm thuộc về mình và người khác | Có thể khuyên buông trách nhiệm trước khi hiểu đủ sự việc | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.values.what_matters_here` | `some_footprints_lead_toward_home` | Giữ câu hỏi về hướng đi và điều quan trọng | Có thể biến câu trả lời thành đánh giá “đúng đường/sai đường” | rà thêm |
| `draft.values.what_matters_here` | `carpenter_measures_the_uneven_leg` | Hướng chú ý đến phần thực sự cần xem xét | Dễ kéo từ giá trị sang tối ưu công việc | loại khỏi cặp này |
| `draft.choice.what_is_yours_to_choose` | `not_every_stone_is_yours_to_carry_home` | Phù hợp với phân biệt phần trách nhiệm | Quá dễ xác nhận một kết luận chưa được kiểm chứng | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.choice.what_is_yours_to_choose` | `small_boundary_is_still_boundary` | Giữ khả năng chọn một ranh giới nhỏ | Không an toàn nếu hệ thống tự suy ra vấn đề quan hệ | chỉ khi người dùng tự chọn chủ đề quan hệ |
| `draft.choice.what_is_yours_to_choose` | `carpenter_measures_the_uneven_leg` | Gợi chọn nơi đặt sự chú ý | Có thể biến lựa chọn thành nhiệm vụ sửa lỗi | rà thêm |
| `draft.self_compassion.what_would_be_fair` | `damp_paper_is_not_the_pens_fault` | Giảm đồng nhất giới hạn hiện tại với lỗi cá nhân | Có thể áp sẵn mô hình “hoàn cảnh là giấy, mình là bút” | rà thêm |
| `draft.self_compassion.what_would_be_fair` | `roof_releases_the_storm_slowly` | Cho phép phản ứng kéo dài mà không tự trách | Có thể diễn giải người dùng đang hồi phục sau “cơn bão” | chỉ khi người dùng chủ động chọn xem thêm |
| `draft.self_compassion.what_would_be_fair` | `rain_stopped_before_ground_dried` | Tách kết thúc biến cố khỏi nhịp hồi phục | Có thể gán nhãn hồi phục khi người dùng không dùng cách hiểu đó | chỉ khi người dùng chủ động chọn xem thêm |

## 3. Các câu chưa có cặp đủ an toàn

Không phải mọi ứng viên ở Giai đoạn 9A đều cần được ghép. Một câu có thể phù hợp với thư viện nói chung nhưng không phù hợp ngay sau khi người dùng vừa viết điều riêng tư.

`small_boundary_is_still_boundary` chỉ nên tiếp tục nếu người dùng tự chọn rõ chủ đề quan hệ. Không dùng nội dung ghi tự do để hệ thống suy ra chủ đề này.

## 4. Gate quyết định

Mỗi cặp được đánh dấu một trong các trạng thái:

- `giữ`;
- `sửa_lời_mời`;
- `đổi_Góc_nhìn`;
- `chỉ_khi_người_dùng_chủ_động_chọn`;
- `giữ_im_lặng`;
- `loại`.

Mapping được duyệt vẫn chỉ là quyết định biên tập. Nó không cho phép suy luận từ user text.
