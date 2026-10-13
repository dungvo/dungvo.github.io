# Q4 — AI review batch 01: nhóm có quyền rõ nhất

**Trạng thái:** Hoàn thành; 25 quote đã vào Release 44
**Ngày:** 2026-10-12
**Phạm vi:** 34 quote `selflo_owned` và 1 quote `public_domain` trong Authoring
**Lưu ý:** Đây là review nội dung quote. Story liên kết chưa được duyệt quyền nên chưa nằm trong batch Release này.

## Kết luận

| Phân loại | Số lượng | Có thể làm gì tiếp |
|---|---:|---|
| AI đã duyệt và Release quote-only | 25 | Đã vào Release 44 với reviewer `ai:codex`; story chưa sẵn sàng không đi kèm |
| Cần biên tập trước khi duyệt | 7 | Sửa câu vì còn giọng mệnh lệnh, coaching hoặc claim rộng |
| Không đạt vòng này | 2 | Giữ ngoài Release; một câu quá mỏng, một câu nhân hóa sinh học như fact |
| Cần review bản dịch/nguồn | 1 | Chưa Release dù rights ghi public domain |
| **Tổng** | **35** | — |

## 25 quote AI đã duyệt nội dung

Các câu dưới đây có quyền `selflo_owned`, đứng độc lập tương đối tốt, không gán chẩn đoán cho người đọc, không dựa vào claim khoa học và không trùng exact trong baseline:

1. `a_large_task_only_needs_one_first_square`
2. `accepting_the_flood_reveals_the_road_still_open`
3. `an_old_scent_can_open_an_old_room`
4. `another_persons_measure_cannot_fit_your_life`
5. `bus_ticket_keeps_the_day_of_return`
6. `comparison_steals_joy`
7. `eraser_shrinks_as_letters_straighten`
8. `every_long_road_is_crossed_one_meter_at_a_time`
9. `familiar_cafe_remembers_the_order`
10. `first_burnt_batch_does_not_erase_the_kitchen`
11. `freedom_begins_when_one_path_is_not_the_only_path`
12. `hands_keep_the_hammers_echo`
13. `house_turns_off_one_window_at_a_time`
14. `late_flower_meets_another_sky`
15. `musician_stays_with_one_lost_note`
16. `new_light_enters_where_branch_broke`
17. `old_chair_holds_more_than_wood`
18. `one_umbrella_keeps_two_steps_together`
19. `restitching_teaches_the_hand`
20. `river_carries_the_upstream_rain`
21. `roof_releases_the_storm_slowly`
22. `safe_return_can_help_us_go_farther`
23. `seed_grows_out_of_sight`
24. `someone_calls_at_the_last_stop`
25. `tea_waits_beside_the_screen`

### Kết quả phát hành batch này

- Đã đổi lifecycle đúng 25 quote với reviewer `ai:codex`; story giữ `draft/unverified`.
- Authoring revision 82 và Release revision 44 đã được publisher tạo thành công.
- 25 quote xuất hiện ở Release dạng quote-only; `story_id` được project về `null`.
- Đã bổ sung tags theo `selflo.content-tags.v1`; schema, semantic và coverage gate pass.
- Đây là package local trong repo; việc deploy/push web công khai là bước riêng.

## 7 quote cần biên tập

| ID | Vấn đề chính |
|---|---|
| `do_not_go_to_work_twice` | Mở bằng mệnh lệnh “Đừng”; dễ thành lời khuyên và tạo thêm áp lực cho người đang khó tách khỏi công việc. |
| `do_not_throw_the_stone_into_the_next_persons_lake` | Cấu trúc dạy cách hành xử và ẩn dụ dài; nên viết lại thành một quan sát thay vì lời răn. |
| `keep_the_lamp_when_the_sea_has_waves` | “Ta cần học cách…” mang giọng coaching; ẩn dụ không gắn với một sự việc đủ rõ. |
| `peace_does_not_require_a_silent_room` | Claim “bình yên không đòi…” quá rộng; vế sau giải thích trừu tượng. |
| `tide_does_not_apologize` | “Không phải một lỗi cần xin phép” vừa khẩu hiệu vừa áp một kết luận rộng về nhịp năng lượng. |
| `tomorrow_may_bring_waves_tonight_return_to_breath` | Chuyển thành chỉ dẫn điều hòa cảm xúc; không phù hợp mọi người và thiếu bối cảnh. |
| `tomorrows_stone_does_not_get_lighter_overnight` | Hai câu mệnh lệnh/coaching; có thể khiến người chưa thể ngừng lo cảm thấy mình làm sai. |

## 2 quote không đạt vòng này

| ID | Kết luận |
|---|---|
| `ninety_nine_percent_is_not_finished` | Quá mỏng và hiển nhiên; chưa tạo thêm góc nhìn hoặc giá trị riêng của Selflo. |
| `roots_check_themselves_after_storm` | Nhân hóa “bộ rễ đang tự kiểm tra” như một giải thích sinh học; dễ bị đọc thành fact và mang dấu vết văn chương công thức. |

## 1 quote chưa được xếp sẵn sàng dù rights là public domain

`attributed.ma.iv_31.love_your_art` cần đối chiếu lại nguyên văn tiếng Anh, phạm vi nghĩa của “art/profession”, chất lượng bản Việt và quan hệ với story. Rights của edition không tự bảo đảm bản dịch nháp đã chính xác và đạt chất lượng biên tập.

## Phán quyết với story

32 story liên kết vẫn là `draft`; rights đều `unverified`. Năm story đã có `review.status = approved` nhưng vẫn không Release-ready vì rights chưa được xác minh. Batch 01 không dùng trạng thái quote để hợp thức hóa story.

## Đúng một bước tiếp theo

Tiếp tục lane 513 `translated_quote` ở Authoring: xác minh source/edition/bản dịch, review Selflo fit và Release theo batch nguồn khép kín.
