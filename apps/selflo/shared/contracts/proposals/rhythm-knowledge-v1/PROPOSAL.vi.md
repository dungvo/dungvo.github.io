# Rhythm Knowledge V1 — App–Content Handoff Proposal

**Trạng thái:** Tạm dừng; hướng hiện hành được chốt tại `shared/decisions/ADR-0002-tam-dung-rhythm-knowledge-va-content-first.vi.md`  
**Ngày:** 2026-10-12  
**Proposal ID:** `selflo.rhythm-knowledge.v1`  
**Owner:** Selflo app + Selflo content

## Mục đích

Package này là điểm vào chung để app repo và content repo thống nhất mục đích, tiêu chuẩn nghiên cứu và brief bài pilot cho capability `Khám phá cơ chế này` trong feature `Hiểu nhịp của mình`.

Proposal được giữ làm lịch sử nghiên cứu. Theo ADR-0002, hướng nối trực tiếp Rhythm pattern với Knowledge đang tạm dừng vì Check-in chưa cho biết tình huống, suy nghĩ hoặc hành vi cụ thể và kho Knowledge chưa đủ để thiết kế coverage production. Không tiếp tục workflow K2 từ proposal này.

Đây chưa phải active wire contract, schema hoặc quyền publish content. Không thêm proposal này vào contract registry trước khi owner duyệt content model, presentation capability và app conformance.

## Tài liệu trong package

1. [Content handoff](CONTENT_HANDOFF.vi.md): product promise, scientific standard, claim policy, authoring workflow, review rubric và ownership.
2. [K2 pilot content brief](K2_PILOT_CONTENT_BRIEF.vi.md): brief nghiên cứu bài đầu tiên về sự việc → diễn giải/dự đoán → cảm xúc/cơ thể → thôi thúc/hành vi → feedback.

## Bối cảnh app

Feature workspace và UI decisions hiện nằm trong app repo:

```text
Selflo/Docs/workspaces/rhythm-reading-analysis-spike-v1-2026-10-08/
```

Các quyết định sản phẩm cần giữ:

- Knowledge là continuation phân tích chính, nằm trên `MỘT GÓC NHÌN` khi article sẵn sàng.
- Khi Knowledge chưa có article và route hợp lệ, app ẩn card thay vì hiển thị dead end.
- Rhythm chỉ truyền observed structured facts/signals; content không được suy thoughts, behaviors, diagnosis hoặc nguyên nhân cá nhân.
- 33 scenario dùng để kiểm tra coverage của các Knowledge family; không tạo một article hoặc production branch cho mỗi fixture.

## Phân loại thay đổi

Hiện tại package chỉ là **research/editorial proposal**:

- không đổi schema;
- không đổi runtime payload;
- không sửa canonical content trong `perspective-library/source/vi/`;
- không sửa generated Authoring/Release;
- không cho phép publish.

Nếu pilot cần article entity, reader component, mapping semantics hoặc activation rule chưa có, phải mở phần contract/app conformance tương ứng và đi theo app-impacting flow trước khi Release.

## Workflow cũ — đã tạm dừng

```text
Không tiếp tục K2, mapping contract hoặc App implementation từ package này.

Hướng hiện hành:

```text
Góc nhìn/Story authoring
→ lưu research và phân tích có giá trị thành Knowledge candidate
→ xây Knowledge inventory đã review
→ xác định content cần input nào để chọn đúng
→ nghiên cứu thay đổi Check-in + privacy
→ proposal/contract mới nếu owner quyết định mở lại
```

## Đúng một bước tiếp theo

Tiếp tục Góc nhìn/Story và xây Knowledge inventory từ content thực tế. Không phát triển thêm Rhythm Knowledge hoặc thay đổi Check-in cho tới khi các điều kiện mở lại trong ADR-0002 được đáp ứng.
