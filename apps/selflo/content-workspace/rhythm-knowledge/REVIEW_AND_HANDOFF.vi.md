# Rhythm Knowledge — multi-role review và handoff

**Trạng thái:** Authoring package complete; blocked from canonical/Release by contract + app conformance + owner acceptance  
**Ngày:** 2026-10-12

## 1. Review roles đã thực hiện

### Research reviewer

- Claim chính đều được bound bởi review/meta-analysis/methodological synthesis.
- Neuroscience bị loại khỏi main text.
- Không dùng một clinical intervention study để hứa treatment; behavioral experiment chỉ được chuyển thành logic self-observation hẹp.
- K3 giữ broaden-and-build ở mức theory/supporting, không dùng như universal mechanism.

### Epistemic/safety reviewer

- Mọi bài phân biệt observed fact, candidate mechanism và personal truth.
- Không bài nào suy thought, behavior, diagnosis, trait hoặc cause từ Rhythm signal.
- Structural conditions, health, power, safety và resources được đưa vào thân bài, không chỉ disclaimer cuối.
- Case 10 Health + Tired được map K4 với medical boundary, không map thành cognitive explanation mặc định.

### Product reviewer

- 33/33 scenario có primary article.
- Mỗi article có một learning job riêng.
- K1/K9 phục vụ cả trạng thái chưa đủ pattern nên user vẫn nhận được explanation mà không tạo pattern giả.
- Mapping candidate dùng typed signal/facts; scenario IDs chỉ nằm ở coverage audit.

### Editorial/Vietnamese reviewer

- Giọng đọc dùng `có thể`, `trong những ngày ghi nhận`, `đáng quan sát` ở đúng nơi.
- Tránh “não”, “suy nghĩ sai”, “chỉ cần”, “bạn đang overthinking”.
- Mỗi bài có short answer, mechanism, examples, misconception, self-check, limits, takeaway và visual spec.

### Adversarial reviewer

Các cách hiểu sai đã thử:

- “Selflo biết nguyên nhân” → bị chặn bởi bridge và forbidden claims.
- “Mọi emotion do cognition” → K2 thêm body/context/history/resources và reciprocal loop.
- “Ngày trống là ngày ổn” → K1/K9 phủ định trực tiếp.
- “Positive anchor là prescription” → K3 từ chối nghĩa vụ lặp lại.
- “Lo lặp lại là rumination/diagnosis” → K7 giữ candidate-only.
- “Dịu lại là recovery chắc chắn” → K5/K6 giữ sequence vs cause.
- “Hai field trái nhau là lỗi” → K8 giữ cả hai và quyền user xác nhận.

## 2. Rubric

Điểm 0–3; đây là self-review, không thay owner acceptance.

| Article | Science | Epistemic | Mechanism | Transfer | Safety | Vietnamese | Visual | Product | Sources | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| K1 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 27 |
| K2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 27 |
| K3 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 3 | 25 |
| K4 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 | 26 |
| K5 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 27 |
| K6 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 | 26 |
| K7 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 27 |
| K8 | 3 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 26 |
| K9 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 27 |

Không tiêu chí nào dưới 2; ba gate bắt buộc Science/Epistemic/Safety đều 3. K3 và K8 cần visual Reader review để nâng visual/mechanism từ 2 lên 3, nhưng vượt gate 24/27.

## 3. Validation có thể chạy ở workspace

- Markdown inventory: 9/9 article files.
- Coverage inventory: 33/33 rows.
- Mapping candidate: JSON parse pass, 9 unique `article_id`.
- Forbidden-claim audit: không có wording chẩn đoán trực tiếp trong body.
- Release mutation: none.

## 4. Vì sao chưa materialize canonical payload

Knowledge article identity và mapping semantics chưa có active contract. Việc thêm payload vào `perspective-library/source/vi/` bây giờ sẽ tự quyết wire format trước app conformance, trái shared-contract policy. Vì vậy package dừng đúng boundary ở full Authoring drafts + mapping candidate.

## 5. Handoff cho cutover

1. Owner nghiệm thu package nội dung này.
2. Promote proposal thành contract candidate, chọn entity/projection và schema.
3. App chấp nhận/decode/render mapping + Knowledge destination.
4. Materialize chín bài vào canonical Authoring source theo contract đã chốt.
5. Generate Authoring Preview; owner nghiệm thu typography, diagrams, sources và navigation.
6. Chỉ sau đó promote Release riêng và chạy native 33-case journey.

Không bước nào được dùng để bulk-approve rights/review hoặc sửa generated output bằng tay.

