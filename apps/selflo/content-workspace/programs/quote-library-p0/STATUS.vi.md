# PM-QUOTE-P0 — Trạng thái chương trình quote

> **ĐÃ ĐÓNG Q10-B001 — 2026-10-25:** 166/166 dòng có kết luận: 102 giữ lại và 64 không đạt. Public Release 49 đã xác nhận 598 quote qua 9 pack/checksum; story giữ 17. Corpus đã kết luận **176/5.471** gồm 166 đợt này + 10 owner-closed mang sang; còn **5.295**. Xem `Q10_B001_CHECKPOINT.vi.md` và `reports/quote-closure-progress.json`. Bước tiếp theo Q10-B002 (166 dòng), chưa mở.

> **Q10-B001 — checkpoint 2026-10-25:** T-01/T-02 hoàn tất; đã review đủ 166 dòng, giữ 102, loại 64 (20 duplicate/43 context/1 misleading), sửa 51 văn bản và attribution Tăng Tử/Tử Du. Publisher Authoring 88 / Release 49 (1.851/598 quote; 63/17 story), 94 tests đạt. Chờ kiểm chứng public trước khi đóng batch; chưa mở B002. Bằng chứng `Q10_B001_CHECKPOINT.vi.md`, `reports/q10-b001-review.json`.

> **Checkpoint spec-driven 2026-10-25:** Đã hoàn thiện bộ `README → SPEC → CURRENT_STATE_REVIEW → DECISIONS → PLAN → TASKS → REVIEWS`, kế hoạch **36 batch, 100–200 dòng/batch, mục tiêu 150**. Chưa review nội dung batch mới; quote là ưu tiên duy nhất, story tạm dừng. Đọc `PLAN.vi.md` và `TASKS.vi.md` để thực hiện.

**Ưu tiên:** P0
**Trạng thái tổng:** Ưu tiên duy nhất: lập và thực hiện kế hoạch khép kín 5.471 dòng quote. Story tạm dừng theo owner ngày 2026-10-25. Phần baseline bên dưới là lịch sử.
**Bắt đầu:** 2026-10-12
**Cập nhật gần nhất:** 2026-10-25 — Authoring 87 / Release 48 (1.851/662 quote; 63/17 story); 81 tests pass sau bước đồng bộ báo cáo và bảo vệ đường ghi.
**Owner duyệt cuối:** Dũng
**Phạm vi:** Review toàn bộ corpus; đưa mọi quote đủ điều kiện lên Release; kết luận rõ cho mọi dòng không đủ điều kiện.

**Ủy quyền vận hành:** AI review từng item và có thể approve biên tập với reviewer `ai:codex`; owner nghiệm thu kết quả cuối. Nguồn, quyền, bản dịch và Release gate không được bypass. Xem [`AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md`](AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md).

## Kết quả cuối cần đạt

1. Một baseline không mâu thuẫn giữa workbook, canonical source, Authoring, Release và Studio.
2. Một lifecycle/status chính cho từng quote.
3. Mỗi dòng có identity và disposition rõ: Release, chờ duyệt, cần sửa, cần nguồn, bị chặn quyền, trùng, giữ nghiên cứu hoặc loại.
4. Candidate hợp lệ có chủ đề; có báo cáo khoảng trống để quyết định nghiên cứu bổ sung.
5. Mọi quote đủ điều kiện đã qua owner review và Release gate.

## Definition of Done hiện hành — chỉ đạo owner 2026-10-25

Thay tiêu chí đóng baseline cũ cho riêng chương trình quote bằng [kế hoạch khép kín 5.471 dòng](QUOTE_CLOSURE_PLAN_2026-10-25.vi.md). Đủ 5.471 ID có một kết luận cuối: **released** hoặc **not_accepted** có lý do/bằng chứng và chặn đề xuất lại. “Chưa dịch”, Research, pending hoặc chờ story không tính hoàn thành. Câu được chấp nhận phải qua gate và thực sự có trong Release public. Owner nghiệm thu báo cáo/sample; AI review từng dòng theo policy hiện có.

Không review/phát hành story trong chương trình này. Không loại quote chỉ vì tiếng Anh/Hoa/Hy Lạp; dịch và chuẩn hóa tên hiển thị trước khi đánh giá. Nguyên bản/provenance được giữ.

Các phase và checkpoint bên dưới phản ánh lịch sử, không chứng minh chương trình 5.471 đã hoàn tất.

## Tiến độ theo phase

| Phase | Nội dung | Trạng thái | Bằng chứng/đầu ra |
|---|---|---|---|
| Q0 | Đồng bộ baseline và dashboard | Hoàn thành | [`Q0_BASELINE_2026-10-12.vi.md`](Q0_BASELINE_2026-10-12.vi.md) |
| Q1 | Chuẩn hóa identity và trùng lặp | Hoàn thành | [`Q1_DUPLICATE_REVIEW_2026-10-12.vi.md`](Q1_DUPLICATE_REVIEW_2026-10-12.vi.md); chỉ còn 3 duplicate loser thật |
| Q2 | Phân loại chủ đề và coverage | Hoàn thành audit | [`Q2_THEME_COVERAGE_2026-10-12.vi.md`](Q2_THEME_COVERAGE_2026-10-12.vi.md); 3.050 raw rows chuyển sang Q5 normalization |
| Q3 | Xác minh nguồn và quyền | Hoàn thành cho baseline P0 | Câu chưa đủ bằng chứng đã kết luận Authoring hoặc Research/Raw; không còn bypass quyền |
| Q4 | Review nội dung và AI-delegated approval | Hoàn thành cho baseline P0 | 656 Release; 1.073 Authoring owner-review; phần còn lại Research/Raw |
| Q5 | Bổ sung theo khoảng trống | Ngoài phạm vi đóng baseline | Không cần bổ sung quote mới để kết luận 5.470 dòng hiện có |
| Q6 | Release theo đợt | Hoàn thành | Release 45 có 656 quote và đã kiểm tra trên web public |
| Q7 | Đối chiếu và đóng chương trình | Hoàn thành phần đã chốt; backlog tạm dừng | [`P0_FINAL_CLASSIFICATION_2026-10-13.vi.md`](P0_FINAL_CLASSIFICATION_2026-10-13.vi.md); 3.735 Research/Raw giữ để review sau |

## Phát hiện đã xác nhận

- Generator Review Matrix trước đây ghi vào `review-matrix/data.json`, nhưng Studio đọc `studio/review-matrix/data.json`; lỗi đã sửa.
- Dashboard đã được tạo lại và gắn thời gian/revision.
- Authoring hiện có 1.850 quote; trong đó hàng owner-review theo baseline là 1.079.
- Release 45 hiện có 656 quote trên 9 gói chủ đề.
- State của daily review có 1.432 candidate đã `imported`, nhưng AI ledger và matrix dùng lifecycle khác; cần hợp nhất trong Q0.

## Checkpoint gần nhất

Sổ ngày 2026-10-13 đã phân luồng đủ 5.470 dòng, nhưng **không còn được xem là kết luận cuối**: owner yêu cầu mở lại 3.741 Research/Raw, tìm thêm nguồn trên internet, dịch/chuẩn hóa và review trước khi loại. Batch enrichment đầu tiên đã review 100 raw capture *Truyện Kiều*: 6 câu được promote vào Authoring 84, 94 câu kết luận Research vì phụ thuộc narrative/context. Baseline hiện tại vẫn đối soát 5.470: 656 Release, 1.079 Authoring, 3.735 Research/Raw.

## Tiếp nối Q9 — 2026-10-24

Authoring 86: 1.851 quote/63 story; Release 47: 672 quote/17 story. Batch thêm đúng 15 Pháp Cú, đã qua publisher đầy đủ và 16 tests. Matrix 5.471 dòng, 247 review ngữ nghĩa. Phân luồng tự động không thay review nguồn/quyền.

Chưa push/merge/deploy: automatic approval review chặn ghi remote, cần owner xác nhận trực tiếp; GitHub không còn blocker 403 đã ghi trước đây. Series vẫn chưa có thân bài. Xem [hand-off](Q9_HANDOFF_2026-10-24.vi.md) và [checkpoint](Q9_CHECKPOINT.vi.md).

## Tiếp backlog — 2026-10-25

R1–R6 đã commit/push main tại fb65c40. Không dùng blocker upload Q9 cũ làm trạng thái hiện tại. PM-004A đã hoàn tất phần báo cáo: CLI dùng projection Review Matrix có kiểm tra fingerprint; không coi imported là review status. Đã audit đường ghi và mapping ID, thêm gate chống replay; xem [báo cáo đường ghi](PM004A_WRITE_GUARDS_2026-10-25.vi.md). State lịch sử chưa migrate. Xem [báo cáo PM-004A](PM004A_STATUS_REPORTING_2026-10-25.vi.md).

## Đúng một bước tiếp theo

Mở Q10-B002 (166 dòng Release) từ queue và tiếp tục cùng quy trình nguồn/ngôn ngữ/khử trùng. B001 đã đóng, không review lại 10 owner-closed. Không chuyển sang story.
