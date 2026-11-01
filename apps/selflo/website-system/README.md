# Selflo website system

Nguồn và cấu hình dự kiến dùng chung cho hai target:

- `public`: website production, chỉ feature và content đã Release;
- `studio`: staging website, có feature thử nghiệm và Developer.

Hiện thư mục này khóa environment/feature semantics, route helper và Studio-only build boundary. Public HTML/CSS/JS hiện hành chưa được chuyển vào đây. Việc migration diễn ra theo page và được theo dõi tại `content-workspace/programs/studio-public-knowledge-reader/`.

## Nguyên tắc

- Một nơi sửa component UI chung.
- Hai build output độc lập.
- Build Studio không được ghi public files.
- Build public cần owner acceptance và phải xuất phát từ Studio build đã duyệt.
- Không dùng Authoring, fixture hoặc Developer data trong public build.

## Kiểm tra S1

Các script chỉ dùng Node.js built-in, không cần cài package:

```text
node website-system/scripts/validate-config.mjs
node website-system/tests/routes.test.mjs
node website-system/tests/config-negative.test.mjs
node website-system/tests/studio-build-safety.test.mjs
```

`build-studio.mjs` ở S1 mới chỉ sinh build manifest và route map dưới `studio/.website-build/`. Nó cố ý chưa sinh UI; shell được triển khai ở S2 sau khi baseline/parity gate được chốt.

## Release discovery (2026-11-01)

- Public `perspectives/` và Studio `studio/perspectives/` dùng chung `assets/release-discovery.js`, `assets/release-discovery.css` và icon sprite `assets/selflo-icons.svg`.
- Quote và Story có hai collection độc lập: `perspectives/quotes/`, `perspectives/stories/` và bản Studio tương ứng. Tất cả chỉ đọc `perspective-library/release/vi/manifest.json` cùng các tài nguyên Release đã được khai báo. Feed tải từng nhóm khi cuộn và có nút Xem thêm để dùng bằng bàn phím.
- Search ở header Góc nhìn hiển thị kết quả và lọc theo Quote/Story; nhấn Enter hoặc nút Tìm mới tự cuộn đến kết quả. Search khi nhập không tự kéo trang.
- Knowledge reader chỉ resolve `story.why_ai_feels_easier_to_ask` từ Release manifest, không lấy trực tiếp Source.
- Studio `perspectives/index.html` được sinh từ trang Public qua `website-system/scripts/build-studio.mjs`, nên sửa ở Public và build lại Studio. Đây là bước chia sẻ runtime cho discovery, **không có nghĩa toàn bộ website đã hợp nhất một codebase UI**.
- CI: `node website-system/tests/release-discovery-contract.test.mjs`; kiểm tra 22 Story Release, quote packs, reader block contracts và parity các route.
