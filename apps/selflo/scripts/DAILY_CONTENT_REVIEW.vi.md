# Review content hằng ngày

Workflow có ba lớp. Candidate là batch nhỏ cho vòng duyệt đầu; Authoring là nội dung đã qua vòng đầu nhưng chưa Release; Release chỉ nhận nội dung qua vòng hai và đủ source, rights, knowledge gates.

## 1. Tạo batch Candidate hằng ngày

```bash
python3 scripts/daily-content-review.py select --count 5 --push
```

Lệnh chọn các candidate chưa từng xem, tạo Candidate package, commit và push. Sau khi GitHub Pages cập nhật, mở:

```text
https://dungvo.github.io/apps/selflo/preview/?channel=candidate&updated=latest
```

Review từng item rồi bấm **Xuất review**. Trình duyệt tải file `selflo-content-review-r*.json`.

## 2. Đưa item đã duyệt vòng 1 vào Authoring

```bash
python3 scripts/daily-content-review.py promote-authoring \
  --ledger ~/Downloads/selflo-content-review-r1.json \
  --push
```

Chỉ quyết định `approved` được nhập vào canonical source. Item vào Authoring với `needs_owner_review` và rights `unverified`; script chạy publisher Authoring/Release, commit và push. `needs_edit` và `rejected` không được nhập.

Review vòng hai tại:

```text
https://dungvo.github.io/apps/selflo/preview/?channel=authoring&updated=latest
```

Xuất review ledger lần nữa.

## 3. Đưa item đã duyệt vòng 2 vào Release

```bash
python3 scripts/daily-content-review.py promote-release \
  --ledger ~/Downloads/selflo-content-review-r36.json \
  --push
```

Release vẫn fail-closed. Nếu rights chưa xác minh, lệnh dừng và không đổi file. Sau khi thực sự kiểm tra quyền, chạy lại với bằng chứng:

```bash
python3 scripts/daily-content-review.py promote-release \
  --ledger ~/Downloads/selflo-content-review-r36.json \
  --rights public_domain \
  --rights-note 'Đã đối chiếu bản gốc và tình trạng public domain.' \
  --confirm-knowledge-checked \
  --push
```

Không dùng các cờ xác nhận để bỏ qua việc kiểm tra nguồn/quyền.

## Trạng thái

```bash
python3 scripts/daily-content-review.py status
```

State được lưu tại `quote-research/review-pipeline/state.json`. Candidate đã queued, approved, rejected, nhập Authoring hoặc Release sẽ không bị chọn lại như nội dung mới.

## Nguyên tắc an toàn

- Thiếu quyết định không bao giờ được coi là approve.
- Candidate không tự động thành Authoring.
- Authoring không tự động thành Release.
- 65 quote Release hiện tại không nằm trong daily Candidate catalog.
- Script chỉ commit các đường dẫn của workflow; không `git add` các thay đổi khác trong repo.
