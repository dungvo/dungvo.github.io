# Task backlog

## S0 — Spec

- [x] Audit `/studio/`, public home, Website Preview, Knowledge Maze và tài liệu chương trình.
- [x] Xác nhận ý tưởng Studio → public đã có trong DOD/WIP.
- [x] Tạo workspace spec-driven.
- [x] Thiết kế repository một source, hai build output và public fail-closed gate.
- [x] Scaffold environment public/studio và feature registry, chưa nối runtime.
- [ ] Owner review scope, đặc biệt ba quyết định trong `STATUS.vi.md`.

## S1 — Inventory

- [x] Liệt kê route và entrypoint public/Studio.
- [x] Lập component parity matrix cho header, nav, footer, cards, search và reader.
- [x] Lập data-flow matrix: Release, Authoring, Analysis API, fixture.
- [x] Chụp baseline desktop/mobile.
- [x] Đề xuất shared module/file layout nhỏ nhất.
- [x] Thiết kế JSON Schema/validator cho environment và feature registry.
- [x] Viết test chứng minh build Studio không thay đổi public file hashes.
- [x] Kiểm tra các relative URL khi chạy dưới `/studio/` và public root.

## S2 — Studio shell

- [x] Viết acceptance test cho bốn route public trong Studio và mục Developer bổ sung.
- [x] Tạo shared shell primitives hoặc quy trình build/copy một chiều có version.
- [x] Chuyển `/studio/` từ link list sang shell.
- [x] Nhóm Developer tools theo Review, Content, Reader/Experiments.
- [x] Thêm/kiểm tra back navigation cho tool pages.
- [x] Hoàn tất visual/keyboard/responsive check; noindex và reduced-motion policy đã có.

## S3 — Website Lab

- [ ] Owner chọn feature thử nghiệm và vị trí của `Phân tích`; không mặc định đặt trong `Góc nhìn`.
- [ ] Thiết kế feature registry schema/lifecycle.
- [ ] Migrate Series preview.
- [ ] Migrate Analysis preview.
- [ ] Chỉ thiết kế navigation/tab sau khi owner chốt cấu trúc trải nghiệm.
- [ ] Thêm preview on/off và trạng thái gate.
- [ ] Chứng minh public bundle không đọc preview data.

## S4 — Knowledge Reader

- [ ] Chọn content/fixture đầu tiên.
- [ ] So sánh `content-analysis.v1` với nhu cầu reader.
- [ ] Nếu thiếu semantics, viết contract proposal trước code.
- [ ] Xây Knowledge list/card trong Website view.
- [ ] Xây route reader theo stable content ID.
- [ ] Hiển thị source/evidence/limits đúng tầng public vs developer.
- [ ] Test deep link, empty, error, loading, mobile và accessibility.
- [ ] Owner đọc và phản hồi nội dung/trải nghiệm.

## S5 — Promotion

- [ ] Chọn một public candidate.
- [ ] Lưu acceptance evidence và rollback note.
- [ ] Owner approve/reject.
- [ ] Nếu approve, activate shared feature cho public và kiểm tra live.
- [ ] So sánh visual public sau Release với đúng Studio candidate đã duyệt.

## Không được làm tắt

- [ ] Không copy nguyên Website Preview sang public.
- [ ] Không thêm tab Developer vào public nav.
- [ ] Không dùng Authoring/Analysis internal API ở public khi chưa Release contract.
- [ ] Không xem “render được trong Studio” là “đủ Release”.
- [ ] Không publish hoặc push khi chưa được owner yêu cầu.
