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
