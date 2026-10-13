# PM-QUOTE-P0 — Kết quả Q1: identity và trùng lặp

**Kết luận:** Q1 hoàn thành ở mức phân loại an toàn. Không xóa dữ liệu nghiên cứu.

## Phát hiện

- Metadata cũ có 21 `exact duplicate cluster`, chứa 225 dòng.
- 19/21 cluster chứa nhiều văn bản khác nhau; một số cluster gom 20–38 quote không trùng nhau.
- Vì vậy trường legacy này không đủ tin cậy để tự động loại quote.
- So sánh văn bản tiếng Việt sau chuẩn hóa cơ bản chỉ tìm thấy 3 cụm trùng thật, gồm 6 dòng.
- Có 14 near-duplicate cluster với 163 dòng. Đây là các cụm cần phán đoán biên tập, không tự động loại.

## Ba cụm trùng thật và winner

| Nội dung rút gọn | Bản giữ ưu tiên | Bản giữ làm provenance |
|---|---|---|
| Hệ thống địa vị tạo nhiều phản ứng | `research.reaudit_day21_hamdanhloi` — Authoring | `research.reaudit.day21.hamdanhlợi` — excluded |
| Cưỡng làm/nắm quá chặt | `research.laozi.day2.ch29.034` — Release | `research.laozi.day3.ch64.063` — excluded |
| Thiếu đáng tin sinh ra không tin | `research.laozi.ch17.053` — Authoring | `research.laozi.day2.ch23.012` — excluded |

Matrix chỉ gắn `duplicate_hold` cho ba bản thua này. Các dòng trong cluster legacy sai được trả về trạng thái phù hợp với pipeline thay vì bị loại nhầm.

## Near duplicate

163 dòng near-duplicate được giữ nguyên. Owner/editor cần quyết định theo vai trò biên tập, nguồn, cách diễn đạt và độ phủ; giống chủ đề không đồng nghĩa trùng nội dung.

Danh sách máy đọc đầy đủ: `reports/q1-duplicate-clusters.json`.

## Giá trị mang lại

- Tránh loại nhầm hơn 200 quote vì metadata cluster sai.
- Có winner rõ cho ba trường hợp trùng thật.
- Giữ provenance mà không làm phình Release.
- Tách quyết định máy có thể làm an toàn khỏi quyết định biên tập cần con người.
