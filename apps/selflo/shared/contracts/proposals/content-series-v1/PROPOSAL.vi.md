# Proposal — Content Series v1

- **Trạng thái:** Proposed; chưa được Release sử dụng
- **Ví dụ động lực:** “Tầng Không Tồn Tại” và các truyện nhiều tập tương lai
- **Phân loại:** App-impacting nếu public; cần app conformance trước cutover

## Mục tiêu

Thêm quan hệ series mà không sửa payload Story hiện hành. Một Story vẫn đọc độc lập bằng `content_id`; catalog series chỉ bổ sung thứ tự tập, nhãn tập và trạng thái hoàn thành.

## Mô hình đề xuất

Canonical resource riêng `content_series_catalog`:

```text
series
├── id, title, description, status
├── introduction_content_id (optional)
├── presentation (numbering, spoiler policy)
└── episodes[]
    ├── content_id
    ├── ordinal
    ├── title override (optional)
    └── publication_status
```

Không lưu `previous_episode_id`/`next_episode_id`; consumer suy ra từ `ordinal` để tránh ba nguồn thứ tự cạnh tranh. `content_id` tiếp tục là identity của tập. Một tập v1 chỉ thuộc tối đa một series. `ordinal` là số nguyên dương, duy nhất và tăng liên tục khi Release; Authoring có thể có khoảng trống trong lúc chuẩn bị.

`introduction_content_id` cho phép phần giới thiệu series là một content độc lập, có thể đọc và version riêng. Nó không chiếm ordinal của tập.

## Quote và loại content

Series là quan hệ giữa các content, không phải một loại Quote–Story mới. Một tập có thể là Story, Knowledge hoặc content type được contract tương lai cho phép.

**Tập trong series không bắt buộc có quote riêng.** Publisher hiện tại đang yêu cầu mỗi Story có đúng một owning quote; vì vậy series chỉ được Release sau khi contract/publisher/app hỗ trợ Story độc lập hoặc một episode runtime entity mới. Không tạo quote giả chỉ để vượt gate.

## Trạng thái đọc

Catalog chỉ lưu trạng thái xuất bản của series và tập. Trạng thái người đọc như chưa đọc, đang đọc, đã đọc, vị trí gần nhất hoặc tập tiếp theo là dữ liệu người dùng/runtime; không ghi vào canonical content.

Consumer có thể suy ra tập kế tiếp từ `ordinal` kết hợp trạng thái đọc cục bộ. Việc đồng bộ trạng thái đọc giữa thiết bị cần contract riêng về privacy và ownership.

## Lifecycle và versioning

- `draft`: series/tập chỉ ở Authoring.
- `ongoing`: đã public ít nhất một tập, còn dự kiến tập tiếp.
- `complete`: tập cuối đã public; không đồng nghĩa không bao giờ có ngoại truyện.
- `archived`: không còn được discovery mặc định, nhưng deep link tập cũ vẫn hoạt động.

Catalog có `revision`; mỗi Story giữ revision riêng. Thêm tập là additive. Đổi `content_id`, tái sử dụng ordinal cho nội dung khác, hoặc thay semantics ordering là breaking editorial migration và phải có redirect/decision record.

## Backwards compatibility

App cũ không biết catalog series vẫn đọc từng Story bình thường. App mới chỉ hiện điều hướng series khi catalog hợp lệ, `content_id` tồn tại và tập đang available trong channel. Nếu catalog lỗi, quarantine quan hệ series chứ không quarantine Story.

## Consumer tối thiểu trước Release

1. Decode schema v1 và bỏ qua field additive.
2. Hiển thị “Tập N” cùng tên series nhưng không thay title gốc của Story.
3. Điều hướng trước/sau chỉ qua các tập available trong cùng channel.
4. Không tiết lộ title/summary tập draft khi public.
5. Deep link Story cũ tiếp tục hoạt động khi không tải được catalog.
6. Lưu trạng thái đọc theo người dùng mà không sửa payload content.

## Gate còn thiếu

- Owner duyệt naming/numbering cho “Tầng Không Tồn Tại”.
- App conformance và UI states cho ongoing/complete.
- Publisher projection Authoring/Release, reference validation và quarantine policy.
- Gỡ ràng buộc owning quote cho episode theo một contract được app hỗ trợ; không bypass gate hiện tại.
- Quyết định một Story có được xuất hiện ở nhiều series hay không; v1 đề xuất **không**.

Schema và fixture trong proposal chỉ để kiểm chứng mô hình; không được thêm vào manifest Release khi proposal chưa promote thành contract active.
