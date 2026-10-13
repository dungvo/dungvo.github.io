# P0 Quote — Kết quả full scan fast lane 5.470 dòng

> Đây là checkpoint fast lane lịch sử. Kết luận toàn-corpus mới nhất nằm tại [`P0_FINAL_CLASSIFICATION_2026-10-13.vi.md`](P0_FINAL_CLASSIFICATION_2026-10-13.vi.md); 4.814 dòng ở đây không còn là nhóm “tạm bỏ qua”.

**Ngày hoàn tất:** 2026-10-13
**Baseline đã quét:** 5.470/5.470 dòng
**Authoring:** revision 83
**Release:** revision 45
**Reviewer vận hành:** `ai:codex`

## Kết quả cuối

| Kết quả | Số lượng |
|---|---:|
| Đã Release trước full scan | 343 |
| Candidate mới vượt bộ lọc chắc chắn | 313 |
| Candidate mới thực sự có trong Release 45 | 313/313 |
| **Tổng quote Release** | **656** |
| Tạm bỏ qua trong đợt này | 4.814 |
| **Tổng đối soát** | **5.470** |

Tỷ lệ Release theo toàn corpus là **11,99%**. Theo 1.844 quote canonical, tỷ lệ là **35,57%**.

## Cách full scan được thực hiện

Scanner đi qua đủ 5.470 dòng. Một candidate mới chỉ được chọn khi dữ liệu hiện có đồng thời chứng minh:

1. đã ở canonical Authoring và đã có AI editorial-fit pass;
2. mức xác minh nguồn cao, có `verification=A`;
3. là bản dịch/trích dẫn trực tiếp, không phải research paraphrase;
4. source là witness cổ rõ trên Wikisource Trung văn hoặc Latin;
5. không có story cần duyệt kèm;
6. knowledge dependency hiện đã đạt gate;
7. publisher schema, semantic, tag và coverage gate đều pass.

Thiếu bất kỳ bằng chứng nào thì dòng được tạm bỏ qua, đúng yêu cầu “không mất thời gian phân loại sâu trong đợt này”. Report máy đọc trước Release: [`reports/p0-fast-lane-full-scan.json`](reports/p0-fast-lane-full-scan.json).

## 313 candidate mới

- 265 câu từ `zh.wikisource.org`.
- 48 câu từ `la.wikisource.org`.
- Chủ yếu thuộc các văn bản cổ như *Đạo Đức Kinh*, *Trang Tử*, *Luận Ngữ* và các tác phẩm Latin của Seneca.
- Bản gốc cổ được ghi public domain; URL witness và attribution được giữ; bản Việt được ghi là bản dịch làm việc của Selflo.
- Các câu được thêm tag theo contract `selflo.content-tags.v1` và duyệt với reviewer thật `ai:codex`.

## Phần tạm bỏ qua

4.814 dòng không bị kết luận là “không tốt”. Chúng chỉ không đủ chắc để đi fast lane dựa trên bằng chứng hiện có. Không cần phân loại thêm ở phase này. Khi muốn mở lại, dùng report/source routing hiện có; không quét lại Q0–Q2.

## Trạng thái phát hành

Release 45 đã được tạo trong repo local và toàn bộ 313/313 candidate đã xuất hiện. Chưa tự động commit, push hoặc deploy lên website công khai.
