# Giai đoạn 10B — Gói duyệt cân bằng bản phát hành công khai

Ngày lập: 2026-09-17  
Trạng thái: Hoàn tất review và tạo Release 11 local ngày 2026-09-17
Phạm vi: Quyết định biên tập; chưa thay đổi nguồn chuẩn hoặc Release

## 1. Đề xuất

Ưu tiên duyệt 17 câu ở mục 3 của `phase-10a-public-release-shortlist.md`. Ba câu ở nhóm dự phòng không được đưa vào đợt đầu nếu chưa có ngữ cảnh sử dụng rõ hơn.

Thứ tự duyệt đề xuất:

1. gọi tên trải nghiệm;
2. cạn năng lượng và hồi phục;
3. tự cảm thông;
4. áp lực công việc;
5. làm rõ giá trị và lựa chọn.

Thứ tự này ưu tiên sửa khoảng lệch lớn nhất của Release hiện hành trước khi tăng thêm nội dung định hướng hành động.

## 2. Câu hỏi duyệt từng câu

1. Câu có thể đứng độc lập mà không cần giải thích từ Selflo không?
2. Câu mở thêm một cách nhìn hay thay người đọc kết luận?
3. Câu có biến giới hạn hoàn cảnh thành lỗi hoặc trách nhiệm cá nhân không?
4. Câu có ngầm hứa phục hồi, bình an hoặc kết quả tích cực không?
5. Câu có giữ chỗ cho người đọc bác bỏ hoặc hiểu khác không?
6. Attribution và quyền sử dụng đã đủ rõ chưa?
7. Câu có trùng vai trò với một câu Release hiện tại không?
8. Nếu người dùng đang mệt, đau buồn hoặc chịu áp lực hệ thống, câu có còn tôn trọng họ không?

## 3. Khuyến nghị quyết định ban đầu

### Khuyến nghị duyệt nếu nguyên văn được chủ sở hữu chấp nhận

- `light_gives_the_room_a_shape`
- `energy_has_a_budget`
- `towel_reveals_what_it_carried`
- `hands_keep_the_hammers_echo`
- `house_turns_off_one_window_at_a_time`
- `rain_stopped_before_ground_dried`
- `roof_releases_the_storm_slowly`
- `empty_desk_with_glowing_screen`
- `ten_notifications_are_not_ten_priorities`
- `some_footprints_lead_toward_home`
- `gentle_voice_for_the_broken_bowl`
- `neighboring_light_does_not_dim_this_lamp`

### Khuyến nghị đọc lại kỹ trước khi duyệt

- `name_the_weather_inside`: xem lại mức độ chỉ dẫn của ẩn dụ chiếc ô.
- `tide_does_not_apologize`: xem lại kết luận “không phải một lỗi”.
- `morning_dew_leaves_when_warm`: tránh hàm ý chỉ cần chờ thì mọi việc tự qua.
- `timecard_cannot_measure_presence`: tránh khiến người kiệt sức cảm thấy bị phán xét vì chưa thật sự “có mặt”.
- `gentleness_creates_room`: tránh mặc định người đọc đang tự trách.

### Chưa khuyến nghị cho đợt đầu

- `map_does_not_lower_the_mountain`
- `emergency_fund_can_become_breathing_time`
- `small_boundary_is_still_boundary`

## 4. Tiêu chí hoàn tất vòng duyệt

- Mỗi câu có quyết định rõ ràng và lý do ngắn.
- Không sửa câu chữ trực tiếp trong lúc duyệt; đề xuất sửa phải quay lại một vòng riêng.
- Không đổi trạng thái trong nguồn chuẩn trước khi kiểm tra toàn bộ tập được duyệt trong ngữ cảnh Release.
- Không giữ câu chỉ để đạt một con số.
- Không viết nội dung mới để lấp chỗ của câu bị loại trong cùng vòng này.

## 5. Ngoài phạm vi

- thay đổi app;
- viết truyện mới;
- tạo cụm đọc cho ứng dụng;
- thay schema hoặc publisher;
- publish Release 10 hoặc Release kế tiếp;
- tự động hóa quyết định của chủ sở hữu.

## 6. Quyết định cuối

- Duyệt tám quote độc lập cho Release: `light_gives_the_room_a_shape`, `towel_reveals_what_it_carried`, `rain_stopped_before_ground_dried`, `empty_desk_with_glowing_screen`, `ten_notifications_are_not_ten_priorities`, `some_footprints_lead_toward_home`, `gentle_voice_for_the_broken_bowl`, `neighboring_light_does_not_dim_this_lamp`.
- Giữ ba quote đã đạt về câu chữ ở Authoring vì story liên kết chưa đủ điều kiện: `energy_has_a_budget`, `hands_keep_the_hammers_echo`, `house_turns_off_one_window_at_a_time`.
- Giữ `roof_releases_the_storm_slowly` ở Authoring để tránh trùng vai trò với `rain_stopped_before_ground_dried`.
- Giữ năm câu mức C để biên tập lại và ba câu mức D ngoài đợt này.

## 7. Kết quả thực thi

- Tám quote được chuyển sang `approved` bởi `owner:dungvo` qua script chuẩn.
- Knowledge dependency được đối chiếu và ghi bằng chứng tại `perspective-library/RELEASE_R11_SOURCE_REVIEW.vi.md`.
- Sửa URL DOI của `ref.neff_2003_self_compassion` sang DOI hiện hành `10.1080/15298860309032`.
- Authoring revision 34 và Release revision 11 được tạo qua publisher; Release 11 có 61 quote active.
- Ba quote liên kết story chưa duyệt, `roof_releases_the_storm_slowly`, năm câu mức C và ba câu mức D vẫn ở Authoring.

## 8. Bước tiếp theo duy nhất

Xác minh public manifest và toàn bộ descriptor sau khi commit/push Release 11.
