# Q3 — Phân luồng nguồn và quyền cho Authoring

**Trạng thái:** Checkpoint 2; chưa phải phán quyết quyền cuối
**Ngày:** 2026-10-12
**Phạm vi:** 1.526 quote Authoring chưa Release, 485 nhóm nguồn

## Kết quả checkpoint

Toàn bộ 485 nhóm đã được đưa vào một hàng đợi có hành động tiếp theo. Report máy đọc: [`reports/q3-source-rights-routing.json`](reports/q3-source-rights-routing.json).

Phân luồng này giải quyết câu hỏi **phải kiểm tra gì tiếp theo**, không khẳng định một nội dung được phép Release. Trường `rights_verdict` vẫn là `not_yet_decided` cho đến khi có bằng chứng ở cấp item/edition/bản dịch.

| Route | Số nhóm | Số quote |
|---|---:|---:|
| Kiểm tra license/attribution Wikisource | 49 | 405 |
| Review thủ công nguồn khác | 170 | 336 |
| Kiểm tra ebook/edition Project Gutenberg | 111 | 273 |
| Phân loại lại nguồn nghiên cứu | 127 | 202 |
| Tìm nguồn thay thế/quyền item Chinese Text Project | 10 | 98 |
| Chặn copyright | 1 | 83 |
| Tìm source/object license thay Perseus | 15 | 71 |
| Thiếu nguồn | 2 | 58 |
| **Tổng** | **485** | **1.526** |

## Luật phân luồng

| Nhóm | Việc phải làm |
|---|---|
| Project Gutenberg | Kiểm tra ebook cụ thể, header quyền, edition/translator và bản Việt |
| Wikisource | Kiểm tra license/template của từng trang, attribution và bản Việt |
| Chinese Text Project | Tìm nguồn public-domain thay thế hoặc xác minh quyền item cụ thể |
| Perseus | Kiểm tra license object cụ thể hoặc thay bằng edition public-domain |
| Nguồn nghiên cứu như PubMed/DOI | Xác định nội dung là quote, diễn giải Selflo hay research digest trước khi xét quyền |
| Selflo-owned | Kiểm tra provenance nội bộ và chất lượng nội dung |
| Thiếu URL/locator | Bổ sung nguồn hoặc kết luận giữ nghiên cứu/loại |
| *Nhà giả kim* | Giữ chặn copyright; không đưa Release nếu chưa có permission/cơ sở quyền phù hợp |
| Nguồn còn lại | Review thủ công theo item, edition/bản dịch và locator |

## Gate để kết thúc Q3

Q3 chỉ hoàn thành khi cả 485/485 nhóm không còn `not_yet_decided` và từng quote kế thừa được một phán quyết có bằng chứng. Việc có tác giả cổ hoặc host uy tín không tự động tạo quyền sử dụng.

## Đúng một bước tiếp theo

Xử lý batch Wikisource và Project Gutenberg ở cấp item/edition, ưu tiên nhóm có nhiều quote nhất; lưu bằng chứng và verdict vào ledger trước khi sửa canonical source.
