# Light Quest Eclipse · Bàn giao QA

**PR #76 vẫn là draft.** Tuyến Tháp Trăng có thể đưa vào QA người chơi bằng đường dẫn riêng sau khi qua kiểm thử. Cập nhật đường dẫn phát hành GitHub Pages vẫn chờ QA Safari trên thiết bị thật.

## Phạm vi

- An dùng combo kiếm ba nhịp và đỡ đòn. Kha bắn đạn ánh sáng và có kỹ năng hồi sinh lực. Sprite riêng cho từng nhân vật và từng trạng thái, gồm bốn frame chạy. Một số động tác chiến đấu và phản ứng còn dùng một pose cộng hiệu ứng.
- Sói lao, golem đánh gần có báo đòn, pháp sư bắn đạn và dơi bổ nhào. Thủ Hộ có khiên, trụ khắc chế và thêm đạn ở nửa máu. Dùng CharacterBody2D, Area2D và truy vấn va chạm Godot.
- Câu đố hai gương nằm trên đường đi và nối với cổng thật. Cổng, trạm lưu, rương và Thủ Hộ dùng tệp save Eclipse v1 với một trường tùy chọn mới cho rương.
- Mỗi nút cảm ứng dùng TouchScreenButton. Joystick giữ riêng ID ngón tay. Sự kiện mất focus đặt lại trạng thái đầu vào. Bản Classic/Ô sáng giữ đường dẫn và dữ liệu trước đó.

## Đối chiếu ở 960×540

| Khung đối chiếu | Bằng chứng trong game | Khoảng cách với mockup |
|---|---|---|
| Rừng Vọng, An và sói | Cầu rêu, cột đá, thác, trăng và lâu đài. Sói và An có silhouette riêng, có vệt kiếm và số sát thương. | Mockup có cảnh trước dày hơn, khối đá bố trí gần nhân vật và hiệu ứng đòn nhiều lớp hơn. Cầu lặp lại họa tiết giữa các phòng. |
| Tháp Pha Lê, Kha | Hai gương, đường tia và pha lê có trạng thái hoạt động. Giải xong mở collider của cổng. | Cần puzzle nhiều cách thao tác hơn và kết hợp tốt hơn với platforming. |
| Phòng Thủ Hộ | Sprite lớn, trụ sáng, khiên và thanh máu nhìn thấy được. | Boss cần chuỗi hình đòn đánh, phản ứng, chuyển pha và kết liễu riêng. Cần đánh giá nhịp né và phản công khi chơi tay. |
| UI ngang | HUD ở mép trên, joystick và các nút ở hai bên. Ảnh Chromium phát hiện glyph tim và nút bị thiếu, nên tim được vẽ trực tiếp và nút dùng nhãn tiếng Việt. Sự kiện Godot kiểm tra được ba ngón đồng thời. | Cần Safari/iPhone 13 mini thật để đo thời gian khung hình, kiểm tra vùng tai thỏ, chạm nhanh và vị trí ngón cái. |

## Kiểm thử

- Godot 4.6.3 cục bộ. Kiểm tra import và smoke qua scene thật. Phạm vi gồm quét đòn trái/phải, tường chặn kiếm và đạn, đạn tốc độ cao, mở cổng qua gương, hồi máu tối đa từ rương, khiên và qua pha Thủ Hộ, chạm ba ngón đồng thời, nhảy ngắn/dài, dash.
- OpenGL Compatibility trên Linux. Ảnh từ viewport thật: `actual-gameplay.png`, `actual-puzzle.png` và `actual-guardian.png`. Ảnh chiến đấu được kiểm tra hai lượt. Lượt đầu phát hiện mép cầu lệch collider, đã chỉnh atlas và cao độ rồi chụp lại.
- Chromium chạy bản HTML/WASM/PCK ở 812×375, có chọn nhân vật bằng cảm ứng và thử thao tác nhiều ngón mô phỏng.
- Bài kiểm tra Ô sáng World/Secret Garden chạy qua 18 và 9 màn.

## Việc còn lại trước Pages

1. Làm thêm frame tay cho combo, lao/chém của quái, báo đòn/chuyển pha boss và chết. Kiểm tra từng frame đặt chân đúng mặt địa hình. Bổ sung âm thanh phản hồi và đánh giá tay qua toàn tuyến.
2. Tinh chỉnh bố cục tầng đá và dây leo theo từng phòng. Làm thêm chiều sâu tiền cảnh và giảm cảm giác lát lặp. Ghi lại video gameplay từ bản Web.
3. Chạy Safari với iPhone 13 mini thật. Đo thời gian khung khi giật camera, bắn đạn, vào gauge boss và chơi ba ngón. Kiểm tra focus, xoay màn hình và resume.
4. Đối chiếu ảnh/video với mockup và đánh giá đủ các tiêu chí trong kế hoạch. Chỉ sau đó mới cập nhật bản Eclipse công khai.

## Vòng chơi thử Tháp Trăng

- Combo An có ba nhịp với pose chuẩn bị, trúng đòn và thu kiếm riêng. Nhịp hai có thêm tầm đánh phía trên, nhịp ba xa hơn và gây hai sát thương. Lướt hủy nhịp chuẩn bị.
- Sói và Thủ Hộ có pose báo đòn, lao/đập và hồi phục. Pha hai tái tạo khiên và cần kích hoạt lại trụ sáng sau khi nạp. Đường báo trước cho thấy hướng quạt ba đạn. Kết thúc tuyến hiện bảng chiến thắng và mở Nguyệt Lướt.
- Gương trên cần nhảy lên bệ một chiều. Gương dưới có thể xoay từ nền. Test campaign đi liên tục từ Làng Trăng bằng vật lý của nhân vật đến màn thắng bằng đạn Kha, gồm rương, gương, cổng, checkpoint và hai pha boss.
- Tám âm ngắn phát khi người chơi thao tác. Rừng Vọng có thêm bậc đá và tiền cảnh. Ảnh QA gồm thêm shot chuyển pha boss.
- Kiểm tra tay trên iPhone, chiều sâu của tiền cảnh và độ mượt các bộ hình khác vẫn cần review riêng trước khi chọn bản phát hành chính thức.
