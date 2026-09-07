# Chuyển quote/story giữa Authoring và Release

Yêu cầu: Python 3.9+, Ruby và Node/npm để publisher hiện tại kiểm tra JSON Schema. Chạy từ thư mục Selflo website:

```bash
cd /Users/dungvo/xcode/dungvo.github.io/apps/selflo
```

## Cách dùng thường ngày

Liệt kê quote ID, story liên kết, trạng thái và nội dung rút gọn:

```bash
python3 scripts/prepare-perspective.py --list
```

Đưa một quote và story liên kết vào Release, rồi tự chạy publisher:

```bash
python3 scripts/prepare-perspective.py --channel release --quote compass_keeps_direction_not_steps
```

Lệnh Release chính là xác nhận của người chạy rằng cặp nội dung đã được duyệt. Script điền reviewer (mặc định `owner:dungvo`) và thời gian UTC cho review chưa đầy đủ; story chuyển sang `active`. Review đã hợp lệ được giữ lại. Dùng `--reviewer owner:ten-cua-ban` để thay người duyệt cho các mục chưa có review hợp lệ.

Đưa cặp về Authoring để biên tập:

```bash
python3 scripts/prepare-perspective.py --channel authoring --quote compass_keeps_direction_not_steps
```

Lệnh Authoring chuyển review của quote/story về `needs_owner_review`, xóa reviewer/thời gian duyệt và đưa story về `draft`. Rights đã xác minh được giữ nguyên. Nếu đã có package Release, script cũng tạo lại Release để gỡ cặp này. Các revision cũ vẫn tồn tại để lưu lịch sử nhưng manifest hiện hành không còn trỏ tới nội dung đã gỡ. Nếu muốn chỉ xem bản Authoring mà không đổi lifecycle, dùng website Preview hoặc publisher Authoring hiện có.

Chọn nhiều quote bằng cách lặp `--quote`:

```bash
python3 scripts/prepare-perspective.py --channel release \
  --quote compass_keeps_direction_not_steps \
  --quote the_pauses_were_the_life
```

Thêm `--dry-run` để xem trước việc tìm cặp, điều kiện quyền/knowledge và danh sách file dự kiến thay đổi. Chế độ này không ghi file và không chạy publisher/schema validation.

## Quyền sử dụng và kiểm tra nguồn

Script giữ rights hiện tại theo mặc định. Nếu rights chưa xác minh, Release dừng và báo đúng ID. Sau khi kiểm tra quyền, truyền trạng thái và ghi chú:

```bash
python3 scripts/prepare-perspective.py --channel release \
  --quote compass_keeps_direction_not_steps \
  --rights selflo_owned \
  --rights-note 'Nội dung gốc Selflo; owner xác nhận quyền phát hành.'
```

`--rights` hỗ trợ `selflo_owned`, `public_domain`, `licensed`, `permission_granted`. Giá trị này áp dụng cho **tất cả quote và story được chọn trong lệnh**. Nếu mỗi mục có quyền khác nhau, chạy riêng từng cặp hoặc giữ các rights hợp lệ sẵn có. Script không tự suy đoán quyền dựa trên tên tác giả.

Nếu knowledge cần dùng còn pending, script liệt kê ID cần kiểm tra và dừng trước khi ghi file. Sau khi thực sự đối chiếu nguồn, chạy lại với:

```bash
python3 scripts/prepare-perspective.py --channel release \
  --quote compass_keeps_direction_not_steps \
  --confirm-knowledge-checked
```

Cờ này là xác nhận của người chạy, không phải thao tác tự tra cứu internet. Nó chỉ duyệt concept/theory/framework/reference liên quan tới các cặp được chọn, bao gồm dependency gián tiếp. Không dùng cờ để bỏ qua việc kiểm tra nguồn. Nên lưu bằng chứng kiểm tra thành ghi chú, như `perspective-library/RELEASE_COMPASS_SOURCE_REVIEW.vi.md`.

Owner exclusion có chủ đích không bị tự xóa. Script yêu cầu xử lý quyết định đó trước khi Release quote đang bị exclude. Quote không có `story_id` vẫn được hỗ trợ. ID sai, story thiếu, story dùng chung hoặc cặp lệch theme đều được báo lỗi.

## Thay đổi và xuất bản

- Chỉ đọc các entity được khai báo trong `source/vi/source.json`; không tìm nhầm các bản `story.vi.v1.json` lưu bên cạnh.
- Tự tăng `source_revision` và đổi `content_version` khi canonical thực sự thay đổi; không đổi ID, đường dẫn, số quote hay nội dung câu chuyện.
- Dùng bản tạm để cập nhật canonical và chạy publisher Authoring, rồi Release khi cần. Chỉ ghi về thư viện thật khi tất cả bước kiểm tra thành công; lỗi publisher không để lại canonical được duyệt dở dang.
- Publisher vẫn phát hành **toàn bộ nội dung đủ điều kiện**, không chỉ các quote được chọn ở lệnh này. Script chỉ thay lifecycle của các cặp được chọn.
- Nếu có chỉnh sửa thư viện trong lúc script kiểm tra, script dừng để tránh ghi đè. Tránh chạy nhiều tiến trình cập nhật thư viện cùng lúc.
- Kết quả là package local. Script không commit, push, deploy GitHub Pages hoặc đổi cấu hình app.

Có thể gọi script từ thư mục bất kỳ. Mặc định script lấy thư mục cha của `scripts/` làm root; dùng `--root /duong/dan/selflo` khi làm việc trên bản sao.

Chạy kiểm thử:

```bash
python3 scripts/test_prepare_perspective.py
```
