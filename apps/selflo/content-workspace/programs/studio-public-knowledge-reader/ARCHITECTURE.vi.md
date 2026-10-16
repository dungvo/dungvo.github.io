# Architecture direction

## 1. Mô hình đích

```text
Canonical content / Release manifests / preview fixtures
                         │
               shared view models
                         │
         shared website shell + components/source version
                  ┌──────┴──────┐
                  │             │
          Public activation   Studio activation
          Release only        Release + preview features
                  │             │
          /apps/selflo/       /apps/selflo/studio/
          ├─ Trang chủ        ├─ Trang chủ
          ├─ Góc nhìn         ├─ Góc nhìn + feature thử
          ├─ Hỗ trợ           ├─ Hỗ trợ
          └─ Quyền riêng tư   ├─ Quyền riêng tư
                              └─ Developer
```

Shared source không có nghĩa public và Studio đọc cùng mọi dữ liệu. Chúng dùng chung renderer/component hoặc cùng một source version được build/copy có kiểm soát; data adapter và activation policy khác nhau. Việc copy code/build artifact được chấp nhận nếu có một chiều rõ từ source đã nghiệm thu sang public và không sửa hai bản độc lập.

## 2. Ranh giới đề xuất

### Shared presentation

- brand/header/footer primitives;
- navigation model;
- cards, section headers và reader typography;
- story/knowledge renderer primitives;
- responsive/accessibility behavior.

### Public-only policy

- chỉ Release manifest/API;
- không developer chrome;
- không feature badge nội bộ;
- chỉ feature `released`.

### Studio-only policy

- noindex + preview bar;
- cùng navigation public và thêm mục Developer;
- có thể đọc Release, Authoring hoặc fixture qua adapter được chọn rõ;
- feature state và gate diagnostics;
- links tới review/catalog/matrix/labs.

## 3. Feature lifecycle

| Trạng thái | Studio | Public | Ý nghĩa |
|---|---|---|---|
| `studio_only` | Có | Không | Đang thử hoặc chưa đủ gate |
| `public_candidate` | Có | Không | Đã đủ để owner nghiệm thu trước Release |
| `released` | Có | Có | Owner đã duyệt và public activation đã qua kiểm tra |
| `retired` | Có trong lịch sử | Không | Dừng thử, không xóa dấu quyết định |

Không dùng feature registry để bypass content Release. Feature capability và content channel là hai gate riêng.

## 4. Knowledge Reader và Knowledge Maze

| Knowledge Reader | Knowledge Maze |
|---|---|
| Đọc tuyến tính một bài hoàn chỉnh | Khám phá mạng node/nhánh |
| Có URL theo content ID | Có URL/topic state riêng |
| Phù hợp review và public reading | Phù hợp thử nghiệm cách học/khám phá |
| Cần typography, source notes, related content | Cần node/link/navigation/progress |

V1 xây Reader độc lập. Sau này Maze có thể dẫn tới Reader nhưng không sở hữu format bài.

## 5. Contract impact ban đầu

- Studio shell và feature lifecycle: website-local proposal, chưa ảnh hưởng app native.
- `selflo.content-analysis.v1`: đang active Authoring-only; dùng làm fixture/consumer ban đầu được phép nếu không đổi semantics.
- Nếu Knowledge Reader cần entity/package mới hoặc field mới: tạo proposal trong `shared/contracts/proposals/`, không thêm field production trực tiếp.
- Public activation của Analysis/Knowledge cần quyết định riêng về content type, API projection và release gates.

## 6. Migration rule

`studio/website-preview/` là prototype đầu vào. Không tiếp tục mở rộng nó như website thứ hai. Khi shared shell sẵn sàng, migrate feature từng phần và giữ redirect hoặc landing note cho link cũ.

## 7. Quy tắc parity khi Release

- Trước Release, lưu cùng một bộ screenshot/check cho Studio candidate.
- Public nhận đúng component/CSS/JS/data contract đã nghiệm thu ở Studio.
- Nếu dùng copy, copy từ một source/version đã ghi nhận; không chỉnh lại UI trong lúc copy.
- Sau Release, so sánh visual Studio candidate với public ở cùng viewport và cùng fixture/content.
- Sai khác chỉ được phép ở Developer navigation, preview badge, data channel và feature chưa Release.
