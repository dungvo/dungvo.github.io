# Selflo — Ý tưởng game “Mê cung hiểu biết”

**Tên làm việc:** Tin nhắn chưa có lời đáp  
**Trạng thái:** Product/game concept; chưa triển khai  
**Mục tiêu:** Tạo một trải nghiệm đời thường trong đó lựa chọn mở ra bằng chứng, thay đổi điều người chơi biết và giúp họ luyện phân biệt dữ kiện, diễn giải, nhu cầu và điều chưa biết.

## 1. Lời hứa trải nghiệm

Người chơi không vào game để tìm “đáp án tâm lý đúng”. Họ đi qua một căn nhà có nhiều cửa, thu thập các mảnh thông tin và quyết định cách hành động khi sự thật vẫn có thể chưa đầy đủ.

Game cần tò mò, có hình ảnh và dễ hiểu với người ngoài công nghệ. Nội dung sâu nằm trong cấu trúc lựa chọn, không nằm ở một bài giảng dài cuối lượt.

## 2. Cảnh mở đầu

Một chiếc điện thoại nằm trên bàn trong căn nhà yên tĩnh. Tin nhắn gửi cho một người thân hiện “đã xem” từ hôm qua:

> Cuối tuần này gặp nhau một chút nhé?

Chưa có lời đáp. Trên bàn là bốn vật dẫn tới bốn cánh cửa: ảnh cũ, lịch, gương và đồng hồ. Người chơi chọn điều muốn tìm hiểu trước.

## 3. Trạng thái cốt lõi

Game nên giữ bốn vùng trạng thái nhìn thấy được:

- **Sự việc:** điều đã quan sát hoặc được xác nhận.
- **Khả năng:** các cách giải thích đang được cân nhắc.
- **Nhu cầu:** điều người chơi cần để quyết định bước tiếp.
- **Chưa biết:** câu hỏi còn mở.

Ngoài ra engine tương lai có thể giữ:

- `evidence_seen`: các bằng chứng đã mở;
- `hypotheses_active`: giả thuyết đang giữ, không phải sự thật;
- `needs_selected`: nhu cầu người chơi tự chọn;
- `actions_taken`: hành động đã làm;
- `reply_state`: trạng thái phản hồi của nhân vật;
- `support_level`: mức gợi ý đã dùng.

Không lưu nhãn tính cách người chơi từ lựa chọn.

## 4. Bốn nhánh khám phá

### A — Cánh cửa quan hệ

**Câu hỏi:** Họ có đang tránh mình không?

Các phòng khả dĩ:

1. Xem nhịp trả lời trước đây: thường nhanh, nhưng không phải lúc nào cũng vậy.
2. Nhớ lại lần gặp gần nhất: có một đoạn nói chuyện không thoải mái.
3. Chọn cách kiểm tra: đọc lại lời mình nói, hỏi trực tiếp hoặc giữ đây là giả thuyết.
4. Nếu hỏi về cuộc nói chuyện, nhận một phản hồi có thể xác nhận bất đồng nhưng không xác nhận “họ ghét mình”.

**Khám phá:** Dấu hiệu nghi ngờ không đủ phân biệt né tránh, bận hoặc chưa biết trả lời thế nào.

### B — Cánh cửa hoàn cảnh

**Câu hỏi:** Họ có đang gặp chuyện gì không?

Các phòng khả dĩ:

1. Biết họ đang đưa người nhà đi khám.
2. Thấy họ vẫn đăng một tấm ảnh lên mạng.
3. Chọn diễn giải: “có thời gian đăng ảnh thì có thời gian trả lời” hoặc xem thời điểm/nguồn của ảnh.
4. Phát hiện ảnh có thể đã được chuẩn bị trước; vẫn chưa biết mức sẵn sàng cho cuộc trò chuyện.

**Khám phá:** Một hoạt động online không chứng minh người đó sẵn sàng cho mọi tương tác.

### C — Cánh cửa diễn giải

**Câu hỏi:** Vì sao mình nghĩ tới khả năng bị tránh?

Người chơi có thể chọn: từng gặp chuyện tương tự, chưa từng, không nhớ hoặc không muốn trả lời.

- Nếu từng gặp: xem ký ức như nguồn tạo giả thuyết, không phải bằng chứng của hiện tại.
- Nếu chưa từng: khám phá kỳ vọng của mình về thời gian trả lời.
- Nếu không nhớ/không muốn trả lời: vẫn tiếp tục game bình thường; không ép “đào sâu”.

**Khám phá:** Ký ức và kỳ vọng ảnh hưởng cách đọc tình huống nhưng không quyết định sự thật của tình huống.

### D — Cánh cửa hành động

**Câu hỏi:** Mình có thể làm gì khi chưa biết lý do?

Các lựa chọn thực sự khác nhau:

- chờ nhưng đặt một mốc xem lại;
- hỏi thăm ngắn gọn;
- nói rõ cần xác nhận trước một thời điểm;
- chọn kế hoạch khác và để cuộc trò chuyện mở;
- hỏi thẳng về bất đồng nếu đã có bằng chứng liên quan.

**Khám phá:** Có thể đáp ứng nhu cầu thực tế mà không cần đoán chắc ý định người kia.

## 5. Câu hỏi chung nhưng phụ thuộc trạng thái

Ở một số phòng, game hỏi: “Bạn muốn kiểm tra điều gì tiếp?”. Các đáp án phải dựa vào thông tin đã mở:

- đã biết có bất đồng → tìm hiểu cách người kia hiểu cuộc nói chuyện;
- đã biết họ chăm người nhà → hỏi khi nào tiện trả lời;
- đã nhận ra ký ức cũ đang ảnh hưởng → tìm bằng chứng riêng của lần này;
- đã nhận “để mình xem lịch” → làm rõ hạn xác nhận;
- chưa có gì ngoài trạng thái đã xem → giữ nhiều khả năng hoặc thực hiện hành động ít xâm lấn.

Không hiện lựa chọn giả vờ “thông minh” nếu người chơi chưa mở bằng chứng cần thiết.

## 6. Cửa cuối: ghép cách hiểu

Người chơi đặt các thẻ đã thu thập vào bốn vùng. Ví dụ:

- `Tin đã được xem.` → Sự việc
- `Họ ghét tôi.` → Khả năng, không phải sự việc
- `Tôi lo mình đang bị tránh.` → Trải nghiệm/diễn giải của người chơi
- `Tôi cần xác nhận trước tối nay.` → Nhu cầu
- `Họ đang chăm người nhà.` → Sự việc nếu đã được xác nhận
- `Lý do họ im lặng.` → Chưa biết

Chỉ hiện thẻ từ đường đã đi. Nếu người chơi đặt “Họ ghét tôi” vào sự việc, mở một phòng phụ:

1. Bạn đã thấy bằng chứng nào?
2. Bằng chứng đó còn phù hợp với khả năng nào khác?
3. Bạn muốn chuyển thành giả thuyết, tìm thêm thông tin hay vẫn giữ nhưng đánh dấu chưa chắc?

Không trừ điểm.

## 7. Bốn kết thúc không xếp hạng

1. **Hiểu thêm hoàn cảnh:** biết họ đang có việc gia đình và chọn thời điểm phù hợp hơn.
2. **Làm rõ bất đồng:** xác nhận có một điều chưa ổn trong lần gặp trước và mở cuộc nói chuyện.
3. **Sắp xếp được kế hoạch:** vẫn chưa biết nguyên nhân, nhưng đã có hạn xác nhận và phương án khác.
4. **Giữ nhiều khả năng:** nhận ra mình kết luận sớm và chọn một hành động ít giả định hơn.

Mỗi kết thúc cho xem: điều đã biết, điều vẫn chưa biết, lựa chọn đã giúp điều gì và một khả năng khác đáng thử. Không có “kết thúc tốt nhất” cho mọi trạng thái.

## 8. Kiểm tra chuyển giao

Sau kết thúc, đưa một tình huống ngắn khác, chẳng hạn đồng nghiệp chưa phản hồi bản review nhưng vẫn tham gia một cuộc họp. Yêu cầu người chơi:

- chọn đâu là dữ kiện;
- nêu hai khả năng;
- chọn thông tin hoặc hành động tiếp theo;
- nói điều gì vẫn chưa biết.

Không dùng lại đúng câu chữ/phông cảnh của game chính. Mục tiêu là xem người chơi có tự thực hiện thao tác phân biệt hay không.

## 9. Quy mô prototype đề xuất

- một câu chuyện nhất quán;
- bốn nhánh chính;
- mỗi lượt đi qua 5–7 phòng;
- bốn kết thúc;
- một bài chuyển giao;
- có thể quay lại thử đường khác mà không xóa đường cũ.

Prototype đầu có thể là sơ đồ click-through với artwork tĩnh. Chưa cần hệ thống AI, scoring hoặc hồ sơ tâm lý.

## 10. Quy tắc biên tập và an toàn

- Không nói một lựa chọn chứng minh người chơi có tổn thương, attachment style hay đặc điểm tính cách nào.
- Không ép liên hệ trải nghiệm thật.
- Luôn có lựa chọn “tôi chưa cảm thấy gì” hoặc “không muốn trả lời” ở câu hỏi nội tâm.
- Không biến một nhân vật thành công cụ để dạy đạo lý.
- Không để kết quả thật của câu chuyện thay đổi theo lựa chọn nếu game không công bố đó là các kịch bản khác nhau.
- Khi dữ kiện sai, sửa dữ kiện; khi kết luận thiếu bằng chứng, chỉ ra khoảng cách lập luận.

## 11. Những phần còn phải thiết kế trước khi code

- đồ thị đầy đủ của phòng, điều kiện, bằng chứng, hành động và kết thúc;
- “sự thật nền” duy nhất của nhân vật trong phiên chơi;
- copy từng phòng với giới hạn đọc;
- storyboard/art direction;
- quy tắc quay lại và lưu dấu đường đã đi;
- rubric cho bài chuyển giao;
- user test để phát hiện nhánh giả, gợi ý quá sớm hoặc cảm giác bị dạy đời.

