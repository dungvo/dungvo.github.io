# ADR-0002 — Tạm dừng Rhythm Knowledge theo tín hiệu Check-in và chuyển sang content-first

**Trạng thái:** Accepted  
**Ngày:** 2026-10-12  
**Phạm vi:** Selflo app + content  
**Liên quan:** `selflo.rhythm-knowledge.v1`, Rhythm Reading, Check-in, Góc nhìn, Knowledge

## Bối cảnh

Rhythm Knowledge ban đầu được đề xuất như một lớp giải thích đi sau Bản đọc Nhịp:

```text
Check-in có cấu trúc
→ Rhythm pattern
→ Bản đọc + evidence
→ Knowledge phù hợp
```

Check-in hiện chỉ cung cấp dữ liệu có cấu trúc ở mức rộng: thời điểm, chủ đề, cảm xúc và trạng thái đầu óc khi có. Check-in không cho biết sự việc cụ thể, suy nghĩ, dự đoán, hành vi, quan hệ, môi trường hoặc nguyên nhân thực tế mà người dùng đã xác nhận.

Vì vậy cùng một cặp như `Học tập + Lo lắng` có thể liên quan tới nhiều vấn đề rất khác nhau: chưa hiểu bài, sợ hỏi, áp lực kết quả, quan hệ với người dạy, thiếu thời gian, sức khỏe hoặc một lý do chưa được dữ liệu mô tả. Chọn một bài phân tích hành vi cụ thể từ cặp dữ liệu này sẽ khiến Selflo suy phần trải nghiệm mà người dùng chưa cung cấp.

Kho Knowledge hiện mới gồm catalog khái niệm/lý thuyết, một số bài Knowledge/Insight và các bản phân tích biên tập. Chưa có một thư viện bài đủ rộng, đủ sâu và đã qua review để dùng làm đích đến cho toàn bộ Rhythm patterns. Thiết kế thêm câu hỏi Check-in để phục vụ một taxonomy Knowledge chưa đủ chín có nguy cơ khóa input theo một mô hình nội dung chưa được kiểm chứng.

## Quyết định

Tạm dừng việc phát triển `Rhythm pattern → Knowledge article` như một capability production.

Trong giai đoạn này:

1. App không thêm Knowledge card, route, resolver hoặc mapping mới từ Rhythm.
2. App tiếp tục phần đang có: Check-in cơ bản, Rhythm facts/signals, Bản đọc, evidence và Góc nhìn/Story khi phù hợp.
3. Knowledge chưa sẵn sàng tiếp tục bị ẩn; không hiển thị nút vô hiệu, nội dung sắp ra mắt hoặc fallback chọn bài chung chung.
4. Content tập trung vào Góc nhìn và Story. Khi biên tập phát sinh nghiên cứu/phân tích đáng giữ về suy nghĩ, cảm xúc hoặc hành vi con người, phần đó được lưu thành Knowledge candidate riêng.
5. Knowledge candidate được phát triển content-first: bắt đầu từ một câu hỏi con người cụ thể, có research, claim–source–limit và editorial review; không bắt đầu từ việc cố phủ các fixture của engine.
6. Không sửa Check-in chỉ để match Knowledge cho tới khi đã có inventory content đủ rõ và product research riêng.

## Phần tiếp tục làm

### Content

- Tiếp tục tạo và biên tập Góc nhìn/Story.
- Lưu research, phân tích hành vi và cơ chế có giá trị tái sử dụng.
- Duy trì inventory Knowledge candidate theo câu hỏi người đọc, bằng chứng, phạm vi và lifecycle.
- Phân biệt Story/Góc nhìn dùng để trải nghiệm với Knowledge dùng để giải thích.
- Chỉ đưa Knowledge candidate vào Authoring khi bài tự đứng được và đạt source/editorial gate; chưa tạo Rhythm mapping.

### App

- Giữ Check-in hiện tại ở phạm vi input đã duyệt.
- Giữ observed facts/signals và epistemic boundary của Rhythm.
- Tiếp tục fail closed khi không có destination phù hợp.
- Không suy tình huống, suy nghĩ hoặc hành vi cá nhân từ topic + emotion.

## Phần tạm dừng

- K2 pilot theo hướng map trực tiếp từ `Work + Anxiety`.
- Coverage plan `33 scenarios → K1…K9 → article` như một release requirement.
- Shared wire contract cho Rhythm Knowledge.
- Mapping schema, resolver, card và contextual Knowledge route.
- Thay đổi Check-in để thu thêm tình huống/suy nghĩ/hành vi.
- Materialize hoặc Release các draft được tạo chỉ để phủ engine.

Các brief và workspace hiện có được giữ làm lịch sử nghiên cứu, không phải backlog đã cam kết và không có quyền publish.

## Điều kiện mở lại feature

1. Có inventory Knowledge thực tế, gồm những bài đã được review hoặc candidate đủ chín.
2. Biết mỗi bài giải thích câu hỏi nào và cần dữ liệu đầu vào nào để chọn đúng.
3. Có coverage/gap review dựa trên content hiện có, không dựa trước vào giả định phải phủ mọi engine fixture.
4. Có product research về việc người dùng có muốn cung cấp thêm tình huống, suy nghĩ hoặc hành vi hay không.
5. Có quyết định privacy/persistence cho input mới nếu đề xuất thu thêm dữ liệu.
6. Có cách để người dùng xác nhận, sửa hoặc bác bỏ điều hệ thống dùng để chọn Knowledge.
7. App và content cùng chấp nhận contract, trạng thái không hỗ trợ và hành vi fail-closed trước implementation.

Khi mở lại, thứ tự đúng là:

```text
Knowledge inventory đã được review
→ content-to-input requirements
→ nghiên cứu trải nghiệm Check-in/làm rõ tình huống
→ owner quyết định product behavior + privacy
→ shared contract
→ app conformance
→ Authoring/Release mapping
```

## Hệ quả

### Lợi ích

- Tránh cá nhân hóa giả từ dữ liệu quá rộng.
- Không viết hàng loạt bài chung chỉ để đạt coverage kỹ thuật.
- Cho phép Knowledge hình thành tự nhiên từ công việc nội dung có chiều sâu.
- Khi thiết kế lại Check-in, taxonomy đầu vào sẽ dựa trên content thực tế thay vì giả định.

### Đánh đổi

- Rhythm Reading chưa có Knowledge destination trong giai đoạn này.
- Không thể tuyên bố feature cung cấp phân tích nguyên nhân hoặc cơ chế cá nhân.
- Việc mở lại cần một vòng product research và contract mới thay vì tiếp tục proposal cũ.

## Đường lui

Quyết định này không xóa proposal hay research cũ. Nếu sau này có content inventory và input strategy đủ rõ, proposal có thể được thay thế bằng một phiên bản mới. Không tiếp tục âm thầm từ K2 brief hiện tại; việc mở lại phải dẫn tới decision này và ghi rõ điều kiện nào đã được đáp ứng.

