# Q10-B005 — đã phát hành bốn câu; batch vẫn mở

> **B005 REVIEW ĐỦ TOÀN ĐỢT — 2026-11-01:** Đã review **149/149**; lượt cuối 116 dòng gồm **50 đạt / 66 không nhận**. Authoring local **101**, Release giữ **61 (385 quote / 22 story)**. B005: 4 released + 93 không nhận + 2 owner-closed + 50 chờ Release; **99/149 khép kín**, không còn dòng chưa review. Corpus **769/5.471 đã chốt (14,06%), còn 4.702**, bao gồm 50 câu chờ phát hành. **95 tests đạt**; Release candidate tạm qua đủ gate, chưa cài vào checkout. Chưa commit/push; chờ lệnh owner. Handoff: [B005 toàn đợt local](Q10_B005_FULL_LOCAL_HANDOFF_2026-11-01.vi.md). Các checkpoint bên dưới là lịch sử.

> **B005 LOCAL — 2026-10-31:** Đã review 13 intake còn mở: 10 không xác minh được nguồn cho bản hiện có, 3 ghi chú phương pháp/phân tích; không Release thêm. B005 **33/149 đã chốt, còn 116**. Corpus **703/5.471 (12,85%)**, gồm 380 released + 323 không đạt, còn 4.768. Release 61 / Authoring 100 giữ nguyên. Ledger, exclusions, projection và Matrix đã đồng bộ; 31 tests đạt. Chưa commit/push, chờ lệnh owner. Chi tiết: [Review local B005](Q10_B005_LOCAL_REVIEW_2026-10-31.vi.md).

**Checkpoint 2026-10-26: Release 53 public đã xác nhận; chưa đóng B005.**

- Commit nội dung **0839fe7** đã push main. Public Release **53: 380 quote / 17 story**; Authoring **93: 1.851 quote / 63 story**.
- Đã thêm đúng bốn ID `.001/.002/.003/.004` thuộc prefix `research.day36.african_traditions_ii_ig.`. Đối chiếu text/attribution với bản đã duyệt, manifest và toàn bộ 9 quote pack SHA-256/byte_count; không có ID thừa/trùng, 14 câu B005 không đạt đều vắng mặt. Bằng chứng `reports/q10-b005-public-verification.json`.
- B005 có **18 kết luận mới: 4 released + 14 not_accepted**, bảo toàn **2 owner-closed**. Tổng 20/149 dòng đã chốt trong assignment; còn **129 dòng**, gồm 13 dòng intake đang nghiên cứu và 116 chưa bắt đầu. Không mở lại rejected, không mở B006/story.
- Corpus **690/5.471 đã chốt = 380 released + 310 không đạt; còn 4.781**. Không cộng owner-closed lần nữa. Projection kiểm tra ID/hash/evidence/public proof trước khi đếm.
- Nguồn/quyền của bốn câu: Taylor 1891 (§412/316/304) và Velten 1907 (tục ngữ 77, trang in 324/PDF 344), bản Việt diễn ý Selflo, nhãn Phỏng theo tục ngữ Swahili, tags và reviewer `ai:codex`. Source revision 76. Hồ sơ từng item và rights tại `reports/q10-b005-review.json`, `reports/q10-b005-swahili-rights.json`.
- Owner đã trả lời “tiep” ngay sau câu hỏi xác nhận phát hành bốn câu và push B005; phạm vi được thông báo lại trước thao tác. Không giả owner đã review từng câu.
- Đã đồng bộ 14 verdict không đạt vào cả ledger và publisher exclusion. Đã sửa projection để AI-approved chờ owner không rơi về chưa-review; không đổi schema/app contract.
- **94/94 tests đạt**, publisher schema/semantic/reference/coverage đạt. Toàn bộ 376 payload quote cũ và story descriptor không đổi. Chỉ phát hành quote, không sửa/review/promote story.
- File untracked ngoài Selflo giữ nguyên. Bản nội dung đã push; bằng chứng public và handoff được lưu trong commit tài liệu tiếp theo.

## Đúng một bước tiếp theo (cập nhật 2026-10-31)

Chờ lệnh owner cho bước nghiệm thu/phát hành và đưa kết quả B005 lên GitHub; chỉ đóng batch sau khi Release public được kiểm chứng. Chưa mở B006.
