# Rhythm Knowledge workspace

Workspace nghiên cứu, thiết kế coverage và authoring cho lớp Knowledge của Rhythm Reading. Nội dung trong thư mục này là Authoring/research, không phải Release.

> **Tạm dừng:** ADR-0002 đã dừng hướng phủ 33 trường hợp và nối trực tiếp Rhythm sang Knowledge. Các tệp dưới đây là thử nghiệm lịch sử, không phải danh sách công việc đã duyệt, không được đưa vào nguồn nội dung chuẩn hoặc bản phát hành. Hướng hiện hành là tạo Góc nhìn/Story, lưu lại các bài Knowledge tiềm năng có giá trị, rồi chỉ nghiên cứu lại Check-in và quy tắc chọn bài khi kho nội dung đã đủ rõ.

## Package

- `CURRENT_STATE_AND_COVERAGE.vi.md`: audit, architecture, reuse và coverage 33/33.
- `RESEARCH_PACKAGE.vi.md`: search strategy, source inventory và claim–source matrix chung.
- `mapping-candidate.v1.json`: projection đề xuất từ typed signal/facts sang chín article; chưa phải runtime contract.
- `articles/`: chín full Vietnamese drafts.
- `REVIEW_AND_HANDOFF.vi.md`: multi-role review, rubric, validation và remaining release gates.

## Boundary

Không file nào trong workspace này được publish trực tiếp. Flow hợp lệ là owner acceptance → contract/app conformance → materialize canonical source → generate Authoring Preview → owner visual acceptance → Release promotion riêng.

