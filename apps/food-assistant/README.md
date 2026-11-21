# Food Assistant

[Mở Food Assistant](https://dungvo.github.io/apps/food-assistant/) · [Mở màn bếp](https://dungvo.github.io/apps/food-assistant/#bep)

Ứng dụng cho quán ăn nhỏ gồm sơ đồ bàn, gọi món tiếng Việt, màn bếp, thu tiền và lịch sử. Bản web dùng được trên một thiết bị ngay sau khi mở. Muốn điện thoại gọi món và tablet nhận đơn cùng lúc, kết nối hai máy với cùng API của quán.

## Dùng thử trên điện thoại

1. Mở ứng dụng trong Safari hoặc Chrome. Chọn **Bàn 03** và chạm món, hoặc bấm micro, cấp quyền và nói **Bàn 3 hai phở tái một bò kho**. **Nhập lệnh** cũng nhận cùng câu khi micro gặp lỗi.
2. Kiểm tra món, số lượng và ghi chú rồi bấm **Gửi bếp**. Nói **Bàn 3 thêm hai trà đá** để tạo lượt tiếp theo. Lặp nguyên câu đầu sẽ hiện yêu cầu xác nhận gọi thêm.
3. Đến **Màn bếp** và lần lượt bấm **Bắt đầu nấu**, **Đánh dấu sẵn sàng**, **Đã phục vụ**. Bếp có thể hỏi **Bếp còn bao nhiêu tô?** hoặc **Món nào cần nấu trước?**
4. Nói **Bàn 3 tính tiền** hoặc bấm **Tính tiền** trong đơn. Xem tổng **185.000 ₫**, chọn phương thức và xác nhận đã thu. Bàn đóng sau khi tất cả món còn hiệu lực đã được phục vụ. Hóa đơn nằm ở tab **Hóa đơn**.

Ví dụ khác

| Nhu cầu | Câu nói |
| --- | --- |
| Chọn bàn | Bàn ba |
| Ghi chú | Bàn 3 một phở tái không hành |
| Sửa lời nói trong cùng câu | Bàn 3 hai phở tái, à không ba |
| Hủy một phần đang chờ nấu | Bàn 3 hủy một phở tái |
| Đổi phần đang chờ nấu | Bàn 3 đổi một tái thành nạm |
| Xem món chưa phục vụ | Bàn 3 còn món gì chưa ra? |

Khi có nhiều dòng cùng món, dùng **Sửa** trên đúng dòng trong đơn bàn. Có thể hoàn tác lượt gọi vừa gửi khi các dòng đó còn nguyên và bếp chưa bắt đầu. Nếu bàn đang chờ thu tiền, mở lại bàn trước khi gọi hoặc sửa món.

## Số bàn, thực đơn và dữ liệu

- Vào **Cài đặt → Số bàn** để chọn từ 1 đến 60. Các bàn vượt số mới phải đóng trước khi giảm.
- Vào **Thực đơn và giá** để thêm hoặc sửa tên, giá theo đồng, nhóm món, ảnh và biệt danh phân cách bằng dấu phẩy. Bỏ **Đang bán** khi hết món. Đơn đã gửi giữ giá lúc nhận.
- Vào **Sao lưu và khôi phục → Tải bản sao** để tải JSON. Sao lưu định kỳ trước khi dọn dữ liệu trình duyệt hoặc đổi thiết bị. Chế độ cục bộ cho phép thay dữ liệu hiện tại bằng bản sao sau một bước xác nhận.
- Muốn mở nhanh ứng dụng, dùng **Thêm vào màn hình chính** từ trình duyệt. Sau khi trang và tài nguyên đã được tải lần đầu, có thể mở lại và dùng thao tác chạm hoặc gõ câu khi mất mạng. Micro phụ thuộc trình duyệt, quyền truy cập và dịch vụ nhận diện của thiết bị.
- Trên thiết bị đã kết nối API, lệnh chờ gửi được lưu qua lần tải lại. Khi có xung đột, vào **Cài đặt → Kết nối thiết bị** để xem lỗi, xác nhận nếu là lượt trùng thật hoặc bỏ lệnh và nhập lại. Kiểm tra biểu tượng đồng bộ trước khi chủ động báo bếp.

## Dùng nhiều thiết bị và bật AI

Hai máy có thể dùng cùng mạng Wi-Fi, với API chạy trên máy quán và có địa chỉ HTTPS mà cả hai truy cập được. Cũng có thể dùng backend riêng qua Internet. Máy bếp mở tab **Màn bếp** trong suốt ca làm việc. Kết nối cần địa chỉ API và mã kết nối quán. Có thể nhập bản sao cục bộ vào SQLite của máy quán trước khi ghép thiết bị.

Trên máy chạy API, cần Node.js từ 22.13 hoặc 24 LTS. Đặt các biến trong cấu hình dịch vụ hoặc trình quản lý bí mật của máy chủ.

| Biến | Công dụng |
| --- | --- |
| `FOOD_TOKEN` | Mã chia sẻ với thiết bị của quán. Dùng chuỗi ngẫu nhiên từ 24 ký tự trở lên. Có thể tạo bằng `openssl rand -hex 32`. |
| `FOOD_DB` | Đường dẫn SQLite, đặt trên ổ đĩa bền vững. Mặc định là `food-assistant.sqlite` ở thư mục chạy. |
| `HOST`, `PORT` | Mặc định `127.0.0.1:8787`, dùng reverse proxy HTTPS trước máy chủ khi truy cập từ thiết bị khác. |
| `FOOD_ORIGINS` | Danh sách origin phân cách bằng dấu phẩy. Mặc định là `https://dungvo.github.io`. |
| `OPENAI_API_KEY` | Tùy chọn, bí mật ở backend. Khi để trống, app vẫn xử lý được các câu thông thường bằng quy tắc. |
| `OPENAI_MODEL` | Tùy chọn, mặc định `gpt-4.1-mini`. Model phải hỗ trợ Structured Outputs. |

Chạy từ thư mục `apps/food-assistant`.

```sh
npm start
```

Cấu hình reverse proxy TLS để chuyển tiếp đường dẫn `/api/` tới `127.0.0.1:8787`. Nếu muốn tự phục vụ app ở cùng địa chỉ, chuyển tiếp `/` luôn. Dùng đường dẫn có dấu gạch chéo cuối cho app. Trên từng thiết bị chọn **Cài đặt → Kết nối thiết bị**, nhập địa chỉ HTTPS và mã quán. Mỗi máy bật lựa chọn gửi câu chưa hiểu tới AI nếu muốn dùng fallback. Muốn đổi lựa chọn sau khi kết nối, ngắt rồi kết nối lại.

Khóa OpenAI nằm ở server. Chỉ câu mà bộ quy tắc yêu cầu làm rõ mới có thể được gửi cùng thực đơn, bàn đang chọn và các món chưa phục vụ của bàn đó. Âm thanh do dịch vụ nhận diện của trình duyệt xử lý. Kết quả AI là bản nháp phải qua kiểm tra schema, nghiệp vụ và xác nhận trên màn hình. Bật AI có thể phát sinh phí API theo mức sử dụng.

Để sao lưu SQLite, xuất snapshot dưới đây. Khi khôi phục, ngừng API, hoàn tất đồng bộ và ngắt các thiết bị đang kết nối trước, rồi chạy khôi phục và ghép nối lại. Sao lưu dữ liệu hiện tại trước khi thay thế.

```sh
node server/api.mjs backup > ban-sao.json
node server/api.mjs restore ban-sao.json
```

Chi tiết kỹ thuật và kết quả QA nằm trong [TECHNICAL.md](TECHNICAL.md).
