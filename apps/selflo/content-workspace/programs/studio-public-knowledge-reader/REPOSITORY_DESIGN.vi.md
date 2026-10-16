# Repository design — một source, hai version Studio/Public

## 1. Mục tiêu

Repo phải cho phép phát triển và xem UI mới tại `/apps/selflo/studio/` mà không thay đổi `/apps/selflo/`. Khi owner duyệt Release, public được build từ đúng source version đã nghiệm thu trong Studio.

Không dùng Git branch như một phần của kiến trúc vận hành hiện tại.

## 2. Cấu trúc đích

```text
apps/selflo/
├── website-system/                 # nguồn website dùng chung
│   ├── README.md
│   ├── environments/
│   │   ├── public.v1.json          # chỉ Release, không Developer
│   │   └── studio.v1.json          # Release + preview, có Developer
│   ├── features/
│   │   └── feature-registry.v1.json
│   ├── src/
│   │   ├── shell/                  # header, nav, footer, layout
│   │   ├── pages/                  # home, perspectives, support, privacy
│   │   ├── readers/                # story, knowledge/analysis
│   │   ├── components/
│   │   ├── styles/
│   │   └── runtime/                # env/data adapters, feature activation
│   ├── fixtures/                   # chỉ Studio/test; không vào public build
│   └── tests/
├── index.html                      # public build output hiện hành
├── perspectives/                   # public build output
├── support/                        # public build output
├── privacy/                        # public build output
├── studio/                         # Studio build output + Developer tools
├── scripts/
│   ├── build-selflo-website        # builder tương lai
│   └── test-selflo-website         # parity/safety checks tương lai
└── content-workspace/programs/studio-public-knowledge-reader/
```

Trong giai đoạn migration, `website-system/src/` được đưa vào theo từng page. Các public file hiện tại tiếp tục là production source/output cho tới khi page tương ứng vượt qua parity gate.

## 3. Hai environment, không phải hai codebase

| Thuộc tính | Public | Studio |
|---|---|---|
| URL root | `/apps/selflo/` | `/apps/selflo/studio/` |
| Navigation | 4 mục public | 4 mục public + Developer |
| Content channel | Release | Release + Authoring/fixture được chọn rõ |
| Feature activation | Chỉ `released` | `released`, `public_candidate`, `studio_only` |
| Robots | Public policy | `noindex,nofollow` |
| Developer tools | Không | Có |
| Preview badge/gates | Không | Có |

Environment config không chứa presentation copy. Nó chỉ chọn policy, feature và data adapter.

## 4. Build boundary

### Build Studio — mặc định an toàn

```text
build-selflo-website --target studio
```

- chỉ được ghi dưới `studio/` và manifest build Studio;
- không sửa `index.html`, `perspectives/`, `support/`, `privacy/`;
- có thể dùng fixture/Authoring đã được khai báo;
- là lệnh mặc định trong quá trình phát triển.

### Build Public — fail closed

```text
build-selflo-website --target public --from-studio-build <build-id> --confirm-public
```

- bắt buộc trỏ tới Studio build đã nghiệm thu;
- từ chối feature chưa có trạng thái `released`;
- từ chối Authoring/fixture/internal data adapter;
- tạo output tạm, chạy test rồi mới thay public files;
- không push hoặc deploy tự động;
- lưu build manifest để biết public được sinh từ source/config/build nào.

## 5. Build manifest

Mỗi build cần ghi tối thiểu:

```json
{
  "schema_version": "selflo.website-build.v1",
  "build_id": "...",
  "target": "studio|public",
  "source_revision": "...",
  "environment_revision": 1,
  "feature_registry_revision": 1,
  "content_channel": "release|authoring|fixture",
  "enabled_features": [],
  "generated_at": "...",
  "promoted_from_studio_build": null
}
```

Public manifest phải có `promoted_from_studio_build` và cùng source revision với Studio candidate đã duyệt.

## 6. Feature registry

Feature lifecycle:

```text
studio_only → public_candidate → released → retired
```

- `studio_only`: chỉ Studio build được bật.
- `public_candidate`: vẫn chỉ Studio; đủ để owner nghiệm thu.
- `released`: public config mới được phép bật.
- `retired`: không bật; giữ lịch sử.

Registry có placeholder `analysis_experience`, nhưng vị trí và UI chưa được chốt. Không được diễn giải placeholder này thành quyết định đặt Phân tích trong `Góc nhìn`.

## 7. Data boundary

Renderer có thể dùng chung, nhưng adapter khác nhau:

```text
Public adapter
└── perspective-library/release + public API

Studio adapter
├── Release
├── Authoring khi tool/preview khai báo rõ
└── fixture local cho feature chưa có content package
```

Public build test phải quét và chặn đường dẫn tới:

- `perspective-library/authoring/`;
- `content-workspace/`;
- Studio tool data/ledger;
- fixture nội bộ;
- feature `studio_only` hoặc `public_candidate`.

## 8. Page migration order

1. Shared shell: brand, navigation, footer và route helpers.
2. Perspectives/Góc nhìn vì đây là nơi thử Analysis đầu tiên.
3. Knowledge/Analysis Reader.
4. Home.
5. Support và Privacy.
6. Retire implementation cạnh tranh trong `studio/website-preview/`.

Mỗi page chỉ chuyển sang generated output sau khi đạt visual, responsive, accessibility và URL parity. Không cần đợi toàn site mới migration.

## 9. Parity gate

Trước public Release:

1. Studio candidate được gắn build ID.
2. Owner duyệt đúng build ID đó.
3. Public build dùng cùng source revision/component/CSS.
4. So sánh desktop/mobile ở cùng viewport và data fixture tương đương.
5. Sai khác cho phép chỉ gồm Developer, preview badge, channel và feature chưa Release.
6. Public smoke test đạt trước khi deploy.

## 10. Quy tắc chống duplicate

- Không copy component vào `studio/` rồi tiếp tục sửa riêng.
- Không copy CSS sang public và Studio thành hai bản có ownership ngang nhau.
- Nếu output bị copy/generated, chỉ `website-system/src/` là nơi sửa.
- Developer tools có thể giữ implementation riêng vì chúng không có bản public.
- Legacy page chưa migrate vẫn được sửa tại vị trí cũ, nhưng không đồng thời tạo bản shared cạnh tranh mà không có migration record.

## 11. Trạng thái triển khai của thiết kế này

- `website-system/environments/` và `features/` được scaffold ngay để khóa semantics.
- `src/`, builder và tests được tạo trong phase S1–S2 sau inventory.
- Chưa thay public runtime hoặc Studio runtime ở bước thiết kế này.
