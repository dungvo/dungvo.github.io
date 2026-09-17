# Quyết định tạm giữ lại nội dung để xem xét thêm

Ngày: 2026-09-17  
Quyết định: Chủ sở hữu yêu cầu đánh dấu nội dung chưa phù hợp với triết lý, tạm thời chưa phát hành, không xóa và tiếp tục xem xét.

## Nội dung được chuyển về biên soạn

| Mã câu | Lý do chính | Trạng thái mới |
|---|---|---|
| `attributed.ma.iv_07.suppress_injury` | Có thể bị hiểu là tổn thương biến mất khi người đọc ngừng gọi tên nó | `needs_owner_review` |
| `attributed.epictetus.ench_17.role` | Trao quyền chọn vai đời cho một nơi khác, không phù hợp rõ với quyền tự chủ khi đứng riêng | `needs_owner_review` |
| `attributed.ma.vi_19.human_power` | Có thể làm mờ rào cản sức khỏe, xã hội và nguồn lực | `needs_owner_review` |

## Cách thực hiện

- Thay đổi tại nguồn chuẩn, không vá trực tiếp bản phát hành.
- Dùng quy trình `prepare-perspective.py --channel authoring`.
- Giữ nguyên nội dung câu, nguồn gốc và trạng thái quyền sử dụng.
- Tạo lại kênh biên soạn và kênh phát hành bằng quy trình hiện có.
- Các phiên bản phát hành cũ tiếp tục tồn tại trong lịch sử; tệp kê khai hiện hành không còn trỏ tới ba câu.

## Kết quả

- Bản biên soạn: ba câu vẫn hiện diện để tiếp tục xem xét.
- Bản phát hành: ba câu không còn hiện diện.
- Số câu phát hành giảm từ 56 xuống 53.
- Không có câu chuyện liên kết nên không thay đổi trạng thái truyện.

## Điều kiện phát hành lại

Một câu chỉ được đưa trở lại phát hành khi chủ sở hữu đã quyết định ít nhất một trong các hướng:

1. Ngữ cảnh hiện tại đã đủ an toàn và giới hạn diễn giải được ghi rõ.
2. Câu cần đi cùng một nội dung khác để tránh cách hiểu gây hại.
3. Câu cần thay vai trò hoặc hoàn cảnh sử dụng trong kiến trúc nội dung.
4. Câu không phù hợp với trải nghiệm độc lập và chỉ nên được giữ cho nghiên cứu nguồn.

Phát hành lại phải đi qua quy trình duyệt hiện có; không tự động khôi phục sau khi hoàn tất ma trận bao phủ.

