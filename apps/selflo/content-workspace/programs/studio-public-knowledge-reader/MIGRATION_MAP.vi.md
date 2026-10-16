# Migration map — từ implementation hiện tại đến shared website

| Nguồn hiện tại | Đích | Hành động | Gate trước khi chuyển |
|---|---|---|---|
| Header/footer trong public HTML | `website-system/src/shell/` | Trích từ production baseline | Desktop/mobile parity, keyboard, URL đúng |
| Relative links viết tay | `website-system/src/runtime/routes.mjs` | Thay bằng route resolver | Test cả public/studio base path |
| `public-shell.css` | shared shell style | Giữ CSS baseline, đổi ownership sau parity | Không đổi visual public ngoài sai khác cho phép |
| `public-shell-static.js` | shared shell runtime | Migrate behavior menu | Mobile/reduced-motion test |
| `studio/index.html` link list | Studio shell + Developer page | Thay entrypoint ở S2 | 4 route parity + Developer/noindex |
| `studio/website-preview/` | Shared page/experience sẽ được owner chọn | Giữ làm tham khảo; không copy page và chưa mặc định migrate vào Góc nhìn | Placement được chốt; public không load data Studio |
| `features.v1.json` của Preview | feature registry canonical | Retire sau khi consumer mới dùng registry | Schema/validator đạt |
| Analysis `details` card | Studio Analysis experience chưa chốt vị trí | Chỉ viết lại sau quyết định information architecture | Contract, loading/error/mobile đạt |
| `studio/reader/` | Developer Reader Lab | Giữ tool riêng | Không cần parity public |
| Public Story Reader | shared reader primitive sau S4 nếu hữu ích | Giữ nguyên trước | Không regression nội dung/visual |
| Public Knowledge prototype đọc source | Knowledge Reader dùng public-safe contract | Retire/replace | Không còn source/Authoring leak |
| Knowledge Maze | Developer experiment | Giữ độc lập | Không xem là Reader replacement |

## Quy tắc chuyển ownership

Một file chỉ chuyển sang `website-system/src/` khi page tương ứng có:

1. source shared duy nhất;
2. build Studio độc lập;
3. parity evidence;
4. safety test public hash;
5. migration record cập nhật.

Cho tới lúc đó, public file hiện hành vẫn là production ownership. Không sửa đồng thời hai implementation với kỳ vọng tự đồng bộ.
