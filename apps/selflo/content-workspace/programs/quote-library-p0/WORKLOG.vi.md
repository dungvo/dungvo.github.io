# PM-QUOTE-P0 — Nhật ký công việc

Nhật ký này append-only. Không xóa các checkpoint cũ khi trạng thái thay đổi.

## 2026-10-12 — Khởi tạo chương trình và phát hiện lỗi dashboard

### Đã làm

- Rà các nguồn trạng thái: workbook, Review Matrix, Authoring/Release manifest, AI review ledger và daily review state.
- Xác nhận Authoring hiện có 1.844 quote/62 story; Release có 318 quote/16 story.
- Phát hiện Review Matrix đang dùng baseline cũ.
- Phát hiện generator ghi sai thư mục, không cập nhật file Studio đang đọc.
- Sửa generator để ghi vào `studio/review-matrix/data.json`.
- Bổ sung `generated_at`, `authoring_revision` và `release_revision` vào output.
- Tạo Registry, STATUS và WORKLOG cho chương trình.

### File thay đổi

- `scripts/build-review-matrix.py`
- `content-workspace/programs/README.md`
- `content-workspace/programs/quote-library-p0/STATUS.vi.md`
- `content-workspace/programs/quote-library-p0/WORKLOG.vi.md`

### Giá trị mang lại

- Lần rebuild tiếp theo sẽ cập nhật đúng dashboard Studio.
- Mỗi snapshot có thời gian và revision để biết có còn mới hay không.
- Công việc có checkpoint bền vững; phiên sau không cần suy đoán đã làm tới đâu.

### Trạng thái khi ghi log

Q0 đang thực hiện; chưa rebuild và chưa nghiệm thu.

## 2026-10-12 — Hoàn thành Q0

### Đã làm

- Chạy lại generator bằng workspace runtime có thư viện Excel.
- Tạo mới Matrix từ Authoring revision 81 và Release revision 43.
- Thêm trạng thái PM và hành động tiếp theo cho đủ 5.470 dòng.
- Viết mô hình trạng thái và báo cáo baseline Q0.
- Xác nhận tổng pipeline, tổng PM status, JSON và diff đều hợp lệ.

### Kết quả

- 1.844 quote Authoring; 318 quote Release.
- 1.322 quote sẵn sàng chờ owner review.
- 2.805 dòng cần chuẩn hóa.
- 193 dòng cần xác minh nguồn; 83 dòng bị chặn quyền.
- 204 dòng đang giữ vì trùng; Q1 sẽ phân tích cluster chi tiết.

### Giá trị mang lại

- Dashboard Studio đã phản ánh dữ liệu hiện tại.
- Từng dòng có trạng thái vận hành và bước tiếp theo.
- Có checkpoint Q0 độc lập để phục hồi công việc nếu phiên bị ngắt.

### Trạng thái khi ghi log

Q0 hoàn thành; Q1 bắt đầu. Không có nội dung nào được tự động Release.

## 2026-10-12 — Hoàn thành Q1

### Đã làm

- Xuất 21 legacy exact clusters và 14 near-duplicate clusters.
- Phát hiện 19 legacy exact clusters chứa các văn bản khác nhau.
- Thêm phép chuẩn hóa văn bản độc lập.
- Xác định ba cụm/sáu dòng trùng thật và chọn winner theo Release → Authoring → Research.
- Sửa Matrix để chỉ ba bản thua thật nhận `duplicate_hold`.
- Giữ 163 near-duplicate rows chờ phán đoán biên tập.

### Giá trị mang lại

- Tránh loại nhầm hơn 200 quote.
- Identity/disposition của trùng thật đã rõ mà vẫn giữ provenance.

### Trạng thái khi ghi log

Q1 hoàn thành; Q2 bắt đầu.

## 2026-10-12 — Hoàn thành audit Q2

### Đã làm

- Kiểm tra toàn bộ 3.050 dòng theme unresolved.
- Xác nhận toàn bộ đều ở Research/excluded, không nằm trong Authoring hoặc Release.
- Phân tích theo batch, source family và tác giả.
- Xác định source family không thể dùng thay theme nội dung.
- Lưu coverage report và gap list.

### Giá trị mang lại

- Production không bị chặn vì thiếu theme.
- 3.050 dòng raw có đường xử lý theo batch, không bị quên hoặc gán tag đoán.

### Trạng thái khi ghi log

Q2 audit hoàn thành; Q3 bắt đầu. Normalization chi tiết của raw corpus được giữ ở Q5.

## 2026-10-12 — Q3 checkpoint 1

### Đã làm

- Gom 1.526 Authoring quote thành 485 nhóm author/work/source.
- Xác nhận 1.491 quote Authoring chưa Release vẫn có rights `unverified`.
- Kiểm tra chính sách chính thức của Project Gutenberg, Wikisource, Chinese Text Project và Perseus.
- Viết policy phân biệt quyền tác phẩm gốc, edition, bản dịch, bản Việt và website source.

### Phát hiện

- Không thể nâng rights hàng loạt dựa trên tuổi của tác giả.
- Perseus và Chinese Text Project cần kiểm tra item cụ thể hoặc nguồn thay thế.
- Project Gutenberg cần kiểm tra ebook header/translator/edition và phạm vi pháp lý.
- Wikisource cần kiểm tra template/license của từng item.

### Giá trị mang lại

- Tránh Release nhầm bản dịch hoặc database text có hạn chế quyền.
- Q3 chuyển từ 1.491 quote rời rạc thành 485 source groups có thể xử lý theo batch.

### Trạng thái khi ghi log

Q3 đang thực hiện; chưa thay rights canonical và chưa Release quote mới.

## 2026-10-12 — Chốt Definition of Done và kiến trúc Studio → public

### Đã làm

- Ghi Definition of Done cho Quote, Góc Nhìn, Knowledge, Studio/public, hình ảnh/chuyển động và quản lý chương trình.
- Chốt Studio là môi trường phát triển/nghiệm thu đầy đủ; web công khai là tập con production đã Release từ cùng hệ thống.
- Chốt P0 chỉ hoàn thành khi đủ 5.470/5.470 dòng có một kết luận cuối và tổng được đối soát.
- Chốt Authoring không phải nơi giữ raw, duplicate hoặc rejected; chỉ giữ nội dung thật sự cần review/sửa.

### Giá trị mang lại

- Tránh xây và duy trì hai phiên bản Studio/public song song.
- Không thể gọi P0 hoàn thành khi còn dòng mơ hồ hoặc chỉ mới tạo dashboard.
- Có tiêu chuẩn bền vững để phiên sau tiếp tục đúng checkpoint.

### Trạng thái khi ghi log

Q3 tiếp tục; bước kế tiếp là verdict batch nguồn/quyền đầu tiên.

## 2026-10-12 — Q3 checkpoint 2: phân luồng 485 nhóm nguồn

### Đã làm

- Bổ sung report phân luồng nguồn/quyền cho toàn bộ nhóm Authoring chưa Release.
- Tách route cho Project Gutenberg, Wikisource, Chinese Text Project, Perseus, nguồn nghiên cứu, Selflo-owned, thiếu nguồn, copyright blocked và review thủ công.
- Giữ `rights_verdict = not_yet_decided`; route không được dùng để tự cấp quyền hay tự Release.

### Giá trị mang lại

- 485 nhóm đều có hành động tiếp theo, không còn phải xử lý 1.526 quote như các trường hợp rời rạc.
- Tách rõ nguồn dùng làm bằng chứng nghiên cứu với nguồn cho một câu trích dẫn có thể phát hành.
- Tránh biến việc phân luồng tự động thành quyết định pháp lý giả.

### Trạng thái khi ghi log

Q3 đang thực hiện. Cần chạy lại report và bắt đầu verdict cấp item/edition cho Wikisource/Project Gutenberg.

## 2026-10-12 — Q4 batch 01: review nhóm quyền rõ nhất

### Đã làm

- Review 34 quote `selflo_owned` và 1 quote `public_domain` trong Authoring.
- Phân loại 25 câu sẵn sàng owner nghiệm thu quote-only, 7 câu cần biên tập, 2 câu không đạt và 1 câu cần review bản dịch/nguồn.
- Kiểm tra 32 story liên kết: tất cả vẫn `draft/unverified`; không đưa story vào shortlist Release.
- Xác định publisher có thể phát hành quote độc lập và project `story_id = null` khi story chưa Release-ready.

### Giá trị mang lại

- Có batch nhỏ đầu tiên mà owner có thể đọc và nghiệm thu ngay.
- Không bắt quote có quyền rõ phải chờ toàn bộ story, nhưng cũng không lách gate quyền của story.
- Tách rõ “AI thấy nội dung đạt” với “owner đã duyệt và package đã qua Release gate”.

### Trạng thái khi ghi log

Q4 batch 01 chờ owner nghiệm thu 25 quote-only. Q3 vẫn tiếp tục với nguồn ngoài Selflo.

## 2026-10-12 — Owner ủy quyền AI review toàn bộ 5.470 dòng

### Quyết định

- AI được review và approve biên tập từng quote thay owner; reviewer phải ghi `ai:codex`, không giả danh owner.
- Quote dịch trực tiếp có nguồn/locator rõ được ưu tiên xử lý trước.
- Nguồn rõ không bypass quyền edition/bản dịch, độ chính xác tiếng Việt, Selflo fit hoặc Release gate.
- Câu đúng nguồn nhưng chưa đúng Selflo tiếp tục ở Authoring để xem lại sau.
- Owner nghiệm thu kết quả cuối qua báo cáo đối soát, sample và preview, không cần đọc đủ 5.470 câu.

### Trạng thái khi ghi log

Q3/Q4 tiếp tục song song. Lane ưu tiên đầu là 513 `translated_quote` đang ở Authoring, sau đó `direct_quote`, passage/proverb và các loại còn lại.

## 2026-10-12 — Release batch 01 hoàn thành

### Đã làm

- Thêm chế độ `--quote-only` có test để duyệt quote mà không thay lifecycle/quyền của story.
- AI duyệt 25 quote Selflo với reviewer `ai:codex`.
- Bổ sung tag content contract cho đúng 25 quote; Release gate đã bắt thiếu tag ở lần chạy đầu và transaction dừng an toàn.
- Chạy lại publisher thành công: Authoring 82, Release 44.
- Rebuild Review Matrix: 5.470 dòng đối soát đủ; Release tăng từ 318 lên 343; Authoring pending giảm từ 1.526 xuống 1.501.

### Giá trị mang lại

- 25 quote đầu tiên đã đi hết quy trình AI review → canonical → gate → Release local.
- 32 story chưa xác minh không bị duyệt ké; Release dùng quote-only với liên kết story bằng `null`.
- Workflow mới cho phép tiếp tục theo batch mà không cần owner đọc từng câu.

### Trạng thái khi ghi log

P0 chưa hoàn thành. Tiếp tục 513 `translated_quote` Authoring theo source group.

## 2026-10-12 — Đóng P0 theo phạm vi ưu tiên mới

### Quyết định owner

- Không yêu cầu hoàn tất review toàn bộ 5.470 dòng trước khi chuyển phase.
- Release nhanh mọi quote chắc chắn đạt đủ bốn điều kiện; phần cần verify lâu hơn chuyển backlog có checkpoint.

### Đối soát fast lane

- Release hiện có 343 quote.
- Authoring còn 1.501 quote: 1.491 rights unverified, 1 public-domain cần review dịch/nguồn và 9 Selflo-owned cần sửa/không đạt/review thêm.
- Không còn candidate nào chắc chắn đủ cả bốn điều kiện để Release ngay mà không làm thêm source/rights/translation/edit review.

### Trạng thái khi ghi log

P0 hoàn thành phạm vi ưu tiên và không còn chặn phase khác. Review toàn-corpus được giữ làm backlog phục hồi được.

## 2026-10-13 — Full scan 5.470 và Release 45

### Đã làm

- Chạy scanner bảo thủ qua đủ 5.470/5.470 dòng.
- Chọn 313 candidate mới có AI fit pass, verification A, dạng dịch/trích trực tiếp, witness cổ Wikisource rõ, không gắn story và dependency đã đạt.
- Dry-run toàn batch; bổ sung tag theo theme và origin classical text.
- Ghi quyền/bằng chứng ở canonical, reviewer `ai:codex`.
- Publisher Authoring 83 và Release 45 đều pass.
- Đối soát 313/313 candidate có trong Release; tổng Release tăng từ 343 lên 656.

### Kết luận

- 656/5.470 dòng nằm trong strict Release pool ở thời điểm scan.
- 4.814 dòng còn lại tạm bỏ qua; không tiếp tục phân loại/verify trong phase này.
- P0 full-scan fast lane hoàn thành và không chặn phase khác.
# Worklog 2026-10-13 — đóng phân loại 5.470 quote

- Owner đổi chiến lược từ fast lane sang kết luận toàn bộ corpus.
- Tạo sổ disposition cấp từng dòng bằng `scripts/finalize-quote-p0-dispositions.py`.
- Đối soát đủ 5.470: 656 Release, 1.073 Authoring owner-review, 3.741 Research/Raw.
- Giữ nguyên nguyên tắc fail-closed: không nâng câu còn mơ hồ về nguồn, quyền, edition, bản dịch hoặc loại nội dung.
- Lưu báo cáo nghiệm thu tại `P0_FINAL_CLASSIFICATION_2026-10-13.vi.md` và `reports/p0-final-dispositions.json`.
- Release 45 vẫn là package local; deployment web là bước còn lại ngoài phân loại corpus.

## 2026-10-13 — mở lại Research/Raw để enrichment đầy đủ

- Owner bác bỏ việc coi 3.741 Research/Raw là kết luận cuối nếu chưa chủ động bổ sung phần thiếu.
- Tạm dừng deployment Release 45 để tránh đóng P0 quá sớm.
- Xác nhận 2.905 raw capture gom thành khoảng 22 source/work groups lớn; 2.805 đến từ Project Gutenberg/Wikisource và 100 từ Wikipedia cần thay nguồn gốc.
- Bắt đầu xác minh chính sách quyền của Project Gutenberg từ trang license chính thức; catalog public-domain tại Mỹ không tự động giải quyết quyền ở mọi jurisdiction.
- Hướng xử lý mới: source-group rights/edition review → lọc quote thực sự → dịch/chuẩn hóa → editorial review → Authoring/Release hoặc loại có lý do.

### Kết quả enrichment đầu tiên

- Tạo `scripts/audit-quote-raw-source-groups.py` và report `reports/q8-raw-source-groups.json`.
- Đối soát 2.905 raw item thành 71 group URL/work; 22 Project Gutenberg edition bao phủ 2.705 item.
- Kiểm tra trực tiếp 22 catalog; 21 trả metadata public-domain tại Mỹ ngay trong audit, edition *Philippine Folk Tales* được xác nhận bổ sung bằng cả catalog và header ebook.
- Tạo item review cho 100 raw capture đầu *Truyện Kiều*: 6 cặp câu có tiềm năng chuyển Authoring, 94 cặp là narrative/contextual nên giữ Research; tổng 100/100.
- Report: `reports/q8-kieu-item-review.json`.
- Sửa staged transaction của `daily-content-review.py` để publisher nhìn thấy semantic validators; lần chạy lỗi không ghi payload dở dang.
- Chuẩn hóa sáu raw range ID sang stable ID hợp contract và giữ raw ID trong provenance.
- Promote thành công 6/6 câu vào Authoring revision 84; Release giữ revision 45.
- Sửa Review Matrix để canonical quote được promote từ supplemental raw thay thế đúng raw row, không làm tổng baseline tăng giả.
- Rebuild và đối soát: 5.470 tổng; 656 Release, 1.079 Authoring, 3.735 Research/Raw; raw chưa chuẩn hóa giảm từ 2.805 còn 2.799.

## 2026-10-13 — owner chốt tạm dừng enrichment và phát hành phần đã duyệt

- Dừng review 3.735 Research/Raw để owner quay lại sau.
- Không promote sáu câu Kiều từ Authoring lên Release; chúng vẫn cần owner review.
- Chốt Release 45 với đúng 656 quote làm gói public hiện tại.
- Checkpoint phục hồi: `reports/q8-raw-source-groups.json`, `reports/q8-kieu-item-review.json`, Authoring 84 và Review Matrix hiện hành.

## 2026-10-13 — Release 45 đã public

- Commit phát hành: `21e4812` (`Publish Selflo quote Release 45`).
- Đã push lên `origin/main`.
- Đã kiểm tra manifest trên GitHub Pages: `library_revision = 45`.
- Đã tải và đếm cả 9 gói chủ đề public: tổng đúng 656 quote.
- 1.079 quote cần owner review tiếp tục ở Authoring; 3.735 dòng Research/Raw giữ nguyên để xử lý sau.
