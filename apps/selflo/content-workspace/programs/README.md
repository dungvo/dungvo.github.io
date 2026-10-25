# Selflo — Sổ chương trình và feature đang thực hiện

Đây là nơi lưu trạng thái bền vững cho các công việc kéo dài nhiều phiên. Mỗi chương trình có thư mục riêng để phiên sau biết đã làm gì, đã hoàn thành đến đâu và phải tiếp tục từ checkpoint nào.

Định nghĩa hoàn thành dùng chung và cho từng chương trình nằm tại [`DEFINITION_OF_DONE.vi.md`](DEFINITION_OF_DONE.vi.md). Studio là môi trường phát triển/nghiệm thu đầy đủ; web công khai là tập con đã Release, không phải hai bản được xây song song.

## Quy tắc bắt buộc

Mỗi chương trình cần có:

- `STATUS.vi.md`: mục tiêu, phạm vi, trạng thái hiện tại, checkpoint gần nhất và đúng bước tiếp theo;
- `WORKLOG.vi.md`: nhật ký append-only theo ngày/giờ, ghi việc đã làm, file đã đổi, kết quả kiểm tra và giá trị mang lại;
- tài liệu hoặc report riêng nếu chương trình sinh ra số liệu lớn.

Không ghi `Hoàn thành` khi mới xong một phase. Trạng thái dùng chung:

```text
Chưa bắt đầu
Đang thực hiện
Tạm dừng
Bị chặn
Hoàn thành
Đã chốt không làm
```

## Registry

| Mã | Chương trình | Ưu tiên | Trạng thái | Checkpoint hiện tại | Nơi theo dõi |
|---|---|---:|---|---|---|
| `PM-QUOTE-P0` | Khép kín 5.471 dòng quote | P0 | Đang thực hiện — lập plan xong | B001 closed 166/166; Release 49 public 598 quote; corpus 176/5.471, còn 5.295; tiếp B002 | [`quote-library-p0/STATUS.vi.md`](quote-library-p0/STATUS.vi.md) |
| `PM-STORY-P1` | Review story chỉ có trong Authoring | P1 | Tạm dừng theo owner | Baseline: 62 Authoring, 16 Release, 46 Authoring-only; owner sẽ đọc và bổ sung sau | [`story-authoring-review/STATUS.vi.md`](story-authoring-review/STATUS.vi.md) |
| `PM-KNOWLEDGE-P1` | Hoàn thành một bài Knowledge | P1 | Tạm dừng theo owner | Đã có bản bài 01 về so sánh xã hội/ghen tị; chờ owner đọc, chưa Authoring/Release | [`knowledge-article-p1/STATUS.vi.md`](knowledge-article-p1/STATUS.vi.md) |
| `PM-STUDIO-P1` | Studio parity, Website Lab và Knowledge Reader | P1 | S2 hoàn thành — chờ thảo luận | Studio có 4 trang parity + Developer; chưa chốt vị trí/tổ chức Phân tích | [`studio-public-knowledge-reader/STATUS.vi.md`](studio-public-knowledge-reader/STATUS.vi.md) |
| `PM-VOICE-P1` | Đa dạng giọng viết và cách kể | P2 | Đã lưu, chờ thảo luận | Đã ghi vấn đề và baseline 16 story Release; chưa audit từng bài | [`editorial-voice-diversity/STATUS.vi.md`](editorial-voice-diversity/STATUS.vi.md) |

Hiện `PM-QUOTE-P0` là ưu tiên duy nhất theo owner ngày 25/10/2026. Hoàn tất kho quote trước khi mở phần khác. Story tạm dừng để owner đọc kỹ; Knowledge/Studio/giọng viết không mở rộng trong chương trình quote. Các checkpoint tạm dừng 2026-10-13 là lịch sử, không thay chỉ đạo hiện hành. Workspace quote bắt đầu tại [`quote-library-p0/README.md`](quote-library-p0/README.md).

Khi mở lại công việc, đọc Registry → `STATUS.vi.md` → phần cuối `WORKLOG.vi.md` trước khi sửa file.
