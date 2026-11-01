# Selflo Classics — 20 bản kể lại cho Authoring review (2026-11-01)

## Tình trạng
- Đã **chuyển 20 truyện thành canonical Story V3 draft** trong `perspective-library/source/vi/stories/classic-*/story.vi.json` và ghi vào `source/vi/source.json` trên nhánh `content/selflo-classics-intake-20-20261101`.
- Mỗi bản là **bản kể lại tiếng Việt ngắn do AI hỗ trợ biên soạn**, **không phải toàn văn nguyên tác và không phải bản dịch nguyên văn từ một ấn bản**. Giữ diễn biến chính ở mức cốt truyện, nên cần đối chiếu từng câu với nguyên tác trước khi chốt.
- `review.status = needs_owner_review`, `rights.status = unverified`, `status = draft`. **Chưa chạy publisher và chưa tạo generated Authoring**, chưa có Studio Reader preview. Không ghi rằng đã Release.
- Dữ liệu nguồn gốc: [Joseph Jacobs, *The Fables of Aesop* (1894), Project Gutenberg](https://www.gutenberg.org/ebooks/28); [Robert Louis Stevenson, *Fables* (1896/1898), Project Gutenberg](https://www.gutenberg.org/ebooks/343). Năm ấn bản thực tế và mục lục cần đối chiếu từng bản Gutenberg.
- Các bản **chưa được source-verified từng câu**, kể cả độ đúng của nhan đề trong ấn bản. Review rights của bản gốc, cách biên tập/tái sử dụng, quyền bản dịch Việt Nam, hình ảnh và giấy phép còn mở.
- Nội dung từ *Tầng không tồn tại* KHÔNG được nhập: Substack trả nội dung không truy cập được; trong repo đã có [SOURCE_INTAKE](../story-series/tang-khong-ton-tai/SOURCE_INTAKE.vi.md) với cùng blocker, catalog 10 tập chỉ là placeholder.

## Danh mục 20 bản đã viết ở canonical source (chưa publish)

| # | Tên Việt | Nhan đề tham chiếu | Nguồn | Cách kể ưu tiên |
|---:|---|---|---|---|
| 01 | Sư tử và bức tượng | The Lion and the Statue | Aesop/Jacobs | góc nhìn, ai kể lịch sử |
| 02 | Chuột thành thị và chuột đồng quê | The Town Mouse and the Country Mouse | Aesop/Jacobs | thiếu nhi, lựa chọn |
| 03 | Con chó và con sói | The Dog and the Wolf | Aesop/Jacobs | tự do và đủ đầy |
| 04 | Cáo và chiếc mặt nạ | The Fox and the Mask | Aesop/Jacobs | châm biếm hình thức |
| 05 | Người cha, cậu bé và con lừa | The Man, the Boy, and the Donkey | Aesop/Jacobs | châm biếm ý kiến đám đông |
| 06 | Gió và Mặt Trời | The Wind and the Sun | Aesop/Jacobs | áp lực và thuyết phục |
| 07 | Hội nghị đeo chuông cho mèo | Belling the Cat | Aesop/Jacobs | kế hoạch và thực thi |
| 08 | Cây lớn và cây sậy | The Tree and the Reed | Aesop/Jacobs | thích nghi |
| 09 | Cáo và chùm nho | The Fox and the Grapes | Aesop/Jacobs | hợp lý hóa thất bại |
| 10 | Quạ và chiếc bình nước | The Crow and the Pitcher | Aesop/Jacobs | thay đổi cách tiếp cận |
| 11 | Phần chia của sư tử | The Lion's Share | Aesop/Jacobs | quyền lực và chia phần |
| 12 | Con ngỗng đẻ trứng vàng | The Goose With the Golden Eggs | Aesop/Jacobs | thiếu kiên nhẫn |
| 13 | Hai que diêm | The Two Matches | Stevenson | đánh giá hệ quả |
| 14 | Con tàu đang chìm | The Sinking Ship | Stevenson | ngụy biện và hoàn cảnh |
| 15 | Vị khách từ hành tinh khác | The Distinguished Stranger | Stevenson | nhìn từ người ngoài |
| 16 | Hai ngựa kéo xe và ngựa cưỡi | The Cart-Horses and the Saddle-Horse | Stevenson | hiểu lầm địa vị |
| 17 | Nòng nọc và ếch | The Tadpole and the Frog | Stevenson | quên quá khứ của mình |
| 18 | Bốn người muốn cải cách | The Four Reformers | Stevenson | phi lý của mục tiêu lớn |
| 19 | Người đọc và cuốn sách | The Reader | Stevenson | góc nhìn và định kiến |
| 20 | Thứ sơn màu vàng kỳ diệu | The Yellow Paint | Stevenson | lời hứa không thể phản chứng |

## Tầng không tồn tại — việc cần từ owner

Vui lòng gửi **toàn văn** bài từ `https://cdungvo.substack.com/p/tang-khong-ton-tai` dưới dạng copy text/Markdown/HTML hoặc file export có đầy đủ chương. Chỉ khi có bản gốc mới xác minh được số phần, thứ tự, tiêu đề, tên tác giả và các đoạn nguyên văn. Nếu bài thuộc quyền của owner, ghi rõ quyền sử dụng và xuất xứ; không tự tưởng tượng mười tập từ placeholder.

## Authoring gate phải chạy trước khi dùng Reader

1. Đọc [Story V3 Contract](../../shared/contracts/story-reader/v3/CONTRACT.vi.md), schema `1.2`, [Authoring structure](../../perspective-library/source/vi/AUTHORING_STRUCTURE.md).
2. Đối chiếu **nguyên tác từng câu**; không chuyển bản kể lại thành bản dịch đầy đủ hoặc chép nguyên văn một bản dịch có bản quyền.
3. Verify quyền/nguồn từng truyện; kiểm tra duplicate về cốt truyện và ý tưởng với Selflo Release hiện có.
4. Kiểm tra canonical `source.json` và từng JSON Story V3; xác nhận các field metadata/themes/authorship, quotation policy, review/rights; không gắn owner approval giả.
5. Chạy `./scripts/publish-perspective-library --channel authoring` **không dùng** `--skip-schema`; kiểm tra script output, link reader, format, UTF-8, reflection và quote linkage, tests. Nếu gate fail, giải quyết trước rồi mới tuyên bố 'Authoring'.
6. Owner review từng truyện; không tự push Release hoặc merge nhánh này vào main khi chưa đồng ý.

## Lưu ý biên tập quan trọng

20 bản này thiên về **ngụ ngôn ngắn và hài phi lý**, chưa đáp ứng sự đa dạng cả 12 phong cách. Chúng là batch nghiên cứu đầu tiên. Không có nhãn 'đã kiểm chứng quyền/đã duyệt' chỉ vì câu chuyện cổ. Cần xem việc thêm 20 ngụ ngôn cùng lúc có làm Selflo tăng sự đồng nhất giọng kể hay không.
