# S2 acceptance evidence — Studio shell

**Build ID:** `studio-s2-14290080e75a`
**Ngày:** 2026-10-16

## Ảnh kiểm tra

- `studio-home-desktop.png` — 1440×1100.
- `studio-home-mobile.png` — 390×844.
- `developer-desktop.png` — 1440×1100.
- `developer-mobile.png` — 390×844.

Ảnh được chụp qua localhost từ một staging folder tạm chỉ chứa generated Studio output, public assets và Release content. Source nội bộ/Authoring không được đưa vào web root kiểm tra.

## Kết quả

- Studio Trang chủ giữ layout/content production hiện tại.
- Sai khác chủ ý: thanh `Selflo Studio · Không public`, mục Developer và `noindex,nofollow`.
- Developer có layout responsive 3 cột → 1 cột.
- Navigation dùng anchor/button semantic của production shell; mobile menu tiếp tục dùng `public-shell-static.js`.
- Reduced-motion policy có trong Studio CSS.
- Không thấy Authoring path trong năm generated page.
- Safety test giữ nguyên hash 64 public files.

Đây là evidence đóng S2, không phải phê duyệt public Release.
