# Báo cáo đánh giá toàn thư viện — đợt 1

## Phạm vi

- Chủ đề gốc: `adversity_resilience`
- Số câu mới được đọc và đánh giá: 32
- Bộ khung áp dụng: kiến trúc nội dung v0.2
- Nguồn đọc: bản chuẩn trong `source/vi/quotes/adversity_resilience/`
- Không sửa câu chữ, nguồn dẫn, vòng đời duyệt hoặc dữ liệu phát hành.

## Kết quả

| Độ chắc chắn | Số câu |
|---|---:|
| Cao | 24 |
| Trung bình | 7 |
| Thấp | 1 |

Sau đợt này, bảng tổng có 156/389 câu đã được đánh giá và còn 233 câu chờ đánh giá.

## Điều quan sát được

Chủ đề gốc “nghịch cảnh và sức bền” thực tế chứa ít nhất bốn vai trò nội dung khác nhau:

1. Chấp nhận giới hạn hoặc thực tại để ngừng chống chọi vô ích.
2. Đổi cách nhìn về trở ngại, mất mát hoặc thất bại.
3. Thu hẹp phạm vi để tìm một hành động kế tiếp có thể làm được.
4. Phục hồi theo thời gian, gồm cả nghỉ ngơi và chịu đựng giai đoạn chưa rõ kết quả.

Điều này củng cố quyết định không dùng chủ đề gốc làm nhãn duy nhất cho nhu cầu con người. Hai câu cùng nằm trong `adversity_resilience` có thể hỗ trợ những năng lực rất khác nhau, như `quyền_tự_chủ`, `chịu_đựng_bất_định`, `điều_hòa_cảm_xúc` hoặc `mở_rộng_góc_nhìn`.

## Điểm cần chủ sở hữu xem lại

- `attributed.ma.iii_12.no_one_hinders`: câu quá ngắn và thiếu ngữ cảnh ngay trong văn bản trích dẫn. Nhãn `áp_lực_công_việc → quyền_tự_chủ → hành_động` chỉ có độ chắc chắn thấp; cần xem lại ngữ cảnh nguồn trước khi dùng vào một hành trình nội dung cụ thể.
- `attributed.paulo_coelho.the_alchemist.075` và `attributed.paulo_coelho.the_alchemist.080`: hai câu gần như lặp lại cùng một mệnh đề về lòng can đảm. Đây không phải lỗi phân loại, nhưng là ứng viên kiểm tra trùng lặp biên tập ở giai đoạn đánh giá chất lượng thư viện.
- Một số trích dẫn từ *Nhà giả kim* có nội dung phụ thuộc bối cảnh truyện hoặc ngôn ngữ tôn giáo. Các nhãn hiện tại mô tả chuyển động suy ngẫm có thể có, không khẳng định chúng phù hợp với mọi người đọc.

## Kiểm tra kỹ thuật

- Bảng tổng vẫn có đúng 389 mã câu.
- Không có mã trùng.
- Không có trường phân loại bị trống trong 156 câu đã đánh giá.
- `git diff --check` không phát hiện lỗi khoảng trắng.

