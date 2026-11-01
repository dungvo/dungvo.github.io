# Selflo — Audit bổ sung & checklist phát hành trang Story Landscape

**Ngày:** 2026-11-01. **Nguồn:** `main` của `dungvo/dungvo.github.io`. Tài liệu này bổ sung cho [tầm nhìn và inventory](./SELFLO_CONTENT_VISION_STYLES_INVENTORY_2026-11-01.vi.md).

## 1. Phân lớp dữ liệu — không để mất những ý tưởng có thật

- **22 bản Release:** tra cứu trực tiếp tại [Release manifest](../perspective-library/release/vi/manifest.json).
- **68 bản Authoring:** gồm 22 bản Release nói trên và 46 bản Authoring-only; tra cứu [Authoring manifest](../perspective-library/authoring/vi/manifest.json).
- **72 thư mục nguồn trong `source/vi/stories`:** trong đó **4 thư mục chưa xuất hiện trong Authoring manifest**, được giữ dưới dạng **source-only, chưa xác nhận nội dung hoàn chỉnh**:
  1. [arrow-after-the-bowstring](../perspective-library/source/vi/stories/arrow-after-the-bowstring/)
  2. [dog-and-moving-cart](../perspective-library/source/vi/stories/dog-and-moving-cart/)
  3. [the-role-on-stage](../perspective-library/source/vi/stories/the-role-on-stage/)
  4. [tree-tower-and-first-step](../perspective-library/source/vi/stories/tree-tower-and-first-step/)
- **28 ý tưởng/chủ đề** đã ghi tại tài liệu chiến lược §7: là tập hợp từ trao đổi và Knowledge backlog, không được tính vào Authoring hoặc Release.
- **Reference works:** 18 tác phẩm/nhóm văn học có tên tác giả, nguồn và cảnh báo bản quyền tại §6, không phải truyện đã nhập.

Những thống kê này đại diện **các lớp khác nhau, không cộng cơ học** thành tổng số tác phẩm độc lập: một ý tưởng có thể trùng với một bản Release, một bản source-only có thể là nháp lịch sử hoặc seed của câu chuyện khác.

## 2. Kiểm kê ngoài manifest cần đối chiếu thêm

Các kho cần tiếp tục xem trước khi tuyên bố bao phủ hoàn toàn:
- [Knowledge Content Inventory](../content-workspace/KNOWLEDGE_CONTENT_INVENTORY.vi.md): backlog, bài phân tích, quan sát đời thường, ý tưởng triết học và việc nghiên cứu nguồn.
- [Repo Work in Progress](../content-workspace/REPO_WORK_IN_PROGRESS.vi.md): các chương trình, Series, voice diversity.
- [Story Series](../content-workspace/story-series/): không xem ý tưởng series như story Release.
- [Raw notes](../content-workspace/raw/), [Research](../research/), [Reference reviews](../perspective-library/): tư liệu hạt giống và nghiên cứu, không phải manifest phát hành.
- Ý tưởng chỉ có trong hội thoại trước đây: phải xác minh bản nguyên văn/approval trước khi chuyển sang canonical; chưa có cách xác nhận mọi note lịch sử đều được tìm thấy.

## 3. Kiểm tra các nguồn dữ liệu của trang

- [Catalog](../story-landscape/catalog.json) chứa 68 record ứng với Authoring manifest, ID duy nhất, nhãn `released` hoặc `authoring_only` đối chiếu Release.
- Index [content-index/story-0001.json](../api/content-index.v1/story-0001.json) chỉ bao phủ 64/68 record (generated 2026-10-28); 4 bài thiếu được đọc từ Authoring payload gần hơn: `if-i-am-wrong-but-chatgpt-agrees`, `nha-ga-mot-chieu`, `nhung-ngay-dep-nhat`, `why-ai-feels-easier-to-ask`.
- **Review status và rights** từ index 28/10 có thể cũ. Các trường này có nghĩa *snapshot*, không chứng nhận pháp lý hoặc phê duyệt hiện hành. Các style_primary/secondary là **editorial suggestions**, không sửa content hay metadata canonical.
- Trang [Story Landscape](../story-landscape/) hiển thị title tiếng Việt, filter tìm kiếm, Release/Authoring, style, form, nguồn GitHub; không có chức năng publish.

## 4. Quy trình kiểm thử và phát hành

- [x] Nhánh riêng, không đụng payload truyện gốc.
- [x] Đếm Release/Authoring dựa trên manifest.
- [x] Phân biệt title, form/style/status và nguồn quyền.
- [x] Giữ seed source-only ở audit, không tự nhập vào Authoring.
- [x] Bảng inventory + 28 ý tưởng + 18 nguồn tác giả được lưu trong Markdown.
- [ ] Browser QA desktop/mobile, accessibility và xác minh reader links.
- [ ] Kiểm tra content catalog so với mọi repo seed và conversation note lịch sử.
- [ ] Lọc/hiển thị 28 ý tưởng và 4 source-only trực tiếp trong UI (hiện có trong Markdown, chưa phải table UI).
- [ ] Verify tình trạng quyền từng văn bản/bản dịch nếu có kế hoạch phân phối Classics.
- [ ] Sau merge xác minh URL GitHub Pages public hoạt động.

**Báo cáo trung thực:** Chưa khẳng định browser QA thành công nếu chưa có phép kiểm; số lượng Release là thời điểm kiểm tra, không phải realtime. Merge tài liệu + trang overview không được phép tự phát hành content từ Authoring.
