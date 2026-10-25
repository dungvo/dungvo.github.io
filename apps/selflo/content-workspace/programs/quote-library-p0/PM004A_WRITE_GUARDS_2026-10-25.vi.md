# PM-004A — Chặn đề xuất lại và ghi state sớm — 25/10/2026

## Bằng chứng trước sửa

- select chỉ nhìn first_review trong state, không nhìn canonical rejected, exclusions hoặc canonical-ai-review.
- promote-authoring chỉ kiểm tra state imported, không kiểm tra ID đã tồn tại trong canonical; mất state có thể dẫn tới import trùng.
- apply_ledger ghi state trước khi validate/publish, làm state có thể ghi approved ngay cả khi publisher thất bại.
- prepare-perspective chặn explicit exclusions khi Release nhưng có thể biến canonical rejected thành approved nếu mục chưa có exclusion.
- Catalog hiện có 1.438 candidate, cả 1.438 ID đã có canonical. Có ID khác research_id_original nên cần nối identity rõ ràng thay vì đoán theo văn bản.

## Thiết kế sửa nhỏ nhất

Thay đổi công cụ nội bộ, không đổi contract app hoặc nội dung Release. Thêm gate dùng chung cho daily review và prepare: đọc canonical review, owner exclusions và review ledger; nối candidate.id, research_id_original và canonical_id (nếu có). Không suy alias từ nội dung hoặc tên tác giả. Một nhóm có nhiều canonical ID là mơ hồ và không được tự chọn một bản để promote.

Select bỏ qua canonical đã có, state đã import/release hoặc bị từ chối, và quyết định loại/blocked theo mọi alias. Approval qua ledger cũ không được ghi đè quyết định đóng; người vận hành phải xử lý sổ quyết định rõ ràng khi owner mở lại. promote-authoring không import lại canonical dù state thiếu. promote-release resolve canonical ID và không dùng imported/released cũ làm nguồn truth thay manifest.

apply_ledger chỉ chuẩn bị state trong bộ nhớ. Lỗi ID, quyết định đóng, rights/source gate hoặc publisher failure không được ghi state. Giữ nguyên dữ liệu batch đang có; không migrate/rewrite 1.438 imported.

## Kế hoạch kiểm tra

Fixtures cho rejected/excluded/blocked, alias cũ, canonical đã có nhưng thiếu state, unknown/ambiguous IDs, state sau publisher failure và đường hợp lệ. Chạy toàn bộ tests và audit chỉ đọc trên catalog thật. Không gọi publisher trên source production hoặc tạo Release mới.

## Kết quả kiểm chứng

- 81/81 tests toàn bộ scripts đạt. 21 tests mới bao gồm ledger trùng ID, alias chung nguồn, quyết định loại trong state, canonical/ledger/exclusion, unknown/ambiguous ID, publisher failure thật và đường hợp lệ.
- Audit chỉ đọc catalog thật: 1.438/1.438 candidate đã có canonical; không alias nào mơ hồ nhiều canonical. Toàn bộ 10 quote owner vừa loại được gate bảo vệ. Báo cáo có hash input tại reports/pm004a-write-guard-audit-2026-10-25.json.
- Không đổi quote/story, state.json, review ledger hoặc manifest; Release giữ 48 / 662 quote / 17 story.
- prepare-perspective cũng đọc quyết định rejected trong state qua alias, nên gọi trực tiếp không bỏ qua chặn của daily review.
- promote-release ghi reviewer ai:codex thay vì ngầm dùng default owner:dungvo.
- “Không ghi state khi thất bại” ở đây áp dụng lỗi validation/publisher trước khi thao tác thành công; không tuyên bố giao dịch nguyên tử xuyên Git, network và filesystem. Cơ chế cài package của publisher hiện hữu không được refactor trong bước này.

## Giới hạn và phần tiếp theo

PM-004A đã đồng bộ báo cáo và bảo vệ đường ghi/replay. Chưa migrate state lịch sử thành một ledger duy nhất; state vẫn theo dõi batch còn canonical ledger/manifest giữ quyết định biên tập. Không tự xoá lịch sử import. Gate chỉ nối ID tường minh, không tự tìm bản gần trùng theo ngữ nghĩa.

Một bước tiếp theo: chuẩn bị danh sách ưu tiên review 46 story Authoring-only của PM-005 theo nguồn/quyền và mức sẵn sàng; báo cáo câu/bài có vấn đề cho owner trước khi thay nội dung hoặc Release.
