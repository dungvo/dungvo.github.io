# Giai đoạn 9A — Tuyển chọn ứng viên cho pilot suy ngẫm

Ngày lập: 2026-09-17  
Trạng thái: Chủ sở hữu đã duyệt phạm vi pilot đầu ngày 2026-09-17  
Phạm vi: Ứng viên nghiên cứu; chưa phải danh sách phát hành

## 1. Mục tiêu

Chọn một tập nhỏ các Góc nhìn có thể đứng bên cạnh lời người dùng mà không diễn giải, chấm điểm hoặc quyết định thay họ. Tập này phục vụ rà soát biên tập cho một pilot tương lai; tài liệu không thay đổi Authoring, Release hoặc lược đồ runtime.

## 2. Điều kiện sàng lọc

Một câu chỉ được đưa vào danh sách dưới đây khi:

- có độ chắc chắn từ trung bình trở lên trong kiểm toán 389 câu;
- phục vụ ít nhất một khoảng trống ưu tiên;
- có thể đọc độc lập;
- không thuộc ba câu đang tạm giữ khỏi Release;
- không thuộc cụm trùng chưa giải quyết;
- có nguồn gốc và attribution xác định được;
- không hứa kết quả, chẩn đoán hoặc biến cảm xúc thành lỗi cần sửa ngay.

Độ chắc chắn nghiên cứu không đồng nghĩa với đủ điều kiện phát hành. Mọi ứng viên bên dưới vẫn phải qua gate quyền sử dụng, review canonical và owner approval.

## 3. Danh sách rút gọn

| Mã câu canonical | Vùng phục vụ | Chuyển động chính | Vì sao đáng thử | Rủi ro cần rà | Trạng thái nguồn |
|---|---|---|---|---|---|
| `name_the_weather_inside` | gọi tên trải nghiệm, nhận biết cảm xúc | gọi tên | Khuyến khích nhận diện trước khi điều chỉnh; giữ quyền hành động cho người đọc | Ẩn dụ “mang ô” có thể khiến câu nghe như một chỉ dẫn xử lý | `selflo_owned`; `needs_owner_review` |
| `light_gives_the_room_a_shape` | gọi tên trải nghiệm | gọi tên | Không áp đặt tên cảm xúc; chỉ mô tả việc điều vốn có trở nên nhìn thấy | Có thể quá trừu tượng nếu đứng sau một lời viết rất cụ thể | `selflo_owned`; `needs_owner_review` |
| `towel_reveals_what_it_carried` | cạn năng lượng, nhận biết cảm xúc | nhận ra | Thừa nhận tải tích lũy mà không quy trách nhiệm cá nhân | Hình ảnh “vắt ra” có thể gợi quá mức về bùng vỡ | `selflo_owned`; `needs_owner_review` |
| `damp_paper_is_not_the_pens_fault` | cạn năng lượng, tự cảm thông | đổi khung nhìn | Tách giới hạn hoàn cảnh khỏi phán xét năng lực | Có nguy cơ giải thích thay người dùng nếu họ không xem mình là “bút” | `selflo_owned`; `needs_owner_review` |
| `tide_does_not_apologize` | cạn năng lượng, tự cảm thông | chấp nhận giới hạn | Bình thường hóa nhịp năng lượng thay đổi, không thúc ép phục hồi nhanh | Vế “không phải lỗi” vẫn đưa ra kết luận khá trực tiếp | `selflo_owned`; `needs_owner_review` |
| `enough_for_today` | cạn năng lượng, biết đủ | chấp nhận giới hạn | Giữ khả năng dừng lại như một lựa chọn hợp lệ | Có thể lãng mạn hóa việc dừng khi người dùng bị ràng buộc bởi hoàn cảnh | `selflo_owned`; `needs_owner_review` |
| `roof_releases_the_storm_slowly` | hồi phục, tự cảm thông | nhận ra | Cho phép phản ứng tiếp tục sau khi biến cố đã qua | Có thể bị đọc như giải thích tâm lý chắc chắn nếu đưa sai ngữ cảnh | `selflo_owned`; `needs_owner_review` |
| `rain_stopped_before_ground_dried` | hồi phục, bất định | nhận ra | Phân biệt biến cố đã dừng với quá trình hồi phục chưa hoàn tất | Lặp cấu trúc có thể trở nên khẳng định quá mạnh | `selflo_owned`; `needs_owner_review` |
| `empty_desk_with_glowing_screen` | áp lực công việc | nhận ra | Mô tả việc công việc còn ở lại trong tâm trí mà không đổ lỗi | Có thể không phù hợp với lao động không dùng bàn/màn hình | `selflo_owned`; `needs_owner_review` |
| `not_every_stone_is_yours_to_carry_home` | áp lực công việc, ranh giới | phân biệt kiểm soát | Mở câu hỏi về phần trách nhiệm thực sự thuộc về mình | Dễ trở thành lời khuyên “mặc kệ” nếu thiếu bối cảnh trách nhiệm | `selflo_owned`; `needs_owner_review`; chỉ Authoring Preview |
| `carpenter_measures_the_uneven_leg` | áp lực công việc, lựa chọn | lựa chọn | Đưa sự chú ý về phần còn cần xem xét thay vì ép làm nhiều hơn | Có thể củng cố tư duy sửa lỗi/năng suất khi người dùng đang kiệt sức | `selflo_owned`; `needs_owner_review` |
| `some_footprints_lead_toward_home` | lựa chọn, làm rõ giá trị | lựa chọn | Mời người đọc phân biệt bận rộn với điều quan trọng mà không chọn thay họ | “Nơi lòng muốn đến” có thể sáo nếu chưa có ngữ cảnh cụ thể | `selflo_owned`; `needs_owner_review` |
| `small_boundary_is_still_boundary` | lựa chọn, quan hệ | lựa chọn | Công nhận ranh giới nhỏ và không yêu cầu đối đầu mạnh | Có thể nguy hiểm nếu áp dụng máy móc trong quan hệ có mất an toàn | `selflo_owned`; `needs_owner_review` |

## 4. Mức bao phủ

- tự cảm thông: 3 ứng viên;
- cạn năng lượng: 4 ứng viên;
- hồi phục: 2 ứng viên;
- áp lực công việc: 3 ứng viên;
- gọi tên trải nghiệm: 3 ứng viên;
- lựa chọn: 3 ứng viên.

Một câu có thể phục vụ nhiều vùng. Mức bao phủ này chỉ giúp review, không phải quota phát hành.

## 5. Những gì cố ý chưa chọn

- ba câu đang tạm giữ khỏi Release;
- câu có quyền sử dụng chưa xác minh;
- mảnh trích phụ thuộc ngữ cảnh từ *Nhà giả kim*;
- câu thuộc cụm trùng hoặc gần trùng chưa có quyết định;
- câu chủ yếu thúc đẩy hành động;
- truyện thứ 8–10 hoặc nội dung mới chưa tồn tại.

## 6. Gate quyết định

Mỗi ứng viên cần một quyết định độc lập:

- `giữ_để_thử`;
- `sửa_trước_khi_thử`;
- `chỉ_dùng_khi_người_dùng_chủ_động_chọn`;
- `loại_khỏi_pilot`.

Không thay đổi `review.status` trong canonical source từ tài liệu này.

## 7. Quyết định của chủ sở hữu

### Giữ để thử trong pilot đầu

1. `light_gives_the_room_a_shape`
2. `name_the_weather_inside`
3. `towel_reveals_what_it_carried`
4. `tide_does_not_apologize`
5. `rain_stopped_before_ground_dried`
6. `roof_releases_the_storm_slowly`
7. `empty_desk_with_glowing_screen`
8. `some_footprints_lead_toward_home`

### Tạm giữ ngoài pilot đầu

- `damp_paper_is_not_the_pens_fault`: dễ giải thích thay nguyên nhân.
- `enough_for_today`: dễ trở thành lời khuyên dừng lại.
- `not_every_stone_is_yours_to_carry_home`: dễ xác nhận quá sớm rằng trách nhiệm không thuộc người dùng.
- `carpenter_measures_the_uneven_leg`: mang sắc thái tối ưu và sửa lỗi.
- `small_boundary_is_still_boundary`: chỉ phù hợp nếu người dùng chủ động chọn rõ chủ đề quan hệ và ranh giới.

Quyết định này chỉ chốt tập nội dung nghiên cứu. Tám câu được giữ vẫn giữ nguyên `review.status` trong nguồn chuẩn và chưa được đưa vào Release.
