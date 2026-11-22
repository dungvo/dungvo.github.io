# Food Assistant

[Mở Food Assistant](https://dungvo.github.io/apps/food-assistant/) · [Mở màn bếp](https://dungvo.github.io/apps/food-assistant/#bep)

[Chạy demo, dùng Wi-Fi ở quán, hoặc triển khai AWS](DEPLOY.md)

Ứng dụng cho quán ăn nhỏ gồm sơ đồ bàn, gọi món tiếng Việt, màn bếp, thu tiền và lịch sử. Bản web dùng được trên một thiết bị ngay sau khi mở. Muốn điện thoại gọi món và tablet nhận đơn cùng lúc, kết nối hai máy với cùng API của quán.

## Dùng thử trên điện thoại

1. Mở ứng dụng trong Safari hoặc Chrome. Chọn **Bàn 03** và chạm món, hoặc bấm micro, cấp quyền và nói **Bàn 3 hai phở tái một bò kho**. **Nhập lệnh** cũng nhận cùng câu khi micro gặp lỗi.
2. Micro tự lưu câu rõ khi anh/chị nói xong rồi mở đơn của bàn. Nếu quên số bàn, bấm micro lần nữa và nói số bàn. Với chế độ nhập lệnh, bấm **Lưu câu gọi**. App tách món, số lượng và ghi chú theo thứ tự đọc. Nói **Bàn 3 thêm hai trà đá** để tạo lượt tiếp theo. Câu giống hệt lượt trước sẽ được kiểm tra trùng trước khi gửi thêm.
3. Đến **Màn bếp** và lần lượt bấm **Bắt đầu nấu**, **Đánh dấu sẵn sàng**, **Đã phục vụ**. Bếp có thể hỏi **Bếp còn bao nhiêu tô?** hoặc **Món nào cần nấu trước?**
4. Nói **Bàn 3 tính tiền** hoặc bấm **Tính tiền** trong đơn. Xem tổng **185.000 ₫**, chọn phương thức và xác nhận đã thu. Bàn đóng sau khi tất cả món còn hiệu lực đã được phục vụ. Hóa đơn nằm ở tab **Hóa đơn**.

Ví dụ khác

| Nhu cầu | Câu nói |
| --- | --- |
| Nhiều món và tự sửa câu | Bàn 5 hai phở bò, một tái một chín. Tô chín không hành. Hai trà đá, à một thôi. |
| Ghi chú cho một trong hai tô | Bàn 5 thêm hai phở tái, một tô không hành |
| Sửa số lượng trên một dòng đang chờ | Bàn 3 sửa trà đá còn ba ly |
| Sửa ghi chú trên một dòng đang chờ | Bàn 3 sửa phở tái không hành |
| Chọn bàn | Bàn ba |
| Ghi chú | Bàn 3 một phở tái không hành |
| Sửa lời nói trong cùng câu | Bàn 3 hai phở tái, à không ba |
| Hủy một phần đang chờ nấu | Bàn 3 hủy một phở tái |
| Đổi phần đang chờ nấu | Bàn 3 đổi một tái thành nạm |
| Xem món chưa phục vụ | Bàn 3 còn món gì chưa ra? |

Khi có nhiều dòng cùng món, dùng **Sửa** trên đúng dòng trong đơn bàn. Có thể hoàn tác lượt gọi vừa gửi khi các dòng đó còn nguyên và bếp chưa bắt đầu. Nếu bàn đang chờ thu tiền, mở lại bàn trước khi gọi hoặc sửa món.

## Số bàn, thực đơn và dữ liệu

- Vào **Cài đặt → Số bàn** để chọn từ 1 đến 60. Các bàn vượt số mới phải đóng trước khi giảm.
- Bản sao thực đơn đã lưu được giữ nguyên khi nâng cấp. Để thử câu mẫu có phở chín trên dữ liệu cũ, thêm món **Phở bò chín**, tên gọi tắt **chín, phở chín** và giá của quán.
- Vào **Thực đơn và giá** để thêm hoặc sửa tên, giá theo đồng, nhóm món, ảnh và biệt danh phân cách bằng dấu phẩy. Bỏ **Đang bán** khi hết món. Đơn đã gửi giữ giá lúc nhận.
- Vào **Sao lưu và khôi phục → Tải bản sao** để tải JSON. Sao lưu định kỳ trước khi dọn dữ liệu trình duyệt hoặc đổi thiết bị. Chế độ cục bộ cho phép thay dữ liệu hiện tại bằng bản sao sau một bước xác nhận.
- Muốn mở nhanh ứng dụng, dùng **Thêm vào màn hình chính** từ trình duyệt. Sau khi trang và tài nguyên đã được tải lần đầu, có thể mở lại và dùng thao tác chạm hoặc gõ câu khi mất mạng. Micro phụ thuộc trình duyệt, quyền truy cập và dịch vụ nhận diện của thiết bị.
- Trên thiết bị đã kết nối API, lệnh chờ gửi được lưu qua lần tải lại. Khi có xung đột, vào **Cài đặt → Kết nối thiết bị** để xem lỗi, xác nhận nếu là lượt trùng thật hoặc bỏ lệnh và nhập lại. Kiểm tra biểu tượng đồng bộ trước khi chủ động báo bếp.

## Thử AI bằng Groq Free

Một khóa Groq dùng cho cả **hiểu câu gọi món** bằng GPT-OSS 20B và **chuyển giọng nói tiếng Việt thành chữ** bằng Whisper Large V3 Turbo. Dùng tài khoản Groq ở gói Free để thử trong quota của tài khoản. Theo dõi giới hạn và tình trạng gói trực tiếp trong Groq. Khi Groq báo đã chạm giới hạn, nhân viên có thể gõ câu hoặc chạm món. [Giới hạn Groq](https://console.groq.com/docs/rate-limits) · [Điều kiện nâng gói](https://console.groq.com/docs/billing-faqs)

1. Trên Mac hoặc máy chủ, lấy mã nguồn. Cài Node.js 22.13 trở lên. Cài thêm FFmpeg nếu dùng thu âm qua backend.
2. Trong thư mục `apps/food-assistant`, chạy `cp .env.example .env`. Tạo mã quán bằng `openssl rand -hex 32`. Tạo khóa tại [Groq Console](https://console.groq.com/keys) và điền vào `.env` trên máy chạy backend. `FOOD_TRANSCRIBE=1` bật thu âm phía máy chủ.
3. Chạy `npm run start:local` và mở `http://127.0.0.1:8787/` trên máy đó. Vào **Cài đặt → Kết nối thiết bị**, nhập địa chỉ trên và mã quán. Trong **Trợ lý và giọng nói**, bật từng chức năng cần thử.
4. Để iPhone và máy bếp kết nối cùng Wi-Fi, dùng địa chỉ HTTPS của máy Mac. Có thể đặt `HOST=0.0.0.0` và cấu hình `FOOD_TLS_CERT`, `FOOD_TLS_KEY` cho chứng chỉ khớp tên hoặc IP máy Mac, được hai máy tin cậy. Mở chính địa chỉ HTTPS đó trên cả hai máy rồi nhập cùng mã quán. iPhone cần bật tin cậy TLS nếu quản trị viên dùng chứng chỉ gốc cài thủ công. [Hướng dẫn Apple](https://support.apple.com/en-us/102390)

Với Groq, màn hình **Chi phí AI ước tính** dùng đơn giá trả phí làm tham chiếu để giữ hạn mức của quán. Số tiền thực tế phụ thuộc gói dự án trên Groq. Đặt khóa API trên backend. Các thiết bị chỉ nhận mã quán.

## Dùng nhiều thiết bị và bật AI

Hai máy có thể dùng cùng mạng Wi-Fi, với API chạy trên máy quán và có địa chỉ HTTPS mà cả hai truy cập được. Cũng có thể dùng backend riêng qua Internet. Máy bếp mở tab **Màn bếp** trong suốt ca làm việc. Kết nối cần địa chỉ API và mã kết nối quán. Có thể nhập bản sao cục bộ vào SQLite của máy quán trước khi ghép thiết bị.

Trên máy chạy API, cần Node.js từ 22.13 hoặc 24 LTS. Đặt các biến trong cấu hình dịch vụ hoặc trình quản lý bí mật của máy chủ.

| Biến | Công dụng |
| --- | --- |
| `FOOD_TOKEN` | Mã chia sẻ với thiết bị của quán. Dùng chuỗi ngẫu nhiên từ 24 ký tự trở lên. Có thể tạo bằng `openssl rand -hex 32`. |
| `FOOD_DB` | Đường dẫn SQLite, đặt trên ổ đĩa bền vững. Mặc định là `food-assistant.sqlite` ở thư mục chạy. |
| `HOST`, `PORT` | Mặc định `127.0.0.1:8787`, dùng reverse proxy HTTPS trước máy chủ khi truy cập từ thiết bị khác. |
| `FOOD_ORIGINS` | Danh sách origin phân cách bằng dấu phẩy. Mặc định là `https://dungvo.github.io`. |
| `FOOD_AI_PROVIDER` | `groq` hoặc `openai`. Mẫu `.env` dùng Groq. Máy chủ cũ thiếu biến này tiếp tục dùng OpenAI. |
| `GROQ_API_KEY` | Khóa Groq, chỉ dùng với `FOOD_AI_PROVIDER=groq`. |
| `FOOD_TLS_CERT`, `FOOD_TLS_KEY` | Tùy chọn. Cặp đường dẫn chứng chỉ HTTPS và khóa cho máy chủ phục vụ trực tiếp; dùng cùng nhau. |
| `OPENAI_API_KEY` | Tùy chọn, bí mật ở backend. Khi để trống, app vẫn xử lý được các câu thông thường bằng quy tắc. |
| `OPENAI_MODEL` | Tùy chọn, mặc định `gpt-4.1-mini`. Model phải hỗ trợ Structured Outputs. |
| `FOOD_TRANSCRIBE` | Đặt `1` để bật chuyển bản thu tiếng Việt thành chữ bằng `whisper-large-v3-turbo` (Groq) hoặc `gpt-transcribe` (OpenAI). Cần khóa của nhà cung cấp và `ffmpeg`. |
| `FOOD_AI_LIMIT_VND`, `FOOD_AI_WARNING_VND` | Trần ước tính mỗi tháng và ngưỡng cảnh báo. Mặc định 50.000đ và 40.000đ. |
| `FOOD_AI_VND_PER_USD` | Tỷ giá quy đổi dùng cho hạn mức, mặc định 26.000đ/USD. |
| `FOOD_AI_INPUT_USD`, `FOOD_AI_OUTPUT_USD` | Giá USD cho mỗi triệu token. Mặc định 0,40 và 1,60 cho model văn bản mặc định. Bắt buộc cấu hình khi đổi `OPENAI_MODEL`. |

Chạy từ thư mục `apps/food-assistant`.

```sh
npm start
```

Cấu hình reverse proxy TLS để chuyển tiếp đường dẫn `/api/` tới `127.0.0.1:8787`. Nếu muốn tự phục vụ app ở cùng địa chỉ, chuyển tiếp `/` luôn. Dùng đường dẫn có dấu gạch chéo cuối cho app. Trên từng thiết bị chọn **Cài đặt → Kết nối thiết bị**, nhập địa chỉ HTTPS và mã quán. Có thể bật hoặc tắt từng tính năng tại **Cài đặt → Trợ lý và giọng nói**:

- **Dùng AI cho câu gọi khó hiểu** cho phép gửi câu chữ tới AI khi bộ quy tắc cần làm rõ.
- **Cho phép nút thu âm qua máy chủ** hiện nút riêng khi máy chủ đã bật `FOOD_TRANSCRIBE`. Bấm **Thu âm qua máy chủ**, nói rồi bấm **Dừng và chuyển thành chữ**. App tự dừng ở 15 giây. Khi nhận được câu hoàn chỉnh, app tự lưu câu rõ. Gợi ý từ AI cho câu khó cần xác nhận. Đóng hộp thoại giữa lúc thu sẽ bỏ đoạn thu đó.

Khóa Groq hoặc OpenAI nằm ở máy chủ. Khi dùng micro trình duyệt, âm thanh do dịch vụ của trình duyệt xử lý. Khi chọn nút thu âm qua máy chủ, app gửi bản thu tới nhà cung cấp đã chọn thông qua backend của quán và không ghi bản thu vào SQLite. Nếu bật AI cho câu khó hiểu, backend gửi câu chữ liên quan cùng thực đơn, bàn đang chọn và các món chưa phục vụ của bàn đó. Gợi ý từ AI cho câu khó phải qua kiểm tra schema, nghiệp vụ và xác nhận trên màn hình. Phí API phụ thuộc gói của nhà cung cấp.

Để sao lưu SQLite, xuất snapshot dưới đây. Khi khôi phục, ngừng API, hoàn tất đồng bộ và ngắt các thiết bị đang kết nối trước, rồi chạy khôi phục và ghép nối lại. Sao lưu dữ liệu hiện tại trước khi thay thế.

```sh
node server/api.mjs backup > ban-sao.json
node server/api.mjs restore ban-sao.json
```

**Chi phí AI ước tính** hiển thị trong mục Trợ lý và giọng nói sau khi kết nối. Hạn mức tính theo tháng tại Việt Nam và lưu theo database của quán. Khi chạm hạn mức, các lượt gọi dịch vụ AI trả phí mới sẽ bị chặn nếu vượt phần còn lại. Quán vẫn có thể nhập câu, chạm món và đồng bộ bếp. Số tiền dùng để kiểm soát vận hành, trước thuế và hạ tầng. Tệp JSON sao lưu đơn không mang theo bộ đếm AI. Khi chuyển máy chủ trong cùng tháng, giữ bản SQLite nhất quán để tiếp tục theo dõi ngân sách.

Chi tiết kỹ thuật và kết quả QA nằm trong [TECHNICAL.md](TECHNICAL.md).
