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
| `PM-QUOTE-P0` | Làm sạch và vận hành kho quote | P0 | Đang thực hiện enrichment toàn corpus | Baseline: 656 Release, 1.073 Authoring; đang mở lại 3.741 Research/Raw để bổ sung và review | [`quote-library-p0/STATUS.vi.md`](quote-library-p0/STATUS.vi.md) |

Khi mở lại công việc, đọc Registry → `STATUS.vi.md` → phần cuối `WORKLOG.vi.md` trước khi sửa file.
