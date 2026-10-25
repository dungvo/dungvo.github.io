# PM-QUOTE-P0 — Workspace spec-driven khép kín kho quote

**Home canonical:** `content-workspace/programs/quote-library-p0/`. Tiếp tục chương trình hiện hữu, không tạo workspace app hoặc `specs/` song song. Theo `docs/agentic-content-workflow.md` và mẫu chương trình content spec-driven trong repo.

## Đọc theo thứ tự

1. `STATUS.vi.md`: checkpoint, quyết định hiện hành và đúng bước tiếp theo.
2. `SPEC.vi.md`: mục tiêu, phạm vi, yêu cầu và tiêu chí nghiệm thu.
3. `CURRENT_STATE_REVIEW.vi.md`: baseline và rủi ro đã kiểm tra.
4. `DECISIONS.vi.md`: chỉ đạo owner và lựa chọn vận hành.
5. `PLAN.vi.md`: mốc, batch 100–200 dòng và gate chuyển bước.
6. `TASKS.vi.md`: nhiệm vụ có thứ tự, trace về yêu cầu.
7. `REVIEWS.vi.md`: review kế hoạch và giới hạn.
8. `WORKLOG.vi.md`: nhật ký append-only và evidence.

## Source và authority

- Canonical quote: `perspective-library/source/vi/`; quyết định/quyền/Release vẫn qua ledger và publisher hiện hữu.
- Baseline cố định: `reports/quote-closure-baseline-2026-10-25.json`.
- Assignment queue: `reports/quote-closure-batch-plan-2026-10-25.json`; đây là kế hoạch chia việc, **không phải sổ review/approval**.
- Kết quả review từng ID phải đi vào nguồn quyết định hiện có hoặc index đã nối gate; không tạo ledger mới cạnh tranh mà các công cụ cũ không đọc.
- Story tạm dừng để owner đọc kỹ; không promote story trong chương trình quote.

Không cần UI mockup, BRD sản phẩm app hoặc kiến trúc runtime mới vì đây là chương trình nội dung, không đổi UI/wire contract. Nếu phát sinh thay đổi app-impacting thì phải tách quyết định/contract trước, không trộn vào batch.

Các checkpoint Q0–Q9 là lịch sử; không dùng số 5.470 hoặc trạng thái tạm dừng cũ làm mục tiêu hiện tại. Kế hoạch cũ `QUOTE_CLOSURE_PLAN_2026-10-25.vi.md` chỉ dẫn tới bộ spec/plan này.
