# Quyết định — Chương trình quote closure

## D-01 — Chỉ hoàn tất quote trước (owner, 25/10/2026)

Owner yêu cầu tạm dừng story để tự đọc kỹ; tập trung toàn bộ 5.471 dòng quote, quyết định lên Release hoặc không đạt, tránh mở nhiều việc dở dang. Chỉ đạo có hiệu lực ngay; không thay quyết định với bản thân các story.

## D-02 — Ngoại ngữ và tên (owner, 25/10/2026)

Nội dung Anh/Hoa/Hy Lạp có thể dịch; không loại chỉ vì chưa Việt hóa. Tên có cách gọi tiếng Việt phổ biến và xác minh được thì dùng tên Việt; tên còn lại giữ dạng gốc quen dùng. Giữ nguyên bản/provenance để truy vết.

## D-03 — Quy mô batch (owner yêu cầu điều chỉnh, AI cụ thể hóa)

Owner đề nghị 100–200 quote mỗi đợt. Áp dụng 100–200 **baseline dòng**, mục tiêu 150; schedule ban đầu 36 batch. Một raw row không nhất thiết là một quote được chấp nhận. Nhóm nhỏ theo nguồn trong batch chỉ là cách đọc nội bộ, không phải batch backlog mới hoặc ủy quyền bulk-approve.

Đề xuất cũ 25–40 là lựa chọn vận hành thận trọng của AI, không phải schema limit, quota hệ thống hoặc yêu cầu owner. Nó bị thay thế bởi kế hoạch 100–200 hiện tại. Không giảm chuẩn review để bù quy mô lớn.

## D-04 — Ownership và gates

Dùng một home hiện có quote-library-p0 và workflow content; SPEC/PLAN/TASKS là canonical cho increment này. Kế thừa AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md; reviewer là ai:codex. Owner đã đồng ý hướng và yêu cầu lập kế hoạch thực hiện, không cần hỏi lại các lựa chọn đã rõ. Không ghi owner nghiệm thu kết quả chưa tồn tại, không bỏ source/rights/Release gates.

Không phát hành quote hoặc thay verdict trong lượt lưu workspace. Bước thực hiện đầu tiên là T-01/T-02 rồi đợt Q10-B001. Chỉ yêu cầu owner quyết định nếu phát sinh phạm vi/gate mới chưa có ủy quyền.
