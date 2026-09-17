# Giai đoạn 9D — Gói duyệt pilot suy ngẫm

Ngày lập: 2026-09-17  
Trạng thái: Sẵn sàng cho chủ sở hữu rà soát  
Phạm vi: Quyết định biên tập; không tạo runtime package và không thay đổi app

## 1. Quyết định cần đưa ra

Vòng duyệt này không hỏi “có nên xây tính năng không”. Nó chỉ kiểm tra chất lượng content theo chuỗi:

```text
trải nghiệm do người dùng tự chọn
→ lời mời có thể bỏ qua
→ người dùng tự viết hoặc không viết
→ có thể kết thúc tại đây
→ nếu họ chủ động muốn xem thêm, một Góc nhìn có thể đứng bên cạnh
```

Chủ sở hữu cần quyết định riêng ba lớp:

1. Lời mời nào đủ mở và tự nhiên.
2. Góc nhìn nào đủ điều kiện để thử trong ngữ cảnh nhạy cảm này.
3. Cặp lời mời–Góc nhìn nào không chấm bài hoặc diễn giải thay người dùng.

## 2. Baseline C0

- Authoring local: revision 33, 79 descriptor, 389 quote active.
- Release local: revision 10, 27 descriptor, 53 quote active.
- Ba câu tạm giữ vẫn có trong Authoring và không có trong active Release 10.
- Byte count và SHA-256 của mọi descriptor local khớp manifest.
- Audit `r33` và `r10` khớp SHA-256 của manifest tương ứng.
- `test_prepare_perspective.py`: 9/9 đạt.
- `test_library_updates.py`: 1/1 đạt.
- Ruby syntax đạt. `git diff --check` đạt cho phạm vi canonical source và generated artifacts; toàn bộ research mới còn cảnh báo dấu cách cuối dòng Markdown có chủ ý từ các tài liệu trước pilot.
- Public endpoint ngày 2026-09-17 vẫn là Release 9; Release 10 là baseline ứng viên local, chưa được gọi là baseline public.

## 3. Tài liệu cần đọc trong vòng duyệt

1. `phase-9b-reflection-pilot-prompts.md` — duyệt từng lời mời.
2. `phase-9a-reflection-pilot-selection.md` — duyệt từng ứng viên Góc nhìn.
3. `phase-9c-reflection-pilot-pairing.md` — duyệt từng cặp và quyền giữ im lặng.

## 4. Phiếu duyệt lời mời

Với mỗi lời mời, trả lời:

- Câu chữ có tự nhiên như tiếng Việt đời thường không?
- Có cài sẵn giả định về người dùng không?
- Có khiến người dùng phải tìm bài học, nguyên nhân hoặc giải pháp không?
- Có thật sự bỏ qua được không?
- Có thể kết thúc trải nghiệm ngay sau lời người dùng viết không?
- Quyết định: `giữ_nguyên`, `sửa_câu_chữ`, `chỉ_dùng_khi_người_dùng_chọn`, hoặc `loại`.

## 5. Phiếu duyệt Góc nhìn

Với mỗi ứng viên, trả lời:

- Có đứng độc lập không?
- Có quyền và attribution rõ không?
- Có mở thêm góc nhìn hay đưa ra kết luận?
- Có biến giới hạn thực tế thành lỗi cá nhân không?
- Có an toàn khi đứng ngay sau lời riêng tư chưa biết nội dung không?
- Có nên chỉ xuất hiện khi người dùng chủ động chọn chủ đề?
- Quyết định: `giữ_để_thử`, `sửa_trước_khi_thử`, `chỉ_dùng_khi_người_dùng_chủ_động_chọn`, hoặc `loại_khỏi_pilot`.

## 6. Phiếu duyệt cặp

Với mỗi cặp, trả lời:

- Góc nhìn có lặp hoặc “chấm bài” lời mời không?
- Nó có xác nhận một kết luận chưa được người dùng xác nhận không?
- Cặp có còn phù hợp nếu người dùng viết điều hoàn toàn khác dự kiến không?
- Giữ im lặng có tôn trọng người dùng hơn không?
- Quyết định: `giữ`, `sửa_lời_mời`, `đổi_Góc_nhìn`, `chỉ_khi_người_dùng_chủ_động_chọn`, `giữ_im_lặng`, hoặc `loại`.

## 7. Tiêu chí qua C4

C4 chỉ hoàn tất sau owner review khi:

- có ít nhất một lời mời được duyệt mà không buộc phải dẫn tới content;
- mỗi Góc nhìn được giữ đều có quyết định rõ về quyền, review và ngữ cảnh;
- mọi mapping được giữ đều có rationale và giới hạn;
- “không đưa Góc nhìn” là một kết quả hợp lệ;
- không dùng user text để suy luận theme, trạng thái tâm lý hoặc candidate;
- chưa tạo schema, manifest, JSON runtime hoặc publisher mới.

## 8. Ngoài phạm vi

- thay đổi app hoặc tài liệu app;
- tạo `reflection-pilot/vi/*.json`;
- mở rộng Perspective Library schema;
- đổi canonical quote hoặc `review.status`;
- publish Release 10;
- viết truyện 8–10;
- nghiên cứu hành vi người dùng.

## 9. Bước tiếp theo duy nhất

Chủ sở hữu duyệt lần lượt bộ lời mời, danh sách Góc nhìn và ma trận ghép; chưa materialize data trước khi có quyết định này.
