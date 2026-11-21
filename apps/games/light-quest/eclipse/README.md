# Light Quest: Eclipse — Tiếng chuông đã mất

Godot **4.4.1**, GDScript, renderer Compatibility. Tiếp tục từ PR #85 và bộ hình / animation Eclipse gốc. Không thay engine. Bản Web được xuất một luồng, không cần COOP/COEP.

**Chơi:** https://dungvo.github.io/apps/games/light-quest/eclipse/godot-play/


## V4 — Tiếng Gọi Tầng Trời

Mặc định menu chọn **04 · Tháp Gió**. Tổng cộng có sáu màn: ba chương gốc và ba chương leo cao mới. Giữ nguyên Godot 4.4.1, nhân vật và bộ animation hiện tại; thêm tranh nền riêng, sáu ấn có biểu tượng, hiệu ứng nhiều lớp và âm thanh.

| Phím / nút | Kỹ năng | Công dụng trong màn |
|---|---|---|
| 1 | Phá Tinh | Lướt phá vách pha lê hồng, gây sát thương khi lướt |
| 2 | Thiên Thăng | Lao thẳng lên, tới bệ cao mà nhảy thường không tới |
| 3 | Tơ Nguyệt | Kéo tới móc vàng phía trên; ưu tiên phía đang nhìn, tường đặc chặn móc |
| 4 | Nguyệt Nhãn | Làm hiện cầu có va chạm và lối tới kho báu ẩn |
| 5 | Chuông Vọng | Rung trụ xanh để mở cửa cộng hưởng; gây choáng / sát thương trong chiến đấu |
| 6 | Thiên Giáng | Nhảy rồi giáng xuống, phá sàn nứt khi chạm và mở phòng kín |

Máy tính dùng **1–6** để thi triển trực tiếp, **F** dùng ấn đang chọn. Trên điện thoại chạm biểu tượng tương ứng, hoặc nút **ẤN** để dùng lại ấn đã chọn. Q / L / K cũ vẫn giữ. Ba màn mới cho dùng cả sáu ấn và nhảy hai lần ngay từ đầu.

- **04 · Tháp Gió:** leo từ chân tháp qua vách hồng, sân cao, móc vàng, cầu ẩn, chuông và phòng kín dưới sàn; Thủ Hộ ở tầng trời.
- **05 · Vườn Treo:** đường leo đổi hướng, cầu tinh tú di chuyển, kho báu sau tán mây và boss sói trên sàn cao.
- **06 · Đỉnh Nguyệt:** khám phá căn phòng bị phong ấn, vượt Thủ Hộ Nhật Thực rồi tiếp tục kéo lên cổng trên cùng, cao hơn 2.200 đơn vị so với điểm xuất phát.

Mỗi màn mới có **hai checkpoint trên cao**, một Di Vật trong phòng kín và một nhánh kho báu ẩn. Kho báu giúp sáu ấn hồi nhanh hơn. Tiến độ được thêm vào save v2 hiện có. Bắt đầu lại màn đã thắng sẽ mở lượt khám phá mới, giữ thưởng kho báu. Gói dữ liệu Web có URL theo commit để bản nâng cấp không bị lẫn với PCK cũ trong cache.

## Bản nâng cấp đường đi và tuyệt kỹ — V3

| Nội dung mới | Cách sử dụng |
|---|---|
| An · Nguyệt Trảm | **Q** / nút Q: chém diện rộng phía trước, mỗi mục tiêu chịu tối đa 3 sát thương trong một lượt chém |
| Kha · Tinh Bộ | **Q** / nút Q: dịch chuyển tối đa 155 đơn vị, dừng trước tường, bắn ba tia; có cửa sổ né ngắn |
| Bước Gió | Nhận tại **đền xanh trên bệ ở nửa đầu mỗi màn** bằng E. Thả rồi nhấn nhảy lần nữa giữa không trung; tiếp đất nạp lại |
| Di vật đường mới | E lấy rương ở cuối nhánh. Mỗi di vật giảm 0,6 giây hồi Q; từ 5 giây xuống 3,2 giây khi đủ ba |

Ba đường nhánh đều quay về tuyến checkpoint trước boss, không bắt buộc để hoàn thành nhiệm vụ chính:

- **Mái Tháp Chuông — Làng Trăng:** từ đền Bước Gió nhảy hai lần lên mái tháp; dùng Q cạnh ấn tím mở đường tới di vật.
- **Lối Tán Rừng — Rừng Vọng:** dùng Bước Gió lên bệ rêu đang di chuyển, canh vị trí rồi Q phá ấn và nhảy tới rương.
- **Hành Lang Tinh Tú — Hầm Bóng:** Q cạnh ấn tím gần đền để hiện hai bệ pha lê có va chạm, sau đó nhảy hai lần qua hành lang trên cao.

Mẹo lên đền: đi theo các bệ cũ tới ký ức ở nhánh cao, rồi nhảy sang bệ có đền xanh bên phải. Q của Kha dịch chuyển theo hướng đang nhìn; có thể dùng giữa không trung. Mở ấn trước khi nhảy qua khoảng trống. Bước Gió, ấn mở và di vật được lưu; không cần học lại khi đổi nhân vật.

| Màn | Nhiệm vụ và địa hình | Boss |
|---|---|---|
| Làng Trăng | Nhận nhiệm vụ từ Thợ Lưu Giữ; hai khu vực cầu đá, mảnh chuông trên bệ, bí mật trên cao | Vệ Binh Chuông Tàn: áp sát, lướt chém, chém gần; pha hai có đòn nối |
| Rừng Vọng | Đường bệ đá khác, sói / dơi, hai ấn rừng, nhánh leo tìm ký ức | Lang Vương Vọng Âm: vồ, né kiếm, tiếng tru bắn quạt; pha hai vồ nối tiếp |
| Hầm Bóng | Sảnh ngầm, golem / pháp sư, hai ấn ký ức, bí mật tầng cao | Kẻ Dệt Bóng: đổi vị trí trước báo đòn, bắn quạt, ấn bóng đánh đúng vùng đã báo |

Mỗi màn dài 1.920 đơn vị, có trụ checkpoint trước đấu trường. Thu hai mảnh ấn để mở cổng; Làng Trăng cần nói chuyện với Thợ Lưu Giữ. Checkpoint, mảnh ấn, bí mật và chiến thắng được lưu. Khi chết, boss hồi đầy máu, bỏ pha hai và xóa đạn; người chơi giữ mảnh ấn. Chọn lại một màn đã thắng sẽ bắt đầu lượt chơi lại từ đầu. Bí mật không cộng tim lần thứ hai. Save v2 tách khỏi save chiến dịch cũ.

| Thao tác | Bàn phím | Cảm ứng ngang |
|---|---|---|
| Di chuyển | A/D hoặc ←/→ | Joystick trái |
| Nhảy ngắn / cao | Chạm / giữ Space | Chạm / giữ NHẢY |
| Tấn công | J | ĐÁNH |
| Lướt, có thời gian né sát thương | K | LƯỚT |
| Kỹ năng | L | LỰC |
| Tương tác / đóng lời thoại | E | E |
| Chọn màn, đổi nhân vật | Esc hoặc MÀN CHƠI | MÀN CHƠI |
| Về checkpoint | R | Tự hồi sinh khi hết máu |

**An:** combo kiếm ba nhịp giữ nguyên hình động; L mở cửa sổ phản đòn 0,46 giây, chặn một đòn và phản công quanh người. Thành công giảm hồi chiêu xuống 2,2 giây, hụt cần chờ 6 giây. **Kha:** đạn sáng kiểm tra va chạm suốt quãng đường; L hồi một tim, gây xung lực gần và bắn một đạn mạnh. Kỹ năng có pose từ bộ hình gốc, VFX và âm thanh.

Boss có hướng / vùng báo đòn khóa trước khi đánh, khoảng hồi phục để phản công, né kiếm có hồi chiêu 4,8 giây và chuyển pha ở nửa máu. Một số động tác giữ pose gốc cộng chuyển động / VFX, chưa có bộ frame vẽ tay mới.

Mở `project.godot` trong Godot 4.4.1 và F5. Lệnh kiểm thử / xuất Web nằm trong [báo cáo QA](docs/VISUAL_QA_HANDOFF.md). Workflow kiểm tra sáu lượt chơi thật trước khi đưa export vào duy nhất `godot-play/` trên main. Các game khác không được đưa vào tập thay đổi.
