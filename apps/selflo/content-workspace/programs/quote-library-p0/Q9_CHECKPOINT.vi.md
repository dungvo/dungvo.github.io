# Q9 — checkpoint phân loại và biên tập

Ngày bắt đầu: 2026-10-21. Cập nhật: 2026-10-24 (Asia/Saigon). Reviewer: ai:codex. Owner yêu cầu AI làm trọn phần biên tập và chỉ review kết quả cuối; các gate nguồn, quyền và schema vẫn giữ nguyên.

## Trạng thái hiện tại — 2026-10-24

- Đã tạo và kiểm định **Authoring 86 / Release 47 trong workspace**: 1.851/672 quote, 63/17 story. Release thêm đúng 15 ID Pháp Cú; không sửa hoặc bỏ quote Release cũ, story descriptors giữ nguyên.
- Publisher chạy đầy đủ schema/semantic/rights/tag gates bằng Ruby 3.3.6, không skip schema. 16 tests attribution + prepare pass; mọi SHA-256 payload trong hai manifest khớp.
- Content lock được đồng bộ có lý do rõ, đúng 1.851 quote. Sửa liên kết bằng chứng quyền về checkpoint này.
- Matrix và báo cáo phân luồng đã rebuild theo 86/47. Tổng vẫn 5.471 dòng, 247 review ngữ nghĩa; đây không phải đã review toàn bộ.
- **Chưa push, merge hoặc deploy.** Branch GitHub đã xác minh vẫn trùng main (`ec1f303`). Automatic approval review chặn ghi remote vì không công nhận ủy quyền từ hội thoại chuyển tiếp; cần owner xác nhận trực tiếp lại. Đây không phải lỗi 403 của GitHub.
- Chi tiết bàn giao: [Q9_HANDOFF_2026-10-24.vi.md](Q9_HANDOFF_2026-10-24.vi.md); kiểm chứng: `reports/q9-release-verification.json`.
- Metadata `source.json.canonical_quote_count` kế thừa vẫn là 1.833; số thực tế 1.851 đã được đối chiếu từ payload và content lock. Publisher đưa metadata cũ này vào audit. Chưa thay field lịch sử trong scope batch; phiên sau cần làm rõ ý nghĩa field trước khi đồng bộ.

Các phần bên dưới lưu kết quả và blocker **trước khi hoàn tất ngày 24/10**, không thay thế trạng thái hiện tại.

## Kết quả đã lưu

- Matrix tái tạo từ Authoring 85 / Release 46: 5.471 dòng, 657 quote đã có trong Release.
- `reports/q9-corpus-classification.json`: định tuyến toàn bộ corpus, không phải chứng nhận đã đọc và duyệt từng quote.
- `reports/q9-source-work-queue.json`: 717 nhóm tác giả/tác phẩm/URL để xử lý theo nguồn.
- 1.851 dòng giữ theme canonical; 297 ánh xạ alias; 31 giữ theme research; 247 được review ngữ nghĩa riêng; 3.045 còn cần phân loại ngữ nghĩa.
- Trong 247 dòng review riêng, 215 được gán theme, 32 chưa gán vì là ghi chú nội bộ, lời tựa, lịch sử, thiếu ngữ cảnh hoặc capture trộn đoạn. Tổng số chưa gán theme là 3.077.
- Bổ sung hướng xử lý theo vai trò nội dung: 10 ghi chú nội bộ, 21 câu cần phục hồi ngữ cảnh, 33 đoạn nên xem xét Story/Reflection, 7 đoạn lời tựa/tiểu sử, 3 capture cần tách đoạn, 16 đoạn khoa học lịch sử, 12 định nghĩa/kết quả cần kiểm tra bằng chứng, 97 đoạn cần giữ bối cảnh truyền thống, 1 khẳng định quá rộng và 47 perspective candidate. Đây là nhãn cho 247 dòng đã đọc, không áp dụng suy đoán cho phần còn lại.
- Ngày 22/10 rà thêm 110 dòng thuộc Liệt Tử, Lão Tử, Marcus, Seneca, Pháp Cú/Nikāya, Aristotle, Epicurus, Plato và các nguồn khác. Ghi chú từng ID phân biệt nguyên văn với lời tóm tắt, chỉ ra từ Anh chưa Việt hóa và cặp cùng đoạn nguồn. Theme chỉ hỗ trợ tìm kiếm/biên tập, không thay thế review nguồn/quyền.
- Ba cụm trùng nguyên văn được đánh dấu, không tự xóa.
- Review 35 mục Pháp Cú: 15 đề xuất biên tập, 20 giữ lại để xử lý ngữ cảnh/dịch thuật. Xem `reports/q9-dhammapada-review.json`.

## Nguồn của batch Pháp Cú

- Catalog: https://www.gutenberg.org/ebooks/2017
- Văn bản đối chiếu: https://www.gutenberg.org/cache/epub/2017/pg2017-images.html
- Bản tiếng Anh F. Max Müller (1823–1900), Sacred Books of the East, Vol. X, Part I; catalog ghi public domain tại Hoa Kỳ. Bản tiếng Việt là lời phỏng theo mới, có ghi rõ xuất xứ, không chép bản dịch Việt hiện đại.
- Tham khảo thời hạn quyền tài sản với tác phẩm văn học tại Việt Nam: WIPO, Intellectual Property Adjudication in Viet Nam, mục 4.6.3: https://www.wipo.int/edocs/pubdocs/en/wipo-pub-1081-3-en-intellectual-property-adjudication-in-viet-nam.pdf
- Không suy rộng thành bảo đảm pháp lý cho mọi quốc gia; giữ tên tác phẩm, kệ và bản dịch làm nguồn đối chiếu.

## Kiểm định và trạng thái phát hành

`python3 scripts/classify-quote-corpus.py` chạy thành công; kiểm tra ID duy nhất, tổng route và theme hợp lệ. Semantic review được ràng buộc SHA-256 với văn bản đã đọc.

`python3 scripts/prepare-perspective.py --channel release --quote-file content-workspace/programs/quote-library-p0/reports/q9-dhammapada-review.json --reviewer ai:codex --dry-run` chạy thành công cho 15 ID.

`python3 -m unittest scripts/test_quote_attribution.py`: 2 pass, 2 fail. Attribution của bản nháp Pháp Cú chưa đồng bộ với package đã sinh; content lock có quote_count 1.850 trong khi canonical có 1.851. Cần xử lý qua workflow publisher và cập nhật lock có ghi nhận lý do, rồi chạy lại test. `git diff --check` không phát hiện lỗi whitespace.

**Chưa phát hành thêm quote.** Lần chạy publisher trước chưa hoàn tất; môi trường tiếp nối không còn Ruby đã build trong `/tmp`. Chưa cập nhật generated Authoring/Release, source revision hay content lock để giả lập thành công. Các sửa đổi canonical hiện là bản nháp chờ publisher/kiểm định; không merge hoặc deploy checkpoint này như một release hoàn chỉnh.

Kiểm tra tiếp nối: tải runtime Ruby từ máy chủ chính thức thất bại với `Proxy CONNECT aborted due to timeout`. Kết nối GitHub đã được cài và bật; đọc repo thành công, nhưng tạo branch trả HTTP 403 `Resource not accessible by integration`. Quyền admin/push của tài khoản không đồng nghĩa token của ứng dụng có quyền ghi. Chưa push, chưa tạo PR, chưa merge. Cần khôi phục quyền ghi của kết nối GitHub trước bước lưu từ xa.

## Việc còn lại

1. Khôi phục runtime Ruby được phép, chạy publisher đầy đủ và kiểm tra attribution/content lock theo quy trình repo; tái tạo matrix và báo cáo sau khi thành công.
2. Tiếp tục review theo nhóm nguồn; không tự chuyển toàn bộ research/raw sang Release.
3. Nhập series khi lấy được nội dung gốc. Hiện Substack trả “Site Unavailable”; không tạo nội dung hoặc tiêu đề tập giả.

## Cập nhật ủy quyền — 2026-10-25

Owner xác nhận trực tiếp: “push va merge vao main giup toi luon”. Quyết định này thay yêu cầu trước đây owner tự merge và chờ xác nhận ghi remote. Đã xác minh branch và main vẫn ở `ec1f303`; đang lưu kết quả qua GitHub connector, tạo PR và merge. Trạng thái merged phải đối chiếu PR/GitHub, không suy từ việc có file này. Sau merge, phiên mới tiếp tục review theo nhóm nguồn từ checkpoint Q9; series vẫn cần nội dung gốc.
