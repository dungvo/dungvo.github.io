# Cầu Thác · Bản chơi thử

Bản thử nằm tại `/apps/games/light-quest/waterfall/`. Serve repository bằng HTTP và mở trang này. Game dùng mô-đun JavaScript, SVG cho tia sáng và WebP cho cảnh. Bản V1 30 màn và World/Garden dùng các trang và khóa lưu riêng.

- Chọn An hoặc Kha, qua cầu tới đảo đá rồi dùng gương để chọn cửa.
- Đài Sao có hai vòng ký hiệu. Suối Rễ yêu cầu thắp Hạt Mầm trước khi thắp đèn suối.
- Hỏi Bà Miên để tìm Lối Cũ. An dùng Soi dấu, Kha có thể dùng đèn trong cảnh. Kha có thể dùng gương dã chiến để cấp tia cho Đài Sao.
- Khóa `light-quest.waterfall.v1` lưu lượt hiện tại và bộ sưu tập lối đã hoàn thành trên thiết bị. Hoàn tác hỗ trợ các thao tác trong phiên hiện tại.
- Bản thử minh họa ba lối đi bằng phòng ngắn. Nhân vật trong cảnh dùng ảnh đại diện di chuyển giữa điểm đứng. Các đoạn laser theo điểm đã thiết kế, dùng để thử đường đi và chưa mô phỏng quang học liên tục.

Thiết kế tổng hợp v0.3: https://chatgpt.com/library?file_id=libfile_699a990dac4c8191b23f1d549b76e9fb&account_id=personal

## Các màn mở rộng

Hoàn thành phòng đầu của Đài Sao, Suối Rễ hoặc Lối Cũ để mở chuỗi màn tương ứng. Bản đồ màn cho phép tiếp tục phòng đã mở. Tổng cộng có 12 câu đố dẫn tia mới gồm 4 Đài Sao, 4 Suối Rễ, 3 Lối Cũ và 1 màn Bình minh mở sau khi giải xong hai tuyến chính. Các phòng mới tái sử dụng bộ xử lý quang học và bộ vật thể SVG của World/Garden. Hồ sơ cũ mở phòng theo các lối đã hoàn thành. Bản lưu giữ cả các thao tác trong từng phòng, nên có thể hoàn tác sau khi tải lại.

## Bánh răng ở Đài Sao

Ba phòng T06–T08 mở tuần tự sau Ba dấu sao. Các lăng kính và gương mang
cùng chữ xoay khi chạm một vật trong nhóm. Vật mang nhiều chữ xoay tất cả
nhóm có ghi trên nó. Các vật xoay theo không kích hoạt dây chuyền sang nhóm
khác. Lời gợi ý và thao tác phát lại từ bản lưu dùng cùng luật này. Ba phòng
là thử thách bổ sung. Hai mạch bình minh vẫn mở sau T05 và R05.
