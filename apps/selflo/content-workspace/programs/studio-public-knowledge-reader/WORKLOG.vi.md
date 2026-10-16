# Worklog — PM-STUDIO-P1

## 2026-10-15 — Khởi tạo workspace

- Owner làm rõ mục tiêu: Studio có UI nền giống public, thêm tab Website và khu Developer; feature public được thử trong Studio trước.
- Audit xác nhận `/studio/` hiện là link launcher, chưa giống public.
- Xác nhận `studio/website-preview/` đã có prototype riêng với Story, Series, Analysis, Knowledge và feature config.
- Xác nhận prototype đang dùng CSS/header riêng, nên chưa đạt mục tiêu một shared implementation.
- Xác nhận Knowledge Maze đã có nhưng Knowledge Reader cho bài phân tích chưa hoàn chỉnh; Analysis mới là card/details.
- Xác nhận repo đã dùng minimal Spec Kit/content overlay và chương trình `content-workspace/programs/`; không cần khởi tạo một scaffold Spec Kit thứ hai.
- Tạo spec, architecture, plan, tasks và trạng thái. Chưa sửa runtime, contract hay Release.

## 2026-10-15 — Owner làm rõ mô hình staging

- Studio phải tái hiện toàn bộ website với cùng bốn mục public và thêm `Developer`; không phải một dashboard có tab Website riêng.
- Ví dụ thử nghiệm đầu tiên: public Góc nhìn giữ nguyên; Studio Góc nhìn có thêm tab Phân tích được thiết kế ở chất lượng user-facing.
- Khi Release, public phải nhận đúng UI đã nghiệm thu trong Studio. Cho phép copy code/build artifact nếu đi từ cùng source/version và không tạo hai nhánh chỉnh tay độc lập.
- Cập nhật spec, architecture, plan và tasks; runtime vẫn chưa thay đổi.

## 2026-10-15 — Chốt repository design không dùng branch

- Bỏ branch khỏi kiến trúc vận hành theo yêu cầu owner.
- Thiết kế `website-system/` làm nơi sở hữu source/config dùng chung, với hai environment và hai output độc lập.
- Build Studio là mặc định và chỉ được ghi dưới `studio/`; build public phải fail closed, có `--confirm-public` và trỏ tới Studio build đã duyệt.
- Định nghĩa build manifest, feature lifecycle, data boundary, migration theo page và visual parity gate.
- Scaffold public/studio environment cùng feature registry; chưa thay đổi HTML/CSS/JS đang chạy.

## 2026-10-15 — Review hiện trạng và chốt plan HTML

- Rà public routes, shell assets, Studio tools, Website Preview, Story/Knowledge reader assets và Analysis API.
- Phát hiện shell đã share style/behavior một phần nhưng markup còn lặp và có hai cơ chế shell; cần inventory active layer trước migration.
- Xác nhận Website Preview là prototype riêng, Knowledge Maze không thay Reader, Analysis mới là card/details.
- Chốt giữ HTML/CSS/JavaScript, progressive enhancement và migration theo page; không React trong v1.
- Hoàn thành S0; kế hoạch tiếp theo là S1 inventory + route helper + validator + safety hash test trước khi sửa UI.
## 2026-10-16 — Hoàn thành S1 inventory và safety boundary

### Đã làm

- Lập inventory route, entrypoint, component, CSS/JS và data flow giữa public, Studio, Website Preview và Reader Lab.
- Ghi migration map và shared boundary nhỏ nhất; chưa thực hiện big-bang rewrite.
- Thêm JSON Schema và validator cho environment/feature registry.
- Thêm route helper theo `base_path`, gồm kiểm tra Developer không tồn tại trên public.
- Thêm Studio-only build skeleton sinh manifest và route map.
- Thêm safety test so hash public trước/sau build Studio.
- Chụp baseline desktop/mobile cho Public home, Studio root, Website Preview và Reader Lab.

### Kết quả kiểm tra

- Config validator: đạt, 2 environment và 2 feature.
- Route helper tests: đạt.
- Feature leakage policy: đạt.
- Studio build safety: đạt, 64 public files không đổi hash.
- `git diff --check`: đạt.

### Build checkpoint

- Build ID: `studio-s1-1eb7417941e3`.
- Output: `studio/.website-build/manifest.json` và `route-map.json`.
- Chưa có thay đổi UI runtime; S2 mới bắt đầu tạo shared Studio shell.

## 2026-10-16 — S2 shared Studio shell đầu tiên

### Đã làm

- Mở rộng builder một chiều để sinh Studio từ bốn page public baseline.
- Thay header/footer bằng Studio shell có năm mục, trong đó Developer chỉ có ở Studio.
- Giữ CSS/content production làm baseline; thêm context bar `Studio · Không public` và `noindex,nofollow`.
- Chuyển dashboard công cụ cũ thành route `studio/developer/`, nhóm theo Review, Content và Reader/Experiments.
- Tạo runtime Góc nhìn Studio đọc Release bằng absolute public content base, không đọc Authoring.
- Thêm acceptance test cho năm route và kiểm tra public không chứa Developer/Studio chrome.

### Kết quả kiểm tra

- Studio shell acceptance: đạt cho 5 route.
- Studio build safety: đạt; 64 public files giữ nguyên hash.
- Config, route và feature leakage tests tiếp tục đạt.

### Còn lại để đóng S2

- Đã hoàn tất: 8 tool có back navigation; visual/keyboard/responsive check có evidence desktop/mobile.
- Phát hiện và sửa thanh Studio context bị render hai lần trong lần visual check đầu.
- Build ID cuối S2: `studio-s2-14290080e75a`.

## 2026-10-16 — Đính chính phạm vi S3

- Owner xác nhận `Phân tích trong Góc nhìn` chỉ là ví dụ để diễn đạt ý tưởng Studio staging.
- Chưa quyết định `Phân tích` thuộc Góc nhìn, một tab cấp cao hay hình thức khác.
- Đưa S3 về trạng thái chưa bắt đầu/chờ thảo luận; không triển khai Analysis tab.
- S2 Studio shell vẫn giữ nguyên và là checkpoint hiện tại.
