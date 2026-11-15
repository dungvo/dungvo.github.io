# Light Quest Eclipse · Tháp Trăng

Bản thử nội bộ Godot 4.4.1, GDScript, Compatibility. [PR #76](https://github.com/dungvo/dungvo.github.io/pull/76) chứa phần phát triển Eclipse. GitHub Pages hiện có bản Eclipse cũ.

## Chạy game

Mở `project.godot` bằng Godot và nhấn F5. Chọn **An** để dùng kiếm và chuỗi ba đòn hoặc **Kha** để bắn đạn sáng và hồi máu.

| Thao tác | Bàn phím | Cảm ứng ngang |
|---|---|---|
| Di chuyển | A/D hoặc phím mũi tên | Joystick trái |
| Nhảy | Space, W hoặc ↑ | ↑ |
| Tấn công | J | ⚔ |
| Lướt | K | » |
| Đỡ đòn / hồi máu | L | ✦ |
| Tương tác | E | E |
| Hồi sinh tại trạm lưu | R | Hết máu sẽ tự hồi sinh |

Từ Làng Trăng, đi qua Rừng Vọng và Hầm Bóng đến Tháp Pha Lê. Xoay gương **trên bệ** và **dưới bệ** để dẫn tia đến pha lê. Qua Cổng Đêm, dùng trụ tại Đài Quan Sát để lưu. Trụ trong phòng Thủ Hộ hạ khiên trong một khoảng ngắn. Thủ Hộ bắn đạn ở pha hai. Rương Nguyệt Thạch trong Hầm Bóng tăng một điểm sinh lực tối đa.

## Kiểm tra

```sh
godot --headless --editor --import --quit
godot --headless --script res://tests/smoke.gd
godot --headless --script res://tests/hit_geometry_test.gd
godot --script res://tests/capture_visual.gd
```

Lệnh chụp ảnh cần trình hiển thị đồ họa. Ba ảnh PNG nằm trong `visual-qa/`. Workflow PR chạy Godot 4.4.1, tạo ảnh QA và xuất Web một luồng dưới dạng artifact. HTML/WASM/PCK của artifact phải được phục vụ cùng nhau qua HTTP.

- [Kế hoạch và tiêu chí phát hành](docs/MOCKUP_FIDELITY_RELEASE_PLAN.md)
- [Bàn giao và đối chiếu mockup](docs/VISUAL_QA_HANDOFF.md)
- [Nguồn gốc hình ảnh](docs/ASSET_MANIFEST.md)
