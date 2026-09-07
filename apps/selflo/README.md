# Selflo website

Public root: <https://dungvo.github.io/apps/selflo/>

## Pages

- `/apps/selflo/`: public-facing app home plus entry points to editorial tools.
- `/apps/selflo/quotes/`: dense quote-only browser with source, author, work, theme and text filters. Each card deep-links to the focused detail preview.
- `/apps/selflo/preview/`: bulk quote/story review workspace. It renders 12 items per page by default, pairs linked quote/story side by side, shows the complete story in a bounded reader, reports word count/reading time/section count and stores independent quote/story decisions.
- `/apps/selflo/preview/?view=detail`: focused in-app quote/story reader preview.
- `/apps/selflo/preview/?view=matrix`: diversity dashboard backed by `quote-research/diversity-matrix.json` and the live Authoring manifest.
- `/apps/selflo/story-seed/`: local prompt builder for generating Authoring-ready story/quote draft files.
- `/apps/selflo/privacy/`: stable privacy-policy URL for the website and future App Store metadata.

## Review ledger

The Review workspace stores decisions in the current browser and supports JSON import/export. This ledger is editorial memory only: it does not mutate canonical source, approve rights, change lifecycle fields or publish Release content.

## Content boundaries

- Canonical authoring source: `perspective-library/source/vi/`.
- Generated public review package: `perspective-library/authoring/vi/`.
- Release: separate fail-closed channel; this website does not modify it.
- Canonical quote source is split into numbered fragments of at most 12 quote under `source/vi/quotes/<theme>/` so future batches do not make one theme file grow indefinitely.

## Documentation

- [Hướng dẫn đưa một story vào Selflo Release](perspective-library/RELEASE_STORY_GUIDE.vi.md): cấu trúc thư mục, cách tìm quote qua `story_id`, các file cần cập nhật, Release gates và quy trình kiểm tra/publish.

## Tìm nội dung vừa cập nhật và đã Release

Trong `/preview/`, chọn nguồn **Authoring** hoặc **Đã Release**. Mặc định sắp theo **Cập nhật mới nhất**; lọc **Đợt mới nhất**, **7 ngày qua**, **30 ngày qua** kết hợp ô tìm tên/nội dung. Bộ lọc dùng được ở Review nhanh và Xem chi tiết.

- Link mới cập nhật: `/preview/?updated=latest`.
- Link bản phát hành: `/preview/?channel=release`.
- Ngày cập nhật là thời điểm từng quote/story thay đổi trong Library, dựa trên lịch sử payload và audit; không lấy ngày sửa cả theme hoặc ngày duyệt ledger. Ngày hiển thị theo múi giờ trình duyệt.
- Publisher tự sinh `updates.json` cho từng channel bằng `scripts/build-library-updates.py`; không sửa tay. Thiếu lịch sử thì để ngày trống.
