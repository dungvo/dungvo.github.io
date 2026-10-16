# Selflo — bàn giao phiên thảo luận ngày 09/10/2026

## Trạng thái và yêu cầu cho Work Mode local

Đây là bản tổng hợp từ phần hội thoại được cung cấp, không phải bản chép nguyên văn toàn bộ phiên. Chưa sửa code, chưa tạo Git branch trên Mac, chưa kiểm chứng nghiên cứu trong phiên này.

Người dùng muốn tách công việc sang một nhánh riêng, lưu ý tưởng và kiến thức vào folder Selflo để phát triển sau. Khi mở repo local: đọc AGENTS.md và cấu trúc hiện có, kiểm tra git status, tạo nhánh `ideas/selflo-learning-maze-20261009` (nếu tên đã tồn tại thì dùng lại khi phù hợp hoặc đặt tên mới), giữ nguyên thay đổi đang có. Ưu tiên lưu tài liệu, chưa triển khai game hay sửa ứng dụng.

Có thể tách tài liệu này thành bốn file trong thư mục docs phù hợp của repo: AI và việc học; thiết kế game; backlog content; thiết kế học English. Không tự giả định đường dẫn repo Selflo. Repo English đã được người dùng nêu ở phiên liên quan: `/Users/dungvo/xcode/dungvo.github.io/apps/english`; chưa truy cập hay chỉnh sửa trong phiên này.

## 1. AI và việc học: những vấn đề cần giữ

Ba vấn đề khác nhau: cảm giác hiểu nhưng không tự giải thích/áp dụng được; thiếu nền tảng khiến người mới không biết bắt đầu; áp lực năng suất khiến người làm được việc bằng AI nhưng bỏ qua cơ hội phát triển năng lực. Không gộp thành kết luận “AI làm con người lười suy nghĩ”.

Ý kiến quan trọng của người dùng: chỉ nhìn sản phẩm cuối không cho biết quá trình thử sai hay điều kiện dẫn tới lựa chọn. Ví dụ bóng đèn Edison là liên tưởng của người dùng; số khoảng 2.000 lần thử chưa được kiểm chứng, không dùng làm dữ kiện lịch sử. Trong kiến trúc dữ liệu, một thiết kế có thể không phù hợp hôm nay nhưng đã hợp lý trong điều kiện trước đây. Không có lịch sử thì không thể tự chọn các thất bại đại diện hoặc dựng lại suy nghĩ của người thiết kế như sự thật.

Phân biệt: đánh giá thiết kế theo yêu cầu hiện tại; tìm bằng chứng về bối cảnh cũ; giữ giả thuyết khi thiếu bằng chứng. Không cần lặp lại toàn bộ thử nghiệm, nhưng cần biết mình đang biết gì và đang đoán gì.

Câu hỏi còn mở: vì sao theo được lời giải không đồng nghĩa tự tạo được lời giải? Một người đã hiểu có thể truyền đến đâu? AI có thể giúp người học phát triển suy luận thế nào? Không mô tả AI là có trải nghiệm chủ quan hoặc có thể “copy sự hiểu” vào người dùng.

Hướng hỗ trợ đã đề xuất: tự giải thích; phân biệt dữ kiện và suy đoán; tạo nhiều giả thuyết; dự đoán hệ quả; chọn thông tin phân biệt giả thuyết; sửa kết luận khi có bằng chứng mới. Giảm dần gợi ý, kiểm tra bằng hành động thay vì chỉ nhận câu “tôi hiểu rồi”. Đây là hướng thiết kế, chưa chứng minh hiệu quả của sản phẩm.

Nguồn từng được nhắc trong hội thoại, cần đọc và xác minh trước khi đưa vào content chính thức:
- Rozenblit và Keil: ảo tưởng về mức độ hiểu cơ chế, https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/
- Karpicke và Blunt: tự truy hồi kiến thức và học khái niệm, https://pubmed.ncbi.nlm.nih.gov/21252317/

## 2. Cảm xúc và giới hạn mô phỏng

Người dùng chỉ ra tình huống giả định không nhất thiết gợi cảm xúc: ví dụ lựa chọn bán chứng khoán trong game không mang rủi ro mất tiền thật, nên biết kết quả không đồng nghĩa rút được kinh nghiệm như ngoài đời. Đôi khi cả trải nghiệm thật cũng không tạo được nhận định chính xác.

Không ép người chơi cảm nhận cảm xúc dự định sẵn. Cho phép nhập vai, quan sát nhân vật, liên hệ chuyện thật (có thể bỏ qua), và “tôi chưa cảm thấy gì”. Không suy diễn tổn thương hoặc tính cách từ lựa chọn. Khả năng phân tích trong game và khả năng xử lý khi có rủi ro thật cần được đánh giá riêng.

## 3. Tầm nhìn mini-game Selflo

Yêu cầu của người dùng:
- Game đời thường, người ngoài công nghệ/công ty vẫn hiểu; có hình ảnh, tò mò, thú vị, không dạy đời.
- Trước mắt chỉ một game nhưng content phải đủ sâu. Nhiều lựa chọn thực sự dẫn tới kiến thức, đường đi và kết quả khác nhau.
- Lựa chọn trước thay đổi bối cảnh của lựa chọn sau, có thể phụ thuộc nhiều bước trước. Cùng một câu hỏi nhưng lựa chọn phù hợp khác nhau theo thông tin đã biết.
- Mê cung kiến thức: mỗi đường giúp khám phá điều gì đó; tới cửa cuối ghép hiểu biết để mở khóa, có thể chọn nhiều mảnh.
- Không xếp hạng con người, không điểm cao thấp. Những góc nhìn có thể khác nhau; vẫn phản hồi khi dữ kiện sai hoặc kết luận thiếu bằng chứng.
- Gắn với nhận thức, quan sát bản thân và kiến thức Selflo. Nếu được đón nhận có thể phát triển thành game riêng; đây là khả năng dài hạn, chưa phải phạm vi hiện tại.

Điểm thiết kế cốt lõi: lựa chọn mở thông tin và thay đổi điều người chơi biết. Không đổi “đáp án” bằng luật ngầm. Luôn cho xem bằng chứng đã thu thập, giả thuyết đang giữ và nhu cầu hiện tại.

## 4. Game mẫu được đề xuất: Tin nhắn chưa có lời đáp

Đây là đề xuất của trợ lý để phát triển tiếp, chưa phải đặc tả được người dùng chốt toàn bộ.

Cảnh mở đầu: căn nhà nhiều cửa, điện thoại trên bàn. Bạn nhắn người thân “Cuối tuần này gặp nhau một chút nhé?”. Tin đã xem từ hôm qua nhưng chưa trả lời. Mục tiêu: tìm hiểu tình huống trước khi quyết định bước tiếp.

### Bốn hướng khám phá

| Nhánh | Điều muốn tìm hiểu | Thông tin/hoạt động riêng | Khám phá |
|---|---|---|---|
| A — Quan hệ | Họ có đang tránh mình? | Thường trả lời nhanh; lần gặp gần nhất không thoải mái; xem lịch sử hoặc hỏi trực tiếp | Dấu hiệu nghi ngờ chưa đủ phân biệt tránh mình với bận |
| B — Hoàn cảnh | Họ có đang gặp chuyện? | Đưa người nhà đi khám nhưng vẫn đăng ảnh; kiểm tra ảnh cũ hoặc hỏi thăm | Hoạt động trên mạng không chứng minh sẵn sàng cho mọi cuộc trò chuyện |
| C — Diễn giải | Vì sao mình nghĩ tới bị tránh? | Từng gặp/chưa từng/không nhớ/không muốn trả lời; so sánh chuyện cũ với dữ kiện lần này | Ký ức mở ra khả năng, không xác nhận hiện tại |
| D — Hành động | Làm gì khi chưa biết lý do? | Chờ có hạn, hỏi thăm, nêu hạn xác nhận, chọn kế hoạch khác | Có thể đáp ứng nhu cầu mà chưa chắc ý định người kia |

Ở nhánh C, nếu chưa từng có trải nghiệm tương tự, tìm hiểu kỳ vọng về thời gian trả lời; không cố gán tổn thương. Ở nhánh D, có đường nhận thêm thông tin và có đường vẫn chưa biết nguyên nhân nhưng sắp xếp được kế hoạch.

Câu hỏi chung “Bạn muốn kiểm tra điều gì tiếp?” phải dựa vào trạng thái: biết có bất đồng thì tìm hiểu cách người kia hiểu cuộc nói chuyện; biết đang chăm người nhà thì hỏi lúc tiện trả lời; nhận ra liên hệ ký ức cũ thì tìm bằng chứng riêng; nhận “để mình xem lịch” thì làm rõ hạn xác nhận.

### Cửa cuối

Ghép mảnh thông tin thành cách hiểu; phân biệt sự việc, suy nghĩ/cảm xúc, nhu cầu và điều chưa biết. Các thẻ có thể gồm: tin đã xem; họ ghét tôi; tôi lo bị tránh; tôi cần xác nhận trước tối nay; họ đang chăm người nhà; chưa biết lý do im lặng. Chỉ hiện dữ kiện mà đường đi thực sự đã mở.

Nếu coi “họ ghét tôi” là dữ kiện, mở phòng phụ hỏi bằng chứng; cho xem lại, chuyển thành giả thuyết hoặc tìm thêm thông tin. Không trừ điểm, không xác nhận kết luận vô căn cứ.

Bốn kết thúc đề xuất: hiểu thêm hoàn cảnh; làm rõ bất đồng thật; sắp xếp kế hoạch dù nguyên nhân chưa rõ; nhận ra kết luận sớm và giữ nhiều khả năng. Không gắn kết thúc với người tốt/xấu.

Quy mô đề xuất: bốn nhánh chính, 5–7 phòng mỗi lượt, bốn kết thúc, quay lại thử lựa chọn khác. Cần tiếp tục thiết kế đồ thị đầy đủ và kiểm tra tính nhất quán. Một thế giới câu chuyện cần nhất quán: không biến sự thật về nhân vật thành thứ thay đổi tùy lựa chọn chỉ để tạo bất ngờ, trừ khi công bố rõ các kịch bản riêng.

### Các việc thiết kế còn thiếu

- Bản đồ phòng, lựa chọn, điều kiện, bằng chứng, trạng thái và kết thúc cho mọi đường.
- Nội dung từng phòng, hình ảnh và nhịp chơi; kiểm soát phần đọc để game không trở thành bài phân tích dài.
- Phân biệt lựa chọn khám phá với lựa chọn hành động; hậu quả cụ thể, không rẽ nhánh giả rồi dồn về cùng bài học.
- Gợi ý tăng dần khi bí; cho quay lại, giữ điều chưa chắc, tiếp tục dù chưa gợi cảm xúc.
- Một tình huống mới cuối lượt để kiểm tra có tự phân biệt dữ kiện và suy đoán được không. Hoàn tất game hay nói “hay” chưa phải bằng chứng học được.

## 5. Backlog content

Các chủ đề có thể làm nền kiến thức hoặc game: vì sao hỏi AI thoải mái hơn hỏi trước lớp; sợ bị đánh giá; so sánh bản thân và GATO; vì sao kết quả cuối che khuất quá trình; cảm giác hiểu và tự giải thích; hành động khi chưa hiểu ý định người khác; cơ hội học tập mất đi khi công cụ làm nhanh hơn.

Chọn cách trình bày theo chủ đề: Khám phá, Quan sát, Trải nghiệm thật hoặc Góc nhìn. Giữ câu hỏi thật của người dùng, tránh ép mọi bài thành câu chuyện cảm xúc rồi kết bằng đạo lý/quote. Không gán một hành vi cho một nguyên nhân duy nhất. Bài phân tích sâu có thể đứng sau trải nghiệm game, dành cho người muốn đọc thêm.

## 6. Thiết kế học English liên quan

Vấn đề người dùng nêu ở phiên English: website đẹp nhưng chưa biết học thế nào; muốn hiểu, nhớ và tự sử dụng chunks trong tình huống đời sống/công việc/tin tức. Không phải tình huống nào cũng cần câu hỏi intent. Muốn tận dụng website hiện có hoặc thêm section, không xóa làm lại.

Hướng thiết kế bàn giao: tình huống có ngữ cảnh → đọc/hiểu ý chính → nhận diện ý định khi phù hợp → chọn chunks theo mục đích → tự tạo câu → đổi bối cảnh và tự dùng lại → giảm gợi ý theo khả năng thực hiện. Đây là hướng đề xuất, chưa phải chi tiết triển khai đã chốt.

Ví dụ bài tập: chọn phản hồi phù hợp với người nghe; giải thích vì sao dùng could thay can trong ngữ cảnh; hoàn thành câu không nhìn mẫu; dùng lại chunk trong một tình huống mới. Phản hồi cả ý nghĩa, sự phù hợp và diễn đạt, tránh chỉ kiểm tra nhận ra đáp án. Người học không cần cảm xúc mạnh mới luyện được ngôn ngữ.

Chưa đưa toàn bộ kho chunks hoặc nội dung file English cũ vào tài liệu này vì chưa đọc chúng trong phiên này. Khi triển khai cần đọc repo và nguồn chunks hiện hành.

## 7. Prompt tiếp tục ở local

> Đọc tài liệu bàn giao Selflo_Session_Handoff_2026-10-09.md. Tôi muốn lưu nội dung phiên này trong repo Selflo trên một Git branch riêng tên ideas/selflo-learning-maze-20261009. Đọc AGENTS.md, kiểm tra trạng thái repo, bảo toàn thay đổi hiện có và dùng cấu trúc tài liệu phù hợp. Tách thành tài liệu AI và việc học, thiết kế mê cung Selflo, backlog content và thiết kế học English. Giữ rõ ý kiến của tôi, đề xuất của trợ lý, câu hỏi còn mở và nghiên cứu chưa xác minh. Bước này chỉ tổ chức và lưu ý tưởng; chưa sửa code, chưa triển khai game, chưa publish. Sau khi lưu, báo tên branch và các file đã tạo.
