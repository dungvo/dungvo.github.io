# Tasks — Quote closure

| ID | Task | Trace | Evidence/exit | Trạng thái |
|---|---|---|---|---|
| T-00 | Lập workspace và khóa assignment | Q-01,Q-11,Q-12 | SPEC/PLAN/TASKS; baseline 5.471 ID; 36 batch 100–200 | Hoàn thành phần lập kế hoạch |
| T-01 | Đối chiếu ledger/aliases/đường ghi verdict cho raw và canonical | Q-01,Q-02,Q-08 | Một decision authority; các tool cũ đọc/chặn đúng; không tạo ledger cạnh tranh | Hoàn thành 2026-10-25, evidence B001 + tests |
| T-02 | Seed bảng tên và mẫu evidence/batch report | Q-03,Q-04,Q-05,Q-12 | Tên gốc/Việt/type/source; locator/rights/hash/reason trước batch đầu | Hoàn thành 2026-10-25, glossary v1 |
| T-03 | Q10-B001–B004: 662 Release | Q-03–Q-10 | Review đủ từng dòng; fixes/withdrawals qua publisher; public verification | Hoàn thành 662/662, 376 released + 286 không đạt; public Release 52 và Q10_1_RELEASE_CLOSURE.vi.md |
| T-04 | Q10-B005–B012: 1.189 Authoring | Q-02–Q-10 | Không để câu đạt chưa publish hoặc chờ story; giữ 10 owner-rejected đóng | Tiếp theo B005 (149), chưa bắt đầu |
| T-05 | Q10-B013–B017: 821 research/nguồn/trùng | Q-02–Q-08 | Không chốt bằng nhãn cũ; mỗi ID có evidence/verdict | Chưa bắt đầu |
| T-06 | Q10-B018–B036: 2.799 raw | Q-02–Q-08 | Dịch/đối chiếu từng dòng; nguồn/quyền rõ; không loại do ngoại ngữ | Chưa bắt đầu |
| T-07 | Đối soát và nghiệm thu chương trình | Q-01–Q-12 | 5.471 = released + not_accepted; remaining 0; owner nghiệm thu | Chưa bắt đầu |

Mỗi task T-03–T-06 được triển khai tuần tự theo batch queue. Trạng thái planned trong queue không phải reviewed. Không tạo CLOSED hoặc verification PASS trước khi có evidence thật. Nếu cần sửa code/gates ở T-01, thêm task exact file/test point và review trước khi implement; không mở nhánh tooling ngoài mục tiêu quote.

## T-01/T-02 — Thiết kế thực hiện đã đối chiếu trước Q10-B001

- Quyết định duy nhất: tiếp tục `canonical-ai-review.json` cho cả baseline raw/canonical; verdict mới gắn `closure` metadata (program/batch/verdict/hash/canonical/evidence), không tạo ledger khác.
- `release_ready_ai_approved` là đánh giá biên tập của AI; chỉ manifest public đã kiểm chứng mới cho phép projection tính released. `round1_not_pass` cùng exclusions/canonical rejected chặn tái đề xuất.
- `scripts/build-review-matrix.py`: phủ quyết định không đạt trong ledger lên raw/excluded, tránh raw đã đóng vẫn báo collection_review_pending.
- Thêm `scripts/build-quote-closure-progress.py`: projection đối soát baseline + ledger + source + active manifest + bằng chứng public. Không dùng nó làm approval/publisher.
- Test tại `scripts/test_quote_closure_progress.py`: chưa có public proof, hash đổi, quote bị loại còn active, lý do thiếu/không hợp lệ, duplicate ID, raw bị loại, verdict chưa thuộc chương trình và đường hợp lệ.
- Seed bảng tên tại `reports/quote-display-names.vi.v1.json`; evidence/review từng dòng tại `reports/q10-b001-review.json`.
