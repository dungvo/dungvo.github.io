# ADR-0002 — Chọn phương thức theo bản chất nội dung

- **Trạng thái:** Accepted
- **Ngày chốt:** 2026-10-08
- **Phạm vi:** Selflo public content và authoring review
- **Loại thay đổi:** Content-compatible; không đổi Story Reader wire contract
- **Nguồn quyết định:** Thảo luận biên tập bài “Nếu tôi sai, nhưng ChatGPT lại đồng ý với tôi thì sao?”
- **Supersedes:** Không. Bổ sung ADR-0001 và Storytelling Guide.

## Bối cảnh

Nếu mọi bài đều dùng cùng cấu trúc “một ngày nọ → biến cố → nhận ra → bài học”, trải nghiệm thật dễ thành câu chuyện có cảm giác dàn dựng. Người đọc cũng sớm nhận ra công thức và phần kết. Bài ChatGPT bắt đầu từ một câu hỏi thật; ép nó thành narrative làm mất chính dấu vết tò mò của tác giả.

## Quyết định

Selflo chọn phương thức theo bản chất chủ đề, không coi kể chuyện là mặc định duy nhất:

1. **Khám phá:** bắt đầu từ một câu hỏi thật, xem xét khái niệm, bằng chứng, ngoại lệ và tìm câu trả lời vừa đủ.
2. **Quan sát:** bắt đầu từ một hành vi hoặc chi tiết đời thường, giúp người đọc nhận ra điều vẫn diễn ra nhưng ít được gọi tên.
3. **Trải nghiệm:** kể một việc có thật, giữ chi tiết, diễn biến và cảm xúc của điều đã xảy ra; không thêm biến cố chỉ để đủ “arc”.
4. **Góc nhìn:** đưa ra một nhận định hoặc cách nhìn, rồi xem các trường hợp đúng, sai, giới hạn và ngoại lệ.

Đây là taxonomy biên tập, không phải bốn `reader_format` mới. Trong wire hiện tại, cả bốn có thể tiếp tục dùng Story/Editorial V3; phương thức được ghi trong review/decision cho tới khi có nhu cầu sản phẩm đủ rõ để chuẩn hóa metadata.

## Nguyên tắc đi cùng

- Không phải bài nào cũng cần kể chuyện.
- Không phải bài nào cũng phải kết bằng bài học sâu sắc hoặc lời khuyên cách sống.
- Câu hỏi thật, sự quan sát thật và giới hạn của điều mình biết có giá trị hơn một mở bài nghe kịch tính.
- Knowledge/analysis có thể đi sâu, nhưng public copy chỉ mang sang phần cần để người đọc hiểu.
- Không tự ý viết lại nội dung owner đã chốt để ép nó khớp taxonomy.

## Áp dụng cho bài ChatGPT

Phương thức: **Khám phá**.

Giữ nguyên câu hỏi gốc của tác giả làm trục. Chuyển động của bài là: hành vi AI → sycophancy → thiên kiến xác nhận → cách hỏi để tìm phản biện → tự quan sát cách mình phản ứng khi bị phản đối. Không thêm một câu chuyện mở đầu hoặc một tình huống “một ngày nọ”.

Bài chính đã đủ để xuất bản. Ba giá trị cần giữ cân bằng là:

- **Khám phá:** ChatGPT phản ứng thế nào khi người dùng khăng khăng bảo vệ một thông tin sai?
- **Kiến thức:** sycophancy và confirmation bias là gì, nhưng không đánh đồng hai hiện tượng.
- **Ứng dụng:** thay đổi cách hỏi để AI giúp xem xét vấn đề từ nhiều phía, không coi phản hồi của AI là bảo chứng cho sự thật.

Các câu hỏi sâu hơn — vì sao bị phản đối gây khó chịu, vì sao ta dễ nhận thông tin thuận với niềm tin, cách phân biệt phản biện một ý tưởng với phủ nhận giá trị con người, và giới hạn của người phản đối — thuộc **Deep Dive tùy chọn**, không tự động chèn vào bài đã chốt.

## Ranh giới giữa bài chính và Deep Dive

Deep Dive không phải phần “giải thích đáp án” bắt buộc sau mỗi bài. Nó chỉ xuất hiện khi có thêm giá trị rõ ràng từ nghiên cứu, cơ chế, ví dụ, phản biện hoặc giới hạn của claim.

Một nguyên tắc dùng khi biên tập:

> Kể để cảm, giải thích để hiểu, đặt câu hỏi để tự nhìn lại.

Tùy phương thức, vế “kể” có thể là nêu một câu hỏi, quan sát hoặc trải nghiệm thật; không bắt buộc là narrative.

## Hệ quả

Authoring review phải hỏi “phương thức nào hợp với chất liệu này?” trước khi chọn cấu trúc. Sự đa dạng đến từ cách nhìn đúng với nguồn nội dung, không phải thay vài câu mở bài trên cùng một công thức.
