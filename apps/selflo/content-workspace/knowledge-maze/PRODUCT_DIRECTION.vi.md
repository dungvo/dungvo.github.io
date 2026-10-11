# Mê cung kiến thức — Định hướng sản phẩm và trải nghiệm

**Trạng thái:** Working direction  
**Ngày bắt đầu:** 2026-10-11

## 1. Vấn đề

Khi đọc một bài giải thích, người dùng thường gặp một khái niệm mới ngay bên trong khái niệm đang tìm hiểu. Họ có ba lựa chọn không tốt:

- bỏ qua và tiếp tục dù nền tảng đang thiếu;
- rời bài để tìm kiếm, rồi khó quay lại đúng mạch;
- đọc một giải thích quá dài chứa nhiều thứ họ chưa cần.

Trong hội thoại với AI, người dùng có thể hỏi tiếp ngay tại chỗ. Mê cung kiến thức muốn mang khả năng đó vào Selflo bằng content đã biên tập: người dùng không cần biết prompt, chỉ cần chọn điều mình chưa hiểu hoặc muốn khám phá thêm.

## 2. Lời hứa trải nghiệm

> Bắt đầu từ một câu hỏi. Đi sâu theo phần bạn chưa hiểu. Luôn biết mình đang ở đâu và có thể quay về mạch ban đầu.

Feature không hứa giải thích “toàn bộ” một chủ đề theo nghĩa tuyệt đối. Nó hứa cung cấp một đường vào rõ ràng, những nhánh có chủ đích và giới hạn kiến thức minh bạch.

## 3. Vòng trải nghiệm chính

1. Người dùng chọn một câu hỏi gốc.
2. Đọc câu trả lời nền đủ để nắm ý chính.
3. Gặp một khái niệm, giả định hoặc câu hỏi mới.
4. Mở giải thích nhanh ngay trong mạch đọc.
5. Nếu cần, mở node đầy đủ để đi sâu.
6. Từ node mới, có thể mở tiếp một nhánh khác.
7. Quay lại đúng node và đúng đoạn đã rời đi.
8. Giữ lại bản đồ đường đã khám phá để xem lại.

## 4. Ba lớp nội dung

### Lớp 1 — Bài gốc

Trả lời câu hỏi trung tâm bằng ngôn ngữ dễ hiểu. Người không mở nhánh vẫn phải nắm được ý chính.

### Lớp 2 — Giải thích nhanh

Một đoạn 40–100 từ giải nghĩa đủ để người dùng tiếp tục đọc. Có hai hành động chính: “Quay lại đọc” và “Tìm hiểu sâu hơn”.

### Lớp 3 — Node đầy đủ

Một đơn vị kiến thức độc lập gồm câu trả lời, ví dụ, giới hạn, nguồn và các hướng khám phá tiếp theo.

Không phải khái niệm nào cũng cần lớp 3. Nhiều từ chỉ cần giải thích nhanh.

## 5. Cơ chế điều hướng tối thiểu

- Breadcrumb: `Bài gốc → Node A → Node B`.
- `Quay lại`: trở về đúng vị trí đã rời đi.
- `Về bài gốc`: trở về bài gốc và giữ lịch sử nhánh.
- `Lưu để đọc sau`: không bắt buộc đi hết nhánh ngay.
- `Đường đã khám phá`: cây nhỏ của phiên đọc, không phải phần trăm hoàn thành.

Khi người dùng đã đi sâu từ ba lớp trở lên, app có thể nhắc nhẹ rằng họ đang rời xa câu hỏi ban đầu. Không chặn tiếp tục.

## 6. Các loại node

- `root_question`: câu hỏi gốc của một hành trình.
- `concept`: giải thích một khái niệm.
- `mechanism`: giải thích vì sao hoặc bằng cách nào.
- `example`: case cụ thể giúp hình dung.
- `evidence`: nguồn và mức độ bằng chứng.
- `counterpoint`: giới hạn, phản ví dụ hoặc cách diễn giải khác.
- `practice`: thử tự giải thích hoặc áp dụng.
- `synthesis`: nối các mảnh lại; tùy chọn, không phải cửa thắng game.

## 7. Các loại liên kết

Mỗi link phải có nhãn cho biết mục đích:

- `defines`: thuật ngữ này nghĩa là gì?
- `explains_why`: vì sao điều này xảy ra?
- `shows_example`: ví dụ cụ thể là gì?
- `supports_with_evidence`: ta biết điều này dựa vào đâu?
- `challenges`: có giới hạn hoặc trường hợp ngược lại không?
- `connects_to`: nó liên hệ với khái niệm nào?
- `applies_to`: dùng điều này trong tình huống nào?
- `checks_understanding`: thử xem đã có thể giải thích/áp dụng chưa?

Không dùng một link chung chung như “Xem thêm” khi có thể nói rõ giá trị của nhánh.

## 8. Ranh giới với game mê cung

Mê cung kiến thức tổ chức **việc đọc và mở rộng hiểu biết**. Game tình huống tổ chức **quan sát, lựa chọn và hậu quả trong một thế giới kể chuyện**.

Hai loại có thể dùng chung node/link, breadcrumb và lịch sử khám phá. Nhưng chúng không dùng chung giả định:

- Knowledge Maze không cần kết thúc hoặc thắng/thua.
- Scenario Game phải giữ trạng thái thế giới và tính nhất quán của câu chuyện.
- Knowledge Maze có thể dẫn tới một game để thực hành.
- Game có thể mở một knowledge node để giải thích, rồi quay lại tình huống.

## 9. Rủi ro sản phẩm

### Mất mạch đọc

Giảm bằng giải thích nhanh, breadcrumb, quay lại đúng vị trí và lưu nhánh để đọc sau.

### Mê cung trở thành cây link vô hạn

Chỉ author những đường có mục đích. Giới hạn 3–5 link chính mỗi node; link phụ có thể nằm cuối bài.

### Cảm giác hiểu vì đọc nhiều

Thêm practice tùy chọn: tự nói lại, tạo ví dụ mới hoặc chỉ ra điều còn chưa chắc. Không ép mọi người phải làm bài kiểm tra.

### Đơn giản hóa quá mức

Mỗi node có phần giới hạn và mức độ chắc chắn. Chủ đề có nhiều truyền thống/cách hiểu phải nói rõ đang dùng cách diễn giải nào.

### Biến Selflo thành bách khoa toàn thư

Chỉ phát triển các mê cung phục vụ câu hỏi Selflo muốn giúp người dùng khám phá. Không cố bao phủ mọi khái niệm trên internet.

## 10. Tiêu chí prototype thành công

- Người dùng hiểu được ý chính dù không mở nhánh.
- Khi gặp chỗ chưa hiểu, họ chọn được nhánh phù hợp mà không cần tự viết câu hỏi.
- Sau khi đi sâu, họ quay lại đúng mạch ban đầu và tiếp tục đọc được.
- Người dùng mô tả được vì sao họ mở một nhánh.
- Bản đồ giúp định hướng thay vì tạo áp lực hoàn thành.
- Content mở rộng làm rõ khoảng trống thật, không chỉ lặp lại bài gốc bằng nhiều chữ hơn.

