# PM-STORY-P1 — Trạng thái Story / Series

**Trạng thái hiện tại:** **TẠM DỪNG / PAUSED BY OWNER (2026-11-01)**. Không tự tiếp tục Story, không phát hành, không viết truyện mới cho mục tiêu 365.  
**Nguồn đầu vào bắt buộc cho phiên AI sau:** **[SESSION_CLOSURE_2026-11-01.vi.md](SESSION_CLOSURE_2026-11-01.vi.md)**.  
**Owner:** xác nhận hướng đi khi quay lại, chưa chấp thuận bulk promotion.

## Snapshot kiểm chứng tại thời điểm chốt

- Canonical Authoring manifest **rev 108**, **78 Story records**; Release manifest **rev 61**, **22 Story records**. **56 Authoring-only** (đếm theo stable `story_id`); không coi 78 là 78 tác phẩm độc lập duy nhất.
- Một series đang có nội dung: **Tầng không tồn tại**, 10 chương toàn văn ở Authoring; rights/review vẫn chờ owner và technical reflection placeholder; không có Phần 2.
- [Idea Library](../../idea-library/README.vi.md): **36 concept** = 6 series + 30 idea độc lập; 12 nhóm định hướng đủ 365 vị trí. Không có lịch xuất bản.
- [Bảng điểm gợi ý 78 Story](reports/EDITORIAL_SCORECARD_78_2026-11-01.vi.json) đã được lưu lại: **chủ quan/provisional**, có trọng số và 1 series 10 chương; không phải editorial decision chính thức.
- **Classics50:** Các tư liệu hữu ích của [PR #9](https://github.com/dungvo/dungvo.github.io/pull/9) đã được chuyển sang [kho tham khảo Classics50](../../story-series/classics/README.vi.md): 20 nháp kể lại ngắn ngoài canonical, 30 nghiên cứu chưa dịch. Không phải Authoring. PR #9 đã đóng (superseded bởi PR #14 đã merge); chỉ còn branch cũ có thể xóa thủ công trên GitHub, không merge source.json cũ.

## Quyết định chốt của owner

1. Story và Idea 365 được **lưu để phát triển khi cần**, không làm ngay.
2. Không viết thêm, rewrite, mở Part 2, tự chuyển 50 Classics sang Authoring, merge PR #9 hay publish Story/Release.
3. Bản đã khóa giữ nguyên. Nội dung có rights/source, image, claim hoặc review chưa đạt không tự nhận là approved.
4. Công việc khác của repo (quote, knowledge, app) có checkpoint riêng; **chỉ Story program ở trạng thái paused** theo yêu cầu này.

## Review status

| Giai đoạn | Thực trạng |
|---|---|
| Baseline và registry | Đã lưu / có manifest |
| Editorial diversity / 78-scorecard | Đã có đánh giá **sơ bộ**, cần owner review; không được coi là chấm hoàn tất từng câu |
| Story/series authorship & import | 10 chương Tầng không tồn tại đã vào Authoring; những bản còn lại theo manifest |
| Vòng review/disposition chính thức cho 56 Authoring-only | **Chưa chốt** |
| Source, bản quyền, artwork, kiểm thử Reader, giải thích khoa học | **Cần làm theo từng tác phẩm nếu quay lại** |
| Release mới từ Story | **Không thực hiện / chưa được yêu cầu** |
| 365 idea outlines / Part 2 | **Chưa bắt đầu** |

## ĐÚNG MỘT BƯỚC TIẾP THEO — CHỈ KHI OWNER YÊU CẦU

**Đọc [SESSION_CLOSURE](SESSION_CLOSURE_2026-11-01.vi.md), sau đó mở đúng `story_id` hoặc `idea_id` mà owner chọn để review/outline từng mục.** Tải manifest mới nhất trước khi dùng số lượng/snapshot; không tự động mở batch 50 classics hoặc sáng tác 287 bài.

## Lịch sử không còn là snapshot hiện hành

2026-10-13: Authoring rev 84 / 62 story, Release rev 45 / 16 story; 46 Authoring-only. Audit gate tự động trước đây: 0/46 release-ready, 46 chưa ảnh, 45 thiếu quyền, 41 thiếu review, 18 thiếu quote Release. **Chỉ là dữ liệu lịch sử**; báo cáo [reports/authoring-only-stories.json](reports/authoring-only-stories.json) và [WORKLOG](WORKLOG.vi.md) còn để đối chiếu, **không dùng làm số liệu hiện tại**.

**Đóng checkpoint:** 2026-11-01; quyết định PAUSED BY OWNER.
