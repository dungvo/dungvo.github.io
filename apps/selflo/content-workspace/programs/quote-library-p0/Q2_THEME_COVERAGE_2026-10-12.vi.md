# PM-QUOTE-P0 — Kết quả Q2: chủ đề và độ phủ

**Kết luận:** Q2 hoàn thành ở mức audit và phân luồng. Không tự gán theme nội dung khi chưa đọc câu.

## Phát hiện chính

- Corpus hiện có 113 giá trị theme khác nhau, gồm canonical theme, theme nghiên cứu, composite label và tên hiệu ứng.
- Có 3.050 dòng theme trống hoặc `unresolved`.
- Toàn bộ 3.050 dòng này đang ở pipeline `excluded`, chưa có dòng nào thuộc Authoring hoặc Release.
- Vì vậy không có quote production hiện tại bị thiếu theme, nhưng research backlog còn một khối chuẩn hóa lớn.
- Phần lớn 3.050 dòng đến từ các batch B001–B030, thường 100 dòng/batch.
- Source family đã được xác định cho phần lớn các batch, nhưng source family không thay thế theme. Ví dụ “William James” cho biết nguồn, không cho biết câu đang nói về chú ý, thói quen hay bản sắc.

## Quyết định an toàn

1. Không tự gán theme chỉ từ tác giả, tác phẩm hoặc batch.
2. Giữ 3.050 dòng ở `needs_normalization` cho đến khi đọc nội dung.
3. Khi xử lý, chia theo batch nguồn 100 dòng để giữ ngữ cảnh và kiểm tra nhất quán.
4. Chỉ bổ sung nghiên cứu mới sau khi đã biết khoảng trống của content đủ điều kiện, không dựa vào số raw capture.

## Khoảng trống nguồn nhìn thấy ở baseline

Các nhóm chưa có hoặc rất mỏng trong corpus tổng hợp:

- Sikh giáo;
- Kitô giáo sơ kỳ và trung cổ;
- giấc ngủ, nghỉ ngơi và an lành;
- khoa học, tự nhiên và khám phá;
- sáng tạo, nghệ thuật và nghề thủ công;
- Mỹ Latin;
- triết học/văn học La Mã ngoài Khắc kỷ;
- Hồi giáo và Do Thái;
- Phục Hưng;
- Epicurean và Hoài nghi.

Đây là gap nghiên cứu, chưa tự động trở thành quota. Một nhóm có 100 raw capture nhưng 0 Authoring vẫn chưa được xem là có content dùng được.

## Đầu ra

- Báo cáo máy đọc: `reports/q2-theme-coverage.json`.
- Review Matrix giữ `unresolved` minh bạch; không che bằng tag suy đoán.
- Hàng 3.050 dòng được chuyển thành backlog normalization theo batch trong Q5.

## Giá trị mang lại

- Xác nhận việc thiếu theme chưa ảnh hưởng nội dung đang public.
- Tránh tạo taxonomy sai bằng suy đoán từ nguồn.
- Có danh sách gap để sau này bổ sung content có chủ đích.
- Tách rõ “kho có nhiều dòng” khỏi “kho có nội dung usable và cân bằng”.
