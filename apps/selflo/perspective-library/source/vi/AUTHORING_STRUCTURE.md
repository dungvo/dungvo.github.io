# Selflo canonical Authoring source

Đây là nguồn canonical duy nhất dùng để publish Authoring Library. Release là projection fail-closed riêng và không được sửa trực tiếp từ website review.

## Cấu trúc

- `source.json`: index của toàn bộ source file.
- `themes/`: envelope của chín theme. Mỗi file chỉ giữ metadata theme và danh sách `quote_fragment_ids` theo thứ tự.
- `quotes/<theme>/NNN.vi.json`: fragment quote của một theme, tối đa 12 quote/file. Khi fragment cuối đã đủ 12 quote, tạo số kế tiếp thay vì làm file cũ tiếp tục phình ra.
- `stories/<story-slug>/story.vi.json`: mỗi story có folder và file riêng.
- `knowledge/`: Knowledge Catalog canonical.
- `reading-intents/`: mapping reading intent ↔ story.
- `provenance/`: mapping nguồn và bằng chứng nghiên cứu.
- `decisions/`: decision ledger đã được owner chốt trong authoring workflow; không phải browser-local review ledger.

## Thêm quote mới

1. Chọn đúng `primary_theme`.
2. Thêm quote vào fragment cuối của theme nếu file đó còn dưới 12 quote; nếu đã đủ, tạo fragment số kế tiếp.
3. Với fragment mới, thêm descriptor `kind = quote_fragment` vào `source.json` và thêm ID của fragment vào `quote_fragment_ids` của theme.
4. Stable quote ID phải unique toàn Library. Story ID chỉ được gắn khi story tồn tại trong canonical source.
5. Giữ lifecycle Authoring fail-closed. Website review/ledger không tự nâng `review`, `rights` hoặc Release readiness.
6. Chạy publisher Authoring và kiểm tra Preview. Không thay đổi Release khi chưa có rights/review gate riêng.

## Thêm story mới

Tạo đúng một folder `stories/<story-slug>/story.vi.json`, thêm descriptor story vào `source.json`, validate schema/reference rồi publish Authoring Preview. Mỗi story mới phải có quote riêng hoặc được giữ unlinked có chủ ý trong migration; không dùng chung một story cho nhiều quote.
