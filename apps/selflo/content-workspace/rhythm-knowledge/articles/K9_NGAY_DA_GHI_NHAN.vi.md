# K9 — Những ngày đã check-in đại diện được bao nhiêu cho cả tuần hoặc tháng?

**Trạng thái:** Full Authoring draft · needs owner review  
**Article ID:** `knowledge.rhythm.k9.sampled_days`

## Câu trả lời ngắn

Các ngày đã check-in là những lát cắt thật, nhưng không tự động đại diện cho mọi ngày trong tuần hoặc tháng. Ta có thể dễ nhớ mở Selflo khi cảm xúc rõ, khi rảnh hoặc khi một chủ đề đang chiếm chú ý; những thời điểm bận nhất, dễ chịu nhất hoặc khó chịu nhất lại có thể bị bỏ qua. Vì vậy Selflo chỉ nên so sánh trên phần dữ liệu đủ dày và luôn nói “trong những ngày ghi nhận”. Khoảng trống không mang nghĩa rằng không có gì xảy ra. Nó chỉ có nghĩa Selflo chưa có dữ liệu về khoảng đó.

## Một tháng không phải lúc nào cũng có 30 điểm dữ liệu

Chọn cửa sổ 30 ngày chỉ xác định khoảng thời gian cần nhìn. Nếu bạn check-in ba ngày, hệ thống đang có ba ngày ghi nhận trong cửa sổ 30 ngày—không phải một bức tranh đầy đủ của tháng.

```text
Thời gian đã trôi qua: 30 ngày
Ngày có check-in: 3 ngày
Điều có thể mô tả: ba lát cắt
Điều chưa thể suy ra: toàn bộ tháng
```

## Vì sao phần bị thiếu có thể quan trọng?

Missingness không nhất thiết ngẫu nhiên. Có người check-in khi đang cần một khoảng dừng; có người lại tránh check-in lúc quá mệt. Một ngày họp kín lịch và một ngày nghỉ yên có thể đều bị bỏ qua, nhưng vì lý do khác nhau. Vì Selflo không biết cơ chế của mỗi khoảng trống, cách trung thực nhất là không điền nó bằng giả định.

## Hai cửa sổ, hai câu hỏi

Bảy ngày gần đây giúp nhìn phần gần nhất. Ba mươi ngày cho thêm bối cảnh, nhưng chỉ hữu ích để so sánh khi cả phần gần và phần trước đó có đủ ngày ghi nhận. Nếu một phía chỉ có một hoặc hai điểm, câu “tuần này đã khác” có thể mạnh hơn dữ liệu cho phép.

## Điều dễ hiểu nhầm

1. **“Không check-in nghĩa là hôm đó ổn.”** Selflo không biết điều này.
2. **“Ba lần giống nhau là ba ngày liên tiếp.”** Chỉ đúng khi ngày lịch thực sự liên tiếp.
3. **“30-day view luôn đáng tin hơn 7-day view.”** Cửa sổ dài hơn nhưng quá thưa có thể ít hữu ích hơn cửa sổ ngắn có dữ liệu rõ.
4. **“Thêm dữ liệu sẽ cho nguyên nhân.”** Nhiều lần ghi nhận có thể làm pattern rõ hơn nhưng vẫn không tự chứng minh causality.

## Một cách tự kiểm tra

Hãy nhìn các khoảng trống và hỏi nhẹ nhàng:

- Tôi thường nhớ check-in vào lúc nào?
- Có loại ngày nào tôi hiếm khi ghi nhận?
- Nếu chỉ nhìn những ngày có check-in, câu chuyện có thể nghiêng về phía nào?
- Tôi cần thêm dữ liệu hay đã có một vấn đề thực tế cần chú ý ngay?

Mục tiêu không phải check-in thật nhiều để đạt điểm. Mục tiêu là biết bức tranh đang dựa trên phần nào của trải nghiệm.

## Khi dữ liệu thưa vẫn có giá trị

Một ghi nhận đơn lẻ vẫn có thể giúp bạn gọi tên khoảnh khắc. Giá trị đó không cần được nâng thành trend. Selflo có thể nói “đây là điều bạn đã ghi hôm ấy” mà không cần biến nó thành câu chuyện dài hơn.

## Câu để mang theo

> Ngày đã ghi là dữ liệu; ngày bỏ trống là điều chưa biết.

## Visual specification

Hai timeline 30 ngày: một timeline có 18 ngày ghi nhận và một timeline chỉ có 3 ngày. Cùng nhãn “30 ngày” nhưng vùng quan sát khác nhau.

**Alt text:** “Hai cửa sổ đều dài 30 ngày; cửa sổ thứ nhất có nhiều ngày được ghi, cửa sổ thứ hai chỉ có ba, minh họa rằng độ dài cửa sổ không đồng nghĩa với độ đầy dữ liệu.”

## Evidence note

Stone et al. và de Vries et al. mô tả các vấn đề về selection, missingness, compliance và interpretation trong ecological momentary assessment. Selflo dùng chúng để giữ claim thận trọng, không ngoại suy các con số nghiên cứu sang người dùng cá nhân.

