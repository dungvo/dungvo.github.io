# P0 Quote — Kết luận đủ 5.470 dòng

**Ngày chốt:** 2026-10-13
**Reviewer vận hành:** `ai:codex`
**Baseline:** 5.470 dòng
**Trạng thái:** Baseline phân luồng lịch sử; đã mở lại theo quyết định owner cùng ngày

> Owner yêu cầu không coi 3.741 Research/Raw là kết luận cuối khi chưa chủ động bổ sung nguồn, dịch và review. Số liệu bên dưới là mốc **trước enrichment**, dùng để đối chiếu tiến độ; không phải kết quả nghiệm thu cuối.

## Kết quả ba nơi

| Nơi kết thúc | Số lượng | Ý nghĩa |
|---|---:|---|
| Release | 656 | Đã đủ bằng chứng hiện có, qua gate và có trong Release 45 |
| Authoring — owner review | 1.073 | Có giá trị để xem tiếp nhưng còn quyết định về nội dung, bản dịch, quyền, story hoặc chỉnh sửa |
| Research/Raw | 3.741 | Không đưa vào hàng duyệt hiện tại; giữ provenance để nghiên cứu lại hoặc loại |
| **Tổng** | **5.470** | Đối soát đủ, mỗi dòng đúng một nơi |

Sổ máy đọc cấp từng dòng: [`reports/p0-final-dispositions.json`](reports/p0-final-dispositions.json).

## Chi tiết kết luận

### Release — 656

- 343 câu đã ở Release trước đợt full scan.
- 313 câu mới được AI duyệt và đưa qua Release gate trong Release 45.
- Không nâng thêm các câu chỉ vì tác giả cổ hoặc website có uy tín. Nếu edition, quyền bản dịch, loại nội dung hoặc ngữ cảnh chưa đủ chắc, câu vẫn ở Authoring.

### Authoring — 1.073

| Lý do giữ để owner xem | Số lượng |
|---|---:|
| Đã qua tuyển chọn AI nhưng còn quyết định về quyền/bản dịch/ngữ cảnh/Selflo fit | 1.009 |
| Cần đọc cùng story | 15 |
| Candidate đã chuẩn hóa nhưng chưa có kết luận biên tập đủ chắc | 46 |
| Cần sửa trước khi có thể duyệt | 3 |

Đây là hàng duyệt thật dành cho owner. Không đưa 2.805 câu raw chưa dịch vào Authoring để owner phải lọc nguyên liệu thô.

### Research/Raw — 3.741

| Kết luận | Số lượng |
|---|---:|
| Raw chưa dịch/chuẩn hóa | 2.805 |
| Research đã xem nhưng chưa đạt ngưỡng tuyển chọn | 634 |
| Thiếu xác minh nguồn/locator/edition/bản dịch | 193 |
| Bị chặn quyền | 83 |
| Không đạt review biên tập | 23 |
| Bản trùng thua | 3 |

Nhóm này không phải backlog owner review. Provenance được giữ để có thể mở lại khi có nguồn, quyền hoặc nhu cầu nội dung mới.

## Cách review

Việc phân loại dùng toàn bộ bằng chứng đã có trong corpus và canonical pipeline:

1. identity và duplicate;
2. nguồn, locator, mức xác minh và quyền;
3. loại nội dung: trích dẫn trực tiếp, bản dịch, diễn giải nghiên cứu hay raw capture;
4. review AI trước đó, Selflo fit và story dependency;
5. trạng thái canonical Authoring/Release;
6. schema, semantic, tag, coverage và publisher gate cho các câu Release.

Quy tắc fail-closed được giữ nguyên: không đủ bằng chứng thì không Release. Việc có URL không tự động chứng minh quyền sử dụng; bản diễn giải không được giả làm nguyên văn.

## Giới hạn cần hiểu đúng

- `Hoàn thành 5.470` nghĩa là mọi dòng đã có quyết định cuối cho baseline P0, không có nghĩa 5.470 câu đều phù hợp để xuất bản.
- Authoring là tập owner có thể đọc và quyết định tiếp; Research/Raw không chen vào hàng này.
- Authoring package kỹ thuật hiện vẫn có thể chứa record canonical bị chặn để bảo toàn provenance. Sổ disposition là nguồn PM xác định **owner review queue**; không xóa canonical source chỉ để làm đẹp số đếm.
- Release 45 chưa được commit, push hoặc kiểm tra trên website công khai. Vì vậy phần phân loại corpus đã xong, còn deployment là việc phát hành riêng.

## Nghiệm thu

Owner có thể nghiệm thu bằng bốn kiểm tra:

1. `656 + 1.073 + 3.741 = 5.470`;
2. mở sample theo từng `final_disposition` trong report;
3. xem 656 quote trong Release 45 và kết quả gate;
4. yêu cầu chuyển bất kỳ quote cụ thể nào giữa Authoring và Research hoặc hạ khỏi Release nếu không đồng ý.
