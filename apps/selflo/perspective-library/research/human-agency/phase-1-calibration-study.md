# Nghiên cứu hiệu chỉnh nội dung Selflo

Trạng thái: Đã được chủ sở hữu chấp nhận làm nền cho phiên bản 0.1  
Cỡ mẫu: 36 câu trích dẫn gốc  
Ngày: 2026-09-17

## Mục đích

Nghiên cứu này kiểm tra sức chịu đựng của một kiến trúc nội dung tạm thời. Nó không xếp hạng tác giả, duyệt nội dung, thay đổi dữ liệu mô tả gốc hoặc quyết định hành vi khi sản phẩm vận hành.

Mã câu trích dẫn gốc vẫn là tham chiếu nội dung duy nhất. Câu chữ không được sao chép vào tài liệu này để bản đánh giá không trở thành một nguồn văn bản thứ hai có thể bị chỉnh sửa độc lập.

## Quy tắc chọn mẫu

Mẫu gồm bốn bản ghi từ mỗi chủ đề trong chín chủ đề gốc:

1. một câu đang phát hành, ưu tiên câu có liên kết với truyện;
2. một câu minh triết chuyển thể ở thư viện biên soạn, ưu tiên bản ghi có liên kết với truyện;
3. một câu gốc Selflo có liên kết với truyện, ưu tiên câu gốc Selflo đang phát hành còn lại nếu có;
4. một bản ghi giả ngẫu nhiên nhưng có thể tái tạo từ phần còn lại của chủ đề.

Hạt giống chọn mẫu là `selflo-agency-calibration-v1`; thứ tự được xác định bằng SHA-256 của `hạt_giống:mã_câu`.

Thành phần mẫu:

- 9 chủ đề × 4 bản ghi = 36;
- 15 câu gốc Selflo;
- 21 câu minh triết chuyển thể;
- 11 câu đang phát hành;
- 22 câu có liên kết với truyện;
- có đủ hai câu gốc Selflo hiện đang phát hành;
- có nguồn cổ điển, văn học, nguồn do chủ sở hữu cung cấp và nguồn từ Xưởng truyện Selflo.

## Thang đánh giá tạm thời

Độ sâu suy ngẫm:

- `0 trang trí`: câu dễ đồng ý nhưng gần như không đòi hỏi suy ngẫm;
- `1 nhắc nhớ`: nhắc lại một nguyên tắc quen thuộc;
- `2 đổi khung nhìn`: thay đổi cách đặt vấn đề;
- `3 gợi mở`: mở ra một câu hỏi mà chính câu trích dẫn không trả lời thay;
- `4 giữ được giằng co`: giữ lại một sự mơ hồ hoặc điều phải đánh đổi có ý nghĩa mà không vội đóng kết luận.

Mức độ tôn trọng quyền tự chủ:

- `chỉ dẫn`: nói người đọc nên nghĩ hoặc làm gì;
- `gợi ý`: đưa ra một kết luận hoặc góc nhìn;
- `suy ngẫm`: tạo khoảng trống để người đọc tự diễn giải;
- `hỗ trợ tự chủ`: làm rõ giá trị, lựa chọn hoặc điều phải đánh đổi nhưng vẫn để người đọc làm chủ quyết định.

## Các bản ghi hiệu chỉnh

| # | Mã câu | Hoàn cảnh | Chủ đề | Năng lực được hỗ trợ | Chuyển động suy ngẫm | Dòng tri thức | Độ sâu | Mức độ tôn trọng quyền tự chủ | Độ mở | Nguy cơ sáo mòn | Độ chắc chắn |
|---:|---|---|---|---|---|---|---:|---|---|---|---|
| 1 | `attributed.laozi.chapter_58.fortune_misfortune` | kết quả chưa chắc chắn | họa và phúc | chịu đựng bất định | giữ đồng thời hai mặt | Đạo gia | 4 | suy ngẫm | cao | thấp | cao |
| 2 | `quote.roof_of_many_hands` | nghịch cảnh tập thể | hỗ trợ lẫn nhau | kết nối, sức bền | nhìn gánh nặng như điều được cùng chia sẻ | bản thảo Xưởng truyện | 2 | gợi ý | trung bình | trung bình | trung bình |
| 3 | `roof_releases_the_storm_slowly` | hồi phục sau căng thẳng | sự hồi phục có độ trễ | nhận biết cảm xúc, tự cảm thông | nhận ra ảnh hưởng còn sót lại | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | cao |
| 4 | `every_long_road_is_crossed_one_meter_at_a_time` | nhiệm vụ gây choáng ngợp | tiến bộ từng bước | quyền tự chủ, sức bền | đi bước tiếp theo | câu gốc Selflo | 1 | chỉ dẫn | thấp | cao | cao |
| 5 | `attributed.ma.iii_10.present_moment` | xao lãng khỏi hiện tại | khoảnh khắc hiện tại | sự hiện diện | trở về hiện tại | Khắc kỷ | 2 | chỉ dẫn | trung bình | trung bình | cao |
| 6 | `attributed.ma.iv_18.own_actions` | so sánh và xao lãng | chú ý đến hành động của mình | phán đoán, trách nhiệm | trở lại với hành động của mình | Khắc kỷ | 2 | chỉ dẫn | thấp | trung bình | cao |
| 7 | `tea_waits_beside_the_screen` | sự chú ý bị phân mảnh | đời sống gần bên chưa được nhận ra | sự hiện diện | chậm lại và nhận ra | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | cao |
| 8 | `attributed.paulo_coelho.the_alchemist.032` | khả năng bị bỏ sót | niềm tin và cách nhìn | mở rộng góc nhìn | đặt lại câu hỏi về giả định | nguồn văn học | 2 | gợi ý | trung bình | trung bình | trung bình |
| 9 | `attributed.zhuangzi.chapter_20.change_with_time` | hoàn cảnh thay đổi | không cố chấp vào phương pháp | phán đoán, thích nghi | buông cách làm cố định | Đạo gia | 3 | hỗ trợ tự chủ | cao | thấp | cao |
| 10 | `quote.boatman_and_second_mountain` | lựa chọn bị bó hẹp | những con đường khác | quyền tự chủ, làm rõ giá trị | mở lại khả năng lựa chọn | bản thảo Selflo | 3 | hỗ trợ tự chủ | cao | thấp | trung bình |
| 11 | `seed_grows_out_of_sight` | tiến bộ chưa được nhìn thấy | trưởng thành không cần được công nhận | sức bền, kiên nhẫn | đổi cách nhìn về tiến bộ âm thầm | câu gốc Selflo | 2 | gợi ý | trung bình | trung bình | cao |
| 12 | `attributed.paulo_coelho.the_alchemist.044` | sống theo quán tính | thay đổi không được nhận ra | sự hiện diện, hiểu mình | đặt lại câu hỏi về lối sống tự động | nguồn văn học | 3 | suy ngẫm | cao | thấp | trung bình |
| 13 | `attributed.epictetus.ench_05.opinion` | xáo trộn cảm xúc | sự việc và cách phán xét | nhận biết cảm xúc, mở rộng góc nhìn | tách sự việc khỏi cách diễn giải | Khắc kỷ | 3 | suy ngẫm | cao | thấp | cao |
| 14 | `attributed.paulo_coelho.the_alchemist.020` | ý nghĩ không mong muốn | gột rửa ý nghĩ | điều hòa cảm xúc | gạt bỏ ý nghĩ không mong muốn | nguồn văn học | 1 | chỉ dẫn | thấp | cao | trung bình |
| 15 | `river_carries_the_upstream_rain` | cảm xúc còn kéo dài | ảnh hưởng cảm xúc có độ trễ | nhận biết cảm xúc, tự cảm thông | chấp nhận độ trễ của cảm xúc | câu gốc Selflo | 4 | suy ngẫm | cao | thấp | cao |
| 16 | `sunlight_finds_the_scratch` | tổn thương tiềm ẩn | hoàn cảnh làm lộ vết thương | hiểu mình | nhận ra điều hoàn cảnh làm lộ ra | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | trung bình |
| 17 | `compass_keeps_direction_not_steps` | hành trình bất định | giá trị và con đường bị quy định sẵn | làm rõ giá trị, quyền tự chủ | làm rõ phương hướng mà không quy định từng bước | câu gốc Selflo | 4 | hỗ trợ tự chủ | cao | thấp | cao |
| 18 | `attributed.paulo_coelho.the_alchemist.037` | theo đuổi mục đích | số mệnh và phần thưởng | động lực | khẳng định sự theo đuổi | nguồn văn học | 1 | chỉ dẫn | thấp | cao | trung bình |
| 19 | `the_pauses_were_the_life` | đời sống lấy năng suất làm trung tâm | đời thường và ý nghĩa | ý nghĩa, sự hiện diện | nhìn lại giá trị của khoảng tưởng như nghỉ | câu gốc Selflo | 4 | suy ngẫm | cao | thấp | cao |
| 20 | `chipped_cup_stays_for_its_story` | sự không hoàn hảo và gắn bó | giá trị của câu chuyện | ý nghĩa, tự cảm thông | đổi cách nhìn về sự không hoàn hảo | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | cao |
| 21 | `attributed.ma.vi_06.best_revenge` | tổn thương giữa người với người | giữ phẩm chất sau tổn thương | phán đoán, trách nhiệm | giữ giá trị khi bị kích động | Khắc kỷ | 3 | hỗ trợ tự chủ | trung bình | trung bình | cao |
| 22 | `attributed.dhammapada.verse_049.bee` | sống giữa cộng đồng | tham gia mà không gây tổn hại | kết nối, trách nhiệm | hiện diện nhẹ nhàng trong cộng đồng | Phật giáo | 2 | gợi ý | trung bình | thấp | cao |
| 23 | `one_umbrella_keeps_two_steps_together` | khó khăn cùng chia sẻ | sự đồng hành | kết nối | đồng hành thay vì sửa chữa | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | cao |
| 24 | `attributed.ma.vi_48.others_excellence` | cái nhìn tiêu cực trong quan hệ | sự trân trọng | mở rộng góc nhìn, kết nối | nhận ra phẩm chất tốt của người khác | Khắc kỷ | 1 | chỉ dẫn | thấp | trung bình | cao |
| 25 | `attributed.ma.iv_03.inner_retreat` | quá nhiều kích thích | sự nghỉ ngơi bên trong | sự hiện diện, điều hòa cảm xúc | trở về bên trong | Khắc kỷ | 2 | chỉ dẫn | trung bình | trung bình | cao |
| 26 | `quote.laundry_and_two_bells` | công việc tràn vào thời gian nghỉ | sự hồi phục chưa trọn vẹn | nghỉ ngơi, nhận biết ranh giới | nhận ra sự thiếu khép lại | bản thảo Xưởng truyện | 3 | suy ngẫm | cao | thấp | trung bình |
| 27 | `energy_has_a_budget` | quá tải | năng lượng hữu hạn | hiểu mình, biết đủ | gọi tên giới hạn | câu gốc Selflo | 3 | suy ngẫm | trung bình | thấp | cao |
| 28 | `dark_room_before_the_body_is_ready` | khó chuyển sang trạng thái nghỉ | nhịp của cơ thể | hiểu mình, nghỉ ngơi | nhận ra cơ thể và thời gian chưa đồng nhịp | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | trung bình |
| 29 | `attributed.zhuangzi.chapter_01.rest_beneath_tree` | thước đo thông thường về sự hữu ích | sự hữu ích và tự do | hiểu mình, biết đủ | đặt lại câu hỏi về thước đo | Đạo gia | 4 | hỗ trợ tự chủ | cao | thấp | cao |
| 30 | `attributed.laozi.chapter_02.mutual_arising` | cách đánh giá phân cực | các mặt đối đãi | mở rộng góc nhìn, chịu đựng bất định | giữ đồng thời hai mặt | Đạo gia | 4 | suy ngẫm | cao | thấp | cao |
| 31 | `comparison_steals_joy` | so sánh xã hội | con đường của chính mình | hiểu mình | đưa sự chú ý về hướng đi của mình | câu gốc Selflo | 2 | chỉ dẫn | thấp | cao | cao |
| 32 | `first_burnt_batch_does_not_erase_the_kitchen` | sai sót ban đầu | sai sót và giá trị bản thân | tự cảm thông, sức bền | đặt thất bại vào đúng bối cảnh | câu gốc Selflo | 3 | suy ngẫm | cao | thấp | cao |
| 33 | `attributed.ma.iv_31.love_your_art` | mối quan hệ với công việc | nghề nghiệp và tay nghề | ý nghĩa | coi trọng chính việc thực hành nghề | Khắc kỷ | 1 | chỉ dẫn | thấp | trung bình | cao |
| 34 | `quote.builder_and_shapeless_stones` | lo âu về công việc | công việc trong tưởng tượng và công việc thực | phán đoán, nhận biết ranh giới | tách nhiệm vụ thực khỏi phần việc phình ra trong đầu | bản thảo Selflo | 3 | suy ngẫm | cao | thấp | trung bình |
| 35 | `musician_stays_with_one_lost_note` | rèn luyện kỹ năng | luyện tập có chủ đích | quyền tự chủ, kiên nhẫn | thu hẹp luyện tập vào một điểm khó | câu gốc Selflo | 2 | gợi ý | trung bình | thấp | cao |
| 36 | `attributed.ma.viii_32.single_acts` | công việc hoặc đời sống phức tạp | từng hành động riêng lẻ | quyền tự chủ, biết đủ | hành động trong khả năng hiện tại | Khắc kỷ | 2 | chỉ dẫn | trung bình | trung bình | cao |

## Kết quả đối chiếu vòng hai

Vòng hai đối chiếu cách phân loại giữa các câu trong mẫu, đồng thời so với chủ đề, từ khóa, liên kết truyện và nguồn gốc hiện có. Dữ liệu mô tả hiện tại hỗ trợ việc đối chiếu nhưng không lấn át ý nghĩa của câu trích dẫn.

### 1. Chủ đề và năng lực được hỗ trợ phải tách biệt

Câu chữ hướng đến hành động không đồng nghĩa với việc hỗ trợ quyền tự chủ. `every_long_road_is_crossed_one_meter_at_a_time` và `attributed.ma.viii_32.single_acts` khuyến khích hành động nhưng phần lớn đưa ra kết luận sẵn. `compass_keeps_direction_not_steps` hỗ trợ quyền tự chủ trực tiếp hơn vì tách phương hướng khỏi các bước bị quy định trước và để ngỏ con đường.

### 2. Sự hiện diện là nhãn quá rộng nếu thiếu chuyển động suy ngẫm

Nhóm mẫu về sự chú ý chứa ít nhất ba chuyển động khác nhau: trở về hiện tại, nhận ra điều ở gần và ngừng theo dõi người khác để trở về với hành động của mình. Chỉ dùng `năng_lực_được_hỗ_trợ = sự_hiện_diện` sẽ không đủ chính xác để tìm nội dung.

### 3. Hiểu mình giao nhau với nhận biết cảm xúc và mở rộng góc nhìn

`sunlight_finds_the_scratch`, `river_carries_the_upstream_rain` và `energy_has_a_budget` đều có thể được gắn nhãn hiểu mình. Có thể giữ `hiểu_mình`, nhưng phải đi cùng hoàn cảnh và chuyển động cụ thể hơn.

### 4. Khả năng chịu đựng bất định khác với sức bền trước nghịch cảnh

Sức bền trước nghịch cảnh liên quan đến việc tiếp tục hoặc hồi phục khi gặp khó khăn. Khả năng chịu đựng bất định liên quan đến việc hành động hoặc chưa vội kết luận khi chưa biết kết quả. Các câu của Lão Tử và Trang Tử cho thấy khác biệt này khá rõ.

### 5. Biết đủ đang mang ít nhất hai nghĩa

Trong mẫu, biết đủ vừa có nghĩa là chấp nhận năng lượng hữu hạn hoặc hành động vừa đủ, vừa có nghĩa là không để thước đo thông thường quyết định sự hữu ích. Hai nghĩa này chỉ nên nằm chung một năng lực nếu chuyển động suy ngẫm phân biệt được `chấp_nhận_giới_hạn` với `đặt_lại_câu_hỏi_về_thước_đo`.

### 6. Nội dung về quan hệ thường hỗ trợ cách ứng xử, không nhất thiết hỗ trợ kết nối

`attributed.ma.vi_06.best_revenge` chủ yếu hỗ trợ việc giữ phẩm chất khi bị tổn thương. Câu này thuộc chủ đề quan hệ, nhưng năng lực được hỗ trợ nghiêng về phán đoán và trách nhiệm hơn là kết nối. Chủ đề không thể thay thế năng lực.

### 7. Nội dung mang tính chỉ dẫn không mặc nhiên yếu

Các câu cổ điển thường dùng lối mệnh lệnh. Một số câu vẫn là lời nhắc hữu ích khi người đọc có ít năng lượng nhận thức. Tính chỉ dẫn nên giúp quyết định thứ tự và cách đặt câu hỏi, không nên trở thành điểm trừ chất lượng.

### 8. Ẩn dụ tăng độ mở nhưng có thể làm giảm độ chắc chắn khi phân loại

`sunlight_finds_the_scratch` và `dark_room_before_the_body_is_ready` cho phép nhiều cách đọc hợp lý. Độ mở này có giá trị, nhưng việc tìm nội dung có thể cần ngữ cảnh biên tập đi kèm thay vì ngày càng thêm nhiều nhãn quá chi tiết.

### 9. Một số câu mang loại minh triết chuyển thể thực chất là bản thảo do Selflo biên soạn

Các bản ghi `quote.*` từ Xưởng truyện được xếp loại `minh_triết_chuyển_thể` nhưng không có tác giả hoặc tác phẩm bên ngoài được nêu tên. Không nên suy ra dòng tri thức từ trường `loại`. Đây là vấn đề nguồn gốc và biên tập cần chủ sở hữu xem xét, không phải điều giai đoạn hiệu chỉnh được phép âm thầm chuẩn hóa.

### 10. Mẫu cho thấy một cụm nội dung thiên về động viên

Một số câu chủ yếu khẳng định sự kiên trì, số mệnh, tránh so sánh hoặc hành động tích cực. Chúng vẫn có thể hữu ích, nhưng không phải bằng chứng rằng thư viện đã bao phủ sâu năng lực phán đoán hoặc quyền tự chủ. Chỉ đếm chủ đề sẽ làm độ sâu suy ngẫm trông cao hơn thực tế.

## Những điểm va chạm trong hệ phân loại

| Điểm va chạm | Nguyên nhân | Cách xử lý tạm thời |
|---|---|---|
| hiểu mình và nhận biết cảm xúc | cả hai đều liên quan đến việc nhận ra trạng thái bên trong | giữ cả hai; bắt buộc có hoàn cảnh và chuyển động cụ thể |
| quyền tự chủ và động lực | cả hai đều có thể khuyến khích hành động | quyền tự chủ phải giữ lại lựa chọn, giá trị hoặc điều phải đánh đổi cho người đọc |
| sức bền và chịu đựng bất định | cả hai đều xuất hiện trong nghịch cảnh | tách sự hồi phục hoặc bền bỉ khỏi việc sống cùng kết quả chưa biết |
| sự hiện diện và điều hướng chú ý | cả hai đều đưa nhận thức trở về | dùng chuyển động để phân biệt nhận ra, tập trung lại và chưa phản ứng vội |
| biết đủ và nghỉ ngơi | cả hai đều có thể cho phép dừng lại | tách sự vừa đủ hoặc giới hạn khỏi hồi phục và nhịp sống |
| phán đoán và mở rộng góc nhìn | cả hai đều thay đổi cách diễn giải | tách việc đánh giá hoặc lựa chọn khỏi việc mở rộng các cách hiểu có thể có |
| kết nối và trách nhiệm | cả hai đều xuất hiện trong nội dung quan hệ | tách sự hiện diện cùng nhau khỏi cách một người chọn ứng xử |

## Đề xuất Kiến trúc nội dung phiên bản 0.1

Mẫu ủng hộ bốn trục ý nghĩa tách biệt:

1. `hoàn_cảnh_con_người`: điều người đọc có thể đang đối diện;
2. `chủ_đề`: điều nội dung trực tiếp nói tới;
3. `năng_lực_được_hỗ_trợ`: khả năng con người mà nội dung có thể nuôi dưỡng;
4. `chuyển_động_suy_ngẫm`: thay đổi về sự chú ý, cách đặt vấn đề hoặc lựa chọn mà nội dung gợi mở.

`dòng_tri_thức` tiếp tục là trục về nguồn gốc và tri thức, không phải trục về nhu cầu con người.

Các nhận định biên tập như độ sâu suy ngẫm, mức độ tôn trọng quyền tự chủ, độ mở, nguy cơ sáo mòn, độ chắc chắn và ghi chú mơ hồ nên tiếp tục nằm ở tầng nghiên cứu trong giai đoạn hiệu chỉnh. Chưa nên đưa chúng vào nội dung gốc dùng khi sản phẩm vận hành.

## Đề xuất cho điểm kiểm tra tiếp theo

Chưa đánh giá toàn bộ 389 bản ghi. Trước hết cần:

1. chủ sở hữu xem xét mẫu hiệu chỉnh 36 bản ghi này;
2. chấp nhận hoặc điều chỉnh cam kết chiến lược;
3. viết định nghĩa, điều kiện đưa vào, điều kiện loại trừ và ví dụ phản chứng cho các nhãn phiên bản 0.1;
4. đánh giá một lát cắt kiểm chứng chiếm 25% từ các bản ghi chưa xuất hiện trong mẫu;
5. điều chỉnh thành phiên bản 0.2 trước khi đánh giá toàn bộ thư viện.

Nghiên cứu này không thay đổi câu trích dẫn gốc, truyện, lược đồ dữ liệu, bộ hiển thị hoặc hành vi ứng dụng.
