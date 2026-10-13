# PM-QUOTE-P0 — Trạng thái chương trình quote

**Ưu tiên:** P0
**Trạng thái tổng:** Tạm dừng theo quyết định owner — chốt Release 45; 3.735 Research/Raw để review sau
**Bắt đầu:** 2026-10-12
**Cập nhật gần nhất:** 2026-10-13 — dừng enrichment sau batch Kiều; phát hành phần đã chốt
**Owner duyệt cuối:** Dũng
**Phạm vi:** Review toàn bộ corpus; đưa mọi quote đủ điều kiện lên Release; kết luận rõ cho mọi dòng không đủ điều kiện.

**Ủy quyền vận hành:** AI review từng item và có thể approve biên tập với reviewer `ai:codex`; owner nghiệm thu kết quả cuối. Nguồn, quyền, bản dịch và Release gate không được bypass. Xem [`AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md`](AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md).

## Kết quả cuối cần đạt

1. Một baseline không mâu thuẫn giữa workbook, canonical source, Authoring, Release và Studio.
2. Một lifecycle/status chính cho từng quote.
3. Mỗi dòng có identity và disposition rõ: Release, chờ duyệt, cần sửa, cần nguồn, bị chặn quyền, trùng, giữ nghiên cứu hoặc loại.
4. Candidate hợp lệ có chủ đề; có báo cáo khoảng trống để quyết định nghiên cứu bổ sung.
5. Mọi quote đủ điều kiện đã qua owner review và Release gate.

## Definition of Done đã chốt

P0 chỉ hoàn thành khi **đủ 5.470/5.470 dòng** có identity, phân loại và đúng một kết luận cuối:

1. đã Release;
2. đủ điều kiện Release;
3. cần owner review và giữ trong Authoring;
4. cần sửa;
5. cần xác minh nguồn;
6. bị chặn quyền;
7. bản trùng;
8. giữ làm nghiên cứu;
9. loại.

Tổng các nhóm phải bằng 5.470; không còn `imported`, `unresolved`, `pending` hoặc trạng thái mơ hồ. Mọi quote đủ điều kiện phải được Release và kiểm tra trên web công khai. Authoring chỉ giữ nội dung có giá trị cần fit/edit/story review, không dùng làm nơi chứa raw, duplicate hoặc rejected. Owner không phải review từng câu; AI được ủy quyền theo policy và owner nghiệm thu báo cáo cuối.

Chuẩn đầy đủ: [`../DEFINITION_OF_DONE.vi.md`](../DEFINITION_OF_DONE.vi.md).

## Tiến độ theo phase

| Phase | Nội dung | Trạng thái | Bằng chứng/đầu ra |
|---|---|---|---|
| Q0 | Đồng bộ baseline và dashboard | Hoàn thành | [`Q0_BASELINE_2026-10-12.vi.md`](Q0_BASELINE_2026-10-12.vi.md) |
| Q1 | Chuẩn hóa identity và trùng lặp | Hoàn thành | [`Q1_DUPLICATE_REVIEW_2026-10-12.vi.md`](Q1_DUPLICATE_REVIEW_2026-10-12.vi.md); chỉ còn 3 duplicate loser thật |
| Q2 | Phân loại chủ đề và coverage | Hoàn thành audit | [`Q2_THEME_COVERAGE_2026-10-12.vi.md`](Q2_THEME_COVERAGE_2026-10-12.vi.md); 3.050 raw rows chuyển sang Q5 normalization |
| Q3 | Xác minh nguồn và quyền | Hoàn thành cho baseline P0 | Câu chưa đủ bằng chứng đã kết luận Authoring hoặc Research/Raw; không còn bypass quyền |
| Q4 | Review nội dung và AI-delegated approval | Hoàn thành cho baseline P0 | 656 Release; 1.073 Authoring owner-review; phần còn lại Research/Raw |
| Q5 | Bổ sung theo khoảng trống | Ngoài phạm vi đóng baseline | Không cần bổ sung quote mới để kết luận 5.470 dòng hiện có |
| Q6 | Release theo đợt | Hoàn thành package local | Release 45 có 656 quote; chưa deploy web |
| Q7 | Đối chiếu và đóng chương trình | Hoàn thành phân loại | [`P0_FINAL_CLASSIFICATION_2026-10-13.vi.md`](P0_FINAL_CLASSIFICATION_2026-10-13.vi.md); deployment còn là bước phát hành riêng |

## Phát hiện đã xác nhận

- Generator Review Matrix trước đây ghi vào `review-matrix/data.json`, nhưng Studio đọc `studio/review-matrix/data.json`; lỗi đã sửa.
- Dashboard đã được tạo lại và gắn thời gian/revision.
- Authoring hiện có 1.844 quote và 62 story.
- Release hiện có 318 quote và 16 story.
- State của daily review có 1.432 candidate đã `imported`, nhưng AI ledger và matrix dùng lifecycle khác; cần hợp nhất trong Q0.

## Checkpoint gần nhất

Sổ ngày 2026-10-13 đã phân luồng đủ 5.470 dòng, nhưng **không còn được xem là kết luận cuối**: owner yêu cầu mở lại 3.741 Research/Raw, tìm thêm nguồn trên internet, dịch/chuẩn hóa và review trước khi loại. Batch enrichment đầu tiên đã review 100 raw capture *Truyện Kiều*: 6 câu được promote vào Authoring 84, 94 câu kết luận Research vì phụ thuộc narrative/context. Baseline hiện tại vẫn đối soát 5.470: 656 Release, 1.079 Authoring, 3.735 Research/Raw.

## Đúng một bước tiếp theo

Commit/push và kiểm tra web công khai cho Release 45 có 656 quote. Khi owner mở lại backlog, tiếp tục từ 3.735 Research/Raw và report Q8 hiện có; không quét lại từ đầu.
