# Kiến trúc và kiểm thử

## Cấu trúc

| Thành phần | Trách nhiệm |
| --- | --- |
| `index.html`, `styles.css`, `view.js`, `app.js` | PWA mobile-first, sơ đồ bàn, ảnh thực đơn, màn bếp, hóa đơn, cài đặt, luồng nói và xác nhận |
| `language.js` | Bộ phân tích tiếng Việt, từ đồng nghĩa, số đếm, ghi chú, sửa lời, câu hỏi làm rõ và schema chuẩn cho AI |
| `domain.js` | Kiểm tra trạng thái, thao tác, lượt khách, giá chốt, sổ sự kiện, xử lý đơn lặp và trạng thái bếp |
| `voice.js` | Thu âm khi được chọn, tự giới hạn thời lượng, đóng luồng micro khi hoàn tất hoặc hủy |
| `storage.js` | IndexedDB, outbox bền vững, chiếu đơn đang chờ, ghép nối, hợp nhất phản hồi |
| `server/api.mjs` | API Node.js, SQLite WAL, xác thực mã quán, CORS, giao dịch đồng bộ và AI fallback |
| `sw.js`, `manifest.webmanifest` | Màn hình chính và cache ngoại tuyến trong phạm vi dự án |
| `tests/` | Nghiệp vụ, API, SQLite, outbox và trình duyệt |

Flutter Web và PWA đều phụ thuộc dịch vụ giọng nói mà trình duyệt cung cấp trong thiết kế này. Chọn PWA cho GitHub Pages để triển khai trực tiếp, dùng Web Speech API với `vi-VN` và IndexedDB. API JSON độc lập có thể được tái sử dụng từ một client Flutter native. Bản này phát hành dưới dạng PWA.

## Dữ liệu và đồng bộ

- `active` chứa lượt khách hiện tại theo số bàn. Mỗi dòng món có UUID theo lệnh và vị trí, số lượng, giá chốt, ghi chú, thứ tự nhận và trạng thái. `receipts` lưu snapshot lúc đã thu tiền. `audit` giữ lịch sử thao tác.
- Mỗi lệnh có UUID bền vững. Client gửi cùng UUID trong trường `id` và header `Idempotency-Key`. Máy chủ dùng giao dịch SQLite để kiểm tra UUID và ghi snapshot mới cùng lượt đã xử lý. Nếu mất phản hồi sau ghi, request gửi lại cùng mã trả về trạng thái đã bền vững.
- Lượt gọi giống trong 45 giây hoặc lặp lại lượt cùng nội dung trong phiên mà thiếu ý định gọi thêm cần xác nhận rõ. Một lượt được nhận diện theo món, số lượng và ghi chú, kể cả khi đổi thứ tự món hoặc tách nhiều dòng.
- Các thao tác dùng phiên khách và điều kiện tương ứng. Sửa món dùng trạng thái cùng số lượng đang thấy, thanh toán dùng phiên bản hóa đơn và tổng tiền. Lệnh mở một phiên mới của thiết bị thứ hai có thể bị từ chối nếu bàn đã được mở đồng thời. Nhân viên xem lại trước khi tạo lượt gọi mới.
- Offline, lệnh hợp lệ được lưu vào IndexedDB trước khi hiện và nối lại với máy chủ theo thứ tự. Thiết bị gọi món có thể thấy tạm dữ liệu của outbox, còn màn bếp trên máy khác thấy các lệnh đã đến backend. App gửi tuần tự và hỏi máy chủ khoảng mỗi hai giây khi tab ở trước màn hình. Thu tiền ở chế độ nhiều thiết bị yêu cầu kết nối, hàng đợi rỗng và phản hồi máy chủ trước khi đóng bàn.
- Dùng SQLite cho một quán và một database. Dữ liệu trên browser phụ thuộc vào profile, origin và chính sách dọn bộ nhớ của hệ điều hành. Giữ bản sao định kỳ. Remote sync dùng mã quán chung; mỗi thiết bị có UUID để truy vết. Phạm vi hiện tại gồm một quán và mã chia sẻ cho nhân viên đã được cấp quyền.

## Thu âm qua máy chủ

- Micro trình duyệt vẫn là đường mặc định. Backend chỉ công bố tính năng thu âm khi nhận cả khóa OpenAI và `FOOD_TRANSCRIBE=1`. Thiết bị bật quyền riêng trong Cài đặt và người dùng bấm nút thu âm riêng.
- Browser gửi bản thu WebM, MP4 hoặc Ogg dạng nhị phân tới `POST /api/transcribe`. Tối đa 15 giây ở client và 2 MiB tại API. API kiểm tra mã quán, kiểu dữ liệu, header tệp, tốc độ gọi và số bản thu đồng thời. Nhà cung cấp nhận gợi ý tiếng Việt qua `languages[]=vi`.
- API trả transcript. Client đưa transcript vào hộp chỉnh sửa và giữ bước xác nhận nghiệp vụ trước khi lưu. Không lưu bản thu vào IndexedDB hay SQLite, cũng không thêm audio vào hàng đợi ngoại tuyến. Đóng cửa sổ giữa lúc thu hủy bản thu tại thiết bị.

## Kết quả QA

| Kiểm tra | Kết quả |
| --- | --- |
| `npm test` | 101 kiểm thử đạt gồm phân tích câu, chống trùng, hủy/đổi món, đơn ngoài bàn, bàn đã đóng, thu tiền nhiều lượt, SQLite, hai thiết bị gửi đồng thời, lỗi đồng bộ, khôi phục và AI adapter mô phỏng, định dạng bản thu, xác thực, giới hạn dung lượng và tần suất |
| Chromium 375 × 812 | Luồng nhập câu tiếng Việt, kiểm tra trùng, bếp, hóa đơn và tải lại đạt |
| Chromium 412 × 915 | Luồng như trên đạt |
| Chromium 834 × 1112 | Luồng như trên đạt, kiểm tra các thẻ món trong màn bếp |
| Chromium 1280 × 880 | Luồng như trên đạt |
| Thu âm Chromium với micro mô phỏng | Lỗi nhận giọng nói trình duyệt, bật thu âm, bỏ bản thu, gửi audio tới adapter mô phỏng, sửa transcript và xác nhận trước khi bếp nhận |
| Hai profile Chromium độc lập | App chạy qua backend cục bộ. Đơn ngoại tuyến tồn tại qua lần tải lại, được gửi khi nối lại và xuất hiện một lần tại bếp. Trạng thái bếp quay lại máy gọi món |

Tái lập bài kiểm thử giao diện bằng Playwright.

```sh
npm install --no-save --no-package-lock playwright
npx playwright install chromium
npm run test:ui
```

Có thể dùng `BROWSER_EXECUTABLE` cho binary Chromium sẵn có và `FOOD_SCREENSHOTS` để xuất ảnh QA. `FOOD_TEST_URL` chạy bài kiểm thử trình duyệt trực tiếp trên URL triển khai, trong các profile mới độc lập.

## Phạm vi của bản phát hành

- Đã kiểm thử luồng từ transcript và các kích thước đại diện trên Chromium. Cần nghiệm thu micro tiếng Việt trên Safari, Chrome Android và trong tiếng ồn của quán. Chế độ offline hỗ trợ nhập/chạm; micro web có thể cần mạng.
- Bản công khai chạy trực tiếp theo chế độ một thiết bị. Đồng bộ có API và đã chạy qua hai profile thử. Quán cần một máy chủ HTTPS riêng để ghép thiết bị thật. AI và chuyển bản thu qua máy chủ dùng backend và khóa của quán. Bài kiểm thử dùng phản hồi mô phỏng, cần xác minh với tài khoản nhà cung cấp khi cấu hình.
- Bluetooth và bản Flutter cho App Store/Google Play nằm ngoài phạm vi bản PWA. Phần chọn ảnh hỗ trợ bộ ảnh có sẵn của app.
