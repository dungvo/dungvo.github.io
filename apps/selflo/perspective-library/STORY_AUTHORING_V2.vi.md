# Hướng dẫn biên tập Story V2

Đọc cùng [Story Layout V2 Contract](STORY_LAYOUT_V2_CONTRACT.vi.md). Mục tiêu không phải tải hoặc tóm tắt một truyện có sẵn, mà là tạo một bản kể tiếng Việt có nhịp đọc tự nhiên, trung thành với sự kiện/ý nghĩa nguồn và đủ provenance để phát hành.

## Quy trình

1. Xác nhận nguồn, quyền sử dụng và những sự kiện/ý nghĩa không được thay đổi.
2. Viết lại thành tiếng Việt tự nhiên; không bám cấu trúc câu của bản dịch trung gian.
3. Gom 1–4 câu cùng một beat vào `paragraph.style = narrative`.
4. Dùng `transition` chỉ khi đổi thời gian, bối cảnh hoặc bước ngoặt.
5. Dùng `dialogue_lead` cho câu dẫn cần gắn sát lời thoại/pull quote sau đó.
6. Chỉ giữ pull quote là câu bản lề thật sự cần người đọc dừng lại.
7. Dùng section cho thay đổi cấu trúc; dùng `part_heading` cho phần lớn của story dài.
8. Viết takeaway, hai prompt và optional closing sau khi prose đã ổn định.
9. Render trên Web Reference ở light/sepia/dark và cỡ chữ lớn.
10. Publish Authoring trước; Release chỉ sau owner approval.

## Quy tắc prose

- Paragraph là đơn vị ý/beat, không phải đơn vị câu.
- Không tự động tách mỗi câu thành block.
- Không ghép các cảnh hoặc lượt thoại khác nhau chỉ để giảm block count.
- Giữ nhịp câu đa dạng; ưu tiên từ ngữ cụ thể, tránh diễn giải đạo lý sau từng sự kiện.
- Với truyện cổ, phần kể lại được phép tự nhiên hóa nhưng không thêm sự kiện hoặc đổi kết luận triết học.
- Với story đã owner duyệt, giữ nguyên câu chữ và thứ tự; chỉ thay block boundary/type/style và bổ sung vùng V2 riêng khi được phép.

## Pull quote

- Story thông thường: mục tiêu 1–3 pull quote.
- Story dài có layout review: chỉ giữ những motif/câu bản lề quan trọng; không dùng pull quote cho mọi câu ngắn hay câu hỏi.
- Không dùng presentation override để hạ pull quote thành paragraph.

## Takeaway và reflection

- Takeaway: khoảng 35–90 từ, không tóm tắt cốt truyện hoặc lặp câu cuối.
- Prompt: hai câu hỏi mở nối trực tiếp với tension, không chẩn đoán và không ép người đọc hành động.
- Closing: một câu ngắn tạo dư âm, không mở luận điểm mới.

## Checklist trước owner review

- [ ] Sự kiện, nhân vật, nguồn và kết luận gốc được giữ.
- [ ] Không còn chuỗi paragraph bị tách theo từng câu máy móc.
- [ ] Mọi paragraph V2 có style hợp lệ.
- [ ] Pull quote ít và có lý do semantic.
- [ ] Takeaway không trùng đoạn kết.
- [ ] Có 1–2 prompt và optional closing.
- [ ] Artwork resolve qua shared catalog hoặc no-image an toàn.
- [ ] Schema, reference, density và locked-prose checks đều pass.
- [ ] Web Reference pass ba theme và font scale.

