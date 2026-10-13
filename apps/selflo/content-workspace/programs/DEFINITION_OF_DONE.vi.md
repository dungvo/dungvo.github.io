# Selflo content — Định nghĩa hoàn thành các chương trình

**Trạng thái:** Đã chốt làm chuẩn quản lý
**Ngày chốt:** 2026-10-12
**Owner nghiệm thu cuối:** Dũng

Tài liệu này trả lời câu hỏi: **khi nào một chương trình thật sự được gọi là xong?** Có tài liệu, giao diện thử hoặc dữ liệu trong Authoring chưa đồng nghĩa với hoàn thành.

## Nguyên tắc kiến trúc đã chốt

Studio và web công khai không phải hai sản phẩm được xây song song.

```text
Canonical source
      ↓
Studio — môi trường đầy đủ để phát triển, xem thử và nghiệm thu
      ↓ chỉ chọn phần đã đạt gate để phát hành
Web công khai — môi trường production, là tập con đã duyệt của Studio
```

- Studio có thể chứa nội dung, feature, trạng thái thử nghiệm và công cụ nội bộ chưa public.
- Web công khai chỉ nhận phần đã được chọn, duyệt và phát hành từ cùng hệ thống.
- Không sao chép rồi duy trì một phiên bản public riêng bằng tay.
- Không sửa trực tiếp đầu ra Authoring hoặc Release đã sinh.
- Một feature hiển thị trong Studio chưa có nghĩa là đã sẵn sàng public.

## Điều kiện chung cho mọi chương trình

Một chương trình chỉ được ghi `Hoàn thành` khi:

1. Phạm vi và tổng đối tượng cần xử lý đã xác định.
2. Mỗi đối tượng có trạng thái cuối, không còn trạng thái nhập thô hoặc mơ hồ.
3. Đầu ra đạt tiêu chuẩn nội dung, nguồn, quyền, dữ liệu và trải nghiệm tương ứng.
4. Studio hiển thị đúng bản đầy đủ cần nghiệm thu.
5. Phần được chọn để public đã đi qua Release gate và mở đúng trên web công khai.
6. Số liệu trước/sau được đối soát; có log, checkpoint và bằng chứng kiểm tra.
7. Owner nghiệm thu kết quả chương trình theo báo cáo/sample; review từng item có thể được ủy quyền rõ cho AI nếu policy của chương trình cho phép.

## DOD-01 — Kho Quote P0

Hoàn thành khi toàn bộ 5.470 dòng baseline có identity, phân loại và một kết luận cuối; tổng các kết luận bằng đúng 5.470. Các kết luận cho phép gồm:

- đã Release;
- đủ điều kiện Release;
- cần owner review và được giữ trong Authoring;
- cần sửa;
- cần xác minh nguồn;
- bị chặn vì quyền sử dụng;
- bản trùng;
- giữ làm nghiên cứu;
- loại.

Mọi quote đủ điều kiện phải được Release và kiểm tra trên web công khai. Không yêu cầu cả 5.470 dòng đều được Release. Owner đã ủy quyền AI review từng item theo [`quote-library-p0/AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md`](quote-library-p0/AI_DELEGATED_REVIEW_AND_RELEASE_POLICY.vi.md); owner nghiệm thu kết quả cuối thay vì đọc lại từng câu.

## DOD-02 — Kho bài Góc Nhìn

Hoàn thành khi mỗi ý tưởng/bài có một trạng thái rõ từ ý tưởng, nghiên cứu, viết, review, Authoring, Release đến đã đăng kênh ngoài; bài Release có nội dung, nguồn, hình ảnh/quyền, metadata và trải nghiệm đọc đạt gate.

## DOD-03 — Kho Knowledge

Hoàn thành giai đoạn nền khi có inventory chủ đề, xác định bài cũ có thể tái sử dụng, đối tượng đọc/vấn đề/mục tiêu học tập của từng bài, quy chuẩn nguồn–tiếng Việt–hình ảnh–an toàn, và lifecycle từ nghiên cứu đến Release. Rhythm → Knowledge vẫn tạm dừng cho đến khi điều kiện mở lại trong ADR-0002 được đáp ứng.

## DOD-04 — Studio và phát hành web công khai

Hoàn thành khi Studio là môi trường đầy đủ để:

- xem tất cả nội dung và feature đang phát triển;
- xem trước trải nghiệm gần với trạng thái public;
- biết rõ trạng thái, lỗi thiếu nguồn/quyền/metadata và gate còn thiếu;
- chọn phần đủ điều kiện để phát hành mà không sửa output bằng tay;
- tạo Release có thể kiểm tra và quay lại phiên bản trước.

Web công khai hoàn thành vai trò production khi chỉ hiển thị tập con đã Release từ Studio/canonical pipeline, đường dẫn ổn định, manifest và nội dung không lệch nhau, và có kiểm tra sau phát hành.

## DOD-05 — Chuyển động và hình ảnh

Hoàn thành khi từng asset có mục đích học tập/trải nghiệm rõ, quyền sử dụng, trạng thái, nơi dùng, kiểm tra mobile/hiệu năng/khả năng tiếp cận/chế độ giảm chuyển động, hiển thị đúng trong Studio và chỉ lên web công khai khi feature chứa nó được Release.

## DOD-06 — Quản lý chương trình

Hoàn thành khi mỗi chương trình có owner, mục tiêu/giá trị, phạm vi, trạng thái, phase/gate, checkpoint, đúng một bước tiếp theo, worklog, số liệu đối soát, quyết định đã chốt và blocker. Việc hết phiên hoặc đổi sang feature khác không được làm mất dấu công việc.
