# Eclipse — lộ trình từ mockup tới bản chơi

[Thư viện mockup chuẩn](https://github.com/dungvo/dungvo.github.io/tree/main/apps/games/light-quest/eclipse/design/mockups) gồm tiệm Bà Lam, Bờ Đá, menu tạm dừng, bản đồ, trang bị, ba nhân vật và ba thời đại. Hoàn thiện các vùng hiện có trước khi mở thêm chương hoặc vùng ngoài cốt truyện đã chốt.

Bản V11.1 đã có Bờ Đá ngoài trời, đường xuống hầm, ba thời đại và tám vũ khí. Các phần chênh lớn so với mockup là chi tiết quầy rèn, bản đồ theo phòng của toàn chiến dịch, nhân vật Linh, sprite/animation riêng của NPC và thú, khả năng truyền lõi và menu thống nhất.

| Đợt | Làm gì trong game | Bằng chứng nghiệm thu |
|---|---|---|
| 1 · Tiệm Bà Lam | Chân dung và nền lò, thẻ đồ bằng hình, giá và trạng thái sở hữu, món đang chọn, so sánh với vũ khí đang mang, vùng thử chiêu và nút mua/trang bị/truyền lõi. Dùng Thương Tơ và Tơ Kép làm chuẩn đầu tiên. | Chụp mockup và Godot ở 960×540 để đối chiếu ba cột và thao tác. Mua một lần, thiếu lõi không trừ đồ, nâng cấp được lưu. Thử cả cú móc thứ hai ngoài tiệm. |
| 2 · Bản đồ thật | Lập danh mục phòng song song với địa hình của bảy vùng hiện có. Nối cửa hai chiều theo tọa độ và tầng. Hiện chấm người chơi, cửa khóa, neo, lớp thời đại, Bờ Đá và Hầm Dẫn Nước. Mở rộng theo cụm phòng của thiết kế (~28), gồm sân, vách biển và đường rừng. | Mỗi cửa trên bản đồ dùng được hoặc ghi rõ lý do khóa. Đi cả hai chiều, xuống hầm an toàn, nạp lại tiến độ. Kiểm tra bản đồ lớn và minimap bằng cả chuột lẫn cảm ứng. |
| 3 · Menu, trang bị và kỹ năng | Đồng bộ màn vào game, pause, các tab Bản đồ/Trang bị/Kỹ năng/Nhật ký, thanh sinh lực và năng lượng. Hoàn thiện hiệu ứng và nhánh nâng cấp cho từng vũ khí theo danh mục mẫu. | Ba tác vụ vào game, thay đồ và gán chiêu xong được bằng nút chạm. Số liệu trong menu lấy từ hành vi thật. So khung thi triển, va chạm và hồi chiêu với bản chơi. |
| 4 · An, Kha, Linh và thú | Sprite, pose và animation thật cho ba bộ nhân vật, NPC và thú. Linh có cung và dây móc. Cáo có dấu đường, Bướm soi bệ ẩn, Quạ ngắt đòn, Hươu hồi máu. | Mỗi hình ảnh có sprite phù hợp nhìn ngang và trạng thái đi, ngồi, nhảy, đánh, trúng đòn. Cả ba nhân vật vượt tuyến chính. Từng thú tạo tác động quan sát được. |
| 5 · Cốt truyện và hoàn thiện | Gắn bảy chương, nhiệm vụ phụ, giọng nói NPC, phần thưởng và kết cảnh vào đường đi thật. So sánh Cầu Đồng ở ba thời đại, giữ đường vòng dưới cầu khi chưa sửa. | Chơi từ đầu đến hết bằng các lựa chọn khác nhau, lưu và tiếp tục giữa chương. Đối chiếu hình ảnh runtime của từng màn chính với mockup. Kiểm tra Safari iPhone thật trước khi kết luận về trải nghiệm thiết bị. |

## Trình tự trong mỗi đợt

1. Chốt ảnh tham chiếu và hành vi nhìn thấy được trong gameplay.
2. Dựng thành phần thật trong Godot, nối với dữ liệu đang dùng và giữ bản lưu cũ.
3. Chụp lại cùng tỷ lệ, ghi rõ điểm khớp và điểm lệch. Chỉnh điểm lệch trong phạm vi đợt.
4. Chạy kiểm thử cơ chế, xuất bản Web, xác nhận đúng gói trên GitHub Pages nếu bản đạt kiểm thử. Ghi riêng những gì mới được kiểm tra trên trình duyệt mô phỏng và những gì đã thử trên thiết bị thật.

## Lát triển khai đầu tiên

Tơ Kép dùng bốn Lõi nguyệt, tách khỏi mảnh đồng. Lõi đến từ cứu Tín, hạ Thủ Vệ Đá và đến hai điểm nghỉ qua cầu ở Hiện tại và Tương lai. Truyền tại Bà Lam khi đã sở hữu Thương Tơ. Sau cú móc đầu, bấm lại nút vũ khí trong khung sáng để nối sang một neo khác trong tầm. Hai neo thử ở bờ Hải Đăng thuộc tuyến hiện có. Khung trong quầy có nút xem trước Tơ Kép để người chơi biết nhận được gì trước khi tiêu lõi.

### Đối chiếu đợt 1

Bố cục quầy trong game đã có ba cột như mẫu. Chân dung Bà Lam, sáu thẻ một trang, viền món được chọn, giá, chênh lệch tầm chiêu, nút xem trước và vùng thao tác đều hiện tại 960×540. Sau ảnh chụp thứ nhất, tách nền tiệm khỏi HUD đang chơi và đặt ba thao tác cạnh nhau.

Bản kiểm thử tạo các ảnh `v12-forge-preview.png` và `v12-forge-twin-tether.png` từ renderer Godot. Chúng nằm trong artifact `eclipse-chapter-qa` của lượt kiểm thử phát hành. Độ hoàn thiện khung họa tiết và diễn xuất nhân vật còn giản lược so với tranh mẫu. Đợt này triển khai nâng cấp thực tế cho Thương Tơ. Các nhánh của đồ khác nằm ở đợt 3.

## Đợt 2 · Bản đồ Nguyệt Thực V13

Minimap góc trên phải dùng cùng dữ liệu với bản đồ toàn màn hình. Nhấn M hoặc chạm minimap để mở. Bản đồ tạm dừng gameplay, có chọn vùng, tìm lại vị trí, phóng và kéo. Toàn cảnh lập sơ đồ 28 khu theo địa hình và đường nối đang chơi được của bảy vùng. Các nhóm ở tầng khác nhau, cửa bị chặn, trụ nghỉ, móc dây, vị trí người chơi và vùng chưa ghé có ký hiệu riêng. Bản lưu cũ tiếp tục dùng được, các khu đã ghé được ghi kể từ V13.

Thẻ Bờ Đá & Hải Đăng có ba lớp thời đại. Tiệm Bà Lam chỉ hiện ở Quá khứ. Tương lai có đường qua chân Cầu Đồng nếu cầu chưa gia cố. Người chơi vẫn dùng Cỗ Máy để đổi thời đại. Bản đồ có dịch chuyển hai chiều từ Cỗ Máy tới Đài Canh sau khi đã kích hoạt trụ nghỉ của chính thời đại đó. Đường xuống Hầm Dẫn Nước và các đường nối chương tiếp tục dùng địa hình, cửa và tương tác trong game.

Bản đồ trong mockup dùng nhiều phòng có hình bất quy tắc và minh họa riêng theo vùng. V13 có 28 khu lập sơ đồ trên địa hình hiện có, gồm cả những đoạn hành lang và tầng leo. Các ảnh `v13-atlas-world.png`, `v13-atlas-village.png`, `v13-atlas-future.png` và `v13-minimap.png` chụp từ Godot ở 960×540. Sau khi xem ảnh chụp đầu, tăng độ đậm đường và nét viền của minimap, đưa chỉ số kỹ năng xuống dưới nút Kho và chuyển dấu neo xuống dưới tên khu. Tuyến Hải Đăng theo thời gian vẫn vào từ màn mở đầu. Sơ đồ toàn cảnh và đường đi giữa bảy chương đã có trong Vào Truyện.

Kiểm thử hồi quy chạy cùng các trận boss và tuyến leo có sẵn. Kiểm thử mới xác nhận sáu cổng nối chương đi được cả hai chiều khi đủ điều kiện, tầng Vườn Treo đảo chiều, Hầm Dẫn Nước đúng độ sâu, lối Cầu Đồng đổi theo trạng thái sửa cầu, dịch chuyển hai chiều đúng điểm nghỉ, lưu cờ bản đồ và thao tác trên Godot Web bằng chuột, bàn phím và cảm ứng mô phỏng.

## Đợt 3 · Kho Ánh Trăng V14

I hoặc nút Kho mở menu chung của hành trình và Bờ Đá. Các tab Bản đồ, Trang bị, Kỹ năng và Nhật ký mở qua lại trong lúc game tạm dừng. Chọn thẻ vũ khí để xem trước, rồi bấm Trang bị để đổi. Hành trình so sánh tầm kiếm hoặc tốc độ đạn, sát thương và thời gian hồi tính từ thông số dùng trong trận. Bờ Đá có tám vũ khí, màn diễn thử chiêu V và số lõi đang giữ. Truyền lõi mở Tơ Kép vẫn được thực hiện tại tiệm Bà Lam. Sáu ấn có biểu tượng, cách dùng và nút gán F / ẤN. Nhật ký đọc tiến độ nhiệm vụ và vị trí hiện tại.

Ảnh Godot 960×540 gồm `v14-armory.png`, `v14-runes.png` và `v14-journal.png`. Bố cục bám ba cột của mẫu trang bị, dùng sprite An/Kha trong bản chơi. Phần chân dung minh họa riêng, hệ giáp/phụ kiện, nhánh truyền lõi cho các vũ khí còn lại và nâng cấp hiệu ứng chiến đấu nằm ở các lượt tiếp theo.

## V15 · Hành trình liền mạch

Từ menu có tranh nền, chọn An hoặc Kha rồi chọn **Đi cảnh** để bắt đầu tại Làng Trăng. Khi đã chơi, **Tiếp tục** mở lại vùng lưu gần nhất. Đường chính qua Làng Trăng, Rừng Vọng, Hầm Bóng, Tháp Gió, Vườn Treo, Đỉnh Nguyệt, Đường Chân Trời rồi kết ở Sân Hải Đăng. Các cửa mỗi vùng nằm trong địa hình, mở theo tiến độ và dùng E khi đứng gần. Cổng ngược cho phép quay lại vùng đã đi qua. Thắp đèn sau trận cuối tạo luồng sáng trong cảnh và ghi mốc hoàn thành.

Bản đồ chính mở tại vùng hiện tại, bổ sung những khu vừa đặt chân tới. Chọn Toàn cảnh để xem nối kết đã khám phá. Chế độ Luyện tập có bộ chọn màn riêng. Kết quả luyện tập không ghi đè hành trình. Cỗ Máy mở tuyến phụ Bờ Đá và giữ dữ liệu vũ khí, lõi và thời đại đã có.

Bài kiểm tra `continuous_journey_test.gd` dùng điều khiển Godot, va chạm và đòn đánh để qua đủ bảy vùng trong một lượt với Kha, từ menu tới lúc thắp Hải Đăng. Dùng ảnh Godot 960×540 để kiểm tra menu, màn vào Làng Trăng, bản đồ đang khám phá và Hải Đăng đã sáng.

## V16 · Nền, chuyển động và bản đồ

Mép trên của tranh nền đi cùng tọa độ với hình va chạm ở cả nền thường và bệ động. Tư thế chân An/Kha dùng cùng mốc trong menu, kho và lúc chơi. Bệ Rừng Vọng lấy hình từ góc trái của thân va chạm sau mỗi lần dịch chuyển.

Nội suy giữa các bước vật lý giúp giảm giật hình khi máy có nhịp dựng khác nhịp mô phỏng. Camera nhìn trước nhẹ theo hướng chạy và đặt lại khi sang cổng, hồi sinh hoặc dịch chuyển để tránh kéo khung hình từ điểm cũ. Cảnh ngoài bờ biển đổi vào hang bằng một đoạn mờ chồng ngắn.

Bản đồ vùng đang chơi thu thập mép trên của các nền có va chạm thực. Nền đã biến mất hay chưa được kích hoạt sẽ không hiện lên sơ đồ phòng. Các vùng chưa khám phá vẫn mở dần theo tiến độ. Kiểm tra `ground_contact_test.gd` đo mép vẽ và thân va chạm, trong đó có bệ Rừng Vọng đang chuyển động.

## V17 · Cảm ứng và tiếp đất

Bộ nút cảm ứng dùng biểu tượng vẽ trực tiếp để chừa thêm chỗ nhìn nhân vật. Vòng nhỏ biểu thị thời gian hồi lướt, kỹ năng nhân vật, tuyệt kỹ và ấn đang gán. Vị trí chạm vẫn dùng các nút độc lập để có thể di chuyển, đánh và nhảy cùng lúc.

Joystick lấy vị trí chạm làm tâm điều khiển, nên chạm sát mép vẫn bắt đầu ở trạng thái đứng yên. Nút ngồi ở Bờ Đá không giữ mất ngón điều khiển di chuyển. Lúc đáp đất, dáng nhân vật nén nhẹ quanh vị trí bàn chân, hình va chạm giữ nguyên.

## V18 · Địa đồ và chuyển động chiến đấu

Địa đồ mở toàn cảnh 28 khu của bảy vùng. Tranh khắc có làng, tán cây, vòm hầm, tháp và bờ biển. Các đường viền mờ biểu thị phần chưa khảo sát. Chọn một vùng đã tới để xem phòng, mặt bệ va chạm và điểm neo. Bờ Đá giữ bản đồ riêng theo thời đại.

Làng Trăng có tranh nền riêng. Màn chọn, kho và thanh máu dùng chân dung từ ảnh duyệt của An và Kha. Chạm chân dung trong HUD để mở kho. Bốn thú ở Cỗ Máy hoặc tiệm Bà Lam có tranh riêng. Cáo chỉ kho đồng chưa mở trong thời đại đang chơi, Bướm Đèn soi đường dưới cầu, Quạ tấn công quái trong tầm nhìn và Hươu hồi một máu sau mười giây an toàn.

Bốn dải hình trong combat-ink.webp chạy ở tọa độ thế giới. An vung một lưỡi trăng theo hướng đánh. Sát thương đã xác nhận tạo sao vàng và quái nghiêng người. Đòn kết liễu làm sprite tan thành hạt tím. Khi nhảy và tiếp đất, gió bung ra ở điểm chạm đất. Kiểm tra bằng capture_combat_ink.gd với va chạm, máu quái và vận tốc nhảy của cảnh thật.

Bản đồ gồm 28 khu của hành trình hiện có. Linh, hệ giáp và các nhánh truyền lõi còn lại thuộc thiết kế chưa hoàn thiện. Số tư thế hoạt họa của nhân vật và quái vẫn thấp hơn tranh mẫu.

## V19 · Tiếng chuông gọi ghe về

Chọn **Đi cảnh** ở lượt đầu để mở sổ tay sáu ấn. Mỗi thẻ cho thấy một tình huống chơi, mục tiêu và thao tác. Người chơi đã có tiến trình có thể mở lại từ menu. Trong kho, thẻ kỹ năng dùng cùng tranh với sổ tay. Khi thi triển, các ấn có hình và chuyển động riêng gắn với người, móc hoặc điểm va chạm.

Thợ Lưu Giữ kể về ghe của Tín. Đi thẳng qua khe đầu tiên ở Đường Chân Trời sẽ rơi xuống Hầm Chuông Triều. Nhặt lưỡi đồng bằng E, tới chuông và dùng ấn 5. Bậc đá mới dẫn lên mặt biển và kết truyện ở hải đăng thay đổi. Bậc bên trái luôn mở. Có thể thử riêng ở Luyện tập → Đường Chân Trời.

Địa đồ có 29 khu trong bảy chương. Địa hình tĩnh được ghi theo phòng và thời đại khi khảo sát. Với dữ liệu V18, ghé lại phòng cũ để bổ sung nét địa hình vào bản lưu.
