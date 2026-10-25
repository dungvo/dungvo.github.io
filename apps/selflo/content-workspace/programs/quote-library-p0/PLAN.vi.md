# Kế hoạch thực hiện — 100–200 dòng/đợt

> **Checkpoint 2026-10-25:** P0 và Q10.1 đã xong; 662 dòng rà Release có kết luận, public 376 quote ở Release 52. Chuyển Q10.2 theo B005 (149), chưa mở story. Bằng chứng `Q10_1_RELEASE_CLOSURE.vi.md`.

## P0 — Chuẩn bị một lần

- Khóa baseline ID/hash 5.471 đã chụp; xác nhận index quyết định hiện có và cách nối raw ↔ canonical trước khi ghi verdict mới.
- Lập bảng tên người/tác phẩm/truyền thống và mẫu evidence có locator/rights/hash/reason.
- Kiểm tra đủ 36 batch không trùng/thiếu ID. Baseline và assignment chỉ tổ chức việc, không cấp approval.
- Không phát triển dashboard/migration riêng. Chỉ bổ sung kiểm tra cần để ledger/gates hiện có bao phủ raw và canonical nhất quán.

**Exit:** sổ quyết định có authority rõ, bảng tên seed và mẫu batch record sẵn sàng; không pending về ownership của dữ liệu trước batch đầu.

## P1–P4 — Các mốc xử lý

| Mốc | Nội dung | Dòng | Số đợt | Dòng/đợt đã chia |
|---|---|---:|---:|---:|
| Q10.1 | Rà Release | 662 | 4 | 165–166 |
| Q10.2 | Khép kín Authoring | 1189 | 8 | 148–149 |
| Q10.3 | Khép kín research có review/nguồn | 821 | 5 | 164–165 |
| Q10.4 | Dịch và review raw | 2799 | 19 | 147–148 |

**Tổng: 36 đợt, 5.471 dòng.** Queue chi tiết: reports/quote-closure-batch-plan-2026-10-25.json. Thứ tự Q10-B001 đến Q10-B036. Các cohort lấy theo pipeline tại baseline và không thay lại assignment khi quote chuyển stage.

Mục tiêu khoảng 150; chia cân bằng để mỗi đợt đều 100–200 thay vì để một đợt cuối quá ít. Ví dụ 662 Release được chia 166,166,165,165. Queue được sắp theo họ nguồn/tác giả/tác phẩm/URL/ID để giảm đổi ngữ cảnh; biên batch có thể cắt một tác phẩm lớn nhưng không được cắt một đoạn nguồn theo cách làm mất ngữ cảnh.

Số 36 là kế hoạch ban đầu, không phải cam kết tốc độ. Nếu cần điều chỉnh grouping để giữ ngữ cảnh thì phải ghi lại assignment và kiểm tra phủ đủ ID; không tự tăng tổng hoặc duplicate ID giữa các batch. Số quote cuối cùng được phát hành không có quota, phụ thuộc chất lượng.

## Một batch được thực hiện thế nào

1. **Mở batch:** đối chiếu ID/hash/decision cũ; xác định nhóm edition và các quyết định đóng cần giữ.
2. **Đối chiếu nguồn:** dùng chung evidence cấp tác phẩm/edition; mỗi passage vẫn phải có locator và verdict riêng.
3. **Dịch và biên tập:** xử lý theo nhóm nhỏ cùng nguồn; chuẩn hóa tên theo bảng chung; lưu bản gốc và before/after.
4. **Review từng dòng:** nghĩa/ngữ cảnh, độc lập, độ phù hợp, nguồn/quyền, trùng passage. Không approve bằng regex hoặc thay một nhãn hàng loạt.
5. **Ghi quyết định:** released-candidate hoặc not_accepted có lý do. released-candidate chỉ là trạng thái tạm trong batch, chưa tính completed/released.
6. **Tạo package:** sửa canonical và dùng publisher/gates, không sửa generated files bằng tay; đủ cơ sở quyền mới phát hành.
7. **Kiểm chứng:** schema/semantic/coverage, rejected replay, ID count, hash, tên/ngoại ngữ; xác nhận tập public sau deploy.
8. **Đóng batch:** mỗi dòng đã released hoặc not_accepted; báo cáo số liệu/sample, cập nhật ledger/Matrix/status/worklog. Lưu commit/revision và một bước tiếp theo.

Không mở batch nội dung mới khi batch hiện tại còn unresolved. Trường hợp không xác minh được sau các hướng truy nguồn hợp lý được kết luận not_accepted với lý do đủ bằng chứng, không giữ chờ vô hạn. Không xin owner đọc từng dòng; chỉ đưa finding vượt ủy quyền và báo cáo/sample nghiệm thu.

## Vì sao không dùng 25–40 làm batch quản lý

25–40 ban đầu giúp giảm rủi ro khi chưa rõ chất lượng corpus, nhưng sẽ tạo quá nhiều điểm đóng/mở và báo cáo. Tăng lên 100–200 giảm chi phí điều phối, phù hợp yêu cầu owner. Độ khó không chỉ phụ thuộc số dòng: 150 kệ cùng edition có thể dễ đối chiếu hơn 30 đoạn từ nhiều nguồn.

Giữ nhóm đọc nội bộ theo edition để giảm bỏ sót ngữ cảnh, nhưng chỉ có một batch 100–200 đang mở. Không đưa 200 dòng vào một lượt quyết định chung. Không hứa mỗi đợt xong trong một phiên hoặc một khoảng thời gian cố định trước khi đo batch đầu.

## P5 — Nghiệm thu toàn bộ

- 5.471 ID có đúng một verdict cuối; released + not_accepted = 5.471; remaining = 0.
- Quét trùng passage và tên xuyên batch; sửa sai lệch trước close.
- Quote accepted thực sự ở public Release; các ID bị loại không có trong active manifest.
- Báo cáo theo lý do/nguồn/ngôn ngữ, sample trước/sau, ngoại lệ và evidence kiểm định.
- Owner nghiệm thu chương trình. Chỉ sau đó mới chuyển ưu tiên story/Knowledge/feature khác.

## Kế hoạch bước thực hiện đầu

T-01/T-02: chốt đường ghi quyết định bao phủ baseline và bảng tên seed. Sau đó Q10-B001: 166 dòng trong Release hiện hành, xem danh sách ID trong queue. Bước đầu này chưa được thực hiện trong lượt lập plan.
