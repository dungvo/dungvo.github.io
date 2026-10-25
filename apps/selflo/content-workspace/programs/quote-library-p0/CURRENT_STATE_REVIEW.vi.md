# Current-state review — 25/10/2026

> **Q10-B002 ĐÃ ĐÓNG — 2026-10-25:** 166 câu: 75 giữ, 91 không đạt; 50 bản viết lại. Release 50 public đã xác nhận 507 quote / 17 story qua 9 pack/checksum; 94 tests đạt. Corpus **342/5.471 đã chốt, còn 5.129** (177 released, 165 not_accepted, gồm 10 owner-closed). Commit nội dung `f2fd929`. Tiếp Q10-B003 (165); story tiếp tục tạm dừng.

## Bằng chứng hiện hành

- HEAD trước lượt lập workspace: 15a3179. Có thay đổi tài liệu kế hoạch chưa commit từ lượt trước; giữ nguyên ý định, hợp nhất thành bộ spec-driven này.
- Authoring 87: 1.851 quote / 63 story. Release 48: 662 quote / 17 story.
- Review Matrix: 5.471 ID duy nhất; 662 Release + 1.189 Authoring chưa Release + 3.620 excluded/raw.
- Chia 3.620 excluded thành 821 dòng research/nguồn/trùng (634+184+3) và 2.799 needs_normalization.
- 729 nhóm tác giả/tác phẩm/URL theo metadata. Đây là nhóm cơ học, không chứng nhận nguồn hoặc nghĩa đã được review.
- 33 held_not_passed có 10 ID owner vừa loại; những quyết định owner đã đóng không được mở lại để tăng số review.
- Công cụ đã có shared eligibility gate, chặn replay qua alias và ghi state sớm; suite gần nhất 81/81 đạt ở lượt sửa công cụ. Lượt lập workspace không chạy lại test runtime vì chỉ đổi tài liệu/assignment.

## Rủi ro cần giữ trong plan

1. Tăng số dòng/batch không biến phân loại tự động thành review nội dung.
2. Một batch 150 dòng có thể có nhiều nguồn/edition, độ khó khác nhau; không cam kết thời gian cố định.
3. Nhiều dòng raw không phải quote độc lập, nhưng chỉ kết luận sau khi đọc ngữ cảnh và dịch khi cần.
4. Người dịch/edition có quyền riêng; giữ ghi công đầy đủ và không coi tên tác phẩm là tên tác giả.
5. Lịch 36 batch là assignment snapshot, không phải review ledger hay kết quả nghiệm thu.
6. Source/name work xuyên batch được dùng lại khi đúng edition/locator/hash, tránh tra nguồn lặp mà vẫn giữ verdict từng dòng.

## Đối chiếu workflow

Home content tuân theo docs/agentic-content-workflow.md và content-workspace/programs/README.md; không tạo Docs/workspaces trong app repo cho việc content. Có spec/plan/tasks/decisions/reviews/status/worklog; không tạo mockup hoặc kiến trúc runtime giả vì không có UI change.
