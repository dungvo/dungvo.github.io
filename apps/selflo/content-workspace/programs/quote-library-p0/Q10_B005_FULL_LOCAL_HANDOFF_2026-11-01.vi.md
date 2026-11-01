# B005 — Hoàn tất review toàn đợt dưới local

**Ngày hoàn tất:** 2026-11-01  
**Trạng thái:** Review đủ 149/149 dòng; chưa đóng mốc Release của batch. Chưa commit/push.

## Kết quả lượt 116 dòng còn lại

| Kết quả | Số dòng |
|---|---:|
| Đạt sau biên tập, đã có trong Authoring 101 | 50 |
| Không nhận, có lý do và chặn đề xuất lại | 66 |
| Chưa review | 0 |

Trong 66 dòng không nhận, có một quyết định `round1_not_pass` cũ của `research.laozi.ch20.061` được bảo toàn và bổ sung closure. Assignment cũ ghi not_started không có quyền mở lại quyết định đã đóng. Các câu nguồn tốt nhưng bị cắt khỏi truyện hoặc cần bối cảnh vẫn được giữ nguyên research/provenance, không sửa thành câu khác để tăng số đạt.

50 câu đạt đều có bản trước/sau, đối chiếu passage, attribution và quyền. Một câu Roetzel dùng CC BY 4.0 với credit/URL/license/ghi rõ diễn ý; 49 câu còn lại dùng nguyên tác cổ hoặc bản Legge đã kiểm tra. Đã sửa locator sai chương của một số câu Liệt Tử. Không sửa story, Knowledge hoặc contract.

## Tổng B005 (149 dòng)

- 4 câu đã Release từ checkpoint trước.
- 93 dòng không nhận trong chương trình review.
- 2 owner-closed mang sang.
- 50 câu AI-approved đang chờ nghiệm thu/phát hành.

**149 = 4 + 93 + 2 + 50.** Pha review đã hoàn tất; pha khép kín mới có **99/149**, chưa cộng 50 câu vào released.

## Tiến độ corpus và sản phẩm

| Chỉ số | Hiện tại |
|---|---:|
| Corpus cố định | 5.471 dòng |
| Đã chốt | 769 (14,06%) = 380 released + 389 not_accepted |
| Còn lại | 4.702, trong đó 50 câu B005 đã đạt và chờ Release |
| Authoring local | revision 101; 1.856 quote / 68 story |
| Release hiện tại | revision 61; 385 quote / 22 story |
| Matrix động | 5.476 dòng; gồm 5 quote bổ sung ngoài baseline |

Nếu 50 câu được phát hành và public xác nhận, corpus mới đạt 819/5.471; đây chỉ là dự kiến, chưa phải completed. Không nhầm 435 quote của bản ứng viên tạm với 385 quote đang Release.

## Kiểm tra

- Publisher Authoring: schema, semantic, reference và coverage đạt; revision 101.
- **95/95 tests đạt** (`python -m unittest discover -s scripts -p 'test_*.py'`).
- Kiểm định Release trên bản sao tạm: candidate có 435 quote, thêm đúng 50 ID; giữ nguyên đầy đủ 385 quote cũ và 22 story descriptor; checksum/byte count tất cả payload đạt. Bản sao đã bỏ; không cài candidate vào checkout.
- 66 quyết định không nhận đều bị eligibility chặn và Matrix hiển thị trạng thái đóng; 50 quote đạt trong Authoring khớp bản review.
- Source chỉ thay đúng 50 quote so với HEAD; các quote khác giữ nguyên. Dấu kiểm text/provenance đã cập nhật có lý do, đồng thời sửa số count cũ 1.854 về số source thực tế đã là 1.856 trước lượt này.
- Projection có đúng 50 issue `accepted_not_in_release`: trạng thái chờ phát hành có chủ đích; không có issue khác.
- Release checkout giữ nguyên revision 61; không commit, push, merge hoặc deploy.

## Evidence

- `reports/q10-b005-full-local-review-2026-10-31.json`: 116 review, passage, nguồn và bản trước/sau.
- `reports/q10-b005-ready-local-2026-10-31.json`: đúng 50 ID sẵn sàng cho bước Release.
- `reports/q10-b005-release-candidate-gate-2026-11-01.json`: bằng chứng kiểm định bản ứng viên tạm.
- `reports/quote-closure-progress.json`: chỉ tính completed đúng gate.

## Quy ước tiếp tục đã được owner chốt

Mỗi lượt xử lý trọn 100–200 quote theo assignment hiện có, tự đi hết nghiên cứu, review, biên tập và kiểm định local. Không chia thành các lượt 10–13 dòng rồi hỏi tiếp. Chỉ dừng khi thiếu quyết định bắt buộc theo gate; GitHub write vẫn chờ lệnh trực tiếp của owner.

## Đúng một bước tiếp theo

Chờ lệnh owner cho bước nghiệm thu/phát hành và đưa kết quả B005 lên GitHub; chỉ đóng batch sau khi Release public được kiểm chứng. Chưa mở B006.
