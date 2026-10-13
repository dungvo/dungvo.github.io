# P0 Quote — Đóng phạm vi ưu tiên để chuyển phase

**Ngày:** 2026-10-12
**Trạng thái:** Lịch sử; đã được thay bởi full scan 2026-10-13
**Authoring:** revision 82
**Release:** revision 44

> Tài liệu này ghi checkpoint trước khi owner yêu cầu quét đủ 5.470 dòng. Kết luận hiện hành nằm tại [`P0_FULL_SCAN_FAST_LANE_RESULT_2026-10-13.vi.md`](P0_FULL_SCAN_FAST_LANE_RESULT_2026-10-13.vi.md); không dùng số 343 làm trạng thái mới nhất.

## Quyết định phạm vi

P0 không còn bị buộc phải review xong toàn bộ 5.470 dòng trước khi Selflo chuyển sang phase khác. Mục tiêu ưu tiên được đổi thành:

> Phát hành ngay những quote đang có bằng chứng chắc chắn đạt đủ nguồn, quyền, độ chính xác/nội dung và Selflo fit; ghi checkpoint rõ cho phần cần xác minh lâu hơn.

## Kết quả

- Baseline 5.470/5.470 dòng đã được đối soát và có route vận hành.
- 25 quote chắc chắn nhất đã qua AI review, tag contract và Release gate.
- Release tăng từ 318 lên **343 quote**.
- Không có quote nào khác trong Authoring hiện đồng thời chắc chắn đủ cả bốn điều kiện mà không cần thêm việc:
  - 1.491 còn rights `unverified`;
  - 1 quote `public_domain` vẫn cần review độ chính xác bản dịch/nguồn;
  - 9 quote `selflo_owned` còn lại thuộc nhóm cần sửa/không đạt/cần review thêm.
- Vì vậy dừng fast lane tại 343 không phải bỏ sót một batch “sẵn sàng ngay”.

## Backlog không còn chặn phase tiếp theo

| Nhóm | Số lượng hiện tại | Khi quay lại |
|---|---:|---|
| Authoring chưa Release | 1.501 | Review theo source group; ưu tiên translated/direct quote |
| Rights unverified trong Authoring | 1.491 | Có bằng chứng item/edition/translation |
| Ready for AI review | 1.322 | Chạy Q3+Q4 theo batch khép kín |
| Story review | 15 | Review quote và story riêng, không duyệt ké rights |
| Needs round 1 | 46 | Review nội dung ban đầu |
| Blocked rights | 83 | Có permission/cơ sở quyền mới |
| Raw/Research ngoài Authoring | 3.626 | Chỉ mở lại khi cần tăng coverage hoặc nghiên cứu nguồn |

## Điều kiện mở lại chương trình toàn-corpus

Mở lại khi một trong các điều sau xảy ra:

1. cần tăng số lượng quote Release theo theme;
2. có thời gian dành riêng cho source/rights verification;
3. có công cụ/bằng chứng giúp xử lý một source group an toàn theo batch;
4. coverage report cho thấy thiếu nội dung ảnh hưởng trải nghiệm sản phẩm.

Khi mở lại, bắt đầu từ [`STATUS.vi.md`](STATUS.vi.md), đọc cuối [`WORKLOG.vi.md`](WORKLOG.vi.md), rồi xử lý lane `translated_quote` theo Wikisource/Project Gutenberg. Không làm lại Q0–Q2.
