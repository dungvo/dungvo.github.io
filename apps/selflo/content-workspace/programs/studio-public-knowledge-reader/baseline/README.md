# Visual baseline — trước shared shell

**Ngày chụp:** 2026-10-16
**Mục đích:** lưu trạng thái trước S2 để so parity, không phải acceptance evidence cho Release.

| Surface | Desktop | Mobile |
|---|---|---|
| Public home | `public-home-desktop.png` (1440×1100) | `public-home-mobile.png` (390×844) |
| Studio root | `studio-root-desktop.png` (1440×1100) | `studio-root-mobile.png` (390×844) |
| Website Preview | `website-preview-desktop.png` (1440×1100) | `website-preview-mobile.png` (390×844) |
| Reader Lab | `reader-lab-desktop.png` (1440×1100) | `reader-lab-mobile.png` (390×844) |

Ảnh được render từ file local bằng Chrome headless, có cho phép module đọc file local để prototype hiện đủ dữ liệu. Vì không chạy qua HTTP/GitHub Pages, baseline này dùng để nhìn layout và ownership hiện tại; không thay thế smoke test URL/deep-link ở S2–S4.

Quan sát đáng giữ cho acceptance sau:

- Public desktop và mobile có cùng art direction nhưng mobile hiện ẩn navigation theo shell behavior.
- Studio root là dashboard link, khác hoàn toàn shell public.
- Website Preview có art direction và navigation riêng, chứng minh đây là prototype chứ chưa phải staging parity.
- Reader Lab là developer tool có chrome điều khiển riêng; không nên biến nguyên trạng thành reader public.
