# PM-STUDIO-P1 — Trạng thái

**Ưu tiên:** P1
**Trạng thái tổng:** S2 hoàn thành — tạm dừng trước khi chọn feature thử nghiệm tiếp theo
**Bắt đầu:** 2026-10-15
**Owner nghiệm thu cuối:** Dũng
**Phạm vi:** Website trong repo `apps/selflo`; không sửa app native.

## Mục tiêu

Tạo một Selflo Studio là bản staging chính xác của website public. Khi mở `/apps/selflo/studio/`, owner nhìn thấy cùng website Selflo và cùng bốn mục public, nhưng Studio bổ sung:

1. cùng bốn mục `Trang chủ`, `Góc nhìn`, `Hỗ trợ`, `Quyền riêng tư`;
2. thêm mục `Developer` chỉ có trong Studio, cho review, catalog, matrix, seed, reader lab và công cụ nội bộ;
3. trạng thái rõ feature nào chỉ ở Studio, feature nào là public candidate, feature nào đã Release;
4. Knowledge Reader để đọc bài Knowledge/Analysis theo trải nghiệm hoàn chỉnh;
5. đường promotion có kiểm soát từ feature thử trong Studio sang public.

## Đánh giá hiện trạng

| Hạng mục | Hiện có | Khoảng trống |
|---|---|---|
| `/studio/` | Trang danh sách link công cụ, `noindex` | Không có UI/shell giống public; chưa có tab Website/Developer |
| `/studio/website-preview/` | Prototype gần public, có Story/Series/Analysis/Knowledge và feature config | Là implementation riêng; CSS/header riêng; chưa phải shared shell; không phải entry Studio chính |
| Public `/apps/selflo/` | Home và shell production | Chưa có cơ chế nhận feature đã nghiệm thu từ Website Lab một cách rõ ràng |
| Knowledge Maze | Prototype khám phá theo node | Không thay thế reader tuyến tính cho một bài Knowledge/Analysis |
| Analysis | Active Authoring-only contract và Studio preview | Mới hiển thị card/details; chưa có route/detail Knowledge Reader |
| Thiết kế Reader | Có mockup/screenshot và Reader Lab | Chưa hợp nhất thành reader cho Knowledge/Analysis trên Studio/public |

## Checkpoint hiện tại

- Ý định kiến trúc trước đây là có thật và đã được ghi trong DOD/WIP.
- Prototype Website Preview đã có nhưng mới chứng minh ý tưởng, chưa đạt shared implementation.
- Workspace spec-driven này là canonical nơi theo dõi việc hoàn thiện.
- Repository design đã chốt hướng một source, hai build output; environment và feature registry đã được scaffold nhưng chưa nối runtime.
- Current-state review đã xác nhận có thể giữ HTML/CSS/JavaScript; React không nằm trong v1.
- S1 đã có route/component/data-flow inventory, migration map và baseline desktop/mobile.
- Environment/feature registry có JSON Schema và validator fail-closed.
- Route helper đã kiểm tra được public/studio base path và chặn Developer trên public.
- Studio-only build `studio-s1-1eb7417941e3` chỉ sinh manifest/route map dưới `studio/.website-build/`.
- Safety test xác nhận build Studio không đổi hash của 64 public files được bảo vệ.
- Studio đã có năm route build một chiều: Trang chủ, Góc nhìn, Hỗ trợ, Quyền riêng tư và Developer.
- Developer đã gom tool theo Review, Content và Reader/Experiments; prototype cũ vẫn được giữ để migration sau.
- Tám developer tools đều có đường quay lại Studio.
- Visual/responsive evidence đã lưu cho Studio Home và Developer ở desktop/mobile.
- Build được nghiệm thu kỹ thuật ở checkpoint này là `studio-s2-14290080e75a`.
- Public HTML/CSS/JavaScript vẫn không đổi.

## Quyết định cần thảo luận trước khi làm tiếp

Chưa triển khai `Phân tích`. Owner chưa quyết định nội dung này nên nằm trong `Góc nhìn`, thành một tab cấp cao riêng hay có hình thức khác. Ví dụ “Góc nhìn có tab Phân tích” chỉ dùng để giải thích mô hình Studio → Public, không phải yêu cầu đã chốt.

## Đúng một bước tiếp theo

Khi owner muốn quay lại, thảo luận và so sánh các phương án đặt `Phân tích` trước khi viết spec UI hoặc code.

## Quyết định còn mở

- Knowledge Reader đầu tiên đọc `Knowledge`, `Analysis`, hay một package ghép cả hai.
- `Phân tích` thuộc `Góc nhìn`, một tab cấp cao riêng, hay một cấu trúc khác.
- Feature promotion có cần nút trong UI hay trước mắt chỉ là config + review workflow.
