# Giai đoạn 12A — Rà độ bao phủ Self-understanding

Ngày rà soát: 2026-09-17  
Phạm vi: Quote Coverage Audit; không sửa nội dung chuẩn, không đổi trạng thái duyệt, không phát hành  
Baseline: Release 11, 61 Góc nhìn đang hoạt động

## 1. Phạm vi và phương pháp

Vòng này đọc đủ 54/54 Góc nhìn có `primary_theme = self_understanding`. Sau đó sàng lọc thêm 101 Góc nhìn thuộc `emotion` (23), `relationships` (38) và `rest_wellbeing` (40) để tìm cạnh tranh xuyên theme.

Mỗi câu được xem theo trải nghiệm con người, vai trò biên tập chính, mức trùng Release, nguy cơ nói thay người đọc, mức chỉ dẫn, phụ thuộc truyện, quyền và trạng thái duyệt. Không đặt chỉ tiêu phải chọn thêm câu.

Nhãn kết luận:

- **Đủ**: Release đã làm công việc này đủ tốt.
- **Ứng viên**: bổ sung coverage và đủ gần Release-ready.
- **Cần biên tập**: có gap và ý tốt nhưng câu chưa đạt.
- **Chuyển cụm**: nên cạnh tranh ở cụm sau.
- **Giữ**: không thắng, trùng hoặc có giọng quá đóng.
- **Bị chặn**: quyền, duyệt hoặc truyện chưa qua gate.

## 2. Bảng kiểm đủ 54 câu Self-understanding

| Mã câu | Trải nghiệm | Vai trò | Rủi ro / trùng | Gate | Kết luận |
|---|---|---|---|---|---|
| `another_persons_measure_cannot_fit_your_life` | Thước đo ngoài | Phân biệt / Trả quyền | Kết luận khá trọn | Truyện chưa human-edit; quyền chưa xác minh | Chuyển cụm; bị chặn |
| `another_persons_shoes_hurt` | Điều hợp người khác chưa chắc hợp mình | Phân biệt | Ít nói thay | Owner review | Chuyển cụm; ứng viên |
| `attributed.confucius.book_ii_ch15.thought` | Học và tự suy xét | Phân biệt | Lập trường rõ, phạm vi hẹp | Đạt | Đủ |
| `attributed.confucius.book_ii_ch17.knowledge` | Thừa nhận chưa biết | Cho phép / Phân biệt | Không thay gap “chưa biết mình muốn gì” | Đạt | Đủ cho not-knowing |
| `attributed.confucius.book_iv_ch17.inward` | So sánh rồi quan sát mình | Đổi khung | Có giọng chỉ dẫn | Đạt | Đủ |
| `attributed.confucius.book_xv_ch20.seek` | Nhìn lỗi mình thay vì người | Nhận ra | Nhị nguyên, dễ tăng self-blame | Quyền chưa xác minh | Giữ |
| `attributed.dhammapada.verse_050.own_deeds` | Trách nhiệm trong xung đột | Nhận ra | Giọng thẩm quyền | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.dhammapada.verse_081.rock` | Khen chê không định nghĩa mình | Đổi khung | Không hợp mọi trạng thái mong manh | Đạt | Đủ |
| `attributed.dhammapada.verse_103.self_conquest` | Chiến thắng bản thân | Đổi khung | Dễ củng cố tự đối đầu | Quyền chưa xác minh | Giữ |
| `attributed.dhammapada.verse_160.self_lord` | Tự làm chủ | Trả quyền | Dễ biến khó khăn thành ý chí | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.epictetus.ench_01.appearance` | Ấn tượng chưa chắc là sự thật | Phân biệt | Chỉ dẫn trực tiếp | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.laozi.chapter_02.mutual_arising` | Hai mặt nương nhau | Phân biệt | Quá trừu tượng; không rõ mixed feelings | Truyện và quyền chưa đạt | Không phải winner |
| `attributed.laozi.chapter_33.know_self` | Biết mình | Nhận ra | Lập trường rộng | Đạt | Đủ |
| `attributed.ma.ii_06.short_life` | Tìm hạnh phúc trong đánh giá ngoài | Trả quyền | Phán xét mạnh | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.ma.ii_08.own_soul` | Không rõ chuyển động trong mình | Nhận ra | Khẳng định bất an khá tất định | Quyền chưa xác minh | Không thắng `light_gives...` |
| `attributed.ma.v_11.use_of_soul` | Tự hỏi mình sống cho gì | Gọi tên | Thuộc giá trị, không phải chưa biết mình muốn gì | Quyền chưa xác minh | Chuyển cụm |
| `attributed.ma.vii_15.retain_lustre` | Giữ phẩm chất trước đánh giá ngoài | Trả quyền | Chỉ dẫn và chuẩn mực cao | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.ma.vii_59.fountain_good` | Nguồn thiện bên trong | Đổi khung | Hình ảnh đạo đức, không phổ quát | Đạt | Đủ, có giới hạn |
| `attributed.paulo_coelho.the_alchemist.004` | Đánh giá ngoài và điều mình muốn | Trả quyền | Nói kết luận thay người đọc | Quyền chưa xác minh | Chuyển cụm / bị chặn |
| `attributed.paulo_coelho.the_alchemist.013` | Mất liên hệ bản năng | Nhận ra | Thiếu ngữ cảnh; độ chắc chắn thấp | Quyền chưa xác minh | Giữ |
| `attributed.paulo_coelho.the_alchemist.016` | Người khác áp cách sống | Nhận ra | Khái quát và phán xét | Quyền chưa xác minh | Chuyển cụm / bị chặn |
| `attributed.paulo_coelho.the_alchemist.025` | Lời nói gây hại | Nhận ra | Nhị nguyên; ngoài cluster | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.paulo_coelho.the_alchemist.033` | Can thiệp đời khác làm mất đường mình | Trả quyền | Tuyên bố tuyệt đối | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.paulo_coelho.the_alchemist.039` | Không phải tự quyết | Nhận ra | Đoạn rời ngữ cảnh | Quyền chưa xác minh | Giữ |
| `attributed.paulo_coelho.the_alchemist.040` | Tin người dẫn hơn bản năng | Nhận ra | Dài và giải nghĩa người đọc | Quyền chưa xác minh | Giữ |
| `attributed.paulo_coelho.the_alchemist.047` | Người khác áp cách sống | Phân biệt | Gần `.016`; phán xét | Quyền chưa xác minh | Chuyển cụm / bị chặn |
| `attributed.paulo_coelho.the_alchemist.048` | Cảm giác mất quyền làm chủ | Trả quyền | “Dối trá nhất” quá đóng | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.paulo_coelho.the_alchemist.054` | Do dự và tự cản mình | Trả quyền | Biến rào cản thành lỗi cá nhân | Quyền chưa xác minh | Không phù hợp |
| `attributed.paulo_coelho.the_alchemist.077` | Trái tim và ý nghĩa | Gọi tên | Đưa sẵn đáp án về ý nghĩa | Quyền chưa xác minh | Chuyển cụm / giữ |
| `attributed.paulo_coelho.the_alchemist.079` | Hiểu mình để tránh bất trắc | Nhận ra | Hứa quá mức; dễ đổ lỗi | Quyền chưa xác minh | Không phù hợp |
| `attributed.seneca.letter_78.opinion` | Cách nhìn góp phần vào đau khổ | Đổi khung | Có thể hạ thấp điều kiện thực tế | Quyền chưa xác minh | Giữ |
| `attributed.zhuangzi.chapter_01.rest_beneath_tree` | Giá trị ngoài tính hữu dụng | Đổi khung | Không trùng self-blame | Đạt | Đủ |
| `comparison_loop_digest` | So sánh làm mất năng lượng | Nhận ra | Giải thích cơ chế | Quyền chưa xác minh | Chuyển cụm / cần biên tập |
| `comparison_steals_joy` | Quên đường mình khi nhìn đường người | Đổi khung | Thông điệp quen; gần `neighboring_light` | Truyện và quyền chưa đạt | Không thêm |
| `defense_layer_digest` | Chiếu phần mình lên người khác | Nhận ra | Diễn giải tâm lý quá mạnh | Quyền chưa xác minh | Giữ |
| `each_season_has_its_own_gift` | Nhịp riêng trước so sánh | Đổi khung | Hình ảnh quen; gần coverage hiện có | Owner review | Không thêm |
| `first_burnt_batch_does_not_erase_the_kitchen` | Sai lần đầu khi học | Đổi khung | Gần `first_needle`; ít rõ về hỗ trợ | Truyện và quyền chưa đạt | Không thắng |
| `first_needle_needs_light_not_blame` | Đang học nhưng thấy mình kém | Đổi khung / Cho phép | “Cần/không cần” hơi đóng | Selflo-owned; owner review | Ứng viên |
| `gentle_voice_for_the_broken_bowl` | Gây hậu quả rồi tự trách | Phân biệt / Cho phép | Không xóa trách nhiệm | Đạt | Đủ |
| `gentleness_creates_room` | Tự trách làm khó nhìn rõ | Đổi khung | Giải thích cơ chế quá đầy đủ | Owner review | Không thêm / cần biên tập |
| `identity_layer_digest` | “Mình kém” tự tìm bằng chứng | Gọi tên | Phát biểu cơ chế như kết luận | Quyền chưa xác minh | Cần biên tập |
| `late_flower_meets_another_sky` | Khác nhịp phát triển | Đổi khung | Gần comparison/quiet growth | Truyện và quyền chưa đạt | Chuyển cụm |
| `marathoner_does_not_chase_sprinter_at_start` | So sai loại hành trình | Phân biệt | Dễ thành lời khuyên thành tích | Owner review | Chuyển cụm / giữ |
| `neighboring_light_does_not_dim_this_lamp` | Thành công người khác làm mình nhỏ đi | Đổi khung | Nhẹ, không ra lệnh | Đạt | Đủ |
| `old_pattern_not_identity` | Phản ứng quen bị coi là bản chất | Phân biệt | Bổ sung gap; kết luận khá trọn | Selflo-owned; owner review | Cần biên tập |
| `projection_loop_digest` | Phản ứng chạm phần chưa gọi tên | Gọi tên | Đọc tâm lý người dùng quá mạnh | Quyền chưa xác minh | Giữ |
| `quote.potter_and_two_hands` | Sức ép và nâng đỡ cùng cần | Phân biệt | Không phải hai cảm xúc cùng tồn tại | Truyện và quyền chưa đạt | Không phải winner |
| `scratched_table_stays_in_the_home` | Vết xước không xóa chỗ đứng | Cho phép | “Chẳng bao giờ” đóng tổn thương thành vĩnh viễn | Selflo-owned; owner review | Cần biên tập |
| `self_judgment_loop_digest` | Biến lỗi thành kết luận về mình | Phân biệt | Gap thật nhưng giải thích trực tiếp | Quyền chưa xác minh | Cần biên tập |
| `shadow_length_depends_on_sun` | Thước đo thay đổi theo bối cảnh | Phân biệt | Có thể bị đọc thành phủ nhận tự đánh giá | Owner review | Chuyển cụm / giữ |
| `trains_leave_together_for_different_cities` | Cùng lúc, khác đích | Đổi khung | Gần nhịp riêng; ít self-compassion | Owner review | Chuyển cụm |
| `two_trees_begin_with_different_seeds` | Khác điều kiện ban đầu | Đổi khung | Dễ tự nhiên hóa bản chất cố định | Owner review | Giữ |
| `two_windows_receive_the_same_sun` | Cùng nắng, khác trải nghiệm | Phân biệt | Quá mở, job chưa rõ | Owner review | Giữ |
| `young_tree_tied_with_soft_cloth` | Hỗ trợ nhẹ sau tổn thương | Cho phép | Độ chắc chắn thấp | Owner review | Cần nghiên cứu thêm |

## 3. Sàng lọc các theme lân cận

### Emotion

| Mã câu | Công việc liên quan | Kết luận |
|---|---|---|
| `light_gives_the_room_a_shape` | Điều chưa hiểu bắt đầu có hình | Đã Release; coverage đủ |
| `river_carries_the_upstream_rain` | Trải nghiệm trước ảnh hưởng phản ứng hiện tại | Cụm emotional memory; story chưa qua gate |
| `yin_yang_of_emotion` | Không đóng nhãn tốt/xấu | Giải thích message; không lấp mixed feelings |
| `feeling_is_signal_not_command` | Cảm xúc và lựa chọn không phải một | Chuyển Cluster 3; cần review mức tuyên bố |
| `name_the_weather_inside` | Gọi tên cảm xúc | Gần đạt; vế chiếc ô biến naming thành chỉ dẫn |
| `memory_layer_digest` | Cảm xúc hiện tại có thể bắt đầu từ trước | Giải thích cơ chế; `river...` giàu trải nghiệm hơn |
| `room_holds_the_bells_echo` | Dư âm sau sự kiện | Thuộc recovery/work carryover hơn self-blame |

Không có câu Emotion nào thể hiện rõ hai cảm xúc trái chiều cùng tồn tại mà vẫn mở và không giảng.

### Relationships

Các câu mạnh chủ yếu làm việc về ranh giới, kết nối, trách nhiệm hoặc xung đột. `social_layer_digest` nói điều hòa cảm xúc có thể đi qua kết nối nhưng đang phát biểu lý thuyết. Không có câu nào cạnh tranh trực tiếp và tốt hơn các winner self-compassion hiện tại.

Kết luận: không thêm candidate từ Relationships.

### Rest & Wellbeing

| Mã câu | Công việc liên quan | Kết luận |
|---|---|---|
| `damp_paper_is_not_the_pens_fault` | Capacity thấp không nhất thiết là lỗi bản thân | Strong Edit; hai mệnh đề quá tuyệt đối |
| `tide_does_not_apologize` | Nhịp năng lượng thay đổi không phải lỗi | Trùng Cluster 1; story chưa qua gate |
| `morning_dew_leaves_when_warm` | Không thúc ép hồi phục | Có nguy cơ hứa trạng thái sẽ tự tan |
| `tired_body_waits_for_the_train` | Cơ thể mỏi nhưng chưa ngủ | Cluster 1; không phải self-blame winner |
| `water_settles_when_untouched` | Ít khuấy động hơn thay vì thêm lời giải | Hợp triết lý nhưng mang prescription; Edit ở cluster khác |

## 4. Coverage map

| Trải nghiệm | Release hiện tại | Winner mới | Kết luận |
|---|---|---|---|
| Gây hậu quả rồi tự trách | `gentle_voice_for_the_broken_bowl` | — | Đã đủ |
| Đang học nhưng còn vụng | — | `first_needle_needs_light_not_blame` | Gap + winner tốt; candidate Release |
| Capacity thấp rồi kết luận mình kém | — | `damp_paper_is_not_the_pens_fault` | Gap + Edit candidate |
| Thành công người khác làm mình nhỏ đi | `neighboring_light_does_not_dim_this_lamp` | — | Đã đủ |
| Sống theo thước đo ngoài | — | `another_persons_shoes_hurt` và `another_persons_measure_cannot_fit_your_life` | Chuyển cụm; chưa chốt |
| Không hiểu điều đang xảy ra trong mình | `light_gives_the_room_a_shape` | — | Đã đủ |
| Biến lỗi/phản ứng thành bản chất | — | `old_pattern_not_identity`; `self_judgment_loop_digest` | Gap + Edit candidates |
| Không hoàn hảo làm mất giá trị/chỗ đứng | — | `scratched_table_stays_in_the_home` | Gap + Edit candidate |
| Hai cảm xúc trái chiều cùng tồn tại | — | — | Gap thật; chưa có câu đủ tốt |
| Không chắc mình muốn gì | — | — | Gap thật; chưa có câu đủ tốt |
| Chưa biết và thừa nhận chưa biết | `attributed.confucius.book_ii_ch17.knowledge` | — | Đã đủ; khác với không biết mình muốn gì |

## 5. Quyết định vòng 12A

### Candidate Release

- `first_needle_needs_light_not_blame`

Câu bổ sung trải nghiệm chưa được Release phục vụ trực tiếp, không có story gate, Selflo-owned và có knowledge basis đã kiểm tra ở Release 11. Đây vẫn là đề xuất chờ owner approval; vòng audit không đổi `review.status`.

### Edit candidates

- `damp_paper_is_not_the_pens_fault`
- `old_pattern_not_identity`
- `self_judgment_loop_digest`
- `scratched_table_stays_in_the_home`

### Chuyển cluster sau

- `another_persons_shoes_hurt`
- `another_persons_measure_cannot_fit_your_life`
- `feeling_is_signal_not_command`
- các câu về đánh giá ngoài, lựa chọn, nhịp riêng và giá trị sống.

### Gap thật, chưa viết mới

- Hai cảm xúc trái chiều cùng tồn tại.
- Không chắc mình muốn gì.

## 6. Bước tiếp theo

Chuyển sang Cluster 3 — Uncertainty / Choice / Agency. Dùng cùng phương pháp: baseline Release 11, đọc ứng viên xuyên theme, nhóm theo editorial job và chỉ chọn khi bổ sung coverage. Không sửa app, không viết story và không đặt quota phát hành.
