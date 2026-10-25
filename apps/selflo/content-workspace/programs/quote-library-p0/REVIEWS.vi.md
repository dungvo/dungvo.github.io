# Review kế hoạch — 25/10/2026

| Góc nhìn | Finding | Cách xử lý trong plan |
|---|---|---|
| Product/owner | Cần khép kín một phần trước, story phải đọc kỹ | Quote là ưu tiên duy nhất; story parked |
| Editorial | 100–200 dòng không nên được duyệt đồng loạt | Verdict/evidence từng dòng, nhóm đọc nội bộ cùng nguồn |
| Ngôn ngữ | Ngoại ngữ có thể dịch, tên người không thể dịch tùy tiện | Bảng tên có nguồn; raw giữ nguyên; kiểm tra reader-facing |
| Nguồn/quyền | Cùng tác giả nhưng khác edition/translator có quyền khác | Evidence edition và locator; không suy quyền từ tác giả cổ |
| Dữ liệu | Có nguy cơ thêm ledger cạnh tranh khi bao phủ raw | T-01 phải xác định đường ghi và nối gate trước verdict mới |
| QA | Batch lớn dễ bỏ sót/đếm trùng | Baseline ID/hash; 36 batch; tập ID phủ đúng 5.471; fail closed |
| Delivery | Chờ nguồn/triển khai có thể làm batch kéo dài | Không cam kết thời gian cứng; kết luận rõ sau truy nguồn có ghi nhận |
| Contract | Không có UI/app change hiện tại | Content-compatible; không tạo contract/schema cạnh tranh |

## Kết quả thực sự đã kiểm tra

- 36 batch có 100–200 dòng, phủ đủ 5.471 baseline ID, không trùng/thiếu.
- Tổng các cohort 662 + 1.189 + 821 + 2.799 = 5.471.
- Story không nằm trong assignment quote; không thay quote/story/manifest/decision trong lượt lập kế hoạch.

Đây là review plan và kiểm tra assignment, không phải review nội dung của 5.471 dòng. Chưa chứng nhận quyền, dịch thuật hoặc Release cho batch nào. T-01/T-02 là bước thực hiện kế tiếp, không phải blocker cần owner trả lời lại về batch size đã rõ.

## 2026-10-25 — Nghiệm thu Q10-B002

- 166 ID có kết luận và source passage; 75 accepted/91 not_accepted, không có pending trong batch.
- Đã giữ nguyên source rights, edition/translator và bản trước; không suy quyền từ tuổi tác giả, không loại vì ngoại ngữ. Đối chiếu tên Kinh Pháp Cú là tác phẩm.
- 94 tests và publisher gates đạt; public 9 pack/checksum khớp. 91 exclusion, 17 winner chỉ tới accepted, không sửa story.
- Corpus còn 5.129 dòng; kết quả đợt này không phải nghiệm thu toàn kho.
