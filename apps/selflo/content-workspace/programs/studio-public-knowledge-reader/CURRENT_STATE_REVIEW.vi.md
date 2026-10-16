# Current-state review — Selflo public, Studio và Reader

**Ngày review:** 2026-10-15
**Phạm vi:** HTML/CSS/JavaScript website trong `apps/selflo`; không sửa runtime trong lượt review.

## 1. Kết luận

Có thể đạt mục tiêu Studio/Public mà không cần React và không cần thay toàn bộ website. Hướng ít rủi ro nhất là migration theo page, bắt đầu từ shared shell và `Góc nhìn`.

Repo đã có nhiều thành phần cần thiết nhưng đang ở ba lớp rời nhau:

1. public pages có thiết kế production;
2. Studio có developer tools và Website Preview riêng;
3. Reader/Analysis đã có asset, contract và prototype nhưng chưa thành một flow Knowledge Reader thống nhất.

## 2. Public website hiện tại

### Route chính

- `index.html` — Trang chủ.
- `perspectives/index.html` — Góc nhìn.
- `support/index.html` — Hỗ trợ.
- `privacy/index.html` — Quyền riêng tư.
- `perspectives/read/` — Story Reader.
- `perspectives/knowledge/` — entry Knowledge hiện có.

### Phần đã dùng chung một phần

- `assets/public-shell.css` giữ style header/footer chung.
- `assets/public-shell-static.js` xử lý shell đã có sẵn trong HTML.
- `assets/public-shell.js` có khả năng sinh shell bằng JavaScript cho một số page.

### Vấn đề maintainability

- Header/footer markup vẫn được copy trong nhiều file HTML.
- Có hai cách quản lý shell: markup tĩnh + `public-shell-static.js`, và shell sinh động bằng `public-shell.js`.
- Relative path thay đổi theo độ sâu route.
- `about/` còn dùng navigation cũ khác bốn mục public hiện hành.
- CSS/JS có nhiều generation (`home-v2/v3`, `perspectives-v2/v3`, `reader-v2/v3`), nên cần xác định active layer trước khi share.

## 3. Studio hiện tại

- `studio/index.html` là link launcher, không phải staging site.
- Các developer tools đang hoạt động theo route riêng: review, matrix, catalog, story seed, reader lab, knowledge maze và quotes.
- `studio/website-preview/` là prototype gần website, nhưng có header, CSS và application code riêng.
- Website Preview đọc Release stories và bật Series/Analysis bằng `features.v1.json`.

**Kết luận:** Website Preview là reference để migration, không nên tiếp tục làm source website thứ hai.

## 4. Knowledge/Analysis hiện tại

- `selflo.content-analysis.v1` đã là active Authoring-only contract; hiện có hai analysis item trong API projection.
- Website Preview hiển thị Analysis dưới dạng card + `<details>`.
- `assets/knowledge-reader-v1.css/js` và `perspectives/knowledge/` cho thấy Knowledge Reader từng được thử.
- Story Reader có framework và nhiều generation CSS/JS tương đối hoàn chỉnh.
- Knowledge Maze là trải nghiệm node/nhánh độc lập.

**Khoảng trống:** chưa có một Studio route hoàn chỉnh cho danh sách Phân tích → detail reader → source/evidence/limits → related content.

## 5. Quyết định công nghệ

- Giữ HTML/CSS/JavaScript thuần.
- Không dùng React trong chương trình v1.
- Không yêu cầu Node runtime phía server.
- Node build tool có thể được thêm ở phase implementation, nhưng output vẫn là static HTML/CSS/JS.
- Dùng progressive enhancement: nội dung chính đọc được khi JavaScript chưa chạy; tab/search/filter nâng cấp trải nghiệm.

## 6. Rủi ro cần kiểm soát

| Rủi ro | Cách kiểm soát |
|---|---|
| Sửa shared asset làm public đổi ngoài ý muốn | Shared source mới chưa được public import; Studio build trước, public chỉ đổi qua release command |
| Sinh hai codebase | Chỉ sửa `website-system/src`; output không phải nơi authoring sau migration |
| Big-bang migration làm vỡ site | Chuyển từng page; public cũ giữ nguyên tới parity gate |
| Relative URL sai ở `/studio/` | Route helper/base-path adapter và test link/assets |
| Studio data lọt vào public | Environment validator + scan public output |
| Reader mới đổi contract quá sớm | Dùng fixture từ `content-analysis.v1`; nếu thiếu field mới mở proposal |
| CSS legacy chồng nhau | Lập active-style inventory và visual baseline trước khi trích component |

## 7. Thứ tự kỹ thuật khuyến nghị

1. Khóa baseline và active assets của bốn page public.
2. Tạo shared route helper + shell từ markup production hiện tại.
3. Sinh Studio home/support/privacy giống public; thêm Developer bằng config.
4. Migration Góc nhìn và thêm Analysis tab Studio-only.
5. Xây Knowledge/Analysis Reader bằng HTML progressive enhancement.
6. Chỉ sau khi owner duyệt mới xây public promotion command.

## 8. Điều không làm trong bước tiếp theo

- Không sửa public page trực tiếp để “dùng thử”.
- Không thay framework.
- Không đổi content contract.
- Không chuyển toàn bộ developer tools sang component system mới.
- Không Release Analysis/Knowledge.
