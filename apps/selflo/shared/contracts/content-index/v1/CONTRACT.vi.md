# Content Index v1

Content Index là projection chỉ-đọc để website và app tra cứu metadata từ cùng một nguồn. Dữ liệu authoring trong `perspective-library/source` vẫn là nguồn chuẩn; không sửa trực tiếp file API sinh ra.

## Mục tiêu

- Hỗ trợ tìm kiếm local/offline trên thiết bị cho quote, story và Knowledge / Insight.
- Giữ đường biên dữ liệu ổn định để có thể chuyển storage/API lên AWS mà client không phải đổi model.
- Tách `content_type` (ý nghĩa biên tập) khỏi `runtime_entity` (kiểu wire hiện app đang decode).
- Cho phép chia shard khi corpus tăng từ vài nghìn lên nhiều hơn.

## Identity và trường bắt buộc

Mỗi item có `id`, `content_type`, `runtime_entity`, `language`, `status`, `revision`, `primary_theme`, `source_path`, `payload_ref` và `search_document_vi`. Story/Knowledge có `title_vi`; quote dùng `text_vi`. Trường mới trong v1 chỉ được thêm theo hướng tương thích.

`content_type` hiện gồm `quote`, `story`, `knowledge_insight`. Knowledge có thể tạm dùng `runtime_entity = perspective_story`; điều đó không biến nó thành Story về mặt nội dung.

## Phân phối và tìm kiếm

- `api/content-index.v1.json`: bundle đầy đủ, tiện cho web và công cụ nhỏ.
- `api/content-index.v1/manifest.json`: mô tả các shard và checksum.
- `api/content-index.v1/*.json`: shard có thể cache/download độc lập.
- Search mặc định chạy local sau khi tải index. Remote search chỉ nên dùng khi phép tính hoặc corpus vượt khả năng thiết bị.

Khi chuyển sang AWS, giữ nguyên JSON shape và đường biên version. Static file có thể trở thành object trên S3/CloudFront; manifest có thể được trả bởi API mà client không đổi semantics.

## Lifecycle

Index authoring có thể chứa nội dung chưa release và chỉ dành cho Studio. Website public chỉ đọc projection từ Release. `status` và `channel` phải luôn được kiểm tra; không suy luận public chỉ từ việc item tồn tại.
