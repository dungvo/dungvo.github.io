# PM-QUOTE-P0 — Mô hình trạng thái vận hành

## Vì sao trước đây số liệu có vẻ mâu thuẫn?

Các file đang mô tả những lớp khác nhau:

- canonical source sở hữu nội dung, review chính thức, nguồn và quyền;
- `canonical-ai-review.json` lưu đề xuất review vòng một của AI;
- `state.json` chỉ lưu lịch sử intake Candidate của `daily-content-review.py`, không phải trạng thái toàn bộ corpus;
- Authoring/Release manifest cho biết nội dung đang có trong từng channel;
- Review Matrix là projection để PM nhìn toàn bộ các lớp cùng lúc.

Vì vậy không ép tất cả ghi vào một file mutable. Nguồn sở hữu vẫn tách rõ, nhưng Review Matrix phải cung cấp **một trạng thái PM dẫn xuất** cho từng dòng.

## Trạng thái PM chuẩn

| `pm_status` | Ý nghĩa |
|---|---|
| `released` | Đã có trong Release hiện hành |
| `ready_for_owner_review` | Review sơ bộ đạt hoặc nằm trong shortlist; chờ owner |
| `needs_round1_review` | Đã ở Authoring nhưng chưa có kết luận review vòng một |
| `needs_story_review` | Phải đọc cùng story liên kết |
| `needs_edit` | Cần sửa nội dung trước khi review lại |
| `needs_source_verification` | Chưa đủ bằng chứng nguồn |
| `blocked_rights` | Quyền sử dụng đang chặn |
| `held_not_passed` | Không đạt review vòng một; chỉ mở lại khi có thay đổi |
| `duplicate_hold` | Biến thể trùng; giữ để đối chiếu provenance |
| `needs_authoring_review` | Research canonical đang chờ quyết định nhập Authoring |
| `needs_normalization` | Raw capture cần dịch/chuẩn hóa/metadata/editorial review |
| `held_research` | Giữ ở Research do chưa vượt qua điều kiện hiện tại |

Mỗi row trong `studio/review-matrix/data.json` có thêm:

- `pm_status`;
- `pm_next_action_vi`.

Đây là view vận hành, không thay quyền quyết định của owner và không tự sửa canonical source.

## Nguồn nào quyết định điều gì?

| Dữ liệu | Nguồn quyết định |
|---|---|
| Nội dung quote và metadata canonical | `perspective-library/source/vi/` |
| Quote đang có trong Authoring/Release | manifest của channel tương ứng |
| AI review vòng một | `canonical-ai-review.json` |
| Owner approval | ledger owner và canonical review được promotion ghi nhận |
| Lịch sử intake Candidate | `review-pipeline/state.json` |
| Dashboard và hàng đợi PM | Review Matrix được build lại từ các nguồn trên |
