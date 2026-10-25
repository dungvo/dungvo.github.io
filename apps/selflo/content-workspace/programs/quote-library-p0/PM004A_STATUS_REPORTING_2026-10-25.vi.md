# PM-004A — Đồng bộ báo cáo trạng thái biên tập — 25/10/2026

## Vấn đề và hướng sửa

Lệnh daily-content-review.py status chỉ đếm state nhập candidate, vì vậy vẫn báo 1.438 imported dù các quote đã được review/phát hành bằng pipeline canonical. Imported chỉ là lịch sử xử lý batch, không phải trạng thái biên tập hiện tại.

Giữ state.json cho tiến độ nhập candidate. Review Matrix là projection báo cáo dùng chung CLI/Studio; nó đã được tạo từ manifest Authoring/Release, canonical-ai-review và shortlist. Không tạo thêm ledger quyết định cạnh tranh và không chuyển imported thành approved.

Generator thêm status_inputs_sha256 cho sáu đầu vào trạng thái: hai manifest, source index, canonical exclusions, review ledger và shortlist. CLI chỉ xuất editorial_status với counts khi fingerprint khớp; thiếu matrix hoặc đầu vào đã đổi thì báo missing/stale và yêu cầu rebuild. Cơ chế này xác nhận độ mới đối với sáu đầu vào đã nêu, không phải fingerprint toàn bộ workbook/research corpus.

Output cũ catalog/batch_sequence/states được giữ để tương thích, bổ sung states_scope=candidate_import_workflow_only và giải thích tiếng Việt. Tiến độ biên tập xem editorial_status.states, không dùng imported làm số chưa review.

## Kết quả

- R1–R6 đã push lên main tại fb65c40.
- Snapshot hiện tại: Authoring 87 / Release 48, 5.471 dòng, 662 released, 33 held_not_passed; cả 10 quote owner vừa loại đều held_not_passed.
- Bổ sung 5 tests: snapshot hiện hành, ledger đổi khi revision không đổi, manifest đổi, matrix cũ thiếu fingerprint và matrix chưa tồn tại.
- 60/60 tests toàn bộ scripts đạt.
- Không đổi quote/story hoặc tăng Release revision trong bước backlog này.

## Phạm vi còn lại

PM-004A chưa đóng toàn bộ: đã thống nhất phần đọc/báo cáo, các lệnh select/apply/promote vẫn dùng state batch hiện hữu. Cần audit đường ghi và identity mapping Candidate ↔ Canonical trước khi hợp nhất tiếp; không tự ghi lại 1.438 state imported vì sẽ làm mất ý nghĩa lịch sử.

Một bước tiếp theo: audit select/apply/promote và mapping ID để bảo đảm quyết định rejected/exclusion không bị hàng đợi candidate đưa lại vào batch. Việc chuẩn hóa toàn bộ Authoring tiếng Anh vẫn để sau, theo yêu cầu owner.
