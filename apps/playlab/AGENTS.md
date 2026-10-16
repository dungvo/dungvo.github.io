# Hướng dẫn AI agent cho Playlab

Áp dụng cho toàn bộ thư mục này. Đây là dự án spec-first; hiện chưa được phép code game hoặc deploy.

## Thứ tự đọc bắt buộc

1. `docs/current-handoff.md`
2. `README.md`
3. `.specify/memory/constitution.md`
4. `docs/decision-log.md`
5. README, handoff, decision log và design/spec trong experience đang làm

## Quy tắc làm việc

- Phân biệt rõ **Đã chốt**, **Đề xuất**, **Câu hỏi mở**; dùng `PL-DEC-*` cho quyết định chung và `DEC-*` trong từng experience.
- Không trộn canon giữa các experience. Nội dung riêng nằm dưới `experiences/<slug>/`.
- Không biến suy đoán của AI thành canon. Mọi thay đổi product promise, nhóm tuổi, learning goal, core mechanic, world consequence, dữ liệu lưu, dependency hoặc kiến trúc đều cần owner chốt.
- Với ý tưởng mới: ghi vào backlog/discussion trước; chỉ tạo hoặc sửa spec sau khi phạm vi đủ rõ.
- Với behavior mới: cập nhật design/spec trước implementation. Hiện implementation ngoài scope.
- Không tạo `src/`, package manifest, asset, build, Firebase, analytics, login, CI deploy hoặc GitHub Pages output khi chưa được yêu cầu.
- Không commit/push/deploy nếu user chưa yêu cầu trực tiếp. Giữ nguyên thay đổi không liên quan trong repo.
- Tài liệu chính dùng tiếng Việt; identifier và thuật ngữ kỹ thuật có thể dùng tiếng Anh.
- Trước khi kết thúc session, cập nhật handoff của experience đang làm; chỉ cập nhật `docs/current-handoff.md` nếu trạng thái chung của Playlab thay đổi.

## Definition of ready cho implementation sau này

Chỉ chuyển sang code khi spec có: mục tiêu, non-goals, user stories, acceptance criteria, learning intent, accessibility/safety, data impact, test/playtest plan, dependency decision và owner authorization.

