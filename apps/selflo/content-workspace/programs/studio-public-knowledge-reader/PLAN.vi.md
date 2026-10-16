# Implementation plan

## S0 — Discovery và spec

**Trạng thái:** Hoàn thành

- Xác nhận owner intent và audit code/tài liệu hiện có.
- Chốt HTML/CSS/JavaScript hiện tại; không React trong v1.
- Chốt một source, hai build output; không dùng branch trong kiến trúc.
- Ghi spec, architecture, plan, tasks và DOD.
- Không sửa runtime.

**Exit đạt:** owner đã làm rõ staging model, an toàn public và lựa chọn công nghệ.

## S1 — Inventory và shared boundary

**Trạng thái:** Hoàn thành 2026-10-16

- Lập bảng public/studio component, CSS, JS, data source và route.
- Xác định asset generation đang active; đánh dấu legacy nhưng chưa xóa.
- Chụp baseline desktop/mobile cho public, Studio root, Website Preview và Reader Lab.
- Chọn shared primitives nhỏ nhất; tránh “big bang” rewrite.
- Ghi migration map cho `website-preview`.
- Định nghĩa route/base-path helper để cùng page chạy dưới public root và `/studio/`.
- Viết schema/validator cho environment và feature registry.
- Viết safety test lưu hash public trước/sau Studio build.

**Artifacts:** component parity matrix, route/data-flow matrix, screenshot baseline, migration map, schema/tests.

**Exit đạt:** từng asset/component có quyết định giữ nguyên, share, migrate hoặc retire; Studio build skeleton đã chứng minh không đổi hash của 64 public files được bảo vệ.

## S2 — Studio shell

**Trạng thái:** Hoàn thành 2026-10-16

- Trích shell từ UI production hiện tại, không redesign.
- Tạo staging shell có `Trang chủ`, `Góc nhìn`, `Hỗ trợ`, `Quyền riêng tư` và thêm `Developer` bằng environment config.
- Sinh bốn route Studio từ shared source; public files chưa đổi.
- Developer dashboard nhóm tool và thêm đường quay lại.
- Thêm noindex, accessibility và responsive checks.
- So screenshot Studio với public cho bốn route ở desktop/mobile.

**Artifacts:** shared shell source, Studio output, Developer navigation, visual report.

**Exit:** `/studio/` là staging site có parity với public; sai khác chỉ là Developer/noindex/preview chrome.

## S3 — Website feature lab

**Trạng thái:** Chưa bắt đầu — chờ owner chọn feature và vị trí trải nghiệm

- Dùng lifecycle registry đã scaffold và nối validator/runtime.
- Ví dụ từng dùng để giải thích kiến trúc là thử `Phân tích` trong `Góc nhìn`; đây chưa phải phương án đã chốt.
- Trước implementation phải so sánh ít nhất: `Phân tích` nằm trong `Góc nhìn`, là tab cấp cao riêng, hoặc là một trải nghiệm/reader khác.
- Hỗ trợ preview feature bật/tắt và status badge.
- Chỉ migrate prototype sau khi owner chọn feature/vị trí; Series không mở rộng scope mặc định.
- Bảo đảm public không load Studio-only data/code ngoài shared primitives an toàn.

**Artifacts dự kiến:** feature placement decision, shared page source tương ứng, Studio-only experiment, feature-state tests và public leakage scan.

**Exit:** feature được owner chọn hoạt động trong Studio, public file/hash/behavior không đổi.

## S4 — Knowledge Reader Studio

- Dùng một Analysis hiện có làm technical fixture đầu tiên; việc chọn bài public thật vẫn cần owner.
- Xác nhận content model hiện tại đủ hay cần proposal.
- Tái sử dụng typography/reader primitives hiện có khi phù hợp; không copy nguyên Story Reader.
- Xây list/detail/deep link và source/evidence/limits presentation.
- Visual QA, mobile, keyboard, empty/error/loading.

**Artifacts:** Analysis list/card, Knowledge Reader route, fixture adapter, reader tests và screenshots.

**Exit:** owner đọc được một bài hoàn chỉnh trong Studio; public chưa có route/tab mới.

## S5 — Public candidate workflow

- Chọn feature đã được owner quyết định và đạt acceptance làm public candidate.
- Khóa Studio build ID và source revision được owner duyệt.
- Lập acceptance evidence, rollback và public activation change.
- Build public trong thư mục tạm; chặn Authoring/fixture/Developer/studio-only assets.
- Chỉ Release sau owner approval; public phải khớp staging candidate qua visual comparison.

**Exit:** chứng minh promotion không phải copy hai codebase.

## S6 — Đóng migration

- Retire/redirect Website Preview cũ sau khi mọi feature còn dùng đã migrate.
- Cập nhật README/WIP/DOD/routes.
- Kiểm tra không còn implementation cạnh tranh hoặc tài liệu mâu thuẫn.
- Đánh dấu generated output và source ownership rõ để người sau không sửa nhầm output.
