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

Từ 2026-10-25, xem `editorial_status` để đối chiếu với Studio Review Matrix. Khi `availability` là `current`, các số `states` và revision lấy từ cùng projection Studio. Nếu `stale` hoặc `missing`, chạy `python3 scripts/build-review-matrix.py` rồi xem lại; CLI không hiển thị số biên tập cũ như thể hiện hành.

Các trường cấp ngoài `catalog`, `batch_sequence`, `states` được giữ cho lịch sử import candidate. `states.imported` không có nghĩa quote chưa được review hoặc chưa Release. State này không cấp quyền approval. Fingerprint chỉ kiểm tra sáu đầu vào trạng thái được nêu trong `scripts/review_status.py`.

```bash
python3 scripts/daily-content-review.py status
```

State được lưu tại `content-workspace/curated/quote-research/review-pipeline/state.json`. Candidate đã queued, approved, rejected, nhập Authoring hoặc Release sẽ không bị chọn lại như nội dung mới.

Với quote chuẩn đã ở Authoring, kết quả AI review được lưu riêng tại `content-workspace/curated/quote-research/review-pipeline/canonical-ai-review.json` và xuất hiện trong Review Matrix. Nhãn `round1_not_pass` và `source_rights_blocked` giúp loại các quote chưa đạt hoặc bị chặn khỏi những batch đề xuất sau; chỉ đưa lại khi nội dung hoặc bằng chứng nguồn đã thay đổi.

## Nguyên tắc an toàn

- Thiếu quyết định không bao giờ được coi là approve.
- Candidate không tự động thành Authoring.
- Authoring không tự động thành Release.
- Catalog Candidate và tập Release có phạm vi khác nhau; không dùng số candidate imported làm số quote Release.
- Script chỉ commit các đường dẫn của workflow; không `git add` các thay đổi khác trong repo.

## Bảo vệ quyết định đã đóng (2026-10-25)

select/promote và prepare-perspective dùng chung review_eligibility.py. Rejected trong canonical hoặc state, release_quote_exclusions và round1_not_pass/source_rights_blocked trong ledger đều chặn approval qua cả ID và alias research_id_original/canonical_id. Muốn mở lại cần owner quyết định và xử lý sổ quyết định rõ ràng; ledger cũ chứa approved không tự mở lại.

Candidate đã có canonical không được nhập lần hai dù state mất. Nhóm alias nhiều canonical ID, nhiều approval tạo cùng identity hoặc ledger lặp quote ID sẽ bị chặn. State chỉ được lưu sau kiểm tra/publication thành công; lỗi rights/source/publisher không ghi approved/released sớm.
