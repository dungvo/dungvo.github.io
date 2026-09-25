# Selflo website

Public root: <https://dungvo.github.io/apps/selflo/>

## Pages

- `/apps/selflo/`: public-facing app home plus entry points to editorial tools.
- `/apps/selflo/quotes/`: dense quote-only browser with source, author, work, theme and text filters. Each card deep-links to the focused detail preview.
- `/apps/selflo/preview/`: bulk quote/story review workspace. It renders 12 items per page by default, pairs linked quote/story side by side, shows the complete story in a bounded reader, reports word count/reading time/section count and stores independent quote/story decisions.
- `/apps/selflo/preview/?channel=candidate&updated=latest`: batch Candidate nhỏ để review lượt 1.
- `/apps/selflo/preview/?channel=authoring&updated=latest`: nội dung Authoring vừa cập nhật để review lượt 2.
- `/apps/selflo/preview/?channel=release&updated=latest`: nội dung đã Release.
- `/apps/selflo/review-matrix/`: inventory hợp nhất toàn bộ research quotes từ Excel, canonical Authoring và Release; có ranking, độ tin cậy, pipeline, filter, chọn nhiều dòng và copy ID.
- `/apps/selflo/preview/?view=detail`: focused in-app quote/story reader preview.
- `/apps/selflo/preview/?view=matrix`: diversity dashboard backed by `quote-research/diversity-matrix.json` and the live Authoring manifest.
- `/apps/selflo/story/`: app-like Story Reader Lab for testing Classic V1 and Editorial V2 payloads without changing the existing review workspace or Release content.
- `/apps/selflo/story-seed/`: local prompt builder for generating Authoring-ready story/quote draft files.
- `/apps/selflo/privacy/`: stable privacy-policy URL for the website and future App Store metadata.

## Review ledger

The Review workspace stores decisions in the current browser and supports JSON import/export. Ledger không tự sửa canonical source, duyệt quyền hay publish Release. Sau khi review, export ledger thành JSON và đưa file đó cho script promotion; không cần sửa Excel hoặc JSON bằng tay.

## Ba trạng thái nội dung

- **Candidate**: batch nhỏ được chọn từ research corpus để owner review lượt 1. Đây là review queue tạm thời, chưa phải canonical content và chưa release.
- **Authoring**: candidate đã qua lượt 1 và được nhập vào canonical authoring source để review lượt 2 trên web. Nội dung có thể vẫn là `needs_owner_review`; draft story cũng nằm ở đây.
- **Release**: nội dung đã được owner duyệt và vượt qua các gate bắt buộc về source, rights và knowledge check. Chỉ channel này là production/released.

`draft` không phải một channel riêng. Đây là trạng thái của nội dung trong Authoring; draft không được đưa vào Release.

## Quy trình review hằng ngày

Chạy các lệnh dưới đây từ thư mục `apps/selflo`.

Có thể mở <https://dungvo.github.io/apps/selflo/review-matrix/> để xem hàng đợi theo thứ tự ưu tiên. Chọn các dòng muốn xử lý rồi bấm **Copy ID đã chọn**; gửi danh sách ID để promotion vào Authoring hoặc Release. Các item có nhãn **Mới vào Authoring** là nội dung cần review lượt hai trước khi Release.

Matrix không đọc riêng batch Candidate. Dữ liệu được tạo từ `Selflo_Content_Master_Post90_Phase2_5.xlsx`, Authoring manifest/payload và Release manifest/payload. Sau khi workbook hoặc repository content thay đổi, rebuild bằng:

```bash
/Users/dungvo/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  scripts/build-review-matrix.py
```

Các tổng Research, Authoring chưa Release và Release được hiển thị riêng để tránh cộng trùng research provenance với canonical content.

### 1. Chọn một batch Candidate nhỏ

```bash
python3 scripts/daily-content-review.py select --count 5 --push
```

Script chọn 5 candidate chưa từng xem, ghi nhận trạng thái và đẩy batch lên GitHub. Review tại:

<https://dungvo.github.io/apps/selflo/preview/?channel=candidate&updated=latest>

Chọn quyết định trên web rồi bấm **Export review ledger**.

### 2. Đưa item đã duyệt vào Authoring

```bash
python3 scripts/daily-content-review.py promote-authoring \
  --ledger ~/Downloads/selflo-review-ledger-candidate.json \
  --push
```

Chỉ item được approve mới được chuyển. Review lượt 2 tại:

<https://dungvo.github.io/apps/selflo/preview/?channel=authoring&updated=latest>

Sau khi review, export ledger Authoring.

### 3. Đưa item đủ điều kiện vào Release

```bash
python3 scripts/daily-content-review.py promote-release \
  --ledger ~/Downloads/selflo-review-ledger-authoring.json \
  --push
```

Promotion sẽ bị chặn nếu source, rights hoặc knowledge check chưa đạt. Khi đã kiểm tra và có căn cứ, truyền xác nhận rõ ràng:

```bash
python3 scripts/daily-content-review.py promote-release \
  --ledger ~/Downloads/selflo-review-ledger-authoring.json \
  --rights public_domain \
  --rights-note "Đã kiểm tra nguồn và tình trạng quyền" \
  --confirm-knowledge-checked \
  --push
```

Không dùng các cờ xác nhận để bỏ qua kiểm tra thực tế. Script không tự release toàn bộ Authoring.

### 4. Xem tiến độ

```bash
python3 scripts/daily-content-review.py status
```

Trạng thái cho biết candidate nào còn unseen, đang review, đã vào Authoring hoặc đã Release. Vì vậy không cần tự ghi nhớ item nào đã đọc trong Excel.

### 5. Theo dõi AI review của nội dung chuẩn

Kết quả review vòng 1 cho các quote chuẩn trong Authoring được lưu bền vững tại `quote-research/review-pipeline/canonical-ai-review.json` và hiển thị trong `/review-matrix/`. Có thể lọc theo: **Vòng 1 đạt · chờ bạn duyệt**, **Cần review cùng story**, **Cần xác minh nguồn**, **Cần biên tập**, **Vòng 1 chưa đạt** và **Bị chặn nguồn/quyền**.

Quote đã mang nhãn **Vòng 1 chưa đạt** hoặc **Bị chặn nguồn/quyền** không được đưa lại vào batch đề xuất kế tiếp, trừ khi có biên tập hoặc bằng chứng nguồn mới. Đây là đề xuất của AI; chỉ quyết định rõ ràng của owner mới được chuyển nội dung sang Release.

`--push` tạo commit và push các file thuộc workflow. Bỏ `--push` nếu chỉ muốn tạo và kiểm tra thay đổi cục bộ trước.

## Content boundaries

- Canonical authoring source: `perspective-library/source/vi/`.
- Candidate review queue: `quote-research/review-pipeline/`; không phải canonical content.
- Generated public review package: `perspective-library/authoring/vi/`.
- Release: separate fail-closed channel; chỉ script promotion sau quyết định của owner mới được phép cập nhật.
- Canonical quote source is split into numbered fragments of at most 12 quote under `source/vi/quotes/<theme>/` so future batches do not make one theme file grow indefinitely.
- Phase 2.5 bridge ban đầu có 60 quote-only candidates. Khi có quan hệ story/perspective trong Authoring, workflow giữ liên kết đó; việc mở rộng story vẫn là bước editorial sau.

## Documentation

- [Triết lý sản phẩm Selflo](SELFLO_PRODUCT_PHILOSOPHY.vi.md): luận đề nền tảng, vai trò của nội dung và trí tuệ nhân tạo, nguyên tắc riêng tư, cố ý không tự động hóa và câu hỏi kiểm tra khi xây tính năng.
- [Hướng dẫn kể chuyện Selflo](perspective-library/STORYTELLING_GUIDE.vi.md): taxonomy story style/life stage/function/depth, cách chọn truyện theo hoàn cảnh người đọc, checklist chống giảng đạo và quy tắc typography cho Story Reader.
- [Định hướng mở rộng kho nội dung](perspective-library/CONTENT_COVERAGE_GAPS.vi.md): các gap về quy luật đời sống hiện đại, não bộ/thói quen, thơ–âm nhạc, quote cần story/context và nguyên tắc cân bằng nguồn cho các batch tiếp theo.
- [Hướng dẫn đưa một story vào Selflo Release](perspective-library/RELEASE_STORY_GUIDE.vi.md): cấu trúc thư mục, cách tìm quote qua `story_id`, các file cần cập nhật, Release gates và quy trình kiểm tra/publish.
- [Daily Content Review](scripts/DAILY_CONTENT_REVIEW.vi.md): chi tiết Candidate → Authoring → Release, quy tắc chọn batch, gate và cách khôi phục khi thao tác dở dang.

## Tìm nội dung vừa cập nhật và đã Release

Trong `/preview/`, chọn nguồn **Candidate**, **Authoring** hoặc **Đã Release**. Mặc định sắp theo **Cập nhật mới nhất**; lọc **Đợt mới nhất**, **7 ngày qua**, **30 ngày qua** kết hợp ô tìm tên/nội dung. Bộ lọc dùng được ở Review nhanh và Xem chi tiết.

- Link batch Candidate mới nhất: `/preview/?channel=candidate&updated=latest`.
- Link mới cập nhật: `/preview/?updated=latest`.
- Link bản phát hành: `/preview/?channel=release`.
- Ngày cập nhật là thời điểm từng quote/story thay đổi trong Library, dựa trên lịch sử payload và audit; không lấy ngày sửa cả theme hoặc ngày duyệt ledger. Ngày hiển thị theo múi giờ trình duyệt.
- Publisher tự sinh `updates.json` cho từng channel bằng `scripts/build-library-updates.py`; không sửa tay. Thiếu lịch sử thì để ngày trống.
