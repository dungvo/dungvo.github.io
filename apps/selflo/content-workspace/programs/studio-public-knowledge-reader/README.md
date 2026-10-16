# PM-STUDIO-P1 — Studio parity, Website Lab và Knowledge Reader

Workspace spec-driven cho việc biến Selflo Studio thành môi trường phát triển/nghiệm thu có trải nghiệm gần website public, đồng thời giữ thêm khu Developer và các feature chưa Release.

## Đọc theo thứ tự

1. `STATUS.vi.md` — checkpoint và đúng bước tiếp theo.
2. `SPEC.vi.md` — vấn đề, phạm vi, user stories và acceptance criteria.
3. `CURRENT_STATE_REVIEW.vi.md` — audit HTML/CSS/JS, khoảng trống và rủi ro migration.
4. `ARCHITECTURE.vi.md` — ranh giới shared/public/studio và promotion model.
5. `REPOSITORY_DESIGN.vi.md` — cấu trúc source, environment, build output và fail-closed public gate.
6. `PLAN.vi.md` — phase triển khai.
7. `TASKS.vi.md` — backlog có thứ tự và gate.
8. `WORKLOG.vi.md` — nhật ký append-only.

## Quyết định nền

- Studio và public web không phải hai website được phát triển độc lập.
- Phần trải nghiệm website dùng chung source/component/data adapter khi có thể.
- Studio có thêm chrome nội bộ, trạng thái preview, Developer và feature flags.
- Public chỉ nhận feature/content đã được owner chấp nhận và qua Release gate.
- Không “copy bằng tay” một bản Studio sang public; promotion phải là thay đổi cấu hình/capability hoặc shared implementation có kiểm soát.
- Knowledge Maze là một thử nghiệm khác Knowledge Reader; Maze không được dùng thay cho reader tuyến tính của bài phân tích.

## Ngoài phạm vi của bước khởi tạo

Workspace này chưa sửa UI, chưa đưa Knowledge lên Release, chưa publish và chưa thay contract production.
