# Eclipse — báo cáo ba màn, 21/11/2026

## V5 — trau chuốt hiệu ứng sáu ấn

- Phá Tinh: lưỡi liềm thuôn, nét sáng ở lõi, bóng viền trên nền sáng, dải năng lượng bám đường lướt và mảnh tinh thể.
- Thiên Thăng: vòng xuất phát dẹt, cánh sáng cong và vệt kéo theo hướng bay lên.
- Tơ Nguyệt: ba sợi tơ đan chuyển động, điểm sáng chạy dọc dây và nút sáng tại móc neo.
- Nguyệt Nhãn: mắt mở, đồng tử tinh tú, cánh hoa / đường gân và các mảnh sóng dò bí mật.
- Chuông Vọng: hình chuông chạm khắc, lắc theo nhịp, ba đợt sóng cộng hưởng có độ trễ và hạt sáng.
- Thiên Giáng: mũi lao sáng trong lúc rơi; khi thực sự chạm sàn mới xuất hiện cánh chấn động, vết nứt và bụi sáng. Đánh trúng quái có điểm lóe gọn.
- Giữ nguyên sáu kỹ năng, cooldown, va chạm, damage, bản đồ, nhân vật và engine 4.4.1. Rút gọn nhãn ở hotbar để bớt che hiệu ứng. Menu xóa toàn bộ dấu vết đang phát.
- Không dùng hậu kỳ toàn màn hình, GPU light hay shader. Tối đa 10 sự kiện / 16 mẫu đường đi, giảm hạt và tần suất lấy mẫu trên cảm ứng, ngừng redraw khi idle. Đường vẽ chia thành các dải nhỏ để không lỗi triangulation khi nhân vật dừng hoặc đảo hướng.

Kiểm chứng V5: `art_vfx_test.gd` kiểm tra giới hạn bộ đệm, vòng đời, đường đi đảo hướng, cấu hình cảm ứng và reset; `capture_arts.gd` chụp 5 thời điểm của mỗi kỹ năng trong production scene với vật lý đang chạy (vị trí bắt đầu được dàn dựng). Các test va chạm / hành trình V4 và Web desktop / cảm ứng vẫn chạy trong CI trước khi export được phát hành. Ảnh và log nằm trong artifact `eclipse-chapter-qa` của workflow. Chưa có đo nhiệt / pin trên iPhone thật; hiệu ứng là hình vẽ Godot theo thời gian, chưa phải bộ frame vẽ tay như Silksong.

## V4 — sáu ấn và ba màn leo cao

- Sáu kỹ năng đặc biệt mới, dùng chung cho An / Kha và có tác dụng riêng với địa hình: Phá Tinh (vách nứt), Thiên Thăng (lao lên), Tơ Nguyệt (móc neo), Nguyệt Nhãn (cầu / kho báu ẩn), Chuông Vọng (cửa cộng hưởng / choáng), Thiên Giáng (phá sàn khi va chạm).
- Ba màn mới chọn được từ menu **04–06**; mặc định chọn Tháp Gió. Đường đi từ mặt đất lên tầng cao, hai trạm lưu trên đường, phòng kín dưới sàn, kho báu ở cánh bên, boss hai pha trên đỉnh và cổng kết thúc. Vườn Treo có cầu di động và đường đảo hướng; Đỉnh Nguyệt còn tầng sau boss. Không thay engine hoặc thay nhân vật.
- Tranh nền ba vùng mới được tạo theo phong cách Eclipse gốc và đưa vào source. HUD có sáu rune, phím 1–6, F / nút ẤN. VFX gồm lưỡi sáng, luồng lao lên, dây móc, vòng soi ẩn, sóng chuông và chấn động khi giáng xuống. Giữ giới hạn hạt / 30 FPS trên Web cảm ứng.

| Kiểm tra V4 | Kết quả / giới hạn |
|---|---|
| `sky_playthrough.gd` | An và Kha đi liên tục cả ba màn bằng controller / vật lý thật, không teleport, không sửa HP hoặc gọi sát thương trực tiếp. Dùng sáu ấn, hai checkpoint, phòng kín, kho báu, boss hai pha và cổng. Tháp Gió / Vườn Treo đạt khoảng 1.970 độ cao; Đỉnh Nguyệt khoảng 2.244. |
| `sky_arts_test.gd` | Kiểm tra xung lực, tường chặn móc, không mất hồi chiêu khi móc không có mục tiêu, cầu ẩn đổi va chạm, chuông chỉ mở khi đứng gần, sàn chỉ vỡ khi giáng chạm, lưu và khôi phục checkpoint trên cao. |
| Hồi quy | Sáu lượt chiến dịch cũ và sáu lượt nhánh V3 vẫn qua, cùng kiểm tra combat / save / va chạm cũ. Tổng 18 lượt di chuyển hoàn chỉnh, trong đó sáu lượt V4 có boss / cổng tầng trời. |
| Web | Chọn đủ sáu màn, Q, hotbar sáu ấn, bàn phím desktop và cảm ứng 3x DPR; bản Web thật của Godot. |
| Renderer | Chụp tầng giữa / đỉnh của ba vùng và sáu VFX trong scene production. Các ảnh là fixture dàn dựng; bằng chứng đi đường liên tục nằm trong test riêng. |
| Lỗi đã xử lý | Kéo móc đi lên qua bệ một chiều nhưng bị tường đặc chặn; thêm bệ trung chuyển; vị trí xuất hiện boss tính cả scale; không đánh thức boss khi còn ở nhánh thấp; giới hạn biên đấu trường để không rơi khỏi sàn lúc đánh; reset cooldown khi đổi màn; giải phóng body bệ di động đúng cách. |
| Triển khai | PCK có tên theo SHA commit (`sky-<sha>.pck`) để tránh dùng nhầm gói cũ khi cache; export chỉ đưa vào thư mục Eclipse `godot-play` trên main. |

Giới hạn: chưa có kiểm tra Safari / nhiệt / pin trên iPhone thật; một số động tác vẫn dùng pose gốc cộng VFX, chưa có bộ frame vẽ tay mới. Ba vùng leo cao cùng dùng cấu trúc sáu ấn, với đường đảo hướng / bệ di động / tầng cuối khác nhau; chưa phải chiến dịch dài bằng một game thương mại.

## Nâng cấp V3: tuyệt kỹ và đường nhánh

- Giữ nguyên Godot 4.4.1 và bộ hình gốc. Thêm Q cho An (Nguyệt Trảm, chém quét) và Kha (Tinh Bộ, sweep capsule trước khi dịch chuyển / ba đạn). Có VFX, âm thanh, pose từ bộ animation hiện tại và nút Q cảm ứng.
- Mỗi chương có đền học Bước Gió (nhảy hai lần), một đường nhánh và di vật giảm hồi Q. Làng Trăng có mái tháp / ấn chắn; Rừng Vọng có bệ di động `AnimatableBody2D`; Hầm Bóng có bệ tinh tú đổi từ không va chạm sang có va chạm khi Q mở ấn.
- Save v2 cũ vẫn dùng được; trường mới thiếu sẽ lấy mặc định. Lưu Bước Gió, ấn đã mở và di vật của từng chương. Cổng nhiệm vụ được kéo cao để không thể dùng kỹ năng mới vượt qua khi chưa đủ mảnh ấn.

| Kiểm tra V3 | Bằng chứng |
|---|---|
| Sáu lượt đi nhánh mới | `routes_playthrough.gd`: An / Kha qua ba nhánh bằng controller thật; không teleport hay sửa HP; nhảy đến đền, học Bước Gió, mở ấn bằng Q, lấy di vật và quay lại checkpoint |
| Bệ di động | Đứng yên trên bệ và kiểm tra nhân vật được bệ chở, không chỉ tự đuổi theo bệ |
| Tuyệt kỹ | `abilities_test.gd`: An đánh mỗi actor một lần, tường chắn đòn; Kha sweep toàn capsule và không vượt cổng ở độ cao cũ; ba đạn và hồi chiêu hoạt động |
| Cầu tinh tú | Chưa mở ấn: layer va chạm bằng 0. Mở bằng Q: chuyển sang WORLD, rồi kiểm tra đường nhảy thật |
| Lưu tiến độ | Khôi phục quyền nhảy lần hai, ấn mở và di vật từ save v2 |
| Web | Cả desktop và ba ngón cảm ứng vẫn chạy; kiểm tra thêm kích hoạt Q bằng bàn phím / nút cảm ứng ở cả ba chương |
| Đường chính | Sáu lượt An / Kha của chiến dịch cũ vẫn hoàn thành |
| Hình ảnh | Native capture bổ sung ba cảnh đường nhánh và ba cảnh tuyệt kỹ; cảnh dàn dựng được tách khỏi kiểm thử đường đi liên tục |

Q hồi 5 giây, mỗi di vật giảm 0,6 giây (đủ ba còn 3,2 giây). Tinh Bộ dừng ở vật cản; người chơi vẫn cần canh nhảy khi dịch chuyển tới bệ cao hơn. Chưa có frame vẽ tay mới hoặc kiểm tra nhiệt trên iPhone thật.

## Phạm vi phát hành

- Source: `feature/eclipse-godot-room-select-v1`, PR #85; Godot **4.4.1.stable.official.49a5bc7b6**.
- Web: https://dungvo.github.io/apps/games/light-quest/eclipse/godot-play/
- Giữ nguyên tất cả ảnh / sprite và animation đã có; bổ sung director màn, boss state machine, tương tác và VFX trong Godot. Không có runtime HTML Canvas tự viết.
- Ba chương có địa hình hai khu vực, hai mảnh ấn, bí mật tăng tim một lần, checkpoint và boss riêng. Cổng ngăn vào boss trước nhiệm vụ. Có chuyển màn, chọn lại nhân vật, chơi lại, thắng và trở lại khám phá.

## Kiểm thử thực hiện

| Kiểm tra | Phạm vi và kết quả |
|---|---|
| Import / parse | Godot 4.4.1, không lỗi script / resource |
| Sáu lượt chơi hoàn chỉnh | An và Kha đi cả ba màn bằng controller và vật lý thật: nhận nhiệm vụ, nhảy lấy hai ấn, leo lấy bí mật, checkpoint, đánh boss chuyển pha, chiến thắng, quay về khám phá |
| Tính trung thực của lượt chơi | Không teleport người chơi; không sửa HP, tắt AI, tăng bất tử hoặc gọi `take_hit` trực tiếp trong `campaign_playthrough.gd` |
| Va chạm | Kiếm chỉ đánh phía trước; tường chặn kiếm và đạn; ray quét chặn đạn tốc độ 8.500 đơn vị/giây, không xuyên hurtbox |
| Kỹ năng | An phản đòn trong cửa sổ thời gian; Kha hồi máu / xung lực có cooldown; dash có vận tốc thật |
| Boss | Di chuyển; né khi thấy chuẩn bị kiếm; không hủy khoảng hồi phục để né; không đổi hướng đòn sau báo trước; cả sáu lượt đến pha hai và thắng |
| Hồi sinh / save | Đưa về checkpoint, reset HP / pha boss, xóa đạn; bí mật không nhân đôi, mảnh ấn và checkpoint được khôi phục từ file save v2 |
| Input | Chạm ba ngón: đi + nhảy + đánh, thả ngón xóa input; giữ nhảy cao hơn chạm ngắn; menu dừng combat |
| Godot Web thực tế | Tải HTML, WASM và PCK; chọn đúng cả ba màn, có An / Kha; bàn phím desktop và ba ngón cảm ứng mô phỏng; không lỗi runtime |
| Kích thước / tải vẽ | Viewport nội bộ 960×540; desktop cap 60, cảm ứng 812×375 ở DPR 3 cap 30; giữ vật lý 60 Hz |

Đo cục bộ bằng Chromium và bộ dựng hình phần mềm: khoảng 34–36 FPS desktop và 25–26 FPS cảm ứng mô phỏng, tùy lượt chạy. Đây **không phải** kết quả đo trên iPhone thật. Mỗi lần CI lưu log, ảnh Web và sáu ảnh boss từ renderer Godot dưới artifact `eclipse-chapter-qa`. Ảnh boss trong `capture_visual.gd` là cảnh dàn dựng bằng production scene; bằng chứng chơi liên tục nằm riêng trong sáu lượt kiểm thử.

## Lỗi đã sửa khi kiểm thử

- NPC chiếm nút tương tác khi đang nhảy lấy mảnh ấn gần đó.
- Bệ cũ và trần thấp chặn đường tới mảnh ấn / bí mật: chỉnh đúng nền một chiều, kiểm tra lại đường nhảy thật.
- Callback chiến thắng chờ lâu hơn thời gian tồn tại của boss: dùng ID lượt chơi để bảng thắng vẫn xuất hiện, không bật lạc sang lượt khác.
- Các mảnh ấn trước checkpoint bị mất khi nạp lại: lưu riêng tiến độ từng chương.
- Các vật thể trang trí / boss / đạn của lượt cũ không được giữ lại khi đổi màn.
- Thanh HP boss dùng ProgressBar thật, không dựa vào ký tự khối có thể thiếu font.

## Cách chạy lại

```sh
godot --version # phải là 4.4.1
godot --headless --editor --import --quit
godot --headless --fixed-fps 60 --script res://tests/smoke.gd
godot --headless --script res://tests/hit_geometry_test.gd
godot --headless --fixed-fps 60 --script res://tests/campaign_playthrough.gd
godot --headless --fixed-fps 60 --script res://tests/abilities_test.gd
godot --headless --fixed-fps 60 --script res://tests/routes_playthrough.gd
godot --headless --fixed-fps 60 --script res://tests/sky_arts_test.gd
godot --headless --fixed-fps 60 --script res://tests/sky_playthrough.gd
mkdir -p build/web
godot --headless --export-release Web build/web/index.html
# Cần playwright; script tự phục vụ build/web qua HTTP.
ECLIPSE_CHROME=/path/to/chrome node tests/browser_smoke.cjs
# Cần màn hình đồ họa; trên Linux CI dùng xvfb-run.
godot --script res://tests/capture_visual.gd
```

## Giới hạn còn lại

- Chưa kiểm tra Safari / iPhone 13 mini thật: chưa kết luận nhiệt máy, pin, tai thỏ và cảm giác ngón cái khi chơi lâu. Profile 30 FPS chỉ là biện pháp giảm tải.
- Đây là ba chương demo ngắn, không phải chiến dịch dài; địa hình và cảnh nền còn tái sử dụng asset gốc. Một số đòn vẫn dùng một pose có VFX, chưa có chuỗi frame vẽ tay mới.
- AI là state machine phản ứng với khoảng cách, chuẩn bị đòn và trạng thái người chơi; chưa có học hành vi dài hạn hoặc tìm đường phức tạp.
- Save nằm trên trình duyệt / thiết bị, chưa đồng bộ tài khoản; chế độ riêng tư hoặc xóa dữ liệu trình duyệt có thể mất tiến độ.
- Cần người chơi đánh giá tiếp độ khó, nhịp phản đòn và cảm giác chiến đấu; kiểm thử tự động không thay thế được đánh giá đó.

## Triển khai và bảo toàn repository

Workflow chỉ publish sau import, mechanics, sáu lượt chơi, browser QA và native captures thành công. Tập export đưa lên main bị giới hạn vào `apps/games/light-quest/eclipse/godot-play/`, có `build-info.json` ghi source SHA / engine / SHA-256 của từng asset. Không thay Eclipse cũ ở URL gốc, `duel-demo`, Puzzle Adventure, Classic, English hoặc Selflo.
