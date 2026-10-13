# Selflo content — Bàn giao khi tạm dừng các phase

**Ngày chốt:** 2026-10-13
**Quyết định owner:** Tạm dừng toàn bộ các phase đang mở và tiếp tục ở session khác.
**Phạm vi:** Repo content/web `apps/selflo`; không thay đổi repo App.

## Trạng thái tổng

Hiện không có chương trình nào được xem là đang chạy. Không tự động tiếp tục enrichment quote, review story, viết thêm Knowledge, tạo artwork hoặc publish nội dung mới khi chưa có yêu cầu mở lại của owner.

| Chương trình | Trạng thái | Đã chốt được gì | Còn lại |
|---|---|---|---|
| Quote P0 | Tạm dừng | Release 45 public có 656 quote; kiểm tra đủ 9 gói; 24 kiểm thử đạt | 1.079 quote ở Authoring và 3.735 Research/Raw để review sau |
| Story P1 | Tạm dừng | Baseline 62 Authoring, 16 Release, 46 Authoring-only; audit gate đã lưu | Owner sẽ đọc và bổ sung story sau; chưa story nào trong 46 được promote |
| Knowledge P1 | Tạm dừng | Đã hợp nhất ba tài liệu thành bản bài 01 về so sánh xã hội/ghen tị | Chờ owner đọc; chưa có artwork, Authoring hoặc Release |

## 1. Quote P0

### Đã hoàn thành

- Scan và đối soát baseline 5.470 dòng.
- Release 45 đã public với đúng 656 quote.
- Đã kiểm tra trực tiếp manifest và đủ 9 quote pack trên GitHub Pages.
- Đã lưu chính sách review, disposition report và checkpoint enrichment.

### Đang giữ lại

- 1.079 quote ở Authoring để owner review.
- 3.735 dòng Research/Raw chưa xử lý tiếp.
- Sáu câu Truyện Kiều mới ở Authoring 84, chưa Release.

### Khi quay lại

Đọc theo thứ tự:

1. [`quote-library-p0/STATUS.vi.md`](quote-library-p0/STATUS.vi.md)
2. phần cuối [`quote-library-p0/WORKLOG.vi.md`](quote-library-p0/WORKLOG.vi.md)
3. `quote-library-p0/reports/q8-raw-source-groups.json`
4. `quote-library-p0/reports/q8-kieu-item-review.json`

Tiếp tục từ 3.735 Research/Raw; không quét lại 5.470 dòng và không thay đổi Release 45 nếu chưa có batch mới đạt gate.

## 2. Story P1

### Đã hoàn thành

- So Authoring/Release bằng stable `story_id`, không dùng filename revision.
- Xác nhận 46 story Authoring-only.
- Audit tự động cho lifecycle, quyền, owner review, human edit, hero image và quote link.
- Kết quả: 0/46 đủ Release gate ngay; 46 thiếu hero, 46 chưa xác nhận human edit, 45 chưa clear quyền, 41 thiếu owner review và 18 chưa có quote liên kết trong Release.

### Khi quay lại

Đọc theo thứ tự:

1. [`story-authoring-review/STATUS.vi.md`](story-authoring-review/STATUS.vi.md)
2. phần cuối [`story-authoring-review/WORKLOG.vi.md`](story-authoring-review/WORKLOG.vi.md)
3. `story-authoring-review/reports/authoring-only-stories.json`

Owner đã chọn tự đọc và bổ sung story. Không bulk-release 46 story và không dùng trạng thái quote để duyệt thay story.

## 3. Knowledge P1

### Đã hoàn thành

- Chọn câu hỏi đầu tiên: “Vì sao thành công của người khác đôi khi làm ta khó chịu?”
- Đọc một bản phân tích nền và hai bản viết cạnh tranh.
- Kiểm tra lại các nguồn cốt lõi; loại citation placeholder.
- Viết một bản hợp nhất bằng tiếng Việt, tập trung vào cơ chế so sánh xã hội, khoảng cách mong muốn, cảm nhận xứng đáng và khả năng kiểm soát.

### Chưa hoàn thành

- Owner chưa đọc/chấp nhận nội dung.
- Chưa có artwork.
- Chưa chọn content type/package cuối.
- Chưa đưa vào Authoring hoặc Release.

### Khi quay lại

1. Đọc [`knowledge-article-p1/DRAFT_VI_01.vi.md`](knowledge-article-p1/DRAFT_VI_01.vi.md).
2. Đánh dấu đoạn khó hiểu, không chạm, chưa có kiến thức mới hoặc claim cần giải thích thêm.
3. Sửa chính bài này trước khi mở chủ đề mới.
4. Chỉ sau khi owner chấp nhận nội dung mới bàn artwork, Authoring và Release.

## Các quyết định vẫn còn hiệu lực

- Rhythm pattern → Knowledge tiếp tục tạm dừng; không quay lại K1–K9.
- Studio là môi trường phát triển/nghiệm thu đầy đủ; web public là tập con đã Release từ cùng pipeline.
- Không sửa tay output Authoring/Release.
- Không chạm repo App trong các phase content này.
- Nội dung tiếng Việt; thuật ngữ chuyên môn tiếng Anh chỉ đặt trong ngoặc khi cần.
- Ví dụ owner đưa ra dùng để hiểu cách trình bày, không được biến thành trọng tâm hoặc hồ sơ cá nhân của owner.

## Commit checkpoint quan trọng

- `21e4812`: Publish Selflo quote Release 45.
- `0a69cc7`: Ghi nhận kiểm tra Release 45 trên public web.
- `dcd8c54`: Khởi tạo chương trình review 46 story.
- `f622ef5`: Tạm dừng story và viết bản Knowledge đầu tiên.

## Câu lệnh khôi phục ngữ cảnh cho session sau

> Đọc `content-workspace/programs/SESSION_HANDOFF_2026-10-13.vi.md`, sau đó đọc `STATUS.vi.md` và phần cuối `WORKLOG.vi.md` của đúng chương trình tôi muốn mở lại. Không tiếp tục chương trình khác và không làm lại các phase đã hoàn thành.
