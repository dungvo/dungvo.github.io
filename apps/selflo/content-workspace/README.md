# Selflo content workspace

Đây là điểm vào cho các công việc nội dung **chưa phải nguồn phát hành chính thức**. Khi quay lại repo sau một thời gian, đọc các file theo thứ tự dưới đây để biết đang có gì và nên tiếp tục ở đâu.

## Nên đọc file nào?

| Nhu cầu | File cần đọc | Ý nghĩa |
|---|---|---|
| Muốn biết toàn repo đang làm dở gì | [`REPO_WORK_IN_PROGRESS.vi.md`](REPO_WORK_IN_PROGRESS.vi.md) | Bảng kiểm kê feature, nội dung đang dang dở, phần tạm dừng và đúng bước tiếp theo |
| Muốn quản lý backlog như một chương trình | [`REPO_WORK_IN_PROGRESS.vi.md#8-backlog-pm-hợp-nhất`](REPO_WORK_IN_PROGRESS.vi.md#8-backlog-pm-hợp-nhất) | Mã công việc, ưu tiên, trạng thái, điều kiện hoàn thành và thứ tự thực hiện |
| Muốn tiếp tục một việc đang làm giữa chừng | [`programs/README.md`](programs/README.md) | Registry chương trình, checkpoint gần nhất, trạng thái và nhật ký thay đổi |
| Muốn chọn một chủ đề Knowledge để làm | [`KNOWLEDGE_CONTENT_INVENTORY.vi.md`](KNOWLEDGE_CONTENT_INVENTORY.vi.md) | Sổ ý tưởng, bài đã phân tích, bản nháp, trạng thái Facebook và Selflo Release |
| Muốn tiếp tục thử nghiệm Mê cung kiến thức | [`knowledge-maze/README.md`](knowledge-maze/README.md) | Phạm vi prototype, topic hiện có và đường từ bản thử đến sản phẩm |
| Muốn hiểu các bản K1–K9 cũ | [`rhythm-knowledge/README.md`](rhythm-knowledge/README.md) | Tài liệu lịch sử của hướng Rhythm → Knowledge đã tạm dừng; không dùng làm backlog đang triển khai |
| Muốn xem nội dung thô chưa chuẩn hóa | [`raw/`](raw/) | Bản nghiên cứu, phân tích và bài viết làm việc; không publish trực tiếp |
| Muốn xem tài sản đã biên tập cho từng kênh | [`curated/`](curated/) | Tài sản đã được chọn hoặc chuẩn bị, nhưng vẫn phải kiểm tra trạng thái thật trước khi gọi là đã đăng/phát hành |
| Muốn chọn phong cách cho một bài | [`editorial-styles/`](editorial-styles/) | Các style profile có ID, cấu trúc, giới hạn và checklist; không thay source/evidence gate |

## Ranh giới quan trọng

- `content-workspace/` dùng cho ý tưởng, nghiên cứu, bản nháp và prototype.
- Nguồn nội dung chính thức nằm ở `../perspective-library/source/vi/`.
- `../perspective-library/authoring/` và `../perspective-library/release/` là đầu ra được sinh tự động; không sửa tay.
- Website public chỉ đọc nội dung đã có trong Release.
- Việc có ảnh hoặc bài trong thư mục Facebook không chứng minh nội dung đã được đăng. Cần ngày đăng và đường dẫn thật hoặc xác nhận của owner.

## Cách cập nhật

Khi một chủ đề đổi trạng thái:

1. cập nhật dòng tương ứng trong `KNOWLEDGE_CONTENT_INVENTORY.vi.md`;
2. nếu thay đổi ảnh hưởng tiến độ chung hoặc feature, cập nhật `REPO_WORK_IN_PROGRESS.vi.md`;
3. chỉ cập nhật Authoring/Release qua pipeline và gate đã được duyệt.

Khi một hạng mục trong backlog hoàn thành, không xóa dòng cũ. Chuyển trạng thái sang `Đã chốt` hoặc `Hoàn thành`, ghi ngày và bằng chứng nghiệm thu để lần sau không mở lại cùng một việc.
