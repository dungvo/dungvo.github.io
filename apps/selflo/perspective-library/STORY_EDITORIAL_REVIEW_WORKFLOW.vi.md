# Story V2 — Quy trình review chất lượng nội dung

**Mục đích:** dùng cho mọi vòng cải thiện story sau khi data contract đã ổn định. Tài liệu này điều phối review biên tập; contract semantic vẫn nằm tại [Story Layout V2 Contract](STORY_LAYOUT_V2_CONTRACT.vi.md), còn quy tắc viết chi tiết nằm tại [Hướng dẫn biên tập Story V2](STORY_AUTHORING_V2.vi.md).

## 1. Nguyên tắc vận hành

- Khóa semantic contract trong lúc review content. Không tự thêm field, block type hoặc presentation override vào một story.
- Không bulk-transform nhiều story bằng cùng một công thức. Mỗi story cần một editorial pass độc lập.
- Review prose trước, block boundary và presentation sau.
- Web là Reference Renderer để owner duyệt trải nghiệm đọc; canonical payload vẫn là nguồn sự thật.
- Chỉ sửa canonical trong `source/vi/`. Publish Authoring để review; chỉ publish Release sau khi owner duyệt bản render cuối.
- Với story đã owner duyệt, giữ nguyên câu chữ và thứ tự trong phạm vi đã khóa. Chỉ thay đổi phần được owner cho phép.

## 2. Bộ semantic được phép dùng

- `paragraph`: `narrative`, `dialogue_lead`, `transition`.
- `heading`.
- `part_heading`.
- `pull_quote`.
- `divider`.
- `takeaway`.
- `reflection.prompts_vi`.
- `reflection.closing_vi`.

Nếu phát hiện nhu cầu semantic mới, ghi thành đề xuất contract riêng. Không đưa trực tiếp vào canonical story trong vòng review content.

## 3. Editorial profile theo loại story

Profile là cách review, không phải field bắt buộc trong payload.

| Nhóm | Story hiện tại | Hướng biên tập |
|---|---|---|
| Ngụ ngôn ngắn | Tái ông thất mã; Chiếc thuyền rỗng trên sông; Cây lớn ngoài thước người thợ; Cây và con ngỗng im lặng | Ít section, nhịp kể gọn, thường 1–3 pull quote |
| Chiêm nghiệm vừa | Bức ảnh thiếu một góc; Chiếc la bàn không đi thay bạn | Section theo diễn tiến, pull quote chỉ ở bước ngoặt |
| Long-form | Nếu tôi được sống một đời người | Một mạch scroll, ba `part_heading`, các chương nhỏ nằm trong ba phần lớn |

## 4. Bốn lượt review bắt buộc

### Lượt A — Mạch truyện

Chỉ đánh giá nội dung và diễn tiến, chưa chọn block style:

- Người đọc có hiểu chuyện đang diễn ra không?
- Cảnh nào chuyển quá nhanh hoặc thiếu cầu nối?
- Đoạn nào lặp sự kiện hay giải thích quá mức?
- Phần kết có tự nhiên và đúng ý nghĩa gốc không?

### Lượt B — Nhịp đọc

- Gom 1–4 câu cùng một beat thành một paragraph.
- Tách paragraph khi đổi người nói, thời gian, cảnh hoặc ý.
- Không tách mỗi câu thành một block.
- Không ghép các cảnh hay lượt thoại khác nhau chỉ để giảm block count.
- Chọn `transition` và `dialogue_lead` theo chức năng thật, không dùng để trang trí.

### Lượt C — Điểm nhấn

Chỉ chọn pull quote sau khi prose và paragraph boundary đã ổn:

- Câu này có thật sự đáng để người đọc dừng lại không?
- Nếu bỏ treatment pull quote, câu chuyện có mất một bước ngoặt không?
- Pull quote có lặp opening quote, đoạn bên cạnh hoặc takeaway không?

Mật độ tham khảo:

- Story ngắn: 1–3 pull quote.
- Story vừa: 2–4 khi thật sự cần.
- Long-form: khoảng 6–12 trên toàn story; ngoại lệ cần `layout_review`.

### Lượt D — Ending

Review riêng ba tầng:

1. Đoạn kết của câu chuyện hoàn tất mạch kể.
2. `takeaway`/“Nhìn lại” diễn giải ý nghĩa, không kể lại đoạn kết.
3. Prompt và closing đưa câu chuyện về trải nghiệm người đọc, không lặp cùng thông điệp bằng cách diễn đạt khác.

## 5. Scorecard owner review

Chấm từng tiêu chí từ 1 đến 5:

| Tiêu chí | Câu hỏi kiểm tra |
|---|---|
| Mạch truyện | Có dễ theo dõi từ đầu đến cuối không? |
| Nhịp paragraph | Các đoạn có tự nhiên, không vụn hoặc quá dày không? |
| Điểm nhấn | Pull quote có ít, đúng chỗ và không lấn át prose không? |
| Định hướng | Section/part heading có giúp người đọc biết mình đang ở đâu không? |
| Đoạn kết | Câu chuyện có kết thúc trọn vẹn và còn dư âm không? |
| Nhìn lại | Có thêm một góc nhìn thay vì tóm tắt truyện không? |
| Prompt | Có nối trực tiếp với tension của story và đủ mở không? |
| Cảm giác biên tập | Có giống một tác phẩm được biên tập thay vì nội dung bị máy chia block không? |

Điều kiện đề nghị để owner duyệt:

- Không tiêu chí nào dưới 3.
- Mạch truyện, nhịp paragraph và đoạn kết đạt ít nhất 4.
- Owner đã đọc bản render cuối, không chỉ đọc JSON hoặc thống kê.

## 6. Quy trình cho từng story

1. Lập editorial diagnosis, chưa sửa canonical.
2. Đề xuất mạch section, paragraph boundary, style và pull quote.
3. Tạo bản Web Reference để owner đọc toàn bộ.
4. Ghi nhận quyết định: giữ, sửa hoặc khóa nội dung.
5. Chỉ sau khi owner đồng ý mới cập nhật canonical.
6. Chạy schema, semantic, locked-prose và reading-time checks.
7. Publish Authoring và review light/sepia/dark, standard/large text.
8. Owner duyệt bản render cuối.
9. Publish revision mới sang Release.

## 7. Thứ tự review batch hiện tại

1. **Tái ông thất mã** — thiết lập chuẩn cho truyện ngụ ngôn ngắn; so sánh với bản cũ owner từng thấy đẹp.
2. **Chiếc thuyền rỗng trên sông** — kiểm chứng chuẩn ngụ ngôn trên story thứ hai.
3. **Cây lớn ngoài thước người thợ**.
4. **Cây và con ngỗng im lặng**.
5. **Bức ảnh thiếu một góc**.
6. **Chiếc la bàn không đi thay bạn** — preservation/parity review; giữ nội dung đã duyệt.
7. **Nếu tôi được sống một đời người** — regression review; giữ nội dung và cấu trúc ba phần đã duyệt.

## 8. Ranh giới nội dung đã chốt

- **Nếu tôi được sống một đời người:** giữ nội dung hiện tại và cấu trúc ba phần lớn trong một mạch scroll.
- **Chiếc la bàn không đi thay bạn:** giữ nội dung đã duyệt; chỉ sửa block boundary/style hoặc bổ sung vùng V2 còn thiếu khi được phép.
- **Tái ông thất mã:** lấy trải nghiệm của phiên bản owner từng thấy đẹp làm chuẩn; phải giữ phần “Nhìn lại”, prompt và closing đầy đủ.
- Bốn story còn lại cần editorial pass thủ công; không xem việc hợp schema là bằng chứng rằng trải nghiệm đọc đã đạt.

## 9. Definition of done

Một story chỉ hoàn tất vòng cải thiện khi:

- Đạt scorecard owner review.
- Nội dung khóa không đổi ngoài phạm vi được cho phép.
- Schema và semantic validator pass.
- Không có heuristic presentation ngoài contract.
- Web Reference render đúng hierarchy ở các trạng thái bắt buộc.
- Owner duyệt bản render cuối.
- Authoring và Release đều trỏ tới immutable revision đúng.

