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
