# Tầng không tồn tại — tiếp nhận nguồn

- URL owner cung cấp: https://cdungvo.substack.com/p/tang-khong-ton-tai
- Ngày kiểm tra: 2026-10-21.
- Trạng thái: blocked_source_unavailable.
- Trang nguồn trả “Site Unavailable”; chưa lấy được thân bài, danh sách tập hoặc thứ tự tập từ nguồn.
- Catalog hiện có 10 placeholder là kế hoạch sẵn có trong repo, không phải số tập đã xác minh từ Substack.
- Chưa nhập story canonical, chưa tạo bản phỏng tác, chưa phát hành series.

Khi nguồn truy cập được hoặc owner cung cấp bản export/Markdown/HTML: giữ nguyên văn bản gốc và URL xuất xứ; lập danh sách tập theo nguồn; đọc contract Story V3 và ADR biên tập; chuyển từng tập thành story đúng schema; kiểm tra nội dung, quyền và reader trước khi đưa vào Release. Không suy diễn nội dung từ tên series.

## Kiểm tra lại 2026-11-01

- Đã thử link chính `https://cdungvo.substack.com/p/tang-khong-ton-tai`, nguồn RSS `/feed`, đường `/api/v1/archive?sort=new` và tìm kiếm nội dung được đánh chỉ mục. Đều không lấy được thân bài đáng tin cậy, không thể chứng minh các liên kết đến 10 tập hay thứ tự.
- Repo có **10 placeholder**, **không xác nhận đã có 10 bài public**. Không tạo bài, quote hoặc lời thoại dựa trên tiêu đề/placeholder.
- Có thể nhập trọn bộ bằng **một file export ZIP** của publication: Substack Publisher Dashboard → Settings → Exports → Create new export → tải ZIP khi hoàn tất, rồi gửi ZIP cho Selflo; không cần copy từng tập. Nguồn: https://support.substack.com/hc/en-us/articles/360037466012-How-do-I-export-my-posts
- Export có thể chứa email subscriber/thống kê: chỉ cần **posts HTML/CSV**. Loại bỏ dữ liệu danh sách người đăng ký trước khi đưa vào GitHub.
- Nếu bài có quyền thuộc owner, Selflo giữ tác giả/nguyên văn/URL/ngày đăng và chuyển semantic blocks theo Story V3. Chưa có full text nên **chưa nhập**, chưa thay đổi planning catalog.
