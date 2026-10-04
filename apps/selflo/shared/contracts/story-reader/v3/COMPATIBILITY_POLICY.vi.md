# Story Reader Compatibility and Evolution Policy

**Contract ID:** `selflo.story-reader.compatibility.v1`  
**Parent:** [`CONTRACT.vi.md`](CONTRACT.vi.md)  
**Support matrix:** [`component-support.json`](component-support.json)

## 1. Mục tiêu

App có thể cải thiện UI mà không buộc content migration. Content có thể sửa prose/semantic bằng các component app đã hỗ trợ mà không cần app release mới. Thay đổi wire semantics mới phải app-first và additive.

## 2. Format coexistence

```text
missing reader_format / classic_v1
→ Classic decoder + Classic renderer

editorial_v2
→ V2 decoder + V2 renderer

editorial_v3
→ V3 decoder + V3 renderer
```

App release hỗ trợ V3 không rewrite, reinterpret hoặc tự nâng story V1/V2 khi load. Authoring Library được phép chứa nhiều story format nếu manifest capability tương thích. Production Release từ baseline 2026-10-03 chỉ nhận `editorial_v3`.

`editorial_v3` là thế hệ **contract payload**, không phải số phiên bản giao diện. Sau khi contract này được Release, content chỉ được cập nhật prose, metadata và tổ hợp component đã freeze; một app mới có thể đổi presentation của chính component đó mà không đổi payload. App V1/V2/V2.5 dùng compatibility adapter trong memory; không migrate hay publish lại content hiện có chỉ để đạt baseline V3.

Nếu tương lai cần block/structure nằm ngoài vocabulary đã freeze, thay đổi đó không được sửa in-place API/content feed mà app cũ đang dùng. Phải mở contract/API generation mới, ship app support trước, rồi mới cho content mới opt-in. Feed cũ tiếp tục phục vụ payload mà app cũ đã hiểu.

## 3. Change classification

| Thay đổi | App | Content | Contract/capability |
|---|---|---|---|
| Font, màu, spacing, ornament, responsive layout | Update app | Không migrate | Không đổi |
| Accessibility fix giữ semantic order/grouping | Update app | Không migrate | Không đổi |
| Đổi visual của preset nhưng giữ minimum promise | Update app + visual regression | Không migrate | Không đổi |
| Sửa prose/metadata trong shape đã allowed | Không cần app | Update content | Không đổi |
| Sửa block classification vì content cũ dùng sai | Không cần app nếu target component allowed | Migrate item đó | Không đổi |
| Thêm presentation intent mới vào format | App-first | Content opt-in sau | Capability/schema additive hoặc format revision theo compatibility review |
| Thêm nested data structure/block type mới | App-first | Content opt-in sau | Capability mới hoặc reader format mới |
| Đổi nghĩa/shape của enum đã Release | Không được in-place | Migration bắt buộc | Major format mới |
| Xóa component đã Release | Giữ decode/render trong supported lifetime | Migrate trước | Deprecation rồi major format mới |

## 4. Naming policy

- Không đặt version vào semantic discriminator chỉ vì UI mới: cấm `dialog_v3`, `new_quote`, `style_2`.
- Dùng tên diễn đạt vai trò: `exchange`, `monologue`, `inner_monologue`, `centerpiece`, `rail`.
- Version nằm ở `reader_format`, schema version và capability.
- Nếu cùng semantic nhưng UI đẹp hơn, sửa renderer; không thêm selector content.

## 5. Additive rollout

1. Contract/component proposal ghi semantic và minimum promise.
2. Schema + valid/invalid fixture được thêm mà không sửa acceptance của V1/V2.
3. Mockup được lưu và owner duyệt.
4. App decode/render/test capability mới nhưng tiếp tục hỗ trợ format cũ.
5. App tương thích được phát hành.
6. Publisher mới được enable capability.
7. Content mới có thể opt-in. Content V1/V2/V2.5 hiện có tiếp tục được app compatibility adapter đọc nguyên trạng; không bulk migrate để chốt baseline.
8. Release gate chặn component chưa `allowed`.

Cutover production đầu tiên chỉ migrate các story đã nằm trong Release manifest tại thời điểm cutover. Story chưa release giữ nguyên source format và phải được convert/review theo V3 khi được promote; không bulk migrate toàn bộ authoring backlog. Script migration lấy allowlist trực tiếp từ Release manifest, bảo toàn prose/order và chạy idempotent.

## 6. Support lifecycle

```text
specified
→ executable
→ mockup_approved
→ app_supported
→ publisher_enabled
→ release_allowed
→ deprecated
→ removable_only_in_new_major
```

- `specified`: human contract có, chưa đủ để author production.
- `executable`: schema/fixture/semantic validator pass.
- `mockup_approved`: owner duyệt hierarchy/component behavior.
- `app_supported`: app production decode/render/accessibility pass.
- `publisher_enabled`: publisher derive capability và fail closed.
- `release_allowed`: content production được dùng.
- `deprecated`: content mới không dùng, app vẫn render content đã ship.

## 7. Backward compatibility promises

- Classic/V2 block/style đã Release không bị đổi raw value hoặc required shape.
- Unknown V3 semantic không fallback thành paragraph/V2/Classic.
- App không bỏ legacy renderer chỉ vì không còn story mới dùng format đó.
- Content-only Release không được yêu cầu capability chưa có trong app đang phát hành.
- Một visual regression không được giải quyết bằng cách rewrite toàn bộ content selector nếu semantic không đổi.
- `authorship`, `editorial`, `rights` là dữ liệu/provenance ổn định dù app có thể ẩn hoặc đổi vị trí UI. Search/phân loại nằm trong `metadata`/`tags`, không tạo block render mới.
- V3 story lỗi riêng lẻ được app quarantine cùng link/membership liên quan; lỗi integrity package (manifest, checksum, image) vẫn fail toàn package.

## 8. Breaking-change criteria

Phải tạo reader format/schema major mới nếu thay đổi một trong các điều sau:

- đổi nghĩa stable block/style/presentation;
- đổi required shape làm payload đã Release không decode;
- đổi block order semantics;
- đổi fallback/quarantine/activation boundary;
- xóa minimum rendering promise mà content đã dựa vào;
- làm story cũ cần sửa chỉ để giữ cùng ý nghĩa.
