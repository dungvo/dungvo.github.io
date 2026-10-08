# ADR-0001 — Story đúng tâm trạng và một khoảng để gỡ

- **Trạng thái:** Accepted
- **Ngày ghi nhận:** 2026-10-07
- **Phạm vi:** Triết lý sản phẩm, content matching, Story, reflection và AI experience
- **Loại thay đổi:** Product/editorial direction; chưa tự động thay đổi app–content contract
- **Nguồn quyết định:** Ý định owner đã được nêu trong quá trình hình thành Selflo và được nhắc lại khi review triết lý content
- **Liên quan:** [`../SELFLO_PRODUCT_PHILOSOPHY.vi.md`](../SELFLO_PRODUCT_PHILOSOPHY.vi.md), [`../../perspective-library/editorial-decisions/ADR-0001-content-moc-va-artwork-ke-chuyen.vi.md`](../../perspective-library/editorial-decisions/ADR-0001-content-moc-va-artwork-ke-chuyen.vi.md)

## 1. Bối cảnh đã có

Triết lý sản phẩm đã xác định Selflo là một không gian suy ngẫm riêng tư, không phải cố vấn đời sống. Nội dung có vai trò giúp người dùng gọi tên trải nghiệm mơ hồ, mở thêm một góc nhìn và giữ quyền tự diễn giải, tự lựa chọn.

Selflo cũng đã chọn mô hình “lần gặp đúng lúc”:

```text
nhu cầu hiện tại
→ nhận diện hoàn cảnh
→ một góc nhìn phù hợp
→ story khi cần
→ khoảng dừng hoặc reflection
```

Phần chưa được ghi đủ là **kết quả trải nghiệm mong muốn** khi một story thật sự gặp đúng tâm trạng: người đọc có thể hiểu rõ hơn điều đang làm mình vướng và cảm thấy nhẹ hơn mà không bị ra lệnh phải làm gì.

## 2. Quyết định

Selflo hướng tới việc trở thành nơi mà, khi đang có một tâm trạng hay vướng bận khó gọi tên, người dùng biết rằng họ có thể tìm thấy một câu chuyện gần với điều mình đang sống.

Story phù hợp có thể giúp người đọc:

- nhận ra mình đang lo, sợ, áy náy, do dự hay sợ bị đánh giá;
- thấy rằng một cảm xúc không tự nó là lỗi của họ hoặc bằng chứng rằng họ đã làm sai;
- phân biệt sự việc đã xảy ra với điều mình đang dự đoán, suy diễn hoặc sợ người khác sẽ nghĩ;
- nhìn thấy nhu cầu, giá trị hoặc sự đánh đổi đang bị che bởi cảm xúc;
- cảm thấy được hiểu, có thêm khoảng thở và tự hình thành cách hiểu hoặc lựa chọn của mình.

Selflo không hứa rằng mọi story sẽ làm người đọc nhẹ nhõm, cũng không xem mọi vướng bận là suy diễn. Một số nỗi lo có căn cứ thật, một số tình huống có rào cản hay hệ quả thật. Vai trò của Selflo là giúp người dùng **nhìn rõ hơn**, không trấn an máy móc rằng “mọi chuyện chỉ do bạn nghĩ nhiều”.

## 3. Ví dụ: có nên đi một buổi tiệc?

Một người không thật sự muốn dự một buổi tiệc. Nếu đi, họ biết mình có thể không thoải mái. Nếu không đi, họ lại lo người này sẽ buồn, người kia sẽ nói hoặc mọi người sẽ đánh giá mình.

Selflo không kết luận thay họ rằng “hãy đi” hay “đừng đi”. Một story phù hợp có thể giúp họ nhìn ra:

- điều gì đã thật sự xảy ra và điều gì mới chỉ là dự đoán;
- họ đang không muốn tham gia hay chỉ đang sợ cảm giác không thoải mái;
- họ coi trọng sự hiện diện cho mối quan hệ đó đến đâu;
- có lựa chọn nào khác ngoài hai cực “đi và chịu đựng” hoặc “không đi và áy náy” hay không.

Giá trị không nằm ở việc Selflo chọn đúng thay người dùng. Giá trị nằm ở chỗ nút thắt trước đó bị dính thành một khối nay được tách ra: sự việc, nỗi sợ, suy diễn, nhu cầu, giá trị và các lựa chọn.

## 4. Ranh giới: không coaching, không chẩn đoán

Selflo có thể mang lại một hiệu ứng gần với việc được gỡ rối, nhưng không định vị là coach, therapist hay người ra quyết định.

Selflo không:

- tuyên bố hiểu chính xác nguyên nhân tâm lý của người dùng;
- phán quyết một lựa chọn là đúng hay sai khi không đủ bối cảnh;
- trấn an rằng nỗi lo chỉ là tưởng tượng;
- biến story thành một bài hướng dẫn che giấu;
- làm người dùng phụ thuộc vào Selflo để xác nhận mọi quyết định.

Selflo có thể:

- đưa một story có tension gần với hoàn cảnh;
- giúp gọi tên cảm xúc mà không biến nó thành lỗi;
- giúp tách fact, interpretation, fear và value;
- đƷt reflection prompt để người dùng tự trả lời;
- để người dùng kết thúc ở việc “giờ mình hiểu vì sao mình vướng” mà không bắt buộc phải hành động ngay.

## 5. Hệ quả cho content và product

### Content

- Story matching nên bắt đầu từ trạng thái/hoàn cảnh người đọc, không chỉ từ chủ đề triết học.
- Story nên cho thấy một tình huống đủ gần để người đọc nhận ra mình mà không tuyên bố rằng hai hoàn cảnh giống hệt nhau.
- Reflection nên giúp phân biệt sự việc, cách hiểu, nỗi sợ và điều người đọc coi trọng.
- Ending không bắt buộc có action step. Sự nhẹ hơn có thể đến từ việc hiểu rõ, không chỉ từ việc giải quyết xong.

### Product

- Reading intent và discovery nên ưu tiên ngôn ngữ người dùng có thể nhận ra trong đời sống: “tôi đang lo”, “tôi thấy áy náy”, “tôi sợ bị đánh giá”, thay vì buộc họ chọn thuật ngữ tâm lý.
- Trạng thái người dùng nêu không được xem là chẩn đoán hay identity cố định.
- Matching chỉ nên đề xuất một góc nhìn có thể bỏ qua hoặc bác bỏ, không tuyên bố “đây là vấn đề của bạn”.
- Trải nghiệm không nên đo thành công chỉ bằng việc người dùng đã làm theo lời khuyên hay hoàn thành một action step.

Những ý này là product direction. Nếu muốn thay đổi schema của reading intent, story metadata, matching payload hoặc app presentation, phải tạo proposal trong `shared/contracts/` và thực hiện app-first theo contract hub; không coi ADR này là wire contract.

## 6. Dấu hiệu review đúng hướng

Sau một story phù hợp, kết quả tốt có thể là:

- “À, hóa ra mình đang sợ điều này.”
- “Cảm giác này không có nghĩa mình là người xấu.”
- “Mình đang phản ứng với điều có thể xảy ra, không phải điều đã xảy ra.”
- “Mình chưa cần quyết định ngay; trước hết mình đã hiểu nút thắt hơn.”
- “Mình vẫn tự chọn, nhưng giờ sự lựa chọn đó bớt nặng hơn.”

Không dùng các câu này như public-copy template. Chúng là dấu hiệu nội bộ để review chất lượng trải nghiệm.

## 7. Cách thay đổi trong tương lai

Không viết lại record này để che mất quá trình thay đổi. Nếu user research cho thấy hướng này không đủ hoặc có rủi ro, tạo ADR mới và ghi rõ phần được giữ, sửa hay thay thế.
