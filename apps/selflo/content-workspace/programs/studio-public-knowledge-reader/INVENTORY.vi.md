# S1 inventory — Public, Studio và Reader

**Ngày kiểm kê:** 2026-10-16
**Phạm vi:** runtime website trong `apps/selflo`; không gồm app native.

## 1. Route và entrypoint

| Trải nghiệm | Route | Entrypoint | Trạng thái |
|---|---|---|---|
| Public home | `/apps/selflo/` | `index.html` | Production |
| Public Góc nhìn | `/apps/selflo/perspectives/` | `perspectives/index.html` | Production |
| Public Story Reader | `/apps/selflo/perspectives/read/?story=…` | `perspectives/read/index.html` | Production |
| Public Knowledge thử nghiệm | `/apps/selflo/perspectives/knowledge/` | `perspectives/knowledge/index.html` | Có route public nhưng reader đang đọc source, cần xem là legacy/prototype |
| Public Hỗ trợ | `/apps/selflo/support/` | `support/index.html` | Production |
| Public Quyền riêng tư | `/apps/selflo/privacy/` | `privacy/index.html` | Production |
| Public policy | `/apps/selflo/privacy-policy/` | `privacy-policy/index.html` | Production, ngoài bốn nav chính |
| Studio root | `/apps/selflo/studio/` | `studio/index.html` | Link list nội bộ, chưa parity public |
| Website Preview | `/apps/selflo/studio/website-preview/` | `studio/website-preview/index.html` | Prototype riêng |
| Reader Lab | `/apps/selflo/studio/reader/` | `studio/reader/index.html` | Tool nội bộ |
| Knowledge Maze | `/apps/selflo/studio/knowledge-maze/` | `studio/knowledge-maze/index.html` | Prototype khám phá, không phải reader tuyến tính |
| Developer tools | `/studio/review`, `/content-catalog`, `/review-matrix`, `/story-seed`, `/quotes` | từng `index.html` riêng | Chỉ Studio |

## 2. Component parity matrix

| Component | Public hiện tại | Website Preview | Quyết định S1 |
|---|---|---|---|
| Brand/header | Markup lặp trong 4 HTML; style `public-shell.css` | `site-header` và CSS riêng | Public là baseline; trích shared ở S2 |
| Navigation | 4 mục, relative URL viết tay | 4 anchor nội trang khác public | Không migrate nav Preview; sinh từ environment/route helper |
| Mobile toggle | `public-shell-static.js` trên phần lớn page | Không cùng implementation | Giữ baseline, share ở S2 |
| Footer | Markup lặp trong page | Footer riêng | Public là baseline; trích cùng header |
| Search | Góc nhìn và Hỗ trợ có input riêng | Search gộp Story/Series/Analysis | Giữ behavior theo page; không ép thành một component quá sớm |
| Story cards | `perspectives-v3.js` đọc Release | Preview tự render từ Release | Dùng public renderer/data flow làm baseline |
| Analysis cards | Chưa có trong public | `details` từ `api/content-analysis.v1.json` | Migrate concept, không copy implementation |
| Series cards | Chưa có trong public | Đọc catalog từ `content-workspace` | Studio-only; không cho public adapter đọc source nội bộ |
| Story Reader | `reader-framework-v1.js`/reader assets | Không có reader tương đương | Giữ production; xem xét shared typography sau |
| Knowledge Reader | `knowledge-reader-v1.js` đọc canonical source trực tiếp | Reader Lab chỉ dành cho Story | Prototype cần thay bằng adapter/contract an toàn |
| Preview chrome | Không | `preview-bar`, feature badges | Studio-only component |

## 3. CSS/JavaScript active

| Page | CSS chính | JavaScript chính | Ghi chú |
|---|---|---|---|
| Home | `home-v2.css`, `home-v3.css`, `public-shell.css` | `home-v2.js`, `public-shell-static.js` | `home.js` cũ đọc Authoring, không được nối lại public |
| Góc nhìn | `home-v2.css`, `perspectives-v3.css`, `public-shell.css` | `perspectives-v3.js`, `public-shell-static.js` | Release adapter rõ |
| Hỗ trợ | `support-v3.css`, `public-shell.css` | `support-v3.js`, `public-shell-static.js` | HTML đang minified một dòng |
| Quyền riêng tư | `privacy-v4.css`, `privacy-shield-v1.css`, `public-shell.css` | `privacy-v4.js`, `public-shell-static.js` | HTML đang minified một dòng |
| Story Reader | reader CSS hiện hành | `reader-framework-v1.js` | Release only |
| Knowledge route | `knowledge-reader-v1.css` | `knowledge-reader-v1.js` | Đọc `perspective-library/source`; không đạt public boundary |
| Website Preview | `studio/website-preview/styles.css` | `app.mjs` | Codebase prototype riêng |

Các file `public-v3.*`, `public-pages-v2.*`, `perspectives-v2.*`, `reader-v2.*`, `reader-v3.js`, `site.css` cần coi là legacy/đang dùng cục bộ cho tới khi route usage audit đóng hoàn toàn; chưa xóa trong S1.

## 4. Data-flow matrix

| Consumer | Dữ liệu | Channel | Public-safe? | Quyết định |
|---|---|---|---|---|
| Public Góc nhìn | `perspective-library/release/vi/manifest.json` + story files | Release | Có | Giữ |
| Public Story Reader | Release manifest + story/artwork | Release | Có | Giữ |
| Public Knowledge prototype | `perspective-library/source/vi/stories/...` | Canonical source | Không theo contract public | Không mở rộng; thay trong S4 |
| Website Preview Story | Release manifest | Release | Có | Renderer riêng sẽ retire |
| Website Preview Analysis | `api/content-analysis.v1.json` | Authoring/internal API | Chỉ Studio | Adapter Studio rõ ràng |
| Website Preview Series | `content-workspace/story-series/catalog.vi.json` | Workspace | Chỉ Studio | Chặn khỏi public build |
| Reader Lab | Authoring hoặc Release do người dùng chọn | Mixed | Chỉ Studio | Giữ Developer tool |
| Knowledge Maze | Fixture/prototype riêng | Fixture | Chỉ Studio | Giữ độc lập Reader |

## 5. Relative URL risks

- Public root dùng `assets/...`; page cấp một dùng `../assets/...`; reader cấp hai dùng `../../...`.
- Copy nguyên HTML public xuống `/studio/` sẽ làm sai asset, navigation và content base.
- `studio/website-preview/` đang phụ thuộc độ sâu thư mục bằng chuỗi `../../`.
- Query route Story Reader và fragment route prototype đang dùng hai mô hình khác nhau.
- Route helper phải tạo URL từ `base_path`, không suy ra bằng số lượng `../` trong source shared.

## 6. Shared boundary nhỏ nhất

S2 chỉ share các primitive sau:

1. route map/base-path helper;
2. header/nav/footer renderer;
3. shell CSS đang dùng thật ở production;
4. environment và feature policy;
5. build manifest.

Chưa share search, content card hoặc reader renderer trước khi shell parity đạt. Cách này tránh rewrite lớn và giữ public ổn định.
