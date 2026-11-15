# Light Quest Eclipse · Tháp Trăng

Bản thử nội bộ Godot 4.4.1, GDScript, Compatibility. [PR #76](https://github.com/dungvo/dungvo.github.io/pull/76) chứa phần phát triển Eclipse. GitHub Pages hiện có bản Eclipse cũ. Bản QA riêng cho tuyến Tháp Trăng dùng để kiểm tra trên thiết bị thật.

## Chạy game

Mở `project.godot` bằng Godot và nhấn F5. Chọn **An** để dùng kiếm và chuỗi ba đòn hoặc **Kha** để bắn đạn sáng và hồi máu.

| Thao tác | Bàn phím | Cảm ứng ngang |
|---|---|---|
| Di chuyển | A/D hoặc phím mũi tên | Joystick trái |
| Nhảy | Space, W hoặc ↑ | NHẢY |
| Tấn công | J | ĐÁNH |
| Lướt | K | LƯỚT |
| Đỡ đòn / hồi máu | L | LỰC |
| Tương tác | E | E |
| Hồi sinh tại trạm lưu | R | Hết máu sẽ tự hồi sinh |

Từ Làng Trăng, đi qua Rừng Vọng và Hầm Bóng đến Tháp Pha Lê. Xoay gương **dưới bệ**, rồi nhảy lên bệ để xoay gương **trên bệ** và dẫn tia đến pha lê. Qua Cổng Đêm, dùng trụ tại Đài Quan Sát để lưu. Trụ trong phòng Thủ Hộ hạ khiên trong một khoảng ngắn. Ở nửa máu, Thủ Hộ dựng khiên trở lại và bắn ba luồng đạn theo hướng báo trước. Đợi trụ nạp lại rồi phá khiên lần hai. Rương Nguyệt Thạch trong Hầm Bóng tăng một điểm sinh lực tối đa.

## Kiểm tra

```sh
godot --headless --editor --import --quit
godot --headless --script res://tests/smoke.gd
godot --headless --script res://tests/hit_geometry_test.gd
godot --headless --fixed-fps 60 --script res://tests/campaign_playthrough.gd
godot --script res://tests/capture_visual.gd
```

Lệnh chụp ảnh cần trình hiển thị đồ họa. Bốn ảnh PNG nằm trong `visual-qa/`. Workflow PR chạy Godot 4.4.1, tạo ảnh QA và xuất Web một luồng dưới dạng artifact. HTML/WASM/PCK của artifact phải được phục vụ cùng nhau qua HTTP.

- [Kế hoạch và tiêu chí phát hành](docs/MOCKUP_FIDELITY_RELEASE_PLAN.md)
- [Bàn giao và đối chiếu mockup](docs/VISUAL_QA_HANDOFF.md)
- [Nguồn gốc hình ảnh](docs/ASSET_MANIFEST.md)
